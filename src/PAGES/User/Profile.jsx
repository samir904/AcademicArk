import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile } from '../../REDUX/Slices/authslice';
import HomeLayout from '../../LAYOUTS/Homelayout';
import {  getBackgroundTheme, useImageColors } from '../../hooks/useImageColors';

// Icon components
const EditIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MailIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state?.auth?.data);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  
 const { colors,isLoading } = useImageColors(userData.avatar.secure_url);
// Try different lightness: 0.2 (very light) → 0.6 (darker)
const theme = getBackgroundTheme(colors, { lightness: 0.35 });

useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    async function fetchUserData() {
      const res = await dispatch(getProfile());
    }
    fetchUserData();
  }, [dispatch, isLoggedIn, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'from-red-500 to-pink-500';
      case 'teacher':
        return 'from-blue-500 to-purple-500';
      default:
        return 'from-green-500 to-teal-500';
    }
  };

  if (!userData) {
    return (
      <HomeLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Dynamic Header Section */}
          <div 
            className="relative backdrop-blur-xl border rounded-3xl p-8 mb-8 overflow-hidden transition-all duration-500"
            style={{
              background: theme.headerGradient,
              borderColor: theme.accentBorder,
              boxShadow: `0 25px 50px -12px ${theme.cardShadow}`
            }}
          >
            {/* Dynamic Background Pattern */}
            <div 
              className="absolute inset-0 opacity-30 transition-opacity duration-500"
              style={{
                backgroundImage: theme.backgroundPattern
              }}
            />         
            <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Photo */}
              <div className="relative group">
                <div 
                  className="w-32 h-32 rounded-full overflow-hidden border-4 group-hover:border-opacity-60 transition-all duration-300 shadow-2xl"
                  style={{
                    borderColor: `${colors.primary}40`,
                    boxShadow: `0 20px 40px ${theme.cardShadow}`
                  }}
                > {userData?.avatar?.secure_url?.startsWith('http')  ? (
                    <img
                      src={userData.avatar.secure_url}
                      alt={userData.fullName || 'Profile'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center capitalize justify-center text-white font-bold text-4xl">
                      {userData.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                
                {/* Edit Profile Photo Button */}
                <Link to={"/edit-profile"} className="absolute bottom-2 right-2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors group-hover:scale-110 transform duration-200">
                  <EditIcon className="w-4 h-4" />
                </Link>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold capitalize text-white mb-2">
                    {userData.fullName || 'User'}
                  </h1>
                  <p className="text-gray-400 text-lg">
                    {userData.email}
                  </p>
                </div>

                {/* Role Badge */}
                <div className="inline-flex items-center space-x-2 mb-6">
                  <div className={`px-4 py-2 bg-gradient-to-r ${getRoleBadgeColor(userData.role)} rounded-full text-white font-medium text-sm shadow-lg`}>
                    <span className="capitalize">{userData.role?.toLowerCase() || 'user'} Account</span>
                  </div>
                  {userData.authProvider === 'google' && (
                    <div className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-gray-300 text-xs">
                      Google Account
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/edit-profile"
                    className="group bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <EditIcon className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </Link>
                  { (userData?.role=='ADMIN' || userData?.role=='TEACHER')&&
                  (<Link
                    to="/my-analytics"
                    className="group bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>📚</span>
                    <span>My Analytics</span>
                  </Link>)
              }
              {
                (userData?.role=='USER')&&
                  (<Link
                    to="/bookmarks"
                    className="group bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>📚</span>
                    <span>My Bookmarks</span>
                  </Link>)
              }
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Account Information */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <ShieldIcon className="w-6 h-6" />
                <span>Account Information</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <MailIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-400">Email Address</div>
                    <div className="text-white font-medium">{userData.email}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-5 h-5 text-gray-400">👤</div>
                  <div>
                    <div className="text-sm text-gray-400">Full Name</div>
                    <div className="text-white  font-medium">{userData.fullName || 'Not set'}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-5 h-5 text-gray-400">🔒</div>
                  <div>
                    <div className="text-sm text-gray-400">Account Type</div>
                    <div className="text-white font-medium capitalize">{userData.role?.toLowerCase() || 'user'}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-5 h-5 text-gray-400">🌐</div>
                  <div>
                    <div className="text-sm text-gray-400">Sign-in Method</div>
                    <div className="text-white font-medium capitalize">
                      {userData.authProvider === 'google' ? 'Google OAuth' : 'Email & Password'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Activity */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <CalendarIcon className="w-6 h-6" />
                <span>Account Activity</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-5 h-5 text-gray-400">📅</div>
                  <div>
                    <div className="text-sm text-gray-400">Member Since</div>
                    <div className="text-white font-medium">
                      {userData.createdAt ? formatDate(userData.createdAt) : 'Unknown'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-5 h-5 text-gray-400">🔄</div>
                  <div>
                    <div className="text-sm text-gray-400">Last Updated</div>
                    <div className="text-white font-medium">
                      {userData.updatedAt ? formatDate(userData.updatedAt) : 'Unknown'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-5 h-5 text-gray-400">✅</div>
                  <div>
                    <div className="text-sm text-gray-400">Account Status</div>
                    <div className="text-green-400 font-medium">Active</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-5 h-5 text-gray-400">📊</div>
                  <div>
                    <div className="text-sm text-gray-400">Profile Completion</div>
                    <div className="text-white font-medium">
                      {userData.fullName && userData.email ? '100%' : '80%'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/bookmarks"
                className="group p-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/5 text-center"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📚</div>
                <div className="text-white font-medium">My Notes</div>
                <div className="text-gray-400 text-sm">View saved</div>
              </Link>

              <Link
                to="/change-password"
                className="group p-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/5 text-center"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔒</div>
                <div className="text-white font-medium">Security</div>
                <div className="text-gray-400 text-sm">Change password</div>
              </Link>

              {(userData.role === 'TEACHER' || userData.role === 'ADMIN') && (
                <Link
                  to="/upload"
                  className="group p-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/5 text-center"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📤</div>
                  <div className="text-white font-medium">Upload</div>
                  <div className="text-gray-400 text-sm">Share notes</div>
                </Link>
              )}

              <Link
                to="/settings"
                className="group p-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/5 text-center"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
                <div className="text-white font-medium">Settings</div>
                <div className="text-gray-400 text-sm">Preferences</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
