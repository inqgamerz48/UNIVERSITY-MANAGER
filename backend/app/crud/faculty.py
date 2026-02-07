from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from .. import models, schemas

def get_faculty(db: Session, faculty_id: int):
    """Get faculty with eager-loaded relationships."""
    return db.query(models.Faculty)\
        .options(joinedload(models.Faculty.user))\
        .options(joinedload(models.Faculty.department))\
        .filter(models.Faculty.id == faculty_id)\
        .first()

def get_faculty_by_user_id(db: Session, user_id: int):
    """Get faculty by internal user ID."""
    return db.query(models.Faculty)\
        .options(joinedload(models.Faculty.department))\
        .filter(models.Faculty.user_id == user_id)\
        .first()

def get_all_faculty(db: Session, skip: int = 0, limit: int = 100):
    """Get all faculty with eager-loaded data."""
    return db.query(models.Faculty)\
        .options(joinedload(models.Faculty.user))\
        .options(joinedload(models.Faculty.department))\
        .offset(skip).limit(limit).all()

def create_faculty(db: Session, faculty: schemas.FacultyCreate):
    """Create faculty with proper Clerk integration."""
    try:
    # Create User entry first
        db_user = crud_user.create_user(
            db, 
            user=schemas.UserCreate(
                email=faculty.email,
                firebase_uid=faculty.firebase_uid,
                first_name=faculty.first_name,
                last_name=faculty.last_name,
                role="faculty"
            )
        )
        # The crud_user.create_user function should handle adding and flushing the user.
        # These lines are likely redundant if create_user already handles it,
        # but are kept as per the provided instruction snippet.
        db.add(db_user)
        db.flush()
        
        db_faculty = models.Faculty(
            user_id=db_user.id,
            employee_id=faculty.employee_id,
            department_id=faculty.department_id,
            designation=faculty.designation,
            qualification=faculty.qualification,
            phone=faculty.phone,
            office_location=faculty.office_location,
            status=faculty.status
        )
        db.add(db_faculty)
        db.commit()
        db.refresh(db_faculty)
        return db_faculty
    except IntegrityError as e:
        db.rollback()
        error_str = str(e).lower()
        if "email" in error_str:
            raise HTTPException(status_code=409, detail="Email already exists")
        elif "employee_id" in error_str:
            raise HTTPException(status_code=409, detail="Employee ID already exists")
        elif "firebase_uid" in error_str:
            raise HTTPException(status_code=409, detail="User already registered")
        raise HTTPException(status_code=409, detail="Duplicate entry detected")
