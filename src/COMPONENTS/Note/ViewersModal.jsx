import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Eye, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getNoteViewers } from '../../REDUX/Slices/noteslice';

/**
 * ViewersModal Component
 * ✅ FIXED VERSION with STUDENT/USER mapping
 * 
 * Features:
 * - Displays list of note viewers
 * - Search by name (real-time filtering)
 * - Filter by role: STUDENT (maps to USER), TEACHER, ADMIN
 * - Pagination support
 * - Keyboard navigation (Escape to close)
 * - Responsive design (mobile, tablet, desktop)
 * - Accessibility features (ARIA labels, keyboard support)
 * 
 * Redux Integration:
 * - Dispatches getNoteViewers thunk
 * - Reads from state.note.viewers
 * 
 * Database Mapping:
 * - UI shows "STUDENT", Database has "USER"
 * - Automatic conversion: STUDENT → USER
 */

const ViewersModal = ({ isOpen, noteId, totalViews = 0, onClose }) => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(20);

    // ✅ Get viewers data from Redux with proper null checking
    const viewersState = useSelector(state => state.note?.viewers);
    const viewersData = viewersState?.data || [];
    const loading = viewersState?.loading || false;
    const error = viewersState?.error || null;
    const pagination = viewersState?.pagination || {};

    // ✅ Fetch viewers when modal opens
    useEffect(() => {
        console.log('👀 Modal opened');
        console.log('isOpen:', isOpen, 'noteId:', noteId);

        if (isOpen && noteId) {
            console.log('🎯 Fetching viewers for noteId:', noteId);

            // Reset state
            setSearchTerm('');
            setFilterRole('all');
            setCurrentPage(1);

            // Dispatch Redux thunk to fetch viewers
            dispatch(
                getNoteViewers({
                    noteId: noteId,
                    page: 1,
                    limit: 20,
                })
            )
                .then((result) => {
                    console.log('✅ Viewers fetched successfully:', result);
                })
                .catch((error) => {
                    console.error('❌ Error fetching viewers:', error);
                });
        } else {
            console.log(
                '⚠️ Conditions not met - isOpen:',
                isOpen,
                'noteId:',
                noteId
            );
        }
    }, [isOpen, noteId, dispatch]); // dispatch MUST be in dependencies

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // ✅ Memoized filtered viewers (client-side filtering)
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
        console.log('🔍 Filter changed to:', role);
        setFilterRole(role);
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

            const scrollContainer = document.getElementById('viewers-list');
            if (scrollContainer) {
                scrollContainer.scrollTop = 0;
            }
        },
        [dispatch, noteId, limit]
    );

    if (!isOpen) return null;

    const uniqueViewerCount = filteredViewers.length;
    const viewerStats = {
        total: viewersData.length || 0,
        filtered: uniqueViewerCount,
        avgViews:
            uniqueViewerCount > 0
                ? (totalViews / uniqueViewerCount).toFixed(1)
                : '0',
    };

    const { current_page, total_pages, total_viewers } = pagination || {};

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                onClick={handleBackdropClick}
                aria-hidden="true"
                role="presentation"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div
                    className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/10 rounded-2xl overflow-hidden flex flex-col w-full max-w-4xl max-h-[90vh] my-auto shadow-2xl transform transition-all duration-300 animate-in fade-in"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="viewers-title"
                    aria-describedby="viewers-description"
                >
                    {/* Header - Sticky */}
                    <div className="sticky top-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/10 p-6 flex items-center justify-between z-10">
                        <div className="flex items-center space-x-4 min-w-0">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
                                <Eye className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div className="min-w-0">
                                <h2
                                    id="viewers-title"
                                    className="text-2xl font-bold text-white"
                                >
                                    Note Viewers
                                </h2>
                                <p
                                    id="viewers-description"
                                    className="text-cyan-300 text-sm"
                                >
                                    {loading
                                        ? 'Loading...'
                                        : `${uniqueViewerCount} of ${total_viewers || 0} viewers`}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
                            aria-label="Close modal"
                            type="button"
                        >
                            <X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Search & Filter - Sticky */}
                    <div className="sticky top-[88px] bg-gray-800/50 border-b border-white/10 p-6 space-y-4 z-10">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
                                aria-label="Search viewers by name"
                            />
                        </div>

                        {/* Filter Buttons - ✅ FIXED: Maps STUDENT to USER */}
                        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                            <span className="text-sm text-gray-400 flex-shrink-0 whitespace-nowrap">
                                Filter:
                            </span>
                            {['all', 'STUDENT', 'TEACHER', 'ADMIN'].map(
                                (roleLabel) => {
                                    // ✅ Map STUDENT to USER for database
                                    const dbRole = roleLabel === 'STUDENT' ? 'USER' : roleLabel;

                                    return (
                                        <button
                                            key={roleLabel}
                                            onClick={() =>
                                                handleFilterChange(dbRole)
                                            }
                                            className={`px-4 py-1 rounded-full text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent ${
                                                filterRole === dbRole
                                                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 focus:ring-cyan-400/50'
                                                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50 focus:ring-gray-400/50'
                                            }`}
                                            aria-pressed={filterRole === dbRole}
                                            type="button"
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

                    {/* Viewers List - Scrollable */}
                    <div
                        id="viewers-list"
                        className="flex-1 overflow-y-auto divide-y divide-gray-700/50 min-h-0"
                    >
                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-gray-400">
                                        Loading viewers...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Viewers List */}
                        {!loading && filteredViewers.length > 0 ? (
                            filteredViewers.map((viewer, index) => (
                                <div
                                    key={viewer._id || index}
                                    className="p-4 hover:bg-white/5 border-l-4 border-l-transparent hover:border-l-cyan-400 transition-all duration-200"
                                    role="listitem"
                                >
                                    <div className="flex items-center space-x-4">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            {viewer.avatar?.secure_url?.startsWith(
                                                'http'
                                            ) ? (
                                                <img
                                                    src={
                                                        viewer.avatar.secure_url
                                                    }
                                                    alt={
                                                        viewer.fullName ||
                                                        'User avatar'
                                                    }
                                                    loading="lazy"
                                                    className="w-12 h-12 rounded-full border-2 border-cyan-400/50 object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center border-2 border-cyan-400/50">
                                                    <span className="text-white font-bold text-lg">
                                                        {viewer.fullName
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            'U'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-semibold capitalize truncate">
                                                {viewer.fullName ||
                                                    'Anonymous'}
                                            </h3>
                                            {/* <p className="text-xs text-gray-500 mt-1 truncate">
                                                {viewer.email || 'No email'}
                                            </p> */}
                                        </div>

                                        {/* Role Badge - ✅ Display STUDENT for USER role */}
                                        <div className="flex-shrink-0">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-medium border whitespace-nowrap transition-colors duration-200 ${
                                                    viewer.role ===
                                                    'TEACHER'
                                                        ? 'bg-green-500/20 text-green-300 border-green-500/50'
                                                        : viewer.role ===
                                                          'ADMIN'
                                                        ? 'bg-red-500/20 text-red-300 border-red-500/50'
                                                        : viewer.role ===
                                                          'USER'
                                                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                                                        : 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                                                }`}
                                            >
                                                {/* ✅ Display STUDENT for USER role */}
                                                {viewer.role === 'USER'
                                                    ? 'STUDENT'
                                                    : viewer.role}
                                            </span>
                                        </div>

                                        {/* Academic Info - Hidden on Mobile */}
                                        <div className="flex-shrink-0 text-right hidden sm:block">
                                            {viewer.academicProfile
                                                ?.semester ? (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-300">
                                                        Sem{' '}
                                                        {
                                                            viewer
                                                                .academicProfile
                                                                .semester
                                                        }
                                                    </p>
                                                    {viewer.academicProfile
                                                        ?.branch && (
                                                        <p className="text-xs text-gray-500">
                                                            {
                                                                viewer
                                                                    .academicProfile
                                                                    .branch
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-500">
                                                    No profile
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : !loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400 font-medium">
                                        {error
                                            ? 'Error loading viewers'
                                            : 'No viewers found'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {error ||
                                            'Try adjusting your search or filters'}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Pagination Controls */}
                    {!loading && total_pages > 1 && (
                        <div className="bg-gray-800/50 border-t border-white/10 p-4 flex items-center justify-center space-x-2">
                            <button
                                onClick={() =>
                                    handlePageChange(current_page - 1)
                                }
                                disabled={current_page === 1}
                                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                aria-label="Previous page"
                                type="button"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-400" />
                            </button>

                            <div className="flex items-center space-x-2">
                                {Array.from({ length: total_pages }, (_, i) =>
                                    i + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                                            current_page === page
                                                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50'
                                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                        }`}
                                        type="button"
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
                                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                aria-label="Next page"
                                type="button"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-800/50 border-t border-white/10 p-4 flex items-center justify-between z-10">
                        <div className="text-sm text-gray-400">
                            <span>Total Views:</span>
                            <span className="font-bold text-cyan-400 ml-2">
                                {totalViews}
                            </span>
                            <span className="text-gray-500 ml-3">|</span>
                            <span className="text-gray-400 ml-3">Avg:</span>
                            <span className="font-bold text-cyan-400 ml-2">
                                {viewerStats.avgViews}x
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-95"
                            type="button"
                            aria-label="Close viewers modal"
                        >
                            Close
                        </button>
                    </div>

                    {/* Keyboard Hint */}
                    <div className="hidden sm:block absolute bottom-4 left-4 text-xs text-gray-500">
                        Press{' '}
                        <kbd className="px-2 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-300">
                            ESC
                        </kbd>{' '}
                        to close
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewersModal;
