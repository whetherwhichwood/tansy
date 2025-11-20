"""
Command-line interface for the web scraping tool.
"""

import asyncio
import click
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

from core.scraper import BaseScraper
from core.queue import JobQueue
from core.scheduler import ScrapingScheduler
from core.pipeline import DataPipeline
from storage.database import DatabaseManager
from storage.exporters import DataExporter
from scrapers.example_scraper import ExampleScraper, NewsScraper, EcommerceScraper
from utils.logger import setup_logger, get_logger
from config.settings import get_settings


# Scraper registry
SCRAPER_REGISTRY = {
    'ExampleScraper': ExampleScraper,
    'NewsScraper': NewsScraper,
    'EcommerceScraper': EcommerceScraper
}


@click.group()
@click.option('--verbose', '-v', is_flag=True, help='Enable verbose logging')
@click.option('--config', '-c', help='Path to configuration file')
def cli(verbose, config):
    """Web scraping tool CLI."""
    # Setup logging
    log_level = 'DEBUG' if verbose else 'INFO'
    setup_logger(level=log_level)
    
    # Load settings
    if config:
        settings = get_settings().load_from_file(config)
    else:
        settings = get_settings()


@cli.command()
@click.option('--scraper', '-s', required=True, help='Scraper class name')
@click.option('--url', '-u', required=True, help='URL to scrape')
@click.option('--output', '-o', help='Output file path')
@click.option('--format', 'output_format', type=click.Choice(['json', 'csv', 'excel', 'xml']), 
              default='json', help='Output format')
@click.option('--headless/--no-headless', default=True, help='Run browser in headless mode')
def run(scraper, url, output, output_format, headless):
    """Run a scraper on a single URL."""
    logger = get_logger(__name__)
    
    try:
        # Get scraper class
        if scraper not in SCRAPER_REGISTRY:
            click.echo(f"Unknown scraper: {scraper}")
            click.echo(f"Available scrapers: {', '.join(SCRAPER_REGISTRY.keys())}")
            return
        
        scraper_class = SCRAPER_REGISTRY[scraper]
        
        # Run scraper
        async def run_scraper():
            async with scraper_class() as scraper_instance:
                result = await scraper_instance.run(url)
                
                # Export data
                if result:
                    pipeline = DataPipeline()
                    filename = output or f"scrape_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                    
                    export_results = pipeline.export_data(
                        data=result,
                        filename=filename,
                        formats=[output_format]
                    )
                    
                    for export_result in export_results:
                        if export_result.success:
                            click.echo(f"Data exported to: {export_result.file_path}")
                        else:
                            click.echo(f"Export failed: {export_result.error_message}")
                
                return result
        
        # Run async function
        result = asyncio.run(run_scraper())
        
        if result:
            click.echo(f"Scraped {len(result)} items from {url}")
        else:
            click.echo("No data scraped")
            
    except Exception as e:
        logger.error(f"Scraping failed: {e}")
        click.echo(f"Error: {e}")


@cli.command()
@click.option('--name', '-n', required=True, help='Job name')
@click.option('--scraper', '-s', required=True, help='Scraper class name')
@click.option('--url', '-u', required=True, help='URL to scrape')
@click.option('--priority', '-p', default=0, help='Job priority')
@click.option('--max-retries', '-r', default=3, help='Maximum retry attempts')
def add_job(name, scraper, url, priority, max_retries):
    """Add a job to the queue."""
    logger = get_logger(__name__)
    
    try:
        if scraper not in SCRAPER_REGISTRY:
            click.echo(f"Unknown scraper: {scraper}")
            return
        
        queue = JobQueue()
        job_id = queue.add_job(
            name=name,
            url=url,
            scraper_class=scraper,
            priority=priority,
            max_retries=max_retries
        )
        
        click.echo(f"Job added with ID: {job_id}")
        
    except Exception as e:
        logger.error(f"Failed to add job: {e}")
        click.echo(f"Error: {e}")


@cli.command()
@click.option('--job-id', '-j', help='Specific job ID to check')
def status(job_id):
    """Check job status."""
    logger = get_logger(__name__)
    
    try:
        queue = JobQueue()
        
        if job_id:
            job = queue.get_job(job_id)
            if job:
                click.echo(f"Job {job_id}:")
                click.echo(f"  Name: {job.name}")
                click.echo(f"  URL: {job.url}")
                click.echo(f"  Status: {job.status.value}")
                click.echo(f"  Created: {job.created_at}")
                click.echo(f"  Retries: {job.retry_count}/{job.max_retries}")
                if job.error_message:
                    click.echo(f"  Error: {job.error_message}")
            else:
                click.echo(f"Job {job_id} not found")
        else:
            stats = queue.get_job_stats()
            click.echo("Job Statistics:")
            for status, count in stats.items():
                click.echo(f"  {status}: {count}")
                
    except Exception as e:
        logger.error(f"Failed to get status: {e}")
        click.echo(f"Error: {e}")


@cli.command()
@click.option('--workers', '-w', default=4, help='Number of worker processes')
def start_workers(workers):
    """Start worker processes to process jobs."""
    logger = get_logger(__name__)
    
    try:
        queue = JobQueue()
        
        def scraper_factory(scraper_class):
            if scraper_class in SCRAPER_REGISTRY:
                return SCRAPER_REGISTRY[scraper_class]()
            else:
                raise ValueError(f"Unknown scraper class: {scraper_class}")
        
        click.echo(f"Starting {workers} workers...")
        asyncio.run(queue.start_workers(worker_count=workers, scraper_factory=scraper_factory))
        
    except KeyboardInterrupt:
        click.echo("Workers stopped")
    except Exception as e:
        logger.error(f"Failed to start workers: {e}")
        click.echo(f"Error: {e}")


