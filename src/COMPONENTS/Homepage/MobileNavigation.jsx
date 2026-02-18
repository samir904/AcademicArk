import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  BookOpen,
  CalendarCog,
  Download,
  Upload,
  Settings,
  User,
  LogOut,
  X,
  CheckCircle,
  ChevronRight,
  Library,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logFailedSearchAction } from "../../REDUX/Slices/failedSearchSlice";
import { clearSearch } from "../../REDUX/Slices/searchSlice";


// ============================================
// 🎯 CUSTOM SVG ICONS
// ============================================
const AttendanceIcon = () => (
  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);


const DashboardIcon = () => (
  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);


// ============================================
// 🎯 NAV ITEM COMPONENT
// ============================================
const NavItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;


  return (
    <Link
      to={item.path}
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-1 flex-1 py-1 group"
    >
      {/* Active pill background */}
      <div
        className={`
          relative flex items-center justify-center
          rounded-2xl transition-all duration-300 ease-out
          ${isActive
            ? "bg-white/[0.08] w-14 h-9"
            : "w-10 h-9"
          }
        `}
      >
        {/* Icon */}
        <Icon
          className={`
            transition-all duration-300 ease-out
            ${isActive
              ? "text-white w-[22px] h-[22px]"
              : "text-zinc-500 w-[22px] h-[22px] group-hover:text-zinc-300"
            }
          `}
          strokeWidth={isActive ? 2.2 : 1.8}
        />


        {/* Active indicator dot (top of pill) */}
        {/* {isActive && (
          <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
        )} */}
      </div>


      {/* Label */}
      <span
        className={`
          text-[10px] font-medium tracking-wide transition-all duration-300
          ${isActive ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"}
        `}
      >
        {item.label}
      </span>
    </Link>
  );
};


