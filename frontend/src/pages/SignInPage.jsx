import React from 'react';

// Sign in page
export default function SignInPage() {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center px-6 py-16">
            <div className="absolute inset-0 pointer-events-none">
                <div className="h-96 w-96 bg-blue-600/40 rounded-full blur-3xl absolute -top-24 -left-24 animate-pulse"></div>
                <div className="h-72 w-72 bg-indigo-500/30 rounded-full blur-3xl absolute bottom-16 right-10 animate-ping"></div>
            </div>

            <div className="relative w-full max-w-5xl grid gap-8 md:grid-cols-[1.15fr,1fr]">
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 text-white shadow-2xl">
                    <div className="flex items-center gap-3 text-blue-200 text-sm font-medium bg-white/5 border border-white/10 w-fit px-3 py-1.5 rounded-full mb-8">
                        <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></span>
                        Trusted AI Healthcare Companion
                    </div>

                    <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-white mb-4">
                        Personalized guidance for your wellbeing, whenever you need it.
                    </h1>
                    <p className="text-slate-200 text-base md:text-lg mb-10 leading-relaxed max-w-md">
                        Sign in to unlock secure conversations, intelligent symptom insights, and actionable wellness tips powered by responsible AI.
                    </p>

                    <div className="grid gap-4">
                        {[
                            { title: 'Private & Secure', description: 'Your health conversations stay encrypted with HIPAA-aware practices.', icon: '🔒' },
                            { title: 'AI + Human Insight', description: 'Get calm, empathetic responses with clear next-step recommendations.', icon: '🤝' },
                            { title: 'Voice Ready', description: 'Hands-free check-ins using natural speech recognition.', icon: '🎙️' }
                        ].map((feature) => (
                            <div key={feature.title} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                                <span className="text-3xl leading-none">{feature.icon}</span>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                                    <p className="text-sm text-slate-200/80 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 flex flex-col justify-between border border-slate-100">
                    <div>
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30 mb-6">
                            💬
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                            Welcome back
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Sign in with your secure Clerk account to continue your conversation or start a new one with our AI assistant.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => window.Clerk?.openSignIn()}
                                className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white transition-all font-medium"
                            >
                                Sign In Securely
                            </button>

                            <button
                                onClick={() => window.Clerk?.openSignUp()}
                                className="w-full border border-slate-200 text-slate-700 py-3 px-4 rounded-xl hover:border-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white transition-all font-medium"
                            >
                                Create Free Account
                            </button>
                        </div>
                    </div>

                    <div className="mt-10 space-y-4 text-xs text-slate-400 leading-relaxed">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-green-400 rounded-full"></span>
                            End-to-end encrypted conversations
                        </div>
                        <p className="text-slate-400">
                            For urgent needs, please contact local emergency services immediately. This chatbot offers supportive guidance only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
