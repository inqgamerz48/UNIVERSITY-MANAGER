from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware
from .config import settings
from .database import engine, Base
# Import models to ensure they are registered with Base
from .models import User, Department, Faculty, Student, Subject

# Create tables (In production, use Alembic!)
Base.metadata.create_all(bind=engine)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="UniManager API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        # HSTS only in production (when using HTTPS)
        # response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# CORS Setup - Restricted methods and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

@app.get("/")
def read_root():
    return {"message": "UniManager API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

from .routers import students_router, faculty_router, departments_router, subjects_router, users_router

app.include_router(students_router, prefix="/api/students", tags=["students"])
app.include_router(faculty_router, prefix="/api/faculty", tags=["faculty"])
app.include_router(departments_router, prefix="/api/departments", tags=["departments"])
app.include_router(subjects_router, prefix="/api/subjects", tags=["subjects"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
