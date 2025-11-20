# Usage Guide

This guide provides detailed instructions for using the web scraping tool.

## Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager
- Git (for cloning the repository)

### Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd web-scraping-tool
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
playwright install
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your settings
```

## Basic Usage

### Running a Single Scraper

```bash
python cli.py run --scraper ExampleScraper --url https://example.com
```

### Available Scrapers

- `ExampleScraper` - General purpose scraper
- `NewsScraper` - News article scraper
- `EcommerceScraper` - E-commerce product scraper

### Output Options

```bash
# Export to different formats
python cli.py run --scraper ExampleScraper --url https://example.com --format csv
python cli.py run --scraper ExampleScraper --url https://example.com --format excel
```

## Job Queue System

### Adding Jobs

```bash
# Add a job to the queue
python cli.py add-job --name "Daily Scrape" --scraper ExampleScraper --url https://example.com

# Add with priority and retry settings
python cli.py add-job --name "High Priority" --scraper NewsScraper --url https://news.com --priority 10 --max-retries 5
```

### Processing Jobs

```bash
# Start workers to process jobs
python cli.py start-workers --workers 4
```

### Checking Status

```bash
# Check all jobs
python cli.py status

# Check specific job
python cli.py status --job-id <job-id>
```

## Scheduling

### Cron-based Scheduling

```bash
# Schedule job to run daily at 2 AM
python cli.py schedule --job-id <job-id> --cron "0 2 * * *"

# Schedule job to run every Monday at 9 AM
python cli.py schedule --job-id <job-id> --cron "0 9 * * 1"
```

### Interval-based Scheduling

```bash
# Run job every 30 minutes
python cli.py schedule --job-id <job-id> --interval 30

# Run job every 2 hours
python cli.py schedule --job-id <job-id> --interval 120
```

### One-time Scheduling

```bash
# Schedule job for specific date/time
python cli.py schedule --job-id <job-id> --date "2024-12-31 23:59:59"
```

## Data Export

### Exporting Scraped Data

```bash
# Export all data to JSON
python cli.py export --format json

# Export data from specific scraper
python cli.py export --format csv --scraper NewsScraper

# Export with limit
python cli.py export --format excel --limit 1000
```

### Available Export Formats

- `json` - JSON format
- `csv` - CSV format
- `excel` - Excel format
- `xml` - XML format

## Configuration

### Environment Variables

Key environment variables you can set:

```bash
# Database
DATABASE_URL=sqlite:///scraper.db

# Proxy settings
PROXY_ENABLED=true
PROXY_FILE=proxies.txt

# Rate limiting
DEFAULT_RATE_LIMIT=10
BURST_LIMIT=5

# Browser settings
HEADLESS=true
BROWSER_TIMEOUT=30000

# Logging
LOG_LEVEL=INFO
LOG_FILE=scraper.log
```

### Configuration File

Edit `config/default.yaml` to customize default settings:

```yaml
browser:
  headless: true
  timeout: 30000
  stealth_mode: true

proxy:
  enabled: false
  file: "proxies.txt"
  rotation: true

rate_limiting:
  enabled: true
  default_rate: 10
  respect_robots_txt: true
```

## Creating Custom Scrapers

### Basic Scraper

```python
from core.scraper import BaseScraper

class MyCustomScraper(BaseScraper):
    async def scrape(self, url):
        # Navigate to page
        await self.navigate(url)
        
        # Wait for content
        await self.wait_for_selector('.content')
        
        # Extract data
        title = await self.get_text('h1')
        content = await self.get_text('.content')
        
        return {
            'title': title,
            'content': content,
            'url': url
        }
```

### Advanced Scraper with Custom Logic

```python
from core.scraper import BaseScraper

class ProductScraper(BaseScraper):
    async def scrape(self, url):
        await self.navigate(url)
        
        products = []
        
        # Wait for product list
        if await self.wait_for_selector('.product-list'):
            # Get all products
            product_elements = await self.page.query_selector_all('.product')
            
            for element in product_elements:
                product = {
                    'name': await self.get_text_from_element(element, '.name'),
                    'price': await self.get_text_from_element(element, '.price'),
                    'description': await self.get_text_from_element(element, '.description')
                }
                products.append(product)
        
        return products
    
    async def get_text_from_element(self, element, selector):
        """Helper method to get text from element."""
        try:
            sub_element = await element.query_selector(selector)
            if sub_element:
                return await sub_element.inner_text()
        except Exception:
            pass
        return ""
```

## Proxy Configuration

### Proxy File Format

Create a `proxies.txt` file with your proxies:

```
# HTTP proxies
http://proxy1.example.com:8080
http://proxy2.example.com:8080

# HTTP with authentication
http://user:pass@proxy3.example.com:8080

# SOCKS5 proxies
socks5://proxy4.example.com:1080
socks5://user:pass@proxy5.example.com:1080
```

### Proxy Health Checks

The system automatically checks proxy health and rotates them:

```bash
# Check proxy status
python -c "
from core.proxy import ProxyManager
import asyncio

async def check_proxies():
    async with ProxyManager() as pm:
        stats = pm.get_proxy_stats()
        print(f'Working proxies: {stats[\"working\"]}/{stats[\"total\"]}')

asyncio.run(check_proxies())
"
```

## Monitoring and Logging

### Log Files

- `scraper.log` - Main application log
- Logs are automatically rotated when they reach 10MB
- Keep 5 backup files

### Log Levels

- `DEBUG` - Detailed debugging information
- `INFO` - General information
- `WARNING` - Warning messages
- `ERROR` - Error messages

### Monitoring Jobs

```bash
# Get job statistics
python cli.py stats

# Check specific job details
python cli.py status --job-id <job-id>
```

## Troubleshooting

### Common Issues

1. **Browser not starting:**
   - Ensure Playwright is installed: `playwright install`
   - Check if headless mode is enabled
   - Verify system dependencies

2. **Proxy connection failed:**
   - Check proxy format in `proxies.txt`
   - Verify proxy credentials
   - Test proxy connectivity manually

3. **Rate limiting issues:**
   - Adjust rate limits in configuration
   - Check robots.txt compliance
   - Increase delays between requests

4. **Memory issues:**
   - Reduce concurrent workers
   - Enable browser cleanup
   - Monitor system resources

### Debug Mode

Run with verbose logging:

```bash
python cli.py --verbose run --scraper ExampleScraper --url https://example.com
```

### Testing Scrapers

```bash
# Test scraper with debug output
python -c "
import asyncio
from scrapers.example_scraper import ExampleScraper

async def test():
    async with ExampleScraper() as scraper:
        result = await scraper.run('https://example.com')
        print(f'Scraped {len(result)} items')

asyncio.run(test())
"
```

## Best Practices

### Performance

- Use appropriate rate limits to avoid overwhelming servers
- Enable headless mode for better performance
- Clean up browser resources after scraping
- Use proxy rotation for large-scale scraping

### Reliability

- Implement proper error handling in custom scrapers
- Use retry logic for transient failures
- Monitor job status and handle failures
- Keep logs for debugging issues

### Compliance

- Respect robots.txt files
- Follow website terms of service
- Implement appropriate delays between requests
- Use proxies responsibly

### Security

- Secure proxy credentials
- Use environment variables for sensitive data
- Regularly update dependencies
- Monitor for security vulnerabilities







