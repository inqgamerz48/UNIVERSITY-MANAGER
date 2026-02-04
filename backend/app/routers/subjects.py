from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db
from ..middleware.auth import verify_clerk_token
from ..middleware.rbac import AdminOnly

router = APIRouter()

@router.get("/", response_model=List[schemas.Subject])
async def get_subjects(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),  # FIXED: Added max limit
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_clerk_token)
):
    """Get all subjects. Visible to authenticated users."""
    return crud.get_subjects(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Subject)
async def create_subject(
    subject: schemas.SubjectCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(AdminOnly)  # FIXED: Using new RoleChecker
):
    """Create a new subject. Admin only."""
    return crud.create_subject(db, subject)

@router.get("/{subject_id}", response_model=schemas.Subject)
async def get_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_clerk_token)
):
    """Get single subject."""
    subject = crud.get_subject(db, subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject
