import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, downloadnote } from '../../REDUX/Slices/noteslice.js';
import LoginPrompt from '../../COMPONENTS/LoginPrompt.jsx';

// Icons
const BookmarkIcon = ({ className, filled }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
);

const StarIcon = ({ className, filled }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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

const AwardIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

// ✨ NEW: Info Icon
const InfoIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ✨ FIXED: Proper Chevron Icon
const ChevronDownIcon = ({ className, isOpen }) => (
  <svg 
    className={`${className} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// ✨ NEW: Metrics Icon (Chart/Dashboard style)
const MetricsIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);


export default function PyqCard({ note }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState(false); // ✨ NEW: Collapsible metrics
  const [expandedTips, setExpandedTips] = useState(false); // ✨ NEW: Collapsible tips
  
  const dispatch = useDispatch();
  const { bookmarkingNotes, downloadingNotes } = useSelector(state => state.note);
  const isBookmarking = bookmarkingNotes.includes(note._id);
  const isDownloading = downloadingNotes.includes(note._id);
  const user = useSelector(state => state.auth.data);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const isBookmarked = note.bookmarkedBy?.includes(user?._id);

  const avgRating = note.rating?.length > 0
    ? (note.rating.reduce((sum, r) => sum + r.rating, 0) / note.rating.length).toFixed(1)
    : 0;

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    dispatch(toggleBookmark(note._id));
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    dispatch(downloadnote({ noteId: note._id, title: note.title }));
  };

  return (
    // ✨ CHANGED: Cyan color scheme instead of red
    <div className="group bg-gradient-to-br from-cyan-900/90 to-blue-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-[1.02] transition-all duration-300 hover:border-cyan-400/50 relative">
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-800/10 to-blue-800/10 opacity-50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      
      {/* Header with PYQ Badge */}
      <div className="relative p-4 border-b border-cyan-500/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-bold text-white flex items-center space-x-1 shadow-lg">
              <TargetIcon className="w-3 h-3" />
              <span>PYQ</span>
            </div>
            <div className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-200">
              Exam Pattern
            </div>
          </div>
          <button
            onClick={handleBookmark}
            disabled={isBookmarking}
            className={`relative p-2 rounded-full hover:bg-cyan-500/20 transition-all duration-300 group/bookmark ${
              isBookmarking ? 'animate-pulse' : ''
            }`}
          >
            {isBookmarking ? (
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 rounded-full border-2 border-yellow-300/60 animate-pulse"></div>
                <div 
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-yellow-300 border-r-yellow-300"
                  style={{ animation: 'spin 1s linear infinite' }}
                ></div>
                <BookmarkIcon 
                  className="w-5 h-5 text-yellow-300/50 absolute inset-0"
                  filled={isBookmarked}
                />
                <style>{`
                  @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ) : (
              <BookmarkIcon 
                className={`w-5 h-5 transition-all duration-300 ${
                  isBookmarked 
                    ? 'text-yellow-300 scale-110' 
                    : 'text-cyan-200'
                } hover:text-yellow-300 hover:scale-125`}
                filled={isBookmarked}
              />
            )}
          </button>
        </div>

        <h3 className="text-lg font-bold capitalize text-white line-clamp-2 group-hover:text-cyan-200 transition-colors mb-2">
          {note.title}
        </h3>

        <div className="flex items-center space-x-3 text-xs text-cyan-200 flex-wrap gap-2">
          <span className="bg-cyan-500/20 px-2 py-1 rounded border border-cyan-500/30">{note.subject}</span>
          <span>Sem {note.semester}</span>
          <span>•</span>
          <span>{note.university}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative p-4 space-y-3">
        
        {/* Description */}
<p className="text-sm text-green-100 line-clamp-2 leading-relaxed opacity-90 flex-shrink-0">
          {note.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-cyan-300 flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            {note.rating?.length > 0 && (
              <div className="flex items-center space-x-1 bg-cyan-500/20 px-2 py-1 rounded">
                <StarIcon className="w-3 h-3 text-cyan-400" filled />
                <span>{avgRating}</span>
                <span>({note.rating.length})</span>
              </div>
            )}
            <div className="flex items-center space-x-1 bg-cyan-500/20 px-2 py-1 rounded">
              <DownloadIcon className="w-3 h-3" />
              <span>{note.downloads || 0} downloads</span>
            </div>
          </div>
          <Link
            to={`/profile/${note.uploadedBy?._id}`}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center space-x-1">
              {note.uploadedBy?.avatar?.secure_url?.startsWith('http') ? (
                <img
                  src={note.uploadedBy.avatar.secure_url}
                  alt={note.uploadedBy.fullName}
                  loading="lazy"
                  className="w-5 h-5 rounded-full border border-cyan-500/30"
                />
              ) : (
                <div className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {note.uploadedBy?.fullName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-cyan-200 text-xs">{note.uploadedBy?.fullName || 'Unknown'}</span>
            </div>
          </Link>
        </div>

        {/* ✨ IMPROVED: Collapsible Exam Metrics */}
        <div className="border border-cyan-500/20 rounded-lg overflow-hidden">
         <button
    onClick={() => setExpandedMetrics(!expandedMetrics)}
    className="w-full flex items-center justify-between p-3 bg-cyan-500/10 hover:bg-cyan-500/15 transition-colors"
  >
    <div className="flex items-center space-x-2">
      <MetricsIcon className="w-4 h-4 text-cyan-300" />
      <span className="text-xs font-semibold text-cyan-200">Exam Metrics</span>
    </div>
    <ChevronDownIcon className="w-4 h-4 text-cyan-300" isOpen={expandedMetrics} />
  </button>
          
          {expandedMetrics && (
            <div className="p-3 bg-cyan-500/5 border-t border-cyan-500/20 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <ClockIcon className="w-4 h-4 text-cyan-300 mx-auto mb-1" />
                  <div className="text-xs text-cyan-200 font-medium">3 Hours</div>
                  <div className="text-xs text-cyan-400">Duration</div>
                </div>
                <div className="text-center p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <AwardIcon className="w-4 h-4 text-cyan-300 mx-auto mb-1" />
                  <div className="text-xs text-cyan-200 font-medium">70 Marks</div>
                  <div className="text-xs text-cyan-400">Total</div>
                </div>
                <div className="text-center p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <TargetIcon className="w-4 h-4 text-cyan-300 mx-auto mb-1" />
                  <div className="text-xs text-cyan-200 font-medium">High</div>
                  <div className="text-xs text-cyan-400">Priority</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✨ IMPROVED: Collapsible Study Tips */}
        <div className="border border-cyan-500/20 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedTips(!expandedTips)}
            className="w-full flex items-center justify-between p-3 bg-cyan-500/10 hover:bg-cyan-500/15 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <InfoIcon className="w-4 h-4 text-cyan-300" />
              <span className="text-xs font-semibold text-cyan-200">Exam Tips</span>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-cyan-300" isOpen={expandedTips} />
          </button>
          
          {expandedTips && (
            <div className="p-3 bg-cyan-500/5 border-t border-cyan-500/20 space-y-3">
              <div className="space-y-3">
                <div className="p-3 bg-cyan-500/10 rounded border border-cyan-500/20">
                  <h4 className="text-xs font-semibold text-cyan-300 mb-1 flex items-center space-x-1">
                    <span>📚</span>
                    <span>Pattern Recognition</span>
                  </h4>
                  <p className="text-xs text-cyan-100 leading-relaxed">
                    Practice previous year questions to identify recurring patterns and frequently asked topics.
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                  <h4 className="text-xs font-semibold text-blue-300 mb-1 flex items-center space-x-1">
                    <span>⏱️</span>
                    <span>Time Management</span>
                  </h4>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Solve questions within time limits to build exam-ready confidence and improve speed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="relative p-4 pt-0 flex items-center space-x-2">
        <Link
          to={`/notes/${note._id}`}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-xl text-sm font-bold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-cyan-500/40 flex items-center justify-center space-x-2"
        >
          <TargetIcon className="w-4 h-4" />
          <span>View Details</span>
        </Link>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 py-3 px-4 rounded-xl hover:bg-cyan-500/30 transition-all duration-300 disabled:opacity-50 hover:scale-105"
        >
          {isDownloading ? (
            <div className="w-4 h-4 animate-spin border-2 border-cyan-300 border-t-transparent rounded-full"></div>
          ) : (
            <DownloadIcon className="w-4 h-4" />
          )}
        </button>
      </div>

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
    </div>
  );
}
