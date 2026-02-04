import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    CLERK_SECRET_KEY: str
    CLERK_PEM_PUBLIC_KEY: str
    CLERK_AUDIENCE: str = ""  # Optional: Clerk frontend API for JWT audience verification
from typing import Any, List, Union
from pydantic import field_validator
import json

class Settings(BaseSettings):
    DATABASE_URL: str
    CLERK_SECRET_KEY: str
    CLERK_PEM_PUBLIC_KEY: str
    CLERK_AUDIENCE: str = ""  # Optional: Clerk frontend API for JWT audience verification
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:3000"]
    RATE_LIMIT: str = "100/minute"  # Default rate limit
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, list):
            return v
        if isinstance(v, str) and not v.strip().startswith("["):
            return [i.strip() for i in v.split(",")]
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # Fallback to splitting by comma if JSON parse fails
                return [i.strip() for i in v.split(",")]
        return v

    class Config:
        env_file = ".env"

settings = Settings()
