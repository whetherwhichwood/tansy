"""
Base scraper class with navigation, retry logic, and data extraction.
"""

import asyncio
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union
from pathlib import Path
from playwright.async_api import Page, BrowserContext
from config.settings import get_settings
from utils.logger import get_logger
from utils.helpers import retry_async, clean_text, is_valid_url
from .browser import BrowserManager
from .rate_limiter import RateLimiter
from .stealth import StealthManager


class BaseScraper(ABC):
    """Abstract base class for web scrapers."""
    
    def __init__(self, name: str = None):
        self.name = name or self.__class__.__name__
        self.settings = get_settings()
        self.logger = get_logger(f"scraper.{self.name}")
        self.browser_manager = None
        self.rate_limiter = None
        self.stealth_manager = None
        self.context = None
        self.page = None
        
    async def __aenter__(self):
        await self.initialize()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.cleanup()
    
    async def initialize(self):
        """Initialize scraper components."""
        try:
            self.logger.info(f"Initializing scraper: {self.name}")
            
            # Initialize managers
            self.browser_manager = BrowserManager()
            self.rate_limiter = RateLimiter()
            self.stealth_manager = StealthManager()
            
            # Start browser
            await self.browser_manager.start()
            
            # Create browser context
            self.context = await self.browser_manager.create_context()
            
            # Create page
            self.page = await self.browser_manager.new_page(self.context)
            
            # Apply stealth features
            if self.settings.browser.stealth_mode:
                await self.stealth_manager.apply_stealth_features(self.page)
            
            self.logger.info(f"Scraper {self.name} initialized successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to initialize scraper {self.name}: {e}")
            raise
    
    async def cleanup(self):
        """Cleanup scraper resources."""
        try:
            if self.page:
                await self.page.close()
            if self.context:
                await self.context.close()
            if self.browser_manager:
                await self.browser_manager.close()
            
            self.logger.info(f"Scraper {self.name} cleaned up")
            
        except Exception as e:
            self.logger.error(f"Error during cleanup: {e}")
    
    async def navigate(self, url: str, wait_until: str = "networkidle") -> Page:
        """Navigate to URL with rate limiting and retry logic."""
        if not is_valid_url(url):
            raise ValueError(f"Invalid URL: {url}")
        
        # Apply rate limiting
        await self.rate_limiter.wait_for_token(url)
        
        # Navigate with retry logic
        success = await retry_async(
            self._navigate_with_retry,
            url,
            wait_until,
            max_retries=self.settings.scraping.max_retries,
            delay=self.settings.scraping.retry_delay,
            exceptions=(Exception,)
        )
        
        if not success:
            raise Exception(f"Failed to navigate to {url} after {self.settings.scraping.max_retries} retries")
        
        return self.page
    
    async def _navigate_with_retry(self, url: str, wait_until: str) -> bool:
        """Internal navigation method with retry logic."""
        try:
            self.logger.info(f"Navigating to: {url}")
            
            response = await self.page.goto(
                url,
                wait_until=wait_until,
                timeout=self.settings.browser.timeout
            )
            
            if response and response.status < 400:
                self.logger.info(f"Successfully navigated to {url}")
                
                # Simulate human behavior
                if self.settings.browser.stealth_mode:
                    await self.stealth_manager.simulate_human_behavior(self.page)
                
                return True
            else:
                self.logger.warning(f"Navigation failed with status: {response.status if response else 'No response'}")
                return False
                
        except Exception as e:
            self.logger.warning(f"Navigation failed: {e}")
            return False
    
    async def wait_for_selector(
        self, 
        selector: str, 
        timeout: Optional[int] = None,
        state: str = "visible"
    ) -> bool:
        """Wait for element to appear on page."""
        timeout = timeout or self.settings.scraping.wait_for_selector_timeout
        
        try:
            await self.page.wait_for_selector(
                selector, 
                timeout=timeout * 1000,  # Convert to milliseconds
                state=state
            )
            return True
        except Exception as e:
            self.logger.warning(f"Element {selector} not found: {e}")
            return False
    
    async def wait_for_load(self, timeout: Optional[int] = None):
        """Wait for page to fully load."""
        timeout = timeout or self.settings.scraping.timeout
        
        try:
            await self.page.wait_for_load_state("networkidle", timeout=timeout * 1000)
        except Exception as e:
            self.logger.warning(f"Page load timeout: {e}")
    
    async def get_text(self, selector: str) -> str:
        """Get text content from element."""
        try:
            element = await self.page.query_selector(selector)
            if element:
                text = await element.inner_text()
                return clean_text(text)
            return ""
        except Exception as e:
            self.logger.warning(f"Failed to get text from {selector}: {e}")
            return ""
    
    async def get_texts(self, selector: str) -> List[str]:
        """Get text content from multiple elements."""
        try:
            elements = await self.page.query_selector_all(selector)
            texts = []
            for element in elements:
                text = await element.inner_text()
                texts.append(clean_text(text))
            return texts
        except Exception as e:
            self.logger.warning(f"Failed to get texts from {selector}: {e}")
            return []
    
    async def get_attribute(self, selector: str, attribute: str) -> str:
        """Get attribute value from element."""
        try:
            element = await self.page.query_selector(selector)
            if element:
                value = await element.get_attribute(attribute)
                return value or ""
            return ""
        except Exception as e:
            self.logger.warning(f"Failed to get attribute {attribute} from {selector}: {e}")
            return ""
    
    async def get_attributes(self, selector: str, attribute: str) -> List[str]:
        """Get attribute values from multiple elements."""
        try:
            elements = await self.page.query_selector_all(selector)
            values = []
            for element in elements:
                value = await element.get_attribute(attribute)
                values.append(value or "")
            return values
        except Exception as e:
            self.logger.warning(f"Failed to get attributes {attribute} from {selector}: {e}")
            return []
    
    async def click(self, selector: str, wait_after: bool = True) -> bool:
        """Click element and optionally wait for navigation."""
        try:
            element = await self.page.query_selector(selector)
            if not element:
                self.logger.warning(f"Element {selector} not found for clicking")
                return False
            
            if wait_after:
                await element.click()
                await self.page.wait_for_load_state("networkidle")
            else:
                await element.click()
            
            return True
        except Exception as e:
            self.logger.warning(f"Failed to click {selector}: {e}")
            return False
    
    async def fill(self, selector: str, text: str) -> bool:
        """Fill input field with text."""
        try:
            element = await self.page.query_selector(selector)
            if not element:
                self.logger.warning(f"Element {selector} not found for filling")
                return False
            
            await element.fill(text)
            return True
        except Exception as e:
            self.logger.warning(f"Failed to fill {selector}: {e}")
            return False
    
    async def select_option(self, selector: str, value: str) -> bool:
        """Select option from dropdown."""
        try:
            element = await self.page.query_selector(selector)
            if not element:
                self.logger.warning(f"Element {selector} not found for selection")
                return False
            
            await element.select_option(value)
            return True
        except Exception as e:
            self.logger.warning(f"Failed to select option in {selector}: {e}")
            return False
    
    async def take_screenshot(self, path: str, full_page: bool = True):
        """Take screenshot of current page."""
        try:
            await self.browser_manager.take_screenshot(self.page, path, full_page)
        except Exception as e:
            self.logger.error(f"Failed to take screenshot: {e}")
    
    async def get_page_content(self) -> Dict[str, Any]:
        """Get current page content and metadata."""
        try:
            return await self.browser_manager.get_page_content(self.page)
        except Exception as e:
            self.logger.error(f"Failed to get page content: {e}")
            return {}
    
    async def scroll_to_bottom(self, pause: float = 1.0):
        """Scroll to bottom of page with pauses."""
        try:
            await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(pause)
        except Exception as e:
            self.logger.warning(f"Failed to scroll to bottom: {e}")
    
    async def scroll_to_element(self, selector: str):
        """Scroll to specific element."""
        try:
            await self.page.evaluate(f"""
                const element = document.querySelector('{selector}');
                if (element) {{
                    element.scrollIntoView({{ behavior: 'smooth' }});
                }}
            """)
            await asyncio.sleep(0.5)  # Wait for scroll to complete
        except Exception as e:
            self.logger.warning(f"Failed to scroll to element {selector}: {e}")
    
    async def evaluate(self, script: str) -> Any:
        """Execute JavaScript on page and return result."""
        try:
            return await self.page.evaluate(script)
        except Exception as e:
            self.logger.warning(f"Failed to evaluate script: {e}")
            return None
    
    @abstractmethod
    async def scrape(self, url: str) -> Any:
        """Main scraping method to be implemented by subclasses."""
        pass
    
    async def run(self, url: str) -> Any:
        """Run scraper with error handling and logging."""
        try:
            self.logger.info(f"Starting scrape of {url}")
            result = await self.scrape(url)
            self.logger.info(f"Scrape completed successfully for {url}")
            return result
        except Exception as e:
            self.logger.error(f"Scrape failed for {url}: {e}")
            raise







