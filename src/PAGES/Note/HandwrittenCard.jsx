import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, downloadnote, addRating, toggleRecommendNote } from '../../REDUX/Slices/noteslice.js';
import ReactGA from "react-ga4"
import { setLoginModal } from '../../REDUX/Slices/authslice.js';
import { usePDFDownload } from '../../hooks/usePDFDownload.js';
import ViewersModal from '../../COMPONENTS/Note/ViewersModal.jsx';
import { useNoteTracking } from '../../COMPONENTS/Session/NoteInteractionTracker.jsx';  // ← ADD HERE
import { Infinity, Star } from 'lucide-react';
import { openPaywall } from "../../REDUX/Slices/paywallSlice";
import { showToast } from "../../HELPERS/Toaster";
import DownloadLimitBanner from "../../COMPONENTS/Paywall/DownloadLimitBanner.jsx";
import axiosInstance from '../../HELPERS/axiosInstance.js';

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

const ArrowIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// ✨ HANDWRITTEN COLOR MAPPING
const HANDWRITTEN_COLORS = {
  accent: 'emerald-500',
  bg: 'emerald-500/10',
  border: 'emerald-500/30',
  text: 'emerald-400',
  borderClass: 'border-l-4 border-l-emerald-500'
};

export default function HandwrittenCard({ note }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.data);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const { bookmarkingNotes, downloadingNotes } = useSelector(state => state.note);
 const access = user?.access;
  const hasActivePlan =
    access?.plan &&
    access?.expiresAt &&
    new Date(access.expiresAt) > new Date();

  const isBookmarked = note.bookmarkedBy?.includes(user?._id);

  const avgRating = note.rating?.length
    ? (note.rating.reduce((sum, r) => sum + r.rating, 0) / note.rating.length).toFixed(1)
    : 0;

  // State
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [showViewersModal, setShowViewersModal] = useState(false);
  const [isCurrentlyDownloading, setIsCurrentlyDownloading] = useState(false);
  const menuRef = useRef(null);
  const { trackView, trackClick, trackDownload, trackBookmark, trackRate } = useNoteTracking();

  const { downloadPDF, downloading } = usePDFDownload();
  const downloadState = downloading[note._id];
  const role = useSelector((state) => state?.auth?.role || "");
  
  
    const [quotaInfo, setQuotaInfo] = useState(null);
    const [showQuotaBanner, setShowQuotaBanner] = useState(false);
  
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
    trackBookmark(note._id);
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
const fetchQuota = async () => {
    // 🚫 Paid users don't need quota
    if (hasActivePlan) return;
    const res = await axiosInstance.get("/user/download-quota");
    if (res.data?.success) {
      setQuotaInfo(res.data);
      setShowQuotaBanner(true);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

   

    if (!isLoggedIn) {
      dispatch(setLoginModal({
        isOpen: true,
        context: {
          action: "Download this note",
          noteTitle: note.title
        }
      }));
      return;
    }

    setIsCurrentlyDownloading(true);

    const result = await downloadPDF({
      id: note._id,
      title: note.title,
      meta: {
        subject: note.subject,
        semester: note.semester,
        university: note.university
      }
    });

    setIsCurrentlyDownloading(false);

    // 🟢 SUCCESS
    if (result.success) {
      if (!hasActivePlan) {
        await fetchQuota();
      }
      setTimeout(() => {
        setShowReviewModal(true);
      }, 600);
      return;
    }

    if (result.code === "DOWNLOAD_LIMIT_REACHED") {
       trackDownload(note._id);
      if (!hasActivePlan) {
        await fetchQuota();
      }
      dispatch(openPaywall({
        reason: "LIMIT_REACHED",
        noteId: note._id
      }));
      return;
    }


    if (result.code === "PLAN_EXPIRED") {
      dispatch(openPaywall({
        reason: "PLAN_EXPIRED"
      }));
      return;
    }

    // ❌ FALLBACK
    showToast.error(result.message || "Download failed");
  };

  // const handleDownload = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   trackDownload(note._id);
  //   if (!isLoggedIn) {
  //     dispatch(setLoginModal({
  //       isOpen: true,
  //       context: {
  //         action: 'want to Download this note',
  //         noteTitle: note.title
  //       }
  //     }));
  //     return;
  //   }

  //   setIsCurrentlyDownloading(true);

  //   ReactGA.event({
  //     category: 'engagement',
  //     action: 'download_handwritten',
  //     label: note.title,
  //     value: note._id,
  //   });

  //   await dispatch(downloadnote({ noteId: note._id, title: note.title }));

  //   const success = await downloadPDF({
  //     id: note._id,
  //     url: note.fileDetails.secure_url,
  //     title: note.title,
  //     subject: note.subject,
  //     courseCode: note.course,
  //     semester: note.semester,
  //     university: note.university,
  //     uploadedBy: note.uploadedBy,
  //   });

  //   if (success) {
  //     // Smart delay: 500-800ms
  //     const delay = 500 + Math.random() * 300;
  //     setTimeout(() => {
  //       setIsCurrentlyDownloading(false);
  //       // Only show rating modal if user hasn't rated this note yet
  //       // if (!hasRated) {
  //       setShowReviewModal(true);
  //       // }
  //     }, delay);
  //   } else {
  //     setIsCurrentlyDownloading(false);
  //   }
  // };

  const submitRating = () => {
    if (userRating > 0) {
      trackRate(note._id, userRating);
      dispatch(addRating({
        noteId: note._id,
        rating: userRating,
        review: userReview
      }));
      setShowReviewModal(false);
      setUserRating(0);
      setUserReview('');
      // Show share modal ONLY after rating submitted
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
      letter: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out these Handwritten Notes: ' + url)}`,
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
    // ✅ NEW: Admin-only recommendation option
        ...(role === 'ADMIN' ? [
          {
            label: note.recommended ? '✓ Remove Recommendation' : '⭐ Mark Recommended',
            action: () => {
              dispatch(toggleRecommendNote({
                noteId: note._id,
                recommended: !note.recommended,
                rank: !note.recommended ? 1 : 0
              }));
              closeMenuDropdown();
            },
            admin: true,
            separator: true
          }
        ] : []),
  ];

  return (
    <>
      {/* ✨ HANDWRITTEN CARD - EMERALD THEME WITH LEFT BORDER */}
      <div className={`group bg-[#0F0F0F] relative border border-[#1f1f1f] border-l-3 border-l-emerald-500/80 rounded-xl overflow-hidden hover:border-neutral-700 transition-all duration-300`}>
{/* ✅ NEW: Recommended Badge */}
              {/* {note.recommended && (
                <div className="absolute -top-2 -left-2 flex cursor-default items-center gap-1 bg-emerald-600 px-2 py-1 rounded-full shadow-lg border border-emerald-500/50 z-10">
                  <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  <span className="text-[10px] text-white font-semibold whitespace-nowrap">
                    Recommended
                  </span>
                  <div className="absolute left-1/2 -translate-x-1/2 mt-1 opacity-0 hover:opacity-100 
                  transition bg-black text-white text-[10px] px-2 py-1 rounded">
              Recommended
            </div>
                </div>
              )} */}
               {note.recommended && (
  <div className="absolute -top-14 -right-10 -z-0 w-40 h-40 flex items-center justify-center overflow-visible">
    <div className="bg-emerald-600 text-white text-[10px] font-bold px-8 py-1 rotate-35 shadow-md whitespace-nowrap">
      ⭐ Recommended
    </div>
  </div>
)}
        {/* Content */}
        <div className="p-6 space-y-4">

          {/* Header - Title + Bookmark + Menu */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Category Badge */}
              <div className="mb-2">
                <span style={{
                  backgroundColor: `rgba(16, 185, 129, 0.1)`,
                  color: `rgb(16, 185, 129)`
                }} className="px-2.5 py-1  text-xs font-semibold rounded-full border border-emerald-600/30">
                  ✏️ Handwritten
                </span>
              </div>

              {/* Title - ONLY Underline on Hover, Clickable */}
              <Link
                to={`/notes/${note._id}/read`}
                className="block text-white capitalize font-semibold text-base line-clamp-2 hover:underline transition-all cursor-pointer"
                onClick={() => {
                  // ✅ ADD TRACKING - TWO LINES!
                  trackView(note._id, note.title);
                  trackClick(note._id);
                }}
              >
                {note.title}
              </Link>
            </div>

            {/* Top Right: Bookmark + Menu Dots */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Bookmark Button */}
              <button
                onClick={handleBookmark}
                className="p-2 hover:bg-neutral-900 rounded-lg transition-all"
                title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <BookmarkIcon
                  className={`w-5 h-5 transition-all ${isBookmarked
                    ? 'text-emerald-400 fill-current scale-110'
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
                  <div className="absolute right-0 mt-1 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-50 overflow-hidden">
                    {menuOptions.map((option, idx) => (
                      <div key={idx}>
                        {option.separator && (
                          <div className="h-px bg-neutral-700 my-1" />
                        )}
                        <button
                          onClick={option.action}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors border-b border-neutral-800 last:border-b-0 ${option.admin
                              ? 'bg-amber-900/20 text-amber-400 hover:bg-amber-900/40 font-semibold'
                              : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                            }`}
                        >
                          {option.label}
                        </button>
                      </div>
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
            <span className="whitespace-nowrap">
              Sem {Array.isArray(note.semester) ? note.semester.join(" / ") : note.semester}
            </span>
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
                  {/* RIGHT SIDE infinty badge */}
            {hasActivePlan && (
              <span
                className="
                  inline-flex items-center
                  text-emerald-400/70
                  text-[11px]
                  font-medium
                  whitespace-nowrap
                "
                title="Unlimited downloads"
              >
                <Infinity className='w-4 h-4'/>
              </span>
            )}
            

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
                <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {note.uploadedBy?.fullName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-xs text-neutral-500 truncate max-w-[100px]">
                {note.uploadedBy?.fullName || 'Unknown'}
              </span>
            </Link>
          </div>
 {/* 🔔 Download limit micro banner */}
          {!hasActivePlan && showQuotaBanner && (
            <div
              className=" animate-slide-up-fade
      absolute left-4 right-4
      bottom-[65px]   /* sits above action buttons */
      z-30
      pointer-events-auto
    "
            >
              <DownloadLimitBanner
                quota={quotaInfo}
                onClose={() => setShowQuotaBanner(false)}
              />
            </div>
          )}
          {/* Action Buttons - PRIMARY + DOWNLOAD ICON */}
          <div className="flex gap-2 pt-4">
            {/* Primary: View Button */}
            <Link
              to={`/notes/${note._id}/read`}
              // style={{ backgroundColor: '#1F1F1F' }}
              className="flex-1 px-4 bg-[#1F1F1F] hover:bg-[#2F2F2F] py-2.5 hover:opacity-90 text-white rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-700"
              onClick={() => {
                // ✅ ADD TRACKING - TWO LINES!
                trackView(note._id, note.title);
                trackClick(note._id);
              }}
            >
              <EyeIcon className="w-4 h-4" />
              <span>View</span>
            </Link>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloadState?.status === 'starting' || isCurrentlyDownloading}
              className={`px-3 py-3 border rounded-full font-semibold text-sm transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-700 ${downloadState?.status === 'error'
                  ? 'border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10'
                  : downloadState?.status === 'complete' || downloadState?.status === 'exists'
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                    : downloadState?.status === 'starting' || isCurrentlyDownloading
                      ? 'border-neutral-600 bg-neutral-800/50 text-neutral-300 cursor-wait'
                      : 'border-neutral-700 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-900'
                }`}
              aria-label="Download note"
              aria-busy={downloadState?.status === 'starting' || isCurrentlyDownloading}
              title="Download Handwritten Notes"
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

      {/* ✅ RATING MODAL - Shows ONLY After Successful Download */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl max-w-md w-full p-6 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Rate These Notes</h2>
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
              <label className="block text-sm text-neutral-300 mb-3 font-medium">How helpful are these notes?</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className="transition-all hover:scale-110 cursor-pointer"
                  >
                    <StarIcon
                      className={`w-8 h-8 ${star <= userRating ? 'text-emerald-400 fill-current' : 'text-neutral-600 hover:text-neutral-400'}`}
                      filled={star <= userRating}
                    />
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <p className="text-xs text-neutral-400 text-center mt-2">
                  {userRating === 1 && "Not very clear"}
                  {userRating === 2 && "Could be better"}
                  {userRating === 3 && "Good notes"}
                  {userRating === 4 && "Very helpful"}
                  {userRating === 5 && "Excellent! 📚"}
                </p>
              )}
            </div>

            {/* Review Text - ONLY APPEARS AFTER RATING */}
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
                Skip
              </button>
              <button
                onClick={submitRating}
                disabled={userRating === 0}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all cursor-pointer ${userRating === 0
                    ? 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ SHARE MODAL - Shows ONLY After Rating Submitted */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl max-w-md w-full p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Share These Notes</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                <CloseIcon className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <p className="text-neutral-400 text-sm mb-6">Help your classmates study 📝</p>

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