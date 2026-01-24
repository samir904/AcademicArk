// src/PAGES/Note/ReadNote.jsx - UPDATED WITH DOWNLOAD BUTTON
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getNote, toggleBookmark, clearCurrentNote } from '../../REDUX/Slices/noteslice';
import { useNoteDownload } from '../../hooks/useNoteDownload';
import { useNoteTracking } from "../../COMPONENTS/Session/NoteInteractionTracker";
import { clearActiveResource, setActiveResource } from '../../UTILS/activeResource';

const ReadNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentNote, loading, bookmarking, error } = useSelector(state => state.note);
  const user = useSelector(state => state.auth.data);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  
  // Download hook
  const { triggerDownload, downloadingState } = useNoteDownload();
  const thisDownload = downloadingState[currentNote?._id];
  
  // Reading states
  const [readingTime, setReadingTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStudyTools, setShowStudyTools] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { trackView, trackClick, trackDownload, trackBookmark, trackRate } = useNoteTracking();
  const [note, setNote] = useState(null);

  // Get PDF URL
  const pdfUrl = currentNote?.fileDetails?.secure_url;

  // Build PDF viewer URL with hidden toolbar
  const buildPdfViewerUrl = (url) => {
    if (!url) return '';
    return `${url}#toolbar=0&navpanes=0&scrollbar=1&zoom=page-fit`;
  };

  // Get theme colors based on category
  const getTheme = () => {
    switch (currentNote?.category) {
      case 'PYQ':
        return {
          gradient: 'from-red-500 to-pink-500',
          bgGradient: 'from-red-900/20 to-pink-900/20',
          borderColor: 'border-red-500/30',
          particleColors: 'from-red-400 via-pink-400 to-red-400',
          badge: '🎯 PYQ',
          primary: 'red-500',
          secondary: 'pink-500'
        };
      case 'Important Question':
        return {
          gradient: 'from-yellow-500 to-orange-500',
          bgGradient: 'from-yellow-900/20 to-orange-900/20',
          borderColor: 'border-yellow-500/30',
          particleColors: 'from-yellow-400 via-orange-400 to-yellow-400',
          badge: '⭐ Important',
          primary: 'yellow-500',
          secondary: 'orange-500'
        };
      default:
        return {
          gradient: 'from-blue-500 to-purple-500',
          bgGradient: 'from-blue-900/20 to-purple-900/20',
          borderColor: 'border-blue-500/30',
          particleColors: 'from-blue-400 via-purple-400 to-pink-400',
          badge: '📚 Notes',
          primary: 'blue-500',
          secondary: 'purple-500'
        };
    }
  };

  const theme = getTheme();

  // Check if bookmarked
  const isBookmarked = currentNote?.bookmarkedBy?.some(bookmark => 
    typeof bookmark === 'string' ? bookmark === user?._id : bookmark.user === user?._id
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  // Fetch note data
  useEffect(() => {
    if (id) {
      dispatch(getNote(id));
    }
    return () => {
      dispatch(clearCurrentNote());
    };
  }, [id, dispatch]);

  // Reading time tracker
  useEffect(() => {
    if (currentNote && !loading && pdfUrl) {
      const timer = setInterval(() => {
        setReadingTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentNote, loading, pdfUrl]);
// import { useEffect } from "react";
// import { setActiveResource, clearActiveResource } from "../../UTILS/activeResource";

useEffect(() => {
  if (!id) return;
    setActiveResource({
    type: "NOTE",
    id: id
  });
}, [id]);
  // Format reading time
  const formatReadingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle bookmark
  const handleBookmark = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    trackBookmark(currentNote._id);
    dispatch(toggleBookmark(currentNote._id));
  };

  // Handle download
  const handleDownload = async () => {
    trackDownload(currentNote._id);
    await triggerDownload(currentNote);
  };

  // useEffect(() => {
  //   // When note loads
  //   if (currentNote) {
  //     trackView(currentNote._id, currentNote.title);
  //   }
  // }, [currentNote]);

  // Loading state
  // ✅ Step 1: Initialize state FIRST (top of component)
  
const [showPlannerToast, setShowPlannerToast] = useState(false);
const [hasShownToastToday, setHasShownToastToday] = useState(false);
// ✅ ADD THIS FUNCTION
  const markPlannerToastAsShown = () => {
    const today = new Date().toDateString();
    localStorage.setItem('plannerToastShownDate', today);
    setHasShownToastToday(true);
  };
// ✅ Step 2: Reading time tracker
useEffect(() => {
  if (!currentNote || loading || !pdfUrl) return;

  const timer = setInterval(() => {
    setReadingTime(prev => prev + 1);
  }, 1000);

  return () => clearInterval(timer);
}, [currentNote, loading, pdfUrl]);

// ✅ Step 3: Show toast after 30 seconds
useEffect(() => {
  if (readingTime === 30 && !hasShownToastToday) {
    setShowPlannerToast(true);
    setHasShownToastToday(true);
  }
}, [readingTime, hasShownToastToday]);

// ✅ Step 4: Auto-dismiss after 15 seconds
useEffect(() => {
  if (!showPlannerToast) return;

  const timer = setTimeout(() => {
    setShowPlannerToast(false);
  }, 15000);

  return () => clearTimeout(timer);
}, [showPlannerToast]);
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative h-12 w-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !currentNote || !pdfUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {error ? 'Failed to load note' : !currentNote ? 'Note not found' : 'PDF file not available'}
          </h2>
          <p className="text-gray-400 mb-6">
            {error || (!currentNote ? 'The note you\'re looking for doesn\'t exist.' : 'The PDF file for this note is not available.')}
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
            <button 
              onClick={() => navigate('/notes')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Browse Notes
            </button>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className={`min-h-screen bg-black text-white transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Floating Background Particles with Theme Colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${theme.particleColors} opacity-30 animate-float-random`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Desktop Header */}
      {!isMobile && !isFullscreen && (
        <div className={`bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-2xl border-b ${theme.borderColor} sticky top-0 z-40`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Navigation */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate(-1)}
                  className="group p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/10"
                >
                  <svg className="w-6 h-6 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="border-l border-white/20 pl-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 bg-gradient-to-r ${theme.gradient} text-white text-xs font-medium rounded-full`}>
                      {theme.badge}
                    </span>
                    <h1 className="text-xl font-bold text-white line-clamp-1">{currentNote?.title}</h1>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                    <span>📖 Reading Mode</span>
                    <span>⏱ {formatReadingTime(readingTime)}</span>
                    <span>👤 {currentNote?.uploadedBy?.fullName}</span>
                  </div>
                </div>
              </div>

              {/* Right side - Controls */}
              <div className="flex items-center space-x-3">
                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={thisDownload?.status === 'starting'}
                  className={`px-3 py-2 rounded-xl transition-all duration-300 border flex items-center space-x-2 ${
                    thisDownload?.status === 'complete' || thisDownload?.status === 'exists'
                      ? 'bg-green-600/80 border-green-500/60 text-white hover:bg-green-500'
                      : thisDownload?.status === 'starting'
                      ? 'bg-blue-600/80 border-blue-500/60 text-white cursor-wait'
                      : 'bg-white/10 border-white/10 hover:bg-white/20 text-white'
                  }`}
                  title={thisDownload?.status === 'complete' ? 'Downloaded successfully' : 'Download PDF'}
                >
                  {thisDownload?.status === 'starting' ? (
                    <>
                      <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                      <span className="text-xs font-semibold hidden sm:inline">Downloading...</span>
                    </>
                  ) : thisDownload?.status === 'complete' ? (
                    <>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-semibold hidden sm:inline">Downloaded</span>
                    </>
                  ) : thisDownload?.status === 'exists' ? (
                    <>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-semibold hidden sm:inline">Already Downloaded</span>
                    </>
                  ) : thisDownload?.status === 'error' ? (
                    <>
                      <svg className="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-semibold hidden sm:inline">Retry</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-down-icon lucide-circle-arrow-down"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg>
                      <span className="text-xs font-semibold hidden sm:inline">Download</span>
                    </>
                  )}
                </button>

                {/* Bookmark */}
                <button
                  onClick={handleBookmark}
                  disabled={bookmarking}
                  className={`p-2 rounded-xl transition-all duration-300 border disabled:opacity-50 ${
                    isBookmarked 
                      ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' 
                      : 'bg-white/10 border-white/10 hover:bg-white/20'
                  }`}
                >
                  {bookmarking ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-500"></div>
                  ) : (
                    <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                </button>

                {/* Study Tools Toggle */}
                <button
                  onClick={() => setShowStudyTools(!showStudyTools)}
                  className={`p-2 rounded-xl transition-all duration-300 border ${
                    showStudyTools 
                      ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' 
                      : 'bg-white/10 border-white/10 hover:bg-white/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </button>

                {/* Fullscreen */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{showPlannerToast && (
  <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div
      className="
        relative
        bg-zinc-900
        border border-zinc-700/60
        rounded-2xl
        p-5
        shadow-2xl
        space-y-4
      "
    >
      {/* Close */}
      <button
        onClick={() => setShowPlannerToast(false)}
        className="
          absolute top-3 right-3
          p-1.5
          text-zinc-500 hover:text-zinc-300
          transition-colors
        "
        aria-label="Close"
      >
        ✕
      </button>

      {/* Content */}
      <div className="pr-8 space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
          Study tip
        </p>

        <h3 className="text-base font-semibold text-zinc-100 leading-snug">
          Studying {currentNote?.subject || "this subject"}?
        </h3>

        <p className="text-sm text-zinc-400 leading-relaxed">
          Planner organizes chapters, notes, PYQs and questions in the right order —
          complete one unit, then move forward without confusion.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => {
            markPlannerToastAsShown();
            navigate("/planner");
          }}
          className="
            flex-1 px-4 py-2.5
            bg-[#9CA3AF] hover:bg-white text-black
            rounded-lg
            font-semibold text-sm
            transition-all active:scale-95
          "
        >
          Organize this subject
        </button>

        <button
          onClick={() => setShowPlannerToast(false)}
          className="
            flex-1 px-4 py-2.5
            bg-zinc-800 text-zinc-400
            hover:bg-zinc-700 hover:text-zinc-200
            rounded-lg
            font-semibold text-sm
            transition-all active:scale-95
          "
        >
          Later
        </button>
      </div>
    </div>
  </div>
)}


      {/* Mobile Header */}
      {isMobile && !isFullscreen && (
        <div className={`bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border-b ${theme.borderColor} sticky top-0 z-40`}>
          <div className="px-3 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate(-1)}
                  className="p-2 bg-white/10 rounded-lg border border-white/10"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 bg-gradient-to-r ${theme.gradient} text-white text-xs font-medium rounded-full`}>
                      {theme.badge}
                    </span>
                  </div>
                  <h1 className="text-sm font-bold text-white truncate max-w-[180px]">{currentNote?.title}</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-400">
                  ⏱ {formatReadingTime(readingTime)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Enhanced iframe with controls */}
      <div className="flex h-screen">
        {/* PDF Viewer */}
        <div className={`flex-1 ${isFullscreen ? 'h-screen' : isMobile ? 'h-[calc(100vh-120px)]' : 'h-[calc(100vh-80px)]'}`}>
          <div className="h-full flex flex-col">
            {/* PDF Document */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
              <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden relative">
                <iframe
                  src={buildPdfViewerUrl(pdfUrl)}
                  className="w-full h-full border-0"
                  title={currentNote?.title}
                  style={{ minHeight: '100%' }}
                />
                
                {/* Custom Download Button (replaces "Open in New Tab") */}
                <div className="absolute bottom-4 right-4 z-10">
                  <button
                    onClick={handleDownload}
                    disabled={thisDownload?.status === 'starting'}
                    className={`text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-1 font-semibold border ${
                      thisDownload?.status === 'complete' || thisDownload?.status === 'exists'
                        ? 'bg-green-600/90 hover:bg-green-500/90 border-green-500/60'
                        : thisDownload?.status === 'starting'
                        ? 'bg-blue-600/90 border-blue-500/60 cursor-wait'
                        : 'bg-black/80 hover:bg-black/90 border-white/30 hover:border-white/50'
                    }`}
                  >
                    {thisDownload?.status === 'starting' ? (
                      <>
                        <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        <span>Downloading...</span>
                      </>
                    ) : thisDownload?.status === 'complete' || thisDownload?.status === 'exists' ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{thisDownload?.status === 'complete' ? 'Downloaded' : 'Already Downloaded'}</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-down-icon lucide-circle-arrow-down"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg>
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Helper text */}
                {/* <div className="absolute bottom-16 right-4 bg-black/70 text-white text-xs px-3 py-2 rounded-lg border border-white/20 max-w-xs z-10">
                  ℹ️ Use the Download button to  this note!
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Study Tools Sidebar */}
        {!isMobile && showStudyTools && !isFullscreen && (
          <div className="w-80 bg-gray-900/50 backdrop-blur-2xl border-l border-white/10 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Study Session Info */}
              <div className={`bg-gradient-to-br ${theme.bgGradient} backdrop-blur-xl border ${theme.borderColor} rounded-xl p-4`}>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Study Session
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reading Time:</span>
                    <span className="text-blue-400 font-mono">{formatReadingTime(readingTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Document:</span>
                    <span className="text-white">{currentNote?.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subject:</span>
                    <span className="text-purple-400">{currentNote?.subject}</span>
                  </div>
                </div>
              </div>

              {/* Quick Notes */}
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 backdrop-blur-xl border border-green-500/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Quick Notes
                </h3>
                <textarea
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="Take notes while reading..."
                  className="w-full h-32 bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-green-400/50"
                />
                <button className="mt-2 w-full bg-green-500/20 border border-green-500/30 text-green-300 py-2 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
                  Save Notes
                </button>
              </div>

              {/* Download Section */}
              <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/20 backdrop-blur-xl border border-indigo-500/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-down-icon lucide-circle-arrow-down"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg>
                  Download PDF
                </h3>
                {/* <p className="text-xs text-gray-300 mb-3">
                  Download this note to your device
                </p> */}
                <button 
                  onClick={handleDownload}
                  disabled={thisDownload?.status === 'starting'}
                  className={`w-full py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    thisDownload?.status === 'complete' || thisDownload?.status === 'exists'
                      ? 'bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-600/30'
                      : thisDownload?.status === 'starting'
                      ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300 cursor-wait'
                      : 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30'
                  }`}
                >
                  {thisDownload?.status === 'starting' ? (
                    <>
                      <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                      <span>Downloading...</span>
                    </>
                  ) : thisDownload?.status === 'complete' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Downloaded!</span>
                    </>
                  ) : thisDownload?.status === 'exists' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Already Downloaded</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16M12 8v8m0 0l-3-3m3 3l3-3" />
                      </svg>
                      <span>Download Now</span>
                    </>
                  )}
                </button>
              </div>

              {/* Study Tools */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Study Tools</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-gray-300">Highlight Text</span>
                  </button>
                  <button 
                    onClick={handleBookmark}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span className="text-gray-300">{isBookmarked ? 'Bookmarked' : 'Add Bookmark'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Speed Dial Navigation */}
      {isMobile && !isFullscreen && (
        <>
          <div className="fixed bottom-6 right-4 z-50">
            <div className="relative">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`w-14 h-14 bg-gradient-to-r ${theme.gradient} rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 ${showMobileMenu ? 'rotate-45 scale-110' : 'hover:scale-110'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>

              {showMobileMenu && (
                <div className="absolute bottom-16 right-0 space-y-3">
                  {/* Download */}
                  <button
                    onClick={() => {
                      handleDownload();
                      setShowMobileMenu(false);
                    }}
                    className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transform transition-all duration-300 animate-fade-in-up ${
                      thisDownload?.status === 'complete' || thisDownload?.status === 'exists'
                        ? 'bg-green-600'
                        : 'bg-indigo-600'
                    }`}
                    style={{ animationDelay: '0.1s' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16M12 8v8m0 0l-3-3m3 3l3-3" />
                    </svg>
                  </button>

                  {/* Study Tools */}
                  <button
                    onClick={() => {
                      setShowStudyTools(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-12 h-12 bg-purple-600 rounded-full shadow-lg flex items-center justify-center text-white transform transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: '0.2s' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </button>

                  {/* Bookmark */}
                  <button
                    onClick={() => {
                      handleBookmark();
                      setShowMobileMenu(false);
                    }}
                    className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transform transition-all duration-300 animate-fade-in-up ${
                      isBookmarked ? 'bg-yellow-600' : 'bg-blue-600'
                    }`}
                    style={{ animationDelay: '0.3s' }}
                  >
                    <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={() => {
                      setIsFullscreen(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-12 h-12 bg-gray-600 rounded-full shadow-lg flex items-center justify-center text-white transform transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: '0.4s' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile Study Tools Bottom Sheet */}
      {isMobile && showStudyTools && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowStudyTools(false)}></div>
          <div className="relative w-full bg-gray-900 rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Study Tools & Download</h2>
              <button 
                onClick={() => setShowStudyTools(false)}
                className="p-2 bg-white/10 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Study Session Info */}
            <div className={`bg-gradient-to-br ${theme.bgGradient} backdrop-blur-xl border ${theme.borderColor} rounded-xl p-4 mb-6`}>
              <h3 className="text-lg font-semibold text-white mb-3">Study Session</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Reading Time:</span>
                  <div className="text-blue-400 font-mono font-bold">{formatReadingTime(readingTime)}</div>
                </div>
                <div>
                  <span className="text-gray-400">Subject:</span>
                  <div className="text-white">{currentNote?.subject}</div>
                </div>
                <div>
                  <span className="text-gray-400">Category:</span>
                  <div className="text-white">{currentNote?.category}</div>
                </div>
                <div>
                  <span className="text-gray-400">Semester:</span>
                  <div className="text-white">{currentNote?.semester}</div>
                </div>
              </div>
            </div>

            {/* Download Section */}
            <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/20 border border-indigo-500/20 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-down-icon lucide-circle-arrow-down"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg>
                Download This Note
              </h3>
              {/* <p className="text-xs text-gray-300 mb-3">Support this resource by downloading!</p> */}
              <button
                onClick={() => {
                  handleDownload();
                  setShowStudyTools(false);
                }}
                disabled={thisDownload?.status === 'starting'}
                className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  thisDownload?.status === 'complete' || thisDownload?.status === 'exists'
                    ? 'bg-green-600 text-white hover:bg-green-500'
                    : thisDownload?.status === 'starting'
                    ? 'bg-blue-600 text-white cursor-wait'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {thisDownload?.status === 'starting' ? (
                  <>
                    <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    <span>Downloading...</span>
                  </>
                ) : thisDownload?.status === 'complete' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Downloaded!</span>
                  </>
                ) : thisDownload?.status === 'exists' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Already Downloaded</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-down-icon lucide-circle-arrow-down"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg>
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Notes */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Quick Notes</h3>
              <textarea
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder="Take notes while reading..."
                className="w-full h-24 bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-green-400/50"
              />
              <button className="mt-2 w-full bg-green-500/20 border border-green-500/30 text-green-300 py-2 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
                Save Notes
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleBookmark}
                className={`p-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  isBookmarked 
                    ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300' 
                    : 'bg-white/10 border border-white/20 text-white'
                }`}
              >
                <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Exit Hint */}
      {isFullscreen && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl rounded-full px-4 py-2 text-sm text-white border border-white/20 z-10">
          Press <kbd className="bg-white/20 px-2 py-1 rounded text-xs">Esc</kbd> to exit fullscreen
        </div>
      )}
    </div>
  );
};

export default ReadNote;