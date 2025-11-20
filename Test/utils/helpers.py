"""
Utility functions and helpers.
"""

import re
import asyncio
import random
from typing import Any, Callable, Optional, Union
from urllib.parse import urlparse
import aiohttp


def extract_domain(url: str) -> str:
    """Extract domain from URL."""
    try:
        parsed = urlparse(url)
        return parsed.netloc.lower()
    except Exception:
        return ""


def clean_text(text: str) -> str:
    """Clean and normalize text content."""
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove control characters
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
    
    return text


async def retry_async(
    func: Callable,
    *args,
    max_retries: int = 3,
    delay: float = 1.0,
    backoff_factor: float = 2.0,
    exceptions: tuple = (Exception,),
    **kwargs
) -> Any:
    """Retry async function with exponential backoff."""
    last_exception = None
    
    for attempt in range(max_retries + 1):
        try:
            return await func(*args, **kwargs)
        except exceptions as e:
            last_exception = e
            if attempt == max_retries:
                raise e
            
            wait_time = delay * (backoff_factor ** attempt)
            await asyncio.sleep(wait_time)
    
    raise last_exception


def random_delay(min_delay: float = 1.0, max_delay: float = 3.0) -> float:
    """Generate random delay between min and max values."""
    return random.uniform(min_delay, max_delay)


def is_valid_url(url: str) -> bool:
    """Check if URL is valid."""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False


def chunk_list(lst: list, chunk_size: int) -> list:
    """Split list into chunks of specified size."""
    for i in range(0, len(lst), chunk_size):
        yield lst[i:i + chunk_size]


async def check_url_accessible(url: str, timeout: int = 10) -> bool:
    """Check if URL is accessible."""
    try:
        async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=timeout)) as session:
            async with session.head(url) as response:
                return response.status < 400
    except Exception:
        return False


def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe file system usage."""
    # Remove or replace invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Remove extra spaces and dots
    filename = re.sub(r'[.\s]+$', '', filename)
    # Limit length
    if len(filename) > 255:
        filename = filename[:255]
    return filename







