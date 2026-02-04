from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from .. import crud, schemas
from ..database import get_db
from ..middleware.auth import verify_clerk_token
from ..middleware.rbac import AdminOnly

router = APIRouter()

class RoleUpdateRequest(BaseModel):
    role: str

@router.get("/", response_model=List[schemas.User])
async def get_all_users(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),  # FIXED: Added max limit
    db: Session = Depends(get_db),
    current_user: dict = Depends(AdminOnly)  # Admin only
):
    """Get all users. Admin only."""
    return crud.get_users(db, skip=skip, limit=limit)

@router.put("/{user_id}/role")
async def update_user_role(
    user_id: int,
    role_update: RoleUpdateRequest,  # FIXED: Use body instead of query param
    db: Session = Depends(get_db),
    current_user: dict = Depends(AdminOnly)
):
    """Update user role. Admin only."""
    if role_update.role not in ["admin", "faculty", "student"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be: admin, faculty, or student")
    
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.update_user_role(db, user_id, role_update.role)

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(AdminOnly)
):
    """Delete a user. Admin only."""
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    crud.delete_user(db, user_id)
    return {"message": "User deleted successfully"}
