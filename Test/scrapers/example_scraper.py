"""
Example scraper demonstrating all features.
"""

from typing import List, Dict, Any
from core.scraper import BaseScraper
from utils.logger import get_logger


class ExampleScraper(BaseScraper):
    """Example scraper for demonstration purposes."""
    
    def __init__(self):
        super().__init__("ExampleScraper")
        self.logger = get_logger(__name__)
    
    async def scrape(self, url: str) -> List[Dict[str, Any]]:
        """Scrape example data from a webpage."""
        try:
            # Navigate to the page
            await self.navigate(url)
            
            # Wait for content to load
            await self.wait_for_load()
            
            # Example: Scrape product information
            products = []
            
            # Wait for product list to appear
            if await self.wait_for_selector('.product-item', timeout=10):
                # Get all product elements
                product_elements = await self.page.query_selector_all('.product-item')
                
                for element in product_elements:
                    try:
                        # Extract product data
                        product = {
                            'name': await element.query_selector('.product-name') and 
                                   await element.query_selector('.product-name').inner_text() or '',
                            'price': await element.query_selector('.product-price') and 
                                    await element.query_selector('.product-price').inner_text() or '',
                            'description': await element.query_selector('.product-description') and 
                                          await element.query_selector('.product-description').inner_text() or '',
                            'image_url': await element.query_selector('.product-image img') and 
                                        await element.query_selector('.product-image img').get_attribute('src') or '',
                            'url': url
                        }
                        
                        # Clean the data
                        product = {k: v.strip() if isinstance(v, str) else v for k, v in product.items()}
                        
                        if product['name']:  # Only add products with names
                            products.append(product)
                            
                    except Exception as e:
                        self.logger.warning(f"Failed to extract product data: {e}")
                        continue
            
            # If no products found, try alternative selectors
            if not products:
                self.logger.info("No products found with primary selectors, trying alternatives...")
                
                # Try to scrape any text content as example
                page_title = await self.get_text('title')
                page_content = await self.get_text('body')
                
                if page_title:
                    products.append({
                        'title': page_title,
                        'content_preview': page_content[:200] + '...' if len(page_content) > 200 else page_content,
                        'url': url,
                        'scraped_at': self.page.evaluate('new Date().toISOString()')
                    })
            
            self.logger.info(f"Scraped {len(products)} items from {url}")
            return products
            
        except Exception as e:
            self.logger.error(f"Scraping failed for {url}: {e}")
            raise


class NewsScraper(BaseScraper):
    """Example news scraper."""
    
    def __init__(self):
        super().__init__("NewsScraper")
        self.logger = get_logger(__name__)
    
    async def scrape(self, url: str) -> List[Dict[str, Any]]:
        """Scrape news articles from a webpage."""
        try:
            await self.navigate(url)
            await self.wait_for_load()
            
            articles = []
            
            # Try different news article selectors
            article_selectors = [
                'article',
                '.article',
                '.news-item',
                '.post',
                '.entry'
            ]
            
            for selector in article_selectors:
                if await self.wait_for_selector(selector, timeout=5):
                    article_elements = await self.page.query_selector_all(selector)
                    
                    for element in article_elements:
                        try:
                            article = {
                                'title': await element.query_selector('h1, h2, h3, .title, .headline') and 
                                        await element.query_selector('h1, h2, h3, .title, .headline').inner_text() or '',
                                'content': await element.query_selector('.content, .body, .text, p') and 
                                          await element.query_selector('.content, .body, .text, p').inner_text() or '',
                                'author': await element.query_selector('.author, .byline') and 
                                         await element.query_selector('.author, .byline').inner_text() or '',
                                'date': await element.query_selector('.date, .published, time') and 
                                       await element.query_selector('.date, .published, time').inner_text() or '',
                                'url': url
                            }
                            
                            # Clean the data
                            article = {k: v.strip() if isinstance(v, str) else v for k, v in article.items()}
                            
                            if article['title']:
                                articles.append(article)
                                
                        except Exception as e:
                            self.logger.warning(f"Failed to extract article data: {e}")
                            continue
                    
                    if articles:
                        break  # Found articles with this selector
            
            self.logger.info(f"Scraped {len(articles)} articles from {url}")
            return articles
            
        except Exception as e:
            self.logger.error(f"News scraping failed for {url}: {e}")
            raise


class EcommerceScraper(BaseScraper):
    """Example e-commerce scraper."""
    
    def __init__(self):
        super().__init__("EcommerceScraper")
        self.logger = get_logger(__name__)
    
    async def scrape(self, url: str) -> List[Dict[str, Any]]:
        """Scrape e-commerce product data."""
        try:
            await self.navigate(url)
            await self.wait_for_load()
            
            products = []
            
            # Common e-commerce selectors
            product_selectors = [
                '.product',
                '.item',
                '.card',
                '[data-product]'
            ]
            
            for selector in product_selectors:
                if await self.wait_for_selector(selector, timeout=5):
                    product_elements = await self.page.query_selector_all(selector)
                    
                    for element in product_elements:
                        try:
                            product = {
                                'name': await self._get_text_from_selectors(element, [
                                    '.product-name', '.title', 'h1', 'h2', 'h3', '.name'
                                ]),
                                'price': await self._get_text_from_selectors(element, [
                                    '.price', '.cost', '.amount', '[data-price]'
                                ]),
                                'description': await self._get_text_from_selectors(element, [
                                    '.description', '.summary', '.details', 'p'
                                ]),
                                'image': await self._get_attribute_from_selectors(element, [
                                    '.product-image img', '.thumbnail img', 'img'
                                ], 'src'),
                                'rating': await self._get_text_from_selectors(element, [
                                    '.rating', '.stars', '.score'
                                ]),
                                'availability': await self._get_text_from_selectors(element, [
                                    '.availability', '.stock', '.status'
                                ]),
                                'url': url
                            }
                            
                            # Clean and validate data
                            product = {k: v.strip() if isinstance(v, str) else v for k, v in product.items()}
                            
                            if product['name']:
                                products.append(product)
                                
                        except Exception as e:
                            self.logger.warning(f"Failed to extract product data: {e}")
                            continue
                    
                    if products:
                        break
            
            self.logger.info(f"Scraped {len(products)} products from {url}")
            return products
            
        except Exception as e:
            self.logger.error(f"E-commerce scraping failed for {url}: {e}")
            raise
    
    async def _get_text_from_selectors(self, element, selectors: List[str]) -> str:
        """Try multiple selectors to get text content."""
        for selector in selectors:
            try:
                sub_element = await element.query_selector(selector)
                if sub_element:
                    text = await sub_element.inner_text()
                    if text.strip():
                        return text.strip()
            except Exception:
                continue
        return ""
    
    async def _get_attribute_from_selectors(self, element, selectors: List[str], attribute: str) -> str:
        """Try multiple selectors to get attribute value."""
        for selector in selectors:
            try:
                sub_element = await element.query_selector(selector)
                if sub_element:
                    value = await sub_element.get_attribute(attribute)
                    if value:
                        return value
            except Exception:
                continue
        return ""







