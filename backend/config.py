import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    DATABASE_URL = os.getenv('DATABASE_URL')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    CLERK_WEBHOOK_SECRET = os.getenv('CLERK_WEBHOOK_SECRET')
    CLERK_PUBLISHABLE_KEY = os.getenv('CLERK_PUBLISHABLE_KEY')
    CLERK_SECRET_KEY = os.getenv('CLERK_SECRET_KEY')