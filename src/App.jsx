import React, { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthGuard from './COMPONENTS/AuthGuard';
import './App.css';

// 🟢 KEEP THESE IMMEDIATE (No lazy loading)
import Homepage from './PAGES/Static/Homepage';
import Login from './PAGES/User/Login';
import Signup from './PAGES/User/Signup';
import PageNotFound from './PAGES/Static/PageNotFound';
import AuthChecker from './COMPONENTS/AuthChecker';
import { useDispatch } from 'react-redux';

// 🟡 LAZY LOAD THESE (Medium priority)
const ForgotPassword = React.lazy(() => import('./PAGES/User/Forgotpassword'));
const Resetpassword = React.lazy(() => import('./PAGES/User/Resetpassword'));
const Profile = React.lazy(() =>import('./PAGES/User/Profile'));
const Updateprofile = React.lazy(() => import('./PAGES/User/Updateprofile'));
const Changepassword = React.lazy(() => import('./PAGES/User/Changepassword'));
const Note = React.lazy(() => import('./PAGES/Note/Note'));
const NoteDetail = React.lazy(() => import('./PAGES/Note/NoteDetail'));
const ReadNote =React.lazy(()=>import("./PAGES/Note/ReadNote"))
const UploadNote = React.lazy(() => import('./PAGES/Note/UploadNote'));
const UpdateNote = React.lazy(() => import('./PAGES/Note/UpdateNote'));
const AdvancedSearch = React.lazy(() => import('./PAGES/Search/AdvancedSearch'));
const MyBookmarks = React.lazy(() => import('./PAGES/User/MyBookmarks'));

// 🔴 DEFINITELY LAZY LOAD (Heavy/conditional)
const AdminDashboard = React.lazy(() =>import('./PAGES/Admin/AdminDashboard'));
    
const UserAnalytics = React.lazy(() =>import('./PAGES/User/UserAnalytics'));
    

// 🟡 LAZY LOAD STATIC PAGES
const Privacy = React.lazy(() => import('./PAGES/Static/Privacy'));
const Contact = React.lazy(() => import('./PAGES/Static/Contact'));
const Terms = React.lazy(() => import('./PAGES/Static/Terms'));
const HelpCenter = React.lazy(() => import('./PAGES/Static/HelpCenter'));
const AboutDeveloper = React.lazy(() => import('./PAGES/Static/AboutDeveloper'));
const ComingSoon = React.lazy(() =>import('./PAGES/Static/ComingSoon'));
const BookIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const AppLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center relative">
    {/* Background Orb */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    w-96 h-96 bg-gradient-to-r from-blue-500/10 via-purple-500/10
                    to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>

    <div className="relative z-10 text-center">
      {/* Main Spinner with Icon - Just like your reference */}
      <div className="flex justify-center items-center mb-8">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-blue-500 "></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8  rounded-lg flex items-center justify-center">
              <BookIcon className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-white">
          Academic<span className="font-bold bg-gradient-to-r from-blue-400 
                                  to-purple-400 bg-clip-text text-transparent">Ark</span>
        </h2>
        {/* <p className="text-gray-400">
          Loading...
        </p> */}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center space-x-2 mt-6">
        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse delay-300"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-pulse delay-600"></div>
      </div>
    </div>
  </div>
);


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // ✅ Detect Google OAuth success from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const googleAuth = urlParams.get('googleAuth');

    if (googleAuth === 'success') {
      // Show success toast
      showToast.success('Successfully signed in with Google! 🎉');

      // Clean URL (remove ?googleAuth=success)
      window.history.replaceState({}, '', window.location.pathname);

      // Fetch user data
      dispatch(checkAuth());
    }
  }, [dispatch]);
  return (
    <div className="App">
      <AuthChecker /> {/* ✅ Add this at the top */}
      <Routes>
        {/* 🟢 Core Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 🟡 Lazy Routes */}
        <Route path="/forgot-password" element={
          <Suspense fallback={<AppLoader />}>
            <ForgotPassword/>
          </Suspense>
        }/>
        <Route path="/reset-password/:resetToken" element={
          <Suspense fallback={<AppLoader />}>
            <Resetpassword/>
          </Suspense>
        }/>
        <Route path="/profile" element={
          <AuthGuard>
          <Suspense fallback={<AppLoader />}>
            <Profile/>
          </Suspense>
          </AuthGuard>
        }/>
        <Route path="/edit-profile" element={
          <AuthGuard>
          <Suspense fallback={<AppLoader />}>
            <Updateprofile/>
          </Suspense>
          </AuthGuard>
        }/>
        <Route path="/change-password" element={
          <AuthGuard>
          <Suspense fallback={<AppLoader />}>
            <Changepassword/>
          </Suspense>
          </AuthGuard>
        }/>
        <Route path="/notes" element={
          <Suspense fallback={<AppLoader />}>
            <Note/>
          </Suspense>
        }/>
        <Route path="/notes/:id" element={
          <Suspense fallback={<AppLoader />}>
            <NoteDetail/>
          </Suspense>
        }/>
        // Add this route in your App.jsx
<Route path="/notes/:id/read" element={
  <Suspense fallback={<AppLoader />}>
    <ReadNote/>
  </Suspense>
}/>

        <Route path="/update-note/:id" element={
          <AuthGuard requiredRole={["TEACHER","ADMIN"]} >
          <Suspense fallback={<AppLoader />}>
            <UpdateNote/>
          </Suspense>
          </AuthGuard>
        }/>
        <Route path="/upload" element={
          <AuthGuard requiredRole={["TEACHER","ADMIN"]} >
          <Suspense fallback={<AppLoader />}>
            <UploadNote/>
          </Suspense>
          </AuthGuard>
        }/>
        <Route path="/search" element={
          <Suspense fallback={<AppLoader />}>
            <AdvancedSearch/>
          </Suspense>
        }/>
        <Route path="/bookmarks" element={
          <AuthGuard>
          <Suspense fallback={<AppLoader />}>
            <MyBookmarks/>
          </Suspense>
          </AuthGuard>
        }/>

        {/* 🔴 Protected Routes without extra wrappers */}
        <Route path="/admin" element={
          <AuthGuard requiredRole={"ADMIN"}>
            <Suspense fallback={<AppLoader />}>
              <AdminDashboard/>
            </Suspense>
          </AuthGuard>
        }/>
        <Route path="/my-analytics" element={
          <AuthGuard requiredRole={["TEACHER","ADMIN"]}>
            <Suspense fallback={<AppLoader />}>
              <UserAnalytics/>
            </Suspense>
          </AuthGuard>
        }/>

        {/* 🟡 Static Pages */}
        <Route path="/coming-soon" element={
          <Suspense fallback={<AppLoader />}>
            <ComingSoon/>
          </Suspense>
        }/>
        <Route path="/settings" element={
          <Suspense fallback={<AppLoader />}>
            <ComingSoon/>
          </Suspense>
        }/>
        <Route path="/about-developer" element={
          <Suspense fallback={<AppLoader />}>
            <AboutDeveloper/>
          </Suspense>
        }/>
        <Route path="/help" element={
          <Suspense fallback={<AppLoader />}>
            <HelpCenter/>
          </Suspense>
        }/>
        <Route path="/contact" element={
          <Suspense fallback={<AppLoader />}>
            <Contact/>
          </Suspense>
        }/>
        <Route path="/privacy" element={
          <Suspense fallback={<AppLoader />}>
            <Privacy/>
          </Suspense>
        }/>
        <Route path="/terms" element={
          <Suspense fallback={<AppLoader />}>
            <Terms/>
          </Suspense>
        }/>

        {/* ❌ Catch-all */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
