"""
Scheduler for automated recurring scraping tasks.
"""

import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Callable
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.date import DateTrigger
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.executors.asyncio import AsyncIOExecutor
from config.settings import get_settings
from utils.logger import get_logger
from .queue import JobQueue


class ScrapingScheduler:
    """Scheduler for automated scraping tasks."""
    
    def __init__(self, job_queue: JobQueue):
        self.settings = get_settings()
        self.logger = get_logger(__name__)
        self.job_queue = job_queue
        self.scheduler = None
        self.is_running = False
        
    async def start(self):
        """Start the scheduler."""
        if self.is_running:
            self.logger.warning("Scheduler is already running")
            return
        
        try:
            # Configure job stores
            jobstores = {
                'default': SQLAlchemyJobStore(url=self.settings.database.url)
            }
            
            # Configure executors
            executors = {
                'default': AsyncIOExecutor()
            }
            
            # Configure job defaults
            job_defaults = {
                'coalesce': True,
                'max_instances': 1,
                'misfire_grace_time': 30
            }
            
            # Create scheduler
            self.scheduler = AsyncIOScheduler(
                jobstores=jobstores,
                executors=executors,
                job_defaults=job_defaults,
                timezone=self.settings.scheduler.timezone
            )
            
            # Start scheduler
            self.scheduler.start()
            self.is_running = True
            
            self.logger.info("Scheduler started successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to start scheduler: {e}")
            raise
    
    async def stop(self):
        """Stop the scheduler."""
        if not self.is_running:
            return
        
        try:
            if self.scheduler:
                self.scheduler.shutdown(wait=True)
            
            self.is_running = False
            self.logger.info("Scheduler stopped")
            
        except Exception as e:
            self.logger.error(f"Error stopping scheduler: {e}")
    
    def add_cron_job(
        self,
        job_id: str,
        name: str,
        url: str,
        scraper_class: str,
        cron_expression: str,
        priority: int = 0,
        max_retries: int = 3,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Add a cron-based scheduled job."""
        try:
            # Parse cron expression (minute hour day month day_of_week)
            parts = cron_expression.split()
            if len(parts) != 5:
                raise ValueError("Cron expression must have 5 parts: minute hour day month day_of_week")
            
            minute, hour, day, month, day_of_week = parts
            
            # Create cron trigger
            trigger = CronTrigger(
                minute=minute,
                hour=hour,
                day=day,
                month=month,
                day_of_week=day_of_week
            )
            
            # Add job to scheduler
            self.scheduler.add_job(
                func=self._execute_scraping_job,
                trigger=trigger,
                id=job_id,
                name=name,
                args=[name, url, scraper_class, priority, max_retries, metadata],
                replace_existing=True
            )
            
            self.logger.info(f"Added cron job {job_id}: {name} ({cron_expression})")
            return job_id
            
        except Exception as e:
            self.logger.error(f"Failed to add cron job: {e}")
            raise
    
    def add_interval_job(
        self,
        job_id: str,
        name: str,
        url: str,
        scraper_class: str,
        interval_minutes: int,
        priority: int = 0,
        max_retries: int = 3,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Add an interval-based scheduled job."""
        try:
            # Create interval trigger
            trigger = IntervalTrigger(minutes=interval_minutes)
            
            # Add job to scheduler
            self.scheduler.add_job(
                func=self._execute_scraping_job,
                trigger=trigger,
                id=job_id,
                name=name,
                args=[name, url, scraper_class, priority, max_retries, metadata],
                replace_existing=True
            )
            
            self.logger.info(f"Added interval job {job_id}: {name} (every {interval_minutes} minutes)")
            return job_id
            
        except Exception as e:
            self.logger.error(f"Failed to add interval job: {e}")
            raise
    
    def add_date_job(
        self,
        job_id: str,
        name: str,
        url: str,
        scraper_class: str,
        run_date: datetime,
        priority: int = 0,
        max_retries: int = 3,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Add a one-time scheduled job."""
        try:
            # Create date trigger
            trigger = DateTrigger(run_date=run_date)
            
            # Add job to scheduler
            self.scheduler.add_job(
                func=self._execute_scraping_job,
                trigger=trigger,
                id=job_id,
                name=name,
                args=[name, url, scraper_class, priority, max_retries, metadata],
                replace_existing=True
            )
            
            self.logger.info(f"Added date job {job_id}: {name} (runs at {run_date})")
            return job_id
            
        except Exception as e:
            self.logger.error(f"Failed to add date job: {e}")
            raise
    
    def remove_job(self, job_id: str) -> bool:
        """Remove a scheduled job."""
        try:
            self.scheduler.remove_job(job_id)
            self.logger.info(f"Removed job {job_id}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to remove job {job_id}: {e}")
            return False
    
    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get information about a scheduled job."""
        try:
            job = self.scheduler.get_job(job_id)
            if job:
                return {
                    'id': job.id,
                    'name': job.name,
                    'next_run_time': job.next_run_time,
                    'trigger': str(job.trigger)
                }
            return None
            
        except Exception as e:
            self.logger.error(f"Failed to get job {job_id}: {e}")
            return None
    
    def get_all_jobs(self) -> List[Dict[str, Any]]:
        """Get information about all scheduled jobs."""
        try:
            jobs = []
            for job in self.scheduler.get_jobs():
                jobs.append({
                    'id': job.id,
                    'name': job.name,
                    'next_run_time': job.next_run_time,
                    'trigger': str(job.trigger)
                })
            return jobs
            
        except Exception as e:
            self.logger.error(f"Failed to get jobs: {e}")
            return []
    
    def pause_job(self, job_id: str) -> bool:
        """Pause a scheduled job."""
        try:
            self.scheduler.pause_job(job_id)
            self.logger.info(f"Paused job {job_id}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to pause job {job_id}: {e}")
            return False
    
    def resume_job(self, job_id: str) -> bool:
        """Resume a paused job."""
        try:
            self.scheduler.resume_job(job_id)
            self.logger.info(f"Resumed job {job_id}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to resume job {job_id}: {e}")
            return False
    
    def modify_job(
        self,
        job_id: str,
        **changes
    ) -> bool:
        """Modify a scheduled job."""
        try:
            self.scheduler.modify_job(job_id, **changes)
            self.logger.info(f"Modified job {job_id}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to modify job {job_id}: {e}")
            return False
    
    async def _execute_scraping_job(
        self,
        name: str,
        url: str,
        scraper_class: str,
        priority: int,
        max_retries: int,
        metadata: Optional[Dict[str, Any]]
    ):
        """Execute a scraping job (called by scheduler)."""
        try:
            self.logger.info(f"Executing scheduled job: {name}")
            
            # Add job to queue
            job_id = self.job_queue.add_job(
                name=name,
                url=url,
                scraper_class=scraper_class,
                priority=priority,
                max_retries=max_retries,
                metadata=metadata
            )
            
            self.logger.info(f"Scheduled job {name} added to queue as {job_id}")
            
        except Exception as e:
            self.logger.error(f"Failed to execute scheduled job {name}: {e}")
    
    def get_scheduler_stats(self) -> Dict[str, Any]:
        """Get scheduler statistics."""
        try:
            jobs = self.get_all_jobs()
            
            return {
                'total_jobs': len(jobs),
                'running': self.is_running,
                'next_run_times': [
                    {
                        'job_id': job['id'],
                        'job_name': job['name'],
                        'next_run': job['next_run_time'].isoformat() if job['next_run_time'] else None
                    }
                    for job in jobs
                ]
            }
            
        except Exception as e:
            self.logger.error(f"Failed to get scheduler stats: {e}")
            return {}
    
    async def __aenter__(self):
        await self.start()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.stop()







