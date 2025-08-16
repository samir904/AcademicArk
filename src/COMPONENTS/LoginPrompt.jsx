// src/components/LoginPrompt.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function LoginPrompt({ action = "access this feature" }) {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <UserIcon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Login Required</h3>
      <p className="text-gray-400 mb-6">
        Please sign in to {action}
      </p>
      <div className="flex items-center space-x-4 justify-center">
        <Link
          to="/login"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-all font-medium"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
