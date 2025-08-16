// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '../../HELPERS/Toaster';
import { isEmail } from '../../HELPERS/regexmatch';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../REDUX/Slices/authslice';

// Icon components
const EnvelopeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const MailIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formdata, setformdata] = useState({
    email: ""
  });

  function handleInputchange(e) {
    const { name, value } = e.target;
    setformdata({
      ...formdata,
      [name]: value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formdata.email) {
      showToast.error("Email is required!");
      return;
    }
    
    if (!isEmail(formdata.email)) {
      showToast.error("Please provide a valid email");
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await dispatch(forgotPassword(formdata));
      if (res?.payload?.success) {
        setIsSubmitted(true);
        showToast.success("Reset link sent successfully!");
        setformdata({
          email: ""
        });
      }
    } catch (error) {
      showToast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
    setformdata({ email: "" });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center">
          {/* Success State */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">Check Your Email!</h1>
            <p className="text-gray-400 mb-6 leading-relaxed">
              We've sent a password reset link to your email address. 
              Check your inbox and follow the instructions to reset your password.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleSendAnother}
                className="w-full bg-white/10 border border-white/20 text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MailIcon className="w-5 h-5" />
                <span>Send Another Email</span>
              </button>
              
              <Link
                to="/login"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <EnvelopeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-gray-400 leading-relaxed">
            Don't worry! Enter your email address and we'll send you a reset link.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formdata.email}
                  onChange={handleInputchange}
                  name="email"
                  id="email"
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  disabled={isLoading}
                />
              </div>
              {formdata.email && !isEmail(formdata.email) && (
                <p className="mt-2 text-sm text-red-400">Please enter a valid email address</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isEmail(formdata.email)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <MailIcon className="w-5 h-5" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <p className="text-gray-400">
            Remember your password?{' '}
            <Link 
              to="/login" 
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-400 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
          <h3 className="text-sm font-medium text-white mb-2">Need Help?</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            If you don't receive the reset email within a few minutes, please check your spam folder or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
