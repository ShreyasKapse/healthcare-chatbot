from flask import Blueprint, request, jsonify, current_app
from app.services.ai_service import get_ai_service
from app.services.database import get_db
from app.services.auth_service import clerk_required

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/chat/send', methods=['POST', 'OPTIONS'])
@clerk_required
def send_message():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        message = data.get('message', '')
        conversation_id = data.get('conversation_id')
        
        if not message:
            return jsonify({"error": "No message provided"}), 400
        
        user_data = request.user
        db = get_db()
        ai_service = get_ai_service()
        
        print(f"?? Received message from user {user_data['user_id']}: {message}")
        
        # Get or create user in database
        user = db.get_or_create_user(
            user_data['user_id'],
            user_data['email'],
            user_data.get('first_name'),
            user_data.get('last_name')
        )
        
        if not user:
            return jsonify({"error": "Failed to create user profile"}), 500
        
        # Create new conversation if no conversation_id provided
        if not conversation_id:
            conversation = db.create_conversation(user['id'], message[:50] + "...")
            if conversation:
                conversation_id = conversation['id']
                print(f"Created new conversation: {conversation_id}")
            else:
                return jsonify({"error": "Failed to create conversation"}), 500
        
        # Get conversation history for context
        conversation_history = []
        if conversation_id:
            conversation_history = db.get_conversation_messages(conversation_id)
        
        # Add user message to database
        if conversation_id:
            user_msg_result = db.add_message(conversation_id, message, True)
            if not user_msg_result:
                print("Failed to add user message to database")
            
            # Generate AI response
            ai_response = ai_service.generate_healthcare_response(message, conversation_history, user_profile=user)
            
            print(f"?? AI Response: {ai_response[:1000]}...")
            
            # Add AI response to database
            ai_msg_result = db.add_message(conversation_id, ai_response, False)
            if not ai_msg_result:
                print("Failed to add AI message to database")
            
            return jsonify({
                "success": True,
                "conversation_id": conversation_id,
                "user_message": message,
                "ai_response": ai_response,
                "user": {
                    "id": user_data['user_id'],
                    "email": user_data['email']
                }
            })
        else:
            return jsonify({"error": "Failed to create conversation"}), 500
            
    except Exception as e:
        print(f"? Error in chat endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500

@chat_bp.route('/api/chat/history', methods=['GET'])
@clerk_required
def get_conversation_history():
    """Get authenticated user's conversation history"""
    try:
        user_data = request.user
        db = get_db()
        
        # Get user from database
        user = db.get_or_create_user(
            user_data['user_id'],
            user_data['email']
        )
        if not user:
            return jsonify({"conversations": []})
        
        user_id = user['id']
        conversations = db.get_user_conversations(user_id)
        
        # Get messages for each conversation
        for conversation in conversations:
            messages = db.get_conversation_messages(conversation['id'])
            conversation['message_count'] = len(messages)
            conversation['last_message'] = messages[-1]['content'] if messages else ""
        
        return jsonify({
            "success": True,
            "conversations": conversations
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/api/chat/messages/<conversation_id>', methods=['GET'])
@clerk_required
def get_conversation_messages(conversation_id):
    """Get messages for a specific conversation (authenticated)"""
    try:
        db = get_db()
        messages = db.get_conversation_messages(conversation_id)
        
        return jsonify({
            "success": True,
            "messages": messages
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
