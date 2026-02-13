import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PageTracker = () => {
  const location = useLocation();
  const sessionId = useSelector((state) => state.session.sessionId);
const base_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5014/api/v1";

  const startTimeRef = useRef(null);
  const maxScrollRef = useRef(0);
  const prevPathRef = useRef(null);

  const milestonesRef = useRef({
    25: false,
    50: false,
    75: false,
    100: false
  });

  // 🔥 Scroll tracking with milestones
  useEffect(() => {
    if (!sessionId) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      if (percent > maxScrollRef.current) {
        maxScrollRef.current = percent;
      }

      [25, 50, 75, 100].forEach((milestone) => {
        if (
          percent >= milestone &&
          !milestonesRef.current[milestone]
        ) {
          milestonesRef.current[milestone] = true;

          const payload = JSON.stringify({
            sessionId,
            type: "SCROLL_MILESTONE",
            page: location.pathname,
            metadata: {
              milestone
            }
          });

          navigator.sendBeacon(
            `${base_url}/sessionV2/track/event`,
            payload
          );
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sessionId, location.pathname]);

  // 🔥 Page entry + exit tracking
  useEffect(() => {
    if (!sessionId) return;

    const currentPath = location.pathname;

    const sendPageExit = () => {
      if (!startTimeRef.current) return;

      const timeSpent = Date.now() - startTimeRef.current;

      const payload = JSON.stringify({
        sessionId,
        path: prevPathRef.current,
        timeSpent,
        scrollDepth: maxScrollRef.current
      });

      navigator.sendBeacon(
        `${base_url}/sessionV2/track/page-exit`,
        payload
      );
    };

    if (prevPathRef.current) {
      sendPageExit();
    }

    // Reset values for new page
    startTimeRef.current = Date.now();
    maxScrollRef.current = 0;
    milestonesRef.current = { 25: false, 50: false, 75: false, 100: false };
    prevPathRef.current = currentPath;

  }, [location, sessionId]);

  return null;
};

export default PageTracker;
