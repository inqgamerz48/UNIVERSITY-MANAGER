import re
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Convert postgresql:// or postgres:// to postgresql+psycopg:// for psycopg v3
# Also strip any accidental quotes or whitespace from the environment variable
print("DEBUG: Processing DATABASE_URL...")
raw_url = settings.DATABASE_URL.strip()

# Attempt to extract valid URL if it's buried in a psql command or quotes
# Looks for postgres:// or postgresql:// followed by non-quote/non-space characters
match = re.search(r"(postgres(?:ql)?://[^\s'\"]+)", raw_url)
if match:
    print(f"DEBUG: Found valid URL pattern in string. Extracting...")
    raw_url = match.group(1)
else:
    # Fallback to simple stripping if regex finds nothing
    raw_url = raw_url.strip("'").strip('"')

print(f"DEBUG: Cleaned URL scheme: {raw_url.split('://')[0] if '://' in raw_url else 'INVALID'}")

if raw_url.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = raw_url.replace("postgres://", "postgresql+psycopg://", 1)
elif raw_url.startswith("postgresql://"):
    SQLALCHEMY_DATABASE_URL = raw_url.replace("postgresql://", "postgresql+psycopg://", 1)
else:
    SQLALCHEMY_DATABASE_URL = raw_url

print(f"DEBUG: Final SQLALCHEMY_DATABASE_URL scheme: {SQLALCHEMY_DATABASE_URL.split('://')[0]}")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
