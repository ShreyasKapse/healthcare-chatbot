import React, { useState, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';

export default function ReportUpload({ onAnalysisComplete, conversationId }) {
    const { getToken } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPEG, PNG)');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        if (conversationId) {
            formData.append('conversation_id', conversationId);
        }

        try {
            const token = await getToken();
            const response = await fetch('http://localhost:5000/api/analyze/report', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze report');
            }

            if (data.success) {
                onAnalysisComplete(data.analysis, data.conversation_id);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to analyze report. Please try again.');
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex items-center">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                id="report-upload"
            />
            <label
                htmlFor="report-upload"
                className={`cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                title="Upload Medical Report"
            >
                {isUploading ? (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 hover:text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                )}
            </label>
        </div>
    );
}
