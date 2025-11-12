import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { showToast } from '../../HELPERS/Toaster';
import { isEmail, isValidPassword } from '../../HELPERS/regexmatch';
import { createAccount } from '../../REDUX/Slices/authslice';

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

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

export default function SignupEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state?.auth);
  const { isLoggedIn } = useSelector(state => state.auth);

  const emailFromModal = location.state?.email || "";

  const [signupdata, setSignupdata] = useState({
    fullName: "",
    email: emailFromModal,
    password: "",
    avatar: ""
  });

  const [previewImage, setPreviewimage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'fullName':
        if (value.length < 5) {
          newErrors.fullName = 'Name should be at least 5 characters';
        } else {
          delete newErrors.fullName;
        }
        break;
      case 'email':
        if (!isEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!isValidPassword(value)) {
          newErrors.password = 'Password must meet requirements';
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupdata({
      ...signupdata,
      [name]: value
    });

    if (value.trim()) {
      validateField(name, value);
    }
  }

  function handleImage(e) {
    e.preventDefault();
    const uploadImage = e.target.files[0];
    
    if (!uploadImage) {
      showToast.error("Please upload a profile photo!");
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(uploadImage.type)) {
      showToast.error("Please upload a valid image file (JPG, PNG, SVG)");
      return;
    }

    if (uploadImage.size > 5 * 1024 * 1024) {
      showToast.error("Image size should be less than 5MB");
      return;
    }

    setSignupdata({
      ...signupdata,
      avatar: uploadImage
    });

    const filereader = new FileReader();
    filereader.readAsDataURL(uploadImage);
    filereader.addEventListener("load", function () {
      setPreviewimage(this.result);
    });
  }

  async function submitSignupForm(e) {
    e.preventDefault();
    
    if (!signupdata.fullName || !signupdata.email || !signupdata.password) {
      showToast.error("All fields are required");
      return;
    }

    if (!isEmail(signupdata.email)) {
      showToast.error("Invalid email address");
      return;
    }

    if (!isValidPassword(signupdata.password)) {
      showToast.error("Password doesn't meet requirements");
      return;
    }

    if (signupdata.fullName.length < 5) {
      showToast.error("Name should be at least 5 characters");
      return;
    }

    const formdata = new FormData();
    formdata.append("fullName", signupdata.fullName);
    formdata.append("email", signupdata.email);
    formdata.append("avatar", signupdata.avatar);
    formdata.append("password", signupdata.password);

    const res = await dispatch(createAccount(formdata));

    if (res?.payload?.success) {
      navigate("/");
      setPreviewimage("");
      setSignupdata({
        fullName: "",
        email: "",
        password: "",
        avatar: ''
      });
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center px-4 py-8">
      
      <div className="max-w-md w-full">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/signup')}
          className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeftIcon className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-black font-bold text-lg">A</span>
              </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/70 text-sm">Join the learning community</p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          
          <form onSubmit={submitSignupForm} className="space-y-5">
            
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-white/90 mb-2.5">
                Full Name
              </label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                <input
                  type="text"
                  value={signupdata.fullName}
                  onChange={handleUserInput}
                  name="fullName"
                  id="fullName"
                  placeholder="Your full name"
                  className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all backdrop-blur-sm ${
                    errors.fullName ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-xs text-red-400 font-medium">{errors.fullName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2.5">
                Email Address
              </label>
              <div className="relative group">
                <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                <input
                  type="email"
                  value={signupdata.email}
                  onChange={handleUserInput}
                  name="email"
                  id="email"
                  placeholder="your@gmail.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all backdrop-blur-sm ${
                    errors.email ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-red-400 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-2.5">
                Password
              </label>
              <div className="relative group">
                <LockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={signupdata.password}
                  onChange={handleUserInput}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all backdrop-blur-sm ${
                    errors.password ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
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
              <p className="mt-2 text-xs text-white/60">
                Min 8 chars: uppercase, lowercase, number & special character
              </p>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className="w-full mt-6 bg-gradient-to-r from-white to-gray-100 hover:from-gray-50 hover:to-white text-black py-3.5 rounded-xl font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center space-x-2 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-black"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-white/70 text-sm mt-8">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-white font-bold hover:text-gray-200 transition-colors"
          >
            Sign in
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
