from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.dataset import DatasetStatus

class DatasetBase(BaseModel):
    name: str
    description: Optional[str] = None

class DatasetCreate(DatasetBase):
    pass

class DatasetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    schema_info: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    status: Optional[DatasetStatus] = None

class DatasetInDB(DatasetBase):
    id: str
    user_id: str
    file_path: Optional[str]
    file_size: Optional[int]
    file_type: Optional[str]
    schema_info: Dict[str, Any]
    metadata: Dict[str, Any]
    status: DatasetStatus
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class Dataset(DatasetInDB):
    pass

class DatasetPreview(BaseModel):
    columns: list[str]
    data: list[list[Any]]
    total_rows: int
    sample_size: int

class DatasetSchema(BaseModel):
    columns: Dict[str, Dict[str, Any]]
    basic_stats: Optional[Dict[str, Any]] = None
    data_quality: Optional[Dict[str, Any]] = None