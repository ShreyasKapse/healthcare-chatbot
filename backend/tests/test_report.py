import pytest
import io
import sys
import os

# Add backend directory to path so we can import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    # Disable auth for testing or mock it
    app.config['DEBUG'] = True # Bypasses Clerk auth in dev mode
    with app.test_client() as client:
        yield client

def test_report_analysis_no_file(client):
    """Test report analysis without file"""
    response = client.post('/api/analyze/report')
    assert response.status_code == 400
    
def test_report_analysis_mock(client, monkeypatch):
    """Test report analysis with mock file and service"""
    
    # Mock AIService to avoid actual API calls
    class MockAIService:
        def __init__(self):
            self.has_gemini = True
            
        def analyze_medical_report(self, image_data, mime_type):
            return "Mock analysis result"
            
    monkeypatch.setattr('app.routes.report.get_ai_service', lambda: MockAIService())
    
    data = {
        'file': (io.BytesIO(b"fake image data"), 'test.jpg')
    }
    
    response = client.post('/api/analyze/report', data=data, content_type='multipart/form-data')
    
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['success'] is True
    assert json_data['analysis'] == "Mock analysis result"
