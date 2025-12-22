import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('✅ beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user dismissed it recently
      const dismissed = localStorage.getItem('pwaInstallDismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    // Listen for successful install
    const handleAppInstalled = () => {
      console.log('✅ App installed successfully!');
      setShowPrompt(false);
      setDeferredPrompt(null);
      setIsInstalled(true);
      localStorage.setItem('pwaInstalled', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (localStorage.getItem('pwaInstalled')) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('❌ No install prompt available');
      return;
    }

    try {
      // Show the native install prompt
      deferredPrompt.prompt();

      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('✅ User accepted installation');
        setShowPrompt(false);
        localStorage.setItem('pwaInstalled', 'true');
        setIsInstalled(true);
      } else {
        console.log('❌ User rejected installation');
        handleDismiss();
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error('Installation error:', error);
    }
  };

  const handleDismiss = () => {
    console.log('❌ User dismissed prompt');
    setShowPrompt(false);
    // Hide for 7 days
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('pwaInstallDismissed', Date.now().toString());
    
    // Remove old localStorage key after 7 days automatically
    setTimeout(() => {
      localStorage.removeItem('pwaInstallDismissed');
    }, sevenDaysMs);
  };

  return {
    showPrompt: showPrompt && !isInstalled,
    handleInstall,
    handleDismiss,
    isInstalled
  };
};
