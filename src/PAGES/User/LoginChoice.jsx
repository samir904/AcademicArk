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

const BookIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center px-4 py-8">
      
      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-10">
           <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-black font-bold text-lg">A</span>
              </div>
          <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>
          <p className="text-white/70 text-base">Sign in to AcademicArk</p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl space-y-5">
          
          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group w-full bg-[#9CA3AF] hover:bg-white text-black py-4 rounded-full font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-between px-6 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5">
                <GoogleIcon className="w-5 h-5" />
              </div>
              <span>Continue with Google</span>
            </div>
            <ArrowRightIcon className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Divider */}
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-gradient-to-br from-black via-slate-900 to-black text-white/60 text-xs font-medium">OR</span>
            </div>
          </div>

          {/* Email Sign-In Button */}
          <button
            onClick={handleEmailLogin}
            className="group w-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white py-4 rounded-full font-bold transition-all transform hover:scale-[1.02] flex items-center justify-between px-6"
          >
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
              <span>Continue with Email</span>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-white/60 transform group-hover:translate-x-1 transition-all group-hover:text-white/80" />
          </button>
        </div>

        {/* Features Section */}
        {/* <div className="mt-10">
          <p className="text-center text-white/60 text-sm font-semibold mb-5">Why sign in?</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📚', text: 'Study Materials' },
              { icon: '⭐', text: 'Save Notes' },
              { icon: '📱', text: 'Sync Access' },
              { icon: '🔔', text: 'New Updates' }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-3 text-center transition-all group cursor-default"
              >
                <div className="text-2xl mb-1">{feature.icon}</div>
                <p className="text-white/70 text-xs font-medium group-hover:text-white/90 transition-colors">{feature.text}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Signup Link */}
        <p className="text-center text-white/70 text-sm mt-8">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="text-white font-bold hover:text-gray-200 transition-colors"
          >
            Create account
          </Link>
        </p>

        {/* Privacy Notice */}
        <p className="mt-6 text-center text-white/50 text-xs leading-relaxed">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-white/70 transition-colors">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="underline hover:text-white/70 transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
