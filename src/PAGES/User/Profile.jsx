import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile } from '../../REDUX/Slices/authslice';
import { getBackgroundTheme, useImageColors } from '../../hooks/useImageColors';
import { setShowProfileModal } from '../../REDUX/Slices/academicProfileSlice'; // ✨ NEW
import PageTransition from '../../COMPONENTS/PageTransition';
// import { EngagementWidget } from '../../COMPONENTS/Session/NoteInteractionTracker';
// import UserSecurityPage from '../../COMPONENTS/UserSecurityPage';

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
const GithubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.070 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.770.840 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.430.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WebsiteIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state?.auth?.data);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  const { colors, isLoading } = useImageColors(userData.avatar.secure_url);
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
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </>
    );
  }

  return (
    <PageTransition>
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
                > {userData?.avatar?.secure_url?.startsWith('http') ? (
                  <img
                    src={userData.avatar.secure_url}
                    alt={userData.fullName || 'Profile'}
                    className="w-full h-full object-cover"
                    loading='lazy'
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
                  <Link
                    to="/profile/edit-social"
                    className="group bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 shadow-inner hover:shadow-lg transform hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 13v8m0-8a4 4 0 110-8 4 4 0 010 8zm6 8v-4a2 2 0 00-2-2H8a2 2 0 00-2 2v4"
                      />
                    </svg>
                    <span>Edit Social Profile</span>
                  </Link>

                  {(userData?.role == 'ADMIN' || userData?.role == 'TEACHER') &&
                    (<Link
                      to="/my-analytics"
                      className="group bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>📚</span>
                      <span>My Analytics</span>
                    </Link>)
                  }
                  {
                    (userData?.role == 'USER') &&
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

          {/* Bio & Social Links Card */}
          {(userData.bio || Object.values(userData.socialLinks || {}).some(url => url)) && (
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
              {/* Bio */}
              {userData.bio && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
                  <p className="text-gray-300 mb-6">{userData.bio}</p>
                </>
              )}

              {/* Social Links */}
              <div>
                {userData.socialLinks && Object.values(userData.socialLinks).some(url => url) && (
                  <h2 className="text-2xl font-bold text-white mb-4">Connect With Me</h2>
                )}
                <div className="flex flex-wrap gap-4">
                  {userData.socialLinks.github && (
                    <a
                      href={userData.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center space-x-2 bg-white/10 border border-white/20 px-4 py-2 rounded-lg hover:border-blue-400 transition"
                    >
                      <GithubIcon className="w-5 h-5 text-gray-300" />
                      <span className="text-gray-200 group-hover:text-white">GitHub</span>
                    </a>
                  )}
                  {userData.socialLinks.linkedin && (
                    <a
                      href={userData.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center space-x-2 bg-white/10 border border-white/20 px-4 py-2 rounded-lg hover:border-blue-400 transition"
                    >
                      <LinkedInIcon className="w-5 h-5 text-gray-300" />
                      <span className="text-gray-200 group-hover:text-white">LinkedIn</span>
                    </a>
                  )}
                  {userData.socialLinks.twitter && (
                    <a
                      href={userData.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center space-x-2 bg-white/10 border border-white/20 px-4 py-2 rounded-lg hover:border-blue-400 transition"
                    >
                      <TwitterIcon className="w-5 h-5 text-gray-300" />
                      <span className="text-gray-200 group-hover:text-white">Twitter</span>
                    </a>
                  )}
                  {userData.socialLinks.website && (
                    <a
                      href={userData.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center space-x-2 bg-white/10 border border-white/20 px-4 py-2 rounded-lg hover:border-blue-400 transition"
                    >
                      <WebsiteIcon className="w-5 h-5 text-gray-300" />
                      <span className="text-gray-200 group-hover:text-white">Website</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

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
          {/* Academic Information Card */}
          {userData?.academicProfile?.isCompleted ? (
            <div className="bg-gradient-to-br mt-8 from-indigo-900/20 to-purple-900/20 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <span>🎓</span>
                  <span>Academic Information</span>
                </h2>
                <Link
                  to="/academic-profile"
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                >
                  Edit →
                </Link>
              </div>

              <div className="grid  grid-cols-1 md:grid-cols-3 gap-4">
                {/* Semester */}
                <div className="bg-black/40 rounded-lg p-4 border border-indigo-500/20">
                  <div className="text-sm text-gray-400 mb-2">Semester</div>
                  <div className="text-2xl font-bold text-indigo-400">
                    {userData.academicProfile.semester}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Current Semester</div>
                </div>

                {/* College */}
                <div className="bg-black/40 rounded-lg p-4 border border-indigo-500/20">
                  <div className="text-sm text-gray-400 mb-2">College</div>
                  <div className="text-lg font-bold text-purple-400">
                    {userData.academicProfile.college?.name?.substring(0, 20)}
                    {userData.academicProfile.college?.name?.length > 20 ? '...' : ''}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {userData.academicProfile.college?.isPredefined ? (
                      <span className="text-blue-400">✓ Verified</span>
                    ) : userData.academicProfile.college?.isApproved ? (
                      <span className="text-green-400">✓ Approved</span>
                    ) : (
                      <span className="text-yellow-400">⏳ Pending Review</span>
                    )}
                  </div>
                </div>

                {/* Branch */}
                <div className="bg-black/40 rounded-lg p-4 border border-indigo-500/20">
                  <div className="text-sm text-gray-400 mb-2">Branch</div>
                  <div className="text-lg font-bold text-pink-400">
                    {userData.academicProfile.branch}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Field of Study</div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="mt-4 pt-4 border-t border-indigo-500/10">
                <div className="text-xs text-gray-400">
                  Last updated: {new Date(userData.academicProfile.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">Complete Your Academic Profile</h3>
                  <p className="text-gray-400 text-sm">Add your semester, college, and branch information</p>
                </div>
                <Link
                  to="/academic-profile"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  Complete Profile
                </Link>
              </div>
            </div>
          )}

          {/* <EngagementWidget /> Shows real-time engagement stats */}

          {/* Security Section */}
          {/* <div className="mt-8">
  <UserSecurityPage />
</div> */}



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
      </PageTransition>
  );
}
