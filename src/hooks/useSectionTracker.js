// HOOKS/useSectionTracker.js
import { useRef, useCallback } from "react";
import { useTracker } from "../CONTEXT/HomepageTrackerContext";

export function useSectionTracker(sectionName, threshold = 0.3) {
  const { trackImpression } = useTracker();
  const impressed   = useRef(false);
  const observerRef = useRef(null);

  // ✅ Callback ref — fires when element mounts/unmounts
  // Regular useRef + useEffect misses elements that mount after skeleton swap
  const sectionRef = useCallback((el) => {

    // ── Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // ── Element unmounted
    if (!el) return;

    // ── Set up observer on actual DOM element
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !impressed.current) {
          impressed.current = true;
          trackImpression(sectionName);

          if (import.meta.env.DEV) {
            console.log(`📊 [Impression fired] ✅ ${sectionName}`);
          }

          observer.disconnect();
          observerRef.current = null;
        }
      },
      { threshold }
    );

    observer.observe(el);
    observerRef.current = observer;

  // ✅ trackImpression in deps — stable ref from useCallback in tracker
  }, [sectionName, threshold, trackImpression]);

  return sectionRef;
}
