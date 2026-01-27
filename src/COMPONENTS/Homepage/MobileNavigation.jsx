// 1️⃣ UPDATE: MobileNavigation Component with Profile Drawer

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    CalendarCog,
    DownloadIcon,
    UploadIcon,
    SettingsIcon,
    UserIcon,
    LogOut,
    X,
    Upload,
    CheckCircle
} from "lucide-react";
// Add this with other icon components
const AttendanceIcon = ({ className, active }) => (
    <svg
        className={className}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 0 : 2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
    </svg>
);

const DashboardIcon = ({ className, active }) => (
    <svg
        className={className}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 0 : 2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
    </svg>
);

const MobileNavigation = ({
    isLoggedIn,
    userData,
    role,
    onLogout,
    showMobileMenu,
    setShowMobileMenu,
}) => {
    const [showProfileDrawer, setShowProfileDrawer] = useState(false);

    // 📌 Main navigation items (WITHOUT Download/Attendance)
    const getMobileNavItems = () => {
        const baseItems = [
            {
                name: "Home",
                path: "/",
                icon: HomeIcon,
                label: "Home",
            },
            {
                name: "Search",
                path: "/search",
                icon: SearchIcon,
                label: "Search",
            },
            {
                name: "Library",
                path: "/notes",
                icon: LibraryIcon,
                label: "Library",
            },
            {
                name: "Planner",
                label: "Planner",
                path: "/planner",
                icon: CalendarCog,
            },
        ];

        // Add role-specific navigation
        // if (isLoggedIn) {
        //     if (role === "ADMIN") {
        //         baseItems.push({
        //             name: "Dashboard",
        //             path: "/admin",
        //             icon: DashboardIcon,
        //             label: "Dash",
        //         });
        //     } else if (role === "TEACHER") {
        //         baseItems.push({
        //             name: "Upload",
        //             path: "/upload",
        //             icon: UploadIcon,
        //             label: "Upload",
        //         });
        //     }
        // }

        return baseItems;
    };

    // 📌 Profile menu items (Download, Attendance, Role-specific)
    const getProfileMenuItems = () => {
        const items = [
            {
                name: "Downloads",
                path: "/downloads",
                icon: DownloadIcon,
                label: "Downloads",
            },
            {
                name: "Attendance",
                path: "/attendance",
                icon: AttendanceIcon,
                label: "Attendance",
            },
        ];

        // Add role-specific profile menu items
        if (role === "ADMIN") {
            items.push({
                name: "Upload",
                path: "/upload",
                icon: UploadIcon,
                label: "Upload",
            });
            items.push({
                name: "Dashboard",
                path: "/admin",
                icon: DashboardIcon,
                label: "Dashboard",
            })
        } else if (role === "TEACHER") {
            items.push({
                name: "Upload",
                path: "/upload",
                icon: UploadIcon,
                label: "Upload",
            });
        }

        return items;
    };

    // 🎯 Helper function to map role names
    const getRoleLabel = (userRole) => {
        const roleMap = {
            USER: "STUDENT",
            TEACHER: "TEACHER",
            ADMIN: "ADMIN",
        };
        return roleMap[userRole] || userRole;
    };
    // ✅ UPDATED: Track active state for My Space & related pages
const isActiveLink = (path) => {
    const currentPath = window.location.pathname;
    
    // My Space stays active for all related pages
    if (path === '/myspace') {
        return currentPath === '/myspace' || 
               currentPath === '/downloads' || 
               currentPath === '/attendance' || 
               currentPath=== '/admin'||
               currentPath==='/upload'||
               currentPath === '/profile' || 
               currentPath === '/settings';
    }
    
    // Other paths check exact match
    return currentPath === path;
};


    const handleLogout = () => {
        setShowProfileDrawer(false);
        onLogout();
    };
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

    const dismissalKey = `user_${userData?.id}_navInfoDismissed`;
    const [hasSeenInfo, setHasSeenInfo] = useLocalStorage(dismissalKey, false);
    const [showInfoBanner, setShowInfoBanner] = useState(!hasSeenInfo);
    const dismissInfoBanner = () => {
        setShowInfoBanner(false);      // Hide immediately
        setHasSeenInfo(true);          // Save to localStorage
    };

    return (
        <>
            {/* 🎨 SPOTIFY-STYLE BOTTOM NAVIGATION */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />

                {/* Navigation Items */}
                <div className="relative px-4 py-3 flex items-center justify-between">
                    {/* Main navigation items */}
                    <div className="flex flex-1 items-center justify-around">
                        {getMobileNavItems().map((item) => {
                            const IconComponent = item.icon;
                            const isActive = isActiveLink(item.path);

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setShowMobileMenu(false)}
                                    className="flex flex-col items-center gap-1.5"
                                >
                                    {/* Icon Container */}
                                    <div
                                        className={`
                      p-3 rounded-full transition-all duration-200
                      ${isActive
                                                ? "bg-white/10 text-white ring-1 ring-white/20"
                                                : "bg-transparent text-gray-500 hover:text-gray-300"
                                            }
                    `}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                    </div>

                                    {/* Label */}
                                    <span
                                        className={`text-[11px] font-medium tracking-wide ${isActive ? "text-white" : "text-gray-500"
                                            }`}
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Profile Icon - Bottom Right */}
                    {isLoggedIn && (
                        <Link
                        to={'/myspace'}
                            // onClick={() => setShowProfileDrawer(!showProfileDrawer)}
                            className="flex flex-col items-center gap-1.5 ml-2"
                        >
                            {/* Avatar Container */}
                            <div
                                className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 
                hover:border-white/40 transition-all duration-200 flex-shrink-0 
                cursor-pointer hover:scale-105"
                            >
                                {userData?.avatar?.secure_url?.startsWith("http") ? (
                                    <img
                                        src={userData.avatar.secure_url}
                                        alt="Profile"
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                        {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>

                            {/* Label - WHITE when active ✅ FIXED */}
                            <span className={`text-[11px] font-medium tracking-wide ${isActiveLink('/myspace') ? "text-white" : "text-gray-500"}`}>
                                My Space
                            </span>
                        </Link>
                    )}
                </div>

                {/* Safe Area */}
                <div className="h-2" />
            </div>
            {showInfoBanner && isLoggedIn && (
                <div className="fixed top-0 left-0 right-0 z-50 md:hidden px-4 pt-4">
                    <div className="bg-[#0F0F0F] border border-black 
    rounded-2xl p-4 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-400" />

                        <div className="flex-1">
                            <p className="text-sm font-medium text-white">Navigation Updated</p>
                            <p className="text-xs text-gray-300 mt-1">
                                Attendance & Downloads have moved to your <strong>Profile Menu</strong> (bottom right)
                            </p>
                        </div>

                        <button onClick={dismissInfoBanner} className="...">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* 📱 PROFILE DRAWER MODAL */}
            {showProfileDrawer && isLoggedIn && (
                <div
                    className="fixed inset-0 z-50 md:hidden"
                    onClick={() => setShowProfileDrawer(false)}
                >
                    {/* Semi-transparent Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Drawer - Slide up from bottom */}
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-gray-900 to-black rounded-t-3xl 
            shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowProfileDrawer(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-gray-300" />
                        </button>

                        <div className="px-6 py-8 pb-32">
                            {/* 👤 USER PROFILE SECTION */}
                            <div className="flex items-center gap-4 mb-8 mt-6">
                                {/* Avatar */}
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                                    {userData?.avatar?.secure_url?.startsWith("http") ? (
                                        <img
                                            src={userData.avatar.secure_url}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                                            {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white">
                                        {userData?.fullName || "User"}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {userData?.email || "user@example.com"}
                                    </p>
                                    <div className="mt-2 inline-block px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                                        <span className="text-xs font-semibold text-blue-300">
                                            {getRoleLabel(role)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/10 mb-6" />
{/* 🔗 PROFILE ACTIONS */}
                            <div className="space-y-2 mb-6">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-4">
                                    Account
                                </p>

                                <Link
                                    to="/profile"
                                    onClick={() => setShowProfileDrawer(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 
                  transition-colors text-gray-300 hover:text-white"
                                >
                                    <UserIcon className="w-5 h-5" />
                                    <span className="text-sm font-medium">View Profile</span>
                                </Link>

                                <Link
                                    to="/settings"
                                    onClick={() => setShowProfileDrawer(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 
                  transition-colors text-gray-300 hover:text-white"
                                >
                                    <SettingsIcon className="w-5 h-5" />
                                    <span className="text-sm font-medium">Settings</span>
                                </Link>
                            </div>
                            

                            {/* Divider */}
                            <div className="h-px bg-white/10 mb-6" />

                            

                            {/* 📋 PROFILE MENU ITEMS */}
                            <div className="space-y-2 mb-6">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-4">
                                    Quick Access
                                </p>

                                {getProfileMenuItems().map((item) => {
                                    const IconComponent = item.icon;

                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setShowProfileDrawer(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 
                      transition-colors text-gray-300 hover:text-white"
                                        >
                                            <IconComponent className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/10 mb-6" />

                            {/* 🚪 LOGOUT BUTTON */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 
                hover:bg-red-500/30 rounded-lg border border-red-500/30 hover:border-red-500/50
                text-red-400 hover:text-red-300 font-medium transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MobileNavigation;
