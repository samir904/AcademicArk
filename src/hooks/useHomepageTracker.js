// HOOKS/useHomepageTracker.js — full fixed version
import { useRef, useCallback, useEffect } from "react";
import { useSelector }    from "react-redux";
import axiosInstance      from "../HELPERS/axiosInstance";

export function useHomepageTracker() {
  const sessionId  = useSelector(s => s.session.currentSession?.sessionId);
  const deviceType = useSelector(
    s => s.session.currentSession?.deviceInfo?.deviceType || "DESKTOP"
  );

  const queue      = useRef([]);
  const timer      = useRef(null);
  const sessionRef = useRef(sessionId);
  const deviceRef  = useRef(deviceType);

  useEffect(() => { sessionRef.current = sessionId; }, [sessionId]);
  useEffect(() => { deviceRef.current  = deviceType; }, [deviceType]);

  const flush = useCallback(async () => {
    if (!queue.current.length) return;
    const batch   = [...queue.current];
    queue.current = [];
    try {
      await axiosInstance.post("/home/analytics/event", { events: batch });
    } catch (err) {
      // ✅ Dev logging — silent in prod
      if (import.meta.env.DEV) {
        console.warn("📊 [HomepageTracker] flush failed:", err?.response?.status, err?.message);
      }
      // ✅ Re-queue failed events so they're not lost
      queue.current = [...batch, ...queue.current];
    }
  }, []);

  // ── Flush every 5s + flush on unmount
  useEffect(() => {
    timer.current = setInterval(flush, 5000);
    return () => {
      clearInterval(timer.current);
      flush();
    };
  }, [flush]);

  const trackImpression = useCallback((section) => {
    queue.current.push({
      section,
      eventType:  "IMPRESSION",
      sessionId:  sessionRef.current,
      deviceType: deviceRef.current,
    });
  }, []);

  const trackClick = useCallback((section, clickMeta = {}) => {
    queue.current.push({
      section,
      eventType:  "CLICK",
      sessionId:  sessionRef.current,
      deviceType: deviceRef.current,
      clickMeta,
    });
  }, []);

  return { trackImpression, trackClick };
}
