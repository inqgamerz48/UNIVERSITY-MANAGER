from fastapi import HTTPException, Depends
from typing import List
from .auth import verify_firebase_token

def RoleChecker(allowed_roles: List[str]):
    """
    FastAPI-compatible role checker that works with Depends.
    Usage: current_user: dict = Depends(RoleChecker(["admin"]))
    """
    async def check_role(current_user: dict = Depends(verify_firebase_token)) -> dict:
        user_role = current_user.get('role', 'student')
        
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return check_role

# Convenience aliases
AdminOnly = RoleChecker(["admin"])
FacultyOrAdmin = RoleChecker(["admin", "faculty"])
AnyRole = RoleChecker(["admin", "faculty", "student"])
