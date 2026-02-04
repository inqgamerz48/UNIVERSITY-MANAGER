from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    roll_number = Column(String(20), unique=True, nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    year = Column(Integer) # 1-4
    semester = Column(Integer) # 1-8
    phone = Column(String(15))
    address = Column(Text)
    date_of_birth = Column(Date)
    admission_date = Column(Date)
    status = Column(String(20), default="active") # active, inactive, graduated
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="student_profile")
    department = relationship("Department", back_populates="students")
