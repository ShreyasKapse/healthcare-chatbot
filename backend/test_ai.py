import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.ai_service import AIService

# Test the AI service
ai_service = AIService()
response = ai_service.generate_healthcare_response("I have a headache")
print("AI Service Test:")
print(f"Response: {response}")
print("? AI service is working!")
