import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
    const navigate = useNavigate();

    return (
        <div className="h-full w-full bg-slate-950 text-white overflow-y-auto selection:bg-blue-500/30">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '6s' }} />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-24">

                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        About HealthAI
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                        Revolutionizing Healthcare <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Through Intelligence
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        We are on a mission to make personalized health insights accessible to everyone, everywhere, using the power of advanced AI.
                    </p>
                </section>

                {/* Our Mission */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl font-bold">Our Mission</h2>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Healthcare should be proactive, not reactive. We believe that by providing instant access to medical knowledge and personalized analysis, we can empower individuals to make better health decisions every day.
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                Our platform combines cutting-edge large language models with medical domain expertise to interpret reports, answer queries, and track health trends securely and privately.
                            </p>
                        </div>
                        <div className="w-full md:w-1/3 aspect-square bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center border border-white/5">
                            <span className="text-6xl">🚀</span>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="space-y-12">
                    <h2 className="text-3xl font-bold text-center">Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Privacy First", desc: "Your health data is sacred. We enforce strict encryption and never sell your data.", icon: "🔒", color: "text-emerald-400" },
                            { title: "Accuracy", desc: "We prioritize medically grounded insights and always encourage professional consultation.", icon: "🎯", color: "text-blue-400" },
                            { title: "Empathy", desc: "Technology should care. Our AI is designed to be supportive, patient, and understanding.", icon: "💙", color: "text-rose-400" }
                        ].map((value, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all hover:-translate-y-1">
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h3 className={`text-xl font-bold mb-3 ${value.color}`}>{value.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Project Guide
                <section className="space-y-12 text-center">
                    <h2 className="text-3xl font-bold">Project Guide</h2>
                    <div className="max-w-xs mx-auto">
                        <div className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="w-28 h-28 rounded-full bg-slate-800 mx-auto mb-4 overflow-hidden relative border-2 border-blue-500/30 group-hover:border-blue-500 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-5xl shadow-lg">
                                    👨‍🏫
                                </div>
                            </div>
                            <div className="font-bold text-xl text-white mb-1">Prof. Guide Name</div>
                            <div className="text-blue-400 font-medium text-sm tracking-wide">PROJECT GUIDE</div>
                            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                                Provided expert mentorship and technical guidance throughout the development lifecycle of HealthAI.
                            </p>
                        </div>
                    </div>
                </section> */}

 

                {/* CTA */}
                <div className="pt-12 text-center border-t border-white/5">
                    <h2 className="text-3xl font-bold mb-6">Join our journey</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                    >
                        Get Started Now
                    </button>
                </div>

            </div>
        </div>
    );
}
