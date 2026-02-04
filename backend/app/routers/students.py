from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from typing import List
from slowapi import Limiter
from slowapi.util import get_remote_address
from .. import crud, schemas
from ..database import get_db
from ..middleware.auth import verify_clerk_token
from ..middleware.rbac import RoleChecker, AdminOnly

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/", response_model=List[schemas.Student])
@limiter.limit("60/minute")
async def get_students(
    request: Request,  # Required for rate limiter
    skip: int = Query(default=0, ge=0, description="Number of records to skip"),
    limit: int = Query(default=20, ge=1, le=100, description="Max records to return"),
    department_id: int = Query(None, description="Filter by department"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_clerk_token)
):
    """
    Get students based on role:
    - Admin: All students
    - Faculty: Students from their department
    - Student: Only themselves
    """
    role = current_user.get("role")
    clerk_id = current_user.get("user_id")
    
    db_user = crud.get_user_by_clerk_id(db, clerk_id)
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found in system")
        
    if role == "admin":
        return crud.get_students(db, skip=skip, limit=limit, department_id=department_id)
    elif role == "faculty":
        faculty = crud.get_faculty_by_user_id(db, db_user.id)
        if not faculty:
            raise HTTPException(status_code=403, detail="Faculty profile missing")
        return crud.get_students(db, skip=skip, limit=limit, department_id=faculty.department_id)
    else:
        student = crud.get_student_by_user_id(db, db_user.id)
        if not student:
            raise HTTPException(status_code=403, detail="Student profile missing")
        return [student]

@router.post("/", response_model=schemas.Student)
@limiter.limit("10/minute")
async def create_student(
    request: Request,
    student: schemas.StudentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(AdminOnly)
):
    """Create a new student. Admin only."""
    return crud.create_student(db, student)

@router.get("/{student_id}", response_model=schemas.Student)
@limiter.limit("60/minute")
async def get_student(
    request: Request,
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_clerk_token)
):
    """Get student by ID with role-based access control."""
    role = current_user.get("role")
    clerk_id = current_user.get("user_id")
    
    student = crud.get_student(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if role == "admin":
        return student
    elif role == "faculty":
        db_user = crud.get_user_by_clerk_id(db, clerk_id)
        faculty = crud.get_faculty_by_user_id(db, db_user.id)
        if faculty and faculty.department_id == student.department_id:
            return student
        raise HTTPException(status_code=403, detail="Access denied to this student")
    else:
        db_user = crud.get_user_by_clerk_id(db, clerk_id)
        if student.user_id == db_user.id:
            return student
        raise HTTPException(status_code=403, detail="Access denied")

@router.put("/{student_id}", response_model=schemas.Student)
@limiter.limit("20/minute")
async def update_student(
    request: Request,
    student_id: int,
    student_update: schemas.StudentUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_clerk_token)
):
    """Update student. Admin can update all fields, students can only update phone/address."""
    role = current_user.get("role")
    clerk_id = current_user.get("user_id")
    
    existing = crud.get_student(db, student_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if role == "admin":
        return crud.update_student(db, student_id, student_update)
    
    # Students can only update their own profile
    db_user = crud.get_user_by_clerk_id(db, clerk_id)
    if existing.user_id != db_user.id:
        raise HTTPException(status_code=403, detail="Can only update your own profile")
    
    allowed = {"phone", "address"}
    update_keys = student_update.dict(exclude_unset=True).keys()
    if any(k not in allowed for k in update_keys):
        raise HTTPException(status_code=403, detail="Students can only update phone and address")
    return crud.update_student(db, student_id, student_update)

@router.delete("/{student_id}")
@limiter.limit("10/minute")
async def delete_student(
    request: Request,
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(AdminOnly)
):
    """Delete a student. Admin only."""
    crud.delete_student(db, student_id)
    return {"message": "Student deleted successfully"}
