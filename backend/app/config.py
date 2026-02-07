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
    FIREBASE_CREDENTIALS_JSON: str = "" # JSON string of credentials
    CORS_ORIGINS: Union[List[str], str] = ["*"]
    RATE_LIMIT: str = "100/minute"  # Default rate limit
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("["):
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    # Fallback if invalid JSON
                    pass
            # Split by comma for non-JSON strings or failed JSON
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    class Config:
        env_file = ".env"

settings = Settings()
