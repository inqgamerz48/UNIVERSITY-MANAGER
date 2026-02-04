from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DepartmentBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    head_faculty_id: Optional[int] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(DepartmentBase):
    name: Optional[str] = None
    code: Optional[str] = None

class Department(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    # We will avoid circular dependency in response model for now
    # or handle it with Late import if needed.
    
    class Config:
        from_attributes = True
