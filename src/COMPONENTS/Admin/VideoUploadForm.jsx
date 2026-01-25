import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVideo } from '../../REDUX/Slices/videoSlice';
import { showToast } from '../../HELPERS/Toaster';

export default function VideoUploadForm() {
    const dispatch = useDispatch();
    const { uploading } = useSelector(state => state.video);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtubeUrl: '',
        subject: '',
        chapterNumber: '',
        chapterTitle: '',
        semester: '',
        branch: 'CSE',
        duration: '',
        difficulty: 'beginner',
        language: 'english'
    });

    const [errors, setErrors] = useState({});

    const subjects = [
        'Data Structures',
        'Algorithms',
        'Web Development',
        'Database',
        'Machine Learning',
        'Cloud Computing',
        'Mobile Development',
        'Cybersecurity',
        'AI',
        'IoT'
    ];

    const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CHEM', 'BIOTECH'];
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    const languages = ['english', 'hindi', 'regional'];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.youtubeUrl.trim()) newErrors.youtubeUrl = 'YouTube URL is required';
        if (!formData.subject) newErrors.subject = 'Subject is required';
        if (!formData.chapterNumber) newErrors.chapterNumber = 'Chapter number is required';
        if (!formData.chapterTitle.trim()) newErrors.chapterTitle = 'Chapter title is required';
        if (!formData.semester) newErrors.semester = 'Semester is required';

        // Validate YouTube URL format
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu\.be)\/.+/;
        if (formData.youtubeUrl && !youtubeRegex.test(formData.youtubeUrl)) {
            newErrors.youtubeUrl = 'Invalid YouTube URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast.error('Please fix all errors');
            return;
        }

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) {
                formDataToSend.append(key, value);
            }
        });

        dispatch(uploadVideo(formDataToSend));
    };

    const handleReset = () => {
        setFormData({
            title: '',
            description: '',
            youtubeUrl: '',
            subject: '',
            chapterNumber: '',
            chapterTitle: '',
            semester: '',
            branch: 'CSE',
            duration: '',
            difficulty: 'beginner',
            language: 'english'
        });
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">📹 Upload Video Lecture</h1>
                    <p className="text-gray-400">Add a new video lecture from YouTube to your platform</p>
                </div>

                {/* Form Card */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                📝 Video Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Data Structures - Arrays Basics"
                                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                    errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                                }`}
                            />
                            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                📄 Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe what this video covers..."
                                rows="4"
                                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition ${
                                    errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                                }`}
                            />
                            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                        </div>

                        {/* YouTube URL */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                🎥 YouTube URL *
                            </label>
                            <input
                                type="url"
                                name="youtubeUrl"
                                value={formData.youtubeUrl}
                                onChange={handleChange}
                                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                    errors.youtubeUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                                }`}
                            />
                            {errors.youtubeUrl && <p className="text-red-400 text-sm mt-1">{errors.youtubeUrl}</p>}
                            <p className="text-gray-400 text-xs mt-1">✓ Paste full YouTube link here</p>
                        </div>

                        {/* Subject & Chapter - Row 1 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    📚 Subject *
                                </label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                        errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                                    }`}
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(subject => (
                                        <option key={subject} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                                {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    📖 Chapter Number *
                                </label>
                                <input
                                    type="number"
                                    name="chapterNumber"
                                    value={formData.chapterNumber}
                                    onChange={handleChange}
                                    placeholder="e.g., 1, 2, 3"
                                    min="1"
                                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                        errors.chapterNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                                    }`}
                                />
                                {errors.chapterNumber && <p className="text-red-400 text-sm mt-1">{errors.chapterNumber}</p>}
                            </div>
                        </div>

                        {/* Chapter Title */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                🎯 Chapter Title *
                            </label>
                            <input
                                type="text"
                                name="chapterTitle"
                                value={formData.chapterTitle}
                                onChange={handleChange}
                                placeholder="e.g., Introduction to Arrays"
                                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                    errors.chapterTitle ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                                }`}
                            />
                            {errors.chapterTitle && <p className="text-red-400 text-sm mt-1">{errors.chapterTitle}</p>}
                        </div>

                        {/* Semester & Branch - Row 2 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    🎓 Semester *
                                </label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                        errors.semester ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                                    }`}
                                >
                                    <option value="">Select Semester</option>
                                    {semesters.map(sem => (
                                        <option key={sem} value={sem}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                                {errors.semester && <p className="text-red-400 text-sm mt-1">{errors.semester}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    🏢 Branch
                                </label>
                                <select
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                >
                                    {branches.map(branch => (
                                        <option key={branch} value={branch}>
                                            {branch}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Difficulty & Duration - Row 3 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    ⚡ Difficulty Level
                                </label>
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                >
                                    {difficulties.map(diff => (
                                        <option key={diff} value={diff}>
                                            {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    ⏱️ Duration (seconds)
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="e.g., 1200"
                                    min="0"
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>
                        </div>

                        {/* Language */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                🌍 Language
                            </label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                {languages.map(lang => (
                                    <option key={lang} value={lang}>
                                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        ✓ Upload Video
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={uploading}
                                className="px-6 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mt-6">
                            <p className="text-blue-200 text-sm">
                                ℹ️ <strong>Note:</strong> Videos are embedded from YouTube. Provide a valid YouTube URL and the thumbnail will be automatically fetched.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
