// src/components/GlobalLoginModal.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginModal } from '../REDUX/Slices/authslice';
import { googleLogin } from '../REDUX/Slices/authslice';
import { Link, useNavigate } from 'react-router-dom';

// Icons
const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm6-10V7a3 3 0 00-3 3v1h6V7a3 3 0 00-3-3z" />
  </svg>
);

const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const EnvelopeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ArrowIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const GlobalLoginModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoginModalOpen, loginContext, loading } = useSelector(state => state.auth);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      dispatch(setLoginModal({ isOpen: false, context: null }));
      setIsClosing(false);
    }, 200);
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await dispatch(googleLogin()).unwrap();
      if (result) {
        handleClose();
        navigate('/');
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleEmailLogin = () => {
    navigate('/login/email');
    handleClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isLoginModalOpen && !isClosing) {
        handleClose();
      }
    };
    if (isLoginModalOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isLoginModalOpen, isClosing]);

  if (!isLoginModalOpen) return null;

  const actionIcon = loginContext?.action?.toLowerCase().includes('download')
    ? '📥'
    : loginContext?.action?.toLowerCase().includes('bookmark')
    ? '🔖'
    : '🔐';

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop - DARK */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={handleClose}
        style={{
          animation: isClosing ? 'fadeOut 0.2s ease-out forwards' : 'fadeIn 0.4s ease-out'
        }}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full max-w-md transform transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
          style={{
            animation: isClosing ? 'slideDown 0.2s ease-in forwards' : 'slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
          }}
        >
          {/* Glass Card - DARK GRADIENT */}
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Animated Background - LIKE LoginEmail */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-20" />
            </div>

            {/* Content */}
            <div className="relative p-8 space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-gradient-to-br from-white to-gray-200 rounded-lg">
                      <LockIcon className="w-5 h-5 text-black" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Sign In</h2>
                  <p className="text-sm text-white/70">to continue</p>
                </div>
                
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
                >
                  <CloseIcon className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Context Box */}
              {loginContext && (
                <div className="p-4 bg-white/5 border border-white/20 rounded-2xl overflow-hidden">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{actionIcon}</span>
                      <span className="text-sm font-semibold text-white">
                        {loginContext.action}
                      </span>
                    </div>
                    
                    {loginContext.noteTitle && (
                      <div className="pl-7">
                        <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                          <span className="font-medium">{loginContext.noteTitle}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Google Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="group w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-between px-4 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <GoogleIcon className="w-5 h-5" />
                  <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
                </div>
                <ArrowIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/20" />
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                  <span className="bg-gradient-to-br from-black via-gray-900 to-black px-3 text-xs text-white/60 font-medium">OR</span>
                </span>
              </div>

              {/* Email Button */}
              <button
                onClick={handleEmailLogin}
                className="group w-full bg-gradient-to-r from-white to-gray-100 hover:from-gray-50 hover:to-white text-black py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-between px-4 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="w-5 h-5 text-black" />
                  <span>Continue with Email</span>
                </div>
                <ArrowIcon className="w-4 h-4 text-black transform group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/20" />
              </div>

              {/* Sign Up */}
              <p className="text-center text-sm text-white/70">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-bold text-white hover:text-gray-300 transition-colors"
                >
                  Create one
                </Link>
              </p>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
       
      `}</style>
    </div>
  );
};

export default GlobalLoginModal;