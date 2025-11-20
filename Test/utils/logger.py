"""
Logging configuration and utilities.
"""

import logging
import logging.handlers
from pathlib import Path
from typing import Optional
from config.settings import get_settings


def setup_logger(
    name: str = "scraper",
    level: Optional[str] = None,
    log_file: Optional[str] = None
) -> logging.Logger:
    """Set up logger with file and console handlers."""
    settings = get_settings()
    
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level or settings.logging.level))
    
    # Clear existing handlers
    logger.handlers.clear()
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler with rotation
    if log_file or settings.logging.file:
        log_path = Path(log_file or settings.logging.file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        file_handler = logging.handlers.RotatingFileHandler(
            log_path,
            maxBytes=10 * 1024 * 1024,  # 10MB
            backupCount=settings.logging.backup_count
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger


def get_logger(name: str = "scraper") -> logging.Logger:
    """Get logger instance."""
    return logging.getLogger(name)







