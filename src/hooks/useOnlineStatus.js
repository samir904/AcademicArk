import { useState, useEffect } from 'react';

// Custom hook to detect online/offline status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Handle when user goes online
    const handleOnline = () => {
      console.log('✅ Online - Internet restored');
      setIsOnline(true);
    };

    // Handle when user goes offline
    const handleOffline = () => {
      console.log('❌ Offline - No internet');
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
