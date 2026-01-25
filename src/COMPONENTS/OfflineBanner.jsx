import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      // Show banner when offline
      setShowBanner(true);
      console.log('📱 Showing offline banner');
    } else {
      // Hide banner when online
      setShowBanner(false);
      console.log('📱 Hiding offline banner');
    }
  }, [isOnline]);

  if (!showBanner) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 mx-4">
      {/* Offline Alert Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl shadow-2xl overflow-hidden">
        
        {/* Top border accent */}
        <div className="h-1 bg-gradient-to-r from-orange-400 to-red-400"></div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          
          {/* Left: Icon & Message */}
          <div className="flex items-start gap-3 flex-1">
            
            {/* Animated warning icon */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="animate-pulse">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="flex-1">
              <h3 className="font-bold text-sm sm:text-base mb-1">
                🌐 No Internet Connection
              </h3>
              <p className="text-xs sm:text-sm text-orange-100">
                You're offline! But don't worry - you can still view your downloaded PDF notes.
              </p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            
            {/* View Downloads Button */}
            <button
              onClick={() => navigate('/downloads')}
              className="px-3 sm:px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200 text-xs sm:text-sm active:scale-95 whitespace-nowrap"
            >
              📥 View Downloads
            </button>

            {/* Close Button */}
            <button
              onClick={() => setShowBanner(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 flex-shrink-0"
              title="Dismiss"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineBanner;
