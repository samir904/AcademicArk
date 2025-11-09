import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, downloadnote, addRating } from '../../REDUX/Slices/noteslice.js';
import LoginPrompt from '../../COMPONENTS/LoginPrompt.jsx';
import ReactGA from "react-ga4"

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

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function HandwrittenCard({ note }) {
  const dispatch = useDispatch();
  const { bookmarkingNotes, downloadingNotes } = useSelector(state => state.note);
  const user = useSelector(state => state.auth.data);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  
  const isBookmarking = bookmarkingNotes.includes(note._id);
  const isDownloading = downloadingNotes.includes(note._id);
  const isBookmarked = note.bookmarkedBy?.includes(user?._id);
  
  const avgRating = note.rating?.length
    ? (note.rating.reduce((sum, r) => sum + r.rating, 0) / note.rating.length).toFixed(1)
    : 0;

  // State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');

  // Handlers
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

    ReactGA.event({
      category: 'engagement',
      action: 'download_handwritten',
      label: note.title,
      value: note._id,
    });

    dispatch(downloadnote({ noteId: note._id, title: note.title }));

    setTimeout(() => {
      setShowReviewModal(true);
    }, 500);
  };

  const submitRating = () => {
    if (userRating > 0) {
      dispatch(addRating({
        noteId: note._id,
        rating: userRating,
        review: userReview
      }));
      setShowReviewModal(false);
      setUserRating(0);
      setUserReview('');
      setTimeout(() => {
        setShowShareModal(true);
      }, 300);
    }
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/notes/${note._id}`;
    const title = `Check out these Handwritten Notes: ${note.title}`;
    
    const shareLinks = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      link: url
    };
    
    if (platform === 'link') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      window.open(shareLinks[platform], '_blank');
    }
    
    setShowShareModal(false);
  };

  return (
    <>
      {/* ✨ SIMPLIFIED HANDWRITTEN CARD - Same Design as NoteCard */}
     {/* ✨ GREEN-EMERALD THEME FOR HANDWRITTEN */}
<div className="group bg-gradient-to-br from-green-950/50 to-emerald-950/50 backdrop-blur-xl border border-green-500/25 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-green-500/10 hover:scale-[1.02] transition-all duration-300 hover:border-green-400/40">
  
  {/* Background Effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-emerald-900/10 opacity-30"></div>
  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/8 to-emerald-400/8 rounded-full blur-3xl"></div>
  
  {/* Content */}
  <div className="relative p-6 space-y-4">
    
    {/* Header */}
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-400/30">
            ✏️ Handwritten
          </span>
          {note.rating?.length > 0 && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-bold rounded-full flex items-center space-x-1 border border-yellow-400/30">
              <StarIcon className="w-3 h-3" filled />
              <span>{avgRating}</span>
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-green-100 line-clamp-2 group-hover:text-green-50 transition-colors">
          {note.title}
        </h3>
        
        <div className="flex items-center space-x-2 mt-2 text-xs text-green-300/80">
          <span className="capitalize">{note.subject}</span>
          <span>•</span>
          <span>Sem {note.semester}</span>
          <span>•</span>
          <span>{note.university}</span>
        </div>
      </div>
      
      <button
        onClick={handleBookmark}
        disabled={isBookmarking}
        className="p-2 rounded-full hover:bg-green-500/20 transition-all"
      >
        <BookmarkIcon 
          className={`w-5 h-5 transition-all ${
            isBookmarked 
              ? 'text-emerald-400 scale-110' 
              : 'text-green-300 hover:text-emerald-400'
          }`}
          filled={isBookmarked}
        />
      </button>
    </div>
    
    {/* Description */}
    <p className="text-sm text-green-200/90 line-clamp-2 leading-relaxed">
      {note.description}
    </p>
    
    {/* Stats */}
    <div className="flex items-center justify-between text-xs text-green-300/80 pt-2 border-t border-green-500/20">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <DownloadIcon className="w-4 h-4" />
          <span>{note.downloads || 0} downloads</span>
        </div>
        {note.rating?.length > 0 && (
          <span>({note.rating.length} reviews)</span>
        )}
      </div>
      
      <Link 
        to={`/profile/${note.uploadedBy?._id}`}
        className="flex items-center space-x-1 hover:text-green-200 transition-colors"
      >
        {note.uploadedBy?.avatar?.secure_url?.startsWith('http') ? (
          <img 
            src={note.uploadedBy.avatar.secure_url} 
            alt={note.uploadedBy.fullName}
            className="w-4 h-4 rounded-full"
          />
        ) : (
          <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            {note.uploadedBy?.fullName?.charAt(0) || 'U'}
          </div>
        )}
        <span className="capitalize text-xs">{note.uploadedBy?.fullName || 'Unknown'}</span>
      </Link>
    </div>
    
    {/* Actions */}
    <div className="flex gap-2 pt-2">
      <Link
        to={`/notes/${note._id}`}
        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-2 px-4 rounded-lg text-sm font-bold transition-all text-center"
      >
        View Details
      </Link>
      
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="px-4 py-2 bg-green-500/20 border border-green-400/30 text-green-300 rounded-lg hover:bg-green-500/30 hover:border-green-400/50 transition-all"
      >
        {isDownloading ? (
          <div className="w-4 h-4 animate-spin border-2 border-green-400 border-t-transparent rounded-full"></div>
        ) : (
          <DownloadIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  </div>
</div>

      {/* ✨ REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl max-w-md w-full p-8 backdrop-blur-xl">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Rate These Notes</h2>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setUserRating(0);
                  setUserReview('');
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <CloseIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✏️</span>
              </div>
              <p className="text-sm text-gray-400">Help others by rating these handwritten notes</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-3">Your Rating</label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className="transition-all hover:scale-125"
                  >
                    <StarIcon 
                      className={`w-8 h-8 ${
                        star <= userRating 
                          ? 'text-green-400' 
                          : 'text-gray-600 hover:text-gray-500'
                      }`}
                      filled={star <= userRating}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-2">Your Review (Optional)</label>
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setUserRating(0);
                  setUserReview('');
                  setShowShareModal(true);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Skip
              </button>
              <button
                onClick={submitRating}
                disabled={userRating === 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg font-bold transition-all disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✨ SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl max-w-md w-full p-8 backdrop-blur-xl">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Share These Notes</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <CloseIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-6">Share with your friends! 📝✏️</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-all hover:scale-105"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </button>
              
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-all hover:scale-105"
              >
                <span>𝕏</span>
                <span>Twitter</span>
              </button>
              
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition-all hover:scale-105"
              >
                <span>f</span>
                <span>Facebook</span>
              </button>
              
              <button
                onClick={() => handleShare('link')}
                className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-all hover:scale-105"
              >
                <span>🔗</span>
                <span>Copy Link</span>
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Done
            </button>
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
    </>
  );
}
