// src/components/layouts/HomeLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../HELPERS/Toaster";
import { getProfile, logout } from "../REDUX/Slices/authslice";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import NotificationBanner from "../COMPONENTS/NotificationBanner";
import { MovingBorderButton } from "../COMPONENTS/MovingBorderButton";
import { MovingBorderLoginButton } from "../COMPONENTS/MovingBorderLoginButton";
import MilestoneBanner from "../COMPONENTS/MilestoneBanner";
import { checkProfileCompletion } from '../REDUX/Slices/academicProfileSlice'; // ✨ NEW
import AcademicProfileModal from '../COMPONENTS/AcademicProfileModal'; // ✨ NEW
import EnhancedFooter from "./EnhancedFooter";
import FeedbackForm from "../COMPONENTS/FeedbackForm";
import PWAInstallPrompt from "../COMPONENTS/PWAInstallPrompt";
import OfflineModal from "../COMPONENTS/OfflineModal";
import { Trophy, CalendarCog, CircleArrowDown, Clock, LogOut, LayoutDashboard, Video, Bookmark, Upload, User } from "lucide-react";
import MobileNavigation from "../COMPONENTS/Homepage/MobileNavigation";
import { AnimatePresence } from "framer-motion";
import ScrollRestoration from "../COMPONENTS/ScrollRestoration";
import {
  Home,
  Search,
  Library,
  Calendar,
  Download,
  CornerDownLeft
} from "lucide-react";
import { clearSearch, resetResultsOnly, setSearchQuery } from "../REDUX/Slices/searchSlice";
import { logFailedSearchAction } from "../REDUX/Slices/failedSearchSlice";
import { fetchSearchSuggestions, clearSuggestions }
  from "../REDUX/Slices/searchSuggestionSlice";
import { fetchRecentSearches } from "../REDUX/Slices/searchAnalyticsSlice";
import SupportInfoBanner from "../COMPONENTS/Support/SupportInfoBanner";

// SVG Icons Components
const HomeIcon = ({ className, active }) => (
  <svg className={className} viewBox="0 0 24 24">
    {active ? (
      // Filled version - solid house
      <path
        fill="currentColor"
        d="M12.5 2.134a1 1 0 00-1 0L4 7.577V19a1 1 0 001 1h4v-7h6v7h4a1 1 0 001-1V7.577l-7.5-5.443z"
      />
    ) : (
      // Outline version
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    )}
    {!active && (
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="9,22 9,12 15,12 15,22"
      />
    )}
  </svg>
);
const LoginIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-down-icon lucide-circle-arrow-down"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="m8 12 4 4 4-4" /></svg>
);

const TrophyIcon = () => {
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy-icon lucide-trophy"><path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" /><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" /><path d="M18 9h1.5a1 1 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" /><path d="M6 9H4.5a1 1 0 0 1 0-5H6" /></svg>
}
const SearchIcon = ({ className, active }) => (
  <svg className={className} viewBox="0 0 24 24">
    {active ? (
      <path
        fill="currentColor"
        d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      />
    ) : (
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    )}
  </svg>
);

