// 🎪 FILE: FRONTEND/src/COMPONENTS/Note/NoteCard.jsx - FINAL REDESIGN (Smart, Non-Intrusive)

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, downloadnote, addRating, incrementViewCount } from '../../REDUX/Slices/noteslice.js';
import LoginPrompt from '../../COMPONENTS/LoginPrompt.jsx';
import ReactGA from "react-ga4"
import { setLoginModal } from '../../REDUX/Slices/authslice.js';
import { usePDFDownload } from '../../hooks/usePDFDownload.js';
import ViewersModal from '../../COMPONENTS/Note/ViewersModal.jsx';
import { useEffect } from 'react';

// Icons
const BookmarkIcon = ({ className, filled }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="m8 12 4 4 4-4" />
  </svg>
);

const StarIcon = ({ className, filled }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DotsIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
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

// ✨ CATEGORY COLOR MAPPING
const CATEGORY_COLORS = {
  'NOTES': { accent: 'indigo-500', bg: 'indigo-500/10', border: 'indigo-500/30', text: 'indigo-400' },
  'PYQ': { accent: 'cyan-500', bg: 'cyan-500/10', border: 'cyan-500/30', text: 'cyan-400' },
  'IMPORTANT_Q': { accent: 'amber-500', bg: 'amber-500/10', border: 'amber-500/30', text: 'amber-400' },
  'HANDWRITTEN': { accent: 'emerald-500', bg: 'emerald-500/10', border: 'emerald-500/30', text: 'emerald-400' },
};

// ✨ MAPPING FOR TAILWIND DYNAMIC CLASSES
const BORDER_COLORS = {
  'indigo-500': 'border-l-indigo-500',
  'cyan-500': 'border-l-cyan-500',
  'amber-500': 'border-l-amber-500',
  'emerald-500': 'border-l-emerald-500',
};

export default function NoteCard({ note }) {
  const dispatch = useDispatch();
  const { bookmarkingNotes, downloadingNotes } = useSelector(state => state.note);
  const user = useSelector(state => state.auth.data);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  const isBookmarking = bookmarkingNotes.includes(note._id);
  const isBookmarked = note.bookmarkedBy?.includes(user?._id);

  const avgRating = note.rating?.length
    ? (note.rating.reduce((sum, r) => sum + r.rating, 0) / note.rating.length).toFixed(1)
    : 0;

  // Get category colors
  const categoryKey = note.category?.toUpperCase().replace(/\s+/g, '_') || 'NOTES';
  const colors = CATEGORY_COLORS[categoryKey] || CATEGORY_COLORS['NOTES'];
  const borderColorClass = BORDER_COLORS[colors.accent] || 'border-l-indigo-500';

  // State
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [showViewersModal, setShowViewersModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [isCurrentlyDownloading, setIsCurrentlyDownloading] = useState(false);
  const menuRef = useRef(null);

  const { downloadPDF, downloading } = usePDFDownload();
  const downloadState = downloading[note._id];
 // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
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

    setIsCurrentlyDownloading(true);

    ReactGA.event({
      category: 'engagement',
      action: 'download_note',
      label: note.title,
      value: note._id,
    });

    await dispatch(downloadnote({ noteId: note._id, title: note.title }));

    const success = await downloadPDF({
      id: note._id,
      url: note.fileDetails.secure_url,
      title: note.title,
      subject: note.subject,
      courseCode: note.course,
      semester: note.semester,
      university: note.university,
      uploadedBy: note.uploadedBy,
    });

    if (success) {
      // Smart delay: 500-800ms
      const delay = 500 + Math.random() * 300;
      setTimeout(() => {
        setIsCurrentlyDownloading(false);
        // Only show rating modal if user hasn't rated this note yet
        // if (!hasRated) {
        setShowReviewModal(true);
        // }
      }, delay);
    } else {
      setIsCurrentlyDownloading(false);
    }
  };

  const submitRating = () => {
    if (userRating > 0) {
      dispatch(addRating({
        noteId: note._id,
        rating: userRating,
        review: userReview
      }));
      setHasRated(true);
      setShowReviewModal(false);
      setUserRating(0);
      setUserReview('');
      // Show share modal after rating
      setTimeout(() => {
        setShowShareModal(true);
      }, 300);
    }
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/notes/${note._id}`;
    const title = `Check out: ${note.title}`;

    const shareLinks = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      letter: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this note: ' + url)}`,
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

  const closeMenuDropdown = () => {
    setShowMenuDropdown(false);
  };

  // Menu options
  const menuOptions = [
    { label: '⭐ Rate', action: () => { setShowReviewModal(true); closeMenuDropdown(); } },
    { label: '👁️ Viewers', action: () => { setShowViewersModal(true); closeMenuDropdown(); } },
    { label: '📄 Details', action: () => { window.location.href = `/notes/${note._id}`; } },
    { label: '🔗 Share', action: () => { setShowShareModal(true); closeMenuDropdown(); } },
  ];

  return (
    <>
      {/* ✨ CLEAN ACADEMIC NOTE CARD - FINAL VERSION */}
      <div className={`group bg-neutral-950 border border-neutral-800 ${borderColorClass} border-l-3 rounded-xl overflow-hidden hover:border-neutral-700 transition-all duration-300`}>

        {/* Content */}
        <div className="p-6 space-y-4">

          {/* Header - Title + Bookmark + Menu */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Category Badge */}
              <div className="mb-2">
                <span
                  style={{
                    backgroundColor: "rgba(99, 102, 241, 0.1)", // indigo-500 with 10% opacity
                    color: "rgb(99, 102, 241)"                  // indigo-500
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-full border border-indigo-600/30"
                >
                {note.category}
                </span>

              </div>

              {/* Title - ONLY Underline on Hover, Clickable */}
              <Link
                to={`/notes/${note._id}/read`}
                className="block text-white capitalize font-semibold text-base line-clamp-2 hover:underline transition-all cursor-pointer"
              >
                {note.title}
              </Link>
            </div>

            {/* Top Right: Bookmark + Menu Dots */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Bookmark Button */}
              <button
                onClick={handleBookmark}
                disabled={isBookmarking}
                className="p-2 hover:bg-neutral-900 rounded-lg transition-all"
                title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <BookmarkIcon
                  className={`w-5 h-5 transition-all ${isBookmarked
                    ? 'text-amber-500 fill-current scale-110'
                    : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  filled={isBookmarked}
                />
              </button>

              {/* Three Dots Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                  className="p-2 hover:bg-neutral-900 rounded-lg transition-all cursor-pointer"
                  title="More options"
                >
                  <DotsIcon className="w-5 h-5 text-neutral-500 hover:text-neutral-300" />
                </button>

                {/* Dropdown Menu */}
                {showMenuDropdown && (
                  <div className="absolute right-0 mt-1 w-40 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-50 overflow-hidden">
                    {menuOptions.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={option.action}
                        className="w-full px-4 py-2.5 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors border-b border-neutral-800 last:border-b-0"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metadata Line */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="truncate">{note.subject}</span>
            <span>•</span>
            <span className="whitespace-nowrap">Sem {note.semester}</span>
            <span>•</span>
            <span className="truncate">{note.university}</span>
          </div>

          {/* Description - Optional */}
          {note.description && (
            <p className="text-sm capitalize text-neutral-400 line-clamp-1">
              {note.description}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800 gap-3">
            {/* Left: Views, Downloads, Ratings */}
            <div className="flex items-center gap-4 text-xs text-neutral-500 min-w-0">
              {/* Views */}
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <EyeIcon className="w-4 h-4" />
                <span>{note.views || 0}</span>
              </div>

              {/* Downloads */}
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <DownloadIcon className="w-4 h-4" />
                <span>{note.downloads || 0}</span>
              </div>

              {/* Rating */}
              {note.rating?.length > 0 && (
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <StarIcon className="w-4 h-4 text-amber-500" filled />
                  <span>{avgRating}</span>
                </div>
              )}
            </div>

            {/* Right: Uploader Profile */}
            <Link
              to={`/profile/${note.uploadedBy?._id}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
            >
              {note.uploadedBy?.avatar?.secure_url?.startsWith('http') ? (
                <img
                  src={note.uploadedBy.avatar.secure_url}
                  alt={note.uploadedBy.fullName}
                  className="w-5 h-5 rounded-full object-cover border border-neutral-700"
                />
              ) : (
                <div className="w-5 h-5 bg-neutral-700 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {note.uploadedBy?.fullName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-xs text-neutral-500 truncate max-w-[100px]">
                {note.uploadedBy?.fullName || 'Unknown'}
              </span>
            </Link>
          </div>

          {/* Action Buttons - PRIMARY + DOWNLOAD ICON */}
          <div className="flex gap-2 pt-4">
            {/* Primary: View Button */}
            <Link
              to={`/notes/${note._id}/read`}
              // style={{
              //   backgroundColor: colors.accent === 'indigo-500' ? '#6366f1' : 
              //                  colors.accent === 'cyan-500' ? '#06b6d4' :
              //                  colors.accent === 'amber-500' ? '#f59e0b' :
              //                  '#10b981'
              // }}
              className="flex-1  bg-[#1F1F1F] px-4 py-2.5 hover:opacity-90 text-white rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-700"
            >
              <EyeIcon className="w-4 h-4" />
              <span>View</span>
            </Link>

            {/* Download Button - ICON ONLY */}
            <button
              onClick={handleDownload}
              disabled={downloadState?.status === 'starting' || isCurrentlyDownloading}
              className={`px-3 py-3 border rounded-full font-semibold text-sm transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-700 ${downloadState?.status === 'error'
                  ? 'border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10'
                  : downloadState?.status === 'complete' || downloadState?.status === 'exists'
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                    : downloadState?.status === 'starting' || isCurrentlyDownloading
                      ? 'border-neutral-600 bg-neutral-800/50 text-neutral-300 cursor-wait'
                      : 'border-neutral-700  text-neutral-300 hover:border-neutral-600 hover:bg-neutral-900'
                }`}
              aria-label="Download note"
              aria-busy={downloadState?.status === 'starting' || isCurrentlyDownloading}
              title="Download note"
            >
              {downloadState?.status === 'complete' || downloadState?.status === 'exists' ? (
                <CheckIcon className="w-4 h-4" />
              ) : downloadState?.status === 'starting' || isCurrentlyDownloading ? (
                <div className="w-4 h-4 animate-spin border-2 border-neutral-400 border-t-transparent rounded-full"></div>
              ) : downloadState?.status === 'error' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <DownloadIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ SMART REVIEW MODAL - Non-Intrusive */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl max-w-md w-full p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Rate This Note</h2>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setUserRating(0);
                  setUserReview('');
                }}
                className="p-2 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <CloseIcon className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Rating Stars */}
            <div className="mb-6">
              <label className="block text-sm text-neutral-300 mb-3 font-medium">How helpful was this note?</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className="transition-all hover:scale-110 cursor-pointer"
                  >
                    <StarIcon
                      className={`w-8 h-8 ${star <= userRating ? 'text-amber-400 fill-current' : 'text-neutral-600 hover:text-neutral-400'}`}
                      filled={star <= userRating}
                    />
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <p className="text-xs text-neutral-400 text-center mt-2">
                  {userRating === 1 && "Need improvement"}
                  {userRating === 2 && "Could be better"}
                  {userRating === 3 && "Good note"}
                  {userRating === 4 && "Very helpful"}
                  {userRating === 5 && "Excellent! ⭐"}
                </p>
              )}
            </div>

            {/* Review Text */}
            {userRating > 0 && (
              <div className="mb-6">
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value.slice(0, 200))}
                  placeholder="Your review (optional)..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 resize-none"
                  rows={3}
                />
                <div className="text-right text-xs text-neutral-500 mt-1">{userReview.length}/200</div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setUserRating(0);
                  setUserReview('');
                }}
                className="flex-1 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg transition-colors text-sm cursor-pointer"
              >
                Skip for now
              </button>
              <button
                onClick={submitRating}
                disabled={userRating === 0}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all cursor-pointer ${userRating === 0
                    ? 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ SHARE MODAL - Trust-Building Message */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl max-w-md w-full p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Thanks for Rating!</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <CloseIcon className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Trust-Building Message */}
            <p className="text-neutral-300 text-sm mb-6 leading-relaxed">
              Help your friends prepare better with these notes. Sharing takes just a few seconds! 📚
            </p>

            {/* Share Buttons - Minimal, Clear */}
            <div className="space-y-2 mb-4">
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full py-2.5 px-4 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900 text-neutral-300 rounded-lg text-sm font-medium transition-all cursor-pointer"
              >
                💬 Share on WhatsApp
              </button>

              <button
                onClick={() => handleShare('link')}
                className="w-full py-2.5 px-4 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900 text-neutral-300 rounded-lg text-sm font-medium transition-all cursor-pointer"
              >
                🔗 Copy Link
              </button>

              <button
                onClick={() => handleShare('letter')}
                className="w-full py-2.5 px-4 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900 text-neutral-300 rounded-lg text-sm font-medium transition-all cursor-pointer"
              >
                ✉️ Share via Email
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg transition-colors text-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ✅ VIEWERS MODAL */}
      <ViewersModal
        isOpen={showViewersModal}
        noteId={note._id}
        viewers={note.viewedBy || []}
        totalViews={note.views || 0}
        onClose={() => setShowViewersModal(false)}
      />
    </>
  );
}