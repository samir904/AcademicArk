import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../HELPERS/Toaster';
import { isValidPassword } from '../../HELPERS/regexmatch';
import { changePassword } from '../../REDUX/Slices/authslice';
import HomeLayout from '../../LAYOUTS/Homelayout';

// Icon components
const LockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const KeyIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

export default function Changepassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formdata, setformdata] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    Object.values(checks).forEach(check => {
      if (check) strength++;
    });

    return { strength, checks };
  };

  const passwordAnalysis = getPasswordStrength(formdata.newPassword);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setformdata({
      ...formdata,
      [name]: value
    });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!formdata.oldPassword || !formdata.newPassword || !formdata.confirmNewPassword) {
      showToast.error("All fields are required");
      return;
    }

    if (!isValidPassword(formdata.newPassword)) {
      showToast.error("New password must contain at least 8 characters with uppercase, lowercase, number and special character");
      return;
    }

    if (formdata.newPassword !== formdata.confirmNewPassword) {
      showToast.error("New passwords do not match");
      return;
    }

    if (formdata.oldPassword === formdata.newPassword) {
      showToast.error("New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await dispatch(changePassword({
        oldPassword: formdata.oldPassword,
        newPassword: formdata.newPassword
      }));
      
      if (res?.payload?.success) {
        showToast.success("Password changed successfully! Please login with your new password.");
        navigate("/profile");
        setformdata({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        });
      }
    } catch (error) {
      showToast.error("Failed to change password. Please verify your current password and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const getStrengthColor = () => {
    if (passwordAnalysis.strength <= 2) return 'bg-red-500';
    if (passwordAnalysis.strength <= 3) return 'bg-yellow-500';
    if (passwordAnalysis.strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordAnalysis.strength <= 2) return 'Weak';
    if (passwordAnalysis.strength <= 3) return 'Fair';
    if (passwordAnalysis.strength <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/profile')}
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Profile</span>
            </button>
            
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Change Password</h1>
            <p className="text-gray-400">Update your password to keep your account secure</p>
          </div>

          {/* Form Container */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Current Password Field */}
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showOldPassword ? "text" : "password"}
                    id="oldPassword"
                    name="oldPassword"
                    value={formdata.oldPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showOldPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formdata.newPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formdata.newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Password Strength</span>
                      <span className={`text-xs font-medium ${
                        passwordAnalysis.strength <= 2 ? 'text-red-400' :
                        passwordAnalysis.strength <= 3 ? 'text-yellow-400' :
                        passwordAnalysis.strength <= 4 ? 'text-blue-400' :
                        'text-green-400'
                      }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordAnalysis.strength / 5) * 100}%` }}
                      ></div>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries({
                        '8+ characters': passwordAnalysis.checks.length,
                        'Uppercase letter': passwordAnalysis.checks.uppercase,
                        'Lowercase letter': passwordAnalysis.checks.lowercase,
                        'Number': passwordAnalysis.checks.number,
                        'Special character': passwordAnalysis.checks.special,
                      }).map(([requirement, met]) => (
                        <div key={requirement} className="flex items-center space-x-2">
                          <CheckIcon className={`w-3 h-3 ${met ? 'text-green-400' : 'text-gray-500'}`} />
                          <span className={`text-xs ${met ? 'text-green-400' : 'text-gray-500'}`}>
                            {requirement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={formdata.confirmNewPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formdata.confirmNewPassword && (
                  <div className="mt-2">
                    {formdata.newPassword === formdata.confirmNewPassword ? (
                      <div className="flex items-center space-x-2">
                        <CheckIcon className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">Passwords match</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full border-2 border-red-400"></div>
                        <span className="text-sm text-red-400">Passwords don't match</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20 transition-all duration-300"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={
                    isLoading || 
                    !formdata.oldPassword || 
                    !formdata.newPassword || 
                    !formdata.confirmNewPassword ||
                    formdata.newPassword !== formdata.confirmNewPassword ||
                    !isValidPassword(formdata.newPassword)
                  }
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Changing Password...</span>
                    </>
                  ) : (
                    <>
                      <KeyIcon className="w-5 h-5" />
                      <span>Change Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security Tips */}
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-3">Security Tips</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>• Use a unique password that you don't use anywhere else</li>
              <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
              <li>• Avoid using personal information like birthdays or names</li>
              <li>• Consider using a password manager for stronger security</li>
            </ul>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
