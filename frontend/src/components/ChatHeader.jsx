import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';

// Header with user info
export default function ChatHeader() {
    const { user } = useUser();

    return (
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">Healthcare Chatbot</h1>
                    <p className="text-sm text-gray-600">
                        Welcome, {user?.firstName || user?.username || 'User'}!
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        Secure Chat
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    );
}
