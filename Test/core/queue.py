"""
Job queue system with persistence and worker management.
"""

import asyncio
import json
import uuid
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, asdict
from pathlib import Path
from sqlalchemy import create_engine, Column, String, Text, DateTime, Integer, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config.settings import get_settings
from utils.logger import get_logger
from utils.helpers import retry_async


class JobStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class Job:
    """Job data structure."""
    id: str
    name: str
    url: str
    scraper_class: str
    status: JobStatus
    priority: int = 0
    created_at: datetime = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    retry_count: int = 0
    max_retries: int = 3
    error_message: Optional[str] = None
    result: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.utcnow()


Base = declarative_base()


class JobModel(Base):
    """SQLAlchemy model for job persistence."""
    __tablename__ = 'jobs'
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    scraper_class = Column(String, nullable=False)
    status = Column(String, nullable=False)
    priority = Column(Integer, default=0)
    created_at = Column(DateTime, nullable=False)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    error_message = Column(Text)
    result = Column(Text)  # JSON string
    metadata = Column(Text)  # JSON string


class JobQueue:
    """Job queue with persistence and worker management."""
    
    def __init__(self):
        self.settings = get_settings()
        self.logger = get_logger(__name__)
        self.engine = None
        self.Session = None
        self.workers = []
        self.is_running = False
        self._setup_database()
    
    def _setup_database(self):
        """Setup database connection and create tables."""
        try:
            self.engine = create_engine(
                self.settings.database.url,
                echo=self.settings.database.echo,
                pool_size=self.settings.database.pool_size
            )
            self.Session = sessionmaker(bind=self.engine)
            
            # Create tables
            Base.metadata.create_all(self.engine)
            
            self.logger.info("Database setup completed")
            
        except Exception as e:
            self.logger.error(f"Failed to setup database: {e}")
            raise
    
    def add_job(
        self,
        name: str,
        url: str,
        scraper_class: str,
        priority: int = 0,
        max_retries: int = 3,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Add a new job to the queue."""
        job_id = str(uuid.uuid4())
        
        job = Job(
            id=job_id,
            name=name,
            url=url,
            scraper_class=scraper_class,
            status=JobStatus.PENDING,
            priority=priority,
            max_retries=max_retries,
            metadata=metadata or {}
        )
        
        try:
            session = self.Session()
            job_model = JobModel(**self._job_to_dict(job))
            session.add(job_model)
            session.commit()
            session.close()
            
            self.logger.info(f"Added job {job_id}: {name}")
            return job_id
            
        except Exception as e:
            self.logger.error(f"Failed to add job: {e}")
            raise
    
    def get_job(self, job_id: str) -> Optional[Job]:
        """Get job by ID."""
        try:
            session = self.Session()
            job_model = session.query(JobModel).filter_by(id=job_id).first()
            session.close()
            
            if job_model:
                return self._model_to_job(job_model)
            return None
            
        except Exception as e:
            self.logger.error(f"Failed to get job {job_id}: {e}")
            return None
    
    def get_pending_jobs(self, limit: int = 10) -> List[Job]:
        """Get pending jobs ordered by priority."""
        try:
            session = self.Session()
            job_models = session.query(JobModel).filter_by(
                status=JobStatus.PENDING.value
            ).order_by(
                JobModel.priority.desc(),
                JobModel.created_at.asc()
            ).limit(limit).all()
            session.close()
            
            return [self._model_to_job(model) for model in job_models]
            
        except Exception as e:
            self.logger.error(f"Failed to get pending jobs: {e}")
            return []
    
    def update_job_status(
        self,
        job_id: str,
        status: JobStatus,
        error_message: Optional[str] = None,
        result: Optional[Dict[str, Any]] = None
    ):
        """Update job status and related fields."""
        try:
            session = self.Session()
            job_model = session.query(JobModel).filter_by(id=job_id).first()
            
            if job_model:
                job_model.status = status.value
                
                if status == JobStatus.RUNNING:
                    job_model.started_at = datetime.utcnow()
                elif status in [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED]:
                    job_model.completed_at = datetime.utcnow()
                
                if error_message:
                    job_model.error_message = error_message
                
                if result:
                    job_model.result = json.dumps(result)
                
                session.commit()
            
            session.close()
            
        except Exception as e:
            self.logger.error(f"Failed to update job {job_id}: {e}")
    
    def increment_retry_count(self, job_id: str):
        """Increment retry count for a job."""
        try:
            session = self.Session()
            job_model = session.query(JobModel).filter_by(id=job_id).first()
            
            if job_model:
                job_model.retry_count += 1
                job_model.status = JobStatus.PENDING.value
                session.commit()
            
            session.close()
            
        except Exception as e:
            self.logger.error(f"Failed to increment retry count for job {job_id}: {e}")
    
    def get_job_stats(self) -> Dict[str, int]:
        """Get job statistics."""
        try:
            session = self.Session()
            
            stats = {}
            for status in JobStatus:
                count = session.query(JobModel).filter_by(status=status.value).count()
                stats[status.value] = count
            
            session.close()
            return stats
            
        except Exception as e:
            self.logger.error(f"Failed to get job stats: {e}")
            return {}
    
    def cleanup_old_jobs(self, days: int = 30):
        """Remove old completed/failed jobs."""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            session = self.Session()
            deleted_count = session.query(JobModel).filter(
                JobModel.completed_at < cutoff_date,
                JobModel.status.in_([JobStatus.COMPLETED.value, JobStatus.FAILED.value])
            ).delete()
            session.commit()
            session.close()
            
            self.logger.info(f"Cleaned up {deleted_count} old jobs")
            
        except Exception as e:
            self.logger.error(f"Failed to cleanup old jobs: {e}")
    
    async def start_workers(self, worker_count: int = 4, scraper_factory: Callable = None):
        """Start worker processes to process jobs."""
        if self.is_running:
            self.logger.warning("Workers are already running")
            return
        
        self.is_running = True
        self.logger.info(f"Starting {worker_count} workers")
        
        # Create worker tasks
        for i in range(worker_count):
            worker = asyncio.create_task(
                self._worker_loop(f"worker-{i}", scraper_factory)
            )
            self.workers.append(worker)
        
        # Wait for all workers
        await asyncio.gather(*self.workers, return_exceptions=True)
    
    async def stop_workers(self):
        """Stop all worker processes."""
        if not self.is_running:
            return
        
        self.is_running = False
        self.logger.info("Stopping workers...")
        
        # Cancel all worker tasks
        for worker in self.workers:
            worker.cancel()
        
        # Wait for workers to finish
        await asyncio.gather(*self.workers, return_exceptions=True)
        self.workers.clear()
        
        self.logger.info("Workers stopped")
    
    async def _worker_loop(self, worker_name: str, scraper_factory: Callable):
        """Worker loop to process jobs."""
        self.logger.info(f"Worker {worker_name} started")
        
        while self.is_running:
            try:
                # Get pending jobs
                jobs = self.get_pending_jobs(limit=1)
                
                if not jobs:
                    await asyncio.sleep(1)  # Wait for new jobs
                    continue
                
                job = jobs[0]
                await self._process_job(job, worker_name, scraper_factory)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                self.logger.error(f"Worker {worker_name} error: {e}")
                await asyncio.sleep(5)  # Wait before retrying
        
        self.logger.info(f"Worker {worker_name} stopped")
    
    async def _process_job(self, job: Job, worker_name: str, scraper_factory: Callable):
        """Process a single job."""
        self.logger.info(f"Worker {worker_name} processing job {job.id}: {job.name}")
        
        # Update job status to running
        self.update_job_status(job.id, JobStatus.RUNNING)
        
        try:
            # Create scraper instance
            if scraper_factory:
                scraper = scraper_factory(job.scraper_class)
            else:
                # Default scraper creation
                scraper = self._create_scraper(job.scraper_class)
            
            # Run scraper
            async with scraper:
                result = await scraper.run(job.url)
            
            # Update job as completed
            self.update_job_status(job.id, JobStatus.COMPLETED, result=result)
            self.logger.info(f"Job {job.id} completed successfully")
            
        except Exception as e:
            self.logger.error(f"Job {job.id} failed: {e}")
            
            # Check if we should retry
            if job.retry_count < job.max_retries:
                self.increment_retry_count(job.id)
                self.logger.info(f"Job {job.id} will be retried ({job.retry_count + 1}/{job.max_retries})")
            else:
                self.update_job_status(job.id, JobStatus.FAILED, error_message=str(e))
                self.logger.error(f"Job {job.id} failed permanently after {job.max_retries} retries")
    
    def _create_scraper(self, scraper_class: str):
        """Create scraper instance by class name."""
        # This would need to be implemented based on your scraper registry
        # For now, return a placeholder
        raise NotImplementedError("Scraper factory not implemented")
    
    def _job_to_dict(self, job: Job) -> Dict[str, Any]:
        """Convert Job to dictionary for database storage."""
        data = asdict(job)
        data['status'] = job.status.value
        data['result'] = json.dumps(job.result) if job.result else None
        data['metadata'] = json.dumps(job.metadata) if job.metadata else None
        return data
    
    def _model_to_job(self, model: JobModel) -> Job:
        """Convert JobModel to Job."""
        return Job(
            id=model.id,
            name=model.name,
            url=model.url,
            scraper_class=model.scraper_class,
            status=JobStatus(model.status),
            priority=model.priority,
            created_at=model.created_at,
            started_at=model.started_at,
            completed_at=model.completed_at,
            retry_count=model.retry_count,
            max_retries=model.max_retries,
            error_message=model.error_message,
            result=json.loads(model.result) if model.result else None,
            metadata=json.loads(model.metadata) if model.metadata else None
        )
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.stop_workers()







