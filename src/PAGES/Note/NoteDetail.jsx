// src/pages/NoteDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNote, toggleBookmark, downloadnote, addRating, deleteNote, clearCurrentNote } from '../../REDUX/Slices/noteslice';
import HomeLayout from '../../LAYOUTS/Homelayout';
import LoginPrompt from '../../COMPONENTS/LoginPrompt';
import AdSidebar from '../../COMPONENTS/AdSidebar';
import AdBanner from '../../COMPONENTS/AdBanner';
import NoteViewers from '../../COMPONENTS/Note/NoteViewers';

// Icon components
const ArrowLeftIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const BookmarkIcon = ({ className, filled }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const DownloadIcon = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-down-icon lucide-circle-arrow-down"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg>

);

const StarIcon = ({ className, filled }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const UserIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const CalendarIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ClockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TargetIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const FlameIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13.76 3.13 13.59 3.28 13.43 3.44C11.25 5.34 11.24 8.28 12.24 10.44C12.95 11.87 14.43 12.38 15.18 13.78C15.27 13.94 15.35 14.12 15.41 14.3C15.56 14.99 15.52 15.72 15.3 16.39C15.05 17.18 14.56 17.95 13.89 18.53C13.44 18.90 12.94 19.21 12.41 19.44C11.88 19.68 11.32 19.85 10.75 19.93C9.97 20.06 9.17 20.05 8.39 19.89C7.61 19.73 6.87 19.42 6.2 18.99C5.54 18.57 4.95 18.03 4.46 17.4C3.85 16.63 3.43 15.75 3.21 14.82C2.99 13.89 2.98 12.92 3.18 11.98C3.39 11.04 3.81 10.15 4.4 9.4C4.99 8.65 5.75 8.05 6.6 7.63C7.45 7.21 8.37 6.98 9.31 6.96C10.25 6.94 11.18 7.13 12.04 7.52C12.90 7.91 13.67 8.49 14.3 9.22C14.93 9.95 15.40 10.82 15.68 11.75C15.81 12.21 15.87 12.69 15.87 13.17C15.87 13.64 15.81 14.12 15.68 14.58C15.42 15.48 14.92 16.29 14.24 16.93Z" />
    </svg>
);

const EditIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const TrashIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const PencilIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.364-6.364a1 1 0 011.414 0l3.586 3.586a1 1 0 010 1.414L13 17h-4v-4z" />
    </svg>
);

