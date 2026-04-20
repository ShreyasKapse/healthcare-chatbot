# 🏥 Healthcare Chatbot

A comprehensive AI-powered healthcare chatbot providing preliminary medical guidance through text and voice interactions, medical report analysis, and wellness tools.

## 🚀 Features

- **AI-Powered Health Assistance**: Intelligent symptom assessment using Google Gemini AI.
- **Medical Report Analysis**: Upload and analyze medical reports (PDF/Images) for insights using AI.
- **Find Doctor**: Locate specialists and hospitals on an interactive map (integrated with Leaflet).
- **Mental Wellness Zone**: Breathing exercises, mood tracking, and ambient sounds for stress relief.
- **Voice Interaction**: Speech-to-text functionality for accessibility.
- **User Authentication**: Secure user accounts with Clerk.
- **Conversation History**: Persistent chat history per user.
- **Medical Disclaimers**: Responsible AI usage with proper disclaimers.
- **Responsive Design**: Mobile-friendly interface optimized for all devices.

## 🛠 Tech Stack

### Frontend
- **React.js** with Tailwind CSS
- **Clerk** for authentication
- **Axios** for API calls
- **Leaflet & React-Leaflet** for maps
- **Web Speech API** for voice interaction
- **jsPDF** for document generation

### Backend
- **Flask (Python)** REST API
- **Neon (PostgreSQL)** database
- **Google Gemini AI** integration
- **JWT** authentication

### Deployment
- **Frontend**: Vercel/Netlify
- **Backend**: Railway/Render/Heroku
- **Database**: Neon Serverless Postgres

## 🏁 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- Neon account (serverless Postgres)
- Google Gemini API key (free tier available)
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthcare-chatbot
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Backend (`backend/.env`):
   ```env
   SECRET_KEY=your-secret-key
   DATABASE_URL=postgresql://<user>:<password>@<host>/<database>
   GEMINI_API_KEY=your-gemini-api-key
   CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   CLERK_SECRET_KEY=your-clerk-secret-key
   CLERK_WEBHOOK_SECRET=your-clerk-webhook-secret
   ```

   Frontend (`frontend/.env`):
   ```env
   REACT_APP_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   ```

5. **Database Setup**
   
   From the Neon dashboard (or `psql`), run the schema in `docs/database-schema.sql` to create the required tables.

6. **Run Development Servers**
   
   Backend:
   ```bash
   cd backend
   python run.py
   ```

   Frontend:
   ```bash
   cd frontend
   npm start
   ```

## 📂 Project Structure

```
healthcare-chatbot/
+-- backend/
|   +-- app/
|   |   +-- routes/          # API endpoints (auth, chat, report, profile)
|   |   +-- services/        # Business logic & AI integration
|   |   +-- models/          # Data models
|   +-- config.py
|   +-- run.py
+-- frontend/
|   +-- src/
|   |   +-- components/      # React components (Chat, Map, Wellness)
|   |   +-- pages/           # Application pages
|   |   +-- services/        # API services
|   +-- public/
+-- docs/                   # Documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/webhook` - Clerk webhook handler

### Chat & Report
- `POST /api/chat/send` - Send message to chatbot
- `GET /api/chat/history` - Get user conversation history
- `POST /api/analyze/report` - Upload and analyze medical reports

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Connect your repository.
2. Set environment variables.
3. Deploy automatically.

### Frontend Deployment (Vercel/Netlify)
1. Connect your repository.
2. Set build command: `npm run build`.
3. Set publish directory: `build`.
4. Add environment variables.

### Database (Neon)
1. Create a Neon project.
2. Run migration scripts from `docs/database-schema.sql`.
3. Update `DATABASE_URL` in your environment variables.

## 🛡 Security Features

- JWT token authentication
- CORS configuration
- Input validation (Files & Text)
- SQL injection prevention
- Medical disclaimer system

## 📞 Support

For technical support or questions, please contact the development team.

## 📄 License

This project is licensed under the MIT License.
