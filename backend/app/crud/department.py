from sqlalchemy.orm import Session
from .. import models, schemas

def get_department(db: Session, department_id: int):
    return db.query(models.Department).filter(models.Department.id == department_id).first()

def get_departments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Department).offset(skip).limit(limit).all()

def create_department(db: Session, department: schemas.DepartmentCreate):
    db_dept = models.Department(**department.dict())
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept

def update_department(db: Session, department_id: int, dept_update: schemas.DepartmentUpdate):
    db_dept = get_department(db, department_id)
    if db_dept:
        for k, v in dept_update.dict(exclude_unset=True).items():
            setattr(db_dept, k, v)
        db.commit()
        db.refresh(db_dept)
    return db_dept
