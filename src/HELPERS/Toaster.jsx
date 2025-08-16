// src/components/ui/Toast.jsx
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Custom Toast Component with Modern Styling
export const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: 'rgba(17, 24, 39, 0.95)', // Dark with transparency
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          borderRadius: '16px',
          color: '#f9fafb',
          padding: '16px 20px',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          minWidth: '320px',
          maxWidth: '420px',
          wordBreak: 'break-word',
        },
        // Success toast styling
        success: {
          style: {
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#f0fdf4',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#064e3b',
          },
        },
        // Error toast styling
        error: {
          style: {
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fef2f2',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#7f1d1d',
          },
        },
        // Loading toast styling
        loading: {
          style: {
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#eff6ff',
          },
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#1e3a8a',
          },
        },
      }}
    />
  );
};

// Custom Toast Functions with Enhanced UX
export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      icon: '✅',
      ...options,
    });
  },
  
  error: (message, options = {}) => {
    toast.error(message, {
      icon: '❌',
      ...options,
    });
  },
  
  loading: (message, options = {}) => {
    return toast.loading(message, {
      icon: '⏳',
      ...options,
    });
  },
  
  info: (message, options = {}) => {
    toast(message, {
      icon: '💡',
      style: {
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        color: '#eef2ff',
      },
      ...options,
    });
  },
  
  warning: (message, options = {}) => {
    toast(message, {
      icon: '⚠️',
      style: {
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        color: '#fffbeb',
      },
      ...options,
    });
  },

  // Special toast for academic achievements
  achievement: (message, options = {}) => {
    toast(message, {
      icon: '🎉',
      duration: 6000,
      style: {
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(126, 34, 206, 0.05) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        color: '#faf5ff',
        fontSize: '15px',
        fontWeight: '600',
      },
      ...options,
    });
  },

  // Custom promise toast for async operations
  promise: (promise, messages, options = {}) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred!',
    }, {
      style: {
        minWidth: '250px',
      },
      success: {
        duration: 3000,
        icon: '🎯',
      },
      error: {
        duration: 4000,
        icon: '💥',
      },
      loading: {
        icon: '🔄',
      },
      ...options,
    });
  },
};

export default CustomToaster;
