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
