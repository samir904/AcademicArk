import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthGuard from './COMPONENTS/AuthGuard';
import './App.css';

// 🟢 KEEP THESE IMMEDIATE (No lazy loading)
import Homepage from './PAGES/Static/Homepage';
import Login from './PAGES/User/Login';
import Signup from './PAGES/User/Signup';
import PageNotFound from './PAGES/Static/PageNotFound';

// 🟡 LAZY LOAD THESE (Medium priority)
const ForgotPassword = React.lazy(() => import('./PAGES/User/Forgotpassword'));
const Resetpassword = React.lazy(() => import('./PAGES/User/Resetpassword'));
const Profile = React.lazy(() =>
  new Promise(resolve => {
    console.log('⏳ Loading Profile...');
    setTimeout(() => {
      console.log('✅ Profile loaded!');
      resolve(import('./PAGES/User/Profile'));
    }, 1500); // Test delay
  })
);
const Updateprofile = React.lazy(() => import('./PAGES/User/Updateprofile'));
const Changepassword = React.lazy(() => import('./PAGES/User/Changepassword'));
const Note = React.lazy(() => import('./PAGES/Note/Note'));
const NoteDetail = React.lazy(() => import('./PAGES/Note/NoteDetail'));
const UploadNote = React.lazy(() => import('./PAGES/Note/UploadNote'));
const UpdateNote = React.lazy(() => import('./PAGES/Note/UpdateNote'));
const AdvancedSearch = React.lazy(() => import('./PAGES/Search/AdvancedSearch'));
const MyBookmarks = React.lazy(() => import('./PAGES/User/MyBookmarks'));

// 🔴 DEFINITELY LAZY LOAD (Heavy/conditional)
const AdminDashboard = React.lazy(() =>
  new Promise(resolve => {
    console.log('⏳ Starting to load AdminDashboard...');
    setTimeout(() => {
      console.log('✅ AdminDashboard loaded!');
      resolve(import('./PAGES/Admin/AdminDashboard'));
    }, 3000); // 3s test delay
  })
);
const UserAnalytics = React.lazy(() =>
  new Promise(resolve => {
    console.log('⏳ Loading Analytics...');
    setTimeout(() => {
      console.log('✅ Analytics loaded!');
      resolve(import('./PAGES/User/UserAnalytics'));
    }, 2000); // 2s test delay
  })
);

// 🟡 LAZY LOAD STATIC PAGES
const Privacy = React.lazy(() => import('./PAGES/Static/Privacy'));
const Contact = React.lazy(() => import('./PAGES/Static/Contact'));
const Terms = React.lazy(() => import('./PAGES/Static/Terms'));
const HelpCenter = React.lazy(() => import('./PAGES/Static/HelpCenter'));
const AboutDeveloper = React.lazy(() => import('./PAGES/Static/AboutDeveloper'));
const ComingSoon = React.lazy(() =>
  new Promise(resolve => {
    console.log("⏳ start loading ComingSoon...");
    setTimeout(() => {
      resolve(import('./PAGES/Static/ComingSoon'));
      console.log("✅ ComingSoon loaded!");
    }, 2000); // 2s delay
  })
);

// 🎨 App Loader
const AppLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center relative">
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    w-96 h-96 bg-gradient-to-r from-blue-500/10 via-purple-500/10
                    to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>

    <div className="relative z-10 text-center">
      {/* Morphing Logo */}
      <div className="relative mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 
                        to-pink-500 rounded-2xl flex items-center justify-center
                        mx-auto transform animate-morph shadow-2xl">
          <span className="text-white font-bold text-2xl">A</span>
        </div>
        {/* Floating Ring */}
        <div className="absolute inset-0 w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-2 border-transparent 
                          border-t-blue-500 rounded-2xl animate-spin-slow"></div>
        </div>
      </div>

      {/* Text with Typewriter */}
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-white animate-fade-in">
          Academic<span className="font-bold bg-gradient-to-r from-blue-400 
                                  to-purple-400 bg-clip-text text-transparent">Ark</span>
        </h2>
        <div className="h-6 flex items-center justify-center">
          <p className="text-gray-400 animate-typewriter overflow-hidden whitespace-nowrap border-r-2 border-blue-500">
            Preparing your study materials...
          </p>
        </div>
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
  return (
    <div className="App">
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
          <Suspense fallback={<AppLoader />}>
            <Profile/>
          </Suspense>
        }/>
        <Route path="/edit-profile" element={
          <Suspense fallback={<AppLoader />}>
            <Updateprofile/>
          </Suspense>
        }/>
        <Route path="/change-password" element={
          <Suspense fallback={<AppLoader />}>
            <Changepassword/>
          </Suspense>
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
        <Route path="/update-note/:id" element={
          <Suspense fallback={<AppLoader />}>
            <UpdateNote/>
          </Suspense>
        }/>
        <Route path="/upload" element={
          <Suspense fallback={<AppLoader />}>
            <UploadNote/>
          </Suspense>
        }/>
        <Route path="/search" element={
          <Suspense fallback={<AppLoader />}>
            <AdvancedSearch/>
          </Suspense>
        }/>
        <Route path="/bookmarks" element={
          <Suspense fallback={<AppLoader />}>
            <MyBookmarks/>
          </Suspense>
        }/>

        {/* 🔴 Protected Routes without extra wrappers */}
        <Route path="/admin" element={
          <AuthGuard fallback={<Navigate to="/login" />}>
            <Suspense fallback={<AppLoader />}>
              <AdminDashboard/>
            </Suspense>
          </AuthGuard>
        }/>
        <Route path="/my-analytics" element={
          <AuthGuard fallback={<Navigate to="/login" />}>
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
