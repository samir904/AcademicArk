import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, downloadnote } from '../../REDUX/Slices/noteslice.js';
import LoginPrompt from '../../COMPONENTS/LoginPrompt.jsx';

// Icon components (same as before)
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

const PencilIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.364-6.364a1 1 0 011.414 0l3.586 3.586a1 1 0 010 1.414L13 17h-4v-4z" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const FireIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2c1 0 2 1 2 2v4c0 1-1 2-2 2s-2-1-2-2V4c0-1 1-2 2-2zm0 10c2.21 0 4 1.79 4 4 0 2.05-1.53 3.76-3.56 3.97V22h-1v-2.03C9.53 19.76 8 18.05 8 16c0-2.21 1.79-4 4-4z" />
  </svg>
);

const ChevronDownIcon = ({ className, isOpen }) => (
  <svg 
    className={`${className} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 10l5 5 5-5" />
  </svg>
);


// ✨ NEW: InfoIcon for collapsible study tips
const InfoIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
// ✨ NEW: Metrics Icon (Chart/Dashboard style)
const MetricsIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default function HandwrittenCard({ note }) {
  const dispatch = useDispatch();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState(false);
  const [expandedTips, setExpandedTips] = useState(false); // ✨ NEW: For study tips
  
  const { bookmarkingNotes, downloadingNotes } = useSelector(state => state.note);
  const isBookmarking = bookmarkingNotes.includes(note._id);
  const isDownloading = downloadingNotes.includes(note._id);
  const user = useSelector(state => state.auth.data);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const isBookmarked = note.bookmarkedBy?.includes(user?._id);
  
  const avgRating = note.rating?.length
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

  const getQualityLevel = () => {
    const downloads = note.downloads || 0;
    const ratings = note.rating?.length || 0;
    const avgRat = parseFloat(avgRating) || 0;
    const score = downloads * 0.3 + ratings * 0.4 + avgRat * 0.3;

    if (score >= 4) return { level: 'Premium', color: 'text-emerald-400', stars: 5 };
    if (score >= 3) return { level: 'Quality', color: 'text-emerald-300', stars: 4 };
    if (score >= 2) return { level: 'Good', color: 'text-teal-400', stars: 3 };
    return { level: 'Standard', color: 'text-green-400', stars: 2 };
  };

  const quality = getQualityLevel();

  return (
    <div className="group bg-gradient-to-br from-green-900/90 to-teal-900/80 backdrop-blur-xl border border-green-500/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-green-500/25 hover:scale-[1.02] transition-all duration-300 hover:border-green-400/50 relative">
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-800/10 to-teal-800/10 opacity-50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-teal-400/10 rounded-full blur-3xl"></div>

      {/* Header with Handwritten Badge */}
      <div className="relative p-4 border-b border-green-500/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-full text-xs font-bold text-white flex items-center space-x-1 shadow-lg">
              <PencilIcon className="w-3 h-3" />
              <span>HANDWRITTEN</span>
            </div>
            <div className={`px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs ${quality.color} font-medium`}>
              {quality.level} Quality
            </div>
          </div>
          <button
            onClick={handleBookmark}
            disabled={isBookmarking}
            className={`relative p-2 rounded-full hover:bg-green-500/20 transition-all duration-300 group/bookmark ${
              isBookmarking ? 'animate-pulse' : ''
            }`}
          >
            {isBookmarking ? (
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 rounded-full border-2 border-green-300/60 animate-pulse"></div>
                <div 
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-300 border-r-green-300"
                  style={{ animation: 'spin 1s linear infinite' }}
                ></div>
                <BookmarkIcon 
                  className="w-5 h-5 text-green-300/50 absolute inset-0"
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
                    ? 'text-green-300 scale-110' 
                    : 'text-green-300'
                } hover:text-green-200 hover:scale-125`}
                filled={isBookmarked}
              />
            )}
          </button>
        </div>

        <h3 className="text-lg font-bold capitalize text-white line-clamp-2 group-hover:text-green-200 transition-colors mb-2">
          {note.title}
        </h3>

        <div className="flex items-center space-x-3 text-xs text-green-200 flex-wrap gap-2">
          <span className="bg-green-500/20 px-2 py-1 rounded border border-green-500/30">{note.subject}</span>
          <span>Sem {note.semester}</span>
          <span>•</span>
          <span>{note.university}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative p-4 space-y-3">

        {/* Description */}
        <div>
          <p className="text-sm text-green-100 leading-relaxed opacity-90">
            {note.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-green-300 flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            {note.rating?.length > 0 && (
              <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded">
                <StarIcon className="w-3 h-3 text-green-400" filled />
                <span>{avgRating}</span>
                <span>({note.rating.length})</span>
              </div>
            )}
            <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded">
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
                  alt={note.uploadedBy.fullName || 'User'}
                  loading="lazy"
                  className="w-5 h-5 rounded-full border border-green-500/30"
                />
              ) : (
                <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {note.uploadedBy?.fullName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-green-200 text-xs">{note.uploadedBy?.fullName || 'Unknown'}</span>
            </div>
          </Link>
        </div>

        {/* ✨ IMPROVED: Collapsible Quality Metrics */}
        <div className="border border-green-500/20 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedMetrics(!expandedMetrics)}
            className="w-full flex items-center justify-between p-3 bg-green-500/10 hover:bg-green-500/15 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <MetricsIcon className="w-4 h-4 text-green-300" />
              <span className="text-xs font-semibold text-green-200">Quality Metrics</span>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-green-300" isOpen={expandedMetrics} />
          </button>
          {expandedMetrics && (
            <div className="p-3 bg-green-500/5 border-t border-green-500/20 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex justify-center mb-1">
                    {[...Array(quality.stars)].map((_, i) => (
                      <StarIcon key={i} className="w-3 h-3 text-green-400" filled />
                    ))}
                  </div>
                  <div className="text-xs text-green-200 font-medium">Clarity</div>
                </div>
                <div className="text-center p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <TrendingUpIcon className="w-4 h-4 text-green-300 mx-auto mb-1" />
                  <div className="text-xs text-green-200 font-medium">Personal</div>
                  <div className="text-xs text-green-400">Notes</div>
                </div>
                <div className="text-center p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <FireIcon className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                  <div className="text-xs text-green-200 font-medium">Handwritten</div>
                  <div className="text-xs text-green-400">Content</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✨ IMPROVED: Collapsible Study Tips */}
        <div className="border border-green-500/20 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedTips(!expandedTips)}
            className="w-full flex items-center justify-between p-3 bg-green-500/10 hover:bg-green-500/15 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <InfoIcon className="w-4 h-4 text-green-300" />
              <span className="text-xs font-semibold text-green-200">Study Tips</span>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-green-300" isOpen={expandedTips} />
          </button>
          
          {expandedTips && (
            <div className="p-3 bg-green-500/5 border-t border-green-500/20 space-y-3">
              <div className="space-y-3">
                <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                  <h4 className="text-xs font-semibold text-green-300 mb-1 flex items-center space-x-1">
                    <span>✍️</span>
                    <span>Personal Notes</span>
                  </h4>
                  <p className="text-xs text-green-100 leading-relaxed">
                    Carefully handwritten notes with personal insights. Great for understanding concepts through the author's perspective.
                  </p>
                </div>
                <div className="p-3 bg-teal-500/10 rounded border border-teal-500/20">
                  <h4 className="text-xs font-semibold text-teal-300 mb-1 flex items-center space-x-1">
                    <span>💡</span>
                    <span>Visual Learning</span>
                  </h4>
                  <p className="text-xs text-teal-100 leading-relaxed">
                    Handwritten notes often include diagrams and annotations that enhance understanding. Perfect for visual learners.
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
          className="flex-1 bg-gradient-to-r from-green-400 to-teal-400 text-white py-3 px-4 rounded-xl text-sm font-bold hover:from-green-500 hover:to-teal-500 transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-green-500/40 flex items-center justify-center space-x-2"
        >
          <PencilIcon className="w-4 h-4" />
          <span>View Details</span>
        </Link>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-green-500/20 border border-green-500/30 text-green-200 py-3 px-4 rounded-xl hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50 hover:scale-105"
        >
          {isDownloading ? (
            <div className="w-4 h-4 animate-spin border-2 border-green-300 border-t-transparent rounded-full"></div>
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
