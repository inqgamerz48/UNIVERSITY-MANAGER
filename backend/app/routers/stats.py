from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Student, Faculty, Department, Subject

router = APIRouter()

@router.get("")
def get_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    return {
        "total_students": db.query(Student).count(),
        "total_faculty": db.query(Faculty).count(),
        "total_departments": db.query(Department).count(),
        "total_subjects": db.query(Subject).count(),
    }
