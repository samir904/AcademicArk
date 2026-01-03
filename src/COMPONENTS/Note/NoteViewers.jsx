import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ✅ Eye Icon Component
const EyeIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

// ✅ Chevron Down Icon for "Show More" button
const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);

/**
 * NoteViewers Component
 * Displays all users who viewed a note with their profiles, roles, and academic info
 * 
 * Props:
 * - viewedBy: Array of user objects with _id, fullName, avatar, role, academicProfile
 * - totalViews: Total number of views (number)
 */
const NoteViewers = ({ viewedBy = [], totalViews = 0 }) => {
    const [showAllViewers, setShowAllViewers] = useState(false);
    
    // ✅ Return null if no viewers
    if (!viewedBy || viewedBy.length === 0) {
        return null;
    }

    // ✅ Show first 5 viewers by default, expand to show all when toggled
    const displayedViewers = showAllViewers ? viewedBy : viewedBy.slice(0, 5);
    const hasMore = viewedBy.length > 5;

    // ✅ Get role badge styling
    const getRoleBadgeStyles = (role) => {
        switch (role) {
            case 'TEACHER':
                return {
                    bg: 'bg-green-500/20',
                    text: 'text-green-300',
                    border: 'border-green-500/50',
                    label: 'teacher'
                };
            case 'ADMIN':
                return {
                    bg: 'bg-red-500/20',
                    text: 'text-red-300',
                    border: 'border-red-500/50',
                    label: 'admin'
                };
            default:
                return {
                    bg: 'bg-blue-500/20',
                    text: 'text-blue-300',
                    border: 'border-blue-500/50',
                    label: 'student'
                };
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6 animate-fadeIn">
            {/* ✅ Header Section */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                        <EyeIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span>Who Viewed This Note</span>
                    <span className="text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full text-lg font-semibold border border-cyan-500/30">
                        {totalViews}
                    </span>
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                    {viewedBy.length} {viewedBy.length === 1 ? 'person' : 'people'} have viewed this note
                </p>
            </div>

            {/* ✅ Viewers Grid - Responsive Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {displayedViewers.map((viewer, index) => {
                    const roleStyles = getRoleBadgeStyles(viewer.role);
                    
                    return (
                        <Link
                            key={viewer._id || index}
                            to={`/profile/${viewer._id}`}
                            className="group relative"
                            title={`View ${viewer.fullName}'s profile`}
                        >
                            {/* ✅ Viewer Card - FIX: Added overflow-hidden to parent */}
                            <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 h-full flex flex-col items-center overflow-hidden">
                                
                                {/* ✅ Avatar Container */}
                                <div className="flex justify-center mb-3 relative flex-shrink-0">
                                    {viewer.avatar?.secure_url?.startsWith('http') ? (
                                        <img
                                            src={viewer.avatar.secure_url}
                                            alt={viewer.fullName || 'User'}
                                            loading='lazy'
                                            className="w-14 h-14 rounded-full border-2 border-cyan-400/50 object-cover shadow-lg group-hover:border-cyan-300 transition-colors"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) {
                                                    e.target.nextSibling.style.display = 'flex';
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-cyan-400/50 shadow-lg">
                                            <span className="text-white text-xl font-bold">
                                                {viewer.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* ✅ Fallback Avatar */}
                                    <div className="hidden w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-cyan-400/50 shadow-lg">
                                        <span className="text-white text-xl font-bold">
                                            {viewer.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>

                                    {/* ✅ Role Indicator Badge - Top Right */}
                                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${roleStyles.bg} border ${roleStyles.border}`}>
                                        {viewer.role === 'TEACHER' ? '👨‍🏫' : viewer.role === 'ADMIN' ? '⚙️' : '👤'}
                                    </div>
                                </div>

                                {/* ✅ User Name - FIX: Full width with proper truncation */}
                                <h3 className="w-full text-white font-semibold text-center capitalize truncate text-sm px-1 break-words leading-tight">
                                    {viewer.fullName || 'Anonymous User'}
                                </h3>

                                {/* ✅ Role Badge */}
                                <div className="flex justify-center mt-2 mb-2 flex-shrink-0">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium border whitespace-nowrap ${roleStyles.bg} ${roleStyles.text} ${roleStyles.border}`}>
                                        {roleStyles.label}
                                    </span>
                                </div>

                                {/* ✅ Academic Info (Semester & Branch) */}
                                {viewer.academicProfile?.semester ? (
                                    <div className="text-center mt-2 text-xs text-gray-300 space-y-0.5 flex-grow flex flex-col justify-end w-full">
                                        <div className="bg-white/5 px-2 py-1 rounded border border-white/10 truncate">
                                            <p className="font-medium">Sem {viewer.academicProfile.semester}</p>
                                        </div>
                                        {viewer.academicProfile?.branch && (
                                            <p className="text-gray-400 truncate">{viewer.academicProfile.branch}</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-xs text-gray-500 mt-2 flex-grow flex items-end">
                                        Profile incomplete
                                    </div>
                                )}

                                {/* ✅ Hover Gradient Effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* ✅ Show More / Show Less Button */}
            {hasMore && (
                <div className="mb-6">
                    <button
                        onClick={() => setShowAllViewers(!showAllViewers)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group"
                    >
                        <span>
                            {showAllViewers 
                                ? `Show Less (${viewedBy.length} total)` 
                                : `Show All ${viewedBy.length} Viewers`
                            }
                        </span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${showAllViewers ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            )}

            {/* ✅ Stats Summary Footer */}
            <div className="pt-6 border-t border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Total Views Stat */}
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <EyeIcon className="w-4 h-4 text-cyan-400" />
                            <span className="text-gray-400 text-sm">Total Views</span>
                        </div>
                        <p className="text-2xl font-bold text-cyan-400">{totalViews}</p>
                    </div>

                    {/* Unique Viewers Stat */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.5 1.5H.5v15h15v-15H10.5zm6 14h-12v-12h12v12z" />
                            </svg>
                            <span className="text-gray-400 text-sm">Unique Viewers</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-400">{viewedBy.length}</p>
                    </div>

                    {/* Average Views per Viewer */}
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-400 text-sm">Engagement</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-400">
                            {viewedBy.length > 0 ? ((totalViews / viewedBy.length).toFixed(1)) : '0'}x
                        </p>
                    </div>
                </div>
            </div>

            {/* ✅ Info Message */}
            <div className="mt-4 p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-400 text-center">
                    💡 <span className="text-gray-300">Click on any profile to view their academic details and contributions</span>
                </p>
            </div>
        </div>
    );
};

export default NoteViewers;