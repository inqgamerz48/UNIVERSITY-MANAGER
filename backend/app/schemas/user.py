from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: str = "student"

class UserCreate(UserBase):
    clerk_id: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = None

class User(UserBase):
    id: int
    clerk_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
