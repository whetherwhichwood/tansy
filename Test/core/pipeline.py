"""
Data pipeline with validation, transformation, and multi-format export.
"""

import json
import csv
import pandas as pd
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass, asdict
from pydantic import BaseModel, ValidationError
from config.settings import get_settings
from utils.logger import get_logger
from utils.helpers import sanitize_filename


class DataValidationError(Exception):
    """Raised when data validation fails."""
    pass


@dataclass
class ExportResult:
    """Result of data export operation."""
    format: str
    file_path: str
    record_count: int
    success: bool
    error_message: Optional[str] = None


class DataPipeline:
    """Data pipeline for processing and exporting scraped data."""
    
    def __init__(self):
        self.settings = get_settings()
        self.logger = get_logger(__name__)
        self.data_dir = Path(self.settings.storage.data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.export_formats = self.settings.storage.export_formats
        
    def validate_data(self, data: Any, schema: Optional[BaseModel] = None) -> bool:
        """Validate data against schema if provided."""
        if schema is None:
            return True
        
        try:
            if isinstance(data, list):
                for item in data:
                    schema(**item)
            else:
                schema(**data)
            return True
        except ValidationError as e:
            self.logger.error(f"Data validation failed: {e}")
            return False
    
    def clean_data(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Clean and normalize scraped data."""
        cleaned_data = []
        
        for item in data:
            cleaned_item = {}
            for key, value in item.items():
                # Clean text values
                if isinstance(value, str):
                    cleaned_item[key] = value.strip()
                else:
                    cleaned_item[key] = value
            
            # Add metadata
            cleaned_item['_scraped_at'] = datetime.utcnow().isoformat()
            cleaned_item['_scraper_id'] = id(self)
            
            cleaned_data.append(cleaned_item)
        
        return cleaned_data
    
    def deduplicate_data(self, data: List[Dict[str, Any]], key_fields: List[str]) -> List[Dict[str, Any]]:
        """Remove duplicate records based on key fields."""
        seen = set()
        unique_data = []
        
        for item in data:
            # Create key from specified fields
            key = tuple(str(item.get(field, '')) for field in key_fields)
            
            if key not in seen:
                seen.add(key)
                unique_data.append(item)
            else:
                self.logger.debug(f"Duplicate record found: {key}")
        
        self.logger.info(f"Deduplicated data: {len(data)} -> {len(unique_data)} records")
        return unique_data
    
    def transform_data(self, data: List[Dict[str, Any]], transformations: Dict[str, str]) -> List[Dict[str, Any]]:
        """Apply transformations to data fields."""
        transformed_data = []
        
        for item in data:
            transformed_item = item.copy()
            
            for field, transformation in transformations.items():
                if field in transformed_item:
                    try:
                        if transformation == 'uppercase':
                            transformed_item[field] = str(transformed_item[field]).upper()
                        elif transformation == 'lowercase':
                            transformed_item[field] = str(transformed_item[field]).lower()
                        elif transformation == 'strip':
                            transformed_item[field] = str(transformed_item[field]).strip()
                        elif transformation.startswith('replace:'):
                            old, new = transformation.split(':', 2)[1:]
                            transformed_item[field] = str(transformed_item[field]).replace(old, new)
                        elif transformation.startswith('extract_number'):
                            import re
                            numbers = re.findall(r'\d+\.?\d*', str(transformed_item[field]))
                            transformed_item[field] = float(numbers[0]) if numbers else 0
                    except Exception as e:
                        self.logger.warning(f"Transformation failed for field {field}: {e}")
            
            transformed_data.append(transformed_item)
        
        return transformed_data
    
    def export_to_json(self, data: List[Dict[str, Any]], filename: str) -> ExportResult:
        """Export data to JSON format."""
        try:
            file_path = self.data_dir / f"{filename}.json"
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False, default=str)
            
            self.logger.info(f"Exported {len(data)} records to JSON: {file_path}")
            return ExportResult(
                format='json',
                file_path=str(file_path),
                record_count=len(data),
                success=True
            )
            
        except Exception as e:
            self.logger.error(f"JSON export failed: {e}")
            return ExportResult(
                format='json',
                file_path=str(file_path),
                record_count=0,
                success=False,
                error_message=str(e)
            )
    
    def export_to_csv(self, data: List[Dict[str, Any]], filename: str) -> ExportResult:
        """Export data to CSV format."""
        try:
            if not data:
                return ExportResult('csv', '', 0, False, 'No data to export')
            
            file_path = self.data_dir / f"{filename}.csv"
            
            # Get all unique field names
            fieldnames = set()
            for item in data:
                fieldnames.update(item.keys())
            fieldnames = sorted(list(fieldnames))
            
            with open(file_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(data)
            
            self.logger.info(f"Exported {len(data)} records to CSV: {file_path}")
            return ExportResult(
                format='csv',
                file_path=str(file_path),
                record_count=len(data),
                success=True
            )
            
        except Exception as e:
            self.logger.error(f"CSV export failed: {e}")
            return ExportResult(
                format='csv',
                file_path=str(file_path),
                record_count=0,
                success=False,
                error_message=str(e)
            )
    
    def export_to_excel(self, data: List[Dict[str, Any]], filename: str) -> ExportResult:
        """Export data to Excel format."""
        try:
            if not data:
                return ExportResult('excel', '', 0, False, 'No data to export')
            
            file_path = self.data_dir / f"{filename}.xlsx"
            
            # Convert to DataFrame
            df = pd.DataFrame(data)
            
            # Export to Excel
            with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name='Data', index=False)
            
            self.logger.info(f"Exported {len(data)} records to Excel: {file_path}")
            return ExportResult(
                format='excel',
                file_path=str(file_path),
                record_count=len(data),
                success=True
            )
            
        except Exception as e:
            self.logger.error(f"Excel export failed: {e}")
            return ExportResult(
                format='excel',
                file_path=str(file_path),
                record_count=0,
                success=False,
                error_message=str(e)
            )
    
    def export_to_xml(self, data: List[Dict[str, Any]], filename: str) -> ExportResult:
        """Export data to XML format."""
        try:
            if not data:
                return ExportResult('xml', '', 0, False, 'No data to export')
            
            file_path = self.data_dir / f"{filename}.xml"
            
            # Create XML structure
            xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n'
            
            for item in data:
                xml_content += '  <record>\n'
                for key, value in item.items():
                    # Escape XML special characters
                    escaped_value = str(value).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    xml_content += f'    <{key}>{escaped_value}</{key}>\n'
                xml_content += '  </record>\n'
            
            xml_content += '</data>'
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(xml_content)
            
            self.logger.info(f"Exported {len(data)} records to XML: {file_path}")
            return ExportResult(
                format='xml',
                file_path=str(file_path),
                record_count=len(data),
                success=True
            )
            
        except Exception as e:
            self.logger.error(f"XML export failed: {e}")
            return ExportResult(
                format='xml',
                file_path=str(file_path),
                record_count=0,
                success=False,
                error_message=str(e)
            )
    
    def export_data(
        self,
        data: List[Dict[str, Any]],
        filename: str,
        formats: Optional[List[str]] = None,
        clean: bool = True,
        deduplicate: bool = False,
        key_fields: Optional[List[str]] = None,
        transformations: Optional[Dict[str, str]] = None
    ) -> List[ExportResult]:
        """Export data to multiple formats with optional processing."""
        if not data:
            self.logger.warning("No data to export")
            return []
        
        # Use provided formats or default
        export_formats = formats or self.export_formats
        
        # Process data
        processed_data = data.copy()
        
        if clean:
            processed_data = self.clean_data(processed_data)
        
        if deduplicate and key_fields:
            processed_data = self.deduplicate_data(processed_data, key_fields)
        
        if transformations:
            processed_data = self.transform_data(processed_data, transformations)
        
        # Sanitize filename
        safe_filename = sanitize_filename(filename)
        
        # Export to each format
        results = []
        for format_type in export_formats:
            if format_type == 'json':
                result = self.export_to_json(processed_data, safe_filename)
            elif format_type == 'csv':
                result = self.export_to_csv(processed_data, safe_filename)
            elif format_type == 'excel':
                result = self.export_to_excel(processed_data, safe_filename)
            elif format_type == 'xml':
                result = self.export_to_xml(processed_data, safe_filename)
            else:
                self.logger.warning(f"Unsupported export format: {format_type}")
                continue
            
            results.append(result)
        
        return results
    
    def get_export_stats(self) -> Dict[str, Any]:
        """Get statistics about exported data."""
        try:
            stats = {
                'total_files': 0,
                'formats': {},
                'total_size': 0
            }
            
            for file_path in self.data_dir.glob('*'):
                if file_path.is_file():
                    stats['total_files'] += 1
                    stats['total_size'] += file_path.stat().st_size
                    
                    # Count by format
                    suffix = file_path.suffix.lower()
                    if suffix in ['.json', '.csv', '.xlsx', '.xml']:
                        format_name = suffix[1:]  # Remove dot
                        stats['formats'][format_name] = stats['formats'].get(format_name, 0) + 1
            
            return stats
            
        except Exception as e:
            self.logger.error(f"Failed to get export stats: {e}")
            return {}
    
    def cleanup_old_exports(self, days: int = 30):
        """Remove old export files."""
        try:
            cutoff_time = datetime.now().timestamp() - (days * 24 * 60 * 60)
            removed_count = 0
            
            for file_path in self.data_dir.glob('*'):
                if file_path.is_file() and file_path.stat().st_mtime < cutoff_time:
                    file_path.unlink()
                    removed_count += 1
            
            self.logger.info(f"Cleaned up {removed_count} old export files")
            
        except Exception as e:
            self.logger.error(f"Failed to cleanup old exports: {e}")







