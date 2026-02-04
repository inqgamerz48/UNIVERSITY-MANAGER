from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SubjectBase(BaseModel):
    name: str
    code: str
    credits: Optional[int] = None
    semester: Optional[int] = None
    description: Optional[str] = None

class SubjectCreate(SubjectBase):
    department_id: int

class SubjectUpdate(SubjectBase):
    name: Optional[str] = None
    credits: Optional[int] = None
    description: Optional[str] = None

class Subject(SubjectBase):
    id: int
    department_id: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