// ============================================
// 🎯 MAIN COMPONENT
// ============================================
const MobileNavigation = ({
  isLoggedIn,
  userData,
  role,
  onLogout,
  showMobileMenu,
  setShowMobileMenu,
}) => {
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const dispatch = useDispatch();


  const { hasSubmitted, searchResults, searchAnalyticsId } = useSelector(
    (state) => state.search
  );


  const isFailedSearch =
    hasSubmitted &&
    Array.isArray(searchResults) &&
    searchResults.length === 0 &&
    typeof searchAnalyticsId === "string";


  // localStorage hook
  const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = React.useState(() => {
      try {
        const item = typeof window !== "undefined"
          ? window.localStorage.getItem(key) : null;
        return item ? JSON.parse(item) : initialValue;
      } catch { return initialValue; }
    });


    const setValue = (value) => {
      try {
        const v = value instanceof Function ? value(storedValue) : value;
        setStoredValue(v);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(v));
        }
      } catch (e) { console.error(e); }
    };


    return [storedValue, setValue];
  };


  const [hasSeenInfo, setHasSeenInfo] = useLocalStorage(
    `user_${userData?.id}_navInfoDismissed`, false
  );
  const [showInfoBanner, setShowInfoBanner] = useState(!hasSeenInfo);


  // Active check
  const isActiveLink = (path) => {
    if (path === "/" || path === "/home") {
      return currentPath === "/" || currentPath === "/home";
    }
    if (path === "/myspace") {
      return ["/myspace", "/downloads", "/attendance", "/admin",
        "/upload", "/profile", "/settings"].includes(currentPath);
    }
    return currentPath === path;
  };


  // Nav items
  const navItems = [
    { name: "Home", path: isLoggedIn ? "/home" : "/", icon: Home, label: "Home" },
    { name: "Search", path: "/search", icon: Search, label: "Search" },
    { name: "Library", path: "/notes", icon: Library, label: "Library" },
    { name: "Planner", path: "/planner", icon: CalendarCog, label: "Planner" },
  ];


  const profileMenuItems = [
    { name: "Downloads", path: "/downloads", icon: Download, label: "Downloads", custom: false },
    { name: "Attendance", path: "/attendance", icon: AttendanceIcon, label: "Attendance", custom: true },
    ...(role === "ADMIN" || role === "TEACHER"
      ? [{ name: "Upload", path: "/upload", icon: Upload, label: "Upload", custom: false }]
      : []),
    ...(role === "ADMIN"
      ? [{ name: "Dashboard", path: "/admin", icon: DashboardIcon, label: "Dashboard", custom: true }]
      : []),
  ];


  const getRoleLabel = (r) =>
    ({ USER: "Student", TEACHER: "Teacher", ADMIN: "Admin" }[r] || r);


  const getRoleColor = (r) => ({
    USER: "bg-blue-500/15 text-blue-300 border-blue-500/20",
    TEACHER: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    ADMIN: "bg-purple-500/15 text-purple-300 border-purple-500/20",
  }[r] || "bg-zinc-500/15 text-zinc-300 border-zinc-500/20");


  return (
    <>
      {/* ============================================
          🎨 BOTTOM NAV BAR
      ============================================ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        
        {/* Glass bar */}
        <div
          className="relative mx-3 mb-3 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(12, 12, 12, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 -1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.5)"
          }}
        >
          <div className="flex items-center px-1 py-1">
            {/* Main Nav Items */}
            {navItems.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                isActive={isActiveLink(item.path)}
                onClick={() => {
                 if (item.path === "/notes" && isFailedSearch) {
                                            dispatch(
                                                logFailedSearchAction({
                                                    searchAnalyticsId,
                                                    action: "opened_library",
                                                    value: "navbar_mobile"
                                                })
                                            );
                                        }
                  setShowMobileMenu(false);
                  dispatch(clearSearch());
                }}
              />
            ))}


            {/* Divider */}
            {isLoggedIn && (
              <div className="w-px h-8 bg-white/[0.06] mx-1 flex-shrink-0" />
            )}


            {/* Profile Button */}
            {isLoggedIn && (
              <Link
                to="/myspace"
                className="flex flex-col items-center justify-center gap-1 px-2 flex-shrink-0 group"
              >
                <div
                  className={`
                    relative rounded-full transition-all duration-300 p-0.5
                    ${isActiveLink("/myspace")
                      ? "ring-1 ring-white/30"
                      : "ring-1 ring-white/0 group-hover:ring-white/10"
                    }
                  `}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {userData?.avatar?.secure_url?.startsWith("http") ? (
                      <img
                        src={userData.avatar.secure_url}
                        alt="Profile"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full rounded-full h-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm">
                        {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>


                  {/* Active indicator */}
                  {/* {isActiveLink("/myspace") && (
                    <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )} */}
                </div>


                <span className={`
                  text-[10px] font-medium tracking-wide transition-colors duration-300
                  ${isActiveLink("/myspace") ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"}
                `}>
                  My Space
                </span>
              </Link>
            )}
          </div>
        </div>


        {/* Safe area */}
        <div className="h-1" />
      </div>


      {/* ============================================
          💡 INFO BANNER
      ============================================ */}
      {showInfoBanner && isLoggedIn && (
        <div className="fixed top-3 left-3 right-3 z-50 md:hidden">
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: "rgba(20, 20, 20, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Nav Updated</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Attendance & Downloads → <strong className="text-zinc-200">Me</strong> tab
              </p>
            </div>
            <button
              onClick={() => {
                setShowInfoBanner(false);
                setHasSeenInfo(true);
              }}
              className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
      )}


      {/* ============================================
          📱 PROFILE DRAWER
      ============================================ */}
      {showProfileDrawer && isLoggedIn && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setShowProfileDrawer(false)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          />


          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-[28px] overflow-hidden"
            style={{
              background: "rgba(10, 10, 10, 0.98)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderBottom: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full bg-white/20" />
            </div>


            <div className="px-5 pb-10 pt-2 max-h-[80vh] overflow-y-auto">
              
              {/* User card */}
              <div
                className="flex items-center gap-4 p-4 rounded-2xl mb-6"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                  {userData?.avatar?.secure_url?.startsWith("http") ? (
                    <img src={userData.avatar.secure_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl">
                      {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{userData?.fullName}</p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{userData?.email}</p>
                  <span className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRoleColor(role)}`}>
                    {getRoleLabel(role)}
                  </span>
                </div>
              </div>


              {/* Account section */}
              <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest px-1 mb-2">
                Account
              </p>
              <div className="rounded-2xl overflow-hidden mb-5" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  { to: "/profile", icon: User, label: "View Profile" },
                  { to: "/settings", icon: Settings, label: "Settings" },
                ].map(({ to, icon: Icon, label }, i, arr) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setShowProfileDrawer(false)}
                    className={`
                      flex items-center justify-between px-4 py-3.5
                      hover:bg-white/[0.04] transition-colors
                      ${i < arr.length - 1 ? "border-b border-white/[0.04]" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-zinc-300" />
                      </div>
                      <span className="text-sm font-medium text-zinc-200">{label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </Link>
                ))}
              </div>


              {/* Quick access section */}
              <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest px-1 mb-2">
                Quick Access
              </p>
              <div className="rounded-2xl overflow-hidden mb-5" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                {profileMenuItems.map((item, i, arr) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setShowProfileDrawer(false)}
                      className={`
                        flex items-center justify-between px-4 py-3.5
                        hover:bg-white/[0.04] transition-colors
                        ${i < arr.length - 1 ? "border-b border-white/[0.04]" : ""}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center">
                          <Icon className="w-4 h-4 text-zinc-300" />
                        </div>
                        <span className="text-sm font-medium text-zinc-200">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    </Link>
                  );
                })}
              </div>


              {/* Logout */}
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl
                  text-red-400 font-medium text-sm transition-all
                  hover:bg-red-500/10 active:scale-[0.98]"
                style={{ border: "1px solid rgba(239,68,68,0.15)" }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default MobileNavigation;  