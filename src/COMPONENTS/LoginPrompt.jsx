// src/components/LoginPrompt.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogin } from '../REDUX/Slices/authslice';

// Icons
const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

export default function LoginPrompt({ action = "access this feature" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state?.auth);

  const handleGoogleSignIn = async () => {
    try {
      const result = await dispatch(googleLogin()).unwrap();
      if (result) {
        navigate('/');
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleEmailLogin = () => {
    navigate('/login/email');
  };

  return (
    <div className="relative w-full">
      {/* Main Container - DARK GRADIENT LIKE LoginEmail */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 space-y-6 overflow-hidden shadow-xl">
        
        {/* Animated Background - LIKE LoginEmail */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-20" />
        </div>

        {/* Content */}
        <div className="relative space-y-6">
          
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-200 rounded-2xl flex items-center justify-center group shadow-lg">
                <UserIcon className="w-10 h-10 text-black" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">
              Ready to Get Started?
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Sign in to {action} and unlock exclusive features
            </p>
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-x-0 top-1/2 h-px bg-white/20" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-between shadow-lg"
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
            className="group w-full px-6 py-3 bg-gradient-to-r from-white to-gray-100 hover:from-gray-50 hover:to-white text-black rounded-xl font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-between shadow-lg"
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

          {/* Benefits */}
          <div className="pt-4 space-y-3 border-t border-white/20">
            <p className="text-xs text-white/60 text-center font-semibold uppercase tracking-wider">
              Get instant access to
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="space-y-1">
                <div className="text-lg">📥</div>
                <p className="text-xs text-white/70">Download</p>
              </div>
              <div className="space-y-1">
                <div className="text-lg">🔖</div>
                <p className="text-xs text-white/70">Bookmark</p>
              </div>
              <div className="space-y-1">
                <div className="text-lg">📤</div>
                <p className="text-xs text-white/70">Share</p>
              </div>
            </div>
          </div>

          {/* Sign Up */}
          <div className="text-center pt-2">
            <p className="text-sm text-white/70">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-bold text-white hover:text-gray-300 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border border-white/20 flex items-center justify-center text-xs text-white font-bold">1</div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border border-white/20 flex items-center justify-center text-xs text-white font-bold">2</div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border border-white/20 flex items-center justify-center text-xs text-white font-bold">3</div>
            </div>
            <span className="text-xs text-white/60">1000+ students joined today</span>
          </div>
        </div>
      </div>
    </div>
  );
}