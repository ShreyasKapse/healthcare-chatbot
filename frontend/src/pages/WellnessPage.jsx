import React, { useState, useEffect, useRef } from 'react';
import BreathingExercise from '../components/BreathingExercise';

const WellnessPage = () => {
    const [mood, setMood] = useState(null);
    const [activeSound, setActiveSound] = useState(null);
    const [audioError, setAudioError] = useState(null);
    const audioRef = useRef(null);

    const moods = [
        { emoji: '😊', label: 'Happy', color: 'bg-green-500' },
        { emoji: '😐', label: 'Neutral', color: 'bg-yellow-500' },
        { emoji: '😪', label: 'Tired', color: 'bg-blue-400' },
        { emoji: '😫', label: 'Stressed', color: 'bg-orange-500' },
        { emoji: '😰', label: 'Anxious', color: 'bg-purple-500' }
    ];

    const sounds = [
        { id: 'rain', label: 'Rain', url: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3' },
        { id: 'forest', label: 'Forest', url: 'https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3' },
        { id: 'ocean', label: 'Ocean', url: 'https://assets.mixkit.co/active_storage/sfx/1196/1196-preview.mp3' },
        { id: 'fire', label: 'Campfire', url: 'https://assets.mixkit.co/active_storage/sfx/2508/2508-preview.mp3' }
    ];

    useEffect(() => {
        if (activeSound) {
            const sound = sounds.find(s => s.id === activeSound);
            if (sound) {
                if (audioRef.current) {
                    audioRef.current.pause();
                }
                audioRef.current = new Audio(sound.url);
                audioRef.current.loop = true;
                audioRef.current.play().catch(e => {
                    console.error("Audio play failed:", e);
                    setAudioError("Unable to play some sounds due to browser restrictions. Try interacting with the page first.");
                });
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [activeSound]);

    const handleSoundToggle = (soundId) => {
        setAudioError(null);
        if (activeSound === soundId) {
            setActiveSound(null);
        } else {
            setActiveSound(soundId);
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-slate-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        Mental Wellness Zone
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg">
                        Take a moment to pause, breathe, and reset. Your mental health is just as important as your physical health.
                    </p>
                </div>

                {/* Mood Check-In */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 shadow-xl">
                    <h2 className="text-xl font-semibold text-white mb-6 text-center">How are you feeling today?</h2>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {moods.map((m) => (
                            <button
                                key={m.label}
                                onClick={() => setMood(m.label)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:scale-110 ${mood === m.label ? 'bg-slate-800 ring-2 ring-blue-500 scale-110' : 'hover:bg-slate-800/50'}`}
                            >
                                <span className="text-4xl shadow-sm filter drop-shadow-lg">{m.emoji}</span>
                                <span className={`text-xs font-medium ${mood === m.label ? 'text-white' : 'text-slate-500'}`}>{m.label}</span>
                            </button>
                        ))}
                    </div>
                    {mood && (
                        <div className="text-center mt-6 animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-slate-300">
                                Scanning your mood... <span className="text-blue-400 font-semibold">{mood}</span>.
                                {mood === 'Stressed' || mood === 'Anxious' ? " Let's try a breathing exercise together." : " Great to track your well-being!"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Breathing Exercise Card */}
                <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
                    <div className="p-8">
                        <BreathingExercise />
                    </div>
                </div>

                {/* Ambient Sounds */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-400 text-center">Ambient Sounds</h3>
                    {audioError && (
                        <div className="text-center text-amber-500 text-sm bg-amber-500/10 p-2 rounded-lg mx-auto max-w-md">
                            {audioError}
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {sounds.map((sound) => (
                            <button
                                key={sound.id}
                                onClick={() => handleSoundToggle(sound.id)}
                                className={`p-4 border rounded-xl transition-all group relative overflow-hidden ${activeSound === sound.id
                                    ? 'bg-teal-500/10 border-teal-500 text-teal-400 shadow-lg shadow-teal-500/20'
                                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                                    }`}
                            >
                                <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                                    <div className={`p-2 rounded-full ${activeSound === sound.id ? 'bg-teal-500 text-white animate-pulse' : 'bg-slate-800'}`}>
                                        {activeSound === sound.id ? (
                                            /* Pause Icon */
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            /* Play Icon */
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="font-medium text-sm">{sound.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WellnessPage;
