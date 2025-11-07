// src/components/AuthGuard.jsx
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate, useLocation } from 'react-router-dom';
// import AccessDenied from '../PAGES/Static/AccessDenied';

// // Minimal loader component
// const AppLoader = () => (
//   <div className="min-h-screen bg-black flex items-center justify-center relative">
//     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
//                     w-96 h-96 bg-gradient-to-r from-blue-500/10 via-purple-500/10
//                     to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
//     <div className="relative z-10 text-center">
//       <div className="flex justify-center items-center mb-8">
//         <div className="relative">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-blue-500"></div>
//         </div>
//       </div>
//       <div className="space-y-2">
//         <h2 className="text-2xl font-light text-white">
//           Academic<span className="font-bold bg-gradient-to-r from-blue-400 
//                                   to-purple-400 bg-clip-text text-transparent">Ark</span>
//         </h2>
//       </div>
//     </div>
//   </div>
// );

// export default function AuthGuard({ children, requiredRole }) {
//   const isLoggedIn = useSelector(state => state?.auth?.isLoggedIn);
//   const user = useSelector(state => state?.auth?.data);
//   const loading = useSelector(state => state?.auth?.loading);
//   const location = useLocation();

//   // ✅ CRITICAL: Check if OAuth callback is in progress
//   const urlParams = new URLSearchParams(location.search);
//   const isOAuthCallback = urlParams.get('googleAuth') === 'success';

//   // ✅ Show loader during OAuth processing - don't redirect!
//   if (isOAuthCallback) {
//     console.log('⏳ OAuth callback in progress - showing loader');
//     return <AppLoader />;
//   }

//   // Show loader while checking auth
//   if (loading) {
//     return <AppLoader />;
//   }

//   // Case 1: If not logged in → always redirect to login
//   if (!isLoggedIn) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Case 2: Logged in but this route requires a role
//   if (requiredRole) {
//     const allowedRoles = Array.isArray(requiredRole)
//       ? requiredRole
//       : [requiredRole];

//     // if user has no role or role not in allowed list → access denied
//     if (!user?.role || !allowedRoles.includes(user.role)) {
//       return <AccessDenied />;
//     }
//   }

//   // Case 3: Logged in & allowed (or no requiredRole)
//   return children;
// }

// src/components/AuthGuard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import AccessDenied from '../PAGES/Static/AccessDenied';

// const AccessDenied = () => (
//   <div className="min-h-screen flex items-center justify-center bg-black text-white">
//     <h1 className="text-3xl font-bold">🚫 Access Denied</h1>
//     <p className="text-gray-400 mt-2">You do not have permission to view this page.</p>
//   </div>
// );

export default function AuthGuard({ children, requiredRole }) {
  const isLoggedIn = useSelector(state => state?.auth?.isLoggedIn);
  const user = useSelector(state => state?.auth?.data); // expected { id, name, role } when logged in
  const location = useLocation();

  // Case 1: If not logged in → always redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Case 2: Logged in but this route requires a role
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];

    // if user has no role or role not in allowed list → access denied
    if (!user?.role || !allowedRoles.includes(user.role)) {
      return <AccessDenied />;
    }
  }

  // Case 3: Logged in & allowed (or no requiredRole)
  return children;
}

