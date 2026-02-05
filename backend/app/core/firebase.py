
import firebase_admin
from firebase_admin import credentials
import os
import json
from app.config import settings

# Initialize Firebase Admin
# We will look for a JSON file path in env or use default service account path
# For now, we assume the user has a serviceAccountKey.json or similar

def initialize_firebase():
    try:
        # Check if already initialized
        firebase_admin.get_app()
    except ValueError:
        # Not initialized
        # Strategy: Try to read JSON from Valid Path defined in Config or generic location
        # Since we don't have the file yet, we will just use Application Default Credentials or a placeholder
        # The user said they have the key as json.
        
        # PROPOSED: Add FIREBASE_CREDENTIALS_PATH to config.
        # But for now, let's look for known file or env var
        
        if settings.FIREBASE_CREDENTIALS_JSON:
             cred = credentials.Certificate(json.loads(settings.FIREBASE_CREDENTIALS_JSON))
        elif os.path.exists("serviceAccountKey.json"):
             cred = credentials.Certificate("serviceAccountKey.json")
        else:
             print("Warning: Firebase serviceAccountKey.json not found and FIREBASE_CREDENTIALS_JSON not set.")
             return 

        firebase_admin.initialize_app(cred)

