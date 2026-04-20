from flask import Flask
from flask_cors import CORS
from app.services.database import get_db

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    
    # Enable CORS for React frontend - allow production URLs
    cors_origins = ["http://localhost:3000"]  # Development
    if not app.config.get('DEBUG'):
        # Add production frontend URL when deployed
        cors_origins.append("https://your-frontend-domain.com")  # Replace with your actual frontend URL
    
    CORS(app, origins=cors_origins)
    
    if app.config.get('DEBUG'):
        print("?? Development mode: Authentication will be bypassed if no token provided")
    else:
        print("?? Production mode: Clerk authentication required")
    
    # Register Blueprints
    from app.routes.main import main_bp
    from app.routes.auth import auth_bp
    from app.routes.chat import chat_bp
    from app.routes.report import report_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(report_bp)
    
    from app.routes.profile import profile_bp
    app.register_blueprint(profile_bp)
    
    print("? All routes registered successfully")
    return app
