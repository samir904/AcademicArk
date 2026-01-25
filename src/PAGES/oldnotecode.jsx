import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, downloadnote, addRating, incrementViewCount } from '../../REDUX/Slices/noteslice.js';
import LoginPrompt from '../../COMPONENTS/LoginPrompt.jsx';
import ReactGA from "react-ga4"
import { setLoginModal } from '../../REDUX/Slices/authslice.js'; // ✅ Import this
import { usePDFDownload } from '../../hooks/usePDFDownload.js';
import ViewersModal from '../../COMPONENTS/Note/ViewersModal.jsx';

// Icons
const BookmarkIcon = ({ className, filled }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-down-icon lucide-circle-arrow-down"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="m8 12 4 4 4-4" /></svg>
);

const StarIcon = ({ className, filled }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ShareIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C9.589 12.938 10 12.502 10 12c0-.502-.411-.938-1.316-1.342m0 2.684a3 3 0 110-2.684m9.032-6.348a9.01 9.01 0 010 12.696m0 0a9 9 0 11-12.696-12.696" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function NoteCard({ note }) {
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

  const { downloadPDF, downloading } = usePDFDownload();
  const downloadState = downloading[note._id];
  const [showViewersModal, setShowViewersModal] = useState(false);


  // Handlers
  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      dispatch(setLoginModal({
        isOpen: true,
        context: {
          action: 'want to Bookmark this note',
          noteTitle: note.title
        }
      }));
      return;
    }
    dispatch(toggleBookmark(note._id));
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      dispatch(setLoginModal({
        isOpen: true,
        context: {
          action: 'want to Download this note',
          noteTitle: note.title
        }
      }));
      return;
    }


    ReactGA.event({
      category: 'engagement',
      action: 'download_note',
      label: note.title,
      value: note._id,
    });

    await dispatch(downloadnote({ noteId: note._id, title: note.title }));

    // Download to IndexedDB
    const success = await downloadPDF({
      id: note._id,
      url: note.fileDetails.secure_url, // Make sure your note has this field
      title: note.title,
      subject: note.subject,
      courseCode: note.course,
      semester: note.semester,
      university: note.university,
      uploadedBy: note.uploadedBy,
    });

    if (success) {
      // Show review modal after successful download
      setTimeout(() => {
        setShowReviewModal(true);
      }, 500);
    }
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
      // Show share modal
      setTimeout(() => {
        setShowShareModal(true);
      }, 300);
    }
  };
  const handleViewNote = async (noteId) => {
    if (!isLoggedIn) {
      dispatch(setLoginModal({ /* ... */ }));
      return;
    }

    try {
      // Call dedicated view increment API
      await dispatch(incrementViewCount(noteId));
    } catch (error) {
      console.error('Error:', error);
    }

    // Navigate to read page
    navigate(`/notes/${noteId}/read`);
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/notes/${note._id}`;
    const title = `Check out: ${note.title}`;

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
      {/* ✨ SIMPLIFIED NOTE CARD */}
      {/* ✨ OPTION 2: Cool Teal-Indigo Theme */}
      <div className="group bg-gradient-to-br from-indigo-950/50 to-teal-950/50 backdrop-blur-xl border border-indigo-500/25 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 hover:scale-[1.02] transition-all duration-300 hover:border-indigo-400/40">

        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-teal-900/10 opacity-30"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/8 to-teal-400/8 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative p-6 space-y-4">

          {/* Header */}
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="flex-1 min-w-0">
              {/* Category & Rating Badges */}
              <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-400/30 flex-shrink-0">
                  {note.category}
                </span>
                {note.rating?.length > 0 && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-bold rounded-full flex items-center space-x-1 border border-teal-400/30 flex-shrink-0">
                    <StarIcon className="w-3 h-3" filled />
                    <span>{avgRating}</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold capitalize text-indigo-100 line-clamp-1 group-hover:text-indigo-50 transition-colors">
                {note.title}
              </h3>

              {/* Metadata - FIXED */}
              <div className="flex items-center space-x-2 mt-2 text-xs text-indigo-300/80 min-w-0 overflow-hidden">
                <span className="truncate">{note.subject}</span>
                <span className="flex-shrink-0">•</span>
                <span className="flex-shrink-0 whitespace-nowrap">Sem {note.semester}</span>
                <span className="flex-shrink-0">•</span>
                <span className="truncate">{note.university}</span>
              </div>
            </div>
            {/* ✨ View Stats Button - NEW */}
            <button
              onClick={() => setShowViewersModal(true)}
              className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-300 rounded-full text-xs font-semibold transition-all flex items-center space-x-1 flex-shrink-0"
              title="View detailed statistics"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
              <span>Stats</span>
            </button>
            {/* Bookmark Button - FIXED */}
            <button
              onClick={handleBookmark}
              disabled={isBookmarking}
              className="p-2 rounded-full hover:bg-indigo-500/20 transition-all flex-shrink-0"
            >
              <BookmarkIcon
                className={`w-5 h-5 transition-all ${isBookmarked
                  ? 'text-teal-400 scale-110'
                  : 'text-indigo-300 hover:text-teal-400'
                  }`}
                filled={isBookmarked}
              />
            </button>
          </div>


          {/* Description */}
          <p className="text-sm text-indigo-200/90 line-clamp-1 leading-relaxed">
            {note.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-indigo-300/80 pt-2 border-t border-indigo-500/20 gap-2 min-w-0">
            <div className="flex items-center space-x-3 truncate overflow-hidden min-w-0">
              {/* Views Count */}
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>

                <span>{note.views || 0} views</span>
              </div>

              {/* Downloads Count */}
              <div className="flex items-center space-x-1">
                <DownloadIcon className="w-4 h-4" />
                <span>{note.downloads || 0} downloads</span>
              </div>

              {/* Reviews Count */}
              {note.rating?.length > 0 && (
                <span>({note.rating.length} reviews)</span>
              )}
            </div>

            <Link
              to={`/profile/${note.uploadedBy?._id}`}
              className="flex items-center space-x-1 hover:text-indigo-200 transition-colors "
            >
              {note.uploadedBy?.avatar?.secure_url?.startsWith('http') ? (
                <img
                  src={note.uploadedBy.avatar.secure_url}
                  alt={note.uploadedBy.fullName}
                  className="w-4 h-4 rounded-full"
                />
              ) : (
                <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {note.uploadedBy?.fullName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="capitalize text-xs truncate">{note.uploadedBy?.fullName || 'Unknown'}</span>
            </Link>
          </div>


          {/* Action Buttons - READ NOW AS PRIMARY + Download */}
          <div className="flex flex-col gap-3 pt-2">
            {/* READ NOW - Primary Action (Full Width) */}
            <Link
              to={`/notes/${note._id}/read`}
              className="w-full bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 active:from-indigo-700 active:to-teal-700 text-white py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-200 text-center flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
              <span>View</span>
            </Link>

            {/* Secondary Actions - Download + View Details */}
            <div className="flex gap-2">


              {/* View Details Button */}
              <Link
                to={`/notes/${note._id}`}
                className="flex-1 bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800 text-white py-2.5 px-3 rounded-full text-sm font-semibold transition-all duration-200 text-center flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
              >
                <span className="">Details</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={downloadState?.status === 'starting'}
                className={`flex-1 px-3 py-2.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl font-bold text-sm sm:text-sm flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${downloadState?.status === 'error'
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : downloadState?.status === 'complete' && !isDownloading || downloadState?.status === 'exists'
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                aria-label="Download note"
                aria-busy={downloadState?.status === 'starting'}
              >
                {downloadState?.status === 'complete' && !isDownloading ? (
                  <>
                    <CheckIcon className="w-4 h-4 text-white" />
                    <span className="">Downloaded</span>
                  </>
                ) : downloadState?.status === 'exists' ? (
                  <>
                    <CheckIcon className="w-4 h-4 text-white" />
                    <span className="">Saved</span>
                  </>
                ) : downloadState?.status === 'starting' || isDownloading ? (
                  <>
                    <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                    <span className="">Downloading...</span>
                  </>
                ) : downloadState?.status === 'error' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="">Retry</span>
                  </>
                ) : (
                  <>
                    <DownloadIcon className="w-4 h-4" />
                    <span className="">Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* ✨ IMPROVED REVIEW MODAL - Conditional & Motivational */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl max-w-md w-full p-8 backdrop-blur-xl">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Rate This Note</h2>
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

            {/* Rating Stars Section - Always Visible */}
            <div className="mb-8">
              <label className="block text-sm text-gray-300 mb-3 font-medium">
                How helpful was this note?
              </label>
              <div className="flex justify-center space-x-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className="transition-all hover:scale-125 group"
                  >
                    <StarIcon
                      className={`w-10 h-10 transition-all ${star <= userRating
                        ? 'text-yellow-400 drop-shadow-lg'
                        : 'text-gray-600 group-hover:text-yellow-300'
                        }`}
                      filled={star <= userRating}
                    />
                  </button>
                ))}
              </div>

              {/* Star Rating Description */}
              {userRating > 0 && (
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-400">
                    {userRating === 1 && "Need improvement"}
                    {userRating === 2 && "Could be better"}
                    {userRating === 3 && "Good note"}
                    {userRating === 4 && "Very helpful"}
                    {userRating === 5 && "Excellent! 🌟"}
                  </p>
                </div>
              )}
            </div>

            {/* Review Text Area - ONLY APPEARS AFTER RATING */}
            {userRating > 0 && (
              <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Motivational Message */}
                {/* <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-300 leading-relaxed">
              <span className="font-semibold">💡 Help other students!</span> Your review helps peers find the best notes quickly.
            </p>
          </div> */}

                {/* Review Input */}
                <label className="block text-sm text-gray-300 mb-2 font-medium">
                  Your Review <span className="text-gray-500">(Optional but appreciated!)</span>
                </label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="Was this clear? Any tips for improvement? Help future students..."
                  className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                  rows={3}
                />

                {/* Character Counter */}
                <div className="mt-2 text-right text-xs text-gray-500">
                  {userReview.length}/200 characters
                </div>
              </div>
            )}

            {/* Buttons */}
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
                Skip for now
              </button>

              {/* Submit Button - Enabled After Rating */}
              <button
                onClick={submitRating}
                disabled={userRating === 0}
                className={`flex-1 px-4 py-2 font-bold rounded-lg transition-all ${userRating === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
                  }`}
              >
                {userRating === 0 ? 'Rate first' : userReview ? 'Submit Review' : 'Submit Rating'}
              </button>
            </div>

            {/* Footer Tip */}
            {userRating > 0 && !userReview && (
              <p className="text-xs text-gray-500 text-center mt-3">
                💡 Tip: Adding a review takes 30 seconds but helps hundreds!
              </p>
            )}
          </div>
        </div>
      )}


      {/* ✨ SHARE MODAL - After Review */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl max-w-md w-full p-8 backdrop-blur-xl">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Share This Note</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <CloseIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Share Message */}
            <p className="text-gray-400 text-sm mb-6">
              Help your friends by sharing this awesome note! 📚
            </p>

            {/* Share Buttons */}
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

            {/* Close Button */}
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
      {/* ✅ VIEWERS MODAL */}
      <ViewersModal
        isOpen={showViewersModal}
        noteId={note._id}  // ✅ Make sure this is passed!
        viewers={note.viewedBy || []}
        totalViews={note.views || 0}
        onClose={() => setShowViewersModal(false)}
      />
    </>
  );
}


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, downloadnote, addRating } from '../../REDUX/Slices/noteslice.js';
import LoginPrompt from '../../COMPONENTS/LoginPrompt.jsx';
import ReactGA from "react-ga4"
import { setLoginModal } from '../../REDUX/Slices/authslice.js';
import { usePDFDownload } from '../../hooks/usePDFDownload.js';
import ViewersModal from '../../COMPONENTS/Note/ViewersModal.jsx';

