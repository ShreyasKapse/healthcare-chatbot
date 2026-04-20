from flask import Blueprint, request, jsonify, current_app
from app.services.auth_service import clerk_required

auth_bp = Blueprint('auth', __name__)

# Test endpoint to verify auth is working
@auth_bp.route('/api/auth/test', methods=['GET'])
@clerk_required
def auth_test():
    user_data = request.user
    return jsonify({
        "message": "Authentication is working!",
        "user": user_data,
        "mode": "development" if current_app.config.get('DEBUG') else "production"
    })
