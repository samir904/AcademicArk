import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveBanner, dismissBanner } from '../REDUX/Slices/notificationSlice';

const bannerColors = {
  info: 'from-blue-500/10 to-blue-600/10 border-blue-500/30',
  success: 'from-green-500/10 to-green-600/10 border-green-500/30',
  warning: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/30',
  error: 'from-red-500/10 to-red-600/10 border-red-500/30',
};

const bannerIconColors = {
  info: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
};

const bannerIcons = {
  info: '📢',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

export default function NotificationBanner() {
  const dispatch = useDispatch();
  const { activeBanner, dismissedBanners } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(getActiveBanner());
  }, [dispatch]);

  // Don't show if no banner or user dismissed it
  if (!activeBanner || dismissedBanners.includes(activeBanner._id)) {
    return null;
  }

  const handleDismiss = () => {
    dispatch(dismissBanner(activeBanner._id));
  };

  return (
    <>
      {/* Desktop: Bottom Right */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50 animate-slideInRight">
        <div
          className={`
            relative w-96 p-5 rounded-2xl
            bg-gradient-to-br ${bannerColors[activeBanner.type]}
            backdrop-blur-xl border
            shadow-2xl
            transform transition-all duration-300 hover:scale-105
          `}
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors duration-200 group"
            aria-label="Dismiss notification"
          >
            <svg 
              className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="flex items-start space-x-4 pr-6">
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gray-900/30 flex items-center justify-center ${bannerIconColors[activeBanner.type]}`}>
              <span className="text-2xl">{bannerIcons[activeBanner.type]}</span>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg mb-1 leading-tight">
                {activeBanner.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {activeBanner.message}
              </p>

              {/* Optional action button */}
              {activeBanner.actionUrl && (
                <a
                  href={activeBanner.actionUrl}
                  className={`inline-flex items-center space-x-1 mt-3 text-sm font-medium ${bannerIconColors[activeBanner.type]} hover:underline`}
                >
                  <span>Learn more</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Accent bar at bottom */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${
            activeBanner.type === 'info' ? 'from-blue-500 to-blue-600' :
            activeBanner.type === 'success' ? 'from-green-500 to-green-600' :
            activeBanner.type === 'warning' ? 'from-yellow-500 to-yellow-600' :
            'from-red-500 to-red-600'
          }`}></div>
        </div>
      </div>

      {/* Mobile: Centered Card */}
      <div className="md:hidden fixed inset-x-4 bottom-6 z-50 animate-slideInUp">
        <div
          className={`
            relative p-5 rounded-2xl
            bg-gradient-to-br ${bannerColors[activeBanner.type]}
            backdrop-blur-xl border
            shadow-2xl
            max-w-sm mx-auto
          `}
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors duration-200 group"
            aria-label="Dismiss notification"
          >
            <svg 
              className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="pr-6">
            {/* Icon and Title */}
            <div className="flex items-center space-x-3 mb-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gray-900/30 flex items-center justify-center ${bannerIconColors[activeBanner.type]}`}>
                <span className="text-xl">{bannerIcons[activeBanner.type]}</span>
              </div>
              <h3 className="text-white font-semibold text-base leading-tight flex-1">
                {activeBanner.title}
              </h3>
            </div>

            {/* Message */}
            <p className="text-gray-300 text-sm leading-relaxed pl-13">
              {activeBanner.message}
            </p>

            {/* Optional action button */}
            {activeBanner.actionUrl && (
              <a
                href={activeBanner.actionUrl}
                className={`inline-flex items-center space-x-1 mt-3 ml-13 text-sm font-medium ${bannerIconColors[activeBanner.type]} hover:underline`}
              >
                <span>Learn more</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>

          {/* Accent bar at bottom */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${
            activeBanner.type === 'info' ? 'from-blue-500 to-blue-600' :
            activeBanner.type === 'success' ? 'from-green-500 to-green-600' :
            activeBanner.type === 'warning' ? 'from-yellow-500 to-yellow-600' :
            'from-red-500 to-red-600'
          }`}></div>
        </div>
      </div>
    </>
  );
}
