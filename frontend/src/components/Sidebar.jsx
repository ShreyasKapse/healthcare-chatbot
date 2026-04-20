import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext';

export default function Sidebar({ isOpen, onClose }) {
    const { conversations, currentConversation, setCurrentConversation, loadConversationHistory, loading } = useChat();
    const navigate = useNavigate();

    useEffect(() => {
        loadConversationHistory();
    }, [loadConversationHistory]);

    const handleNewChat = () => {
        setCurrentConversation(null); // Clear current conversation to start fresh
        navigate('/chat');
        if (window.innerWidth < 768) {
            onClose();
        }
    };

    const handleSelectConversation = (conv) => {
        setCurrentConversation(conv.id, conv.title);
        navigate(`/chat/${conv.id}`);
        if (window.innerWidth < 768) {
            onClose();
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-white/10 bg-slate-900/95 shadow-xl backdrop-blur-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-full flex-col p-4">

                    {/* New Chat Button */}
                    <button
                        onClick={handleNewChat}
                        disabled={loading && !conversations.length}
                        className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 active:scale-[0.98]"
                    >
                        <span className="text-lg">+</span> New Chat
                    </button>

                    {/* Conversations List */}
                    <div className="mt-6 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                        <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Recent History
                        </h3>

                        {loading && conversations.length === 0 ? (
                            <div className="flex flex-col gap-2 p-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-white/5" />
                                ))}
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="px-2 text-sm text-slate-500 text-center py-4">
                                No history yet.
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {conversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => handleSelectConversation(conv)}
                                        className={`group flex w-full flex-col gap-1 rounded-lg px-3 py-3 text-left transition-all ${currentConversation?.id === conv.id
                                            ? 'bg-white/10 text-white shadow-sm'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                            }`}
                                    >
                                        <span className="truncate text-sm font-medium">
                                            {conv.title || 'Untitled Conversation'}
                                        </span>
                                        <span className="text-[10px] opacity-60">
                                            {new Date(conv.updated_at || conv.created_at).toLocaleDateString()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* User Profile / Lower section could go here if needed */}
                </div>
            </div>
        </>
    );
}
