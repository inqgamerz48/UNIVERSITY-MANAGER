from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date, datetime
from .user import User

class StudentBase(BaseModel):
    roll_number: str
    year: int = Field(..., ge=1, le=4)
    semester: int = Field(..., ge=1, le=8)
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    admission_date: Optional[date] = None
    status: str = "active"

class StudentCreate(StudentBase):
    """Schema for creating a student. Requires clerk_id for proper Clerk integration."""
    firebase_uid: str  # FIXED: Now required for proper auth sync
    first_name: str
    last_name: str
    email: EmailStr
    department_id: int

class StudentUpdate(BaseModel):
    year: Optional[int] = Field(None, ge=1, le=4)
    semester: Optional[int] = Field(None, ge=1, le=8)
    phone: Optional[str] = None
    address: Optional[str] = None
    status: Optional[str] = None

class Student(StudentBase):
    id: int
    user_id: int
    department_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    user: Optional[User] = None

    class Config:
        from_attributes = True
