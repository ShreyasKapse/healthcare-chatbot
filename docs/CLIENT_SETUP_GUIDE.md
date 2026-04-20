# Client Setup Guide

## Getting Started

Follow these steps to set up the Healthcare Chatbot for your organization.

## Step 1: Account Setup

### 1.1 Neon (Database)
1. Go to [Neon](https://neon.tech)
2. Create a new project (serverless Postgres)
3. Note your connection string (DATABASE_URL)

### 1.2 Google Gemini AI
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Generate a free API key
4. Note: Free tier includes generous usage limits

### 1.3 Clerk (Authentication)
1. Go to [Clerk](https://clerk.com)
2. Create a new application
3. Configure authentication methods
4. Get your credentials:
   - Publishable Key
   - Secret Key
   - Webhook Secret

## Step 2: Environment Configuration

### Backend Setup
1. Copy `backend/.env.example` to `backend/.env`
2. Fill in all values:

```env
SECRET_KEY=generate-a-secure-random-key-here
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>
GEMINI_API_KEY=your-gemini-api-key-here
CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
CLERK_WEBHOOK_SECRET=whsec_your-clerk-webhook-secret
```

### Frontend Setup
1. Copy `frontend/.env.example` (if available) or create `frontend/.env`
2. Fill in the Clerk key:

```env
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
```

## Step 3: Database Setup

1. In the Neon SQL editor (or via `psql`), run the schema from `docs/database-schema.sql`
2. Verify tables are created:
   - users
   - conversations
   - messages
   - user_profiles

## Step 4: Deployment

### Option A: Automated Deployment (Recommended)
Follow the deployment guide in `docs/DEPLOYMENT.md`

### Option B: Manual Deployment
#### Backend:
```bash
cd backend
pip install -r requirements.txt
python run.py
```

#### Frontend:
```bash
cd frontend
npm install
npm start
```

## Step 5: Testing

1. **Authentication**: Test sign-up/sign-in flow
2. **Chat**: Send test messages
3. **Medical Reports**: Upload a sample PDF report and check analysis.
4. **Wellness**: Try the breathing exercise and ambient sounds.
5. **Find Doctor**: Verify the map loads and doctor markers appear.
6. **Voice**: Test microphone functionality
7. **Mobile**: Test responsive design

## Support Information

- **Documentation**: See `docs/` folder
- **API Reference**: Check `README.md` and `docs/API_DOCUMENTATION.md`
- **Troubleshooting**: See `docs/TROUBLESHOOTING.md`

## Security Notes

- Keep all API keys secure
- Rotate keys regularly
- Monitor usage limits
- Set up proper backups
