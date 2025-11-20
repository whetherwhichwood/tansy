"""
Proxy manager with rotation, health checks, and authentication.
"""

import asyncio
import aiohttp
import random
from typing import List, Optional, Dict, Any
from pathlib import Path
from dataclasses import dataclass
from config.settings import get_settings
from utils.logger import get_logger
from utils.helpers import is_valid_url


@dataclass
class Proxy:
    """Proxy configuration."""
    host: str
    port: int
    username: Optional[str] = None
    password: Optional[str] = None
    protocol: str = "http"
    is_working: bool = True
    last_checked: float = 0.0
    response_time: float = 0.0
    
    @property
    def url(self) -> str:
        """Get proxy URL."""
        if self.username and self.password:
            return f"{self.protocol}://{self.username}:{self.password}@{self.host}:{self.port}"
        return f"{self.protocol}://{self.host}:{self.port}"
    
    @property
    def server(self) -> str:
        """Get proxy server string."""
        return f"{self.host}:{self.port}"


class ProxyManager:
    """Manages proxy rotation, health checks, and authentication."""
    
    def __init__(self):
        self.settings = get_settings()
        self.logger = get_logger(__name__)
        self.proxies: List[Proxy] = []
        self.current_index = 0
        self.health_check_task = None
        self._load_proxies()
    
    def _load_proxies(self):
        """Load proxies from file."""
        if not self.settings.proxy.enabled:
            self.logger.info("Proxy support is disabled")
            return
        
        proxy_file = Path(self.settings.proxy.file)
        if not proxy_file.exists():
            self.logger.warning(f"Proxy file {proxy_file} not found")
            return
        
        try:
            with open(proxy_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            for line in lines:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                
                proxy = self._parse_proxy_line(line)
                if proxy:
                    self.proxies.append(proxy)
            
            self.logger.info(f"Loaded {len(self.proxies)} proxies from {proxy_file}")
            
        except Exception as e:
            self.logger.error(f"Failed to load proxies from {proxy_file}: {e}")
    
    def _parse_proxy_line(self, line: str) -> Optional[Proxy]:
        """Parse proxy line in format: protocol://host:port or host:port:username:password."""
        try:
            # Handle different proxy formats
            if '://' in line:
                # Format: protocol://host:port or protocol://username:password@host:port
                parts = line.split('://', 1)
                protocol = parts[0]
                rest = parts[1]
                
                if '@' in rest:
                    # Has authentication
                    auth_part, host_port = rest.split('@', 1)
                    username, password = auth_part.split(':', 1)
                    host, port = host_port.split(':', 1)
                else:
                    # No authentication
                    username, password = None, None
                    host, port = rest.split(':', 1)
            else:
                # Format: host:port or host:port:username:password
                parts = line.split(':')
                if len(parts) == 2:
                    host, port = parts
                    username, password = None, None
                    protocol = "http"
                elif len(parts) == 4:
                    host, port, username, password = parts
                    protocol = "http"
                else:
                    self.logger.warning(f"Invalid proxy format: {line}")
                    return None
            
            return Proxy(
                host=host.strip(),
                port=int(port.strip()),
                username=username.strip() if username else None,
                password=password.strip() if password else None,
                protocol=protocol
            )
            
        except Exception as e:
            self.logger.warning(f"Failed to parse proxy line '{line}': {e}")
            return None
    
    async def start_health_checks(self):
        """Start periodic health checks for proxies."""
        if not self.settings.proxy.enabled or not self.proxies:
            return
        
        self.health_check_task = asyncio.create_task(self._health_check_loop())
        self.logger.info("Started proxy health check loop")
    
    async def stop_health_checks(self):
        """Stop health check loop."""
        if self.health_check_task:
            self.health_check_task.cancel()
            try:
                await self.health_check_task
            except asyncio.CancelledError:
                pass
            self.logger.info("Stopped proxy health check loop")
    
    async def _health_check_loop(self):
        """Periodic health check loop."""
        while True:
            try:
                await asyncio.sleep(self.settings.proxy.health_check_interval)
                await self.check_all_proxies()
            except asyncio.CancelledError:
                break
            except Exception as e:
                self.logger.error(f"Error in health check loop: {e}")
    
    async def check_all_proxies(self):
        """Check health of all proxies."""
        if not self.proxies:
            return
        
        self.logger.info(f"Checking health of {len(self.proxies)} proxies")
        
        # Check proxies concurrently
        tasks = [self._check_proxy_health(proxy) for proxy in self.proxies]
        await asyncio.gather(*tasks, return_exceptions=True)
        
        working_count = sum(1 for p in self.proxies if p.is_working)
        self.logger.info(f"Health check complete: {working_count}/{len(self.proxies)} proxies working")
    
    async def _check_proxy_health(self, proxy: Proxy):
        """Check if a single proxy is working."""
        try:
            start_time = asyncio.get_event_loop().time()
            
            # Test proxy with a simple HTTP request
            proxy_url = proxy.url
            timeout = aiohttp.ClientTimeout(total=self.settings.proxy.timeout)
            
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(
                    'http://httpbin.org/ip',
                    proxy=proxy_url
                ) as response:
                    if response.status == 200:
                        response_time = asyncio.get_event_loop().time() - start_time
                        proxy.is_working = True
                        proxy.response_time = response_time
                        proxy.last_checked = asyncio.get_event_loop().time()
                        self.logger.debug(f"Proxy {proxy.server} is working (response time: {response_time:.2f}s)")
                    else:
                        proxy.is_working = False
                        self.logger.debug(f"Proxy {proxy.server} failed with status {response.status}")
        
        except Exception as e:
            proxy.is_working = False
            self.logger.debug(f"Proxy {proxy.server} failed: {e}")
    
    async def get_proxy(self) -> Optional[Dict[str, str]]:
        """Get a working proxy for use with Playwright."""
        if not self.settings.proxy.enabled or not self.proxies:
            return None
        
        # Filter working proxies
        working_proxies = [p for p in self.proxies if p.is_working]
        
        if not working_proxies:
            self.logger.warning("No working proxies available")
            return None
        
        # Select proxy based on rotation strategy
        if self.settings.proxy.rotation:
            # Round-robin selection
            proxy = working_proxies[self.current_index % len(working_proxies)]
            self.current_index += 1
        else:
            # Random selection
            proxy = random.choice(working_proxies)
        
        self.logger.debug(f"Selected proxy: {proxy.server}")
        
        # Return proxy configuration for Playwright
        return {
            'server': proxy.server,
            'username': proxy.username,
            'password': proxy.password
        }
    
    async def get_random_proxy(self) -> Optional[Dict[str, str]]:
        """Get a random working proxy."""
        if not self.settings.proxy.enabled or not self.proxies:
            return None
        
        working_proxies = [p for p in self.proxies if p.is_working]
        if not working_proxies:
            return None
        
        proxy = random.choice(working_proxies)
        return {
            'server': proxy.server,
            'username': proxy.username,
            'password': proxy.password
        }
    
    def add_proxy(self, host: str, port: int, username: str = None, password: str = None, protocol: str = "http"):
        """Add a new proxy to the list."""
        proxy = Proxy(
            host=host,
            port=port,
            username=username,
            password=password,
            protocol=protocol
        )
        self.proxies.append(proxy)
        self.logger.info(f"Added proxy: {proxy.server}")
    
    def remove_proxy(self, host: str, port: int):
        """Remove a proxy from the list."""
        self.proxies = [p for p in self.proxies if not (p.host == host and p.port == port)]
        self.logger.info(f"Removed proxy: {host}:{port}")
    
    def get_proxy_stats(self) -> Dict[str, Any]:
        """Get proxy statistics."""
        total = len(self.proxies)
        working = sum(1 for p in self.proxies if p.is_working)
        
        return {
            'total': total,
            'working': working,
            'failed': total - working,
            'working_percentage': (working / total * 100) if total > 0 else 0
        }
    
    async def test_proxy(self, proxy: Proxy, test_url: str = "http://httpbin.org/ip") -> bool:
        """Test a specific proxy with a custom URL."""
        try:
            timeout = aiohttp.ClientTimeout(total=self.settings.proxy.timeout)
            
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(test_url, proxy=proxy.url) as response:
                    return response.status == 200
        
        except Exception as e:
            self.logger.debug(f"Proxy test failed for {proxy.server}: {e}")
            return False
    
    async def __aenter__(self):
        await self.start_health_checks()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.stop_health_checks()







