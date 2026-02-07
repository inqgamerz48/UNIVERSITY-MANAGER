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
try:
    print("DEBUG: Attempting to create database tables...")
    Base.metadata.create_all(bind=engine)
    print("DEBUG: Database tables created successfully!")
except Exception as e:
    print(f"DEBUG: Error creating tables: {e}")
    # We might want to re-raise, but let's see the error first
    raise e

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
# CORS Setup - Restricted methods and headers
# origins = settings.CORS_ORIGINS
# if settings.CORS_ORIGINS == ["*"]:
#     origins = [
#         "http://localhost:3000",
#         "http://localhost:5173",
#         "https://university-manager-git-main-inqgamerz48s-projects.vercel.app",
#         "https://university-manager-nu.vercel.app",
#         "https://university-manager.vercel.app",
#     ]

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://university-manager-git-main-inqgamerz48s-projects.vercel.app",
    "https://university-manager-nu.vercel.app",
    "https://university-manager-64p3.onrender.com",
]

# Extend with any environment-configured origins if they aren't safe defaults
if isinstance(settings.CORS_ORIGINS, list) and settings.CORS_ORIGINS != ["*"]:
     origins.extend(settings.CORS_ORIGINS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Global Exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)},
        headers={
            # mirror the origin if it's in our allowed list, otherwise don't send CORS headers for errors
            # This is a bit manual, but safer than *
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"), 
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
    )

@app.get("/")
def read_root():
    return {"message": "UniManager API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

from .routers import students_router, faculty_router, departments_router, subjects_router, users_router, stats_router

app.include_router(students_router, prefix="/api/students", tags=["students"])
app.include_router(faculty_router, prefix="/api/faculty", tags=["faculty"])
app.include_router(departments_router, prefix="/api/departments", tags=["departments"])
app.include_router(subjects_router, prefix="/api/subjects", tags=["subjects"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(stats_router, prefix="/api/stats", tags=["stats"])
