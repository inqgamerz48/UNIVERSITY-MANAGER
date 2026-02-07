import os
import sqlalchemy
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in environment variables.")
    exit(1)

# Ensure proper SSL mode for production DBs
if "sslmode" not in DATABASE_URL:
    DATABASE_URL += "?sslmode=require"

print(f"Connecting to database...")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        print("Connected! Starting migration...")
        
        # 1. Rename column
        try:
            with conn.begin():
                print("Attempting to rename column 'clerk_id' to 'firebase_uid'...")
                conn.execute(text("ALTER TABLE users RENAME COLUMN clerk_id TO firebase_uid;"))
                print("Column renamed successfully!")
        except Exception as e:
            print(f"Column rename failed (might already be renamed): {e}")

        # 2. Rename index
        try:
            with conn.begin():
                print("Attempting to rename index 'ix_users_clerk_id'...")
                conn.execute(text("ALTER INDEX ix_users_clerk_id RENAME TO ix_users_firebase_uid;"))
                print("Index renamed successfully!")
        except Exception as e:
            print(f"Index rename failed: {e}")

        # 3. Rename constraint
        try:
            with conn.begin():
                print("Attempting to rename constraint 'users_clerk_id_key'...")
                conn.execute(text("ALTER TABLE users RENAME CONSTRAINT users_clerk_id_key TO users_firebase_uid_key;"))
                print("Constraint renamed successfully!")
        except Exception as e:
            print(f"Constraint rename failed: {e}")

    print("\nMigration process completed.")

except Exception as e:
    print(f"Fatal Error: {e}")
