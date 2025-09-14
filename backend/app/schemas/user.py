from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.user import SkillLevel

class UserBase(BaseModel):
    email: EmailStr
    skill_level: Optional[SkillLevel] = SkillLevel.BEGINNER
    preferences: Optional[Dict[str, Any]] = {}

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    skill_level: Optional[SkillLevel] = None
    preferences: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class UserInDB(UserBase):
    id: str
    password_hash: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class User(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[datetime] = None