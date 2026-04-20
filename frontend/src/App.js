import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { ChatProvider } from './contexts/ChatContext';
import ChatInterface from './components/ChatInterface';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import FindDoctorPage from './pages/FindDoctorPage';
import WellnessPage from './pages/WellnessPage';
import ChatLayout from './components/ChatLayout';
import Navbar from './components/Navbar';
import EmergencyButton from './components/EmergencyButton';
import './App.css';

// Clerk publishable key
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || 'pk_test_your-publishable-key';

// Authentication wrapper component
function AuthenticatedApp() {

  return (
    <ChatProvider>
      <BrowserRouter>
        <div className="App flex flex-col h-screen overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-hidden relative">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/find-doctor" element={<FindDoctorPage />} />
              <Route path="/wellness" element={<WellnessPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chat" element={
                <ChatLayout>
                  <ChatInterface />
                </ChatLayout>
              } />
              <Route path="/chat/:id" element={
                <ChatLayout>
                  <ChatInterface />
                </ChatLayout>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <EmergencyButton />
        </div>
      </BrowserRouter>
    </ChatProvider>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        <AuthenticatedApp />
      </SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </ClerkProvider>
  );
}

export default App;