const LibraryIcon = ({ className = "", active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library-icon lucide-library"><path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4v16" /></svg>
);


const UploadIcon = ({ className, active }) => (
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
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
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

const UserIcon = ({ className, active }) => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const MenuIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const BellIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12c.94-.3 1.92-.94 1.92-.94M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1"
    />
  </svg>
);
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

const HomeLayout = () => {


  // const TravelingDotButton = () => (
  //   <Link
  //     to="/login"
  //     className="relative inline-flex items-center space-x-2 bg-black text-white px-6 py-3  font-semibold group overflow-hidden transition-all duration-300 hover:scale-105"
  //   >
  //     {/* Border Container */}
  //     <div className="absolute inset-0 rounded-xl">
  //       {/* Top line */}
  //       <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-800 rounded-full">
  //         <div className="absolute top-0 left-0 w-6 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full animate-travel-top"></div>
  //       </div>

  //       {/* Right line */}
  //       <div className="absolute top-0 right-0 w-0.5 h-full bg-gray-800 rounded-full">
  //         <div className="absolute top-0 right-0 w-0.5 h-6 bg-gradient-to-b from-transparent via-purple-500 to-transparent rounded-full animate-travel-right"></div>
  //       </div>

  //       {/* Bottom line */}
  //       <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gray-800 ">
  //         <div className="absolute bottom-0 right-0 w-6 h-0.5 bg-gradient-to-l from-transparent via-pink-500 to-transparent rounded-full animate-travel-bottom"></div>
  //       </div>

  //       {/* Left line */}
  //       <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gray-800 ">
  //         <div className="absolute bottom-0 left-0 w-0.5 h-6 bg-gradient-to-t from-transparent via-cyan-500 to-transparent rounded-full animate-travel-left"></div>
  //       </div>
  //     </div>

  //     {/* Content */}
  //     <div className="relative z-10 flex items-center space-x-2">
  //       {/* <div className="p-1.5  rounded-lg group-hover:animate-spin">
  //         <LoginIcon className="w-4 h-4" />
  //       </div> */}
  //       <span className=" bg-clip-text  text-white font-bold tracking-wide">
  //         Sign In
  //       </span>
  //     </div>

  //     {/* Corner Dots */}
  //     <div className="absolute top-1 left-1 w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
  //     <div className="absolute top-1 right-1 w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-500"></div>
  //     <div className="absolute bottom-1 right-1 w-1 h-1 bg-pink-500 rounded-full animate-pulse delay-1000"></div>
  //     <div className="absolute bottom-1 left-1 w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-1500"></div>
  //   </Link>
  // );
  const [showFeedback, setShowFeedback] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchWrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const role = useSelector((state) => state?.auth?.role || "");
  const userData = useSelector((state) => state?.auth?.data);
  const loginMethod = useSelector((state) => state?.auth?.loginMethod);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // useEffect(() => {
  //     // Only fetch profile if not already logged in and no token check is in progress
  //     if (!isLoggedIn && !userData?._id) {
  //         dispatch(getProfile());
  //     }
  // }, [dispatch, isLoggedIn, userData?._id]);
  // Smooth scroll version
  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: "smooth",
  //   });
  // }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const handleClickOutside = () => {
      setShowProfileMenu(false);
      setShowMobileMenu(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const isActiveLink = (path) => location.pathname === path;

  //   const handleLogout = async () => {
  //   try {
  //     const result = await dispatch(logout());

  //     if (logout.fulfilled.match(result)) {
  //       // ✅ MUST happen AFTER logout thunk completes
  //       // Clear localStorage BEFORE navigating
  //       localStorage.removeItem('isLoggedIn');
  //       localStorage.removeItem('data');
  //       localStorage.removeItem('role');
  //       localStorage.removeItem('currentSemester');  // Also clear other storage

  //       // Clear sessionStorage
  //       sessionStorage.clear();

  //       // Clear cookies (do this more thoroughly)
  //       document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  //       document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure';

  //       // ✅ CRITICAL: Dispatch logout action to Redux reducer
  //       // (Make sure your Redux logout.fulfilled case clears state)

  //       // Navigate AFTER everything is cleared
  //       navigate("/");

  //       // Optional: Force a hard refresh after logout
  //       // window.location.href = "/";
  //     }
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //   }
  // };

  // Get navigation items based on role
  const handleLogout = async () => {
    try {
      // 1. Call logout API
      const result = await dispatch(logout());

      // 2. ALWAYS clear storage, regardless of API response
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("data");
      localStorage.removeItem("role");
      localStorage.removeItem("currentSemester");

      sessionStorage.clear();

      // 3. Clear all cookies
      document.cookie = "token=; path=/; max-age=0";
      document.cookie = "token=; path=/; max-age=0; SameSite=None; Secure";

      // 4. Reset Redux state
      dispatch(clearAuthState()); // ✅ Add this action

      // 5. Navigate after clearing everything
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear storage even if API fails
      localStorage.clear();
      navigate("/", { replace: true });
    }
  };

  // ✨ NEW: Check academic profile on mount
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(checkProfileCompletion());
    }
  }, [isLoggedIn, dispatch]);
  const [showFeedbackText, setShowFeedbackText] = useState(true);

  // ✅ Hide feedback text after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeedbackText(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);
  const query = useSelector(state => state.search.query);

  const handleSearchChange = (e) => {
    const value = e.target.value;

    dispatch(setSearchQuery(value));
    dispatch(resetResultsOnly());
    setIsSearchOpen(true); // 👈 keep open while typing
  };

  const isActive = (path) => location.pathname === path;

  const isSearchPage = location.pathname === "/search";
  const { loading: isSearching } = useSelector(state => state.search);
  const { hasSubmitted, searchResults, searchAnalyticsId } = useSelector(state => state.search);
  const isFailedSearch =
    hasSubmitted &&
    Array.isArray(searchResults) &&
    searchResults.length === 0 &&
    typeof searchAnalyticsId === "string";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
        dispatch(clearSuggestions());
      }
    };

    const handleScroll = () => {
      setIsSearchOpen(false);
      dispatch(clearSuggestions());
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.addEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  const { suggestions, loading } = useSelector(
    state => state.searchSuggestion
  );
  const { recentSearches, loadingRecent } = useSelector((state) => state?.searchAnalytics)


  useEffect(() => {
    if (!query || query.trim().length < 1) {
      dispatch(clearSuggestions());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(fetchSearchSuggestions(query));
    }, 300);

    return () => clearTimeout(timer);
  }, [query, dispatch]);
