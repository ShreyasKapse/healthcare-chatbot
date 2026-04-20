# Database Schema

## Tables
### users
- id (UUID, Primary Key)
- clerk_user_id (String)
- email (String)
- first_name (String)
- last_name (String)
- age (Integer)
- weight (String)
- allergies (Text)
- conditions (Text)
- created_at (Timestamp)

### conversations
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- title (String)
- created_at (Timestamp)
- updated_at (Timestamp)

### messages
- id (UUID, Primary Key)
- conversation_id (UUID, Foreign Key)
- content (Text)
- is_user (Boolean)
- created_at (Timestamp)