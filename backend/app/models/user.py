# User model placeholder - Using Supabase directly for now
class User:
    def __init__(self, id, email, clerk_user_id=None):
        self.id = id
        self.email = email
        self.clerk_user_id = clerk_user_id
    
    @staticmethod
    def from_dict(data):
        """Create User instance from dictionary"""
        if not data:
            return None
        return User(
            id=data.get('id'),
            email=data.get('email'),
            clerk_user_id=data.get('clerk_user_id')
        )
    
    def to_dict(self):
        """Convert User instance to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'clerk_user_id': self.clerk_user_id
        }
