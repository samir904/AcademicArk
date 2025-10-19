// src/PAGES/Note/ImportantCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, downloadnote } from '../../REDUX/Slices/noteslice.js';
import LoginPrompt from '../../COMPONENTS/LoginPrompt.jsx';

// Important-specific icons
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

const StarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const FlameIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13.76 3.13 13.59 3.28 13.43 3.44C11.25 5.34 11.24 8.28 12.24 10.44C12.24 10.44 12.24 10.44 12.24 10.44C12.95 11.87 14.43 12.38 15.18 13.78C15.27 13.94 15.35 14.12 15.41 14.3C15.56 14.99 15.52 15.72 15.3 16.39C15.05 17.18 14.56 17.95 13.89 18.53C13.44 18.90 12.94 19.21 12.41 19.44C11.88 19.68 11.32 19.85 10.75 19.93C9.97 20.06 9.17 20.05 8.39 19.89C7.61 19.73 6.87 19.42 6.2 18.99C5.54 18.57 4.95 18.03 4.46 17.4C4.46 17.4 4.46 17.4 4.46 17.4C3.85 16.63 3.43 15.75 3.21 14.82C2.99 13.89 2.98 12.92 3.18 11.98C3.39 11.04 3.81 10.15 4.4 9.4C4.99 8.65 5.75 8.05 6.6 7.63C7.45 7.21 8.37 6.98 9.31 6.96C10.25 6.94 11.18 7.13 12.04 7.52C12.90 7.91 13.67 8.49 14.3 9.22C14.93 9.95 15.40 10.82 15.68 11.75C15.81 12.21 15.87 12.69 15.87 13.17C15.87 13.64 15.81 14.12 15.68 14.58C15.42 15.48 14.92 16.29 14.24 16.93C13.56 17.57 12.73 18.02 11.84 18.24C10.95 18.46 10.02 18.44 9.14 18.18C8.26 17.92 7.46 17.43 6.82 16.77C6.18 16.11 5.72 15.29 5.48 14.4C5.24 13.51 5.23 12.58 5.45 11.68C5.67 10.78 6.11 9.95 6.73 9.26C7.35 8.57 8.13 8.05 9.01 7.75C9.89 7.45 10.83 7.38 11.74 7.55C12.65 7.72 13.50 8.12 14.22 8.71C14.94 9.30 15.50 10.06 15.84 10.93C15.95 11.16 16.04 11.40 16.11 11.65C16.81 11.65 17.50 11.47 18.11 11.12C18.72 10.77 19.22 10.26 19.57 9.65C19.92 9.04 20.10 8.35 20.10 7.65C20.10 6.95 19.92 6.26 19.57 5.65C19.22 5.04 18.72 4.53 18.11 4.18C17.50 3.83 16.81 3.65 16.11 3.65C15.41 3.65 14.72 3.83 14.11 4.18C13.50 4.53 13.00 5.04 12.65 5.65C12.30 6.26 12.12 6.95 12.12 7.65C12.12 8.35 12.30 9.04 12.65 9.65C13.00 10.26 13.50 10.77 14.11 11.12C14.72 11.47 15.41 11.65 16.11 11.65C17.09 11.65 18.04 11.26 18.74 10.56C19.44 9.86 19.83 8.91 19.83 7.93C19.83 6.95 19.44 6.00 18.74 5.30C18.04 4.60 17.09 4.21 16.11 4.21C15.13 4.21 14.18 4.60 13.48 5.30C12.78 6.00 12.39 6.95 12.39 7.93C12.39 8.91 12.78 9.86 13.48 10.56C14.18 11.26 15.13 11.65 16.11 11.65C17.66 11.2 17.66 11.2 17.66 11.2Z" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default function ImportantCard({ note }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dispatch = useDispatch();
  const { bookmarking, downloading } = useSelector(state => state.note);
  const user = useSelector(state => state.auth.data);
  const isLoggedIn=useSelector((state)=>state?.auth?.isLoggedIn)
  const isBookmarked = note.bookmarkedBy?.includes(user?._id);
  
  // Calculate average rating
  const avgRating = note.rating?.length > 0 
    ? (note.rating.reduce((sum, r) => sum + r.rating, 0) / note.rating.length).toFixed(1)
    : 0;

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(!isLoggedIn){
      setShowLoginModal(true);
      return;
    }
    dispatch(toggleBookmark(note._id));
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(!isLoggedIn){
      setShowLoginModal(true);
      return;
    }
    dispatch(downloadnote({ noteId: note._id, title: note.title }));
  };

  // Calculate importance level based on downloads and ratings
  const getImportanceLevel = () => {
    const downloads = note.downloads || 0;
    const ratings = note.rating?.length || 0;
    const avgRat = parseFloat(avgRating) || 0;
    
    const score = downloads * 0.3 + ratings * 0.4 + avgRat * 0.3;
    
    if (score >= 4) return { level: 'Critical', color: 'text-red-400', stars: 5 };
    if (score >= 3) return { level: 'High', color: 'text-orange-400', stars: 4 };
    if (score >= 2) return { level: 'Medium', color: 'text-yellow-400', stars: 3 };
    return { level: 'Standard', color: 'text-green-400', stars: 2 };
  };

  const importance = getImportanceLevel();

  return (
    <div className="group bg-gradient-to-br from-yellow-900/90 to-orange-900/80 backdrop-blur-xl border border-yellow-500/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-yellow-500/25 hover:scale-[1.02] transition-all duration-300 hover:border-yellow-400/50 relative">
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-800/10 to-orange-800/10 opacity-50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
      
      {/* Header with Important Badge */}
      <div className="relative p-4 border-b border-yellow-500/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-black flex items-center space-x-1 shadow-lg">
              <FlameIcon className="w-3 h-3" />
              <span>MUST STUDY</span>
            </div>
            <div className={`px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs ${importance.color} font-medium`}>
              {importance.level} Priority
            </div>
          </div>
          <button
            onClick={handleBookmark}
            disabled={bookmarking}
            className="p-2 rounded-full hover:bg-yellow-500/20 transition-colors group/bookmark"
          >
            <BookmarkIcon 
              className={`w-5 h-5 ${isBookmarked ? 'text-yellow-300' : 'text-yellow-400'} hover:text-yellow-300 transition-colors group-hover/bookmark:scale-110`}
              filled={isBookmarked}
            />
          </button>
        </div>
        
        <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-yellow-200 transition-colors mb-2">
          {note.title}
        </h3>
        
        <div className="flex items-center space-x-3 text-xs text-yellow-200">
          <span className="bg-yellow-500/20 px-2 py-1 rounded border border-yellow-500/30">{note.subject}</span>
          <span>Sem {note.semester}</span>
          <span>•</span>
          <span>{note.university}</span>
        </div>
      </div>

      {/* Importance Metrics Section */}
      <div className="relative p-4 space-y-4">
        {/* Importance Indicators */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="flex justify-center mb-1">
              {[...Array(importance.stars)].map((_, i) => (
                <StarIcon key={i} className="w-3 h-3 text-yellow-400" />
              ))}
            </div>
            <div className="text-xs text-yellow-200 font-medium">Importance</div>
          </div>
          <div className="text-center p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <TrendingUpIcon className="w-4 h-4 text-yellow-300 mx-auto mb-1" />
            <div className="text-xs text-yellow-200 font-medium">High Weightage</div>
            <div className="text-xs text-yellow-400">Exam Focus</div>
          </div>
          <div className="text-center p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <FlameIcon className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <div className="text-xs text-yellow-200 font-medium">Hot Topic</div>
            <div className="text-xs text-yellow-400">Trending</div>
          </div>
        </div>
        
        {/* Study Tips */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-xs text-yellow-300 font-medium">Study Recommendation</span>
          </div>
          <p className="text-xs text-yellow-100 leading-relaxed">
            This topic frequently appears in exams. Focus on key concepts and practice numerical problems.
          </p>
        </div>
        
        {/* Description */}
        <p className="text-sm text-yellow-100 line-clamp-2 leading-relaxed opacity-90">
          {note.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-yellow-300">
          <div className="flex items-center space-x-3">
            {note.rating?.length > 0 && (
              <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded">
                <StarIcon className="w-3 h-3 text-yellow-400" />
                <span>{avgRating}</span>
                <span>({note.rating.length})</span>
              </div>
            )}
            <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded">
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
                className="w-5 h-5 rounded-full border border-yellow-500/30"
              />
            ) : (
              <div className="w-5 h-5 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-xs text-black font-bold">
                {note.uploadedBy?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <span className="text-yellow-200">{note.uploadedBy?.fullName || 'Unknown'}</span>
          </div>
          </Link>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="relative p-4 pt-0 flex items-center space-x-2">
        <Link
          to={`/notes/${note._id}`}
          className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-3 px-4 rounded-xl text-sm font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-yellow-500/40 flex items-center justify-center space-x-2"
        >
          <FlameIcon className="w-4 h-4" />
          <span>View Details</span>
        </Link>
        
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 py-3 px-4 rounded-xl hover:bg-yellow-500/30 transition-all duration-300 disabled:opacity-50 hover:scale-105"
        >
          {downloading ? (
            <div className="w-4 h-4 animate-spin border-2 border-yellow-300 border-t-transparent rounded-full"></div>
          ) : (
            <DownloadIcon className="w-4 h-4" />
          )}
        </button>
      </div>
      {/* Login Modal */}
                        {showLoginModal && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="max-w-md w-full mx-4">
                                    <LoginPrompt  />
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
