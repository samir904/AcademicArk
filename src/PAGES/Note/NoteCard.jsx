// src/components/NoteCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, downloadnote } from '../../REDUX/Slices/noteslice.js';
import LoginPrompt from '../../COMPONENTS/LoginPrompt.jsx';
import { useState } from 'react';

// Icon components
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

const FlameIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const BookIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default function NoteCard({ note }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { bookmarking, downloading } = useSelector(state => state.note);
  const user = useSelector(state => state.auth.data);
  const isLoggedIn=useSelector((state)=>state?.auth?.isLoggedIn)
  const isBookmarked = note.bookmarkedBy?.includes(user?._id);
  const avgRating = note.rating?.length
    ? (note.rating.reduce((sum, r) => sum + r.rating, 0) / note.rating.length).toFixed(1)
    : 0;

  // Auth protection
  const handleBookmark = e => {
    e.preventDefault();
    e.stopPropagation();
    if(!isLoggedIn){
      setShowLoginModal(true)
      return;
    }
    if (!user) {
      <LoginPrompt/>
      return;
    }
    
    dispatch(toggleBookmark(note._id));
  };

  const handleDownload = e => {
    e.preventDefault();
    e.stopPropagation();
    if(!isLoggedIn){
      setShowLoginModal(true);
      return;
    }
    if (!user) {
      <LoginPrompt  />
      return;
    }
    
    dispatch(downloadnote({ noteId: note._id, title: note.title }));
  };

  // Calculate quality score for notes
  const getQualityLevel = () => {
    const downloads = note.downloads || 0;
    const ratings = note.rating?.length || 0;
    const avgRat = parseFloat(avgRating) || 0;
    
    const score = downloads * 0.3 + ratings * 0.4 + avgRat * 0.3;
    
    if (score >= 4) return { level: 'Premium', color: 'text-blue-400', stars: 5 };
    if (score >= 3) return { level: 'Quality', color: 'text-cyan-400', stars: 4 };
    if (score >= 2) return { level: 'Good', color: 'text-green-400', stars: 3 };
    return { level: 'Standard', color: 'text-gray-400', stars: 2 };
  };

  const quality = getQualityLevel();

  return (
    
    <div className="group bg-gradient-to-br from-blue-900/90 to-purple-900/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300 hover:border-blue-400/50 relative">
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/10 to-purple-800/10 opacity-50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      
      {/* Header with Notes Badge */}
      <div className="relative p-4 border-b border-blue-500/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-xs font-bold text-white flex items-center space-x-1 shadow-lg">
              <BookIcon className="w-3 h-3" />
              <span>STUDY NOTES</span>
            </div>
            <div className={`px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs ${quality.color} font-medium`}>
              {quality.level} Quality
            </div>
          </div>
          <button
            onClick={handleBookmark}
            disabled={bookmarking}
            className="p-2 rounded-full hover:bg-blue-500/20 transition-colors group/bookmark"
          >
            <BookmarkIcon 
              className={`w-5 h-5 ${isBookmarked ? 'text-yellow-300' : 'text-blue-300'} hover:text-yellow-300 transition-colors group-hover/bookmark:scale-110`}
              filled={isBookmarked}
            />
          </button>
        </div>
        
        <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-blue-200 transition-colors mb-2">
          {note.title}
        </h3>
        
        <div className="flex items-center space-x-3 text-xs text-blue-200">
          <span className="bg-blue-500/20 px-2 py-1 rounded border border-blue-500/30">{note.subject}</span>
          <span>Sem {note.semester}</span>
          <span>•</span>
          <span>{note.university}</span>
        </div>
      </div>

      {/* Quality Metrics Section */}
      <div className="relative p-4 space-y-4">
        {/* Quality Indicators */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex justify-center mb-1">
              {[...Array(quality.stars)].map((_, i) => (
                <StarIcon key={i} className="w-3 h-3 text-blue-400" filled />
              ))}
            </div>
            <div className="text-xs text-blue-200 font-medium">Quality</div>
          </div>
          <div className="text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <TrendingUpIcon className="w-4 h-4 text-blue-300 mx-auto mb-1" />
            <div className="text-xs text-blue-200 font-medium">Comprehensive</div>
            <div className="text-xs text-blue-400">Content</div>
          </div>
          <div className="text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <FlameIcon className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <div className="text-xs text-blue-200 font-medium">Popular</div>
            <div className="text-xs text-blue-400">Resource</div>
          </div>
        </div>
        
        {/* Study Tips */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-xs text-blue-300 font-medium">Study Recommendation</span>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            Comprehensive study material with detailed explanations. Perfect for understanding core concepts and exam preparation.
          </p>
        </div>
        
        {/* Description */}
        <p className="text-sm text-blue-100 line-clamp-2 leading-relaxed opacity-90">
          {note.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-blue-300">
          <div className="flex items-center space-x-3">
            {note.rating?.length > 0 && (
              <div className="flex items-center space-x-1 bg-blue-500/20 px-2 py-1 rounded">
                <StarIcon className="w-3 h-3 text-blue-400" filled />
                <span>{avgRating}</span>
                <span>({note.rating.length})</span>
              </div>
            )}
            <div className="flex items-center space-x-1 bg-blue-500/20 px-2 py-1 rounded">
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
                className="w-5 h-5 rounded-full border border-blue-500/30"
              />
            ) : (
              <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                {note.uploadedBy?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <span className="text-blue-200">{note.uploadedBy?.fullName || 'Unknown'}</span>
          </div>
          </Link>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="relative p-4 pt-0 flex items-center space-x-2">
        <Link
          to={`/notes/${note._id}`}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl text-sm font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-blue-500/40 flex items-center justify-center space-x-2"
        >
          <BookIcon className="w-4 h-4" />
          <span>View Details</span>
        </Link>
        
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-blue-500/20 border border-blue-500/30 text-blue-200 py-3 px-4 rounded-xl hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50 hover:scale-105"
        >
          {downloading ? (
            <div className="w-4 h-4 animate-spin border-2 border-blue-300 border-t-transparent rounded-full"></div>
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
