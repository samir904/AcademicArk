import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitFeedback } from '../REDUX/Slices/feedbackSlice';

export default function FeedbackForm({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const  user  = useSelector((state) => state.auth.data);
    const { submitLoading } = useSelector(state => state.feedback);
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        feedbackType: 'OTHER',
        subject: '',
        message: '',
        rating: 5,
        attachments: []
    });

    const feedbackTypes = [
        { value: 'BUG_REPORT', label: '🐛 Bug Report', emoji: '🐛' },
        { value: 'FEATURE_REQUEST', label: '✨ Feature Request', emoji: '✨' },
        { value: 'UI_UX', label: '🎨 UI/UX Feedback', emoji: '🎨' },
        { value: 'PERFORMANCE', label: '⚡ Performance Issue', emoji: '⚡' },
        { value: 'CONTENT', label: '📚 Content Quality', emoji: '📚' },
        { value: 'OTHER', label: '💬 Other', emoji: '💬' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            setError('Maximum 3 files allowed');
            return;
        }
        setFormData(prev => ({
            ...prev,
            attachments: files
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            // Validation
            if (!formData.subject.trim()) {
                setError('Subject is required');
                return;
            }
            if (!formData.message.trim() || formData.message.length < 10) {
                setError('Message must be at least 10 characters');
                return;
            }

            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('feedbackType', formData.feedbackType);
            submitData.append('subject', formData.subject);
            submitData.append('message', formData.message);
            submitData.append('rating', formData.rating);
            submitData.append('page', window.location.pathname);

            // Add files
            formData.attachments.forEach(file => {
                submitData.append('attachments', file);
            });

            // Dispatch thunk
            const result = await dispatch(submitFeedback(submitData));

            if (submitFeedback.fulfilled.match(result)) {
                // ✅ Success!
                setSuccess(true);
                setFormData({
                    feedbackType: 'OTHER',
                    subject: '',
                    message: '',
                    rating: 5,
                    attachments: []
                });
                
                // Close after 2 seconds
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                }, 2000);
            } else if (submitFeedback.rejected.match(result)) {
                // ❌ Error
                setError(result.payload?.message || 'Failed to submit feedback');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-2xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Share Your Feedback</h2>
                            <p className="text-blue-100 text-sm mt-1">Help us improve AcademicArk</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white text-2xl font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-300 flex items-center gap-2">
                            <span className="text-xl">✓</span>
                            <span>Thank you! Your feedback has been submitted successfully.</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300 flex items-center gap-2">
                            <span className="text-xl">✕</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Feedback Type */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-3">
                            What type of feedback?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {feedbackTypes.map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ 
                                        ...prev, 
                                        feedbackType: type.value 
                                    }))}
                                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                                        formData.feedbackType === type.value
                                            ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                            : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                                    }`}
                                >
                                    {type.emoji} {type.label.split(' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-3">
                            How satisfied are you?
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                    className={`w-12 h-12 rounded-lg border-2 text-2xl transition-all ${
                                        formData.rating === star
                                            ? 'border-yellow-400 bg-yellow-500/20 text-yellow-400'
                                            : 'border-white/20 bg-white/5 text-white/50 hover:border-yellow-400/50'
                                    }`}
                                >
                                    {star === 1 && '😞'}
                                    {star === 2 && '😕'}
                                    {star === 3 && '😐'}
                                    {star === 4 && '😊'}
                                    {star === 5 && '😍'}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Rating: {formData.rating}/5
                        </p>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                            Subject *
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Brief summary of your feedback"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition"
                            maxLength={100}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            {formData.subject.length}/100
                        </p>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                            Detailed Feedback *
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Please provide detailed feedback... (min 10 characters)"
                            rows={6}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition resize-none"
                            maxLength={2000}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            {formData.message.length}/2000
                        </p>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                            Attachments (Screenshots) - Max 3
                        </label>
                        <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400/50 transition">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept="image/*,.pdf,.doc,.docx"
                                className="hidden"
                                id="file-input"
                            />
                            <label htmlFor="file-input" className="cursor-pointer block">
                                <div className="text-3xl mb-2">📎</div>
                                <p className="text-white/70 text-sm">
                                    {formData.attachments.length > 0
                                        ? `${formData.attachments.length} file(s) selected`
                                        : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    PNG, JPG, PDF, DOC up to 5MB each
                                </p>
                            </label>
                        </div>
                        {formData.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {Array.from(formData.attachments).map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white/10 p-2 rounded">
                                        <span className="text-xs text-white/70 truncate">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    attachments: prev.attachments.filter((_, i) => i !== idx)
                                                }));
                                            }}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <p className="text-xs text-white/70 mb-2">📋 This feedback will be submitted by:</p>
                        <p className="text-sm font-semibold text-white">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-semibold transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitLoading ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
