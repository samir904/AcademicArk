 const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = typeof window !== 'undefined' 
        ? window.localStorage.getItem(key) 
        : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  };

  return [storedValue, setValue];
};


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeLayout from '../../LAYOUTS/Homelayout';
import {
  HardDrive,
  Calendar,
  Bookmark,
  BarChart3,
  LogOut,
  ChevronRight,
  User,
  Info,
} from 'lucide-react';

const MySpace = ({ userData, role, onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get role/branch label
  const getRoleLabel = (userRole) => {
    const roleMap = {
      USER: 'STUDENT',
      TEACHER: 'TEACHER',
      ADMIN: 'ADMIN',
    };
    return roleMap[userRole] || userRole;
  };

  // Primary action cards - ordered by importance
  const getPrimaryActions = () => {
    return [
      {
        icon: HardDrive,
        label: 'My Downloads',
        description: 'Access your PDFs',
        path: '/downloads',
        accentColor: 'bg-indigo-500/20 text-indigo-400',
        borderColor: 'group-hover:border-indigo-500/30',
      },
      {
        icon: BarChart3,
        label: 'Attendance',
        description: 'Track your attendance',
        path: '/attendance',
        accentColor: 'bg-emerald-500/20 text-emerald-400',
        borderColor: 'group-hover:border-emerald-500/30',
      },
      {
        icon: Calendar,
        label: 'Smart Planner',
        description: 'Manage your schedule',
        path: '/planner',
        accentColor: 'bg-violet-500/20 text-violet-400',
        borderColor: 'group-hover:border-violet-500/30',
      },
      {
        icon: Bookmark,
        label: 'Bookmarks',
        description: 'Your saved notes',
        path: '/bookmarks',
        accentColor: 'bg-amber-500/20 text-amber-400',
        borderColor: 'group-hover:border-amber-500/30',
      },
    ];
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onLogout();
  };

  // Get semester and branch from user data
  const semester = userData?.semester || 'Semester 5';
  const branch = userData?.branch || 'Computer Science';
  const firstName = userData?.fullName?.split(' ')[0] || 'User';

  return (
    <HomeLayout>
      <div className="min-h-screen bg-[#0F0F0F] text-white pt-20 pb-28 px-4">
        <div className="max-w-2xl mx-auto">
          {/* GREETING HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              Hi, {firstName} 👋
            </h1>
            <p className="text-[#9CA3AF] text-sm">
              {semester} · {branch} · AKTU
            </p>
          </div>

          {/* PROFILE CARD - Minimal and Clean */}
          <div className="bg-[#1F1F1F] border border-[#2F2F2F] rounded-2xl p-6 md:p-8 mb-12">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#2F2F2F] flex items-center justify-center">
                  {userData?.avatar?.secure_url?.startsWith('http') ? (
                    <img
                      src={userData.avatar.secure_url}
                      alt="Profile"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {userData?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">
                  {userData?.fullName || 'User'}
                </h2>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  {userData?.email || 'user@example.com'}
                </p>
                <p className="text-xs text-[#4B5563] mt-1">
                  {getRoleLabel(role)}
                </p>
              </div>
            </div>
          </div>

          {/* PRIMARY ACTIONS - Large, Full-Width Cards */}
          <div className="space-y-3 mb-12">
            {getPrimaryActions().map((action) => {
              const IconComponent = action.icon;

              return (
                <Link key={action.label} to={action.path}>
                  <div className="group bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl p-5 md:p-6 hover:border-[#2F2F2F] hover:shadow-lg transition-all duration-300 flex items-center gap-4 cursor-pointer">
                    {/* Icon Container with Accent Color */}
                    <div
                      className={`flex-shrink-0 p-3.5 rounded-lg ${action.accentColor} transition-all duration-300`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-base">
                        {action.label}
                      </h3>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {action.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-[#4B5563] group-hover:text-[#9CA3AF] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* SECONDARY SECTION - Low Priority Links */}
          <div className="border-t border-[#1F1F1F] pt-8">
            <p className="text-[#4B5563] text-xs font-semibold uppercase tracking-widest mb-4">
              Other
            </p>

            <div className="space-y-2">
              {/* Account & Profile */}
              <Link to="/profile">
                <div className="group flex items-center gap-3 px-0 py-2.5 hover:bg-[#1F1F1F]/50 rounded-lg transition-colors duration-300 cursor-pointer">
                  <User className="w-4 h-4 text-[#4B5563] group-hover:text-[#9CA3AF]" />
                  <span className="text-sm text-[#9CA3AF] group-hover:text-white transition-colors">
                    Account & Profile
                  </span>
                </div>
              </Link>

              {/* About */}
              <Link to="/about">
                <div className="group flex items-center gap-3 px-0 py-2.5 hover:bg-[#1F1F1F]/50 rounded-lg transition-colors duration-300 cursor-pointer">
                  <Info className="w-4 h-4 text-[#4B5563] group-hover:text-[#9CA3AF]" />
                  <span className="text-sm text-[#9CA3AF] group-hover:text-white transition-colors">
                    About
                  </span>
                </div>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full group flex items-center gap-3 px-0 py-2.5 hover:bg-[#1F1F1F]/50 rounded-lg transition-colors duration-300 disabled:opacity-50 text-left"
              >
                <LogOut className="w-4 h-4 text-[#4B5563] group-hover:text-red-400" />
                <span className="text-sm text-[#9CA3AF] group-hover:text-red-400 transition-colors">
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </span>
              </button>
            </div>
          </div>

          {/* Safe Area for Bottom Navigation */}
          <div className="h-20" />
        </div>
      </div>
    </HomeLayout>
  );
};

export default MySpace;