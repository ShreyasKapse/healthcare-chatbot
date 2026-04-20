from flask import Blueprint, jsonify

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def home():
    return {'message': 'Healthcare Chatbot API', 'status': 'running'}

@main_bp.route('/api/health')
def health_check():
    return {
        'status': 'healthy',
        'service': 'Healthcare Chatbot Backend',
        'version': '1.0.0'
    }

# Public test endpoint (no auth required)
@main_bp.route('/api/chat/test', methods=['GET'])
def test_chat():
    return jsonify({"message": "Public chat test endpoint is working!", "status": "success"})
