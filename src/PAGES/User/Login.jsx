// src/pages/LoginEmail.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '../../HELPERS/Toaster';
import { isEmail } from '../../HELPERS/regexmatch';
import { login } from '../../REDUX/Slices/authslice';
import { useEffect } from 'react';

// Custom SVG Icons
const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const EnvelopeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export default function LoginEmail() {
  const { isLoggedIn } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state?.auth);

  const [logindata, setLogindata] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation function
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        if (!isEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (value.length < 1) {
          newErrors.password = 'Password is required';
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    setLogindata({
      ...logindata,
      [name]: value
    });

    if (value.trim()) {
      validateField(name, value);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  async function handleLoginFormSubmit(e) {
    e.preventDefault();
    
    if (!logindata.email || !logindata.password) {
      showToast.error("All fields are required");
      return;
    }

    if (!isEmail(logindata.email)) {
      showToast.error("Please enter a valid email address");
      return;
    }

    const res = await dispatch(login(logindata));
    
    if (res?.payload?.success) {
      navigate("/");
      setLogindata({
        email: "",
        password: ""
      });
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeftIcon className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to login options</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-white mb-2">Sign in with Email</h1>
          <p className="text-gray-400 text-sm">Enter your credentials to continue</p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleLoginFormSubmit} className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={logindata.email}
                  onChange={handleInputChange}
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={logindata.password}
                  onChange={handleInputChange}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-white focus:ring-white/20 border-gray-600 rounded bg-gray-900"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
              Remember me for 15 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className="w-full bg-white text-black py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* Signup Link */}
          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-white hover:text-gray-300 font-semibold transition-colors"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
