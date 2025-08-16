// src/components/layouts/HomeLayout.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { showToast } from '../HELPERS/Toaster';
import { getProfile, logout } from '../REDUX/Slices/authslice';
import LogoutIcon from '@mui/icons-material/Logout';
// SVG Icons Components
const HomeIcon = ({ className, active }) => (
  <svg className={className} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const SearchIcon = ({ className, active }) => (
  <svg className={className} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const LibraryIcon = ({ className, active }) => (
  <svg className={className} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const UploadIcon = ({ className, active }) => (
  <svg className={className} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const DashboardIcon = ({ className, active }) => (
  <svg className={className} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const UserIcon = ({ className, active }) => (
  <svg className={className} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MenuIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const BellIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12c.94-.3 1.92-.94 1.92-.94M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1" />
  </svg>
);

const HomeLayout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const role = useSelector((state) => state?.auth?.role || "");
  const userData = useSelector((state) => state?.auth?.data);
  const loginMethod=useSelector((state)=>state?.auth?.loginMethod)
// useEffect(() => {
//     // Only fetch profile if not already logged in and no token check is in progress
//     if (!isLoggedIn && !userData?._id) {
//         dispatch(getProfile());
//     }
// }, [dispatch, isLoggedIn, userData?._id]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    const handleClickOutside = () => {
      setShowProfileMenu(false);
      setShowMobileMenu(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const isActiveLink = (path) => location.pathname === path;

  const handleLogout = async () => {
    const result = await dispatch(logout());
    if (result?.payload?.success) {
      showToast.success("Logged out successfully!");
      navigate("/");
    }
  };

  // Get navigation items based on role
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Home', path: '/', icon: '🏠' },
      { name: 'Library', path: '/notes', icon: '📚' },
       { name: 'Search', path: '/search', icon: '📖' }
    ];

    if (isLoggedIn) {
      if (role === 'ADMIN') {
        baseItems.push(
          { name: 'Upload', path: '/upload', icon: '📤' },
          { name: 'Dashboard', path: '/admin', icon: '⚡' }
        );
      } else if (role === 'TEACHER') {
        baseItems.push({ name: 'Upload', path: '/upload', icon: '📤' });
      }
    }

    return baseItems;
  };

  // Spotify-style mobile navigation
  const getMobileNavItems = () => {
    const baseItems = [
      { 
        name: 'Home', 
        path: '/', 
        icon: HomeIcon,
        label: 'Home'
      },
      { 
        name: 'Search', 
        path: '/search', 
        icon: SearchIcon,
        label: 'Search'
      },
      { 
        name: 'Library', 
        path: '/notes', 
        icon: LibraryIcon,
        label: 'Your Library'
      }
    ];

    // Add role-specific navigation
    if (isLoggedIn) {
      if (role === 'ADMIN') {
        baseItems.push({
          name: 'Dashboard',
          path: '/admin',
          icon: DashboardIcon,
          label: 'Dashboard'
        });
      } else if (role === 'TEACHER') {
        baseItems.push({
          name: 'Upload',
          path: '/upload',
          icon: UploadIcon,
          label: 'Upload'
        });
      }
    }

    return baseItems;
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}
      />

      {/* Desktop Header */}
      <header className={`hidden md:block fixed top-0 w-full z-50 transition-all duration-700 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl' 
          : 'bg-transparent'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <span className="text-black font-bold text-lg">A</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <span className="font-bold text-2xl text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  AcademicArk
                </span>
                <div className="text-xs text-gray-500 -mt-1">Excellence in Learning</div>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-xl rounded-full p-2 border border-white/10">
              {getNavigationItems().slice(0, 4).map((item) => (
                <Link 
                  key={item.name}
                  to={item.path} 
                  className={`relative px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActiveLink(item.path)
                      ? 'text-black bg-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                  {isActiveLink(item.path) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileMenu(!showProfileMenu);
                    }}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-colors">
                      {userData?.avatar?.secure_url ? (
                        <img 
                          src={userData.avatar.secure_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {userData?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm  font-medium text-white">
                        {userData?.fullName || 'User'}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {role.toLowerCase()}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            {userData?.avatar?.secure_url ? (
                              <img 
                                src={userData?.avatar?.secure_url} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                {userData?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {userData?.fullName || 'User'}
                            </div>
                            <div className="text-sm text-gray-400">
                              {userData?.email}
                            </div>
                            <div className="text-xs text-blue-400 capitalize">
                              {role.toLowerCase()} account
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                          <UserIcon className="w-5 h-5" />
                          <span>My Profile</span>
                        </Link>
                        <Link to="/bookmarks" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                          <LibraryIcon className="w-5 h-5" />
                          <span>My Bookmarks</span>
                        </Link>
                        {(role === 'TEACHER' || role === 'ADMIN') && (
                          <Link to="/upload" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                            <UploadIcon className="w-5 h-5" />
                            <span>Upload Notes</span>
                          </Link>
                        )}
                        {role === 'ADMIN' && (
                          <Link to="/admin" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                            <DashboardIcon className="w-5 h-5" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                      </div>
                      
                      <div className="border-t border-white/10 py-2">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors w-full text-left"
                        >
                          <span><LogoutIcon/></span>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="relative group px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 overflow-hidden rounded-lg">
                    <span className="relative z-10">Sign in</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </Link>
                  <Link to="/signup" className="group relative bg-gradient-to-r from-white to-gray-100 text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden">
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Spotify-Style Mobile Header */}
      <header className="md:hidden fixed top-0 w-full z-50 bg-black/95 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Profile/Menu Button */}
          {isLoggedIn ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMobileMenu(!showMobileMenu);
              }}
              className="w-8 h-8 rounded-full overflow-hidden border border-white/20"
            >
              {userData?.avatar?.secure_url ? (
                <img 
                  src={userData.avatar.secure_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {userData?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </button>
          ) : (
            <Link to="/login">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </Link>
          )}

          {/* Logo */}
          <Link to="/" className="flex  items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-white">AcademicArk</span>
          </Link>

          {/* Notifications */}
          <button className="p-2">
            {/* <BellIcon className="w-6 h-6 text-gray-400" /> */}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && isLoggedIn && (
          <div className="absolute top-16 left-0 right-0 bg-gray-900/98 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {userData?.avatar?.secure_url ? (
                    <img 
                      src={userData.avatar.secure_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {userData?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-white text-lg">
                    {userData?.fullName || 'User'}
                  </div>
                  <div className="text-sm text-gray-400 capitalize">
                    {role.toLowerCase()} account
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link to="/profile" className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                  <UserIcon className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <Link to="/bookmarks" className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                  <LibraryIcon className="w-5 h-5" />
                  <span>My Bookmarks</span>
                </Link>
                {(role === 'TEACHER' || role === 'ADMIN') && (
                  <Link to="/upload" className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                    <UploadIcon className="w-5 h-5" />
                    <span>Upload Notes</span>
                  </Link>
                )}
                {role === 'ADMIN' && (
                  <Link to="/admin" className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                    <DashboardIcon className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-3 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-xl transition-colors w-full text-left"
                >
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20 md:pt-20 pb-20 md:pb-0">
        {children}
      </main>

      {/* Spotify-Style Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/98 backdrop-blur-2xl border-t border-white/5 z-40">
        <div className="flex items-center justify-around py-2 px-2">
          {getMobileNavItems().map((item) => {
            const IconComponent = item.icon;
            const isActive = isActiveLink(item.path);
            
            return (
              <Link 
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`}
              >
                <IconComponent 
                  className="w-6 h-6 mb-1" 
                  active={isActive}
                />
                <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-black border-t border-white/10 mb-16 md:mb-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-black font-bold text-xl">A</span>
                </div>
                <div>
                  <span className="font-bold text-2xl text-white">AcademicArk</span>
                  <div className="text-sm text-gray-400">Excellence in Learning</div>
                </div>
              </div>
              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                Empowering students  with  study materials curated for univrsity exam. 
                Your journey to academic excellence starts here.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 relative">
                Platform
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                {[
                  { name: 'Browse Notes', path: '/notes' },
                  { name: 'search', path: '/search' },
                  { name: 'AKTU', path: 'https://aktu.ac.in/' },
                  { name: 'About Developer', path: '/about-developer' },
                  { name: 'Coming Soon', path: '/coming-soon' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 relative">
                Support
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                {[
                  { name: 'Help Center', path: '/help' },
                  { name: 'Contact', path: '/contact' },
                  { name: 'Privacy', path: '/privacy' },
                  { name: 'Terms', path: '/terms' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-gray-500 text-sm text-center">
              © 2025 AcademicArk. All rights reserved. Built with ❤️ by Samir Suman.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
