from .students import router as students_router
from .faculty import router as faculty_router
from .departments import router as departments_router
from .subjects import router as subjects_router
from .users import router as users_router
from .stats import router as stats_router

__all__ = [
    "students_router",
    "faculty_router",
    "departments_router",
    "subjects_router",
    "users_router",
    "stats_router",
]
