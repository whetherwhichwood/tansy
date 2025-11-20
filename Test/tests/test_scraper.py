"""
Basic tests for the web scraping tool.
"""

import pytest
import asyncio
from unittest.mock import Mock, patch
from core.scraper import BaseScraper
from core.browser import BrowserManager
from core.proxy import ProxyManager
from core.rate_limiter import RateLimiter
from scrapers.example_scraper import ExampleScraper


class TestBaseScraper:
    """Test base scraper functionality."""
    
    def test_scraper_initialization(self):
        """Test scraper initialization."""
        scraper = ExampleScraper()
        assert scraper.name == "ExampleScraper"
        assert scraper.settings is not None
        assert scraper.logger is not None
    
    @pytest.mark.asyncio
    async def test_scraper_context_manager(self):
        """Test scraper as context manager."""
        scraper = ExampleScraper()
        
        # Mock browser manager
        with patch('core.scraper.BrowserManager') as mock_browser:
            mock_browser.return_value.__aenter__ = Mock(return_value=mock_browser.return_value)
            mock_browser.return_value.__aexit__ = Mock(return_value=None)
            mock_browser.return_value.start = Mock(return_value=None)
            mock_browser.return_value.close = Mock(return_value=None)
            mock_browser.return_value.create_context = Mock(return_value=Mock())
            mock_browser.return_value.new_page = Mock(return_value=Mock())
            
            async with scraper:
                assert scraper.browser_manager is not None


class TestProxyManager:
    """Test proxy manager functionality."""
    
    def test_proxy_initialization(self):
        """Test proxy manager initialization."""
        manager = ProxyManager()
        assert manager.settings is not None
        assert manager.logger is not None
    
    def test_proxy_parsing(self):
        """Test proxy line parsing."""
        manager = ProxyManager()
        
        # Test different proxy formats
        test_cases = [
            ("127.0.0.1:8080", "127.0.0.1", 8080, None, None, "http"),
            ("http://127.0.0.1:8080", "127.0.0.1", 8080, None, None, "http"),
            ("127.0.0.1:8080:user:pass", "127.0.0.1", 8080, "user", "pass", "http"),
            ("socks5://user:pass@127.0.0.1:8080", "127.0.0.1", 8080, "user", "pass", "socks5"),
        ]
        
        for line, expected_host, expected_port, expected_user, expected_pass, expected_protocol in test_cases:
            proxy = manager._parse_proxy_line(line)
            if proxy:
                assert proxy.host == expected_host
                assert proxy.port == expected_port
                assert proxy.username == expected_user
                assert proxy.password == expected_pass
                assert proxy.protocol == expected_protocol


class TestRateLimiter:
    """Test rate limiter functionality."""
    
    def test_rate_limiter_initialization(self):
        """Test rate limiter initialization."""
        limiter = RateLimiter()
        assert limiter.settings is not None
        assert limiter.logger is not None
    
    def test_token_bucket_creation(self):
        """Test token bucket creation."""
        limiter = RateLimiter()
        bucket = limiter._create_bucket()
        
        assert bucket.capacity > 0
        assert bucket.tokens > 0
        assert bucket.refill_rate > 0
    
    def test_token_consumption(self):
        """Test token consumption logic."""
        limiter = RateLimiter()
        bucket = limiter._create_bucket()
        
        # Should be able to consume tokens initially
        assert bucket.consume(1) == True
        assert bucket.tokens < bucket.capacity
        
        # Consume all tokens
        while bucket.consume(1):
            pass
        
        # Should not be able to consume more
        assert bucket.consume(1) == False


class TestDataPipeline:
    """Test data pipeline functionality."""
    
    def test_pipeline_initialization(self):
        """Test data pipeline initialization."""
        from core.pipeline import DataPipeline
        
        pipeline = DataPipeline()
        assert pipeline.settings is not None
        assert pipeline.logger is not None
        assert pipeline.data_dir.exists()
    
    def test_data_cleaning(self):
        """Test data cleaning functionality."""
        from core.pipeline import DataPipeline
        
        pipeline = DataPipeline()
        
        test_data = [
            {"name": "  Product 1  ", "price": " $10.99 "},
            {"name": "Product 2", "price": "$20.00"},
        ]
        
        cleaned = pipeline.clean_data(test_data)
        
        assert len(cleaned) == 2
        assert cleaned[0]["name"] == "Product 1"
        assert cleaned[0]["price"] == "$10.99"
        assert "_scraped_at" in cleaned[0]
        assert "_scraper_id" in cleaned[0]
    
    def test_data_deduplication(self):
        """Test data deduplication."""
        from core.pipeline import DataPipeline
        
        pipeline = DataPipeline()
        
        test_data = [
            {"id": "1", "name": "Product 1"},
            {"id": "2", "name": "Product 2"},
            {"id": "1", "name": "Product 1"},  # Duplicate
        ]
        
        deduplicated = pipeline.deduplicate_data(test_data, ["id"])
        
        assert len(deduplicated) == 2
        assert deduplicated[0]["id"] == "1"
        assert deduplicated[1]["id"] == "2"


if __name__ == "__main__":
    pytest.main([__file__])







