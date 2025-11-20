"""
Browser manager with Playwright and stealth features.
"""

import asyncio
import random
from typing import Optional, Dict, Any, List
from pathlib import Path
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from fake_useragent import UserAgent
from config.settings import get_settings
from utils.logger import get_logger
from utils.helpers import random_delay


class BrowserManager:
    """Manages browser instances with stealth and anti-detection features."""
    
    def __init__(self, proxy_manager=None):
        self.settings = get_settings()
        self.logger = get_logger(__name__)
        self.proxy_manager = proxy_manager
        self.playwright = None
        self.browser = None
        self.contexts: List[BrowserContext] = []
        self.ua = UserAgent()
        
    async def __aenter__(self):
        await self.start()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()
    
    async def start(self):
        """Start Playwright and browser."""
        try:
            self.playwright = await async_playwright().start()
            
            # Get proxy if available
            proxy = None
            if self.proxy_manager and self.settings.proxy.enabled:
                proxy = await self.proxy_manager.get_proxy()
            
            # Launch browser with stealth options
            browser_args = [
                '--no-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-extensions',
                '--disable-plugins',
                '--disable-images',  # Speed up loading
                '--disable-javascript',  # Can be overridden per page
            ]
            
            if self.settings.browser.headless:
                browser_args.append('--headless=new')
            
            self.browser = await self.playwright.chromium.launch(
                headless=self.settings.browser.headless,
                args=browser_args,
                proxy=proxy
            )
            
            self.logger.info("Browser started successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to start browser: {e}")
            raise
    
    async def close(self):
        """Close browser and cleanup resources."""
        try:
            # Close all contexts
            for context in self.contexts:
                await context.close()
            self.contexts.clear()
            
            # Close browser
            if self.browser:
                await self.browser.close()
            
            # Stop playwright
            if self.playwright:
                await self.playwright.stop()
            
            self.logger.info("Browser closed successfully")
            
        except Exception as e:
            self.logger.error(f"Error closing browser: {e}")
    
    async def create_context(self, **kwargs) -> BrowserContext:
        """Create a new browser context with stealth features."""
        if not self.browser:
            await self.start()
        
        # Default context options
        context_options = {
            'viewport': {
                'width': self.settings.browser.viewport.width,
                'height': self.settings.browser.viewport.height
            },
            'user_agent': self._get_random_user_agent(),
            'locale': 'en-US',
            'timezone_id': 'America/New_York',
            'permissions': ['geolocation'],
            'geolocation': {'latitude': 40.7128, 'longitude': -74.0060},
            'extra_http_headers': {
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Cache-Control': 'max-age=0'
            }
        }
        
        # Override with provided options
        context_options.update(kwargs)
        
        # Get proxy for this context
        if self.proxy_manager and self.settings.proxy.enabled:
            proxy = await self.proxy_manager.get_proxy()
            if proxy:
                context_options['proxy'] = proxy
        
        context = await self.browser.new_context(**context_options)
        
        # Add stealth scripts
        if self.settings.browser.stealth_mode:
            await self._add_stealth_scripts(context)
        
        self.contexts.append(context)
        return context
    
    async def _add_stealth_scripts(self, context: BrowserContext):
        """Add stealth scripts to hide automation."""
        stealth_script = """
        // Remove webdriver property
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
        });
        
        // Mock plugins
        Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2, 3, 4, 5],
        });
        
        // Mock languages
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en'],
        });
        
        // Mock permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
        
        // Mock chrome runtime
        window.chrome = {
            runtime: {},
        };
        
        // Override getParameter
        const getParameter = WebGLRenderingContext.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
            if (parameter === 37445) {
                return 'Intel Inc.';
            }
            if (parameter === 37446) {
                return 'Intel Iris OpenGL Engine';
            }
            return getParameter(parameter);
        };
        """
        
        await context.add_init_script(stealth_script)
    
    def _get_random_user_agent(self) -> str:
        """Get random user agent string."""
        if not self.settings.browser.user_agent_rotation:
            return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        
        try:
            return self.ua.random
        except Exception:
            # Fallback user agents
            user_agents = [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0"
            ]
            return random.choice(user_agents)
    
    async def new_page(self, context: Optional[BrowserContext] = None) -> Page:
        """Create a new page with stealth features."""
        if not context:
            context = await self.create_context()
        
        page = await context.new_page()
        
        # Add stealth features to page
        if self.settings.browser.stealth_mode:
            await self._add_page_stealth_features(page)
        
        return page
    
    async def _add_page_stealth_features(self, page: Page):
        """Add stealth features to page."""
        # Override navigator properties
        await page.evaluate("""
        () => {
            // Override the `plugins` property to use a custom getter
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            });
            
            // Override the `languages` property to use a custom getter
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en'],
            });
            
            // Override the `webdriver` property
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
        }
        """)
    
    async def navigate_with_retry(
        self, 
        page: Page, 
        url: str, 
        max_retries: int = 3,
        wait_until: str = "networkidle"
    ) -> bool:
        """Navigate to URL with retry logic."""
        for attempt in range(max_retries):
            try:
                self.logger.info(f"Navigating to {url} (attempt {attempt + 1})")
                
                # Add random delay before navigation
                if attempt > 0:
                    delay = random_delay(2.0, 5.0)
                    await asyncio.sleep(delay)
                
                response = await page.goto(
                    url, 
                    wait_until=wait_until,
                    timeout=self.settings.browser.timeout
                )
                
                if response and response.status < 400:
                    self.logger.info(f"Successfully navigated to {url}")
                    return True
                else:
                    self.logger.warning(f"Navigation failed with status: {response.status if response else 'No response'}")
                    
            except Exception as e:
                self.logger.warning(f"Navigation attempt {attempt + 1} failed: {e}")
                if attempt == max_retries - 1:
                    self.logger.error(f"All navigation attempts failed for {url}")
                    raise
        
        return False
    
    async def human_like_scroll(self, page: Page, scroll_pause: float = 1.0):
        """Simulate human-like scrolling behavior."""
        try:
            # Get page height
            page_height = await page.evaluate("document.body.scrollHeight")
            viewport_height = await page.evaluate("window.innerHeight")
            
            current_scroll = 0
            while current_scroll < page_height:
                # Random scroll distance
                scroll_distance = random.randint(100, 500)
                current_scroll += scroll_distance
                
                # Scroll to position
                await page.evaluate(f"window.scrollTo(0, {current_scroll})")
                
                # Random pause
                await asyncio.sleep(random.uniform(0.5, scroll_pause))
                
                # Sometimes scroll back up a bit (human behavior)
                if random.random() < 0.1:
                    back_scroll = random.randint(50, 200)
                    current_scroll = max(0, current_scroll - back_scroll)
                    await page.evaluate(f"window.scrollTo(0, {current_scroll})")
                    await asyncio.sleep(random.uniform(0.2, 0.8))
        
        except Exception as e:
            self.logger.warning(f"Error during human-like scrolling: {e}")
    
    async def take_screenshot(self, page: Page, path: str, full_page: bool = True):
        """Take screenshot of page."""
        try:
            await page.screenshot(path=path, full_page=full_page)
            self.logger.info(f"Screenshot saved to {path}")
        except Exception as e:
            self.logger.error(f"Failed to take screenshot: {e}")
    
    async def get_page_content(self, page: Page) -> Dict[str, Any]:
        """Get page content including HTML and metadata."""
        try:
            content = await page.content()
            title = await page.title()
            url = page.url
            
            return {
                'html': content,
                'title': title,
                'url': url,
                'timestamp': asyncio.get_event_loop().time()
            }
        except Exception as e:
            self.logger.error(f"Failed to get page content: {e}")
            return {}







