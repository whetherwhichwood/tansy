"""
Rate limiter with token bucket algorithm and per-domain throttling.
"""

import asyncio
import time
from typing import Dict, Optional
from dataclasses import dataclass, field
from collections import defaultdict
from config.settings import get_settings
from utils.logger import get_logger
from utils.helpers import extract_domain, random_delay


@dataclass
class TokenBucket:
    """Token bucket for rate limiting."""
    capacity: int
    tokens: float = field(default=None)
    last_refill: float = field(default_factory=time.time)
    refill_rate: float = field(default=None)
    
    def __post_init__(self):
        if self.tokens is None:
            self.tokens = float(self.capacity)
        if self.refill_rate is None:
            self.refill_rate = float(self.capacity) / 60.0  # tokens per second
    
    def refill(self):
        """Refill tokens based on elapsed time."""
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now
    
    def consume(self, tokens: int = 1) -> bool:
        """Try to consume tokens from the bucket."""
        self.refill()
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False


class RateLimiter:
    """Rate limiter with token bucket algorithm and per-domain throttling."""
    
    def __init__(self):
        self.settings = get_settings()
        self.logger = get_logger(__name__)
        self.buckets: Dict[str, TokenBucket] = defaultdict(self._create_bucket)
        self.domain_buckets: Dict[str, TokenBucket] = defaultdict(self._create_domain_bucket)
        self.robots_cache: Dict[str, Optional[Dict]] = {}
        self._lock = asyncio.Lock()
    
    def _create_bucket(self) -> TokenBucket:
        """Create default token bucket."""
        return TokenBucket(
            capacity=self.settings.rate_limiting.burst_limit,
            refill_rate=self.settings.rate_limiting.default_rate / 60.0
        )
    
    def _create_domain_bucket(self) -> TokenBucket:
        """Create domain-specific token bucket."""
        return TokenBucket(
            capacity=self.settings.rate_limiting.burst_limit,
            refill_rate=self.settings.rate_limiting.default_rate / 60.0
        )
    
    async def wait_for_token(self, url: str, tokens: int = 1) -> bool:
        """Wait for tokens to become available."""
        if not self.settings.rate_limiting.enabled:
            return True
        
        domain = extract_domain(url)
        
        async with self._lock:
            # Check global rate limit
            if not self.buckets['global'].consume(tokens):
                self.logger.debug("Global rate limit exceeded, waiting...")
                await self._wait_for_bucket_refill(self.buckets['global'], tokens)
            
            # Check domain-specific rate limit
            if not self.domain_buckets[domain].consume(tokens):
                self.logger.debug(f"Domain rate limit exceeded for {domain}, waiting...")
                await self._wait_for_bucket_refill(self.domain_buckets[domain], tokens)
            
            # Check robots.txt if enabled
            if self.settings.rate_limiting.respect_robots_txt:
                await self._check_robots_txt(url)
            
            # Add random delay for human-like behavior
            delay = random_delay(
                self.settings.rate_limiting.delay.min,
                self.settings.rate_limiting.delay.max
            )
            await asyncio.sleep(delay)
            
            return True
    
    async def _wait_for_bucket_refill(self, bucket: TokenBucket, tokens: int):
        """Wait for bucket to have enough tokens."""
        while not bucket.consume(tokens):
            # Calculate time until next token is available
            time_to_wait = (tokens - bucket.tokens) / bucket.refill_rate
            if time_to_wait > 0:
                self.logger.debug(f"Waiting {time_to_wait:.2f} seconds for rate limit...")
                await asyncio.sleep(min(time_to_wait, 60))  # Cap at 60 seconds
            bucket.refill()
    
    async def _check_robots_txt(self, url: str):
        """Check robots.txt for crawl delay."""
        domain = extract_domain(url)
        
        if domain in self.robots_cache:
            robots_info = self.robots_cache[domain]
        else:
            robots_info = await self._fetch_robots_txt(domain)
            self.robots_cache[domain] = robots_info
        
        if robots_info and 'crawl_delay' in robots_info:
            delay = robots_info['crawl_delay']
            self.logger.debug(f"Robots.txt crawl delay for {domain}: {delay}s")
            await asyncio.sleep(delay)
    
    async def _fetch_robots_txt(self, domain: str) -> Optional[Dict]:
        """Fetch and parse robots.txt for a domain."""
        try:
            import aiohttp
            
            robots_url = f"http://{domain}/robots.txt"
            timeout = aiohttp.ClientTimeout(total=10)
            
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(robots_url) as response:
                    if response.status == 200:
                        content = await response.text()
                        return self._parse_robots_txt(content)
        
        except Exception as e:
            self.logger.debug(f"Failed to fetch robots.txt for {domain}: {e}")
        
        return None
    
    def _parse_robots_txt(self, content: str) -> Dict:
        """Parse robots.txt content for crawl delay."""
        robots_info = {}
        current_user_agent = None
        
        for line in content.split('\n'):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip().lower()
                value = value.strip()
                
                if key == 'user-agent':
                    current_user_agent = value
                elif key == 'crawl-delay' and current_user_agent in ['*', 'scraper']:
                    try:
                        robots_info['crawl_delay'] = float(value)
                    except ValueError:
                        pass
        
        return robots_info
    
    def set_domain_rate(self, domain: str, rate: int, burst: int = None):
        """Set custom rate limit for a specific domain."""
        if burst is None:
            burst = rate
        
        self.domain_buckets[domain] = TokenBucket(
            capacity=burst,
            refill_rate=rate / 60.0
        )
        self.logger.info(f"Set rate limit for {domain}: {rate} req/min, burst: {burst}")
    
    def get_rate_stats(self) -> Dict[str, Dict[str, float]]:
        """Get current rate limiting statistics."""
        stats = {}
        
        # Global stats
        global_bucket = self.buckets['global']
        global_bucket.refill()
        stats['global'] = {
            'tokens_available': global_bucket.tokens,
            'capacity': global_bucket.capacity,
            'refill_rate': global_bucket.refill_rate
        }
        
        # Domain stats
        for domain, bucket in self.domain_buckets.items():
            bucket.refill()
            stats[domain] = {
                'tokens_available': bucket.tokens,
                'capacity': bucket.capacity,
                'refill_rate': bucket.refill_rate
            }
        
        return stats
    
    def reset_limits(self):
        """Reset all rate limits."""
        self.buckets.clear()
        self.domain_buckets.clear()
        self.robots_cache.clear()
        self.logger.info("Rate limits reset")
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass







