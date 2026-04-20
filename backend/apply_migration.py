import os
import psycopg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

def apply_migration():
    if not DATABASE_URL:
        print("❌ DATABASE_URL not found in environment variables.")
        return

    try:
        print(f"Connecting to database...")
        with psycopg.connect(DATABASE_URL) as conn:
            with conn.cursor() as cur:
                print("Checking 'users' table...")
                
                # Add columns if they don't exist
                columns = [
                    ("age", "INTEGER"),
                    ("weight", "VARCHAR(50)"),
                    ("allergies", "TEXT"),
                    ("conditions", "TEXT")
                ]
                
                for col_name, col_type in columns:
                    print(f"Adding column '{col_name}'...")
                    cur.execute(f"""
                        ALTER TABLE users 
                        ADD COLUMN IF NOT EXISTS {col_name} {col_type};
                    """)
                
                conn.commit()
                print("✅ Migration applied successfully!")
                
    except Exception as e:
        print(f"❌ Error applying migration: {e}")

if __name__ == "__main__":
    apply_migration()
