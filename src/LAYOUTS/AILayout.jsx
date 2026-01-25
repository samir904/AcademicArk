import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../REDUX/Slices/authslice';

const AILayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, data } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const sidebarLinks = [
    { 
      path: '/study-buddy', 
      icon: '🤖', 
      label: 'Study Buddy',
      desc: 'AI Chat Assistant' 
    },
    { 
      path: '/study-planner', 
      icon: '📅', 
      label: 'Study Planner',
      desc: 'Exam Scheduler' 
    },
    { 
      path: '/notes', 
      icon: '📚', 
      label: 'Notes',
      desc: 'Browse Materials' 
    },
    { 
      path: '/pyq', 
      icon: '📝', 
      label: 'PYQs',
      desc: 'Previous Papers' 
    },
    { 
      path: '/important-questions', 
      icon: '⭐', 
      label: 'Important',
      desc: 'Key Questions' 
    },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      
      {/* ✅ Desktop Sidebar - Always Visible */}
      <aside className={`
        hidden md:flex flex-col
        w-64 bg-gray-950 border-r border-gray-800
        transition-all duration-300
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-sm">
              A
            </div>
            <span className="text-white font-semibold">AcademicArk AI</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all
                ${location.pathname === link.path
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }
              `}
            >
              <span className="text-xl">{link.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs opacity-70">{link.desc}</p>
              </div>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-gray-800">
          {isLoggedIn ? (
            <div className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-900 transition-all"
              >
                <img
                  src={data?.avatar?.secure_url || '/default-avatar.png'}
                  alt={data?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{data?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{data?.email}</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-all flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="block w-full px-3 py-2 text-center text-sm bg-white text-black rounded-lg hover:bg-gray-200 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </aside>

      {/* ✅ Mobile Sidebar - Overlay */}
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sliding Sidebar */}
          <aside className="md:hidden fixed inset-y-0 left-0 w-72 bg-gray-950 border-r border-gray-800 z-50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-sm">
                  A
                </div>
                <span className="text-white font-semibold">AcademicArk AI</span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-3 rounded-lg transition-all
                    ${location.pathname === link.path
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }
                  `}
                >
                  <span className="text-2xl">{link.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{link.label}</p>
                    <p className="text-xs opacity-70">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="p-3 border-t border-gray-800">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-900 transition-all"
                  >
                    <img
                      src={data?.avatar?.secure_url || '/default-avatar.png'}
                      alt={data?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{data?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{data?.email}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsSidebarOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsSidebarOpen(false)}
                  className="block w-full px-3 py-2 text-center text-sm bg-white text-black rounded-lg hover:bg-gray-200 transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </aside>
        </>
      )}

      {/* ✅ Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Hamburger */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-black font-bold text-xs">
              A
            </div>
            <span className="text-white font-semibold text-sm">AcademicArk AI</span>
          </Link>
          <div className="w-6"></div> {/* Spacer for centering */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AILayout;
