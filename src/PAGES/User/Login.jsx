import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '../../HELPERS/Toaster';
import { isEmail } from '../../HELPERS/regexmatch';
import { login } from '../../REDUX/Slices/authslice';
import { useEffect } from 'react';

import SignupModal from '../../COMPONENTS/SignupModal';

// SVG Icons
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
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");

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

    if (res?.payload?.message && res.payload.message.includes("not registered")) {
      setModalEmail(logindata.email);
      setShowSignupModal(true);
      return;
    }

    if (res?.payload?.success) {
      navigate("/");
      setLogindata({ email: "", password: "" });
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-8 relative overflow-hidden">

        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20 " />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-20 "  />

        <div className="max-w-md w-full relative z-10">

          {/* Back Button */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeftIcon className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Glass Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-black font-bold text-lg">A</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/70 text-sm">Sign in to your AcademicArk account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginFormSubmit} className="space-y-5">

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2.5">
                  Email Address
                </label>
                <div className="relative group">
                  <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                  <input
                    type="email"
                    value={logindata.email}
                    onChange={handleInputChange}
                    name="email"
                    id="email"
                    placeholder="Enter your email.."
                    className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all backdrop-blur-sm ${errors.email ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-xs text-red-400 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label htmlFor="password" className="block text-sm font-semibold text-white/90">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-white/60 hover:text-white transition-colors font-medium"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <LockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={logindata.password}
                    onChange={handleInputChange}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all backdrop-blur-sm ${errors.password ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black hover:black transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-xs text-red-400 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded bg-white/10 border border-white/30 text-white focus:ring-white/30 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-white/70 font-medium cursor-pointer">
                  Keep me signed in
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                className="w-full mt-6 bg-gradient-to-r from-white to-gray-100 hover:from-gray-50 hover:to-white text-black py-3.5 rounded-full font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center space-x-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-black"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-gradient-to-br from-black via-gray-900 to-black text-white/60">Or</span>
                </div>
              </div>

              {/* Create Account Link */}
              <p className="text-center text-white/70 text-sm">
                New here?{' '}
                <Link
                  to="/signup"
                  className="text-white font-bold hover:text-gray-200 transition-colors"
                >
                  Create account
                </Link>
              </p>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/50">
              Protected by enterprise-grade encryption
            </p>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        email={modalEmail}
        onClose={() => setShowSignupModal(false)}
      />
    </>
  );
}