const SUPPORT_BANNER_KEY = "aa_support_banner_dismissed_v1";

const [showSupportBanner, setShowSupportBanner] = useState(false);

const supportBannerTimerRef = useRef(null);

const userAccess = useSelector(state => state.auth?.data?.access);

const hasActivePlan =
  userAccess?.plan &&
  userAccess?.expiresAt &&
  new Date(userAccess.expiresAt) > new Date();
useEffect(() => {
  console.group("🧪 Support Banner Debug");

  console.log("isLoggedIn:", isLoggedIn);
  console.log("hasActivePlan:", hasActivePlan);
  console.log(
    "dismissed:",
    localStorage.getItem(SUPPORT_BANNER_KEY)
  );

  if (!isLoggedIn) {
    console.log("❌ Blocked: not logged in");
    console.groupEnd();
    return;
  }

  if (localStorage.getItem(SUPPORT_BANNER_KEY) === "true") {
    console.log("❌ Blocked: already dismissed");
    console.groupEnd();
    return;
  }

  if (hasActivePlan) {
    console.log("❌ Blocked: active plan");
    console.groupEnd();
    return;
  }

  console.log("✅ Banner WILL be scheduled");
  console.groupEnd();

  supportBannerTimerRef.current = setTimeout(() => {
    console.log("🚀 Showing support banner");
    setShowSupportBanner(true);
  }, 6000);

  return () => clearTimeout(supportBannerTimerRef.current);
}, [isLoggedIn, hasActivePlan]);

