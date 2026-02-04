from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    employee_id = Column(String(20), unique=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    designation = Column(String(50))
    qualification = Column(String(100))
    phone = Column(String(15))
    office_location = Column(String(100))
    joining_date = Column(Date)
    status = Column(String(20), default="active") # active, inactive, retired
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="faculty_profile")
    department = relationship("Department", back_populates="faculty_members", foreign_keys=[department_id])
    subjects = relationship("Subject", secondary="faculty_subjects", back_populates="instructors")

# Many-to-Many Association Table
class FacultySubject(Base):
    __tablename__ = "faculty_subjects"
    
    id = Column(Integer, primary_key=True)
    faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="CASCADE"))
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"))
    academic_year = Column(String(9)) # e.g. "2023-2024"
