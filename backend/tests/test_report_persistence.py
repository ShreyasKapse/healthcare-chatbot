import pytest
import io
import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['DEBUG'] = True
    with app.test_client() as client:
        yield client

def test_report_persistence_flow(client, monkeypatch):
    """Test that report analysis creates and persists conversation"""
    
    # Mock AIService
    class MockAIService:
        def __init__(self):
            self.has_gemini = True
        def analyze_medical_report(self, image_data, mime_type):
            return "Mock analysis result"

    monkeypatch.setattr('app.routes.report.get_ai_service', lambda: MockAIService()) # Patch in report.py scope!

    # 1. Upload Report (New Conversation)
    data = {
        'file': (io.BytesIO(b"fake image 1"), 'test1.jpg')
    }
    response = client.post('/api/analyze/report', data=data, content_type='multipart/form-data')
    
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['success'] is True
    conversation_id = json_data.get('conversation_id')
    assert conversation_id is not None
    
    # 2. Upload Second Report (Existing Conversation)
    data2 = {
        'file': (io.BytesIO(b"fake image 2"), 'test2.jpg'),
        'conversation_id': conversation_id
    }
    response2 = client.post('/api/analyze/report', data=data2, content_type='multipart/form-data')
    
    assert response2.status_code == 200
    json_data2 = response2.get_json()
    assert json_data2['success'] is True
    assert json_data2.get('conversation_id') == conversation_id
