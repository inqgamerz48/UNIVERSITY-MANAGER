from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db
from ..middleware.auth import verify_clerk_token
from ..middleware.rbac import AdminOnly

router = APIRouter()

@router.get("/", response_model=List[schemas.Department])
async def get_departments(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),  # FIXED: Added max limit
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_clerk_token)
):
    """Get all departments. Visible to authenticated users."""
    return crud.get_departments(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Department)
async def create_department(
    dept: schemas.DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(AdminOnly)  # FIXED: Using new RoleChecker
):
    """Create a new department. Admin only."""
    return crud.create_department(db, dept)

@router.get("/{department_id}", response_model=schemas.Department)
async def get_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_clerk_token)
):
    """Get single department."""
    dept = crud.get_department(db, department_id)
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    return dept
