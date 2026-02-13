import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {UAParser} from "ua-parser-js";
import { startSession } from "../../REDUX/Slices/sessionSlice.v2";

const SessionInitializer = () => {
  const dispatch = useDispatch();
  const sessionId = useSelector((state) => state.session.sessionId);
const base_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5014/api/v1";

  const hasEndedRef = useRef(false);

  // 🔹 Start Session (only once)
  useEffect(() => {
    const parser = new UAParser();
    const result = parser.getResult();

    dispatch(
      startSession({
        device: {
          type: result.device.type || "desktop",
          brand: result.device.vendor || ""
        },
        os: result.os,
        browser: result.browser,
        referrer: document.referrer,
        entryPage: window.location.pathname
      })
    );
  }, [dispatch]);

  // 🔹 Handle Session End (Reliable)
  useEffect(() => {
    if (!sessionId) return;

    const sendSessionEnd = () => {
      if (hasEndedRef.current) return; // prevent duplicate calls
      hasEndedRef.current = true;

      const data = JSON.stringify({
        sessionId,
        exitPage: window.location.pathname
      });

      navigator.sendBeacon(
        `${base_url}/sessionV2/end`,
        data
      );
    };

    // Desktop close / refresh
    window.addEventListener("beforeunload", sendSessionEnd);

    // Mobile background / tab switch
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        sendSessionEnd();
      }
    });

    return () => {
      window.removeEventListener("beforeunload", sendSessionEnd);
    };

  }, [sessionId]);

  return null;
};

export default SessionInitializer;
