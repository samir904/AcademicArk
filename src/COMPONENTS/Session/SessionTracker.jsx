// =====================================
// 📊 COMPONENTS/SessionTracker.jsx
// =====================================

import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startSession,
  endSession,
  pingSession,
  trackPageView,
  trackNoteInteraction,
  trackClickEvent,
  getActiveSession,
  clearSession,
  trackPageExit
} from "../../REDUX/Slices/sessionSlice";
import { useLocation } from "react-router-dom";
import { clearActiveResource, getActiveResource } from "../../UTILS/activeResource";
// import { showToast } from "../HELPERS/Toaster";

/**
 * SESSION TRACKER HOOK
 * Manages session lifecycle and tracking
 * Must be placed in App.jsx or root component
 */
const useSessionTracker = () => {
  // =====================================
  // 🔍 REFERRER DETECTION (industry standard)
  // =====================================
  const getReferrerInfo = () => {
    const referrer = document.referrer || "";
    let source = "DIRECT";

    if (referrer.includes("google")) source = "SEARCH";
    else if (referrer.includes("bing")) source = "SEARCH";
    else if (referrer.includes("yahoo")) source = "SEARCH";
    else if (referrer.includes("whatsapp")) source = "SOCIAL";
    else if (referrer.includes("facebook")) source = "SOCIAL";
    else if (referrer.includes("instagram")) source = "SOCIAL";
    else if (referrer.includes("twitter")) source = "SOCIAL";

    return {
      referrerSource: source,
      refUrl: referrer || null
    };
  };

  const dispatch = useDispatch();
  const { currentSession, sessionActive, pingInterval } = useSelector(
    (state) => state.session
  );
  const userId = useSelector((state) => state.auth?.user?._id);
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  const scrollDepthRef = useRef(0);
  const lastPingRef = useRef(Date.now());
  const sessionStartedRef = useRef(false);
  const lastClickRef = useRef(0); // ✅ ADD THIS
  const homepageImpressionForVisitRef = useRef(false);
  const currentPageRef = useRef(null);
  const pageEnterTimeRef = useRef(null);
  const lastPageRef = useRef(null);
  const pageExitSentRef = useRef(false);

  const sessionId = useSelector(
    (state) => state.session.currentSession.sessionId
  );
  // const authChecked = useSelector(state => state.auth.authChecked);
  const location = useLocation();
  const referrerInfo = getReferrerInfo();

  const mapPathToPageName = (path) => {
    if (path === "/") return "HOMEPAGE";
    if (path.startsWith("/notes") && path.endsWith("/read")) return "NOTE_READER";
    if (path.startsWith("/notes/")) return "NOTE_DETAIL";
    if (path === "/notes") return "NOTES_LIST";
    if (path === "/bookmarks") return "BOOKMARKS";
    if (path === "/leaderboard") return "LEADERBOARD";
    if (path.startsWith("/video")) return "VIDEOS";
    if (path.startsWith("/profile")) return "PROFILE";
    if(path==='/support') return "SUPPORT";
    if(path==='/planner') return "PLANNER";
    if(path.startsWith('/attendance')) return 'ATTENDANCE';
    if(path==='/myspace')return 'MYSPACE';
    if(path==='/downloads')return 'DOWNLOADS';
    if(path.startsWith('/search'))return 'SEARCH'
    if(path==='/admin') return 'ADMIN'
    return "OTHER";
  };

  // ✅ START SESSION on login
  useEffect(() => {
    // if (!authChecked) return; // ⛔ wait for auth resolution
    // if (sessionStartedRef.current) return;
    // console.log('auth check',authChecked)
    if (isLoggedIn && !sessionActive && !sessionStartedRef.current) {
      sessionStartedRef.current = true;
      console.log("🚀 Starting new session...");
//       console.log("Referer header:", req.get("referer"));
// console.log("Origin header:", req.get("origin"));
console.log('-----------referer info------------')
console.log('referer info',...referrerInfo);
      dispatch(startSession({
        ...referrerInfo,
        entryPage: mapPathToPageName(location.pathname)
      }));
    }
  }, [isLoggedIn, userId, dispatch, sessionActive]);

  // ✅ SESSION PING (Keep alive every 5 minutes)
  useEffect(() => {
    if (!sessionActive || !sessionId) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastPingRef.current > 5 * 60 * 1000) {
        // 5 minutes
        console.log("📍 Pinging session...");
        dispatch(pingSession({ sessionId }));
        lastPingRef.current = now;
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [sessionActive, sessionId, dispatch]);

  // ✅ TRACK PAGE VIEWS
  useEffect(() => {
    if (!sessionActive || !sessionId) return;
    const now = Date.now();
    const newPage = mapPathToPageName(location.pathname);
    // 🛑 HARD BLOCK: same page
    if (lastPageRef.current === newPage) return;

    // 🔴 CLOSE PREVIOUS PAGE
    if (currentPageRef.current && pageEnterTimeRef.current) {
      const timeSpent = Math.floor(
        (now - pageEnterTimeRef.current) / 1000
      );
      if (!pageExitSentRef.current) {
        pageExitSentRef.current = true;
        const activeResource = getActiveResource();

        // console.log('active resource at page of sesion tracker when exting page at that time',activeResource)
          // console.log('session tracker page active resource id',activeResource?.id)
          // console.log('session tracker page active resource id',activeResource?.type)
        dispatch(trackPageExit({
          sessionId,
          pageName: currentPageRef.current,
          timeSpent,
          resourceId: activeResource?.id || null,
          resourceType: activeResource?.type || null
        }));
        clearActiveResource();
      }
    }

    // 🟢 OPEN NEW PAGE
    lastPageRef.current = newPage;
    currentPageRef.current = newPage;
    pageEnterTimeRef.current = now;
    // 🔁 RESET page-exit guard for new page
    pageExitSentRef.current = false;
    dispatch(
      trackPageView({
        sessionId,
        pageName: mapPathToPageName(location.pathname),
        scrollDepth: scrollDepthRef.current,
        metadata: {
          path: location.pathname,
        },
      })
    );
    /* =====================================
     ✅ HOMEPAGE IMPRESSIONS (CORRECT PLACE)
     ===================================== */
    // const newPage = mapPathToPageName(location.pathname);

    // 🔁 RESET when leaving homepage
    if (newPage !== "HOMEPAGE") {
      homepageImpressionForVisitRef.current = false;
    }

    // 🔥 FIRE ONCE PER HOMEPAGE VISIT
    if (newPage === "HOMEPAGE" && !homepageImpressionForVisitRef.current) {
      homepageImpressionForVisitRef.current = true;
      dispatch(trackClickEvent({
        sessionId,
        clickType: "recommendedNote",
        impression: true,
        section: "HOMEPAGE_RECOMMENDED"
      }));

      dispatch(trackClickEvent({
        sessionId,
        clickType: "trendingNote",
        impression: true,
        section: "HOMEPAGE_TRENDING"
      }));

      dispatch(trackClickEvent({
        sessionId,
        clickType: "continueWhere",
        impression: true,
        section: "HOMEPAGE_CONTINUE_WHERE"
      }));
    }
  }, [location.pathname, sessionActive, sessionId, dispatch]);

  // ✅ TRACK SCROLL DEPTH
  useEffect(() => {
    if (!sessionActive) return;

    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      scrollDepthRef.current = Math.max(
        scrollDepthRef.current,
        scrollPercentage
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sessionActive]);

  // ✅ TRACK CLICKS
  useEffect(() => {
    if (!sessionActive || !sessionId) return;

    const handleClick = (e) => {
      const now = Date.now();

      // ✅ THROTTLE: ignore rapid clicks
      if (now - lastClickRef.current < 800) return;
      lastClickRef.current = now;

      // ✅ Only track meaningful elements
      const target = e.target.closest("a, button");
      if (!target) return;

      dispatch(
        trackClickEvent({
          sessionId,
          elementType: target.tagName,
          elementText: target.textContent?.slice(0, 50),
          elementId: target.id || null,
          elementClass: target.className || null,
          timestamp: new Date().toISOString(),
        })
      );
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [sessionActive, sessionId, dispatch]);



  // ✅ HANDLE UNLOAD (End session when leaving)
  useEffect(() => {
    const handleUnload = () => {
      if (!sessionActive || !currentPageRef.current) return;

      const timeSpent = Math.floor(
        (Date.now() - pageEnterTimeRef.current) / 1000
      );

      if (!pageExitSentRef.current) {
        pageExitSentRef.current = true;
        const activeResource = getActiveResource();

        navigator.sendBeacon(
          "/session/track/page-exit",
          JSON.stringify({
            sessionId,
            pageName: currentPageRef.current,
            timeSpent,
            resourceId: activeResource?.id || null,
            resourceType: activeResource?.type || null,
            isExitPage: true
          })
        );
      }
      clearActiveResource();

      navigator.sendBeacon(
        "/session/end",
        JSON.stringify({ sessionId })
      );
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [sessionActive]);

  // ✅ RETURN TRACKING FUNCTIONS
  return {
    trackNoteView: (noteId, noteName) => {
      dispatch(
        trackNoteInteraction({
          noteId,
          noteName,
          sessionId,
          interactionType: "viewed",
          timestamp: new Date().toISOString()
        })
      );
    },

    trackNoteClick: (noteId) => {
      dispatch(
        trackNoteInteraction({
          noteId,
          sessionId,
          interactionType: "clicked",
          timestamp: new Date().toISOString()
        })
      );
    },

    trackNoteDownload: (noteId) => {
      dispatch(
        trackNoteInteraction({
          sessionId,
          noteId,
          interactionType: "downloaded",
          timestamp: new Date().toISOString()
        })
      );
    },

    trackNoteBookmark: (noteId) => {
      dispatch(
        trackNoteInteraction({
          sessionId,
          noteId,
          interactionType: "bookmarked",
          timestamp: new Date().toISOString()
        })
      );
    },

    trackNoteRate: (noteId, rating) => {
      dispatch(
        trackNoteInteraction({
          sessionId,
          noteId,
          interactionType: "rated",
          rating,
          timestamp: new Date().toISOString()
        })
      );
    },
    // ✅ 🔥 ADD THIS BLOCK
    trackClickEvent: (payload) => {
      dispatch(trackClickEvent(payload));
    },

    endUserSession: () => {
      dispatch(endSession());
      sessionStartedRef.current = false;
    }
  };
};

/**
 * SESSION ANALYTICS DASHBOARD COMPONENT
 */
// const SessionAnalyticsDashboard = ({ showAnalytics, onClose }) => {
//   const { currentSession, analytics, pageMetrics, analyticsLoading } =
//     useSelector((state) => state.session);

//   if (!showAnalytics) return null;

//   return (
//     <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl p-6 max-h-96 overflow-y-auto z-50">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-bold text-gray-900">
//           📊 Session Analytics
//         </h3>
//         <button
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700 text-xl"
//         >
//           ✕
//         </button>
//       </div>

//       {analyticsLoading && (
//         <div className="text-center py-4">
//           <div className="inline-block animate-spin">⟳</div>
//           <p className="text-sm text-gray-500 mt-2">Loading analytics...</p>
//         </div>
//       )}

//       {!analyticsLoading && (
//         <>
//           {/* Current Session Stats */}
//           <div className="space-y-4">
//             <div className="border-b pb-4">
//               <h4 className="font-semibold text-sm text-gray-700 mb-3">
//                 Current Session
//               </h4>
//               <div className="grid grid-cols-2 gap-2 text-sm">
//                 <div>
//                   <p className="text-gray-500">Status</p>
//                   <p className="font-medium text-green-600">
//                     {currentSession.status}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Duration</p>
//                   <p className="font-medium">
//                     {Math.floor(currentSession.duration / 60)}m
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Page Views</p>
//                   <p className="font-medium">
//                     {currentSession.engagement.pageViews}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Clicks</p>
//                   <p className="font-medium">
//                     {currentSession.engagement.totalClicks}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Engagement Metrics */}
//             <div className="border-b pb-4">
//               <h4 className="font-semibold text-sm text-gray-700 mb-3">
//                 Engagement
//               </h4>
//               <div className="space-y-2 text-sm">
//                 <div>
//                   <div className="flex justify-between mb-1">
//                     <span className="text-gray-600">Engagement Score</span>
//                     <span className="font-bold text-blue-600">
//                       {analytics.engagementScore || 0}/100
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-blue-600 h-2 rounded-full transition-all"
//                       style={{
//                         width: `${(analytics.engagementScore || 0) / 1}%`
//                       }}
//                     ></div>
//                   </div>
//                 </div>

//                 <div className="flex justify-between text-gray-600">
//                   <span>Scroll Depth</span>
//                   <span className="font-medium">
//                     {Math.round(currentSession.engagement.maxScrollDepth)}%
//                   </span>
//                 </div>

//                 <div className="flex justify-between text-gray-600">
//                   <span>CTR</span>
//                   <span className="font-medium">
//                     {currentSession.clickThroughData?.ctr || 0}%
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Note Interactions */}
//             <div className="border-b pb-4">
//               <h4 className="font-semibold text-sm text-gray-700 mb-3">
//                 Note Interactions
//               </h4>
//               <div className="space-y-1 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">👁️ Viewed</span>
//                   <span className="font-medium">
//                     {currentSession.engagement.noteInteractions.viewed}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">🔗 Clicked</span>
//                   <span className="font-medium">
//                     {currentSession.engagement.noteInteractions.clicked}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">📥 Downloaded</span>
//                   <span className="font-medium">
//                     {currentSession.engagement.noteInteractions.downloaded}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">⭐ Rated</span>
//                   <span className="font-medium">
//                     {currentSession.engagement.noteInteractions.rated}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Device Info */}
//             {currentSession.deviceInfo && (
//               <div className="text-sm">
//                 <h4 className="font-semibold text-gray-700 mb-2">Device</h4>
//                 <div className="space-y-1">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Type</span>
//                     <span className="font-medium">
//                       {currentSession.deviceInfo.deviceType}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Browser</span>
//                     <span className="font-medium">
//                       {currentSession.deviceInfo.browser}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

/**
 * SESSION STATUS COMPONENT
 */
// const SessionStatus = ({ onToggleAnalytics }) => {
//   const { currentSession, sessionActive, loading } = useSelector(
//     (state) => state.session
//   );

//   if (!sessionActive) return null;

//   return (
//     <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-40">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
//             <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
//           </div>
//           <div>
//             <p className="text-xs font-semibold text-gray-600">Session Active</p>
//             <p className="text-sm font-medium text-gray-900">
//               {Math.floor(currentSession.duration / 60)}m{" "}
//               {currentSession.duration % 60}s
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={onToggleAnalytics}
//           className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded hover:bg-blue-200 transition"
//         >
//           📊
//         </button>
//       </div>
//     </div>
//   );
// };

/**
 * MAIN EXPORT - Session Tracking Component
 */
const SessionTracker = () => {
  const dispatch = useDispatch();
  const { showAnalytics } = useSelector((state) => state.session);
  const trackingFunctions = useSessionTracker();

  const handleToggleAnalytics = () => {
    dispatch(toggleAnalyticsView());
  };

  return (
    <>
      {/* <SessionStatus onToggleAnalytics={handleToggleAnalytics} /> */}
      {/* <SessionAnalyticsDashboard
        showAnalytics={showAnalytics}
        onClose={handleToggleAnalytics}
      /> */}
    </>
  );
};

export { useSessionTracker, SessionTracker };
export default SessionTracker;