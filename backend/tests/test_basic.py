import pytest
import sys
import os

# Add backend directory to path so we can import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test the health check endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'
    assert 'version' in data

def test_public_chat_endpoint(client):
    """Test the public chat test endpoint"""
    response = client.get('/api/chat/test')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'

def test_home_route(client):
    """Test the home route"""
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'running'
