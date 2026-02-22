// CONTEXT/HomepageTrackerContext.jsx — fixed version
import { createContext, useContext } from "react";
import { useHomepageTracker } from "../hooks/useHomepageTracker";
// ✅ Default value shows clear warning instead of silently no-op
const HomepageTrackerContext = createContext(null);

export function HomepageTrackerProvider({ children }) {
  const tracker = useHomepageTracker();
  return (
    <HomepageTrackerContext.Provider value={tracker}>
      {children}
    </HomepageTrackerContext.Provider>
  );
}

export function useTracker() {
  const ctx = useContext(HomepageTrackerContext);

  // ✅ Warn in dev if used outside provider — catches wiring mistakes fast
  if (!ctx) {
    if (import.meta.env.DEV) {
      console.warn("⚠️ [useTracker] used outside <HomepageTrackerProvider>. Events will be lost.");
    }
    return { trackImpression: () => {}, trackClick: () => {} };
  }

  return ctx;
}
