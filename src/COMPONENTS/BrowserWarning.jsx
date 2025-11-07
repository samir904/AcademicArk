import React, { useState, useEffect } from 'react';
import { detectBrowser } from '../HELPERS/browserDetect';

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function BrowserWarning() {
  const [isVisible, setIsVisible] = useState(false);
  const [browser, setBrowser] = useState(null);

  useEffect(() => {
    const { isProblematicBrowser, browserName } = detectBrowser();
    if (isProblematicBrowser) {
      setIsVisible(true);
      setBrowser(browserName);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-3 flex items-center justify-between">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-sm sm:text-base">
              {browser} may have issues with Google Sign-In
            </p>
            <p className="text-xs sm:text-sm text-amber-100">
              We recommend using email sign-in or switching to Chrome/Firefox for better compatibility
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 p-2 hover:bg-amber-800 rounded-lg transition"
          aria-label="Close"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
