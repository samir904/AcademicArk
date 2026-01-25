// Hero Section Redesigned - Clean, Modern, Less Redundancy
// src/COMPONENTS/Hero.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import aktulogo from '../../public/download.jpeg'; // Your logo

const Hero = () => {
  const isLoggedIn = useSelector(state => state.auth?.isLoggedIn);
  const [activeFeature, setActiveFeature] = useState(0);

  const benefits = [
    { icon: '📖', title: 'Complete Study Materials', desc: 'Comprehensive notes & guides' },
    { icon: '📝', title: 'PYQ Papers', desc: 'Previous year questions with solutions' },
    { icon: '⭐', title: 'Expert Resources', desc: 'Curated by top students' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Monitor your learning journey' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % benefits.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Top Badge - Minimal */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:border-white/20 transition-all duration-300">
            <div className="relative">
              <img 
                src={aktulogo} 
                alt="Logo" 
                loading="lazy" 
                className="w-5 h-5 rounded-full" 
              />
            </div>
            <span className="text-xs text-gray-400 font-medium">Engineering Excellence Hub</span>
          </div>
        </div>

        {/* Main Heading - Powerful & Clean */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
            Master Your
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Engineering Studies
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Access premium study materials, PYQ papers, and expert resources—all in one place. 
            Designed for engineering excellence.
          </p>
        </div>

        {/* Interactive Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`group p-6 rounded-xl border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                activeFeature === index
                  ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/50'
                  : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <div className="text-3xl mb-3">{benefit.icon}</div>
              <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-400">{benefit.desc}</p>
              <div className={`h-1 w-6 mt-4 rounded-full transition-all duration-300 ${
                activeFeature === index ? 'bg-blue-400 w-full' : 'bg-gray-700'
              }`}></div>
            </div>
          ))}
        </div>

        {/* CTA Buttons - Prominent */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {!isLoggedIn ? (
            <>
              <Link 
                to="/signup" 
                className="group relative px-8 py-4 bg-white text-black rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 w-full sm:w-auto text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-all duration-300"></div>
                <span className="relative">Start Learning Free</span>
              </Link>
              
              <Link 
                to="/notes" 
                className="px-8 py-4 text-white border-2 border-white/20 hover:border-white/50 rounded-xl font-semibold transition-all duration-300 hover:bg-white/5 w-full sm:w-auto text-center"
              >
                Explore Materials
              </Link>
            </>
          ) : (
            <div className="flex gap-4 w-full sm:w-auto justify-center">
              <Link 
                to="/notes" 
                className="px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 text-center"
              >
                Browse Library
              </Link>
              <Link 
                to="/profile" 
                className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold hover:border-white/50 transition-all duration-300 text-center"
              >
                Your Progress
              </Link>
            </div>
          )}
        </div>

        {/* Stats Section - Social Proof */}
        <div className="flex flex-col sm:flex-row justify-around items-center text-center gap-8 pt-8 border-t border-white/10">
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-1">1000+</p>
            <p className="text-sm text-gray-400">Active Students</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-1">500+</p>
            <p className="text-sm text-gray-400">Study Materials</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-1">95%</p>
            <p className="text-sm text-gray-400">Helpful Reviews</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-1">2025-26</p>
            <p className="text-sm text-gray-400">Latest Syllabus</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;