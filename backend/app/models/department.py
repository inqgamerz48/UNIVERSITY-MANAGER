from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(10), unique=True, nullable=False)
    description = Column(Text)
    head_faculty_id = Column(Integer, ForeignKey("faculty.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    students = relationship("Student", back_populates="department")
    faculty_members = relationship("Faculty", back_populates="department", foreign_keys="Faculty.department_id")
    head_of_department = relationship("Faculty", foreign_keys=[head_faculty_id], post_update=True)
    subjects = relationship("Subject", back_populates="department")
