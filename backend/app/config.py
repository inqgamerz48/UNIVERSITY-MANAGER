import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    CLERK_SECRET_KEY: str
    CLERK_PEM_PUBLIC_KEY: str
    CLERK_AUDIENCE: str = ""  # Optional: Clerk frontend API for JWT audience verification
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    RATE_LIMIT: str = "100/minute"  # Default rate limit
    
    class Config:
        env_file = ".env"

settings = Settings()
