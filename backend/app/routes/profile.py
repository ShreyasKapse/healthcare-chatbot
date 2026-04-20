from flask import Blueprint, request, jsonify
from app.services.database import get_db
from app.services.auth_service import clerk_required

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/api/profile', methods=['GET'])
@clerk_required
def get_profile():
    try:
        user_data = request.user
        db = get_db()
        
        # Ensure user exists and get current data
        user = db.get_or_create_user(
            user_data['user_id'],
            user_data['email'],
            user_data.get('first_name'),
            user_data.get('last_name')
        )
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "success": True,
            "profile": user
        })
    except Exception as e:
        print(f"⚠️ Error getting profile: {e}")
        return jsonify({"error": str(e)}), 500

@profile_bp.route('/api/profile', methods=['POST'])
@clerk_required
def update_profile():
    try:
        data = request.get_json()
        user_data = request.user
        db = get_db()
        
        user = db.get_or_create_user(
            user_data['user_id'],
            user_data['email']
        )
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        success = db.update_user_profile(user['id'], data)
        
        if success:
             # Fetch updated user to return confirmation
             updated_user = db.get_user_profile(user['id'])
             # Merge with basic info if needed, but get_user_profile returns the specific fields
             # We can construct a full response if we want, but for now just the profile fields
             return jsonify({
                 "success": True,
                 "profile": updated_user
             })
        else:
            return jsonify({"error": "Failed to update profile"}), 500
            
    except Exception as e:
        print(f"⚠️ Error updating profile: {e}")
        return jsonify({"error": str(e)}), 500
