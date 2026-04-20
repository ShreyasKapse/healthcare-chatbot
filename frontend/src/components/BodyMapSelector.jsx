import React, { useState } from 'react';

const BODY_PARTS = {
    head: {
        id: 'head',
        label: 'Head & Neck',
        symptoms: ['Headache', 'Dizziness', 'Sore Throat', 'Vision Issues', 'Neck Pain']
    },
    chest: {
        id: 'chest',
        label: 'Chest & Heart',
        symptoms: ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'Cough', 'Heartburn']
    },
    stomach: {
        id: 'stomach',
        label: 'Stomach & Abdomen',
        symptoms: ['Stomach Ache', 'Nausea/Vomiting', 'Indigestion', 'Abdominal Pain', 'Diarrhea']
    },
    arms: {
        id: 'arms',
        label: 'Arms & Hands',
        symptoms: ['Shoulder Pain', 'Wrist Pain', 'Numbness', 'Tremors', 'Joint Pain']
    },
    legs: {
        id: 'legs',
        label: 'Legs & Feet',
        symptoms: ['Knee Pain', 'Ankle Swelling', 'Leg Cramps', 'Varicose Veins', 'Foot Pain']
    }
};

const BodyMapSelector = ({ onSelectSymptom }) => {
    const [selectedPart, setSelectedPart] = useState(null);
    const [hoveredPart, setHoveredPart] = useState(null);

    const handlePartClick = (partId) => {
        setSelectedPart(partId === selectedPart ? null : partId);
    };

    const currentSymptoms = selectedPart ? BODY_PARTS[selectedPart].symptoms : [];

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full max-w-4xl mx-auto p-2 md:p-6 animate-in fade-in duration-500">

            {/* Visual Body Map */}
            <div className="relative w-full max-w-[160px] md:max-w-none md:w-64 aspect-[2/5] md:h-[500px] flex-shrink-0 transition-all duration-300">
                <svg viewBox="0 0 200 500" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#334155" />
                            <stop offset="50%" stopColor="#475569" />
                            <stop offset="100%" stopColor="#334155" />
                        </linearGradient>
                        <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                    </defs>

                    {/* Head */}
                    <g
                        onClick={() => handlePartClick('head')}
                        onMouseEnter={() => setHoveredPart('head')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className="cursor-pointer transition-all duration-300"
                        style={{ filter: selectedPart === 'head' || hoveredPart === 'head' ? 'url(#glow)' : 'none' }}
                    >
                        <circle cx="100" cy="50" r="35"
                            fill={selectedPart === 'head' ? "url(#activeGradient)" : "url(#bodyGradient)"}
                            className="transition-colors duration-300"
                        />
                    </g>

                    {/* Chest/Torso Upper */}
                    <g
                        onClick={() => handlePartClick('chest')}
                        onMouseEnter={() => setHoveredPart('chest')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className="cursor-pointer transition-all duration-300"
                        style={{ filter: selectedPart === 'chest' || hoveredPart === 'chest' ? 'url(#glow)' : 'none' }}
                    >
                        <path d="M65 90 L135 90 L130 180 L70 180 Z"
                            fill={selectedPart === 'chest' ? "url(#activeGradient)" : "url(#bodyGradient)"}
                            className="transition-colors duration-300"
                        />
                    </g>

                    {/* Stomach/Abdomen */}
                    <g
                        onClick={() => handlePartClick('stomach')}
                        onMouseEnter={() => setHoveredPart('stomach')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className="cursor-pointer transition-all duration-300"
                        style={{ filter: selectedPart === 'stomach' || hoveredPart === 'stomach' ? 'url(#glow)' : 'none' }}
                    >
                        <path d="M70 185 L130 185 L125 250 L75 250 Z"
                            fill={selectedPart === 'stomach' ? "url(#activeGradient)" : "url(#bodyGradient)"}
                            className="transition-colors duration-300"
                        />
                    </g>

                    {/* Arms (Left & Right combined for simplicity) */}
                    <g
                        onClick={() => handlePartClick('arms')}
                        onMouseEnter={() => setHoveredPart('arms')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className="cursor-pointer transition-all duration-300"
                        style={{ filter: selectedPart === 'arms' || hoveredPart === 'arms' ? 'url(#glow)' : 'none' }}
                    >
                        {/* Left Arm */}
                        <path d="M60 95 L40 200 L55 200 L70 120 Z"
                            fill={selectedPart === 'arms' ? "url(#activeGradient)" : "url(#bodyGradient)"}
                            className="transition-colors duration-300"
                        />
                        {/* Right Arm */}
                        <path d="M140 95 L160 200 L145 200 L130 120 Z"
                            fill={selectedPart === 'arms' ? "url(#activeGradient)" : "url(#bodyGradient)"}
                            className="transition-colors duration-300"
                        />
                    </g>

                    {/* Legs */}
                    <g
                        onClick={() => handlePartClick('legs')}
                        onMouseEnter={() => setHoveredPart('legs')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className="cursor-pointer transition-all duration-300"
                        style={{ filter: selectedPart === 'legs' || hoveredPart === 'legs' ? 'url(#glow)' : 'none' }}
                    >
                        {/* Left Leg */}
                        <path d="M75 255 L65 450 L85 450 L95 255 Z"
                            fill={selectedPart === 'legs' ? "url(#activeGradient)" : "url(#bodyGradient)"}
                            className="transition-colors duration-300"
                        />
                        {/* Right Leg */}
                        <path d="M125 255 L135 450 L115 450 L105 255 Z"
                            fill={selectedPart === 'legs' ? "url(#activeGradient)" : "url(#bodyGradient)"}
                            className="transition-colors duration-300"
                        />
                    </g>

                </svg>

                {/* Labels connecting to body parts */}
                <div className="absolute top-10 -right-4 bg-slate-800 text-xs px-2 py-1 rounded text-slate-300 pointer-events-none opacity-50">Head</div>
                <div className="absolute top-32 -left-4 bg-slate-800 text-xs px-2 py-1 rounded text-slate-300 pointer-events-none opacity-50">Chest</div>
                <div className="absolute top-52 -right-4 bg-slate-800 text-xs px-2 py-1 rounded text-slate-300 pointer-events-none opacity-50">Stomach</div>

                {selectedPart && (
                    <div className="absolute inset-x-0 bottom-0 text-center py-2 bg-blue-500/10 backdrop-blur rounded-lg border border-blue-500/30 text-blue-300 font-medium animate-bounce">
                        {BODY_PARTS[selectedPart].label}
                    </div>
                )}
            </div>

            {/* Interface Panel */}
            <div className="flex-1 max-w-sm">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <span className="text-2xl">🧍</span> Body Scanner
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                        Tap a body part on the model to see common symptoms, or describe your issue below.
                    </p>

                    {selectedPart ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">
                                {BODY_PARTS[selectedPart].label} Symptoms
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {currentSymptoms.map((symptom) => (
                                    <button
                                        key={symptom}
                                        onClick={() => onSelectSymptom(`I am experiencing ${symptom} in my ${BODY_PARTS[selectedPart].label}`)}
                                        className="text-left px-4 py-3 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-slate-700 hover:border-blue-500 group flex items-center justify-between"
                                    >
                                        <span>{symptom}</span>
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                            <p className="text-slate-600">Select a region to begin diagnosis</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default BodyMapSelector;