export default function NoteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentNote, loading, bookmarking, downloading, rating, deleting } = useSelector(state => state.note);
    const { bookmarkingNotes, downloadingNotes } = useSelector(state => state.note);
    const isBookmarking = bookmarkingNotes.includes(id);
    const isDownloading = downloadingNotes.includes(id);

    const user = useSelector(state => state.auth.data);
    const role = useSelector((state) => state?.auth?.data?.role || "");

    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState('');
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    // Authorization checks
    const isAdmin = role === 'ADMIN';
    const isNoteCreator = currentNote && user && currentNote.uploadedBy?._id === user._id;
    const canEditNote = isAdmin || (role === 'TEACHER' && isNoteCreator);
    const canDeleteNote = isAdmin || (role === 'TEACHER' && isNoteCreator);

    // Fetch note on component mount
    useEffect(() => {
        if (id) {
            dispatch(getNote(id));
        }

        // Cleanup on unmount
        return () => {
            dispatch(clearCurrentNote());
        };
    }, [id, dispatch]);

    // Loading state
    if (loading) {
        return (
            <HomeLayout>
                <div className="min-h-screen bg-black flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading note details...</p>
                    </div>
                </div>
            </HomeLayout>
        );
    }

    // Error state
    if (!currentNote) {
        return (
            <HomeLayout>
                <div className="min-h-screen bg-black flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-white text-3xl">!</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Note Not Found</h2>
                        <p className="text-gray-400 mb-6">The note you're looking for doesn't exist or has been removed.</p>
                        <button
                            onClick={() => navigate('/notes')}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                        >
                            Back to Notes
                        </button>
                    </div>
                </div>
            </HomeLayout>
        );
    }

    const isBookmarked = currentNote.bookmarkedBy?.includes(user?._id);
    const avgRating = currentNote.rating?.length > 0
        ? (currentNote.rating.reduce((sum, r) => sum + r.rating, 0) / currentNote.rating.length).toFixed(1)
        : 0;

    const userExistingRating = currentNote.rating?.find(r => r.user === user?._id);

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
            console.log("not loggedin");
            setShowLoginModal(true);
            return;
        }
        dispatch(toggleBookmark(currentNote._id));
    };

    const handleDownload = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }
        dispatch(downloadnote({ noteId: currentNote._id, title: currentNote.title }));
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteNote(currentNote._id));
            setShowDeleteModal(false);
            // Navigate back to notes after successful deletion
            navigate('/notes');
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleRating = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }
        if (userExistingRating) {
            setUserRating(userExistingRating.rating);
            setUserReview(userExistingRating.review);
        }
        setShowRatingModal(true);
    };

    const submitRating = () => {
        if (userRating > 0) {
            dispatch(addRating({
                noteId: currentNote._id,
                rating: userRating,
                review: userReview
            }));
            setShowRatingModal(false);
            setUserRating(0);
            setUserReview('');
        }
    };

    // ✨ UPDATED: getTheme function with Handwritten Notes support
    const getTheme = () => {
        switch (currentNote.category) {
            case 'PYQ':
                return {
                    gradient: 'from-cyan-500 to-blue-500',
                    bgGradient: 'from-cyan-900/20 to-blue-900/20',
                    borderColor: 'border-cyan-500/30',
                    textColor: 'text-red-400',
                    icon: <TargetIcon className="w-8 h-8 text-cyan-200" />,
                    badge: '📄 PYQ',
                    headingIcon: <TargetIcon className="w-6 h-6" />,
                    accentBg: 'bg-cyan-500/10',
                    accentBorder: 'border-cyan-500/20'
                };
            case 'Important Question':
                return {
                    gradient: 'from-yellow-500 to-orange-500',
                    bgGradient: 'from-yellow-900/20 to-orange-900/20',
                    borderColor: 'border-yellow-500/30',
                    textColor: 'text-yellow-400',
                    icon: <FlameIcon className="w-8 h-8 text-yellow-200" />,
                    badge: '⭐ Important',
                    headingIcon: <FlameIcon className="w-6 h-6" />,
                    accentBg: 'bg-yellow-500/10',
                    accentBorder: 'border-yellow-500/20'
                };
            case 'Handwritten Notes':
                return {
                    gradient: 'from-green-500 to-teal-500',
                    bgGradient: 'from-green-900/20 to-teal-900/20',
                    borderColor: 'border-green-500/30',
                    textColor: 'text-green-400',
                    icon: <PencilIcon className="w-8 h-8 text-green-200" />,
                    badge: '✏️ Handwritten',
                    headingIcon: <PencilIcon className="w-6 h-6" />,
                    accentBg: 'bg-green-500/10',
                    accentBorder: 'border-green-500/20'
                };
            default: // Notes
                return {
                    gradient: 'from-blue-500 to-purple-500',
                    bgGradient: 'from-blue-900/20 to-purple-900/20',
                    borderColor: 'border-blue-500/30',
                    textColor: 'text-blue-400',
                    icon: <TargetIcon className="w-8 h-8 text-blue-200" />,
                    badge: '📚 Notes',
                    headingIcon: <TargetIcon className="w-6 h-6" />,
                    accentBg: 'bg-blue-500/10',
                    accentBorder: 'border-blue-500/20'
                };
        }
    };
    // ✨ NEW: Add category-specific content section
    const getCategoryContent = () => {
        switch (currentNote.category) {
            case 'Handwritten Notes':
                return (
                    <div className={`bg-gradient-to-br from-green-900/30 to-teal-900/20 backdrop-blur-xl ${theme.accentBorder} rounded-2xl p-6`}>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                            <PencilIcon className="w-6 h-6 text-green-400" />
                            <span>Study Tips</span>
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                                <h3 className="font-medium text-green-300 mb-2">✍️ Personal Notes</h3>
                                <p className="text-gray-300 text-sm">These are carefully handwritten notes with personal insights. Great for understanding concepts through the author's perspective and learning style.</p>
                            </div>
                            <div className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/20">
                                <h3 className="font-medium text-teal-300 mb-2">💡 Deep Conceptual Clarity</h3>
                                <p className="text-gray-300 text-sm">Handwritten notes often provide detailed explanations, diagrams, and annotations that enhance understanding. Perfect for visual learners.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'Notes':
                return (
                    <div className={`bg-gradient-to-br from-blue-900/30 to-purple-900/20 backdrop-blur-xl ${theme.accentBorder} rounded-2xl p-6`}>
                        {/* Header */}
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                            <TargetIcon className="w-6 h-6 text-blue-300" />
                            <span>Study Tips</span>
                        </h2>
                        {/* Content: animated box with info */}
                        <div className="space-y-4">
                            {/* Personal Notes */}
                            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <h3 className="font-medium text-blue-300 mb-2">✍️ Personal Notes</h3>
                                <p className="text-gray-300 text-sm">
                                    These are carefully curated study notes created by experts. Great for understanding concepts through summaries, diagrams, and annotated explanations.
                                </p>
                            </div>
                            {/* Conceptual Clarity */}
                            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <h3 className="font-medium text-purple-300 mb-2">💡 Deep Conceptual Clarity</h3>
                                <p className="text-gray-300 text-sm">
                                    Well-structured notes designed to clarify difficult topics, with diagrams, flowcharts, and concise summaries to aid quick revision.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };


    const theme = getTheme();
    const categoryContent = getCategoryContent();
    return (
        <HomeLayout>
            <div className="min-h-screen bg-black text-white">
                {/* Header */}
                <div className={`relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient}`}></div>
                    <div className="relative max-w-7xl mx-auto px-4 py-8">

                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6 group"
                        >
                            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Back</span>
                        </button>

                        {/* Note Header */}
                        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                            {/* Main Info */}
                            <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center`}>
                                        {theme.icon}
                                    </div>
                                    <div className={`px-4 py-2 bg-gradient-to-r ${theme.gradient} rounded-full text-sm font-bold text-white`}>
                                        {theme.badge}
                                    </div>
                                </div>

                                <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                                    {currentNote.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span>{currentNote.subject}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>Semester {currentNote.semester}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span>🏛️</span>
                                        <span>{currentNote.university}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ClockIcon className="w-4 h-4" />
                                        <span>{new Date(currentNote.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center space-x-6 mb-6">
                                    {currentNote.rating?.length > 0 && (
                                        <div className="flex items-center space-x-2">
                                            <StarIcon className="w-5 h-5 text-yellow-400" filled />
                                            <span className="text-white font-medium">{avgRating}</span>
                                            <span className="text-gray-400">({currentNote.rating.length} reviews)</span>
                                        </div>
                                    )}{/* Views Count */}
  <div className="flex items-center space-x-2">
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    <span className="text-gray-400">{currentNote.views || 0} views</span>
  </div>
                                    <div className="flex items-center space-x-2">
                                        <DownloadIcon className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-400">{currentNote.downloads || 0} downloads</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-3 lg:w-64">
                                {/* 🔥 READ BUTTON - Primary Action */}
                                <Link
                                    to={`/notes/${currentNote._id}/read`}
                                    className={`w-full bg-gradient-to-r ${theme.gradient}     text-white py-3 px-6 rounded-full font-medium  transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span>Read Now</span>
                                </Link>
                                {/* DOWNLOAD BUTTON - Simple Spinner */}
                                <button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className={`w-full bg-gradient-to-r ${theme.gradient} text-white py-3 px-6 rounded-full font-medium hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:opacity-50`}
                                >
                                    {isDownloading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <DownloadIcon className="w-5 h-5" />
                                            <span>Download</span>
                                        </>
                                    )}
                                </button>

                                {/* BOOKMARK BUTTON - Simple Spinner */}
                                <button
                                    onClick={handleBookmark}
                                    disabled={isBookmarking}
                                    className={`w-full border-2 ${theme.borderColor} text-white py-3 px-6 rounded-full font-medium hover:bg-white/5 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:opacity-50`}
                                >
                                    {isBookmarking ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-400 border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <BookmarkIcon
                                                className={`w-5 h-5 ${isBookmarked ? 'text-yellow-400' : 'text-gray-400'}`}
                                                filled={isBookmarked}
                                            />
                                            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                                        </>
                                    )}
                                </button>


                                {/* Update Note Button - Only for note creator (teacher) or admin */}
                                {canEditNote && (
                                    <Link
                                        to={`/update-note/${currentNote._id}`}
                                        className="w-full bg-green-600/20 border border-green-500/30 text-green-300 py-3 px-6 rounded-full font-medium hover:bg-green-600/30 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                                    >
                                        <EditIcon className="w-5 h-5" />
                                        <span>Update Note</span>
                                    </Link>
                                )}

                                {/* Delete Note Button - Only for note creator (teacher) or admin */}
                                {canDeleteNote && (
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="w-full bg-red-600/20 border border-red-500/30 text-red-300 py-3 px-6 rounded-full font-medium hover:bg-red-600/30 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                        <span>Delete Note</span>
                                    </button>
                                )}

                                {/* // Update the rating button */}
                                {user && (
                                    <button
                                        onClick={handleRating}
                                        disabled={rating}
                                        className="w-full bg-white/10 border border-white/20 text-white py-3 px-6 rounded-full font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:opacity-50"
                                    >
                                        <StarIcon className="w-5 h-5 text-yellow-400" />
                                        <span>{userExistingRating ? 'Update Rating' : 'Rate This'}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {currentNote.description}
                                </p>
                            </div>

                            {/* Category-specific content */}
                            {currentNote.category === 'PYQ' && (
                                <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                                        <TargetIcon className="w-6 h-6 text-cyan-400" />
                                        <span>Exam Information</span>
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-cyan-500/10 rounded-lg">
                                            <ClockIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                            <div className="text-white font-medium">3 Hours</div>
                                            <div className="text-cyan-300 text-sm">Duration</div>
                                        </div>
                                        <div className="text-center p-4 bg-cyan-500/10 rounded-lg">
                                            <TargetIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                            <div className="text-white font-medium">100 Marks</div>
                                            <div className="text-cyan-300 text-sm">Total</div>
                                        </div>
                                        <div className="text-center p-4 bg-cyan-500/10 rounded-lg">
                                            <StarIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                            <div className="text-white font-medium">High Priority</div>
                                            <div className="text-cyan-300 text-sm">Importance</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentNote.category === 'Important Question' && (
                                <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                                        <FlameIcon className="w-6 h-6 text-yellow-400" />
                                        <span>Study Tips</span>
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                            <h3 className="font-medium text-yellow-300 mb-2">📌 High Weightage Topic</h3>
                                            <p className="text-gray-300 text-sm">This topic frequently appears in exams. Focus on understanding core concepts and practice numerical problems.</p>
                                        </div>
                                        <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                            <h3 className="font-medium text-orange-300 mb-2">🎯 Preparation Strategy</h3>
                                            <p className="text-gray-300 text-sm">Create summary notes, solve previous questions, and practice with time constraints for better results.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ✨ Category-specific content */}
                            {categoryContent && categoryContent}


{/* ✅ NOTE VIEWERS SECTION */}
{/* {currentNote.viewedBy && currentNote.viewedBy.length > 0 && (
    <NoteViewers 
        viewedBy={currentNote.viewedBy}
        totalViews={currentNote.views}
    />
)} */}


                            {/* Reviews */}
                            {currentNote.rating?.length > 0 && (
                                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                                        <StarIcon className="w-6 h-6 text-yellow-400" filled />
                                        <span>Reviews & Ratings</span>
                                    </h2>
                                    <div className="space-y-4">
                                        {currentNote.rating.map((review, index) => (
                                            <div key={review._id || index} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <Link
                                                        to={`/profile/${review.user?._id}`}
                                                        className="flex items-center space-x-2 hover:opacity-80 hover:underline transition-opacity"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            {/* User Avatar */}
                                                            {review.user?.avatar?.secure_url?.startsWith('http') ? (
                                                                <img
                                                                    src={review.user.avatar.secure_url}
                                                                    alt={review.user.fullName || 'User'}
                                                                    loading='lazy'
                                                                    className="w-10 h-10 rounded-full border-2 border-white/20 object-cover shadow-lg"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                                                    <span className="text-white text-lg font-bold">
                                                                        {review.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            <div>
                                                                {/* User Name */}
                                                                <span className="text-white font-medium text-lg">
                                                                    {review.user?.fullName || 'Anonymous User'}
                                                                </span>
                                                                {/* Optional: Show user role if available */}
                                                                {review.user?.role && (
                                                                    <div className="text-xs text-gray-400 capitalize">
                                                                        {review.user.role.toLowerCase()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>

                                                    {/* Rating Stars */}
                                                    <div className="flex items-center space-x-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                                                        {[...Array(5)].map((_, i) => (
                                                            <StarIcon
                                                                key={i}
                                                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                                                filled={i < review.rating}
                                                            />
                                                        ))}
                                                        {/* <span className="text-yellow-400 font-semibold ml-1">
                                {review.rating}/5
                            </span> */}
                                                    </div>
                                                </div>

                                                {/* Review Text */}
                                                {review.review && (
                                                    <div className="ml-13">
                                                        <p className="text-gray-300 leading-relaxed">"{review.review}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Average Rating Summary */}
                                    <div className="mt-6 pt-4 border-t border-white/10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <StarIcon className="w-5 h-5 text-yellow-400" filled />
                                                <span className="text-white font-medium">
                                                    Average Rating: {avgRating}/5
                                                </span>
                                            </div>
                                            <span className="text-gray-400 text-sm">
                                                Based on {currentNote.rating.length} review{currentNote.rating.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>



                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Uploader Info */}
                            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Uploaded By</h3>
                                <Link
                                    to={`/profile/${currentNote.uploadedBy?._id}`}
                                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                                >
                                    <div className="flex items-center space-x-3">
                                        {currentNote.uploadedBy?.avatar?.secure_url?.startsWith('http') ? (
                                            <img
                                                src={currentNote.uploadedBy.avatar.secure_url}
                                                alt={currentNote.uploadedBy.fullName}
                                                loading='lazy'
                                                className="w-12 h-12 rounded-full border-2 border-white/20"
                                            />
                                        ) : (
                                            <div className={`w-12 h-12 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center text-white font-bold`}>
                                                {currentNote.uploadedBy?.fullName?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-white font-medium">{currentNote.uploadedBy?.fullName || 'Unknown'}</div>
                                            <div className="text-gray-400 text-sm">Contributor</div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Related Notes */}
                            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link
                                        to={`/notes?subject=${currentNote.subject}`}
                                        className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                                    >
                                        <div className="text-white font-medium">More from {currentNote.subject}</div>
                                        <div className="text-gray-400">Browse related notes</div>
                                    </Link>
                                    <Link
                                        to={`/notes?semester=${currentNote.semester}`}
                                        className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                                    >
                                        <div className="text-white font-medium">Semester {currentNote.semester} Notes</div>
                                        <div className="text-gray-400">All notes for this semester</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          
                {/* Rating Modal */}
                {showRatingModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-white mb-4">Rate This Note</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setUserRating(star)}
                                            className="p-1 hover:scale-110 transition-transform"
                                        >
                                            <StarIcon
                                                className={`w-8 h-8 ${star <= userRating ? 'text-yellow-400' : 'text-gray-600'}`}
                                                filled={star <= userRating}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Review (Optional)</label>
                                <textarea
                                    value={userReview}
                                    onChange={(e) => setUserReview(e.target.value)}
                                    placeholder="Share your thoughts about this note..."
                                    rows={3}
                                    className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setShowRatingModal(false)}
                                    className="flex-1 bg-white/10 border border-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitRating}
                                    disabled={userRating === 0 || rating}
                                    className={`flex-1 bg-gradient-to-r ${theme.gradient} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center space-x-2`}
                                >
                                    {rating ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <span>Submit Rating</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/30 rounded-2xl p-6 max-w-md w-full">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrashIcon className="w-8 h-8 text-red-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Delete Note</h3>
                                <p className="text-gray-300">Are you sure you want to delete this note? This action cannot be undone.</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 bg-white/10 border border-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {deleting ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <span>Delete</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Login Modal */}
                {showLoginModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="max-w-md w-full mx-4">
                            <LoginPrompt />
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
        {/* <AdBanner/> */}
            </div>
        </HomeLayout>
    );
}
