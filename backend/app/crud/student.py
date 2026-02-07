import uuid
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from .. import models, schemas

def get_student(db: Session, student_id: int):
    """Get single student with eager-loaded user data."""
    return db.query(models.Student)\
        .options(joinedload(models.Student.user))\
        .filter(models.Student.id == student_id)\
        .first()

def get_student_by_user_id(db: Session, user_id: int):
    """Get student by internal user ID."""
    return db.query(models.Student)\
        .options(joinedload(models.Student.user))\
        .filter(models.Student.user_id == user_id)\
        .first()

def get_students(db: Session, skip: int = 0, limit: int = 100, department_id: int = None):
    """Get students with eager-loaded relationships to prevent N+1."""
    query = db.query(models.Student)\
        .options(joinedload(models.Student.user))\
        .options(joinedload(models.Student.department))
    if department_id:
        query = query.filter(models.Student.department_id == department_id)
    return query.offset(skip).limit(limit).all()

from .user import create_user

def create_student(db: Session, student: schemas.StudentCreate):
    """Create a new student with associated user record."""
    try:
        # Create User entry first
        db_user = create_user(
            db, 
            user=schemas.UserCreate(
                email=student.email,
                firebase_uid=student.firebase_uid,
                first_name=student.first_name,
                last_name=student.last_name,
                role="student"
            )
        )
        
        db_student = models.Student(
            user_id=db_user.id,
            roll_number=student.roll_number,
            department_id=student.department_id,
            year=student.year,
            semester=student.semester,
            phone=student.phone,
            address=student.address,
            status=student.status
        )
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        return db_student
    except IntegrityError as e:
        db.rollback()
        error_str = str(e).lower()
        if "email" in error_str:
            raise HTTPException(status_code=409, detail="Email already exists")
        elif "roll_number" in error_str:
            raise HTTPException(status_code=409, detail="Roll number already exists")
        elif "firebase_uid" in error_str:
            raise HTTPException(status_code=409, detail="User already registered")
        raise HTTPException(status_code=409, detail="Duplicate entry detected")

def update_student(db: Session, student_id: int, student_update: schemas.StudentUpdate):
    db_student = get_student(db, student_id)
    if not db_student:
        return None
    
    update_data = student_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_student, key, value)
        
    try:
        db.commit()
        db.refresh(db_student)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Update failed due to duplicate data")
    return db_student

def delete_student(db: Session, student_id: int):
    student = get_student(db, student_id)
    if student:
        user_id = student.user_id
        db.delete(student)
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user:
            db.delete(user)
        db.commit()
    return student