// Icons
const BookmarkIcon = ({ className, filled }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-down-icon lucide-circle-arrow-down"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="m8 12 4 4 4-4" /></svg>
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

const TargetIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
export default function PyqCard({ note }) {
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

  const { downloadPDF, downloading } = usePDFDownload();
  const downloadState = downloading[note._id];
  const [showViewersModal, setShowViewersModal] = useState(false);

  // Handlers
  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      dispatch(setLoginModal({
        isOpen: true,
        context: {
          action: 'want to Bookmark this note',
          noteTitle: note.title
        }
      }));
      return;
    }
    dispatch(toggleBookmark(note._id));
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      dispatch(setLoginModal({
        isOpen: true,
        context: {
          action: 'want to Download this note',
          noteTitle: note.title
        }
      }));
      return;
    }
    ReactGA.event({
      category: 'engagement',
      action: 'download_pyq',
      label: note.title,
      value: note._id,
    });

    await dispatch(downloadnote({ noteId: note._id, title: note.title }));
    // Download to IndexedDB
    const success = await downloadPDF({
      id: note._id,
      url: note.fileDetails.secure_url, // Make sure your note has this field
      title: note.title,
      subject: note.subject,
      courseCode: note.course,
      semester: note.semester,
      university: note.university,
      uploadedBy: note.uploadedBy,
    });

    if (success) {
      // Show review modal after successful download
      setTimeout(() => {
        setShowReviewModal(true);
      }, 500);
    }
    // Show review modal after download
    // setTimeout(() => {
    //   setShowReviewModal(true);
    // }, 500);
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
      // Show share modal
      setTimeout(() => {
        setShowShareModal(true);
      }, 300);
    }
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/notes/${note._id}`;
    const title = `Check out this PYQ: ${note.title}`;

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
      {/* ✨ CYAN-BLUE THEME FOR PYQ */}
      <div className="group bg-gradient-to-br from-cyan-950/50 to-blue-950/50 backdrop-blur-xl border border-cyan-500/25 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 hover:scale-[1.02] transition-all duration-300 hover:border-cyan-400/40">

        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 opacity-30"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/8 to-blue-400/8 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative p-6 space-y-4">

          {/* Header - FIXED VERSION */}
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full border border-cyan-400/30 flex-shrink-0">
                  PYQ
                </span>
                {note.rating?.length > 0 && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-bold rounded-full flex items-center space-x-1 border border-yellow-400/30 flex-shrink-0">
                    <StarIcon className="w-3 h-3" filled />
                    <span>{avgRating}</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold capitalize text-cyan-100 line-clamp-1 group-hover:text-cyan-50 transition-colors">
                {note.title}
              </h3>

              {/* Metadata - FIXED */}
              <div className="flex items-center space-x-2 mt-2 text-xs text-cyan-300/80 min-w-0 overflow-hidden">
                <span className="capitalize truncate">{note.subject}</span>
                <span className="flex-shrink-0">•</span>
                <span className="flex-shrink-0 whitespace-nowrap">Sem {note.semester}</span>
                <span className="flex-shrink-0">•</span>
                <span className="truncate">{note.university}</span>
              </div>
            </div>
            {/* ✨ View Stats Button - NEW */}
            <button
              onClick={() => setShowViewersModal(true)}
              className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 rounded-full text-xs font-semibold transition-all flex items-center space-x-1 flex-shrink-0"
              title="View detailed statistics"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
              <span>Stats</span>
            </button>
            {/* Bookmark Button - FIXED */}
            <button
              onClick={handleBookmark}
              disabled={isBookmarking}
              className="p-2 rounded-full hover:bg-cyan-500/20 transition-all flex-shrink-0"
            >
              <BookmarkIcon
                className={`w-5 h-5 transition-all ${isBookmarked
                  ? 'text-blue-400 scale-110'
                  : 'text-cyan-300 hover:text-blue-400'
                  }`}
                filled={isBookmarked}
              />
            </button>
          </div>


          {/* Description */}
          <p className="text-sm text-cyan-200/90 line-clamp-1 leading-relaxed">
            {note.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-cyan-300/80 pt-2 border-t border-cyan-500/20 min-w-0">
            <div className="flex items-center space-x-3 truncate overflow-hidden min-w-0">
              {/* Views Count */}
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>

                <span>{note.views || 0} views</span>
              </div>
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
              className="flex items-center space-x-1 hover:text-cyan-200 transition-colors"
            >
              {note.uploadedBy?.avatar?.secure_url?.startsWith('http') ? (
                <img
                  src={note.uploadedBy.avatar.secure_url}
                  alt={note.uploadedBy.fullName}
                  className="w-4 h-4 rounded-full"
                />
              ) : (
                <div className="w-4 h-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {note.uploadedBy?.fullName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="capitalize text-xs truncate">{note.uploadedBy?.fullName || 'Unknown'}</span>
            </Link>
          </div>

          {/* Actions */}
          {/* <div className="flex gap-2 pt-2">
      <Link
        to={`/notes/${note._id}`}
        className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-2 px-4 rounded-lg text-sm font-bold transition-all text-center"
      >
        View Details
      </Link>
      
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-400/50 transition-all"
      >
        {isDownloading ? (
          <div className="w-4 h-4 animate-spin border-2 border-cyan-400 border-t-transparent rounded-full"></div>
        ) : (
          <DownloadIcon className="w-4 h-4" />
        )}
      </button>
    </div> */}

          <div className="flex flex-col gap-3 pt-2">
            {/* READ NOW - Primary Action (Full Width) */}
            <Link
              to={`/notes/${note._id}/read`}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:from-cyan-700 active:to-blue-700 text-white py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-200 text-center flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
              <span>View</span>
            </Link>

            {/* Secondary Actions - Download + View Details */}
            <div className="flex gap-2">


              {/* View Details Button */}
              <Link
                to={`/notes/${note._id}`}
                className="flex-1 bg-cyan-700 hover:bg-cyan-600 active:bg-cyan-800 text-white py-2.5 px-3 rounded-full text-sm font-semibold transition-all duration-200 text-center flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
              >
                <span >Details</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={downloadState?.status === 'starting'}
                className={`flex-1 px-3 py-2.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl font-bold text-sm sm:text-sm flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${downloadState?.status === 'error'
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : downloadState?.status === 'complete' && !isDownloading || downloadState?.status === 'exists'
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                aria-label="Download note"
                aria-busy={downloadState?.status === 'starting'}
              >
                {downloadState?.status === 'complete' && !isDownloading ? (
                  <>
                    <CheckIcon className="w-4 h-4 text-white" />
                    <span >Downloaded</span>
                  </>
                ) : downloadState?.status === 'exists' ? (
                  <>
                    <CheckIcon className="w-4 h-4 text-white" />
                    <span >Saved</span>
                  </>
                ) : downloadState?.status === 'starting' || isDownloading ? (
                  <>
                    <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                    <span >Downloading...</span>
                  </>
                ) : downloadState?.status === 'error' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span >Retry</span>
                  </>
                ) : (
                  <>
                    <DownloadIcon className="w-4 h-4" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ SMART REVIEW MODAL FOR PYQ - Conditional & Motivational */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl max-w-md w-full p-8 backdrop-blur-xl">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Rate This PYQ</h2>
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

            {/* PYQ Icon - Always Visible */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                <TargetIcon className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-gray-400">Help future students by rating this exam paper</p>
            </div>

            {/* Rating Stars Section - Always Visible */}
            <div className="mb-8">
              <label className="block text-sm text-gray-300 mb-4 font-medium">
                How helpful was this PYQ paper?
              </label>
              <div className="flex justify-center space-x-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className="transition-all hover:scale-125 group"
                  >
                    <StarIcon
                      className={`w-10 h-10 transition-all ${star <= userRating
                        ? 'text-yellow-400 drop-shadow-lg'
                        : 'text-gray-600 group-hover:text-yellow-300'
                        }`}
                      filled={star <= userRating}
                    />
                  </button>
                ))}
              </div>

              {/* Star Rating Description */}
              {userRating > 0 && (
                <div className="mt-4 text-center animate-in fade-in duration-300">
                  <p className="text-sm font-medium text-cyan-400">
                    {userRating === 1 && "Not very helpful 😞"}
                    {userRating === 2 && "Could be better 😐"}
                    {userRating === 3 && "Good resource 👍"}
                    {userRating === 4 && "Very helpful 😊"}
                    {userRating === 5 && "Excellent! 🌟"}
                  </p>
                </div>
              )}
            </div>

            {/* Review Text Area - ONLY APPEARS AFTER RATING */}
            {userRating > 0 && (
              <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Motivational Message */}
                {/* <div className="mb-4 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <p className="text-sm text-cyan-300 leading-relaxed">
              <span className="font-semibold">💡 Help future students!</span> Your review helps peers find quality PYQ papers and prepare better for exams.
            </p>
          </div> */}

                {/* Review Input */}
                <label className="block text-sm text-gray-300 mb-2 font-medium">
                  Your Review <span className="text-gray-500">(Optional but greatly appreciated!)</span>
                </label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="Was this paper helpful? Any tips? Topics covered? Help others prepare..."
                  className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none transition-all"
                  rows={3}
                />

                {/* Character Counter */}
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Share helpful tips or insights</span>
                  <span className="text-gray-500">{userReview.length}/250</span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setUserRating(0);
                  setUserReview('');
                  setShowShareModal(true);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Skip for now
              </button>

              {/* Submit Button - Enabled After Rating */}
              <button
                onClick={submitRating}
                disabled={userRating === 0}
                className={`flex-1 px-4 py-2.5 font-bold rounded-lg transition-all ${userRating === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                  }`}
              >
                {userRating === 0 ? 'Select rating' : userReview ? 'Submit Review' : 'Submit Rating'}
              </button>
            </div>

            {/* Footer Tips */}
            {userRating > 0 && (
              <div className="mt-4 text-center">
                {!userReview && (
                  <p className="text-xs text-gray-500">
                    💡 Tip: Adding a review (30 seconds) helps hundreds of students! 📚
                  </p>
                )}
                {userReview && (
                  <p className="text-xs text-green-400">
                    ✅ Great! Your review will help many students prepare for exams.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}


      {/* ✨ SHARE MODAL - After Review */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl max-w-md w-full p-8 backdrop-blur-xl">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Share This PYQ</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <CloseIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Share Message */}
            <p className="text-gray-400 text-sm mb-6">
              Help your classmates ace the exam! Share this paper 📝
            </p>

            {/* Share Buttons */}
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

            {/* Close Button */}
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
       {/* ✅ VIEWERS MODAL */}
      <ViewersModal
        isOpen={showViewersModal}
        noteId={note._id}  // ✅ Make sure this is passed!
        viewers={note.viewedBy || []}
        totalViews={note.views || 0}
        onClose={() => setShowViewersModal(false)}
      />
    </>
  );
}


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, downloadnote, addRating } from '../../REDUX/Slices/noteslice.js';
import LoginPrompt from '../../COMPONENTS/LoginPrompt.jsx';
import ReactGA from "react-ga4"
import { setLoginModal } from '../../REDUX/Slices/authslice.js';
import { usePDFDownload } from '../../hooks/usePDFDownload.js';
import ViewersModal from '../../COMPONENTS/Note/ViewersModal.jsx';

// Icons
const BookmarkIcon = ({ className, filled }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-down-icon lucide-circle-arrow-down"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg>
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
const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

   const [showViewersModal, setShowViewersModal] = useState(false);
  
  const { downloadPDF, downloading } = usePDFDownload();
  const downloadState = downloading[note._id];
  
  // Handlers
  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      dispatch(setLoginModal({
        isOpen: true,
        context: {
          action: 'want to Bookmark this note',
          noteTitle: note.title
        }
      }));
      return;
    }
    dispatch(toggleBookmark(note._id));
  };

  const handleDownload =async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      dispatch(setLoginModal({
        isOpen: true,
        context: {
          action: 'want to Download this note',
          noteTitle: note.title
        }
      }));
      return;
    }
    ReactGA.event({
      category: 'engagement',
      action: 'download_handwritten',
      label: note.title,
      value: note._id,
    });

   await dispatch(downloadnote({ noteId: note._id, title: note.title }));
  // Download to IndexedDB
  const success = await downloadPDF({
    id: note._id,
    url: note.fileDetails.secure_url, // Make sure your note has this field
    title: note.title,
    subject: note.subject,
    courseCode: note.course,
    semester: note.semester,
    university: note.university,
    uploadedBy: note.uploadedBy,
  });

  if (success) {
    // Show review modal after successful download
    setTimeout(() => {
      setShowReviewModal(true);
    }, 500);
  }
    // setTimeout(() => {
    //   setShowReviewModal(true);
    // }, 500);
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

          <div className="flex items-start justify-between gap-3 min-w-0">
  <div className="flex-1 min-w-0">
    <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-400/30 flex-shrink-0">
        ✏️ Handwritten
      </span>
      {note.rating?.length > 0 && (
        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-bold rounded-full flex items-center space-x-1 border border-yellow-400/30 flex-shrink-0">
          <StarIcon className="w-3 h-3" filled />
          <span>{avgRating}</span>
        </span>
      )}
    </div>

    <h3 className="text-lg font-bold capitalize text-green-100 line-clamp-1 group-hover:text-green-50 transition-colors">
      {note.title}
    </h3>

    <div className="flex items-center space-x-2 mt-2 text-xs text-green-300/80 min-w-0 overflow-hidden">
      <span className="capitalize truncate">{note.subject}</span>
      <span className="flex-shrink-0">•</span>
      <span className="flex-shrink-0 whitespace-nowrap">Sem {note.semester}</span>
      <span className="flex-shrink-0">•</span>
      <span className="truncate">{note.university}</span>
    </div>
  </div>
 {/* ✨ View Stats Button - NEW */}
            <button
              onClick={() => setShowViewersModal(true)}
              className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300 rounded-full text-xs font-semibold transition-all flex items-center space-x-1 flex-shrink-0"
              title="View detailed statistics"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
              <span>Stats</span>
            </button>
  <button
    onClick={handleBookmark}
    disabled={isBookmarking}
    className="p-2 rounded-full hover:bg-green-500/20 transition-all flex-shrink-0"
  >
    <BookmarkIcon
      className={`w-5 h-5 transition-all ${
        isBookmarked ? 'text-emerald-400 scale-110' : 'text-green-300 hover:text-emerald-400'
      }`}
      filled={isBookmarked}
    />
  </button>
