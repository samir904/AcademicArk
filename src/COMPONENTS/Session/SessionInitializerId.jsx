import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const generateSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default function SessionInitializerId() {
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const hasInitialized = useRef(false);  // ✅ ADD: Prevent double initialization

  useEffect(() => {
    // ✅ Prevent double initialization in React StrictMode
    if (hasInitialized.current) {
      console.log('⏭️ Session already initialized, skipping');
      return;
    }

    const SESSION_EXPIRY_HOURS = 24;
    
    let sessionId = localStorage.getItem("sessionId");
    const sessionStart = localStorage.getItem("sessionStart");

    // ✅ Check if session expired
    const isSessionExpired = () => {
      if (!sessionStart) return true;
      
      const startTime = new Date(sessionStart).getTime();
      const now = Date.now();
      const hoursPassed = (now - startTime) / (1000 * 60 * 60);
      
      return hoursPassed > SESSION_EXPIRY_HOURS;
    };

    // ✅ Create new session if doesn't exist OR expired
    if (!sessionId || isSessionExpired()) {
      if (isSessionExpired()) {
        console.log("⏰ Session expired, creating new one");
      }
      
      sessionId = generateSessionId();
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("sessionStart", new Date().toISOString());
      console.log("🆕 New session created:", sessionId);
    } else {
      console.log("♻️ Existing session:", sessionId);
      
      // Log time remaining
      const startTime = new Date(sessionStart).getTime();
      const now = Date.now();
      const hoursRemaining = SESSION_EXPIRY_HOURS - ((now - startTime) / (1000 * 60 * 60));
      console.log(`⏳ Session expires in ${hoursRemaining.toFixed(1)} hours`);
    }

    hasInitialized.current = true;  // ✅ Mark as initialized
  }, []);  // ✅ Empty dependency array - run once only

  // ✅ Clear session on logout
  useEffect(() => {
    if (isLoggedIn === false) {
      const currentSessionId = localStorage.getItem("sessionId");
      
      if (currentSessionId) {
        console.log("🔴 User logged out, regenerating session ID");
        
        const newSessionId = generateSessionId();
        localStorage.setItem("sessionId", newSessionId);
        localStorage.setItem("sessionStart", new Date().toISOString());
        
        console.log("🆕 New anonymous session:", newSessionId);
        hasInitialized.current = true;  // ✅ Mark new session as initialized
      }
    }
  }, [isLoggedIn]);

  return null;
}
