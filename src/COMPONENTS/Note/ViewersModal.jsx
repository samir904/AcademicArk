import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNoteViewers } from '../../REDUX/Slices/noteslice';
import { Link } from 'react-router-dom';

/**
 * ✨ ViewersModal Premium Component - FIXED SCROLLING
 * 
 * Beautiful glassmorphism UI with all features included
 * NOW WITH PROPER SCROLLING!
 * 
 * Features:
 * - Glassmorphism design (frosted glass effect)
 * - Blue/Purple/Pink gradients
 * - Smooth animations
 * - Search by name (real-time)
 * - Filter by role (STUDENT→USER, TEACHER, ADMIN)
 * - Pagination (20 per page)
 * - ✅ PROPER SCROLLING (FIXED)
 * - Mobile responsive
 * - Fully accessible
 * - No external icon dependencies
 */

// Close Icon
const XIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
        />
    </svg>
);

// Search Icon
const SearchIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
    </svg>
);

// User Icon
const UserIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
    </svg>
);

// Eye Icon
const EyeIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
    </svg>
);

// Chevron Left Icon
const ChevronLeftIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
        />
    </svg>
);

// Chevron Right Icon
const ChevronRightIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
        />
    </svg>
);

const ViewersModal = ({ isOpen, noteId, totalViews = 0, onClose }) => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(20);

    // Get viewers data from Redux
    const viewersState = useSelector(state => state.note?.viewers);
    const viewersData = viewersState?.data || [];
    const loading = viewersState?.loading || false;
    const error = viewersState?.error || null;
    const pagination = viewersState?.pagination || {};

    // Fetch viewers when modal opens
    useEffect(() => {
        if (isOpen && noteId) {
            setSearchTerm('');
            setFilterRole('all');
            setCurrentPage(1);

            dispatch(
                getNoteViewers({
                    noteId: noteId,
                    page: 1,
                    limit: 20,
                })
            ).catch((error) => {
                console.error('❌ Error fetching viewers:', error);
            });
        }
    }, [isOpen, noteId, dispatch]);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Memoized filtered viewers
    const filteredViewers = useMemo(() => {
        if (!Array.isArray(viewersData)) {
            return [];
        }

        return viewersData.filter((viewer) => {
            const matchesSearch = viewer.fullName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

            let matchesRole = filterRole === 'all';

            if (filterRole !== 'all') {
                matchesRole = viewer.role === filterRole;
            }

            return matchesSearch && matchesRole;
        });
    }, [viewersData, searchTerm, filterRole]);

    // Memoized callbacks
    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);

    const handleFilterChange = useCallback((role) => {
        const dbRole = role === 'STUDENT' ? 'USER' : role;
        setFilterRole(dbRole);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback(
        (page) => {
            setCurrentPage(page);
            dispatch(
                getNoteViewers({
                    noteId,
                    page,
                    limit,
                })
            );
        },
        [dispatch, noteId, limit]
    );

    if (!isOpen) return null;

    const uniqueViewerCount = filteredViewers.length;
    const { current_page, total_pages, total_viewers } = pagination || {};

    return (
        <>
            {/* Premium Backdrop with Blur */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 transition-opacity duration-300"
                onClick={handleBackdropClick}
            />

            {/* Premium Modal Container - FIXED SCROLLING */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-2xl my-auto">
                    {/* Glassmorphism Card - PROPERLY CONSTRAINED */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        
                        {/* Header - Sticky */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border-b border-white/10 p-6 z-10">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                aria-label="Close modal"
                            >
                                <XIcon className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
                            </button>

                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-white/10 rounded-lg">
                                    <EyeIcon className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Note Viewers
                                    </h2>
                                    <p className="text-sm text-white/60 mt-0.5">
                                        {loading
                                            ? 'Loading viewers...'
                                            : `${uniqueViewerCount} of ${total_viewers || 0} viewers`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Search & Filter - Sticky */}
                        <div className="sticky top-[88px] border-b border-white/10 p-6 space-y-4 bg-white/5 z-10">
                            {/* Search Bar */}
                            <div className="relative">
                                <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-white/40 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm"
                                />
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {['all', 'STUDENT', 'TEACHER', 'ADMIN'].map(
                                    (roleLabel) => {
                                        const dbRole =
                                            roleLabel === 'STUDENT'
                                                ? 'USER'
                                                : roleLabel;

                                        return (
                                            <button
                                                key={roleLabel}
                                                onClick={() =>
                                                    handleFilterChange(
                                                        roleLabel
                                                    )
                                                }
                                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                                                    filterRole === dbRole
                                                        ? 'bg-white/20 text-white border border-white/40'
                                                        : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/15'
                                                }`}
                                            >
                                                {roleLabel === 'all'
                                                    ? 'All'
                                                    : roleLabel}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        {/* Viewers List - SCROLLABLE CONTENT AREA */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                                        <p className="text-white/60">
                                            Loading viewers...
                                        </p>
                                    </div>
                                </div>
                            ) : filteredViewers.length > 0 ? (
                                <div className="divide-y divide-white/10">
                                    {filteredViewers.map((viewer, index) => (
                                        <div
                                            key={viewer._id || index}
                                            className="p-4 hover:bg-white/5 transition-colors duration-200 border-l-4 border-l-transparent hover:border-l-blue-400"
                                        >
                                            <Link
                                            to={`/profile/${viewer?._id}`}>
                                            <div className="flex items-center gap-4">
                                                {/* Avatar */}
                                                <div className="flex-shrink-0">
                                                    {viewer.avatar?.secure_url?.startsWith(
                                                        'http'
                                                    ) ? (
                                                        <img
                                                            src={
                                                                viewer.avatar
                                                                    .secure_url
                                                            }
                                                            alt={viewer.fullName}
                                                            className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-white/20">
                                                            <span className="text-white font-semibold text-sm">
                                                                {viewer.fullName
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase() ||
                                                                    'U'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-semibold truncate">
                                                        {viewer.fullName ||
                                                            'Anonymous'}
                                                    </h4>
                                                    {/* <p className="text-xs text-white/50 truncate">
                                                        {viewer.email ||
                                                            'No email'}
                                                    </p> */}
                                                </div>

                                                {/* Role Badge */}
                                                <div className="flex-shrink-0">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                                            viewer.role ===
                                                            'TEACHER'
                                                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                                : viewer.role ===
                                                                  'ADMIN'
                                                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                        }`}
                                                    >
                                                        {viewer.role ===
                                                        'USER'
                                                            ? 'STUDENT'
                                                            : viewer.role}
                                                    </span>
                                                </div>

                                                {/* Academic Info */}
                                                <div className="hidden md:block text-right flex-shrink-0">
                                                    {viewer.academicProfile
                                                        ?.semester && (
                                                        <p className="text-xs text-white/70">
                                                            Sem{' '}
                                                            {
                                                                viewer
                                                                    .academicProfile
                                                                    .semester
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <UserIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                                        <p className="text-white/60 font-medium">
                                            {error
                                                ? 'Error loading viewers'
                                                : 'No viewers found'}
                                        </p>
                                        <p className="text-xs text-white/40 mt-1">
                                            Try adjusting your search or filters
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination - Sticky Bottom */}
                        {!loading && total_pages > 1 && (
                            <div className="sticky bottom-[88px] border-t border-white/10 bg-white/5 p-4 flex items-center justify-center gap-2 z-10">
                                <button
                                    onClick={() =>
                                        handlePageChange(current_page - 1)
                                    }
                                    disabled={current_page === 1}
                                    className="p-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeftIcon className="w-5 h-5 text-white/60" />
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: total_pages }, (_, i) =>
                                        i + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                                                current_page === page
                                                    ? 'bg-white/20 text-white border border-white/40'
                                                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                                            }`}
                                            aria-label={`Go to page ${page}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() =>
                                        handlePageChange(current_page + 1)
                                    }
                                    disabled={current_page === total_pages}
                                    className="p-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
                                    aria-label="Next page"
                                >
                                    <ChevronRightIcon className="w-5 h-5 text-white/60" />
                                </button>
                            </div>
                        )}

                        {/* Footer - Sticky Bottom */}
                        <div className="sticky bottom-0 border-t border-white/10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 flex items-center justify-between z-10">
                            <div className="text-sm text-white/60">
                                <span>Total: </span>
                                <span className="font-semibold text-white">
                                    {totalViews}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold border border-white/30 transition-all duration-200"
                                aria-label="Close viewers modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewersModal;