import React from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user } = useUser();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <nav className="border-b border-slate-200 bg-white px-4 py-3 sticky top-0 z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md">
                        <span className="text-xl">🩺</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">HealthAI</h1>
                        <p className="text-[10px] text-blue-600 font-medium tracking-wide">ASSISTANT</p>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                        <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
                        <Link to="/find-doctor" className="hover:text-blue-600 transition-colors">Find Doctor</Link>
                        <Link to="/wellness" className="hover:text-blue-600 transition-colors">Wellness</Link>
                        <Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
                        <Link to="/chat" className="hover:text-blue-600 transition-colors">New Chat</Link>
                        <Link to="/profile" className="hover:text-blue-600 transition-colors">Profile</Link>
                    </div>

                    <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-900">{user?.firstName}</p>
                            <p className="text-xs text-slate-500">Personal Plan</p>
                        </div>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-9 w-9 border-2 border-slate-100 hover:border-blue-500/50 transition-colors"
                                }
                            }}
                        />

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden pt-4 pb-2 space-y-2 border-t border-slate-100 mt-2 bg-white animate-in slide-in-from-top-5 duration-200">
                    <Link to="/dashboard" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                    <Link to="/find-doctor" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Find Doctor</Link>
                    <Link to="/wellness" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Wellness</Link>
                    <Link to="/about" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                    <Link to="/chat" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>New Chat</Link>
                    <Link to="/profile" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