</div>


          {/* Description */}
          <p className="text-sm text-green-200/90 line-clamp-1 leading-relaxed">
            {note.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-green-300/80 pt-2 border-t border-green-500/20 min-w-0">
            <div className="flex items-center space-x-3 truncate overflow-hidden min-w-0">
                   {/* Views Count */}
    <div className="flex items-center space-x-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>

      <span>{note.views || 0} views</span>
    </div>
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
              <span className="capitalize text-xs truncate ">{note.uploadedBy?.fullName || 'Unknown'}</span>
            </Link>
          </div>

          {/* Actions */}
          {/* <div className="flex gap-2 pt-2">
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
          </div> */}
          
          <div className="flex flex-col gap-3 pt-2">
                      {/* READ NOW - Primary Action (Full Width) */}
                      <Link
                        to={`/notes/${note._id}/read`}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:from-green-700 active:to-emerald-700 text-white py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-200 text-center flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                        <span>View</span>
                      </Link>
          
                      {/* Secondary Actions - Download + View Details */}
                      <div className="flex gap-2">
                       
          
                        {/* View Details Button */}
                        <Link
                          to={`/notes/${note._id}`}
                          className="flex-1 bg-green-700 hover:bg-green-600 active:bg-green-800 text-white py-2.5 px-3 rounded-full text-sm font-semibold transition-all duration-200 text-center flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                        >
                          <span >Details</span>
                          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                         {/* Download Button */}
                        <button
                          onClick={handleDownload}
                          disabled={downloadState?.status === 'starting'}
                          className={`flex-1 px-3 py-2.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl font-bold text-sm sm:text-sm flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${
                            downloadState?.status === 'error' 
                              ? 'bg-red-600 hover:bg-red-500 text-white'
                              : downloadState?.status === 'complete'&& !isDownloading  || downloadState?.status === 'exists'
                              ? 'bg-green-600 hover:bg-green-500 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                          }`}
                          aria-label="Download note"
                          aria-busy={downloadState?.status === 'starting'}
                        >
                          {downloadState?.status === 'complete'&& !isDownloading  ? (
                            <>
                              <CheckIcon className="w-4 h-4 text-white" />
                              <span >Downloaded</span>
                            </>
                          ) : downloadState?.status === 'exists' ? (
                            <>
                              <CheckIcon className="w-4 h-4 text-white" />
                              <span>Saved</span>
                            </>
                          ) : downloadState?.status === 'starting' || isDownloading ? (
                            <>
                              <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                              <span>Downloading...</span>
                            </>
                          ) : downloadState?.status === 'error' ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Retry</span>
                            </>
                          ) : (
                            <>
                              <DownloadIcon className="w-4 h-4" />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
        </div>
      </div>

   {/* ✨ SMART REVIEW MODAL FOR HANDWRITTEN NOTES - Conditional & Motivational */}
{showReviewModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl max-w-md w-full p-8 backdrop-blur-xl">
      
      {/* Header */}
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

      {/* Handwritten Notes Icon - Always Visible */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
          <span className="text-3xl">✏️</span>
        </div>
        <p className="text-sm text-gray-400">Help classmates by rating these handwritten notes</p>
      </div>

      {/* Rating Stars Section - Always Visible */}
      <div className="mb-8">
        <label className="block text-sm text-gray-300 mb-4 font-medium">
          How helpful are these notes?
        </label>
        <div className="flex justify-center space-x-3">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setUserRating(star)}
              className="transition-all hover:scale-125 group"
            >
              <StarIcon 
                className={`w-10 h-10 transition-all ${
                  star <= userRating 
                    ? 'text-green-400 drop-shadow-lg' 
                    : 'text-gray-600 group-hover:text-green-300'
                }`}
                filled={star <= userRating}
              />
            </button>
          ))}
        </div>
        
        {/* Star Rating Description */}
        {userRating > 0 && (
          <div className="mt-4 text-center animate-in fade-in duration-300">
            <p className="text-sm font-medium text-green-400">
              {userRating === 1 && "Not very clear 😞"}
              {userRating === 2 && "Could be better 😐"}
              {userRating === 3 && "Good notes 👍"}
              {userRating === 4 && "Very helpful 😊"}
              {userRating === 5 && "Excellent! 🌟"}
            </p>
          </div>
        )}
      </div>

      {/* Review Text Area - ONLY APPEARS AFTER RATING */}
      {userRating > 0 && (
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Motivational Message */}
          {/* <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-300 leading-relaxed">
              <span className="font-semibold">💡 Help your classmates!</span> Your review helps students find clear, organized handwritten notes and study better.
            </p>
          </div> */}

          {/* Review Input */}
          <label className="block text-sm text-gray-300 mb-2 font-medium">
            Your Review <span className="text-gray-500">(Optional but greatly appreciated!)</span>
          </label>
          <textarea
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            placeholder="Are the notes clear? Well-organized? Any topics covered? Help others study..."
            className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all"
            rows={3}
          />
          
          {/* Character Counter */}
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-gray-500">Share what makes these notes useful</span>
            <span className="text-gray-500">{userReview.length}/250</span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={() => {
            setShowReviewModal(false);
            setUserRating(0);
            setUserReview('');
            setShowShareModal(true);
          }}
          className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
        >
          Skip for now
        </button>
        
        {/* Submit Button - Enabled After Rating */}
        <button
          onClick={submitRating}
          disabled={userRating === 0}
          className={`flex-1 px-4 py-2.5 font-bold rounded-lg transition-all ${
            userRating === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white hover:shadow-lg hover:shadow-green-500/50'
          }`}
        >
          {userRating === 0 ? 'Select rating' : userReview ? 'Submit Review' : 'Submit Rating'}
        </button>
      </div>

      {/* Footer Tips */}
      {userRating > 0 && (
        <div className="mt-4 text-center">
          {!userReview && (
            <p className="text-xs text-gray-500">
              💡 Tip: Adding a review (30 seconds) helps classmates choose the right notes! 📚
            </p>
          )}
          {userReview && (
            <p className="text-xs text-green-400">
              ✅ Great! Your review will help classmates study better.
            </p>
          )}
        </div>
      )}
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
       {/* ✅ VIEWERS MODAL */}
      <ViewersModal
        isOpen={showViewersModal}
        noteId={note._id}  // ✅ Make sure this is passed!
        viewers={note.viewedBy || []}
        totalViews={note.views || 0}
        onClose={() => setShowViewersModal(false)}
      />
    </>
  );
}


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, downloadnote, addRating } from '../../REDUX/Slices/noteslice.js';
import LoginPrompt from '../../COMPONENTS/LoginPrompt.jsx';
import ReactGA from "react-ga4"
import { setLoginModal } from '../../REDUX/Slices/authslice.js';
import { usePDFDownload } from '../../hooks/usePDFDownload.js';
import ViewersModal from '../../COMPONENTS/Note/ViewersModal.jsx';

