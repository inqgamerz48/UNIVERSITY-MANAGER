from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime
from .user import User

class FacultyBase(BaseModel):
    employee_id: str
    designation: Optional[str] = None
    qualification: Optional[str] = None
    phone: Optional[str] = None
    office_location: Optional[str] = None
    joining_date: Optional[date] = None
    status: str = "active"

class FacultyCreate(FacultyBase):
    """Schema for creating faculty. Requires clerk_id for proper Clerk integration."""
    clerk_id: str  # FIXED: Now required for proper auth sync
    first_name: str
    last_name: str
    email: EmailStr
    department_id: int

class FacultyUpdate(BaseModel):
    designation: Optional[str] = None
    qualification: Optional[str] = None
    office_location: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None

class Faculty(FacultyBase):
    id: int
    user_id: int
    department_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    user: Optional[User] = None
    
    class Config:
        from_attributes = True
