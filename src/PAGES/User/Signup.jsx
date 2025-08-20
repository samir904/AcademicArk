// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '../../HELPERS/Toaster';
import { isEmail, isValidPassword } from '../../HELPERS/regexmatch';
import { createAccount } from '../../REDUX/Slices/authslice';

// Custom SVG Icons
const UploadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

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

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state?.auth);

  const [signupdata, setSignupdata] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: ""
  });

  const [previewImage, setPreviewimage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  // Validation function
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

    setIsUploading(true);

    setSignupdata({
      ...signupdata,
      avatar: uploadImage
    });

    const filereader = new FileReader();
    filereader.readAsDataURL(uploadImage);
    filereader.addEventListener("load", function () {
      setPreviewimage(this.result);
      setIsUploading(false);
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
      //showToast.success("Account created successfully! Welcome to AcademicArk 🎉");
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

  // const handleGoogleSignIn = () => {
  //   window.location.href = `http://localhost:5014/api/v1/oauth/google`;
  // };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <h1 className="text-3xl  text-center font-light text-white mb-2">Create Account</h1>

        {/* Main Form */}
        <form onSubmit={submitSignupForm} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <label 
              htmlFor="avatar" 
              className="relative group cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-600 hover:border-gray-500 flex items-center justify-center overflow-hidden transition-colors bg-gray-900 hover:bg-gray-800">
                {previewImage ? (
                  <>
                    <img 
                      className="w-full h-full object-cover rounded-full" 
                      src={previewImage} 
                      alt="Profile preview" 
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                      <UploadIcon className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : (
                      <UploadIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-300" />
                    )}
                  </div>
                )}
              </div>
            </label>
            <p className="text-sm text-gray-400">Click to upload profile photo</p>
            <input
              type="file"
              onChange={handleImage}
              id="avatar"
              name="avatar"
              className="hidden"
              accept=".jpg,.jpeg,.png,.svg"
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={signupdata.fullName}
                  onChange={handleUserInput}
                  name="fullName"
                  id="fullName"
                  placeholder="Enter your full name"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-colors ${
                    errors.fullName ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={signupdata.email}
                  onChange={handleUserInput}
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-colors ${
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={signupdata.password}
                  onChange={handleUserInput}
                  name="password"
                  id="password"
                  placeholder="Create a strong password"
                  className={`w-full pl-12 pr-12 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-colors ${
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
              <p className="mt-1 text-xs text-gray-500">
                Must contain 8+ characters with uppercase, lowercase, number & special character
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>


          {/* Login Link */}
          <p className="text-center text-gray-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-white hover:text-gray-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
