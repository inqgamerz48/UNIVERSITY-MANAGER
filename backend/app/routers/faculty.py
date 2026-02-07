from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db
from ..middleware.auth import verify_firebase_token
from ..middleware.rbac import AdminOnly

router = APIRouter()

@router.get("/", response_model=List[schemas.Faculty])
async def get_faculty_list(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),  # FIXED: Added max limit
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_firebase_token)
):
    """Get all faculty. Visible to authenticated users."""
    return crud.get_all_faculty(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Faculty)
async def create_faculty(
    faculty: schemas.FacultyCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(AdminOnly)  # FIXED: Using new RoleChecker
):
    """Create a new faculty member. Admin only."""
    return crud.create_faculty(db, faculty)

@router.get("/{faculty_id}", response_model=schemas.Faculty)
async def get_faculty(
    faculty_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_firebase_token)
):
    """Get single faculty member."""
    faculty = crud.get_faculty(db, faculty_id)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return faculty