// Icons
const BookmarkIcon = ({ className, filled }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

// const DownloadIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
//   </svg>
// );
const DownloadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-down-icon lucide-circle-arrow-down"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg>
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

const FlameIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13.76 3.13 13.59 3.28 13.43 3.44C11.25 5.34 11.24 8.28 12.24 10.44C12.95 11.87 14.43 12.38 15.18 13.78C15.27 13.94 15.35 14.12 15.41 14.3C15.56 14.99 15.52 15.72 15.3 16.39C15.05 17.18 14.56 17.95 13.89 18.53C13.44 18.90 12.94 19.21 12.41 19.44C11.88 19.68 11.32 19.85 10.75 19.93C9.97 20.06 9.17 20.05 8.39 19.89C7.61 19.73 6.87 19.42 6.2 18.99C5.54 18.57 4.95 18.03 4.46 17.4C3.85 16.63 3.43 15.75 3.21 14.82C2.99 13.89 2.98 12.92 3.18 11.98C3.39 11.04 3.81 10.15 4.4 9.4C4.99 8.65 5.75 8.05 6.6 7.63C7.45 7.21 8.37 6.98 9.31 6.96C10.25 6.94 11.18 7.13 12.04 7.52C12.90 7.91 13.67 8.49 14.3 9.22C14.93 9.95 15.40 10.82 15.68 11.75C15.81 12.21 15.87 12.69 15.87 13.17C15.87 13.64 15.81 14.12 15.68 14.58C15.42 15.48 14.92 16.29 14.24 16.93Z" />
  </svg>
);
const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
export default function ImportantCard({ note }) {
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

  
  const { downloadPDF, downloading } = usePDFDownload();
  const downloadState = downloading[note._id];
   const [showViewersModal, setShowViewersModal] = useState(false);
  // Handlers
  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
             dispatch(setLoginModal({
               isOpen: true,
               context: {
                 action: 'want to Bookmark this note',
                 noteTitle: note.title
               }
             }));
             return;
           }
    dispatch(toggleBookmark(note._id));
  };

  const handleDownload =async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
          dispatch(setLoginModal({
            isOpen: true,
            context: {
              action: 'want to Download this note',
              noteTitle: note.title
            }
          }));
          return;
        }

    ReactGA.event({
      category: 'engagement',
      action: 'download_important',
      label: note.title,
      value: note._id,
    });

    await dispatch(downloadnote({ noteId: note._id, title: note.title }));
  // Download to IndexedDB
  const success = await downloadPDF({
    id: note._id,
    url: note.fileDetails.secure_url, // Make sure your note has this field
    title: note.title,
    subject: note.subject,
    courseCode: note.course,
    semester: note.semester,
    university: note.university,
    uploadedBy: note.uploadedBy,
  });

  if (success) {
    // Show review modal after successful download
    setTimeout(() => {
      setShowReviewModal(true);
    }, 500);
  }
    // setTimeout(() => {
    //   setShowReviewModal(true);
    // }, 500);
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
    const title = `Check out this Important Question: ${note.title}`;
    
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
      {/* ✨ SIMPLIFIED IMPORTANT CARD - Same Design as NoteCard */}
     {/* ✨ ORANGE-AMBER THEME FOR IMPORTANT */}
<div className="group bg-gradient-to-br from-orange-950/50 to-amber-950/50 backdrop-blur-xl border border-orange-500/25 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 hover:scale-[1.02] transition-all duration-300 hover:border-orange-400/40">
  
  {/* Background Effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 to-amber-900/10 opacity-30"></div>
  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/8 to-amber-400/8 rounded-full blur-3xl"></div>
  
  {/* Content */}
  <div className="relative p-6 space-y-4">
    
   <div className="flex items-start justify-between gap-3 min-w-0">
  <div className="flex-1 min-w-0">
    <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
      <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs font-bold rounded-full border border-orange-400/30 flex-shrink-0">
        ⭐ Important
      </span>
      {note.rating?.length > 0 && (
        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-bold rounded-full flex items-center space-x-1 border border-yellow-400/30 flex-shrink-0">
          <StarIcon className="w-3 h-3" filled />
          <span>{avgRating}</span>
        </span>
      )}
    </div>

    <h3 className="text-lg font-bold capitalize text-orange-100 line-clamp-1 group-hover:text-orange-50 transition-colors">
      {note.title}
    </h3>

    <div className="flex items-center space-x-2 mt-2 text-xs text-orange-300/80 min-w-0 overflow-hidden">
      <span className="capitalize truncate">{note.subject}</span>
      <span className="flex-shrink-0">•</span>
      <span className="flex-shrink-0 whitespace-nowrap">Sem {note.semester}</span>
      <span className="flex-shrink-0">•</span>
      <span className="truncate">{note.university}</span>
    </div>
  </div>
{/* ✨ View Stats Button - NEW */}
            <button
              onClick={() => setShowViewersModal(true)}
              className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 text-orange-300 rounded-full text-xs font-semibold transition-all flex items-center space-x-1 flex-shrink-0"
              title="View detailed statistics"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
              <span>Stats</span>
            </button>
  <button
    onClick={handleBookmark}
    disabled={isBookmarking}
    className="p-2 rounded-full hover:bg-orange-500/20 transition-all flex-shrink-0"
  >
    <BookmarkIcon
      className={`w-5 h-5 transition-all ${
        isBookmarked ? 'text-amber-400 scale-110' : 'text-orange-300 hover:text-amber-400'
      }`}
      filled={isBookmarked}
    />
  </button>
</div>

    
    {/* Description */}
    <p className="text-sm text-orange-200/90 line-clamp-1 leading-relaxed">
      {note.description}
    </p>
    
    {/* Stats */}
    <div className="flex items-center justify-between text-xs text-orange-300/80 pt-2 border-t border-orange-500/20 min-w-0">
      <div className="flex items-center space-x-3 truncate overflow-hidden min-w-0">
         {/* Views Count */}
    <div className="flex items-center space-x-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>

      <span>{note.views || 0} views</span>
    </div>
        <div className="flex items-center space-x-1">
          <DownloadIcon className="w-2 h-" />
          <span>{note.downloads || 0} downloads</span>
        </div>
        {note.rating?.length > 0 && (
          <span>({note.rating.length} reviews)</span>
        )}
      </div>
      
      <Link 
        to={`/profile/${note.uploadedBy?._id}`}
        className="flex items-center space-x-1 hover:text-orange-200 transition-colors"
      >
        {note.uploadedBy?.avatar?.secure_url?.startsWith('http') ? (
          <img 
            src={note.uploadedBy.avatar.secure_url} 
            alt={note.uploadedBy.fullName}
            className="w-4 h-4 rounded-full"
          />
        ) : (
          <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            {note.uploadedBy?.fullName?.charAt(0) || 'U'}
          </div>
        )}
        <span className="capitalize text-xs truncate">{note.uploadedBy?.fullName || 'Unknown'}</span>
      </Link>
    </div>
    
    {/* Actions */}
    {/* <div className="flex gap-2 pt-2">
      <Link
        to={`/notes/${note._id}`}
        className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white py-2 px-4 rounded-lg text-sm font-bold transition-all text-center"
      >
        View Details
      </Link>
      
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="px-4 py-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 rounded-lg hover:bg-orange-500/30 hover:border-orange-400/50 transition-all"
      >
        {isDownloading ? (
          <div className="w-4 h-4 animate-spin border-2 border-orange-400 border-t-transparent rounded-full"></div>
        ) : (
          <DownloadIcon className="w-4 h-4" />
        )}
      </button>
    </div> */}
  


 <div className="flex flex-col gap-3 pt-2">
             {/* READ NOW - Primary Action (Full Width) */}
             <Link
               to={`/notes/${note._id}/read`}
               className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:from-orange-700 active:to-amber-700 text-white py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-200 text-center flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
               <span>View</span>
             </Link>
 
             {/* Secondary Actions - Download + View Details */}
             <div className="flex gap-2">
              
 
               {/* View Details Button */}
               <Link
                 to={`/notes/${note._id}`}
                 className="flex-1 bg-orange-700 hover:bg-orange-600 active:bg-orange-800 text-white py-2.5 px-3 rounded-full text-sm font-semibold transition-all duration-200 text-center flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
               >
                 <span>Details</span>
                 <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
               </Link>
                {/* Download Button */}
               <button
                 onClick={handleDownload}
                 disabled={downloadState?.status === 'starting'}
                 className={`flex-1 px-3 py-2.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl font-bold text-sm sm:text-sm flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${
                   downloadState?.status === 'error' 
                     ? 'bg-red-600 hover:bg-red-500 text-white'
                     : downloadState?.status === 'complete'&& !isDownloading || downloadState?.status === 'exists'
                     ? 'bg-green-600 hover:bg-green-500 text-white'
                     : 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                 }`}
                 aria-label="Download note"
                 aria-busy={downloadState?.status === 'starting'}
               >
                 {downloadState?.status === 'complete'&& !isDownloading ? (
                   <>
                     <CheckIcon className="w-4 h-4 text-white" />
                     <span className="hidden sm:inline">Downloaded</span>
                   </>
                 ) : downloadState?.status === 'exists' ? (
                   <>
                     <CheckIcon className="w-4 h-4 text-white" />
                     <span className="hidden sm:inline">Saved</span>
                   </>
                 ) : downloadState?.status === 'starting' || isDownloading ? (
                   <>
                     <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                     <span>Downloading...</span>
                   </>
                 ) : downloadState?.status === 'error' ? (
                   <>
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <span>Retry</span>
                   </>
                 ) : (
                   <>
                     <DownloadIcon className="w-4 h-4" />
                     <span>Download</span>
                   </>
                 )}
               </button>
             </div>
           </div>
        

  </div>
