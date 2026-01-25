import React, { useState, useEffect } from 'react';

export default function CookieWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user came from Google OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const googleAuth = urlParams.get('googleAuth');

    // Check if cookies are blocked
    const testCookie = () => {
      document.cookie = 'testcookie=1; SameSite=None; Secure';
      const cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
      document.cookie = 'testcookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      return cookieEnabled;
    };

    if (googleAuth === 'success' && !testCookie()) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🍪</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Third-Party Cookies Blocked
          </h2>
          <p className="text-gray-400">
            Your browser is blocking third-party cookies. Please enable them to use Google Sign-In.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-black/40 rounded-lg p-4 text-left">
            <p className="text-sm font-semibold text-white mb-2">Chrome/Brave:</p>
            <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
              <li>Click the lock icon in the address bar</li>
              <li>Click "Site settings" or "Cookies"</li>
              <li>Allow third-party cookies for this site</li>
            </ol>
          </div>

          <div className="bg-black/40 rounded-lg p-4 text-left">
            <p className="text-sm font-semibold text-white mb-2">Safari:</p>
            <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
              <li>Go to Settings → Safari</li>
              <li>Disable "Prevent Cross-Site Tracking"</li>
              <li>Reload the page</li>
            </ol>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShow(false)}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
          >
            Close
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
