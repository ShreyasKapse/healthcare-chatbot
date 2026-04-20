import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext';

export default function DashboardPage() {
    const { user } = useUser();
    const { conversations, setCurrentConversation } = useChat();
    const navigate = useNavigate();

    const handleNewChat = () => {
        setCurrentConversation(null);
        navigate('/chat');
    };

    const handleOpenConversation = (conv) => {
        setCurrentConversation(conv.id, conv.title);
        navigate(`/chat/${conv.id}`);
    };

    return (
        <div className="h-full w-full bg-slate-950 text-white overflow-y-auto">
            {/* Background Effects matching Home */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-indigo-900/20 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:px-10 space-y-8">

                {/* Dashboard Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-slate-400 mt-1">Manage your health conversations and insights.</p>
                    </div>
                    <button
                        onClick={handleNewChat}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <span>+</span> New Chat
                    </button>
                </header>

                {/* Stats / Quick Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-sm backdrop-blur-sm">
                        <div className="text-slate-400 text-sm font-medium mb-1">Total Sessions</div>
                        <div className="text-3xl font-bold text-white">{conversations.length}</div>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-sm backdrop-blur-sm">
                        <div className="text-slate-400 text-sm font-medium mb-1">Last Active</div>
                        <div className="text-lg font-semibold text-white">
                            {conversations.length > 0
                                ? new Date(conversations[0]?.updated_at || conversations[0]?.created_at).toLocaleDateString()
                                : 'N/A'}
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-sm backdrop-blur-sm">
                        <div className="text-slate-400 text-sm font-medium mb-1">Plan Status</div>
                        <div className="text-lg font-semibold text-emerald-400">Active Pro</div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Recent History</h2>
                    </div>

                    {conversations.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📭</div>
                            <h3 className="text-lg font-medium text-white">No conversations yet</h3>
                            <p className="text-slate-400 mt-1 mb-6">Start a new chat to track your symptoms or analyze reports.</p>
                            <button onClick={handleNewChat} className="text-blue-400 font-medium hover:text-blue-300 transition-colors">Start Consultation</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => handleOpenConversation(conv)}
                                    className="group cursor-pointer bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-medium text-slate-400 bg-slate-950 px-2 py-1 rounded-full border border-slate-800">
                                            {new Date(conv.updated_at || conv.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-blue-300 transition-colors">
                                        {conv.title || 'Untitled Conversation'}
                                    </h3>
                                    <p className="text-slate-400 text-sm line-clamp-2 h-10 leading-relaxed mb-4">
                                        {conv.last_message || 'Start the conversation to get insights...'}
                                    </p>

                                    <div className="flex items-center text-blue-400 text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                        Resume Chat →
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
