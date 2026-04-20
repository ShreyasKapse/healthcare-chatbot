# Deployment Guide

## Backend Deployment

### Option 1: Railway
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables:
   - SECRET_KEY
   - DATABASE_URL
   - GEMINI_API_KEY
   - CLERK_* keys
4. Deploy automatically

### Option 2: Render
1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `gunicorn run:app`
6. Add environment variables (same as above)

## Frontend Deployment

### Option 1: Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Set environment variables:
   - REACT_APP_CLERK_PUBLISHABLE_KEY
4. Deploy automatically

### Option 2: Netlify
1. Go to [Netlify](https://netlify.com)
2. Drag and drop your `build` folder
3. Or connect GitHub for auto-deploy
4. Add environment variables in site settings

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=generate-a-secure-key
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>
GEMINI_API_KEY=your-gemini-api-key
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

### Frontend (.env)
```env
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## Database Migration

1. Create a Neon project (production environment)
2. Run the schema from `docs/database-schema.sql`
3. Update `DATABASE_URL` with the production connection string

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Test voice functionality
- [ ] Check mobile responsiveness
- [ ] Verify medical disclaimers
- [ ] Test error handling
- [ ] Monitor performance
