import React, { useState, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useUser } from '@clerk/clerk-react';

const ProfilePage = () => {
    const { user: clerkUser } = useUser();
    const { userProfile, fetchUserProfile, updateUserProfile, loading } = useChat();

    const [formData, setFormData] = useState({
        age: '',
        weight: '',
        allergies: '',
        conditions: ''
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!userProfile) {
            fetchUserProfile();
        } else {
            setFormData({
                age: userProfile.age || '',
                weight: userProfile.weight || '',
                allergies: userProfile.allergies || '',
                conditions: userProfile.conditions || ''
            });
        }
    }, [userProfile, fetchUserProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        const success = await updateUserProfile(formData);
        if (success) {
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    if (!clerkUser) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="text-white">Please sign in to view your profile.</div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-slate-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto">
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl shadow-lg">
                            👤
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">Health Profile</h1>
                            <p className="text-slate-400">Manage your personal health information to get better AI recommendations.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="age" className="block text-sm font-medium text-slate-300">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="e.g. 30"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="weight" className="block text-sm font-medium text-slate-300">
                                    Weight
                                </label>
                                <input
                                    type="text"
                                    id="weight"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="e.g. 70 kg"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="allergies" className="block text-sm font-medium text-slate-300">
                                Allergies
                            </label>
                            <textarea
                                id="allergies"
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                rows={3}
                                placeholder="List any known allergies (e.g., Peanuts, Penicillin, Pollen)..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="conditions" className="block text-sm font-medium text-slate-300">
                                Medical Conditions / Chronic Illnesses
                            </label>
                            <textarea
                                id="conditions"
                                name="conditions"
                                value={formData.conditions}
                                onChange={handleChange}
                                rows={3}
                                placeholder="List any chronic conditions (e.g., Asthma, Diabetes, Hypertension)..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                            />
                        </div>

                        {successMessage && (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm font-medium flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                                {successMessage}
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Profile'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
