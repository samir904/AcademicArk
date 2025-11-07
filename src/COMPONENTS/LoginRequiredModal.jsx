import React from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function LoginRequiredModal({ isOpen, onClose, feature = 'this feature' }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <LockClosedIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Login Required</h3>
              <p className="text-sm text-gray-400 mt-1">Sign in to continue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-300 mb-3">
            To use <span className="font-bold text-white">{feature}</span>, you need to be logged in.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-400">
              <strong>✨ Benefits of signing up:</strong>
            </p>
            <ul className="text-sm text-blue-300 mt-2 space-y-1 list-disc list-inside">
              <li>Track attendance across semesters</li>
              <li>Get predictive insights</li>
              <li>Access from any device</li>
              <li>Save your progress</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to="/login"
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium text-center"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition font-medium text-center"
          >
            Sign Up
          </Link>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-3 px-4 py-2 text-gray-400 hover:text-white transition text-sm"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
