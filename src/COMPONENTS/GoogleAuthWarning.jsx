import React, { useState, useEffect } from 'react';
import { detectBrowser } from '../HELPERS/browserDetect';

const WarningIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

export default function GoogleAuthWarning() {
  const [isProblematic, setIsProblematic] = useState(false);
  const [browserName, setBrowserName] = useState(null);

  useEffect(() => {
    const { isProblematicBrowser, browserName } = detectBrowser();
    setIsProblematic(isProblematicBrowser);
    setBrowserName(browserName);
  }, []);

  if (!isProblematic) return null;

  return (
    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
      <WarningIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-900">
          {browserName} may have compatibility issues
        </p>
        <p className="text-xs text-amber-800 mt-1">
          Google Sign-In works best on Chrome or Firefox. Try using email sign-in instead.
        </p>
      </div>
    </div>
  );
}
