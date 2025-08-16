import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { isValidPassword } from '../../HELPERS/regexmatch';
import { showToast } from '../../HELPERS/Toaster';
import { resetPassword } from '../../REDUX/Slices/authslice';
import HomeLayout from '../../LAYOUTS/Homelayout';

// Icon components
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

const LockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function Resetpassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formdata, setformdata] = useState({
    password: "",
    confirmPassword: ""
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

  const passwordAnalysis = getPasswordStrength(formdata.password);

  function handleInputChange(e) {
    const { value, name } = e.target;
    setformdata({
      ...formdata,
      [name]: value
    });
  }

  async function handle(e) {
    e.preventDefault();
    
    if (!formdata.password || !formdata.confirmPassword) {
      showToast.error("All fields are required");
      return;
    }
    
    if (!isValidPassword(formdata.password)) {
      showToast.error("Password not valid");
      return;
    }
    
    if (formdata.password !== formdata.confirmPassword) {
      showToast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await dispatch(resetPassword({
        resetToken,
        password: formdata.password
      }));
      
      if (res?.payload?.success) {
        showToast.success("Password reset successfully!");
        navigate("/login");
        setformdata({
          password: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      showToast.error("Failed to reset password. Please try again.");
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LockIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400">Create a new password for your AcademicArk account</p>
          </div>

          {/* Form */}
          <form onSubmit={handle} className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
              
              {/* New Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formdata.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pr-12"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formdata.password && (
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
                    <div className="mt-3 space-y-1">
                      {Object.entries({
                        'At least 8 characters': passwordAnalysis.checks.length,
                        'One uppercase letter': passwordAnalysis.checks.uppercase,
                        'One lowercase letter': passwordAnalysis.checks.lowercase,
                        'One number': passwordAnalysis.checks.number,
                        'One special character': passwordAnalysis.checks.special,
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

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formdata.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pr-12"
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
                {formdata.confirmPassword && (
                  <div className="mt-2">
                    {formdata.password === formdata.confirmPassword ? (
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || formdata.password !== formdata.confirmPassword || !isValidPassword(formdata.password)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Resetting Password...</span>
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Remember your password?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-400 cursor-pointer  duration-300 hover:text-blue-300 font-medium transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    
  );
}
