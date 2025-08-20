// src/PAGES/Static/AccessDenied.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-300"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-40 animate-float-random"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* 403 Big Number */}
      <h1 className="absolute text-[200px] sm:text-[300px] font-extrabold text-white/10 z-0 select-none animate-fade-glow">
        403
      </h1>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Spinning Ring with 🚫 Icon */}
        <div className="relative mb-10">
          <div className="animate-spin-slow rounded-full h-28 w-28 border-4 border-gray-700 border-t-pink-500 border-r-purple-500 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-2xl">
              <span className="text-white text-3xl">🚫</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 animate-fade-in">
          Access Denied
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto animate-fade-in delay-200">
          You don’t have the required permission to view this page.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-500">
          <Link
            to="/"
            className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            ⬅ Back to Home
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg font-semibold border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
          >
            🔑 Login
          </Link>
        </div>
      </div>
    </div>
  );
}
