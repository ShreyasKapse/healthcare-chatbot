import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="h-full w-full bg-slate-950 text-white overflow-y-auto selection:bg-blue-500/30">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[96px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-32">

                {/* Hero Section */}
                <section className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            AI Health Assistant v2.0
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                            Your Personal <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 animate-gradient">
                                Health Companion
                            </span>
                        </h1>

                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                            Experience the future of healthcare with instant symptom analysis, report summaries, and personalized wellness advice—available 24/7.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] hover:shadow-blue-600/40 active:scale-[0.98] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative flex items-center justify-center gap-2">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Get Started
                                </span>
                            </button>

                            <button
                                onClick={() => navigate('/chat')}
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-semibold text-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
                            >
                                Try Demo
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-[500px] aspect-square relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-violet-500/20 rounded-[3rem] rotate-3 blur-2xl group-hover:rotate-6 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl p-8 flex flex-col justify-between overflow-hidden">
                            <div className="space-y-4 opacity-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                                        <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                                    </div>
                                </div>
                                <div className="h-32 w-full bg-gradient-to-t from-blue-500/10 to-transparent rounded-2xl border-b border-blue-500/20" />
                            </div>
                            <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transform transition-transform group-hover:-translate-y-2 duration-500">
                                <div className="flex items-center gap-3 text-blue-300 mb-2">
                                    <span className="text-xl">✨</span>
                                    <span className="font-semibold text-sm tracking-widest uppercase">AI Insight</span>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    "Your blood work indicates efficient oxygen transport. Keep maintaining your iron-rich diet!"
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: "🛡️", title: "Private & Secure", desc: "Enterprise-grade encryption ensures your health data remains yours alone.", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                        { icon: "⚡", title: "Instant Analysis", desc: "Upload PDFs or images of medical reports for breakdowns in seconds.", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                        { icon: "🧠", title: "Smart Context", desc: "Our AI remembers past conversations to provide personalized care.", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" }
                    ].map((feature, i) => (
                        <div key={i} className={`p-8 rounded-3xl border backdrop-blur-sm transition-all hover:bg-opacity-20 hover:-translate-y-2 duration-300 shadow-lg ${feature.color.split(' ')[0]} ${feature.color.split(' ').pop()}`}>
                            <div className="w-14 h-14 rounded-2xl bg-inherit flex items-center justify-center text-3xl mb-6 shadow-sm">
                                {feature.icon}
                            </div>
                            <h3 className={`text-2xl font-bold mb-3 ${feature.color.split(' ')[1]}`}>{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
                        </div>
                    ))}
                </section>

                {/* How It Works */}
                <section className="text-center space-y-16">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Simple steps to take control of your health journey.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0" />

                        {[
                            { step: "01", title: "Sign Up", desc: "Create your secure account in seconds." },
                            { step: "02", title: "Upload or Chat", desc: "Share symptoms or medical documents." },
                            { step: "03", title: "Get Insights", desc: "Receive immediate, actionable health advice." },
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center space-y-4 group">
                                <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl font-bold text-blue-500 group-hover:border-blue-500 transition-colors shadow-2xl">
                                    {item.step}
                                </div>
                                <h3 className="text-2xl font-bold">{item.title}</h3>
                                <p className="text-slate-400 max-w-xs">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials */}
                <section className="bg-gradient-to-b from-slate-900/50 to-transparent rounded-[3rem] border border-white/5 p-8 md:p-16 text-center space-y-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Loved by Early Adopters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="p-8 rounded-3xl bg-slate-950/50 border border-white/5 hover:border-blue-500/30 transition-colors">
                            <div className="text-blue-400 text-4xl mb-6">"</div>
                            <p className="text-lg text-slate-300 mb-6 leading-relaxed">HealthAI helped me understand my lab results before I even saw my doctor. It simplified complex terms into plain English. Incredibly useful!</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">JD</div>
                                <div>
                                    <div className="font-bold">John Doe</div>
                                    <div className="text-sm text-slate-500">Beta User</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-950/50 border border-white/5 hover:border-blue-500/30 transition-colors">
                            <div className="text-blue-400 text-4xl mb-6">"</div>
                            <p className="text-lg text-slate-300 mb-6 leading-relaxed">Having a 24/7 assistant to answer my random health questions has reduced my anxiety significantly. The privacy focus is a huge plus.</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold">AS</div>
                                <div>
                                    <div className="font-bold">Sarah Smith</div>
                                    <div className="text-sm text-slate-500">Health Enthusiast</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Is my medical data secure?", a: "Absolutely. We use industry-standard encryption to ensure your data is private and only accessible by you." },
                            { q: "Can I replace my doctor with this?", a: "No. HealthAI is an assistant designed to provide information and summaries. Always consult a professional for medical diagnosis and treatment." },
                            { q: "What kind of reports can I upload?", a: "We support PDF and image formats for standard blood work, prescriptions, and discharge summaries." }
                        ].map((faq, i) => (
                            <div key={i} className="rounded-2xl border border-white/10 bg-slate-900/30 overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-semibold text-lg">{faq.q}</span>
                                    <span className={`transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                {openFaq === i && (
                                    <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-blue-600 to-indigo-600 p-12 md:p-24 text-center space-y-8">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to take charge?</h2>
                        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
                            Join thousands of users optimizing their health today with the power of AI.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Start Your Free Journey
                        </button>
                    </div>
                </section>
            </div>

            {/* Professional Footer */}
            <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1 space-y-4">
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md">
                                <span className="text-xl">🩺</span>
                            </div>
                            <span className="text-xl font-bold text-white">HealthAI</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Empowering you with personal health insights, instantly and securely.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><button onClick={() => navigate('/dashboard')} className="hover:text-blue-400 transition-colors">Dashboard</button></li>
                            <li><button onClick={() => navigate('/find-doctor')} className="hover:text-blue-400 transition-colors">Find Doctors</button></li>
                            <li><button onClick={() => navigate('/chat')} className="hover:text-blue-400 transition-colors">AI Assistant</button></li>
                            <li><button onClick={() => navigate('/profile')} className="hover:text-blue-400 transition-colors">My Profile</button></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-6">Resources</h3>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Health Encyclopedia</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Symptom Checker</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Blog & Articles</a></li>
                            <li><button onClick={() => navigate('/about')} className="hover:text-blue-400 transition-colors">About Us</button></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-6">Legal</h3>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">HIPAA Compliance</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
                    <p>© 2026 HealthAI Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
