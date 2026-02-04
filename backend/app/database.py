from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Convert postgresql:// or postgres:// to postgresql+psycopg:// for psycopg v3
# Also strip any accidental quotes or whitespace from the environment variable
print("DEBUG: Processing DATABASE_URL...")
raw_url = settings.DATABASE_URL.strip().strip("'").strip('"')
print(f"DEBUG: Raw URL length: {len(raw_url)}")
print(f"DEBUG: Raw URL scheme: {raw_url.split('://')[0] if '://' in raw_url else 'INVALID'}")

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
