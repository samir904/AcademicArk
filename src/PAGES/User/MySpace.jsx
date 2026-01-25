import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Settings,
  HardDrive,
  Calendar,
  Upload,
  BarChart3,
  LogOut,
  ChevronRight,
  Edit3,
  Shield,
  Info,
  CalendarCog,
  Bookmark,
  CircleArrowDown,
} from 'lucide-react';
import { useSelector } from 'react-redux';

const MySpace = ({  role, onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
const userData = useSelector((state) => state?.auth?.data);
  // Get role label
  const getRoleLabel = (userRole) => {
    const roleMap = {
      USER: 'STUDENT',
      TEACHER: 'TEACHER',
      ADMIN: 'ADMIN',
    };
    return roleMap[userRole] || userRole;
  };

  // Quick access menu items based on role
  const getQuickAccessItems = () => {
    const items = [
      {
        icon: CircleArrowDown,
        label: 'Downloads',
        description: 'Your downloaded PDFs',
        path: '/downloads',
        color: '#9CA3AF',
      },
      {
        icon: Bookmark,
        label: 'Bookmarks',
        description: 'Your saved notes',
        path: '/bookmarks',
        color: '#9CA3AF',
      },
      {
        icon: Calendar,
        label: 'Attendance',
        description: 'Track your attendance',
        path: '/attendance',
        color: '#9CA3AF',
      },
      ,
      {
        icon: CalendarCog,
        label: 'Smart Planner',
        description: 'Manage your schedule',
        path: '/planner',
        color: '#9CA3AF',
      },
    ];

    // Add role-specific items
    if (userData.role === 'TEACHER' || userData.role === 'ADMIN') {
      items.push({
        icon: Upload,
        label: 'Upload',
        description: 'Upload study materials',
        path: '/upload',
        color: '#9CA3AF',
      });
    }

    if (userData.role === 'ADMIN') {
      items.push({
        icon: BarChart3,
        label: 'Dashboard',
        description: 'View analytics',
        path: '/admin',
        color: '#9CA3AF',
      });
    }

    return items;
  };

  // Account settings menu
  const getAccountItems = () => {
    return [
      {
        icon: User,
        label: 'Profile',
        description: 'Edit your profile',
        path: '/profile',
      },
      {
        icon: Settings,
        label: 'Settings',
        description: 'App preferences',
        path: '/settings',
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
    <>
      <div className="min-h-screen bg-[#0F0F0F] text-white pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
           {/* GREETING HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              Hi, {firstName}
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
                <div className="w-16 h-16 rounded-full overflow-hidden border border-[#2F2F2F] flex items-center justify-center">
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

          {/* Quick Access Section */}
          <div className="mb-8">
            <div className="mb-4">
              <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-widest">
                Quick Access
              </p>
              <h3 className="text-xl font-semibold text-white mt-1">
                Common Actions
              </h3>
            </div>

            <div className="grid gap-3">
              {getQuickAccessItems().map((item) => {
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="group bg-[#1F1F1F] border border-[#1F1F1F] rounded-full p-4 md:p-5 hover:border-[#2F2F2F] hover:shadow-lg transition-all duration-300 flex items-center gap-4"
                  >
                    {/* Icon Container */}
                    <div className="flex-shrink-0 p-3 bg-[#1F1F1F] group-hover:bg-[#2F2F2F] rounded-lg transition-colors duration-300">
                      <IconComponent className="w-5 h-5 text-[#9CA3AF]" />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-white group-hover:text-[#9CA3AF] transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-sm text-[#9CA3AF]/70 group-hover:text-[#9CA3AF] transition-colors">
                        {item.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-[#9CA3AF]/50 group-hover:text-[#9CA3AF] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
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

          {/* Info Section */}
          {/* <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              About My Space
            </h3>
            <div className="space-y-3">
              <p className="text-[#9CA3AF] text-sm leading-relaxed">
                <strong>My Space</strong> is your personal hub where you can access all your important features and settings in one calm, organized place.
              </p>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">
                Navigate easily to your downloads, attendance, profile settings, and more without feeling lost. Everything you need is just one tap away.
              </p>
            </div>
          </div> */}

          {/* Logout Button */}
          {/* <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-xl text-red-400 hover:text-red-300 font-semibold transition-all duration-300 disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button> */}

          {/* Safe Area for Mobile */}
          <div className="h-20" />
        </div>
      </div>
    </>
  );
};

export default MySpace;