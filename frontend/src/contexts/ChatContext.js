import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { chatAPI } from '../services/api';

const ChatContext = createContext();

// Initial state
const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,
  error: null,
  user: null,
  userProfile: null
};

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CONVERSATIONS: 'SET_CONVERSATIONS',
  SET_CURRENT_CONVERSATION: 'SET_CURRENT_CONVERSATION',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  SET_USER_PROFILE: 'SET_USER_PROFILE'
};

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ACTION_TYPES.SET_CONVERSATIONS:
      return { ...state, conversations: action.payload };

    case ACTION_TYPES.SET_CURRENT_CONVERSATION:
      return { ...state, currentConversation: action.payload };

    case ACTION_TYPES.SET_MESSAGES:
      return { ...state, messages: action.payload };

    case ACTION_TYPES.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };

    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };

    case ACTION_TYPES.SET_USER:
      return { ...state, user: action.payload };

    case ACTION_TYPES.SET_USER_PROFILE:
      return { ...state, userProfile: action.payload };

    default:
      return state;
  }
};

// Provider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user: clerkUser } = useUser();

  // Actions
  const loadConversationHistory = React.useCallback(async () => {
    if (!clerkUser) return;

    try {
      const response = await chatAPI.getConversationHistory();
      if (response.success) {
        dispatch({ type: ACTION_TYPES.SET_CONVERSATIONS, payload: response.conversations });
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  }, [clerkUser]);

  // Set user when Clerk user is available
  useEffect(() => {
    if (clerkUser) {
      dispatch({
        type: ACTION_TYPES.SET_USER,
        payload: {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          fullName: clerkUser.fullName
        }
      });

      // Load user's conversation history
      loadConversationHistory();
    }
  }, [clerkUser, loadConversationHistory]);

  // Load messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (state.currentConversation?.id) {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        try {
          const response = await chatAPI.getConversationMessages(state.currentConversation.id);
          if (response.success) {
            dispatch({ type: ACTION_TYPES.SET_MESSAGES, payload: response.messages });
          }
        } catch (error) {
          console.error('Error loading messages:', error);
          dispatch({
            type: ACTION_TYPES.SET_ERROR,
            payload: 'Failed to load conversation messages'
          });
        } finally {
          dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        }
      } else {
        // Clear messages when starting new chat
        dispatch({ type: ACTION_TYPES.SET_MESSAGES, payload: [] });
      }
    };

    loadMessages();
  }, [state.currentConversation?.id]);

  const sendMessage = async (message) => {
    if (!clerkUser) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: 'Please sign in to send messages'
      });
      return;
    }

    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });

    try {
      // Add user message to UI immediately
      const userMessage = {
        id: Date.now(),
        content: message,
        is_user: true,
        created_at: new Date().toISOString()
      };
      dispatch({ type: ACTION_TYPES.ADD_MESSAGE, payload: userMessage });

      // Send to backend
      const response = await chatAPI.sendMessage(
        message,
        state.currentConversation?.id
      );

      if (response.success) {
        // Add AI response to UI
        const aiMessage = {
          id: Date.now() + 1,
          content: response.ai_response,
          is_user: false,
          created_at: new Date().toISOString()
        };
        dispatch({ type: ACTION_TYPES.ADD_MESSAGE, payload: aiMessage });

        // Update current conversation if new
        if (response.conversation_id && !state.currentConversation) {
          dispatch({
            type: ACTION_TYPES.SET_CURRENT_CONVERSATION,
            payload: { id: response.conversation_id, title: message.substring(0, 50) + '...' }
          });
        }
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: 'Failed to send message. Please try again.'
      });
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  };



  const clearError = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  };

  // Allow components to add messages manually (e.g., from report analysis)
  const addMessage = (message, isUser = false) => {
    const newMessage = {
      id: Date.now(),
      content: message,
      is_user: isUser,
      created_at: new Date().toISOString()
    };
    dispatch({ type: ACTION_TYPES.ADD_MESSAGE, payload: newMessage });
  };

  // Expose setCurrentConversation
  const setCurrentConversation = (conversationId, title) => {
    dispatch({
      type: ACTION_TYPES.SET_CURRENT_CONVERSATION,
      payload: { id: conversationId, title: title || 'New Conversation' }
    });
  };

  const fetchUserProfile = async () => {
    if (!clerkUser) return;
    try {
      const response = await chatAPI.getUserProfile();
      if (response.success && response.profile) {
        dispatch({ type: ACTION_TYPES.SET_USER_PROFILE, payload: response.profile });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserProfile = async (data) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    try {
      const response = await chatAPI.updateUserProfile(data);
      if (response.success && response.profile) {
        dispatch({ type: ACTION_TYPES.SET_USER_PROFILE, payload: response.profile });
        return true;
      }
      return false;
    } catch (e) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Failed to update user profile' });
      return false;
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  };

  const value = {
    ...state,
    sendMessage,
    addMessage,
    loadConversationHistory,
    loadConversationHistory,
    setCurrentConversation,
    fetchUserProfile,
    updateUserProfile,
    clearError,
    isAuthenticated: !!clerkUser
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
