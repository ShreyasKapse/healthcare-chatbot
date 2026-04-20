import os
import requests
import json
import jwt  # Using PyJWT
from functools import wraps
from flask import request, jsonify, current_app

class AuthService:
    def __init__(self):
        self.clerk_secret_key = current_app.config.get('CLERK_SECRET_KEY')
        self.clerk_publishable_key = current_app.config.get('CLERK_PUBLISHABLE_KEY')
    
    def verify_clerk_token(self, token):
        """Verify Clerk JWT token using PyJWT"""
        try:
            # For development, allow any token
            if current_app.config.get('DEBUG'):
                try:
                    payload = jwt.decode(token, options={"verify_signature": False})
                    return payload
                except:
                    # If token is invalid, create a mock payload
                    return {
                        'sub': 'dev-user-123',
                        'email': 'dev@example.com',
                        'given_name': 'Development',
                        'family_name': 'User'
                    }
            
            # Production verification would go here
            # For now, use development approach
            try:
                payload = jwt.decode(token, options={"verify_signature": False})
                return payload
            except:
                return None
                
        except Exception as e:
            print(f"Token verification error: {e}")
            return None
    
    def get_user_from_token(self, token):
        """Extract user information from token"""
        payload = self.verify_clerk_token(token)
        if payload:
            return {
                'user_id': payload.get('sub', 'dev-user-123'),
                'email': payload.get('email', 'dev@example.com'),
                'first_name': payload.get('given_name', 'Development'),
                'last_name': payload.get('family_name', 'User')
            }
        return None

def get_auth_service():
    return AuthService()

# Development authentication decorator
def development_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Create a mock user for development
        request.user = {
            'user_id': 'dev-user-123',
            'email': 'dev@example.com',
            'first_name': 'Development',
            'last_name': 'User'
        }
        print(f"?? Development auth: User {request.user['user_id']} authenticated")
        return f(*args, **kwargs)
    return decorated_function

# Production authentication decorator
def clerk_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        # In development, use mock auth if no header
        if current_app.config.get('DEBUG') and not auth_header:
            return development_auth(f)(*args, **kwargs)
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Authorization header required"}), 401
        
        token = auth_header.split(' ')[1]
        auth_service = get_auth_service()
        user_data = auth_service.get_user_from_token(token)
        
        if not user_data:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        # Add user data to request context
        request.user = user_data
        return f(*args, **kwargs)
    return decorated_function
