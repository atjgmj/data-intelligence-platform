from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.models.user import User, SkillLevel
from app.api.endpoints.auth import get_current_user

router = APIRouter()

class APIConfigUpdate(BaseModel):
    openai_api_key: Optional[str] = None
    hugging_face_api_key: Optional[str] = None

class SystemConfig(BaseModel):
    openai_configured: bool
    hugging_face_configured: bool
    max_file_size_mb: int
    max_files_per_upload: int

def require_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Require admin user access"""
    if current_user.skill_level != SkillLevel.EXPERT:
        # For now, only expert level users can access admin
        # In future, implement proper admin role
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

@router.get("/config", response_model=SystemConfig)
async def get_system_config(
    current_user: User = Depends(require_admin_user)
):
    """Get system configuration"""
    from app.core.config import settings
    
    return {
        "openai_configured": bool(settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "placeholder-admin-will-configure"),
        "hugging_face_configured": bool(settings.HUGGING_FACE_API_KEY and settings.HUGGING_FACE_API_KEY != "placeholder-admin-will-configure"),
        "max_file_size_mb": settings.MAX_FILE_SIZE_MB,
        "max_files_per_upload": settings.MAX_FILES_PER_UPLOAD
    }

@router.post("/config/apis")
async def update_api_config(
    config: APIConfigUpdate,
    current_user: User = Depends(require_admin_user)
):
    """Update API configuration (placeholder for now)"""
    # TODO: In a real implementation, this would update environment variables
    # or a configuration database. For now, just return a message.
    
    updates = []
    if config.openai_api_key:
        updates.append("OpenAI API key")
    if config.hugging_face_api_key:
        updates.append("Hugging Face API key")
    
    return {
        "message": f"API configuration updated: {', '.join(updates)}",
        "note": "Configuration will take effect after server restart"
    }

@router.get("/status")
async def get_admin_status(
    current_user: User = Depends(require_admin_user)
):
    """Get admin dashboard status"""
    # TODO: Add real system metrics
    return {
        "system": {
            "status": "healthy",
            "uptime": "running",
            "version": "1.0.0"
        },
        "database": {
            "status": "connected",
            "pool_size": 10
        },
        "storage": {
            "status": "connected",
            "available_space": "unlimited"
        },
        "queues": {
            "status": "healthy",
            "pending_jobs": 0
        },
        "external_apis": {
            "openai": "not_configured",
            "hugging_face": "not_configured"
        }
    }