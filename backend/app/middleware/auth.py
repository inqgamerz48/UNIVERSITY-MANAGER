from fastapi import Header, HTTPException, Depends
from jose import jwt, JWTError
import httpx
import os
from ..config import settings

async def verify_clerk_token(authorization: str = Header(None)) -> dict:
    """
    Verify Clerk JWT token and extract user information including role.
    Security: RS256 verification with optional audience check.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    try:
        # Extract token from "Bearer <token>"
        parts = authorization.split(" ")
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization format")
        
        token = parts[1]
        
        # Build decode options
        decode_options = {}
        decode_kwargs = {
            "algorithms": ["RS256"],
        }
        
        # Verify audience if configured
        if settings.CLERK_AUDIENCE:
            decode_kwargs["audience"] = settings.CLERK_AUDIENCE
        else:
            decode_options["verify_aud"] = False
        
        # Decode JWT with RS256 verification
        payload = jwt.decode(
            token,
            settings.CLERK_PEM_PUBLIC_KEY,
            options=decode_options,
            **decode_kwargs
        )
        
        # Extract user info
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Extract role from public_metadata (default to student)
        metadata = payload.get("public_metadata", {})
        role = metadata.get("role", "student")
        
        return {
            "user_id": user_id,
            "clerk_id": user_id,
            "role": role,
            "email": payload.get("email")
        }
        
    except JWTError:
        # Generic error message to prevent information leakage
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication failed")
