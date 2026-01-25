import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const OfflineRedirect = () => {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    // If user tries to access /notes or /search while offline
    const currentPath = window.location.pathname;
    const isOnlineOnlyPage = ['/notes', '/search', '/'].includes(currentPath);

    if (!isOnline && isOnlineOnlyPage) {
      console.log('🌐 Offline detected on online-only page, redirecting...');
      
      // Show notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-orange-600 text-white px-4 py-3 rounded-lg z-50';
      notification.textContent = '📥 Redirecting to Downloads...';
      document.body.appendChild(notification);
      
      // Redirect after 1 second
      setTimeout(() => {
        navigate('/downloads', { replace: true });
        notification.remove();
      }, 1000);
    }
  }, [isOnline, navigate]);

  return null;
};

export default OfflineRedirect;
