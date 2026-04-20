import os
from uuid import uuid4
from datetime import datetime, date
from typing import Any, Dict, List, Optional

from flask import current_app
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool


class DatabaseService:
    """Database access layer with Neon Postgres primary storage and in-memory fallback."""

    _pool: Optional[ConnectionPool] = None
    _fallback_users: Dict[str, Dict[str, Any]] = {}
    _fallback_conversations: Dict[str, Dict[str, Dict[str, Any]]] = {}
    _fallback_messages: Dict[str, List[Dict[str, Any]]] = {}

    def __init__(self):
        database_url = current_app.config.get('DATABASE_URL')

        if database_url and not DatabaseService._pool:
            try:
                DatabaseService._pool = ConnectionPool(
                    database_url,
                    min_size=1,
                    max_size=5,
                    timeout=10,
                )
                print("✅ Postgres connection pool initialized successfully")
            except Exception as e:
                print(f"⚠️ Postgres initialization error: {e}")

        self.pool = DatabaseService._pool

        if not self.pool:
            print("⚠️ Using in-memory fallback store (database unavailable)")

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def get_or_create_user(self, clerk_user_id, email, first_name=None, last_name=None):
        if not self.pool:
            return self._fallback_get_or_create_user(clerk_user_id, email, first_name, last_name)

        try:
            user = self._execute(
                """
                SELECT id, clerk_user_id, email, first_name, last_name, age, weight, allergies, conditions, created_at
                FROM users
                WHERE clerk_user_id = %s
                LIMIT 1
                """,
                (clerk_user_id,),
                fetch='one'
            )

            if user:
                return self._serialize(user)

            user = self._execute(
                """
                INSERT INTO users (clerk_user_id, email, first_name, last_name)
                VALUES (%s, %s, %s, %s)
                RETURNING id, clerk_user_id, email, first_name, last_name, age, weight, allergies, conditions, created_at
                """,
                (clerk_user_id, email, first_name, last_name),
                fetch='one',
                commit=True
            )
            return self._serialize(user) if user else self._fallback_get_or_create_user(clerk_user_id, email, first_name, last_name)

        except Exception as e:
            print(f"⚠️ Error in get_or_create_user: {e}")
            return self._fallback_get_or_create_user(clerk_user_id, email, first_name, last_name)

    def create_conversation(self, user_id, title):
        if not self.pool:
            return self._fallback_create_conversation(user_id, title)

        try:
            conversation = self._execute(
                """
                INSERT INTO conversations (user_id, title)
                VALUES (%s, %s)
                RETURNING id, user_id, title, created_at, updated_at
                """,
                (user_id, title),
                fetch='one',
                commit=True
            )
            return self._serialize(conversation) if conversation else self._fallback_create_conversation(user_id, title)

        except Exception as e:
            print(f"⚠️ Error creating conversation: {e}")
            return self._fallback_create_conversation(user_id, title)

    def get_user_conversations(self, user_id):
        if not self.pool:
            return self._fallback_get_user_conversations(user_id)

        try:
            conversations = self._execute(
                """
                SELECT id, user_id, title, created_at, updated_at
                FROM conversations
                WHERE user_id = %s
                ORDER BY updated_at DESC
                """,
                (user_id,),
                fetch='all'
            )
            return self._serialize(conversations)

        except Exception as e:
            print(f"⚠️ Error getting conversations: {e}")
            return self._fallback_get_user_conversations(user_id)

    def add_message(self, conversation_id, content, is_user):
        if not self.pool:
            return self._fallback_add_message(conversation_id, content, is_user)

        try:
            message = self._execute(
                """
                INSERT INTO messages (conversation_id, content, is_user)
                VALUES (%s, %s, %s)
                RETURNING id, conversation_id, content, is_user, created_at
                """,
                (conversation_id, content, is_user),
                fetch='one',
                commit=True
            )

            # Update the parent conversation timestamp
            self._execute(
                """
                UPDATE conversations
                SET updated_at = NOW()
                WHERE id = %s
                """,
                (conversation_id,),
                commit=True
            )

            return self._serialize(message)

        except Exception as e:
            print(f"⚠️ Error adding message: {e}")
            return self._fallback_add_message(conversation_id, content, is_user)

    def get_conversation_messages(self, conversation_id):
        if not self.pool:
            return self._fallback_get_conversation_messages(conversation_id)

        try:
            messages = self._execute(
                """
                SELECT id, conversation_id, content, is_user, created_at
                FROM messages
                WHERE conversation_id = %s
                ORDER BY created_at ASC
                """,
                (conversation_id,),
                fetch='all'
            )
            return self._serialize(messages)

        except Exception as e:
            print(f"⚠️ Error getting messages: {e}")
            return self._fallback_get_conversation_messages(conversation_id)

    def update_user_profile(self, user_id, profile_data):
        if not self.pool:
            # Update fallback
            # (In a real scenario, we'd update self._fallback_users but let's just return success for mock)
            return True

        try:
            self._execute(
                """
                UPDATE users
                SET age = %s, weight = %s, allergies = %s, conditions = %s
                WHERE id = %s
                """,
                (
                    profile_data.get('age'),
                    profile_data.get('weight'),
                    profile_data.get('allergies'),
                    profile_data.get('conditions'),
                    user_id
                ),
                commit=True
            )
            return True

        except Exception as e:
            print(f"⚠️ Error updating profile: {e}")
            return False

    def get_user_profile(self, user_id):
        if not self.pool:
            return None # Mock impl incomplete

        try:
            user = self._execute(
                """
                SELECT age, weight, allergies, conditions
                FROM users
                WHERE id = %s
                """,
                (user_id,),
                fetch='one'
            )
            return self._serialize(user)
        except Exception as e:
            print(f"⚠️ Error getting profile: {e}")
            return None

    # ------------------------------------------------------------------
    # Helpers: Postgres execution & serialization
    # ------------------------------------------------------------------

    def _execute(self, query: str, params=None, fetch: str = 'none', commit: bool = False):
        if not self.pool:
            return None

        try:
            with self.pool.connection() as conn:
                with conn.cursor(row_factory=dict_row) as cur:
                    cur.execute(query, params)

                    result = None
                    if fetch == 'one':
                        result = cur.fetchone()
                    elif fetch == 'all':
                        result = cur.fetchall()

                    if commit:
                        conn.commit()

                    return result
        except Exception as e:
            print(f"⚠️ Database query error: {e}")
            return None

    def _serialize(self, data):
        if data is None:
            return None
        if isinstance(data, list):
            return [self._serialize(record) for record in data]
        if isinstance(data, dict):
            return {key: self._serialize_value(value) for key, value in data.items()}
        return self._serialize_value(data)

    @staticmethod
    def _serialize_value(value):
        if isinstance(value, (datetime, date)):
            return value.isoformat()
        return value

    # ------------------------------------------------------------------
    # In-memory fallback implementations
    # ------------------------------------------------------------------

    def _fallback_get_or_create_user(self, clerk_user_id, email, first_name, last_name):
        user = self._fallback_users.get(clerk_user_id)
        if user:
            return user

        user_id = str(uuid4())
        user = {
            'id': user_id,
            'clerk_user_id': clerk_user_id,
            'email': email,
            'first_name': first_name or 'Mock',
            'last_name': last_name or 'User',
            'created_at': datetime.utcnow().isoformat()
        }
        self._fallback_users[clerk_user_id] = user
        return user

    def _fallback_create_conversation(self, user_id, title):
        conversation_id = str(uuid4())
        conversation = {
            'id': conversation_id,
            'user_id': user_id,
            'title': title,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        self._fallback_conversations.setdefault(user_id, {})[conversation_id] = conversation
        self._fallback_messages.setdefault(conversation_id, [])
        return conversation

    def _fallback_get_user_conversations(self, user_id):
        conversations = list(self._fallback_conversations.get(user_id, {}).values())
        return sorted(conversations, key=lambda c: c.get('updated_at', ''), reverse=True)

    def _fallback_add_message(self, conversation_id, content, is_user):
        message_id = str(uuid4())
        message = {
            'id': message_id,
            'conversation_id': conversation_id,
            'content': content,
            'is_user': is_user,
            'created_at': datetime.utcnow().isoformat()
        }
        self._fallback_messages.setdefault(conversation_id, []).append(message)

        for conversations in self._fallback_conversations.values():
            if conversation_id in conversations:
                conversations[conversation_id]['updated_at'] = datetime.utcnow().isoformat()
                break

        return message

    def _fallback_get_conversation_messages(self, conversation_id):
        return list(self._fallback_messages.get(conversation_id, []))


def get_db():
    return DatabaseService()
