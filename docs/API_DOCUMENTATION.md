# API Documentation

## Authentication Endpoints

### Webhook
- **URL**: `/api/auth/webhook`
- **Method**: `POST`
- **Description**: Handles Clerk authentication webhooks to sync user data.

## Chat Endpoints

### Send Message
- **URL**: `/api/chat/send`
- **Method**: `POST`
- **Description**: Sends a user message to the AI and gets a response.
- **Body**:
  ```json
  {
    "message": "User's health question",
    "conversation_id": "optional-uuid"
  }
  ```

### Get History
- **URL**: `/api/chat/history`
- **Method**: `GET`
- **Description**: Retrieves the list of conversation threads for the authenticated user.

### Get Messages
- **URL**: `/api/chat/messages/<conversation_id>`
- **Method**: `GET`
- **Description**: Retrieves all messages within a specific conversation.

## Medical Report Endpoints

### Analyze Report
- **URL**: `/api/analyze/report`
- **Method**: `POST`
- **Description**: Uploads and analyzes a medical report file (PDF/Image).
- **Body**: `Multipart/Form-Data` with `file` field.
- **Response**: Returns the AI analysis of the report.

## User Profile Endpoints

### Get Profile
- **URL**: `/api/user/profile`
- **Method**: `GET`
- **Description**: Fetches the current user's profile information.

### Update Profile
- **URL**: `/api/user/profile`
- **Method**: `PUT`
- **Description**: Updates user profile details.
- **Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "gender": "Male",
    "date_of_birth": "1990-01-01",
    "blood_group": "O+",
    "height": 180,
    "weight": 75,
    "allergies": "None",
    "medical_conditions": "None",
    "medications": "None"
  }
  ```

## Client-Side Features (No Backend API)

The following features are implemented primarily on the frontend or use mock data:
- **Find Doctor**: Uses `Leaflet` map and `MOCK_DOCTORS` data in `FindDoctorPage.jsx`.
- **Mental Wellness**: Uses client-side state for mood tracking and browser audio for breathing exercises.