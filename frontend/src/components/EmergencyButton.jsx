import React, { useState, useEffect } from 'react';

const EmergencyButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [locationSent, setLocationSent] = useState(false);

    const emergencyContacts = [
        { title: 'Ambulance', number: '108', icon: '🚑', color: 'bg-red-600' },
        { title: 'Police', number: '100', icon: '👮', color: 'bg-blue-600' },
        { title: 'Emergency Contact', number: 'Your saved contact', icon: '📞', color: 'bg-green-600' }
    ];

    useEffect(() => {
        let timer;
        if (countdown !== null && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0) {
            // Mock action when countdown ends
            setCountdown(null);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSendLocation = () => {
        // Simulate sending location
        if (navigator.geolocation) {
            setLocationSent('sending');
            // Mock delay
            setTimeout(() => {
                setLocationSent(true);
            }, 1500);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 group flex items-center justify-center w-14 h-14 rounded-full bg-red-600 text-white shadow-2xl hover:scale-110 transition-all focus:outline-none focus:ring-4 focus:ring-red-500/50 animate-bounce-slow"
                title="Emergency SOS"
            >
                <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-75"></span>
                <span className="relative text-2xl">🆘</span>
            </button>

            {/* Backdrop & Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 overflow-hidden border-2 border-red-500">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-3xl animate-pulse">
                                🚨
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">Emergency SOS</h2>
                            <p className="text-slate-500 mt-2">Press below to call immediately</p>
                        </div>

                        {/* Action Grid */}
                        <div className="grid gap-4 mb-6">
                            {emergencyContacts.map((contact) => (
                                <a
                                    key={contact.title}
                                    href={`tel:${contact.number}`}
                                    className={`flex items-center gap-4 p-4 rounded-xl text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 ${contact.color}`}
                                >
                                    <span className="text-3xl">{contact.icon}</span>
                                    <div className="flex-1 text-left">
                                        <div className="font-bold text-lg">{contact.title}</div>
                                        <div className="text-white/80 text-sm">{contact.number}</div>
                                    </div>
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Location Sharing */}
                        <div className="border-t border-slate-100 pt-6">
                            {!locationSent ? (
                                <button
                                    onClick={handleSendLocation}
                                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    {locationSent === 'sending' ? (
                                        <>
                                            <span className="animate-spin h-5 w-5 border-2 border-slate-500 border-t-transparent rounded-full"></span>
                                            Getting Location...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Share My Live Location
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3">
                                    <div className="bg-green-100 p-1 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="text-sm font-medium">
                                        Location Alert Sent to Emergency Contacts
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cancel Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                    </div>
                </div>
            )}
        </>
    );
};

export default EmergencyButton;
