from flask import Blueprint, request, jsonify
from app.services.ai_service import get_ai_service
from app.services.auth_service import clerk_required
from app.services.database import get_db
import base64

report_bp = Blueprint('report', __name__)

@report_bp.route('/api/analyze/report', methods=['POST'])
@clerk_required
def analyze_report():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['file']
        conversation_id = request.form.get('conversation_id')
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        if file:
            # Read file data
            file_data = file.read()
            mime_type = file.mimetype
            
            # Get User and DB
            user_data = request.user
            db = get_db()
            
            # Get or create user in DB
            user = db.get_or_create_user(
                user_data['user_id'],
                user_data['email'],
                user_data.get('first_name'),
                user_data.get('last_name')
            )
            
            # Handle conversation creation if needed
            if not conversation_id or conversation_id == 'null':
                conversation = db.create_conversation(user['id'], "Medical Report Analysis")
                conversation_id = conversation['id']
            
            # Save User Message (Implicit upload action)
            user_msg_content = f"I have uploaded a medical report: {file.filename}"
            db.add_message(conversation_id, user_msg_content, True)
            
            # Get AI service
            ai_service = get_ai_service()
            
            # Analyze
            analysis_result = ai_service.analyze_medical_report(file_data, mime_type)
            
            # Save AI Response
            db.add_message(conversation_id, analysis_result, False)
            
            return jsonify({
                "success": True,
                "analysis": analysis_result,
                "conversation_id": conversation_id
            })
            
    except Exception as e:
        print(f"Error in report analysis: {e}")
        return jsonify({"error": str(e)}), 500