@cli.command()
@click.option('--job-id', '-j', required=True, help='Job ID')
@click.option('--cron', help='Cron expression (minute hour day month day_of_week)')
@click.option('--interval', type=int, help='Interval in minutes')
@click.option('--date', help='Run date (YYYY-MM-DD HH:MM:SS)')
def schedule(job_id, cron, interval, date):
    """Schedule a job for recurring execution."""
    logger = get_logger(__name__)
    
    try:
        queue = JobQueue()
        scheduler = ScrapingScheduler(queue)
        
        # Get job details
        job = queue.get_job(job_id)
        if not job:
            click.echo(f"Job {job_id} not found")
            return
        
        async def schedule_job():
            await scheduler.start()
            
            if cron:
                scheduler.add_cron_job(
                    job_id=f"scheduled_{job_id}",
                    name=f"Scheduled {job.name}",
                    url=job.url,
                    scraper_class=job.scraper_class,
                    cron_expression=cron,
                    priority=job.priority,
                    max_retries=job.max_retries
                )
                click.echo(f"Job scheduled with cron: {cron}")
                
            elif interval:
                scheduler.add_interval_job(
                    job_id=f"scheduled_{job_id}",
                    name=f"Scheduled {job.name}",
                    url=job.url,
                    scraper_class=job.scraper_class,
                    interval_minutes=interval,
                    priority=job.priority,
                    max_retries=job.max_retries
                )
                click.echo(f"Job scheduled with interval: {interval} minutes")
                
            elif date:
                from datetime import datetime
                run_date = datetime.strptime(date, '%Y-%m-%d %H:%M:%S')
                scheduler.add_date_job(
                    job_id=f"scheduled_{job_id}",
                    name=f"Scheduled {job.name}",
                    url=job.url,
                    scraper_class=job.scraper_class,
                    run_date=run_date,
                    priority=job.priority,
                    max_retries=job.max_retries
                )
                click.echo(f"Job scheduled for: {date}")
            
            else:
                click.echo("Please specify --cron, --interval, or --date")
                return
            
            # Keep scheduler running
            try:
                while True:
                    await asyncio.sleep(1)
            except KeyboardInterrupt:
                await scheduler.stop()
        
        asyncio.run(schedule_job())
        
    except Exception as e:
        logger.error(f"Failed to schedule job: {e}")
        click.echo(f"Error: {e}")


@cli.command()
@click.option('--format', 'output_format', type=click.Choice(['json', 'csv', 'excel', 'xml']), 
              default='json', help='Export format')
@click.option('--scraper', '-s', help='Filter by scraper name')
@click.option('--limit', '-l', type=int, help='Limit number of records')
def export(output_format, scraper, limit):
    """Export scraped data."""
    logger = get_logger(__name__)
    
    try:
        db = DatabaseManager()
        exporter = DataExporter()
        
        # Get data from database
        data_records = db.get_data(scraper_name=scraper, limit=limit)
        
        if not data_records:
            click.echo("No data found to export")
            return
        
        # Flatten data for export
        export_data = []
        for record in data_records:
            if isinstance(record['data'], list):
                for item in record['data']:
                    item['_scraper_name'] = record['scraper_name']
                    item['_scraped_at'] = record['scraped_at']
                    item['_url'] = record['url']
                    export_data.append(item)
            else:
                record['data']['_scraper_name'] = record['scraper_name']
                record['data']['_scraped_at'] = record['scraped_at']
                record['data']['_url'] = record['url']
                export_data.append(record['data'])
        
        # Export data
        filename = f"export_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        file_path = exporter.export_multiple_formats(
            data=export_data,
            filename=filename,
            formats=[output_format]
        )
        
        if file_path.get(output_format):
            click.echo(f"Data exported to: {file_path[output_format]}")
        else:
            click.echo("Export failed")
            
    except Exception as e:
        logger.error(f"Export failed: {e}")
        click.echo(f"Error: {e}")


@cli.command()
def list_scrapers():
    """List available scrapers."""
    click.echo("Available scrapers:")
    for name, scraper_class in SCRAPER_REGISTRY.items():
        click.echo(f"  {name}: {scraper_class.__doc__ or 'No description'}")


@cli.command()
def stats():
    """Show scraping statistics."""
    logger = get_logger(__name__)
    
    try:
        db = DatabaseManager()
        queue = JobQueue()
        
        # Database stats
        db_stats = db.get_stats()
        click.echo("Database Statistics:")
        click.echo(f"  Total records: {db_stats.get('total_records', 0)}")
        click.echo(f"  Latest scrape: {db_stats.get('latest_scrape', 'Never')}")
        
        # Job queue stats
        job_stats = queue.get_job_stats()
        click.echo("\nJob Queue Statistics:")
        for status, count in job_stats.items():
            click.echo(f"  {status}: {count}")
            
    except Exception as e:
        logger.error(f"Failed to get stats: {e}")
        click.echo(f"Error: {e}")


if __name__ == '__main__':
    cli()







