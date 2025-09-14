import os
import uuid
import magic
import aiofiles
from pathlib import Path
from typing import Dict, Any, Optional
from fastapi import UploadFile, HTTPException, status
from minio import Minio
from minio.error import S3Error

from app.core.config import settings

class FileService:
    def __init__(self):
        self.minio_client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE
        )
        self._ensure_buckets_exist()
    
    def _ensure_buckets_exist(self):
        """Ensure required buckets exist"""
        buckets = [
            settings.DATASETS_BUCKET,
            settings.MODELS_BUCKET,
            settings.CACHE_BUCKET
        ]
        
        for bucket in buckets:
            try:
                if not self.minio_client.bucket_exists(bucket):
                    self.minio_client.make_bucket(bucket)
            except S3Error as e:
                print(f"Error creating bucket {bucket}: {e}")
    
    async def save_uploaded_file(self, file: UploadFile, user_id: str) -> Dict[str, Any]:
        """Save uploaded file and return file info"""
        try:
            # Generate unique filename
            file_extension = Path(file.filename).suffix
            unique_filename = f"{user_id}/{uuid.uuid4()}{file_extension}"
            
            # Read file content
            content = await file.read()
            file_size = len(content)
            
            # Detect file type
            file_type = magic.from_buffer(content, mime=True)
            
            # Save to MinIO
            try:
                self.minio_client.put_object(
                    bucket_name=settings.DATASETS_BUCKET,
                    object_name=unique_filename,
                    data=content,
                    length=file_size,
                    content_type=file_type
                )
            except S3Error as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to save file: {str(e)}"
                )
            
            # Extract metadata
            metadata = {
                "original_filename": file.filename,
                "content_type": file.content_type,
                "detected_type": file_type,
                "upload_timestamp": str(uuid.uuid4())  # placeholder
            }
            
            return {
                "file_path": unique_filename,
                "file_size": file_size,
                "file_type": self._get_file_category(file_type),
                "metadata": metadata
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"File upload failed: {str(e)}"
            )
    
    def _get_file_category(self, mime_type: str) -> str:
        """Categorize file based on MIME type"""
        if mime_type.startswith('text/'):
            if mime_type == 'text/csv':
                return 'csv'
            return 'text'
        elif mime_type.startswith('application/'):
            if 'json' in mime_type:
                return 'json'
            elif 'excel' in mime_type or 'spreadsheet' in mime_type:
                return 'xlsx'
            elif 'pdf' in mime_type:
                return 'pdf'
        
        return 'unknown'
    
    async def get_file(self, file_path: str) -> bytes:
        """Retrieve file from storage"""
        try:
            response = self.minio_client.get_object(
                bucket_name=settings.DATASETS_BUCKET,
                object_name=file_path
            )
            return response.read()
        except S3Error as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"File not found: {str(e)}"
            )
    
    async def delete_file(self, file_path: str) -> bool:
        """Delete file from storage"""
        try:
            self.minio_client.remove_object(
                bucket_name=settings.DATASETS_BUCKET,
                object_name=file_path
            )
            return True
        except S3Error as e:
            print(f"Error deleting file {file_path}: {e}")
            return False