"""
Data exporters for various formats.
"""

import json
import csv
import pandas as pd
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional
from config.settings import get_settings
from utils.logger import get_logger
from utils.helpers import sanitize_filename


class DataExporter:
    """Handles data export to various formats."""
    
    def __init__(self):
        self.settings = get_settings()
        self.logger = get_logger(__name__)
        self.export_dir = Path(self.settings.storage.data_dir) / "exports"
        self.export_dir.mkdir(parents=True, exist_ok=True)
    
    def export_to_json(
        self,
        data: List[Dict[str, Any]],
        filename: str,
        pretty: bool = True
    ) -> str:
        """Export data to JSON format."""
        try:
            file_path = self.export_dir / f"{sanitize_filename(filename)}.json"
            
            with open(file_path, 'w', encoding='utf-8') as f:
                if pretty:
                    json.dump(data, f, indent=2, ensure_ascii=False, default=str)
                else:
                    json.dump(data, f, ensure_ascii=False, default=str)
            
            self.logger.info(f"Exported {len(data)} records to JSON: {file_path}")
            return str(file_path)
            
        except Exception as e:
            self.logger.error(f"JSON export failed: {e}")
            raise
    
    def export_to_csv(
        self,
        data: List[Dict[str, Any]],
        filename: str,
        delimiter: str = ','
    ) -> str:
        """Export data to CSV format."""
        try:
            if not data:
                raise ValueError("No data to export")
            
            file_path = self.export_dir / f"{sanitize_filename(filename)}.csv"
            
            # Get all unique field names
            fieldnames = set()
            for item in data:
                fieldnames.update(item.keys())
            fieldnames = sorted(list(fieldnames))
            
            with open(file_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames, delimiter=delimiter)
                writer.writeheader()
                writer.writerows(data)
            
            self.logger.info(f"Exported {len(data)} records to CSV: {file_path}")
            return str(file_path)
            
        except Exception as e:
            self.logger.error(f"CSV export failed: {e}")
            raise
    
    def export_to_excel(
        self,
        data: List[Dict[str, Any]],
        filename: str,
        sheet_name: str = "Data"
    ) -> str:
        """Export data to Excel format."""
        try:
            if not data:
                raise ValueError("No data to export")
            
            file_path = self.export_dir / f"{sanitize_filename(filename)}.xlsx"
            
            # Convert to DataFrame
            df = pd.DataFrame(data)
            
            # Export to Excel
            with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name=sheet_name, index=False)
            
            self.logger.info(f"Exported {len(data)} records to Excel: {file_path}")
            return str(file_path)
            
        except Exception as e:
            self.logger.error(f"Excel export failed: {e}")
            raise
    
    def export_to_xml(
        self,
        data: List[Dict[str, Any]],
        filename: str,
        root_element: str = "data",
        record_element: str = "record"
    ) -> str:
        """Export data to XML format."""
        try:
            if not data:
                raise ValueError("No data to export")
            
            file_path = self.export_dir / f"{sanitize_filename(filename)}.xml"
            
            # Create XML structure
            xml_content = f'<?xml version="1.0" encoding="UTF-8"?>\n<{root_element}>\n'
            
            for item in data:
                xml_content += f'  <{record_element}>\n'
                for key, value in item.items():
                    # Escape XML special characters
                    escaped_value = str(value).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    xml_content += f'    <{key}>{escaped_value}</{key}>\n'
                xml_content += f'  </{record_element}>\n'
            
            xml_content += f'</{root_element}>'
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(xml_content)
            
            self.logger.info(f"Exported {len(data)} records to XML: {file_path}")
            return str(file_path)
            
        except Exception as e:
            self.logger.error(f"XML export failed: {e}")
            raise
    
    def export_to_sql(
        self,
        data: List[Dict[str, Any]],
        filename: str,
        table_name: str = "scraped_data"
    ) -> str:
        """Export data to SQL INSERT statements."""
        try:
            if not data:
                raise ValueError("No data to export")
            
            file_path = self.export_dir / f"{sanitize_filename(filename)}.sql"
            
            # Get all unique field names
            fieldnames = set()
            for item in data:
                fieldnames.update(item.keys())
            fieldnames = sorted(list(fieldnames))
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(f"-- SQL Export generated on {datetime.now().isoformat()}\n")
                f.write(f"-- Table: {table_name}\n")
                f.write(f"-- Records: {len(data)}\n\n")
                
                for item in data:
                    # Create INSERT statement
                    columns = ', '.join(fieldnames)
                    values = []
                    
                    for field in fieldnames:
                        value = item.get(field, 'NULL')
                        if value is None:
                            values.append('NULL')
                        elif isinstance(value, str):
                            # Escape single quotes
                            escaped_value = value.replace("'", "''")
                            values.append(f"'{escaped_value}'")
                        else:
                            values.append(str(value))
                    
                    values_str = ', '.join(values)
                    f.write(f"INSERT INTO {table_name} ({columns}) VALUES ({values_str});\n")
            
            self.logger.info(f"Exported {len(data)} records to SQL: {file_path}")
            return str(file_path)
            
        except Exception as e:
            self.logger.error(f"SQL export failed: {e}")
            raise
    
    def export_multiple_formats(
        self,
        data: List[Dict[str, Any]],
        filename: str,
        formats: List[str] = None
    ) -> Dict[str, str]:
        """Export data to multiple formats."""
        if formats is None:
            formats = ['json', 'csv', 'excel']
        
        results = {}
        
        for format_type in formats:
            try:
                if format_type == 'json':
                    file_path = self.export_to_json(data, filename)
                elif format_type == 'csv':
                    file_path = self.export_to_csv(data, filename)
                elif format_type == 'excel':
                    file_path = self.export_to_excel(data, filename)
                elif format_type == 'xml':
                    file_path = self.export_to_xml(data, filename)
                elif format_type == 'sql':
                    file_path = self.export_to_sql(data, filename)
                else:
                    self.logger.warning(f"Unsupported export format: {format_type}")
                    continue
                
                results[format_type] = file_path
                
            except Exception as e:
                self.logger.error(f"Failed to export {format_type}: {e}")
                results[format_type] = None
        
        return results
    
    def get_export_stats(self) -> Dict[str, Any]:
        """Get export statistics."""
        try:
            stats = {
                'total_files': 0,
                'formats': {},
                'total_size': 0,
                'latest_export': None
            }
            
            latest_time = 0
            for file_path in self.export_dir.glob('*'):
                if file_path.is_file():
                    stats['total_files'] += 1
                    file_size = file_path.stat().st_size
                    stats['total_size'] += file_size
                    
                    # Track latest export
                    file_time = file_path.stat().st_mtime
                    if file_time > latest_time:
                        latest_time = file_time
                        stats['latest_export'] = file_path.name
                    
                    # Count by format
                    suffix = file_path.suffix.lower()
                    if suffix in ['.json', '.csv', '.xlsx', '.xml', '.sql']:
                        format_name = suffix[1:]  # Remove dot
                        stats['formats'][format_name] = stats['formats'].get(format_name, 0) + 1
            
            if stats['latest_export']:
                stats['latest_export_time'] = datetime.fromtimestamp(latest_time).isoformat()
            
            return stats
            
        except Exception as e:
            self.logger.error(f"Failed to get export stats: {e}")
            return {}







