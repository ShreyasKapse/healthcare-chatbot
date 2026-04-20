import { useState, useEffect, useRef } from 'react';

const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);
    const synth = useRef(window.speechSynthesis);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setSupported(true);
        }
    }, []);

    const speak = (text) => {
        if (!supported || !synth.current) return;

        // Cancel any current speaking
        synth.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Attempt to pick a good voice
        const voices = synth.current.getVoices();
        // Prefer "Google US English" or similar if available, otherwise just use default
        const preferredVoice = voices.find(v => v.name.includes('Google US English')) ||
            voices.find(v => v.lang === 'en-US') ||
            voices[0];

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synth.current.speak(utterance);
    };

    const cancel = () => {
        if (!supported || !synth.current) return;
        synth.current.cancel();
        setIsSpeaking(false);
    };

    return {
        speak,
        cancel,
        isSpeaking,
        supported
    };
};

export default useTextToSpeech;
