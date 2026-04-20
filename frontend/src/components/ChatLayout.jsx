import React, { useState } from 'react';
import Sidebar from './Sidebar';


export default function ChatLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-full w-full bg-slate-950 text-white overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex flex-1 flex-col h-full overflow-hidden relative">
                <div className="absolute top-4 left-4 z-30 md:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>

                <main className="flex-1 w-full h-full relative flex flex-col">
                    <div className="md:pl-0 pt-0">
                        {/* Header removed from layout */}
                    </div>
                    <div className="flex-1 relative overflow-hidden">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
