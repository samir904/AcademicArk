import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogin } from '../../REDUX/Slices/authslice';

const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const EnvelopeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default function LoginChoice() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.auth);

  const handleGoogleSignIn = () => {
    dispatch(googleLogin());
  };

  const handleEmailLogin = () => {
    navigate('/login/email');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-white mb-3">Welcome Back</h1>
          <p className="text-gray-400 text-lg">Choose how you'd like to sign in</p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">    
          {/* Google Sign-In - Primary CTA */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group w-full bg-white hover:bg-gray-100 text-black py-4 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-6 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <GoogleIcon className="w-6 h-6" />
              </div>
              <span className="text-lg">Continue with Google</span>
            </div>
            <ArrowRightIcon className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
{/* ✨ NEW: Message below Google button */}
          {/* <div className="text-center text-xs text-gray-500 px-4 py-2">
            <p>Having trouble with Google sign-in? (Brave/Safari users)</p>
            <p className="text-gray-600 mt-1">👇 Use email sign-in below instead</p>
          </div> */}
          {/* OR Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-black text-gray-500 text-sm font-medium">OR</span>
            </div>
          </div>

          {/* Email Sign-In */}
          <button
            onClick={handleEmailLogin}
            className="group w-full bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 hover:border-gray-600 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-between px-6"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <EnvelopeIcon className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-lg">Continue with Email</span>
            </div>
            <ArrowRightIcon className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features */}
        <div className="mt-12 space-y-4">
          <p className="text-center text-gray-500 text-sm mb-6">Why sign in?</p>
          <div className="space-y-3">
            {[
              { icon: '📚', text: 'Access all AKTU study materials' },
              { icon: '⭐', text: 'Save your favorite notes' },
              { icon: '📱', text: 'Sync across all devices' },
              { icon: '🔔', text: 'Get notified of new resources' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 text-gray-400 text-sm">
                <span className="text-xl">{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signup Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-white hover:text-gray-300 font-semibold transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Privacy Notice */}
        <p className="mt-8 text-center text-gray-600 text-xs">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-gray-500">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="underline hover:text-gray-500">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
