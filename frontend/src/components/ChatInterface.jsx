import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext';
import useSpeechToText from '../hooks/useSpeechToText';
import useTextToSpeech from '../hooks/useTextToSpeech';
import ReportUpload from './ReportUpload';
import { generateConsultationPDF } from '../utils/pdfGenerator';
import BodyMapSelector from './BodyMapSelector';

const ChatInterface = () => {
  const { messages, loading, error, sendMessage, addMessage, setCurrentConversation, currentConversation, clearError, user } = useChat();
  const { id } = useParams();
  const [inputMessage, setInputMessage] = useState('');
  const [showBodyMap, setShowBodyMap] = useState(true);
  const messagesEndRef = useRef(null);

  // Sync URL ID with context
  useEffect(() => {
    if (id && id !== currentConversation?.id) {
      // Find title if possible, or just use ID and let context fetch title/messages
      setCurrentConversation(id, "Loading...");
    } else if (!id && currentConversation) {
      // If no ID in URL but context has one (e.g. user clicked "New Chat"), URL should probably reflect that or we clear context.
      // Actually, "New Chat" button navigates to /chat, so id is undefined.
      setCurrentConversation(null);
    }
  }, [id]);

  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport
  } = useSpeechToText();

  const { speak, cancel, isSpeaking, supported: hasTTS } = useTextToSpeech();
  const [playingMessageId, setPlayingMessageId] = useState(null);

  // Stop playing if component unmounts or chat changes
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [currentConversation?.id]);

  const handleSpeak = (msgId, text) => {
    if (playingMessageId === msgId) {
      // Currently playing this message -> Stop it
      cancel();
      setPlayingMessageId(null);
    } else {
      // Play new message
      setPlayingMessageId(msgId);
      speak(text, {
        onEnd: () => setPlayingMessageId(null),
        onError: () => setPlayingMessageId(null)
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    await sendMessage(inputMessage);
    setInputMessage('');
    resetTranscript();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      setInputMessage('');
    }
  };

  const handleAnalysisComplete = (analysisText, conversationId) => {
    // Simulate user action
    addMessage("I've uploaded a medical report for analysis.", true);

    // Add AI response after a short delay for natural feel
    setTimeout(() => {
      addMessage(analysisText, false);
    }, 500);

    // Update conversation context if a new one was created
    if (conversationId) {
      setCurrentConversation(conversationId, "Medical Report Analysis");
    }
  };

  return (
    <div className="relative h-full overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-20 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative mx-auto flex h-full max-w-5xl flex-col gap-4 px-4 pb-4 pt-2 md:px-8 md:pb-6">
        {/* Header removed as requested, now using global Navbar */}

        {error && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-6 py-4 text-sm text-rose-100 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-rose-50">We encountered an issue</p>
                <p className="mt-1 text-rose-100/80">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="rounded-full border border-rose-400/40 px-3 py-1 text-xs font-medium text-rose-100 transition-colors hover:bg-rose-500/20"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {speechError && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-6 py-4 text-sm text-amber-100 shadow-lg">
            {speechError}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex justify-end px-2">
          <button
            onClick={() => generateConsultationPDF(messages, null, user?.firstName)}
            disabled={messages.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download this conversation as a PDF"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export PDF
          </button>
        </div>

        <section className="relative flex min-h-[60vh] flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />

          <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
            {messages.length === 0 ? (
              <div className="flex min-h-full flex-col items-center justify-start md:justify-center text-center py-4 md:py-0">
                {/* Empty State Toggle */}
                <div className="mb-8 flex gap-4 bg-white/5 p-1 rounded-xl border border-white/10 z-10 pointer-events-auto">
                  <button
                    onClick={() => setShowBodyMap(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!showBodyMap ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Standard View
                  </button>
                  <button
                    onClick={() => setShowBodyMap(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${showBodyMap ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Interactive Body Map
                  </button>
                </div>

                {showBodyMap ? (
                  <div className="w-full max-w-4xl animate-in zoom-in-95 duration-300">
                    <BodyMapSelector onSelectSymptom={(symptom) => sendMessage(symptom)} />
                  </div>
                ) : (
                  <div className="max-w-xl space-y-8 animate-in fade-in duration-300">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/25 text-4xl shadow-lg shadow-blue-500/30">
                      🩺
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-white md:text-3xl">
                        Welcome to your healthcare companion
                      </h2>
                      <p className="mt-3 text-sm text-slate-200/80 md:text-base">
                        Start by describing your symptoms, wellness goals, or any questions you have. I’ll help you understand when to seek professional care and share supportive, mindful guidance.
                      </p>
                    </div>
                    <div className="grid gap-4 text-left text-xs text-slate-200/80 md:grid-cols-3 md:text-sm">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm font-semibold text-white">Urgent concerns</p>
                        <p className="mt-2">Call emergency services immediately for life-threatening symptoms.</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm font-semibold text-white">Helpful details</p>
                        <p className="mt-2">Share how long you’ve felt this way, intensity, and any related changes.</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm font-semibold text-white">Privacy assured</p>
                        <p className="mt-2">Conversations stay encrypted and aligned with responsible care standards.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-sm rounded-3xl px-5 py-4 shadow-lg transition-all md:max-w-lg lg:max-w-2xl ${message.is_user
                        ? 'rounded-br-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white'
                        : 'rounded-bl-2xl border border-slate-100 bg-white text-slate-900'
                        }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide opacity-70">
                        <span>{message.is_user ? (user?.firstName || 'You') : 'Healthcare AI'}</span>
                        <span>
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className={`mt-3 text-sm leading-relaxed ${message.is_user ? 'text-white' : 'text-slate-900'}`}>
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                            h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1" {...props} />,
                            bold: ({ node, ...props }) => <span className="font-bold" {...props} />,
                            strong: ({ node, ...props }) => <span className="font-bold" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>

                      {!message.is_user && hasTTS && (
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => handleSpeak(message.id, message.content)}
                            className={`p-1 transition-colors rounded-full ${playingMessageId === message.id ? 'text-rose-500 bg-rose-50 hover:bg-rose-100' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'}`}
                            title={playingMessageId === message.id ? "Stop reading" : "Read aloud"}
                          >
                            {playingMessageId === message.id ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-slate-100 shadow-inner">
                      <span className="flex h-2 w-12 items-center justify-between">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-300" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-200 [animation-delay:120ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-100 [animation-delay:240ms]" />
                      </span>
                      Composing a thoughtful response…
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )
            }
          </div>

          <div className="border-t border-white/10 bg-white/5 px-4 py-4 md:px-8 md:py-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-4 flex items-center text-blue-200 z-10">
                  <ReportUpload
                    onAnalysisComplete={handleAnalysisComplete}
                    conversationId={currentConversation?.id}
                  />
                </div>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your symptoms, feelings, or questions..."
                  className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-14 pr-16 text-sm text-white placeholder:text-slate-300/70 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-400/40 disabled:opacity-60"
                  disabled={loading}
                />
                {hasRecognitionSupport && (
                  <button
                    type="button"
                    onClick={handleVoiceClick}
                    disabled={loading}
                    className={`absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 text-lg transition-all ${isListening
                      ? 'animate-pulse bg-rose-500/80 text-white shadow-lg shadow-rose-500/40'
                      : 'bg-white/10 text-blue-200 hover:bg-white/20'
                      } disabled:opacity-50`}
                    title={isListening ? 'Stop recording' : 'Start voice input'}
                  >
                    {isListening ? '⏹' : '🎙️'}
                  </button>
                )}
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || loading}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>

            {isListening && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-rose-100">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-rose-400" />
                Listening… speak naturally and mention anything that feels important.
              </div>
            )}

            <p className="mt-4 text-center text-[11px] text-slate-200/60">
              This assistant offers supportive information only. For urgent or serious concerns, contact licensed medical professionals immediately.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatInterface;
