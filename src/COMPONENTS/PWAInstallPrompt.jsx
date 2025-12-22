import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

const PWAInstallPrompt = () => {
  const { showPrompt, handleInstall, handleDismiss } = usePWAInstall();

  if (!showPrompt) return null;

  return (
    <>
      {/* Backdrop - Click to dismiss */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={handleDismiss}
      />

      {/* Install Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto z-50 md:bottom-6 md:right-6 md:top-auto md:translate-y-0 md:max-w-sm">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
          
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 pb-4">
            {/* Background glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="relative flex items-start justify-between mb-4">
              <div className="flex-1">
                {/* App Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200  rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-black  font-bold text-lg">A</span>
                </div>
                
                {/* Title */}
                <h2 className="text-2xl font-bold text-white">Install App</h2>
                <p className="text-sm text-gray-300 mt-1">AcademicArk</p>
              </div>
              
              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 active:scale-95"
                aria-label="Close install prompt"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 pt-4">
            
            {/* Benefits List */}
            <div className="space-y-3 mb-6">
              <BenefitItem 
                icon="⚡" 
                title="Quick Access" 
                desc="Open from home screen instantly" 
              />
              <BenefitItem 
                icon="📱" 
                title="Offline Access" 
                desc="Use without internet connection" 
              />
              <BenefitItem 
                icon="🎯" 
                title="Full Screen" 
                desc="Experience like a native app" 
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-200 rounded-full font-semibold transition-all duration-200 active:scale-95"
              >
                Not Now
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Install
              </button>
            </div>

            {/* Footer Text */}
            <p className="text-xs text-gray-500 text-center mt-4">
              You can uninstall anytime from your device settings
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Benefit Item Component
const BenefitItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 mt-1">
      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
        ✓
      </div>
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
    </div>
  </div>
);

export default PWAInstallPrompt;
