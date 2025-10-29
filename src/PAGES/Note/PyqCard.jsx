// src/PAGES/Note/PyqCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, downloadnote } from '../../REDUX/Slices/noteslice.js';
import { useAuth } from '../../hooks/useAuth.js';
import AuthGuard from '../../COMPONENTS/AuthGuard.jsx';
import LoginPrompt from '../../COMPONENTS/LoginPrompt.jsx';
import { showToast } from '../../HELPERS/Toaster.jsx';
// PYQ-specific icons
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

export default function PyqCard({ note }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dispatch = useDispatch();
  const { bookmarkingNotes, downloadingNotes } = useSelector(state => state.note);
   const isBookmarking=bookmarkingNotes.includes(note._id);
  const isDownloading=downloadingNotes.includes(note._id);
  const user = useSelector(state => state.auth.data);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  const isBookmarked = note.bookmarkedBy?.includes(user?._id);

  // Calculate average rating
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

  // Get current year and estimate exam year
  const currentYear = new Date(note?.createdAt).getFullYear();
  const examYear = currentYear; // Assuming previous year

  return (
    <div className="group bg-gradient-to-br from-red-900/90 to-pink-900/80 backdrop-blur-xl border border-red-500/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-red-500/25 hover:scale-[1.02] transition-all duration-300 hover:border-red-400/50 relative">

      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-800/10 to-pink-800/10 opacity-50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

      {/* Header with PYQ Badge */}
      <div className="relative p-4 border-b border-red-500/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs font-bold text-white flex items-center space-x-1 shadow-lg">
              <TargetIcon className="w-3 h-3" />
              <span>PYQ </span>
            </div>
            <div className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-200">
              Exam Pattern
            </div>
          </div>
           <button
            onClick={handleBookmark}
            disabled={isBookmarking}
            className={`relative p-2 rounded-full hover:bg-blue-500/20 transition-all duration-300 group/bookmark ${
              isBookmarking ? 'animate-pulse' : ''
            }`}>
       {isBookmarking ? (
  <div className="relative w-5 h-5">
    {/* Outer ripple circle */}
    <div className="absolute inset-0 rounded-full border-2 border-yellow-300/60 animate-pulse"></div>
    
    {/* Middle ripple circle */}
    <div 
      className="absolute inset-0 rounded-full border-2 border-transparent border-t-yellow-300 border-r-yellow-300"
      style={{
        animation: 'spin 1s linear infinite'
      }}
    ></div>
    
    {/* Center icon - faded */}
    <BookmarkIcon 
      className="w-5 h-5 text-yellow-300/50 absolute inset-0"
      filled={isBookmarked}
    />
    
    {/* Animated glow */}
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(253, 224, 71, 0.7); }
        50% { box-shadow: 0 0 0 6px rgba(253, 224, 71, 0); }
      }
    `}</style>
  </div>
) : (
  <BookmarkIcon 
    className={`w-5 h-5 transition-all duration-300 ${
      isBookmarked 
        ? 'text-yellow-300 scale-110' 
        : 'text-red-200'
    } hover:text-yellow-300 hover:scale-125 group-hover/bookmark:rotate-0`}
    filled={isBookmarked}
  />
)}

            {/* <BookmarkIcon 
              className={`w-5 h-5 ${isBookmarked ? 'text-yellow-300' : 'text-blue-300'} hover:text-yellow-300 transition-colors group-hover/bookmark:scale-110`}
              filled={isBookmarked}
            /> */}
          </button>
        </div>

        <h3 className="text-lg font-bold capitalize text-white line-clamp-2 group-hover:text-red-200 transition-colors mb-2">
          {note.title}
        </h3>

        <div className="flex items-center space-x-3 text-xs text-red-200">
          <span className="bg-red-500/20 px-2 py-1 rounded border border-red-500/30">{note.subject}</span>
          <span>Sem {note.semester}</span>
          <span>•</span>
          <span>{note.university}</span>
        </div>
      </div>

      {/* Exam Information Section */}
      <div className="relative p-4 space-y-4">
        {/* Exam Details */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-red-500/10 rounded-lg border border-red-500/20">
            <ClockIcon className="w-4 h-4 text-red-300 mx-auto mb-1" />
            <div className="text-xs text-red-200 font-medium">3 Hours</div>
            <div className="text-xs text-red-400">Duration</div>
          </div>
          <div className="text-center p-2 bg-red-500/10 rounded-lg border border-red-500/20">
            <AwardIcon className="w-4 h-4 text-red-300 mx-auto mb-1" />
            <div className="text-xs text-red-200 font-medium">70 Marks</div>
            <div className="text-xs text-red-400">Total</div>
          </div>
          <div className="text-center p-2 bg-red-500/10 rounded-lg border border-red-500/20">
            <TargetIcon className="w-4 h-4 text-red-300 mx-auto mb-1" />
            <div className="text-xs text-red-200 font-medium">High</div>
            <div className="text-xs text-red-400">Priority</div>
          </div>
        </div>
        {/* Study Tips */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-xs text-red-300 font-medium">Study Recommendation</span>
          </div>
          <p className="text-xs text-red-100 leading-relaxed">
            Practice previous year questions  to identify recurring patterns and frequently asked topics. Focus on solving the questions within time limits to excel in exam scenarios.
          </p>
        </div>
        {/* Description */}
        <p className="text-sm text-red-100 line-clamp-2 leading-relaxed opacity-90">
          {note.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-red-300">
          <div className="flex items-center space-x-3">
            {note.rating?.length > 0 && (
              <div className="flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded">
                <span className="text-yellow-300">★</span>
                <span>{avgRating}</span>
                <span>({note.rating.length})</span>
              </div>
            )}
            <div className="flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded">
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
                  loading='lazy'
                  className="w-5 h-5 rounded-full border border-red-500/30"
                />
              ) : (
                <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {note.uploadedBy?.fullName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-red-200">{note.uploadedBy?.fullName || 'Unknown'}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="relative p-4 pt-0 flex items-center space-x-2">
        <Link
          to={`/notes/${note._id}`}
          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-xl text-sm font-bold hover:from-red-600 hover:to-pink-600 transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-red-500/40 flex items-center justify-center space-x-2"
        >
          <TargetIcon className="w-4 h-4" />
          <span>View Details</span>
        </Link>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-red-500/20 border border-red-500/30 text-red-200 py-3 px-4 rounded-xl hover:bg-red-500/30 transition-all duration-300 disabled:opacity-50 hover:scale-105"
        >
          {isDownloading ? (
            <div className="w-4 h-4 animate-spin border-2 border-red-300 border-t-transparent rounded-full"></div>
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
