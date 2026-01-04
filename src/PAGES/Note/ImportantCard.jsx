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
              viewers={note.viewedBy || []}
              totalViews={note.views || 0}
              onClose={() => setShowViewersModal(false)}
            />
    </>
  );
}
