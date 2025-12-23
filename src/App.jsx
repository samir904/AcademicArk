import React, { Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AuthGuard from "./COMPONENTS/AuthGuard";
import "./App.css";

// 🟢 KEEP THESE IMMEDIATE (No lazy loading)
import Homepage from "./PAGES/Static/Homepage";
//import Login from './PAGES/User/Login';
//import Signup from './PAGES/User/Signup';
import PageNotFound from "./PAGES/Static/PageNotFound";
import AuthChecker from "./COMPONENTS/AuthChecker";
import { useDispatch } from "react-redux";
import { showToast } from "./HELPERS/Toaster";
import { checkAuth } from "./REDUX/Slices/authslice";
import LoginChoice from "./PAGES/User/LoginChoice";
import LoginEmail from "./PAGES/User/Login";
import SignupChoice from "./PAGES/User/SignupChoice";
import SignupEmail from "./PAGES/User/Signup";
import ManageBanners from "./PAGES/Admin/ManageBanners";
import PageTracker from "./COMPONENTS/PageTracker";
import Analytics from "./PAGES/Admin/Analytics";
// import { BroadcastEmail } from "./PAGES/Admin/BroadcastEmail";
import EmailCampaigns from "./PAGES/Admin/EmailCampaigns";
import GlobalLoginModal from "./COMPONENTS/GlobalLoginModal";
import HomeLayout from "./LAYOUTS/Homelayout";
// import StudyBuddy from './PAGES/AI/StudyBuddy';
// import StudyPlanner from './PAGES/AI/StudyPlanner';
// import StudyPlannerDetail from './PAGES/AI/StudyPlannerDetail';
// import CookieWarning from './COMPONENTS/CookieWarning';
// import AttendanceDashboard from './PAGES/Attendance/AttendanceDashboard';
// 🟡 LAZY LOAD THESE (Medium priority)
const EditAcademicProfile=React.lazy(()=>import("./PAGES/User/EditAcademicProfile"))
const ForgotPassword = React.lazy(() => import("./PAGES/User/Forgotpassword"));
const Resetpassword = React.lazy(() => import("./PAGES/User/Resetpassword"));
const Profile = React.lazy(() => import("./PAGES/User/Profile"));
const Updateprofile = React.lazy(() => import("./PAGES/User/Updateprofile"));
const Changepassword = React.lazy(() => import("./PAGES/User/Changepassword"));
const Note = React.lazy(() => import("./PAGES/Note/Note"));
const NoteDetail = React.lazy(() => import("./PAGES/Note/NoteDetail"));
const ReadNote = React.lazy(() => import("./PAGES/Note/ReadNote"));
const UploadNote = React.lazy(() => import("./PAGES/Note/UploadNote"));
const UpdateNote = React.lazy(() => import("./PAGES/Note/UpdateNote"));
const AdvancedSearch = React.lazy(() =>
  import("./PAGES/Search/AdvancedSearch")
);
const MyBookmarks = React.lazy(() => import("./PAGES/User/MyBookmarks"));
const EditSocialLinks = React.lazy(() =>
  import("./PAGES/User/EditSocialLinks")
);
const PublicProfile = React.lazy(() => import("./PAGES/User/PublicProfile"));

// 🔴 DEFINITELY LAZY LOAD (Heavy/conditional)
const AdminDashboard = React.lazy(() => import("./PAGES/Admin/AdminDashboard"));

const UserAnalytics = React.lazy(() => import("./PAGES/User/UserAnalytics"));
const AttendanceDashboard = React.lazy(() =>
  import("./PAGES/Attendance/AttendanceDashboard")
);
const AttendanceStats = React.lazy(() =>
  import("./PAGES/Attendance/AttendanceStats")
);
const AttendanceCalendar = React.lazy(() =>
  import("./PAGES/Attendance/AttendanceCalendar")
);

// Add this import at the top
const SubjectDetails = React.lazy(() =>
  import("./PAGES/Attendance/SubjectDetails")
);

// 🟡 LAZY LOAD STATIC PAGES
const Privacy = React.lazy(() => import("./PAGES/Static/Privacy"));
const Contact = React.lazy(() => import("./PAGES/Static/Contact"));
const Terms = React.lazy(() => import("./PAGES/Static/Terms"));
const HelpCenter = React.lazy(() => import("./PAGES/Static/HelpCenter"));
const AboutDeveloper = React.lazy(() =>
  import("./PAGES/Static/AboutDeveloper")
);
const DownloadsPage = React.lazy(() => import("./PAGES/DownloadsPage"));

const ComingSoon = React.lazy(() => import("./PAGES/Static/ComingSoon"));
const BookIcon = ({ className }) => (
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
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

// UPDATED APP LOADER - With Custom AcademicArk Logo
const AppLoader = () => {
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        {/* <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div> */}

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Main Spinner Container */}
        <div className="flex justify-center items-center mb-12">
          <div className="relative">
            {/* Outer rotating ring */}
            {/* <div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"
              style={{ animationDuration: "3s" }}
            ></div> */}

            {/* Middle rotating ring */}
            {/* <div
              className="absolute inset-3 rounded-full border-2 border-transparent border-b-blue-500 border-l-purple-500 animate-spin"
              style={{
                animationDuration: "4s",
                animationDirection: "reverse",
              }}
            ></div> */}

            {/* Main spinner */}
            {/* <div className="w-24 h-24 rounded-full border-4 border-gray-700 border-t-blue-500 border-r-purple-500 animate-spin"></div> */}

            {/* Inner glow */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-pulse"></div>

            {/* Center Icon - Custom AcademicArk Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-black font-bold text-xl">A</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo/Title */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="text-white">Academic</span>
            <span className="ml-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Ark
            </span>
          </h1>

          {/* Subtitle */}
          {/* <p className="text-gray-400 text-sm md:text-base font-light">
            Preparing your learning experience
            <span className="inline-flex ml-2 space-x-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-100"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-200"></span>
            </span>
          </p> */}
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-3 mt-8">
          <div
            className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2.5 h-2.5 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {/* Loading Text */}
        {/* <p className="text-gray-500 text-xs mt-8 font-mono">Loading...</p> */}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes gradientShift {
          0% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   // ✅ Detect Google OAuth success from URL parameter
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const googleAuth = urlParams.get('googleAuth');

  //   if (googleAuth === 'success') {
  //     // Show success toast
  //     showToast.success('Successfully signed in with Google! 🎉');

  //     // Clean URL (remove ?googleAuth=success)
  //     window.history.replaceState({}, '', window.location.pathname);

  //     // Fetch user data
  //     dispatch(checkAuth());
  //   }
  // }, [dispatch]);
  useEffect(() => {
    console.log("🔍 Checking Google OAuth callback...");

    const urlParams = new URLSearchParams(window.location.search);
    const googleAuth = urlParams.get("googleAuth");
    const tokenFromURL = urlParams.get("token");

    console.log("OAuth Params:", { googleAuth, hasToken: !!tokenFromURL });

    if (googleAuth === "success" && tokenFromURL) {
      try {
        console.log("✅ Google OAuth success! Token received");

        // ✅ Store token
        localStorage.setItem("authToken", tokenFromURL);
        localStorage.setItem("isLoggedIn", "true");

        // Decode user info from token
        try {
          const payload = JSON.parse(atob(tokenFromURL.split(".")[1]));
          console.log("👤 User:", payload.email);
          localStorage.setItem("data", JSON.stringify(payload));
          localStorage.setItem("role", payload.role || "USER");
        } catch (e) {
          console.error("Error decoding token");
        }

        // Clean URL
        window.history.replaceState({}, "", window.location.pathname);

        // Show success
        showToast.success("Successfully signed in with Google! 🎉");

        // Fetch fresh profile
        setTimeout(() => {
          console.log("📥 Fetching user profile...");
          dispatch(checkAuth());
        }, 300);
      } catch (error) {
        console.error("❌ OAuth error:", error);
        showToast.error("Login failed");
      }
    } else if (googleAuth === "success" && !tokenFromURL) {
      console.error("❌ OAuth success but NO TOKEN!");
      showToast.error("Login failed: No token received");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }, [dispatch]);
  // useEffect(() => {
  //   // ✨ Load Google AdSense Script
  //   const script = document.createElement('script');
  //   script.async = true;
  //   script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9047304299228199';
  //   script.crossOrigin = 'anonymous';
  //   document.head.appendChild(script);
  // }, []);
  return (
    <div className="App">
      {/* <CookieWarning /> */}
      <AuthChecker /> {/* ✅ Add this at the top */}
      <PageTracker /> {/* ← OUTSIDE Routes */}
      <Routes>
        {/* 🟢 Core Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignupChoice />} />
        <Route path="/signup/email" element={<SignupEmail />} />
        <Route path="/login" element={<LoginChoice />} />
        <Route path="/login/email" element={<LoginEmail />} />
        <Route path="/admin/banners" element={<ManageBanners />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        {/* <Route path="/admin/broadcast-email" element={<BroadcastEmail />} /> */}
        <Route path="/admin/campaigns" element={<EmailCampaigns />} />
        <Route
  path="/downloads"
  element={
    <Suspense fallback={<AppLoader />}>
      <DownloadsPage />
    </Suspense>
  }
/>
        <Route
          path="/attendance"
          element={
            <Suspense fallback={<AppLoader />}>
              <AttendanceDashboard />
            </Suspense>
          }
        />
        {/* // Inside your Routes component, add: */}
        {/* <Route path="/study-buddy" element={<StudyBuddy />} />
<Route path="/study-planner" element={<StudyPlanner />} />
<Route path="/study-planner/:id" element={<StudyPlannerDetail />} /> */}
        {/* // Add this route with other attendance routes */}
        <Route
          path="/attendance/:semester/subject/:subject"
          element={
            <AuthGuard>
              <Suspense fallback={<AppLoader />}>
                <SubjectDetails />
              </Suspense>
            </AuthGuard>
          }
        />
        <Route
          path="/attendance/stats"
          element={
            <AuthGuard>
              <Suspense fallback={<AppLoader />}>
                <AttendanceStats />
              </Suspense>
            </AuthGuard>
          }
        />
        <Route
          path="/attendance/calendar"
          element={
            <AuthGuard>
              <Suspense fallback={<AppLoader />}>
                <AttendanceCalendar />
              </Suspense>
            </AuthGuard>
          }
        />
        {/* 🟡 Lazy Routes */}
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<AppLoader />}>
              <ForgotPassword />
            </Suspense>
          }
        />
        <Route
          path="/reset-password/:resetToken"
          element={
            <Suspense fallback={<AppLoader />}>
              <Resetpassword />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Suspense fallback={<AppLoader />}>
                <Profile />
              </Suspense>
            </AuthGuard>
          }
        />
        <Route
          path="/profile/edit-social"
          element={
            <AuthGuard>
              <Suspense fallback={<AppLoader />}>
                <EditSocialLinks />
              </Suspense>
            </AuthGuard>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <Suspense fallback={<AppLoader />}>
              <PublicProfile />
            </Suspense>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <AuthGuard>
              <Suspense fallback={<AppLoader />}>
                <Updateprofile />
              </Suspense>
            </AuthGuard>
          }
        />
        <Route
        path="/academic-profile"
        element={
            <AuthGuard>
              <Suspense fallback={<AppLoader />}>
                <EditAcademicProfile />
              </Suspense>
            </AuthGuard>
          }
         />
        <Route
          path="/change-password"
          element={
            <AuthGuard>
              <Suspense fallback={<AppLoader />}>
                <Changepassword />
              </Suspense>
            </AuthGuard>
          }
        />
        <Route
          path="/notes"
          element={
            <Suspense fallback={<AppLoader />}>
              <Note />
            </Suspense>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <Suspense fallback={<AppLoader />}>
              <NoteDetail />
            </Suspense>
          }
        />
        {/* // Add this route in your App.jsx */}
        <Route
          path="/notes/:id/read"
          element={
            <Suspense fallback={<AppLoader />}>
              <ReadNote />
            </Suspense>
          }
        />
        <Route
          path="/update-note/:id"
          element={
            <AuthGuard requiredRole={["TEACHER", "ADMIN"]}>
              <Suspense fallback={<AppLoader />}>
                <UpdateNote />
              </Suspense>
            </AuthGuard>
          }
        />
        <Route
          path="/upload"
          element={
            <AuthGuard requiredRole={["TEACHER", "ADMIN"]}>
              <Suspense fallback={<AppLoader />}>
                <UploadNote />
              </Suspense>
            </AuthGuard>
          }
        />
        <Route
          path="/search"
          element={
            <Suspense fallback={<AppLoader />}>
              <AdvancedSearch />
            </Suspense>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <AuthGuard>
              <Suspense fallback={<AppLoader />}>
                <MyBookmarks />
              </Suspense>
            </AuthGuard>
          }
        />
        {/* 🔴 Protected Routes without extra wrappers */}
        <Route
          path="/admin"
          element={
            <AuthGuard requiredRole={"ADMIN"}>
              <Suspense fallback={<AppLoader />}>
                <AdminDashboard />
              </Suspense>
            </AuthGuard>
          }
        />
        <Route
          path="/my-analytics"
          element={
            <AuthGuard requiredRole={["TEACHER", "ADMIN"]}>
              <Suspense fallback={<AppLoader />}>
                <UserAnalytics />
              </Suspense>
            </AuthGuard>
          }
        />
        {/* 🟡 Static Pages */}
        <Route
          path="/coming-soon"
          element={
            <Suspense fallback={<AppLoader />}>
              <ComingSoon />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<AppLoader />}>
              <ComingSoon />
            </Suspense>
          }
        />
        <Route
          path="/about-developer"
          element={
            <Suspense fallback={<AppLoader />}>
              <AboutDeveloper />
            </Suspense>
          }
        />
        <Route
          path="/help"
          element={
            <Suspense fallback={<AppLoader />}>
              <HelpCenter />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<AppLoader />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="/privacy"
          element={
            <Suspense fallback={<AppLoader />}>
              <Privacy />
            </Suspense>
          }
        />
        <Route
          path="/terms"
          element={
            <Suspense fallback={<AppLoader />}>
              <Terms />
            </Suspense>
          }
        />
        {/* ❌ Catch-all */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <GlobalLoginModal />
    </div>
  );
}

export default App;