const dismissSupportBanner = () => {
  console.log("🟢 Dismissing support banner");
  localStorage.setItem(SUPPORT_BANNER_KEY, "true");
  setShowSupportBanner(false);
};





  return (
    <>
      {/* <OfflineRedirect/> */}
      <OfflineModal />
      <PWAInstallPrompt />
      {/* Notification banner - rendered independently */}
      <NotificationBanner />

      {/* 🎉 NEW: Milestone celebration */}
      {/* <MilestoneBanner /> */}
      <ScrollRestoration />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Dynamic Background */}
        <div
          className="fixed inset-0 opacity-[0.02] pointer-events-none transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
        />


        {/* Desktop Header */}
        <header
          className={`hidden md:block fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled
            ? "bg-black/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
            : "bg-transparent"
            }`}
        >
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
                  <div className="text-xs text-gray-500 -mt-1">
                    Excellence in Learning
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-2 bg-transparent backdrop-blur-xl rounded-full p-2 border border-transparent">

                {/* HOME */}


                <div className="flex flex-col items-center gap-1">
                  <Link
                    to="/"
                    className={`
      flex items-center justify-center
      w-11 h-11 rounded-full transition-all duration-300
      ${isActive("/")
                        ? "bg-white text-black shadow-md"
                        : "bg-[#1F1F1F] text-gray-400 border border-white/10 hover:bg-[#2A2A2A] hover:text-white"}
    `}
                  >
                    <Home size={22} />
                  </Link>

                  <span
                    className={`
      text-[10px] leading-none
      ${isActive("/") ? "text-white" : "text-gray-400"}
    `}
                  >
                    Home
                  </span>
                </div>

                {/* SEARCH INPUT */}
                {/* SEARCH INPUT */}
                <div ref={searchWrapperRef} className="relative">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!query?.trim() || isSearching) return;
                      dispatch(clearSuggestions()); // 👈 ADD THIS
                      // 🔥 CASE 2: Retry search
                      if (isFailedSearch) {
                        dispatch(
                          logFailedSearchAction({
                            searchAnalyticsId,
                            action: "retry_search",
                            value: query
                          })
                        );
                      }
                      navigate(`/search?query=${encodeURIComponent(query)}`);
                    }}
                    className="mx-1"
                  >

                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`
    relative transition-all duration-200
    ${isSearching ? "scale-[0.98] opacity-90" : "scale-100"}
  `}
                      >

                        {/* LEFT ICON */}
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        {/* INPUT */}
                        <input
                          type="text"
                          ref={searchInputRef}
                          onFocus={() => {
                            setIsSearchOpen(true);

                            // recent searches only when query empty
                            if (!query?.trim()) {
                              dispatch(fetchRecentSearches());
                            }
                          }}
                          value={query || ""}
                          onChange={handleSearchChange}
                          placeholder="Search DBMS, OS, PYQs…"
                          className="
          w-100 h-11
          pl-9 pr-10
          bg-[#1F1F1F]
          border border-white/10
          rounded-full
          text-sm text-white
          placeholder-gray-500
          outline-none ring-0
          focus:border-white/20
        "
                        />

                        {/* RIGHT SEARCH BUTTON */}
                        {query?.trim() && (
                          <button
                            type="submit"
                            disabled={isSearching}
                            className={`
      absolute right-2 top-1/2 -translate-y-1/2
      w-7 h-7 flex items-center justify-center
      rounded-full transition-all
      ${isSearching
                                ? "bg-white/20 scale-90 cursor-not-allowed"
                                : "bg-white/10 hover:bg-white/20 active:scale-95"
                              }
    `}
                            aria-label="Search"
                          >
                            {isSearching ? (
                              <svg
                                className="w-3 h-3 animate-spin text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  className="opacity-25"
                                />
                                <path
                                  d="M22 12a10 10 0 00-10-10"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  className="opacity-75"
                                />
                              </svg>
                            ) : (
                              <Search size={14} />
                            )}
                          </button>
                        )}

                      </div>

                      {/* invisible spacer to align with icon+label nav items */}
                      <span className="text-[10px] leading-none opacity-0 select-none">
                        Search
                      </span>
                    </div>
                  </form>
                  {isSearchOpen &&
                    query?.trim().length >= 2 &&
                    suggestions.length > 0 && (

                      <div
                        className="
      absolute top-full left-0 right-0  -mt-[10px]
      bg-[#111111]
      border border-white/10
      rounded-xl
      shadow-2xl
      overflow-hidden
      z-50
    "
                      >
                        {suggestions.map((s, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              dispatch(setSearchQuery(s));
                              dispatch(clearSuggestions());
                              navigate(`/search?query=${encodeURIComponent(s)}`);
                            }}
                            className="
          group w-full flex items-center justify-between
          px-4 py-3
          text-sm text-gray-300
          hover:bg-[#1F1F1F]
          hover:text-white
          transition
          mt-0
        "
                          >
                            {/* Left side: icon + text */}
                            <div className="flex items-center gap-3">
                              <Search
                                size={14}
                                className="text-gray-500 group-hover:text-gray-300 transition"
                              />
                              <span className="truncate">{s}</span>
                            </div>

                            {/* Right side: subtle hint */}
                            <CornerDownLeft
                              size={14}
                              className="text-gray-600 opacity-0 group-hover:opacity-100 transition"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  {isSearchOpen &&
                    !query?.trim() &&
                    recentSearches.length > 0 && (
                      <div className="absolute top-full left-0 right-0 -mt-[10px] 
   bg-[#111111]
      border border-white/10
      rounded-xl
      shadow-2xl
      overflow-hidden
      z-50
  ">
                        {recentSearches.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              dispatch(setSearchQuery(item.query));
                              setIsSearchOpen(false);
                              navigate(`/search?query=${encodeURIComponent(item.query)}`);
                            }}
                            className="group w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1F1F1F]"
                          >
                            <Clock size={14} className="text-gray-500" />
                            <span className="truncate">{item.query}</span>
                          </button>
                        ))}
                      </div>
                    )}

                </div>

                <div className="flex flex-col items-center gap-1">
                  <Link
                    to="/notes"
                    onClick={() => {
                      if (isFailedSearch) {
                        dispatch(
                          logFailedSearchAction({
                            searchAnalyticsId,
                            action: "opened_library",
                            value: query || null
                          })
                        );
                      }

                      dispatch(clearSearch());
                    }}
                    className={`
    flex items-center justify-center
    w-10 h-10 rounded-full transition
    ${isActive("/notes")
                        ? "bg-white text-black shadow-md"
                        : "bg-[#1F1F1F] text-gray-400 border border-white/10 hover:bg-[#2A2A2A] hover:text-white"}
  `}
                  >
                    <Library size={22} />
                  </Link>


                  <span
                    className={`
      text-[10px] leading-none
      ${isActive("/notes") ? "text-white" : "text-gray-400"}
    `}
                  >
                    Library
                  </span>
                </div>

                {/* PLANNER */}
                <div className="flex flex-col items-center gap-1">
                  <Link
                    to="/planner"
                    className={`
      flex items-center justify-center
      w-10 h-10 rounded-full transition
       ${isActive("/planner")
                        ? "bg-white text-black shadow-md"
                        : "bg-[#1F1F1F] text-gray-400 border border-white/10 hover:bg-[#2A2A2A] hover:text-white"}
    `}
                  >
                    <CalendarCog size={22} />
                  </Link>

                  <span
                    className={`
      text-[10px] leading-none
      ${isActive("/planner") ? "text-white" : "text-gray-400"}
    `}
                  >
                    Planner
                  </span>
                </div>


                {/* DOWNLOADS */}

                {/* <div className="flex flex-col items-center gap-1">
                  <Link
                    to="/downloads"
                    className={`
      flex items-center justify-center
      w-10 h-10 rounded-full transition
       ${isActive("/downloads")
                        ? "bg-white text-black shadow-md"
                        : "bg-[#1F1F1F] text-gray-400 border border-white/10 hover:bg-[#2A2A2A] hover:text-white"}
    `}
                  >
                    <CircleArrowDown size={22} />
                  </Link>

                  <span
                    className={`
      text-[10px] leading-none
      ${isActive("/downloads") ? "text-white" : "text-gray-400"}
    `}
                  >
                    Downloads
                  </span>
                </div> */}

              </div>


              {/* Desktop Auth Section */}
              <div className="flex items-center gap-2 space-x-4">
                {isLoggedIn ? (
                  <>
                    {/* Desktop Auth Section */}
                    <div className="flex items-center gap-2">

                      {/* DOWNLOADS (moved near profile) */}
                      <Link
                        to="/downloads"
                        className={`
      flex items-center justify-center
      w-10 h-10 rounded-full transition
      ${isActive("/downloads")
                            ? "bg-white text-black shadow-md"
                            : "bg-[#1F1F1F] text-gray-400 border border-white/10 hover:bg-[#2A2A2A] hover:text-white"}
    `}
                        title="Downloads"
                      >
                        <CircleArrowDown size={20} />
                      </Link>

                      {/* FUTURE: NOTIFICATIONS PLACEHOLDER */}
                      {/*
  <button
    className="
      w-10 h-10 rounded-full
      bg-[#1F1F1F]
      border border-white/10
      text-gray-400
      hover:bg-[#2A2A2A] hover:text-white
      transition
    "
    title="Notifications"
  >
    <Bell size={18} />
  </button>
  */}

                      {/* PROFILE AVATAR */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowProfileMenu(!showProfileMenu);
                          }}
                          className="
        w-10 h-10 rounded-full overflow-hidden
        border-2 border-white/20
        hover:border-white/40
        transition
      "
                          title="Profile"
                        >
                          {userData?.avatar?.secure_url?.startsWith("http") ? (
                            <img
                              src={userData.avatar.secure_url}
                              alt="Profile"
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                        </button>
                            
                        {/* Profile Dropdown (UNCHANGED) */}
                        {/* Profile Dropdown */}
                        {showProfileMenu && (
                          <div
                            className="
      absolute right-0 mt-3 w-64
      bg-[#0F0F0F]/95 backdrop-blur-xl
      border border-white/10
      rounded-2xl
      shadow-2xl
      overflow-hidden
    "
                          >
                            {/* ───── USER IDENTITY ───── */}
                            <div className="p-4 border-b border-white/10">
                              <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                                  {userData?.avatar?.secure_url?.startsWith("http") ? (
                                    <img
                                      src={userData.avatar.secure_url}
                                      alt="Profile"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-[#1F1F1F] flex items-center justify-center text-white font-semibold">
                                      {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                  )}
                                </div>

                                {/* Name + Email */}
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-white truncate">
                                    {userData?.fullName || "User"}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate">
                                    {userData?.email}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* ───── MENU ACTIONS ───── */}
                            <div className="py-2">

                              <Link
                                to="/profile"
                                className="dropdown-item"
                              >
                                <User size={16} />
                                <span>My Profile</span>
                              </Link>

                              <Link
                                to="/bookmarks"
                                className="dropdown-item"
                              >
                                <Bookmark size={16} />
                                <span>Bookmarks</span>
                              </Link>

                              {(role === "TEACHER" || role === "ADMIN") && (
                                <Link
                                  to="/upload"
                                  className="dropdown-item"
                                >
                                  <Upload size={16} />
                                  <span>Upload Notes</span>
                                </Link>
                              )}

                              {(role === "TEACHER" || role === "ADMIN") && (
                                <Link
                                  to="/upload/video"
                                  className="dropdown-item"
                                >
                                  <Video size={16} />
                                  <span>Upload Video</span>
                                </Link>
                              )}

                              {role === "ADMIN" && (
                                <Link
                                  to="/admin"
                                  className="dropdown-item"
                                >
                                  <LayoutDashboard size={16} />
                                  <span>Admin Dashboard</span>
                                </Link>
                              )}
                            </div>

                            {/* ───── SIGN OUT ───── */}
                            <div className="border-t border-white/10 py-2">
                              <button
                                onClick={handleLogout}
                                className="
          w-full flex items-center gap-3
          px-4 py-2.5
          text-sm text-red-400
          hover:text-red-300
          hover:bg-white/10
          transition
        "
                              >
                                <LogOut size={16} />
                                <span>Sign out</span>
                              </button>
                            </div>
                          </div>
                        )}

                      </div>

                    </div></>

                ) : (
                  <>
                    <Link
                      to="/login"
                      className="relative group px-6 py-2.5 text-sm font-medium text-gray-200 hover:text-white transition-all duration-300 overflow-hidden rounded-lg"
                    >
                      <span className="relative z-10">Sign in</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </Link>
                    <Link
                      to="/signup"
                      className="group relative bg-gradient-to-r from-white to-gray-100 text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
                    >
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
          <div className="flex items-center justify-between px-4 h-16 gap-3">

            {/* LEFT SIDE */}
            {!isSearchPage ? (
              /* LOGO (non-search pages) */
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">A</span>
                </div>
                <span className="font-bold text-lg text-white">AcademicArk</span>
              </Link>
            ) : (
              /* SEARCH INPUT (search page only) */
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!query?.trim() || isSearching) return;

                  if (isFailedSearch) {
                    dispatch(
                      logFailedSearchAction({
                        searchAnalyticsId,
                        action: "retry_search",
                        value: query
                      })
                    );
                  }

                  dispatch(clearSuggestions());
                  navigate(`/search?query=${encodeURIComponent(query)}`);
                }}
                className="flex items-center gap-2 flex-1"
              >
                {/* INPUT + SUGGESTIONS WRAPPER */}
                <div ref={searchWrapperRef} className="relative flex-1">
                  {/* SEARCH ICON */}
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  {/* INPUT */}
                  <input
                    type="text"
                    value={query || ""}
                    ref={mobileSearchRef}
                    onFocus={() => {
                      setIsSearchOpen(true);

                      if (!query?.trim()) {
                        dispatch(fetchRecentSearches());
                      }
                    }}
                    onChange={(e) => {
                      dispatch(setSearchQuery(e.target.value));
                      setIsSearchOpen(true);
                    }}
                    placeholder="Search DBMS, OS, PYQs…"
                    className={`
        w-full h-10
        pl-9 pr-3
        bg-[#1F1F1F]
        border border-white/10
        text-sm text-white
        placeholder-gray-500
        outline-none
        transition
        ${suggestions.length > 0
                        ? "rounded-t-xl rounded-b-none"
                        : "rounded-full"}
      `}
                  />

                  {/* 🔽 SEARCH SUGGESTIONS (MOBILE) */}
                  {suggestions.length > 0 && (
                    <div
                      className="
          absolute top-full left-0 right-0
          -mt-[1px]
          bg-[#111111]
          border border-white/10
          border-t-0
          rounded-b-xl
          shadow-2xl
          overflow-hidden
          z-50
        "
                    >
                      {suggestions.map((s, index) => (
                        <button
                          key={index}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault(); // 👈 stop blur
                            dispatch(setSearchQuery(s));
                            dispatch(clearSuggestions());
                            navigate(`/search?query=${encodeURIComponent(s)}`);
                          }}

                          className="
              w-full flex items-center gap-3
              px-4 py-3
              text-sm text-gray-300
              active:bg-[#1F1F1F]
              hover:bg-[#1F1F1F]
              transition
            "
                        >
                          <Search size={14} className="text-gray-500" />
                          <span className="truncate">{s}</span>

                        </button>
                      ))}
                    </div>
                  )}
                  {isSearchOpen &&
                    !query?.trim() &&
                    recentSearches.length > 0 && (
                      <div
                        className="
      absolute top-full left-0 right-0
      rounded-xl
          bg-[#111111]
          border border-white/10
          border-t-0
          rounded-b-xl
          shadow-2xl
          overflow-hidden
          z-50
    "
                      >
                        {recentSearches.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              dispatch(setSearchQuery(item.query));
                              setIsSearchOpen(false);
                              navigate(`/search?query=${encodeURIComponent(item.query)}`);
                            }}
                            className="
          w-full flex items-center gap-3
              px-4 py-3
              text-sm text-gray-300
              active:bg-[#1F1F1F]
              hover:bg-[#1F1F1F]
              transition
        "
                          >
                            <Clock size={14} className="text-gray-500" />
                            <span className="truncate">{item.query}</span>
                          </button>
                        ))}
                      </div>
                    )}

                </div>

                {/* SEARCH BUTTON */}
                {query?.trim() && (
                  <button
                    type="submit"
                    disabled={isSearching}
                    className={`
        w-9 h-9
        flex items-center justify-center
        rounded-full
        transition
        ${isSearching
                        ? "bg-white/20"
                        : "bg-white/10 active:scale-95"}
      `}
                  >
                    {isSearching ? (
                      <svg
                        className="w-4 h-4 animate-spin text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-25"
                        />
                        <path
                          d="M22 12a10 10 0 00-10-10"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-75"
                        />
                      </svg>
                    ) : (
                      <Search size={16} className="text-white" />
                    )}
                  </button>
                )}
              </form>

            )}

            {/* RIGHT SIDE */}
            {isLoggedIn ? (
              <button className="p-2">
                {/* notification / avatar later */}
              </button>
            ) : (
              <MovingBorderLoginButton />
            )}
          </div>
        </header>


        {/* ✨ NEW: Floating Feedback Button */}
        {/* ✨ NEW: Floating Feedback Button with Text (Desktop Only) */}
        <div className="hidden md:flex flex-col items-end gap-3 fixed bottom-6 right-6 z-40">
          {/* Feedback Text - Desktop Only */}
          {/* Feedback Text - Desktop Only - Auto Hide with Fade Out */}
          {showFeedbackText && (
            <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-xl rounded-2xl px-5 py-3 shadow-xl border border-white/10 animate-fade-out">
              <p className="text-sm font-semibold text-white whitespace-nowrap">
                Help us improve 🚀
              </p>
              <p className="text-xs text-white/80 whitespace-nowrap">
                Send us your feedback
              </p>
            </div>
          )}


          {/* Feedback Button */}
          <button
            onClick={() => setShowFeedback(true)}
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform"
            title="Send Feedback"
          >
            💬
          </button>
        </div>

        {/* ✨ Mobile Feedback Button - Small Version */}
        {/* <button
    onClick={() => setShowFeedback(true)}
    className="md:hidden fixed bottom-34 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg flex items-center justify-center text-white text-xl hover:scale-110 transition-transform z-40"
    title="Send Feedback"
>
    💬
</button> */}



        {/* ✨ NEW: Feedback Form Modal */}
        <FeedbackForm
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
        />
        {/* 📱 FIXED Side Drawer Menu - Separate from Header */}
        {showMobileMenu && isLoggedIn && (
          <>
            {/* Backdrop - Dismissible */}
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setShowMobileMenu(false)}
            />

            {/* Side Drawer from Left - FULL HEIGHT */}
            <div className="fixed left-0 top-0 bottom-0 w-72 bg-gray-900/98 backdrop-blur-xl border-r border-white/10 z-50 overflow-y-auto md:hidden">

              {/* Header Section */}
              <div className="sticky top-0 px-6 pt-6 pb-6 border-b border-white/10 bg-gray-900/50">
                <div className="flex items-center space-x-3 mb-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0">
                    {userData?.avatar?.secure_url?.startsWith("http") ? (
                      <img
                        src={userData.avatar.secure_url}
                        alt="Profile"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                        {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">
                      {userData?.fullName || "User"}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      {userData?.email}
                    </p>
                    <span className="text-xs font-semibold text-blue-400 capitalize">
                      {role.toLowerCase()}
                    </span>
                  </div>
                  {/* Close Button */}
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className=" py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Close Button */}
                {/* <button
          onClick={() => setShowMobileMenu(false)}
          className="w-full flex items-center  py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button> */}
              </div>

              {/* Menu Items */}
              <div className="px-3 py-4 space-y-1">
                {/* My Profile */}
                <Link
                  to="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <UserIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm font-medium">My Profile</span>
                </Link>

                {/* My Bookmarks */}
                <Link
                  to="/bookmarks"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LibraryIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium">My Bookmarks</span>
                </Link>

                {/* Upload Notes - Teachers & Admins */}
                {(role === "TEACHER" || role === "ADMIN") && (
                  <Link
                    to="/upload"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <UploadIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm font-medium">Upload Notes</span>
                  </Link>
                )}
                {/* Upload video - Teachers & Admins */}
                {(role === "TEACHER" || role === "ADMIN") && (
                  <Link
                    to="/upload/video"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <UploadIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm font-medium">Upload video</span>
                  </Link>
                )}

                {/* Admin Dashboard - Admins Only */}
                {role === "ADMIN" && (
                  <Link
                    to="/admin"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <DashboardIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                )}
              </div>

              {/* Divider */}
              <div className="mx-3 my-2 h-px bg-white/10" />

              {/* Sign Out */}
              <div className="px-3 py-2">
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LogoutIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>

              {/* Safe Area Padding */}
              <div className="h-4" />
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="pt-20 md:pt-20 pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </main>
        {/* ✨ NEW: Add Academic Profile Modal */}
        <AcademicProfileModal />
        {/* 🎨 AMAZING Spotify-Style Bottom Navigation - Redesigned */}
        <MobileNavigation
          isLoggedIn={isLoggedIn}
          userData={userData}
          role={role}
          onLogout={handleLogout}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />


      </div>
      {isLoggedIn&&showSupportBanner && (
  <SupportInfoBanner onDismiss={dismissSupportBanner} />
)}

    </>
  );
};

export default HomeLayout;

{/* <button
                    onClick={() => setShowFeedback(true)}
                    className="fixed bottom-35 md:bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform z-40"
                    title="Send Feedback"
                >
                    💬
                </button> */}

