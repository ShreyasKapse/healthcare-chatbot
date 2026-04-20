import React, { useState, useEffect } from 'react';

const BreathingExercise = () => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
    const [timeLeft, setTimeLeft] = useState(0);

    // Core Animation Loop
    useEffect(() => {
        let timeout;

        if (isActive) {
            if (phase === 'ready') {
                // Start immediately
                setPhase('inhale');
                setTimeLeft(4);
            } else if (phase === 'inhale') {
                timeout = setTimeout(() => {
                    setPhase('hold');
                    setTimeLeft(7);
                }, 4000);
            } else if (phase === 'hold') {
                timeout = setTimeout(() => {
                    setPhase('exhale');
                    setTimeLeft(8);
                }, 7000);
            } else if (phase === 'exhale') {
                timeout = setTimeout(() => {
                    setPhase('inhale');
                    setTimeLeft(4);
                }, 8000);
            }
        } else {
            setPhase('ready');
            setTimeLeft(0);
            clearTimeout(timeout);
        }

        return () => clearTimeout(timeout);
    }, [isActive, phase]);

    // Countdown Timer (Visual only, syncs roughly with phases)
    useEffect(() => {
        if (!isActive || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, timeLeft, phase]);


    const getInstruction = () => {
        switch (phase) {
            case 'inhale': return 'Breathe In...';
            case 'hold': return 'Hold...';
            case 'exhale': return 'Breathe Out...';
            default: return 'Ready?';
        }
    };

    const getScale = () => {
        switch (phase) {
            case 'inhale': return 'scale-150'; // Expand
            case 'hold': return 'scale-150';   // Stay expanded
            case 'exhale': return 'scale-100'; // Contract
            default: return 'scale-100';
        }
    };

    const getColors = () => {
        switch (phase) {
            case 'inhale': return 'from-cyan-400 to-blue-500 shadow-cyan-500/50';
            case 'hold': return 'from-indigo-400 to-purple-500 shadow-indigo-500/50';
            case 'exhale': return 'from-rose-400 to-pink-500 shadow-rose-500/50';
            default: return 'from-blue-400 to-indigo-500 shadow-blue-500/50';
        }
    }

    return (
        <div className="flex flex-col items-center justify-center py-12">

            {/* Main Visual Circle */}
            <div className="relative flex items-center justify-center w-80 h-80 mb-12">
                {/* Outer Glow Rings (Pulsing) */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr opacity-20 blur-3xl transition-all duration-[4000ms] ease-in-out ${getScale()} ${getColors()}`} />
                <div className={`absolute inset-10 rounded-full bg-gradient-to-tr opacity-30 blur-2xl transition-all duration-[4000ms] ease-in-out ${getScale()} ${getColors()}`} />

                {/* Core Circle */}
                <div
                    className={`relative w-48 h-48 rounded-full flex items-center justify-center bg-gradient-to-br shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)] transition-all ease-in-out duration-[4000ms] ${getScale()} ${getColors()}`}
                >
                    <div className="text-white text-center z-10">
                        <div className="text-2xl font-bold mb-1 drop-shadow-md">{getInstruction()}</div>
                        {isActive && <div className="text-4xl font-mono font-light opacity-90">{timeLeft}s</div>}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-6 text-center">
                {!isActive ? (
                    <button
                        onClick={() => setIsActive(true)}
                        className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform hover:shadow-2xl hover:shadow-blue-500/20"
                    >
                        Start Breathing
                    </button>
                ) : (
                    <button
                        onClick={() => setIsActive(false)}
                        className="px-8 py-4 bg-slate-800 text-slate-400 rounded-full font-semibold border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                        Stop Session
                    </button>
                )}

                <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
                    The <strong>4-7-8 Technique</strong> forces the mind to focus on regulating the breath rather than replaying your worries.
                </p>
            </div>

        </div>
    );
};

export default BreathingExercise;