</div>


      {/* ✨ SMART REVIEW MODAL FOR IMPORTANT QUESTIONS - Conditional & Motivational */}
{showReviewModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl max-w-md w-full p-8 backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Rate This Question</h2>
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

      {/* Flame Icon - Always Visible */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
          <FlameIcon className="w-8 h-8 text-white" />
        </div>
        <p className="text-sm text-gray-400">Help students by rating this important question</p>
      </div>

      {/* Rating Stars Section - Always Visible */}
      <div className="mb-8">
        <label className="block text-sm text-gray-300 mb-4 font-medium">
          How important is this question?
        </label>
        <div className="flex justify-center space-x-3">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setUserRating(star)}
              className="transition-all hover:scale-125 group"
            >
              <StarIcon 
                className={`w-10 h-10 transition-all ${
                  star <= userRating 
                    ? 'text-yellow-400 drop-shadow-lg' 
                    : 'text-gray-600 group-hover:text-yellow-300'
                }`}
                filled={star <= userRating}
              />
            </button>
          ))}
        </div>
        
        {/* Star Rating Description */}
        {userRating > 0 && (
          <div className="mt-4 text-center animate-in fade-in duration-300">
            <p className="text-sm font-medium text-yellow-400">
              {userRating === 1 && "Not very important 😐"}
              {userRating === 2 && "Somewhat important 👍"}
              {userRating === 3 && "Important ⭐"}
              {userRating === 4 && "Very important 🔥"}
              {userRating === 5 && "Highly important! 🚀"}
            </p>
          </div>
        )}
      </div>

      {/* Review Text Area - ONLY APPEARS AFTER RATING */}
      {userRating > 0 && (
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Motivational Message */}
          {/* <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-300 leading-relaxed">
              <span className="font-semibold">💡 Help your peers!</span> Your review helps students identify frequently asked questions and prioritize important topics for exams and interviews.
            </p>
          </div> */}

          {/* Review Input */}
          <label className="block text-sm text-gray-300 mb-2 font-medium">
            Your Review <span className="text-gray-500">(Optional but valuable!)</span>
          </label>
          <textarea
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            placeholder="Why is this question important? What topics does it cover? Frequently asked in interviews/exams?..."
            className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none transition-all"
            rows={3}
          />
          
          {/* Character Counter */}
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-gray-500">Share why this question matters</span>
            <span className="text-gray-500">{userReview.length}/250</span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={() => {
            setShowReviewModal(false);
            setUserRating(0);
            setUserReview('');
            setShowShareModal(true);
          }}
          className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
        >
          Skip for now
        </button>
        
        {/* Submit Button - Enabled After Rating */}
        <button
          onClick={submitRating}
          disabled={userRating === 0}
          className={`flex-1 px-4 py-2.5 font-bold rounded-lg transition-all ${
            userRating === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white hover:shadow-lg hover:shadow-yellow-500/50'
          }`}
        >
          {userRating === 0 ? 'Select rating' : userReview ? 'Submit Review' : 'Submit Rating'}
        </button>
      </div>

      {/* Footer Tips */}
      {userRating > 0 && (
        <div className="mt-4 text-center">
          {!userReview && (
            <p className="text-xs text-gray-500">
              💡 Tip: Adding a review (30 seconds) helps peers ace their exams & interviews! 🎯
            </p>
          )}
          {userReview && (
            <p className="text-xs text-yellow-400">
              ✅ Great! Your insights will help many students prepare better.
            </p>
          )}
        </div>
      )}
    </div>
  </div>
)}


      {/* ✨ SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl max-w-md w-full p-8 backdrop-blur-xl">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Share This Question</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <CloseIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-6">Help your classmates prepare! 📝</p>

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
       {/* ✅ VIEWERS MODAL */}
            <ViewersModal
              isOpen={showViewersModal}
              noteId={note._id}  // ✅ Make sure this is passed!
              viewers={note.viewedBy || []}
              totalViews={note.views || 0}
              onClose={() => setShowViewersModal(false)}
            />
    </>
  );
}

// src/pages/Note.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotes, setFilters, clearFilters } from '../../REDUX/Slices/noteslice';
import aktulogo from "../../../public/download.jpeg";
import HomeLayout from '../../LAYOUTS/Homelayout';
import CardRenderer from './CardRenderer';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AdBanner from '../../COMPONENTS/AdBanner';
import RequestModal from '../../COMPONENTS/RequestModal';
import { getAllRequests, upvoteRequest } from '../../REDUX/Slices/requestSlice';
import { getAllVideoLectures } from '../../REDUX/Slices/videoLecture.slice'; // ✨ NEW
import { selectVideoLectureData } from '../../REDUX/Slices/videoLecture.slice';
import { shallowEqual } from 'react-redux';
import TrackedNoteCard from '../../COMPONENTS/Session/TrackedNoteCardWrapper';
import { fetchPreferences, openPreferenceDrawer } from '../../REDUX/Slices/plannerSlice';
import StudyPreferenceDrawer from '../../COMPONENTS/Planner/StudyPreferenceDrawer';
import { markPlannerReminderAsShown, shouldShowPlannerReminder } from '../../UTILS/shouldShowPlannerReminder';

// Icon components
const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>
);

const BookIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function Note() {

  const [showRequestModal, setShowRequestModal] = useState(false);


  const dispatch = useDispatch();
  const { notes, loading, totalNotes, filters } = useSelector(state => state.note);
  // ✨ UPDATED: Get notes AND videos from Redux
  // In your component:
  const { allVideos: videos, loading: videoLoading } = useSelector(selectVideoLectureData);

  const [localFilters, setLocalFilters] = useState({
    semester: filters.semester || '',
    subject: filters.subject || '',
    category: filters.category || '',
    uploadedBy: filters.uploadedBy || '', // NEW
    videoChapter: '', // ✨ NEW: For filtering videos by chapter
    university: filters.university || 'AKTU',
    course: filters.course || 'BTECH'
  });

  // Get unique uploaders from notes
  const getUniqueUploaders = () => {
    const uploaders = new Map();
    notes?.forEach(note => {
      if (note.uploadedBy?._id) {
        uploaders.set(note.uploadedBy._id, {
          id: note.uploadedBy._id,
          name: note.uploadedBy.fullName || 'Unknown',
          avatar: note.uploadedBy.avatar
        });
      }
    });
    // ✨ NEW: From videos
    videos?.forEach(video => {
      if (video.uploadedBy?._id) {
        uploaders.set(video.uploadedBy._id, {
          id: video.uploadedBy._id,
          name: video.uploadedBy.fullName || 'Unknown',
          avatar: video.uploadedBy.avatar
        });
      }
    });
    return Array.from(uploaders.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const uniqueUploaders = getUniqueUploaders();

  const [searchTerm, setSearchTerm] = useState('');
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);

  // Subject mapping by semester
  const subjectsBySemester = {
    1: [
      'engineering mathematics-i', 'engineering physics', 'programming for problem solving',
      'Electrical Engineering', 'environment and ecology', "FUNDAMENTALS OF ELECTRONICS ENGINEERING", "soft skills",
      "fundamentals of mechanical engineering", "engineering chemistry", "fundamentals of electrical engineering"
    ],
    2: [
      'Mathematics-II', , 'engineering physics', 'programming for problem solving',
      'Electrical Engineering', 'environment and ecology', "FUNDAMENTALS OF ELECTRONICS ENGINEERING", "soft skills",
      "fundamentals of mechanical engineering", "engineering chemistry", "fundamentals of electrical engineering"
    ],
    3: [
      'data structure', 'digital electronics',
      'computer organization and architecture', 'python programming',
      "discrete structures & theory of logic", "mathematics-iv", "technical communication"
    ],
    4: [
      'data structure', 'digital electronics',
      'computer organization and architecture', 'python programming', 'discrete structures & theory of logic',
      "technical communication",
      "discrete structures & theory of logic", "mathematics-iv", "technical communication"
    ],
    5: [
      'Web Technology', 'cloud computing',
      'design and analysis of algorithm',
      "object oriented system design with c++", "machine learning techniques",
      "database management system", "artificial intelligence", "introduction to data analytics and visualization", "Constitution of India"
    ],
    6: [
      'Machine Learning', 'Artificial Intelligence', 'Mobile Computing',
      'Network Security', 'Advanced Database', 'Human Computer Interaction'
    ],
    7: [
      // 'Advanced Machine Learning', 'Distributed Systems','Data Mining', 'Blockchain Technology',
      "internet of things",
      'project management', "cryptography & network security",
      "deep learning"
    ],
    8: [
      'Advanced AI', 'IoT Systems', 'Big Data Analytics',
      'Cyber Security', 'Industry Training', 'Major Project'
    ]
  };

  // Get all unique subjects for "All Subjects" option
  const allSubjects = Object.values(subjectsBySemester).flat().sort();

  // Fetch notes when filters change
  useEffect(() => {
    if (localFilters.semester) {
      const filterParams = Object.fromEntries(
        Object.entries(localFilters).filter(([_, value]) => value)
      );
      dispatch(setFilters(filterParams));
      dispatch(getAllNotes(filterParams));
      // ✨ NEW: Fetch videos for this semester
      dispatch(getAllVideoLectures({ semester: localFilters.semester }));

    }
  }, [localFilters, dispatch]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    const resetFilters = {
      semester: '',
      subject: '',
      category: '',
      uploadedBy: '', // NEW
      videoChapter: '', // ✨ NEW: Reset chapter filter too
      university: 'AKTU',
      course: 'BTECH'
    };
    setLocalFilters(resetFilters);
    setSearchTerm('');
    setIsStatsCollapsed(false);
    dispatch(clearFilters());
  };

  // Filter notes by search term AND uploadedBy
  const filteredNotes = notes?.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUploader = !localFilters.uploadedBy ||
      note.uploadedBy?._id === localFilters.uploadedBy;

    return matchesSearch && matchesUploader;
  }) || [];
  // ✨ NEW: Filter videos
  const filteredVideos = videos?.filter(video => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChapter = !localFilters.videoChapter ||
      video.chapterNumber === parseInt(localFilters.videoChapter);

    const matchesUploader = !localFilters.uploadedBy ||
      video.uploadedBy?._id === localFilters.uploadedBy;

    return matchesSearch && matchesChapter && matchesUploader;
  }) || [];
  const getCategoryStats = () => {
    const stats = {};
    notes?.forEach(note => {
      stats[note.category] = (stats[note.category] || 0) + 1;
    });
    // ✨ NEW: Add video count
    if (videos && videos.length > 0) {
      stats['Video'] = videos.length;
    }
    return stats;
  };

  const categoryStats = getCategoryStats();
  // Get unique chapters from filtered videos
  const getUniqueChapters = () => {
    const chapters = new Set();
    videos?.forEach(video => {
      if (video.chapterNumber) {
        chapters.add(video.chapterNumber);
      }
    });
    return Array.from(chapters).sort((a, b) => a - b);
  };

  const uniqueChapters = getUniqueChapters();


  // // Handle category selection with collapse/expand behavior
  // const handleCategoryClick = (category) => {
  //   if (localFilters.category === category) {
  //     // If clicking the same category, toggle collapse
  //     setIsStatsCollapsed(!isStatsCollapsed);
  //   } else {
  //     // If clicking a different category, select it and expand
  //     handleFilterChange('category', category);
  //     setIsStatsCollapsed(false);
  //   }
  // };

  // Handle clear category filter
  const handleClearCategory = () => {
    handleFilterChange('category', '');
    setIsStatsCollapsed(false);
  };

  // ✨ FIXED: Updated getCategoryConfig with Handwritten Notes
  const getCategoryConfig = (category) => {
    const configs = {
      'Notes': {
        icon: '📚',
        gradient: 'from-blue-600 to-blue-500',
        hoverGradient: 'hover:from-blue-500 hover:to-blue-400',
        borderColor: 'border-blue-500/30',
        bgGradient: 'from-blue-900/90 to-purple-900/80',
        textColor: 'text-blue-400'
      },
      'Important Question': {
        icon: '⭐',
        gradient: 'from-yellow-600 to-orange-500',
        hoverGradient: 'hover:from-yellow-500 hover:to-orange-400',
        borderColor: 'border-yellow-500/30',
        bgGradient: 'from-yellow-900/90 to-orange-900/80',
        textColor: 'text-yellow-400'
      },
      'PYQ': {
        icon: '📄',
        gradient: 'from-clan-00 to-blue-500',
        hoverGradient: 'hover:from-clan-500 hover:to-blue-400',
        borderColor: 'border-red-500/30',
        bgGradient: 'from-clan-900/90 to-blue-900/80',
        textColor: 'text-red-400'
      },
      'Handwritten Notes': {
        icon: '✏️',
        gradient: 'from-green-600 to-teal-500',
        hoverGradient: 'hover:from-green-500 hover:to-teal-400',
        borderColor: 'border-green-500/30',
        bgGradient: 'from-green-900/90 to-teal-900/80',
        textColor: 'text-green-400'
      },
      'Video': { // ✨ NEW: Video category
        icon: '🎬',
        gradient: 'from-red-600 to-pink-500',
        hoverGradient: 'hover:from-red-500 hover:to-pink-400',
        borderColor: 'border-red-500/30',
        bgGradient: 'from-red-900/90 to-pink-900/80',
        textColor: 'text-red-400'
      }
    };
    return configs[category] || configs['Notes'];
  };
  const { allRequests: popularRequests, loading: requestsLoading } = useSelector((state) => state.request);
  // const [localFilters, setLocalFilters] = useState({ semester: 3 });

  // Fetch popular requests for current semester
  useEffect(() => {
    if (localFilters.semester) {
      dispatch(getAllRequests({
        semester: localFilters.semester,
        sortBy: 'upvotes',  // Show most upvoted
        page: 1,
        requestType: ''
      }));
    }
  }, [localFilters.semester, dispatch]);
  // ✅ FIXED: displayResources with COMPLETE debugging
  const displayResources = useMemo(() => {
    const category = localFilters.category?.trim();
    const categoryLower = category?.toLowerCase();

    console.log('🎯 displayResources check:', {
      category,
      categoryLower,
      isVideoCategory: categoryLower === 'video',
      filteredVideos: filteredVideos?.length,
      filteredNotes: filteredNotes?.length,
      allVideos: videos?.length
    });

    // ✨ If Video category selected → show FILTERED videos
    if (categoryLower === 'video') {
      console.log('✅ Returning videos:', filteredVideos);
      return filteredVideos || [];
    }

    // ✨ If no category selected → show all notes
    if (!category) {
      console.log('✅ No category, returning all notes');
      return filteredNotes || [];
    }

    // ✨ If specific category selected → exact match
    const result = filteredNotes.filter(note =>
      note.category?.toLowerCase() === categoryLower
    );
    console.log('✅ Filtering by category:', category, 'found:', result.length);
    return result;
  }, [filteredNotes, filteredVideos, localFilters.category, localFilters]);

  // ✅ FIXED: Better category handler
  // const handleCategoryClick = (category) => {
  //   console.log('🎬 Category clicked:', category);

  //   if (localFilters.category?.toLowerCase() === category.toLowerCase()) {
  //     // If clicking the same category, toggle collapse
  //     setIsStatsCollapsed(!isStatsCollapsed);
  //   } else {
  //     // If clicking a different category, select it and expand
  //     handleFilterChange('category', category);
  //     setIsStatsCollapsed(false);
  //   }
  // };

  // ✅ Ensure videos are being fetched when component mounts and category changes
  useEffect(() => {
    console.log('📡 Fetching videos for semester:', localFilters.semester);
    if (localFilters.semester) {
      dispatch(getAllVideoLectures({
        semester: localFilters.semester
      }));
    }
  }, [localFilters.semester, dispatch]);
  const handleCategoryClick = (category) => {
    console.log('=== CATEGORY CLICK DEBUG ===');
    console.log('Clicked category:', category);
    console.log('Current category:', localFilters.category);
    console.log('Videos in Redux:', videos?.length);
    console.log('Filtered videos:', filteredVideos?.length);

    if (localFilters.category?.toLowerCase() === category.toLowerCase()) {
      setIsStatsCollapsed(!isStatsCollapsed);
    } else {
      handleFilterChange('category', category);
      setIsStatsCollapsed(false);
    }

    // After state updates
    setTimeout(() => {
      console.log('After filter change:');
      console.log('New localFilters:', localFilters);
    }, 0);
  };
  const getChapterStats = () => {
    if (localFilters.category !== 'Video') return {};

    const videoMaterials = materials.filter(material =>
      material.category === 'Video' &&
      material.semester === localFilters.semester &&
      (!localFilters.subject || material.subject === localFilters.subject)
    );

    const stats = {};
    videoMaterials.forEach(video => {
      const chapter = video.chapter || 'Unknown';
      stats[chapter] = (stats[chapter] || 0) + 1;
    });

    return stats;
  };

  const getChapterConfig = (chapter) => {
    const colors = [
      { gradient: 'from-blue-600 to-blue-700', textColor: 'text-blue-300', icon: '📖' },
      { gradient: 'from-purple-600 to-purple-700', textColor: 'text-purple-300', icon: '📚' },
      { gradient: 'from-pink-600 to-pink-700', textColor: 'text-pink-300', icon: '💡' },
      { gradient: 'from-green-600 to-green-700', textColor: 'text-green-300', icon: '🎯' },
      { gradient: 'from-orange-600 to-orange-700', textColor: 'text-orange-300', icon: '⚡' },
      { gradient: 'from-cyan-600 to-cyan-700', textColor: 'text-cyan-300', icon: '🔥' },
      { gradient: 'from-indigo-600 to-indigo-700', textColor: 'text-indigo-300', icon: '✨' },
      { gradient: 'from-rose-600 to-rose-700', textColor: 'text-rose-300', icon: '🌟' },
    ];

    const index = (parseInt(chapter) - 1) % colors.length;
    return colors[index];
  };
  const navigate = useNavigate();
  const isPreferencesSet = useSelector((state) => state.planner.isPreferencesSet);
  const ctaText = localFilters.subject
    ? `Study ${localFilters.subject} properly →`
    : isPreferencesSet
      ? "Continue my study plan →"
      : "Study in order →";

  const [showPlannerReminder, setShowPlannerReminder] = useState(false);

  useEffect(() => {
    if (!localFilters.semester) return;

    const shouldShow = shouldShowPlannerReminder();

    if (shouldShow) {
      setShowPlannerReminder(true);
      // ⚠️ DO NOT call markPlannerReminderAsShown() here!
      // Wait for user interaction
    }
  }, [localFilters.semester]);
  // State

  // ✅ FIXED: Close handler - mark as shown when dismissed
  const handleClosePlannerReminder = () => {
    setShowPlannerReminder(false);
    markPlannerReminderAsShown();  // ← Mark AFTER closing
  };

  // ✅ NEW: Separate handler for opening planner
  const handleOpenPlanner = () => {
    markPlannerReminderAsShown();  // ← Mark BEFORE navigating

    if (isPreferencesSet) {
      navigate("/planner");
    } else {
      dispatch(openPreferenceDrawer());
    }
  };


  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);
  return (
    <HomeLayout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section - Enhanced for AKTU */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10"></div>

          <div className="relative max-w-5xl mx-auto px-6 py-8 text-center">
            {/* Logo & Badge - Compact */}
            <div className="inline-flex items-center justify-center mb-3 space-x-2">
              <img src={aktulogo} alt="AKTU Logo" loading="lazy" className="w-10 h-10 rounded-full" />
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                AKTU
              </div>
            </div>

            {/* Title - Very Compact */}
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              AKTU Notes, PYQs & Questions
            </h1>

            {/* Tagline - One Liner */}
            <p className="text-sm text-gray-400 max-w-xl mx-auto mb-4">
              Semester-wise notes, PYQ papers & important questions
            </p>

            {/* Features - Single Row */}
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">📚 Notes</span>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">📄 PYQs</span>
              <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full">⭐ Questions</span>
            </div>
          </div>
        </div>



        {/* Filters Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <FilterIcon className="w-5 h-5" />
                <span>Filter Resources</span>
              </h2>
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group"
              >
                <CloseIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span>Clear All</span>
              </button>
            </div>

            {/* STEP 1: Select Semester FIRST */}
            <div className="mb-8 hidden md:block  ">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Step 1: Choose Your Semester</h3>
                    <p className="text-sm text-gray-400">Start by selecting your current semester</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <button
                      key={sem}
                      onClick={() => {
                        handleFilterChange('semester', sem);
                        handleFilterChange('subject', ''); // Reset subject when semester changes
                      }}
                      className={`
            relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105
            ${localFilters.semester === sem
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-transparent shadow-xl scale-105'
                          : 'bg-gray-900/50 border-gray-700 hover:border-blue-500/50'
                        }
          `}
                    >
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-1 ${localFilters.semester === sem ? 'text-white' : 'text-gray-300'}`}>
                          {sem}
                        </div>
                        <div className={`text-xs ${localFilters.semester === sem ? 'text-white/80' : 'text-gray-500'}`}>
                          Semester
                        </div>
                      </div>

                      {localFilters.semester === sem && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* STEP 1: Select Semester */}
            <div className="mb-6 md:hidden ">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-3">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎓</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">Select Semester</h3>
                    <p className="text-xs text-gray-400">Choose your current semester</p>
                  </div>
                </div>

                {/* Semester Buttons - Compact Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <button
                      key={sem}
                      onClick={() => {
                        handleFilterChange('semester', sem);
                        handleFilterChange('subject', '');
                      }}
                      className={`
            relative p-2 rounded-lg border transition-all duration-300 transform hover:scale-105 text-center
            ${localFilters.semester === sem
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-transparent shadow-lg scale-105'
                          : 'bg-gray-900/40 border-gray-700/50 hover:border-blue-500/50'
                        }
          `}
                    >
                      <div className={`text-lg font-bold ${localFilters.semester === sem ? 'text-white' : 'text-gray-300'}`}>
                        {sem}
                      </div>

                      {localFilters.semester === sem && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>


            {/* STEP 2: Filters (Only show when semester is selected) */}
            {/* STEP 2: Filters - Modern Cards */}
            {localFilters.semester && (
              <div className="mb-6 space-y-3">
                {/* Header with Reset */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FilterIcon className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-white">
                      Filter Semester {localFilters.semester}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({subjectsBySemester[localFilters.semester]?.length || 0} subjects)
                    </span>
                  </div>
                  {(localFilters.subject || localFilters.category || localFilters.uploadedBy) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors flex items-center gap-1"
                    >
                      <CloseIcon className="w-3 h-3" />
                      Clear All
                    </button>
                  )}
                </div>

                {/* Filter Controls - Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {/* Subject */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5">
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Subject</label>
                    <select
                      value={localFilters.subject}
                      onChange={(e) => handleFilterChange('subject', e.target.value)}
                      className="w-full bg-black/50 border border-slate-600/50 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option className="bg-gray-900" value="">
                        All Subjects
                      </option>
                      {(subjectsBySemester[localFilters.semester] || []).map((subject) => (
                        <option className="bg-gray-900" key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                    {localFilters.subject && (
                      <p className="text-xs text-blue-400 mt-1.5 px-2 py-1 bg-blue-500/10 rounded">
                        📌 {localFilters.subject}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5">
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Type</label>
                    <select
                      value={localFilters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full bg-black/50 border border-slate-600/50 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option className="bg-gray-900" value="">
                        All Materials
                      </option>
                      <option className="bg-gray-900" value="Notes">📚 Study Notes</option>
                      <option className="bg-gray-900" value="Important Question">⭐ Important Q's</option>
                      <option className="bg-gray-900" value="PYQ">📄 Previous Year Q's</option>
                      <option className="bg-gray-900" value="Handwritten Notes">✏️ Handwritten</option>
                      <option className="bg-gray-900" value="Video">🎬 Video Lectures</option>  {/* ✨ NEW */}
                    </select>
                    {localFilters.category && (
                      <p className="text-xs text-purple-400 mt-1.5 px-2 py-1 bg-purple-500/10 rounded">
                        ✓ {localFilters.category}
                      </p>
                    )}
                    {/* ✨ NEW: Chapter Filter - ONLY SHOW WHEN VIDEO SELECTED */}
                    {localFilters.category === 'Video' && (
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5 border-red-500/30">
                        <label className="text-xs text-slate-400 font-semibold block mb-1">Chapter</label>
                        <select
                          value={localFilters.videoChapter}
                          onChange={(e) => handleFilterChange('videoChapter', e.target.value)}
                          className="w-full bg-black/50 border border-slate-600/50 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                        >
                          <option className="bg-gray-900" value="">All Chapters</option>
                          {uniqueChapters.map((chapter) => (
                            <option className="bg-gray-900" key={chapter} value={chapter}>
                              Chapter {chapter}
                            </option>
                          ))}
                        </select>
                        {localFilters.videoChapter && (
                          <p className="text-xs text-red-400 mt-1.5 px-2 py-1 bg-red-500/10 rounded">
                            🎬 Chapter {localFilters.videoChapter}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Contributor */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5">
                    <label className="text-xs text-slate-400 font-semibold block mb-1">By</label>
                    <select
                      value={localFilters.uploadedBy}
                      onChange={(e) => handleFilterChange('uploadedBy', e.target.value)}
                      className="w-full bg-black/50 border border-slate-600/50 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option className="bg-gray-900" value="">
                        All Contributors
                      </option>
                      {uniqueUploaders.map((uploader) => (
                        <option className="bg-gray-900" key={uploader.id} value={uploader.id}>
                          {uploader.name}
                        </option>
                      ))}
                    </select>
                    {localFilters.uploadedBy && (
                      <p className="text-xs text-green-400 mt-1.5 px-2 py-1 bg-green-500/10 rounded">
                        👤 {uniqueUploaders.find((u) => u.id === localFilters.uploadedBy)?.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 📘 Planner Smart Guidance Bar */}
            {localFilters.semester && (
              <div className="mb-6 px-3 sm:px-0">
                <div
                  className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
        px-4 py-4 sm:py-3
        rounded-xl
        border border-slate-500/20
        bg-[#1F1F1F] to-transparent
        transition-all duration-200
        shadow-sm backdrop-blur-sm
      "
                >
                  {/* Left: Icon + Text */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-slate-500/15 flex items-center justify-center flex-shrink-0 text-lg">
                      📘
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-semibold text-slate-100 leading-tight">
                        Want a clear study path?
                      </p>

                      <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-snug">
                        Planner organizes this subject chapter-by-chapter with notes, PYQs and
                        important questions — complete one step, then move ahead.
                      </p>
                    </div>
                  </div>

                  {/* Right: Button */}
                  <button
                    onClick={() => {
                      if (isPreferencesSet) {
                        navigate("/planner");
                      } else {
                        dispatch(openPreferenceDrawer());
                      }
                    }}
                    className="
          flex-shrink-0
          text-xs sm:text-sm font-semibold
          px-4 sm:px-5 py-2.5 sm:py-2
          rounded-full
          bg-[#9CA3AF] hover:bg-white text-black
          active:scale-[0.98]
          transition-all duration-200
          whitespace-nowrap
          focus:outline-none focus:ring-2 focus:ring-slate-400/40
          w-full sm:w-auto
        "
                  >
                    {ctaText}
                  </button>
                </div>
              </div>
            )}


            {/* Message when no semester selected */}
            {/* {!localFilters.semester && (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-yellow-500/30 rounded-2xl p-12 text-center mb-8">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👆</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Select Your Semester First</h3>
                <p className="text-gray-400">
                  Choose your semester above to see available subjects and study materials
                </p>
              </div>
            )} */}
            {!localFilters.semester && (
              <div className="mb-6 text-center py-3 px-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-300 font-medium mb-1">👆 Select a semester first</p>
                <p className="text-xs text-slate-400">Materials will appear once you choose</p>
              </div>
            )}



            {/* Spotify-style OR divider */}
            {/* <div className="flex items-center my-8">
              <div className="flex-1">
                <div className="h-px bg-gradient-to-r from-white/5 via-white/20 to-white/5"></div>
              </div>
              <div className="mx-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border border-white/10 backdrop-blur-sm">
                  <span className="text-white font-bold text-sm">OR</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-px bg-gradient-to-l from-white/5 via-white/20 to-white/5"></div>
              </div>
            </div> */}

            {/* Search Bar */}
            {/* <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div> */}
            {/* <div style={{ padding: '20px', background: 'red', color: 'white' }}>
      <h2>🔴 IF YOU SEE THIS, COMPONENT IS RENDERING</h2>
    </div> */}
          </div>


          {/* ✨ UPDATED: Stats Section - Include Video Count */}
          {!loading && !videoLoading && localFilters.semester && (
            <div className="mb-8 space-y-3">
              {/* Total Resources */}
              <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">Total Resources</p>
                    <p className="text-3xl font-bold text-white">
                      {totalNotes + (videos?.length || 0)}  {/* ✨ NEW: Add video count */}
                    </p>
                  </div>
                  <span className="text-5xl opacity-30">📊</span>
                </div>
              </div>

              {/* Category Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">  {/* ✨ UPDATED: 5 columns for Video */}
                {Object.entries(categoryStats).map(([category, count]) => {
                  const config = getCategoryConfig(category);
                  const isActive = localFilters.category === category;

                  return (
                    <button
                      key={category}
                      onClick={() => {
                        handleFilterChange('category', category);
                        handleFilterChange('videoChapter', '');  // Reset chapter filter
                      }}
                      className={`
                    relative rounded-lg p-3 transition-all duration-300 transform hover:scale-105 group
                    ${isActive
                          ? `bg-gradient-to-br ${config.gradient} border-transparent shadow-lg scale-105`
                          : `bg-[#1F1F1F] hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600`
                        }
                  `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{config.icon}</span>
                        <div className="text-left flex-1">
                          <p className={`text-xs font-medium mb-0.5 ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
                            {category}
                          </p>
                          <p className={`text-xl font-bold ${isActive ? 'text-white' : config.textColor}`}>
                            {count}
                          </p>
                        </div>
                      </div>

                      {isActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterChange('category', '');
                            handleFilterChange('videoChapter', '');
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500/80 hover:bg-red-600 rounded-full transition-colors shadow-md"
                          title="Clear filter"
                        >
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Contributors Filter - Simple Version */}
              {notes && notes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <span>👤</span>
                    <span>Filter by Contributor</span>
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {/* All Contributors Button */}
                    <button
                      onClick={() => handleFilterChange('uploadedBy', '')}
                      className={`
              px-4 py-2 rounded-full font-medium transition-all
              ${!localFilters.uploadedBy
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-[#1F1F1F] text-gray-300 hover:bg-gray-700'
                        }
            `}
                    >
                      All Contributors ({notes.length})
                    </button>

                    {/* Individual Contributors */}
                    {uniqueUploaders.map(uploader => {
                      const uploaderCount = notes.filter(n => n.uploadedBy?._id === uploader.id).length;
                      const isActive = localFilters.uploadedBy === uploader.id;

                      return (
                        <button
                          key={uploader.id}
                          onClick={() => handleFilterChange('uploadedBy', uploader.id)}
                          className={`
                  px-4 py-2 rounded-full font-medium transition-all flex items-center space-x-2
                  ${isActive
                              ? 'bg-purple-600 text-white shadow-lg'
                              : 'bg-[#1F1F1F] text-gray-300 hover:bg-gray-700'
                            }
                `}
                        >
                          {/* Avatar */}
                          {uploader?.avatar?.secure_url ? (
                            <img
                              src={uploader.avatar.secure_url}
                              alt={uploader.name}
                              className="w-5 h-5 rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                              {uploader.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className='capitalize'>{uploader.name} ({uploaderCount})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Contributor Badge */}
                  {localFilters.uploadedBy && (
                    <div className="mt-3 text-sm text-gray-400">
                      Showing notes by: <span className="text-purple-400 font-medium">
                        {uniqueUploaders.find(u => u.id === localFilters.uploadedBy)?.name}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}





          {/* Loading State */}
          {loading && (
            <div className="space-y-6 py-8">
              {/* Header Skeleton */}
              <div className="space-y-3">
                <div className="h-8 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg w-1/2 animate-pulse"></div>
              </div>

              {/* Search Bar Skeleton */}
              <div className="h-12 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl animate-pulse"></div>

              {/* Filter Buttons Skeleton */}
              <div className="flex gap-3 flex-wrap">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full w-24 animate-pulse"
                  ></div>
                ))}
              </div>

              {/* Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700/50 p-4 space-y-4"
                  >
                    {/* Thumbnail Skeleton */}
                    <div className="h-40 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-pulse"></div>

                    {/* Title Skeleton */}
                    <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg w-5/6 animate-pulse"></div>

                    {/* Subtitle Skeleton */}
                    <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg w-4/6 animate-pulse"></div>

                    {/* Button Skeleton */}
                    <div className="pt-2">
                      <div className="h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Enhanced Empty State with Popular Requests */}
          {!loading && !videoLoading && localFilters.semester && filteredNotes.length === 0 && displayResources.length === 0 && (
            <div className="text-center py-12 px-4">

              {/* TOP: PROMINENT REQUEST BUTTON - MAIN CTA */}
              <div className="mb-10">
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="group relative mx-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-xl font-bold text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 mb-3"
                >
                  <svg className="w-6 h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Request This Material</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Missing something? Let us know! We'll add it to our library.
                </p>
              </div>

              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.771 2 16.5S6.5 26.747 12 26.747s10-4.518 10-10.247S17.5 6.253 12 6.253z" />
                </svg>
              </div>

              {/* Main Message */}
              <h3 className="text-2xl font-bold text-white mb-2">
                No Resources Found Yet
              </h3>

              {/* Detailed Context */}
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
                We don't have notes for <span className="text-blue-400 font-semibold">Semester {localFilters.semester}</span>
                {localFilters.subject && (
                  <> in <span className="text-purple-400 font-semibold">{localFilters.subject}</span></>
                )}
                {searchTerm && (
                  <> matching <span className="text-green-400 font-semibold">"{searchTerm}"</span></>
                )} just yet.
              </p>

              {/* POPULAR REQUESTS SECTION - NEW FEATURE */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="text-left mb-6">
                  <h4 className="text-lg font-bold text-white mb-2">📋 Popular Requests for Semester {localFilters.semester}</h4>
                  <p className="text-xs text-gray-400">
                    Help the community by upvoting what you need. Popular requests get prioritized! ⬆️
                  </p>
                </div>

                {/* Popular Requests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularRequests && popularRequests.length > 0 ? (
                    popularRequests.map((request) => (
                      <div
                        key={request._id}
                        className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-5  text-left group"
                      >
                        {/* Header with Type Badge */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="font-bold text-white group-hover:text-blue-300 transition mb-2">
                              {request.subject}
                            </h5>
                            <div className="flex gap-2 flex-wrap">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${request.requestType === 'NOTES'
                                ? 'bg-blue-500/20 text-blue-300'
                                : request.requestType === 'PYQ'
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'bg-pink-500/20 text-pink-300'
                                }`}>
                                {request.requestType === 'NOTES' ? '📖 Notes' : request.requestType === 'PYQ' ? '📄 PYQs' : '❓ Questions'}
                              </span>
                              <span className="text-xs bg-gray-700/40 text-gray-300 px-2 py-1 rounded-full">
                                {request.branch} • Sem {request.semester}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          {request.status === 'FULFILLED' && (
                            <div className="flex-shrink-0 ml-2">
                              <span className="inline-block bg-green-500/20 text-green-300 text-lg">✓</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {request.description && (
                          <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                            {request.description}
                          </p>
                        )}

                        {/* Upvote Button & Count */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => dispatch(upvoteRequest(request._id))}
                            disabled={request.hasUpvoted}
                            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${request.hasUpvoted
                              ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50 cursor-not-allowed'
                              : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20 hover:border-blue-400/50'
                              }`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-up-icon lucide-thumbs-up"><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" /><path d="M7 10v12" /></svg>
                            <span>{request.upvoteCount}</span>
                          </button>
                        </div>

                        {/* Already Upvoted Badge */}
                        {request.hasUpvoted && (
                          <p className="text-xs text-blue-300 mb-4">✓ You've upvoted this</p>
                        )}

                        {/* REQUESTER INFO SECTION - With Avatar */}
                        <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {/* Avatar Image */}
                            {request.requestedBy?.avatar?.secure_url ? (
                              <img
                                src={request.requestedBy.avatar.secure_url}
                                alt={request.requestedBy.fullName}
                                className="w-10 h-10 rounded-full object-cover border border-white/20 hover:border-white/40 transition"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border border-white/20">
                                <span className="text-white font-bold text-sm">
                                  {request.requestedBy?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                                </span>
                              </div>
                            )}

                            {/* Requester Name & Details */}
                            <div className="flex-1">
                              <p className="text-xs  capitalize font-semibold text-white">
                                {request.requestedBy?.fullName || 'Anonymous'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {request.requestedBy?.academicProfile?.branch} • Sem {request.requestedBy?.academicProfile?.semester}
                              </p>
                            </div>
                          </div>

                          {/* Time Posted */}
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-gray-400 text-sm">No requests yet for this semester. Be the first to request! 🚀</p>
                    </div>
                  )}
                </div>


                {/* View All Requests Link */}
                <div className="mt-6">
                  <Link
                    to="/browse-requests"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm group"
                  >
                    View all requests
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* HELPFUL INFO BOX */}
              <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/30 border border-blue-500/40 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex-1 text-left">
                      <h4 className="text-lg font-semibold text-blue-300 mb-2">
                        💡 Can't Find Your Subject?
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed mb-3">
                        AKTU allows flexibility in subject selection per semester. Your desired subject might be in a different semester. Check the popular requests above - if someone else needs it too, upvote to help prioritize!
                      </p>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-start space-x-2">
                          <span className="text-green-400 font-bold mt-0.5">✓</span>
                          <span className="text-gray-300"><span className="text-green-300 font-semibold">Upvote requests</span> - Show what's in demand</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-400 font-bold mt-0.5">→</span>
                          <span className="text-gray-300"><span className="text-blue-300 font-semibold">Request new material</span> - Add to community wishlist</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-purple-400 font-bold mt-0.5">♦</span>
                          <span className="text-gray-300"><span className="text-purple-300 font-semibold">Browse all requests</span> - See what others need</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                <Link
                  to="/search"
                  className="group flex-1 sm:flex-none px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500/50 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search All Semesters</span>
                </Link>

                <Link
                  to="/notes"
                  className="group flex-1 sm:flex-none px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.771 2 16.5S6.5 26.747 12 26.747s10-4.518 10-10.247S17.5 6.253 12 6.253z" />
                  </svg>
                  <span>Browse Library</span>
                </Link>
              </div>

              {/* QUICK ACTIONS GRID */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-3">⚡ Quick Actions</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link to="/search">
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/30 hover:border-blue-500/60 rounded-lg p-4 text-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer">
                      <div className="text-3xl mb-2">🔍</div>
                      <div className="text-sm font-semibold text-blue-300 mb-1">Advanced Search</div>
                      <div className="text-xs text-gray-500">Find across all semesters</div>
                    </div>
                  </Link>

                  <Link to="/notes">
                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/30 hover:border-purple-500/60 rounded-lg p-4 text-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer">
                      <div className="text-3xl mb-2">📚</div>
                      <div className="text-sm font-semibold text-purple-300 mb-1">Browse All Subjects</div>
                      <div className="text-xs text-gray-500">Explore full library</div>
                    </div>
                  </Link>

                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="bg-gradient-to-br from-pink-900/30 to-pink-900/10 border border-pink-500/30 hover:border-pink-500/60 rounded-lg p-4 text-center transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 cursor-pointer w-full"
                  >
                    <div className="text-3xl mb-2">📝</div>
                    <div className="text-sm font-semibold text-pink-300 mb-1">Request Material</div>
                    <div className="text-xs text-gray-500">Add to library</div>
                  </button>
                </div>
              </div>

              {/* PRO TIP */}
              <div className="max-w-lg mx-auto pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="text-yellow-400 font-bold">💡 Pro Tip:</span> The more people upvote a request, the faster our team works to add it! Start with popular requests and help your community get the materials they need.
                </p>
              </div>
            </div>
          )}



          {/* Enhanced Semester Selection Prompt */}
          {!loading && !localFilters.semester && (
            <div className="text-center py-20 px-4 space-y-6">
              {/* Animated Icon */}
              <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookIcon className="w-14 h-14 text-white" />
              </div>

              {/* Primary Message */}
              <h3 className="text-3xl font-extrabold text-white mb-2">
                Pick Your Semester
              </h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Start by selecting your current semester to see tailored study resources.
              </p>

              {/* Secondary Action - Global Search */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/search"
                  className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 overflow-hidden"
                >
                  {/* Subtle Glow */}
                  <span className="absolute inset-0 bg-white opacity-20 blur-sm"></span>
                  <SearchIcon className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">Search All Resources</span>
                </Link>
              </div>

              {/* Tertiary Hint */}
              <p className="mt-4 text-sm text-gray-500 max-w-md mx-auto">
                Or&nbsp;
                <Link to="/search" className="text-blue-400 hover:underline">
                  search everything
                </Link>
                &nbsp;if your elective notes are stored under a different semester.
              </p>
            </div>
          )}

          {/* <AdBanner /> */}
          {/* Notes Grid */}
          {/* Notes/Videos Grid - FIXED */}

          {displayResources && displayResources.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayResources.map((resource) => {
                // ✅ FIXED: Better type detection
                const isVideo = resource?.videoId || resource?.embedUrl || resource?.platform === 'YOUTUBE';

                return (
                  <TrackedNoteCard
                    key={resource._id}
                    item={resource}
                    type={isVideo ? 'video' : 'note'} // ✅ Detect from resource properties
                    note={resource}
                  />
                );
              })}
            </div>
          )}
          {/* 📘 Planner Guidance — After Notes Grid */}
          {displayResources && displayResources.length > 0 && showPlannerReminder && (
            <div className="mb-10 px-3 sm:px-0">
              <div
                className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
        px-5 py-5 sm:py-4
        rounded-2xl
        border border-slate-600/20
        bg-[#1F1F1F]
        shadow-sm backdrop-blur
      "
              >
                {/* Left: Message */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-11 h-11 rounded-xl bg-slate-500/15 flex items-center justify-center flex-shrink-0 text-xl">
                    📘
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-slate-100">
                      Studying chapter-by-chapter works better
                    </p>

                    <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                      Planner arranges these notes, PYQs and important questions into a
                      clear order — complete one chapter, then move to the next without confusion.
                    </p>
                  </div>
                </div>

                {/* Right: CTA */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleOpenPlanner}
                    className="
            flex-1 sm:flex-none
            px-5 py-2.5
            text-xs sm:text-sm font-semibold
            rounded-full
            bg-[#9CA3AF] hover:bg-white text-black
            active:scale-[0.98]
            transition-all duration-200
            whitespace-nowrap
            focus:outline-none focus:ring-2 focus:ring-slate-400/40
          "
                  >
                    Organize my study →
                  </button>

                  <button
                    onClick={handleClosePlannerReminder}
                    className="
            px-3 py-2.5
            text-slate-400 hover:text-slate-200
            hover:bg-white/5
            rounded-lg
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-slate-400/30
          "
                    aria-label="Dismiss"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}




          {/* Empty State - ADD THIS */}
          {!loading && !videoLoading && (!displayResources || displayResources.length === 0) && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">
                {localFilters.category === 'Video'
                  ? 'No videos found for this semester'
                  : 'No resources found'}
              </p>
            </div>
          )}

          {/* <AdBanner /> */}
        </div>
        {/* Request Modal */}
        <RequestModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          defaultSemester={localFilters.semester}
          defaultSubject={localFilters.subject}
        />

      </div>

      {/* Planner Drawer (must be mounted) */}
      <StudyPreferenceDrawer isFirstTime={false} />
    </HomeLayout>
  );
}


// nav bar 
  {/* 🎨 AMAZING Spotify-Style Bottom Navigation - Redesigned */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
   {/* Background */}
   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
 
   <div className="relative px-4 py-3 flex items-center justify-evenly">
     {getMobileNavItems().map((item) => {
       const IconComponent = item.icon;
       const isActive = isActiveLink(item.path);
 
       return (
         <Link
           key={item.name}
           to={item.path}
           className="flex flex-col items-center gap-1.5"
         >
           {/* Icon Container */}
           <div
             className={`
               p-3 rounded-full transition-all duration-200
               ${isActive
                 ? "bg-white/10 text-white ring-1 ring-white/20"
                 : "bg-transparent text-gray-500"
               }
             `}
           >
             <IconComponent className="w-5 h-5" />
           </div>
 
           {/* Label */}
           <span
             className={`text-[11px] font-medium tracking-wide ${
               isActive ? "text-white" : "text-gray-500"
             }`}
           >
             {item.label}
           </span>
         </Link>
       );
     })}
   </div>
 
   {/* Safe Area */}
   <div className="h-2" />
 </div>