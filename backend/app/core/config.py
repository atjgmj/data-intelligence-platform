from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = Field(..., description="Database connection URL")
    TEST_DATABASE_URL: Optional[str] = Field(None, description="Test database URL")
    
    # Redis
    REDIS_URL: str = Field(..., description="Redis connection URL")
    
    # MinIO/S3
    MINIO_ENDPOINT: str = Field(..., description="MinIO endpoint")
    MINIO_ACCESS_KEY: str = Field(..., description="MinIO access key")
    MINIO_SECRET_KEY: str = Field(..., description="MinIO secret key")
    MINIO_SECURE: bool = Field(False, description="Use HTTPS for MinIO")
    
    # JWT
    JWT_SECRET: str = Field(..., description="JWT secret key")
    JWT_ALGORITHM: str = Field("HS256", description="JWT algorithm")
    JWT_EXPIRE_MINUTES: int = Field(30, description="JWT expiration time in minutes")
    
    # External APIs
    OPENAI_API_KEY: Optional[str] = Field(None, description="OpenAI API key")
    HUGGING_FACE_API_KEY: Optional[str] = Field(None, description="Hugging Face API key")
    
    # App Settings
    ENVIRONMENT: str = Field("development", description="Environment")
    LOG_LEVEL: str = Field("INFO", description="Log level")
    
    # File Upload
    MAX_FILE_SIZE_MB: int = Field(2048, description="Max file size in MB")
    MAX_FILES_PER_UPLOAD: int = Field(10, description="Max files per upload")
    
    # Security
    ALLOWED_HOSTS: List[str] = Field(["*"], description="Allowed hosts")
    ALLOWED_ORIGINS: List[str] = Field(["*"], description="Allowed CORS origins")
    
    # Buckets
    DATASETS_BUCKET: str = Field("datasets", description="MinIO bucket for datasets")
    MODELS_BUCKET: str = Field("models", description="MinIO bucket for ML models")
    CACHE_BUCKET: str = Field("cache", description="MinIO bucket for cache")
    
    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"
    
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"
    
    @property
    def max_file_size_bytes(self) -> int:
        return self.MAX_FILE_SIZE_MB * 1024 * 1024

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()