// src/components/AuthGuard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function AuthGuard({ children, fallback = null }) {
  const user = useSelector(state => state.auth.data);
  const location = useLocation();

  if (!user) {
    if (fallback) {
      return fallback;
    }
    // Redirect to login with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
