"""
Database management for storing scraped data.
"""

import json
from datetime import datetime
from typing import Dict, List, Optional, Any
from sqlalchemy import create_engine, Column, String, Text, DateTime, Integer, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config.settings import get_settings
from utils.logger import get_logger


Base = declarative_base()


class ScrapedData(Base):
    """Model for storing scraped data."""
    __tablename__ = 'scraped_data'
    
    id = Column(String, primary_key=True)
    scraper_name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    data = Column(JSON, nullable=False)
    scraped_at = Column(DateTime, default=datetime.utcnow)
    metadata = Column(JSON)


class DatabaseManager:
    """Manages database operations for scraped data."""
    
    def __init__(self):
        self.settings = get_settings()
        self.logger = get_logger(__name__)
        self.engine = None
        self.Session = None
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
    
    def save_data(
        self,
        scraper_name: str,
        url: str,
        data: List[Dict[str, Any]],
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Save scraped data to database."""
        try:
            import uuid
            
            data_id = str(uuid.uuid4())
            
            session = self.Session()
            scraped_data = ScrapedData(
                id=data_id,
                scraper_name=scraper_name,
                url=url,
                data=data,
                metadata=metadata or {}
            )
            
            session.add(scraped_data)
            session.commit()
            session.close()
            
            self.logger.info(f"Saved {len(data)} records to database")
            return data_id
            
        except Exception as e:
            self.logger.error(f"Failed to save data: {e}")
            raise
    
    def get_data(
        self,
        scraper_name: Optional[str] = None,
        url: Optional[str] = None,
        limit: Optional[int] = None,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Retrieve scraped data from database."""
        try:
            session = self.Session()
            query = session.query(ScrapedData)
            
            if scraper_name:
                query = query.filter_by(scraper_name=scraper_name)
            
            if url:
                query = query.filter_by(url=url)
            
            query = query.order_by(ScrapedData.scraped_at.desc())
            
            if offset:
                query = query.offset(offset)
            
            if limit:
                query = query.limit(limit)
            
            results = query.all()
            session.close()
            
            return [
                {
                    'id': result.id,
                    'scraper_name': result.scraper_name,
                    'url': result.url,
                    'data': result.data,
                    'scraped_at': result.scraped_at.isoformat(),
                    'metadata': result.metadata
                }
                for result in results
            ]
            
        except Exception as e:
            self.logger.error(f"Failed to get data: {e}")
            return []
    
    def get_data_by_id(self, data_id: str) -> Optional[Dict[str, Any]]:
        """Get specific data record by ID."""
        try:
            session = self.Session()
            result = session.query(ScrapedData).filter_by(id=data_id).first()
            session.close()
            
            if result:
                return {
                    'id': result.id,
                    'scraper_name': result.scraper_name,
                    'url': result.url,
                    'data': result.data,
                    'scraped_at': result.scraped_at.isoformat(),
                    'metadata': result.metadata
                }
            return None
            
        except Exception as e:
            self.logger.error(f"Failed to get data by ID {data_id}: {e}")
            return None
    
    def delete_data(self, data_id: str) -> bool:
        """Delete data record by ID."""
        try:
            session = self.Session()
            result = session.query(ScrapedData).filter_by(id=data_id).first()
            
            if result:
                session.delete(result)
                session.commit()
                session.close()
                self.logger.info(f"Deleted data record {data_id}")
                return True
            else:
                session.close()
                self.logger.warning(f"Data record {data_id} not found")
                return False
                
        except Exception as e:
            self.logger.error(f"Failed to delete data {data_id}: {e}")
            return False
    
    def get_stats(self) -> Dict[str, Any]:
        """Get database statistics."""
        try:
            session = self.Session()
            
            total_records = session.query(ScrapedData).count()
            
            # Count by scraper
            scraper_counts = {}
            scrapers = session.query(ScrapedData.scraper_name).distinct().all()
            for scraper in scrapers:
                count = session.query(ScrapedData).filter_by(scraper_name=scraper[0]).count()
                scraper_counts[scraper[0]] = count
            
            # Latest record
            latest = session.query(ScrapedData).order_by(ScrapedData.scraped_at.desc()).first()
            latest_time = latest.scraped_at.isoformat() if latest else None
            
            session.close()
            
            return {
                'total_records': total_records,
                'scraper_counts': scraper_counts,
                'latest_scrape': latest_time
            }
            
        except Exception as e:
            self.logger.error(f"Failed to get database stats: {e}")
            return {}
    
    def cleanup_old_data(self, days: int = 30) -> int:
        """Remove old data records."""
        try:
            from datetime import timedelta
            
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            session = self.Session()
            deleted_count = session.query(ScrapedData).filter(
                ScrapedData.scraped_at < cutoff_date
            ).delete()
            session.commit()
            session.close()
            
            self.logger.info(f"Cleaned up {deleted_count} old data records")
            return deleted_count
            
        except Exception as e:
            self.logger.error(f"Failed to cleanup old data: {e}")
            return 0







