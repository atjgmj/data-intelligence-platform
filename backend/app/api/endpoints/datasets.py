from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.user import User
from app.models.dataset import Dataset
from app.schemas.dataset import Dataset as DatasetSchema, DatasetCreate, DatasetUpdate
from app.api.endpoints.auth import get_current_user
from app.services.file_service import FileService
from app.core.config import settings

router = APIRouter()

@router.post("/upload", response_model=DatasetSchema, status_code=status.HTTP_201_CREATED)
async def upload_dataset(
    file: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload a new dataset"""
    # Validate file size
    if file.size > settings.max_file_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum limit of {settings.MAX_FILE_SIZE_MB}MB"
        )
    
    # Save file using FileService
    file_service = FileService()
    file_info = await file_service.save_uploaded_file(file, current_user.id)
    
    # Create dataset record
    dataset = Dataset(
        user_id=current_user.id,
        name=name,
        description=description,
        file_path=file_info["file_path"],
        file_size=file_info["file_size"],
        file_type=file_info["file_type"],
        metadata=file_info.get("metadata", {})
    )
    
    db.add(dataset)
    await db.commit()
    await db.refresh(dataset)
    
    # TODO: Trigger async schema inference
    # await trigger_schema_inference(dataset.id)
    
    return dataset

@router.get("/", response_model=List[DatasetSchema])
async def list_datasets(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List user's datasets"""
    result = await db.execute(
        select(Dataset).where(Dataset.user_id == current_user.id)
        .order_by(Dataset.created_at.desc())
    )
    datasets = result.scalars().all()
    return datasets

@router.get("/{dataset_id}", response_model=DatasetSchema)
async def get_dataset(
    dataset_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific dataset"""
    result = await db.execute(
        select(Dataset).where(
            Dataset.id == dataset_id,
            Dataset.user_id == current_user.id
        )
    )
    dataset = result.scalar_one_or_none()
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    return dataset

@router.put("/{dataset_id}", response_model=DatasetSchema)
async def update_dataset(
    dataset_id: str,
    dataset_update: DatasetUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a dataset"""
    result = await db.execute(
        select(Dataset).where(
            Dataset.id == dataset_id,
            Dataset.user_id == current_user.id
        )
    )
    dataset = result.scalar_one_or_none()
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # Update dataset fields
    for field, value in dataset_update.dict(exclude_unset=True).items():
        setattr(dataset, field, value)
    
    await db.commit()
    await db.refresh(dataset)
    
    return dataset

@router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dataset(
    dataset_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a dataset"""
    result = await db.execute(
        select(Dataset).where(
            Dataset.id == dataset_id,
            Dataset.user_id == current_user.id
        )
    )
    dataset = result.scalar_one_or_none()
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # TODO: Delete associated files from storage
    # file_service = FileService()
    # await file_service.delete_file(dataset.file_path)
    
    await db.delete(dataset)
    await db.commit()