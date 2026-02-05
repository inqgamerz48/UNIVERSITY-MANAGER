from fastapi import Header, HTTPException
from firebase_admin import auth
from app.core.firebase import initialize_firebase

# Ensure Firebase is initialized
initialize_firebase()

async def verify_firebase_token(authorization: str = Header(None)) -> dict:
    """
    Verify Firebase ID Token and extract user information.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    try:
        # Extract token from "Bearer <token>"
        parts = authorization.split(" ")
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization format")
        
        token = parts[1]
        
        # Verify ID token
        decoded_token = auth.verify_id_token(token)
        
        # Extract user info
        user_id = decoded_token.get("uid")
        email = decoded_token.get("email")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: No UID found")
            
        # Extract role from Custom Claims
        # Default to 'student' if no role claim set
        role = decoded_token.get("role", "student")
        
        return {
            "user_id": user_id,
            "firebase_uid": user_id,
            "role": role,
            "email": email
        }
        
    except ValueError as e:
        # Token invalid, expired, or malformed
        raise HTTPException(status_code=401, detail=f"Invalid Authorization Token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")

