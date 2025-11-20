"""
Configuration management using Pydantic.
"""

import os
from typing import List, Optional, Dict, Any
from pathlib import Path
import yaml
from pydantic import BaseModel, Field, validator
from functools import lru_cache


class DatabaseConfig(BaseModel):
    url: str = "sqlite:///scraper.db"
    echo: bool = False
    pool_size: int = 10


class ViewportConfig(BaseModel):
    width: int = 1920
    height: int = 1080


class BrowserConfig(BaseModel):
    headless: bool = True
    timeout: int = 30000
    viewport: ViewportConfig = Field(default_factory=ViewportConfig)
    user_agent_rotation: bool = True
    stealth_mode: bool = True


class ProxyConfig(BaseModel):
    enabled: bool = False
    file: str = "proxies.txt"
    rotation: bool = True
    timeout: int = 10
    health_check_interval: int = 300


class DelayConfig(BaseModel):
    min: float = 1.0
    max: float = 3.0


class RateLimitingConfig(BaseModel):
    enabled: bool = True
    default_rate: int = 10
    burst_limit: int = 5
    delay: DelayConfig = Field(default_factory=DelayConfig)
    respect_robots_txt: bool = True


class ScrapingConfig(BaseModel):
    max_retries: int = 3
    retry_delay: int = 5
    timeout: int = 30
    wait_for_selector_timeout: int = 10


class StorageConfig(BaseModel):
    data_dir: str = "./data"
    export_formats: List[str] = ["json", "csv", "excel"]
    auto_export: bool = True


class LoggingConfig(BaseModel):
    level: str = "INFO"
    file: str = "scraper.log"
    max_size: str = "10MB"
    backup_count: int = 5


class SchedulerConfig(BaseModel):
    enabled: bool = True
    timezone: str = "UTC"
    max_workers: int = 4


class Settings(BaseModel):
    database: DatabaseConfig = Field(default_factory=DatabaseConfig)
    browser: BrowserConfig = Field(default_factory=BrowserConfig)
    proxy: ProxyConfig = Field(default_factory=ProxyConfig)
    rate_limiting: RateLimitingConfig = Field(default_factory=RateLimitingConfig)
    scraping: ScrapingConfig = Field(default_factory=ScrapingConfig)
    storage: StorageConfig = Field(default_factory=StorageConfig)
    logging: LoggingConfig = Field(default_factory=LoggingConfig)
    scheduler: SchedulerConfig = Field(default_factory=SchedulerConfig)

    @validator('database')
    def validate_database_url(cls, v):
        if not v.url.startswith(('sqlite:///', 'postgresql://', 'mysql://')):
            raise ValueError('Invalid database URL format')
        return v

    @validator('export_formats')
    def validate_export_formats(cls, v):
        valid_formats = ['json', 'csv', 'excel', 'xml']
        for fmt in v:
            if fmt not in valid_formats:
                raise ValueError(f'Invalid export format: {fmt}')
        return v

    @classmethod
    def load_from_file(cls, config_path: str = "config/default.yaml") -> 'Settings':
        """Load configuration from YAML file."""
        config_file = Path(config_path)
        if not config_file.exists():
            return cls()
        
        with open(config_file, 'r', encoding='utf-8') as f:
            config_data = yaml.safe_load(f)
        
        return cls(**config_data)

    @classmethod
    def load_from_env(cls) -> 'Settings':
        """Load configuration from environment variables."""
        return cls(
            database=DatabaseConfig(
                url=os.getenv('DATABASE_URL', 'sqlite:///scraper.db'),
                echo=os.getenv('DATABASE_ECHO', 'false').lower() == 'true',
                pool_size=int(os.getenv('DATABASE_POOL_SIZE', '10'))
            ),
            browser=BrowserConfig(
                headless=os.getenv('HEADLESS', 'true').lower() == 'true',
                timeout=int(os.getenv('BROWSER_TIMEOUT', '30000')),
                viewport=ViewportConfig(
                    width=int(os.getenv('VIEWPORT_WIDTH', '1920')),
                    height=int(os.getenv('VIEWPORT_HEIGHT', '1080'))
                ),
                user_agent_rotation=os.getenv('USER_AGENT_ROTATION', 'true').lower() == 'true',
                stealth_mode=os.getenv('STEALTH_MODE', 'true').lower() == 'true'
            ),
            proxy=ProxyConfig(
                enabled=os.getenv('PROXY_ENABLED', 'false').lower() == 'true',
                file=os.getenv('PROXY_FILE', 'proxies.txt'),
                rotation=os.getenv('PROXY_ROTATION_ENABLED', 'true').lower() == 'true',
                timeout=int(os.getenv('PROXY_TIMEOUT', '10')),
                health_check_interval=int(os.getenv('PROXY_HEALTH_CHECK_INTERVAL', '300'))
            ),
            rate_limiting=RateLimitingConfig(
                enabled=os.getenv('RATE_LIMITING_ENABLED', 'true').lower() == 'true',
                default_rate=int(os.getenv('DEFAULT_RATE_LIMIT', '10')),
                burst_limit=int(os.getenv('BURST_LIMIT', '5')),
                delay=DelayConfig(
                    min=float(os.getenv('DELAY_MIN', '1.0')),
                    max=float(os.getenv('DELAY_MAX', '3.0'))
                ),
                respect_robots_txt=os.getenv('RESPECT_ROBOTS_TXT', 'true').lower() == 'true'
            ),
            scraping=ScrapingConfig(
                max_retries=int(os.getenv('MAX_RETRIES', '3')),
                retry_delay=int(os.getenv('RETRY_DELAY', '5')),
                timeout=int(os.getenv('SCRAPING_TIMEOUT', '30')),
                wait_for_selector_timeout=int(os.getenv('WAIT_FOR_SELECTOR_TIMEOUT', '10'))
            ),
            storage=StorageConfig(
                data_dir=os.getenv('DATA_DIR', './data'),
                export_formats=os.getenv('EXPORT_FORMATS', 'json,csv,excel').split(','),
                auto_export=os.getenv('AUTO_EXPORT', 'true').lower() == 'true'
            ),
            logging=LoggingConfig(
                level=os.getenv('LOG_LEVEL', 'INFO'),
                file=os.getenv('LOG_FILE', 'scraper.log'),
                max_size=os.getenv('LOG_MAX_SIZE', '10MB'),
                backup_count=int(os.getenv('LOG_BACKUP_COUNT', '5'))
            ),
            scheduler=SchedulerConfig(
                enabled=os.getenv('SCHEDULER_ENABLED', 'true').lower() == 'true',
                timezone=os.getenv('SCHEDULER_TIMEZONE', 'UTC'),
                max_workers=int(os.getenv('SCHEDULER_MAX_WORKERS', '4'))
            )
        )


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    # Try to load from environment first, then fall back to file
    try:
        return Settings.load_from_env()
    except Exception:
        return Settings.load_from_file()







