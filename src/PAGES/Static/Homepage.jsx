// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import aktulogo from "../../../public/download.jpeg";
import { MovingBorderButton } from '../../COMPONENTS/MovingBorderButton';
import { LampSection } from '../../COMPONENTS/LampSection';
import { WhyChooseAcademicArkLamp } from '../../COMPONENTS/WhyChooseAcademicArkLamp';
import { BackgroundLines } from '../../COMPONENTS/ui/background-lines';
import { BackgroundBeams } from '../../COMPONENTS/ui/background-beams';
import { GridBackground } from '../../COMPONENTS/ui/GridBackground';
import AdBanner from '../../COMPONENTS/AdBanner';
import TestimonialsSection from '../../COMPONENTS/TestimonialsSection';
import EnhancedFooter from '../../LAYOUTS/EnhancedFooter';

const Homepage = () => {
  const [isVisible, setIsVisible] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  const features = [
    'AKTU Notes',
    'AKTU Important Questions',
    'AKTU Previous Year Papers',
    'AKTU Syllabus Materials',
  ];

  // Subtle text rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach(el => {
      if (el.id) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const subjects = [
    { name: 'Data Structure', count: '20+ notes & PYQ', code: 'KCS-401' },
    { name: 'Java OOPs', count: '20+ notes & PYQ', code: 'KCS-501' },
    { name: 'Python', count: '20+ notes & PYQ', code: 'KCS-301' },
    { name: 'Operating System', count: '20+ notes & PYQ', code: 'KCS-402' },
    { name: 'TAFL', count: '20+ notes & PYQ', code: 'KCS-403' },
    { name: 'PPS', count: '20+ notes & PYQ', code: 'KCS-101' }
  ];

  const stats = [
    { number: '200+', label: 'AKTU Study Materials' },
    { number: '100+', label: 'AKTU PYQ Papers' },
    { number: '1000+', label: 'AKTU Students' },
    { number: '2025', label: 'Updated Syllabus' }
  ];

  // const TravelingDotButton = () => (
  //   <Link 
  //     to="/notes" 
  //     className="relative inline-flex items-center space-x-2 bg-black text-white px-6 py-3 font-semibold group overflow-hidden transition-all duration-300 hover:scale-105"
  //   >
  //     {/* Border Container */}
  //     <div className="absolute inset-0 rounded-xl">
  //       {/* Top line */}
  //       <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-800 rounded-full">
  //         <div className="absolute top-0 left-0 w-6 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full animate-travel-top"></div>
  //       </div>
        
  //       {/* Right line */}
  //       <div className="absolute top-0 right-0 w-0.5 h-full bg-gray-800 rounded-full">
  //         <div className="absolute top-0 right-0 w-0.5 h-6 bg-gradient-to-b from-transparent via-purple-500 to-transparent rounded-full animate-travel-right"></div>
  //       </div>
        
  //       {/* Bottom line */}
  //       <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gray-800">
  //         <div className="absolute bottom-0 right-0 w-6 h-0.5 bg-gradient-to-l from-transparent via-pink-500 to-transparent rounded-full animate-travel-bottom"></div>
  //       </div>
        
  //       {/* Left line */}
  //       <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gray-800">
  //         <div className="absolute bottom-0 left-0 w-0.5 h-6 bg-gradient-to-t from-transparent via-cyan-500 to-transparent rounded-full animate-travel-left"></div>
  //       </div>
  //     </div>
      
  //     {/* Content */}
  //     <div className="relative z-10 flex items-center space-x-2">
  //       <span className="bg-clip-text text-white font-bold tracking-wide">
  //         Browse AKTU Notes
  //       </span>
  //     </div>
      
  //     {/* Corner Dots */}
  //     <div className="absolute top-1 left-1 w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
  //     <div className="absolute top-1 right-1 w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-500"></div>
  //     <div className="absolute bottom-1 right-1 w-1 h-1 bg-pink-500 rounded-full animate-pulse delay-1000"></div>
  //     <div className="absolute bottom-1 left-1 w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-1500"></div>
  //   </Link>
  // );

  return (
    <>
      {/* Hero Section - Enhanced with AKTU branding */}
      <BackgroundLines
      className="flex items-center justify-center w-full flex-col px-4"
      svgOptions={{ duration: 10 }}
    >
      {/* Hero Section Content */}
      <section className="hero-viewport flex items-center justify-center px-4 relative w-full">
        
        {/* Subtle background accents */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* AKTU Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6 animate-fade-in">
            <img 
              src={aktulogo} 
              alt="AKTU Logo" 
              loading="lazy" 
              className="w-6 h-6 rounded-full" 
            />
            <span className="text-sm text-gray-300 font-medium">AKTU Study Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-none mb-4">
            Your Complete
            <span className="block font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-4xl sm:text-5xl lg:text-6xl mt-4">
              AKTU Exam Preparation
            </span>
            <span className="block font-normal text-gray-400 text-3xl sm:text-4xl lg:text-5xl mt-4">
              Platform
            </span>
          </h1>

          {/* Rotating features with animation */}
          <div className="h-16 flex items-center justify-center mb-8">
            <div 
              key={currentIndex}
              className="text-2xl sm:text-3xl font-light text-gray-300 animate-fade-in-out"
            >
              {features[currentIndex]}
            </div>
          </div>
          
          {/* Description */}
          {/* <p className="text-xl text-gray-400 mb-4 max-w-3xl mx-auto leading-relaxed">
            Access comprehensive <span className="text-white font-semibold">AKTU study materials</span>, 
            previous year question papers (PYQ), and important questions—all organized by subject and 
            syllabus. Built specifically for <span className="text-white font-semibold">AKTU students</span>.
          </p> */}

          {/* Key highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-blue-500/50 transition-all duration-300">
              <span className="text-blue-400">📚</span>
              <span className="text-gray-300">AKTU Syllabus Aligned</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-green-500/50 transition-all duration-300">
              <span className="text-green-400">✅</span>
              <span className="text-gray-300">Updated for 2025-26</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-purple-500/50 transition-all duration-300">
              <span className="text-purple-400">⚡</span>
              <span className="text-gray-300">Free Access</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!isLoggedIn && (
              <>
                <Link 
                  to="/signup" 
                  className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Start Learning Free
                </Link>
                <Link 
                  to="/notes" 
                  className="text-white border border-gray-700 hover:border-gray-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-900/50"
                >
                  Explore AKTU Materials
                </Link>
              </>
            )}
            {isLoggedIn && <MovingBorderButton />}
          </div>

          {/* Trust indicator */}
          <p className="text-sm text-gray-500 mt-8">
            Trusted by 1k+ AKTU students • Updated regularly
          </p>
        </div>
      </section>
    </BackgroundLines>

{/* <AdBanner /> */}

      {/* Stats Section - Enhanced with AKTU context */}
      <section 
        id="stats" 
        className={`py-20 border-t border-gray-900 transition-all duration-1000 ${
          isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="space-y-2 p-6 rounded-2xl bg-gray-900/30 border border-gray-800 hover:border-gray-700 transition-all duration-300"
              >
                <div className="text-4xl font-light text-white">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section - New */}
      <section 
        id="offerings" 
        className={`py-32 border-t border-gray-900 transition-all duration-1000 ${
          isVisible.offerings ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-white mb-4">
              Everything You Need for
              <span className="block font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">
                AKTU Exams
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive study resources tailored for AKTU University students
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* AKTU Notes */}
            <div className="group p-8 bg-gray-900/30 hover:bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                AKTU Notes
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Comprehensive notes for all AKTU subjects, prepared according to the latest syllabus. 
                Clear explanations, diagrams, and examples included.
              </p>
              <div className="flex items-center text-sm text-blue-400">
                <span>All units covered</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Important Questions */}
            <div className="group p-8 bg-gray-900/30 hover:bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Important Questions
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Curated list of frequently asked questions in AKTU exams. 
                Focus on high-probability topics to maximize your exam score.
              </p>
              <div className="flex items-center text-sm text-purple-400">
                <span>Exam-focused</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* AKTU PYQ */}
            <div className="group p-8 bg-gray-900/30 hover:bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Previous Year Papers (PYQ)
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Complete collection of AKTU previous year question papers. 
                Organized by year and subject for easy practice and revision.
              </p>
              <div className="flex items-center text-sm text-pink-400">
                <span>Multiple years available</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>


     

      {/* Subjects Grid - Enhanced with course codes */}
      <section 
        id="subjects" 
        className={`py-32 border-t border-gray-900 transition-all duration-1000 ${
          isVisible.subjects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-white mb-4">
              AKTU Subjects
              <span className="block text-2xl text-gray-400 font-normal mt-2">
                Browse by subject
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Complete study materials for all major AKTU courses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <Link 
                key={index}
                to={`/notes?subject=${encodeURIComponent(subject.name)}`}
                className="group p-6 bg-gray-900/30 hover:bg-gray-900/60 rounded-2xl border border-gray-800 hover:border-gray-600 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      {subject.code}
                    </p>
                  </div>
                  <svg 
                    className="w-5 h-5 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">
                  {subject.count}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-800 flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                    Notes
                  </span>
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                    Questions
                  </span>
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-1.5"></span>
                    PYQ
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* View all subjects CTA */}
          <div className="text-center mt-12">
            <Link 
              to="/notes" 
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
            >
              <span>View all AKTU subjects</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - New */}
      <section 
        id="how-it-works" 
        className={`py-32 border-t border-gray-900 transition-all duration-1000 ${
          isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-white mb-6">
              How AcademicArk Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Simple, fast, and effective way to prepare for AKTU exams
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-500/30">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Choose Subject
              </h3>
              <p className="text-sm text-gray-400">
                Select from AKTU B.Tech subjects
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-500/30">
                <span className="text-2xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Access Materials
              </h3>
              <p className="text-sm text-gray-400">
                Get notes, questions & PYQ instantly
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-pink-500/30">
                <span className="text-2xl font-bold text-pink-400">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Study & Practice
              </h3>
              <p className="text-sm text-gray-400">
                Learn concepts and solve questions
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/30">
                <span className="text-2xl font-bold text-green-400">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Ace Your Exams
              </h3>
              <p className="text-sm text-gray-400">
                Score high in AKTU examinations
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* <LampSection/> */}
       {/* ✨ ADD LAMP EFFECT HERE ✨ */}
      {/* <WhyChooseAcademicArkLamp /> */}
<TestimonialsSection />
      {/* Enhanced CTA Section */}
      
      <section className="relative py-32 border-t border-white/10 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4">
          {/* Enhanced Heading */}
          <h2 className="text-4xl sm:text-5xl font-light text-white mb-4">
            {isLoggedIn ? (
              <>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Loving
                </span>{" "}
                AcademicArk?
              </>
            ) : (
              <>
                Ready to Excel in
                <span className="block font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">
                  AKTU Exams?
                </span>
              </>
            )}
          </h2>

          {/* Subheading */}
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            {isLoggedIn 
              ? "Help your fellow AKTU students excel! Share AcademicArk and give them access to comprehensive study notes, important questions, and previous year papers." 
              : "Join hundreds of AKTU students who are acing their exams with our comprehensive study materials, important questions, and previous year papers."}
          </p>

          {/* CTA */}
          {!isLoggedIn ? (
            <div className="space-y-6">
              <Link 
                to="/signup" 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-white to-gray-100 text-black px-10 py-4 rounded-xl font-semibold hover:from-gray-100 hover:to-white transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Start Your AKTU Preparation</span>
              </Link>

              {/* Trust badges */}
              <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free For this semester</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>AKTU Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Updated Daily</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main Share Button */}
              <button
                onClick={async () => {
                  const url = window.location.origin;
                  const message = `📚 Hey! I found AcademicArk - an amazing platform for AKTU exam preparation!

🎯 What you get:
📚 Detailed AKTU Notes (All Subjects)
⭐ Important Questions for AKTU Exams
📄 AKTU Previous Year Papers (PYQ) 
✅ Updated according to latest AKTU syllabus
🆓 Completely FREE to use

Perfect for acing your AKTU university exams! 🚀

🔗 Visit: ${url}

Try it now and boost your AKTU exam scores! 📈`;
                  
                  try {
                    await navigator.clipboard.writeText(message);
                    
                    const toast = document.createElement('div');
                    toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 backdrop-blur-xl text-white px-6 py-4 rounded-xl shadow-2xl z-50 transition-all duration-300 border border-green-400/20 max-w-sm';
                    toast.innerHTML = `
                      <div class="text-center">
                        <div class="flex items-center justify-center space-x-2 mb-2">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span class="font-medium">AKTU Share Message Copied!</span>
                        </div>
                        <div class="text-xs text-green-100">Including link: ${url}</div>
                      </div>
                    `;
                    document.body.appendChild(toast);
                    
                    setTimeout(() => {
                      toast.style.opacity = '0';
                      toast.style.transform = 'translate(-50%, -100%)';
                      setTimeout(() => document.body.removeChild(toast), 300);
                    }, 5000);
                    
                  } catch (err) {
                    alert(message);
                  }
                }}
                className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share with AKTU Friends</span>
              </button>

              {/* Feature Preview */}
              <div className="flex justify-center">
                <div className="inline-flex items-center space-x-4 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <span className="text-sm">📚</span>
                    <span className="text-xs font-medium">AKTU Notes</span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="flex items-center space-x-2 text-green-400">
                    <span className="text-sm">⭐</span>
                    <span className="text-xs font-medium">Important Q's</span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="flex items-center space-x-2 text-purple-400">
                    <span className="text-sm">📄</span>
                    <span className="text-xs font-medium">AKTU PYQ</span>
                  </div>
                </div>
              </div>

              {/* Social Share Options */}
              <div className="flex justify-center items-center flex-wrap gap-3">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`📚 Hey! Check out AcademicArk - the best platform for AKTU exam preparation!

🎯 Get:
📚 AKTU Notes
⭐ Important Questions  
📄 AKTU PYQ Papers

Perfect for AKTU B.Tech students! 🚀

🔗 ${window.location.origin}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-green-500/20 border border-green-500/30 rounded-full hover:bg-green-500/30 transition-all duration-200 group transform hover:scale-110"
                  title="Share on WhatsApp"
                >
                  <svg className="w-5 h-5 text-green-400 group-hover:text-green-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>

                {/* Instagram */}
                <button
                  onClick={async () => {
                    const instagramMessage = `📚 Found AcademicArk - perfect for AKTU exam prep!

🎯 Get AKTU:
📚 Notes
⭐ Important Questions  
📄 PYQ Papers

🚀 Ace your AKTU exams!

🔗 ${window.location.origin}

#AcademicArk #AKTU #StudyMaterials #ExamPrep`;

                    try {
                      await navigator.clipboard.writeText(instagramMessage);
                      
                      const toast = document.createElement('div');
                      toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 backdrop-blur-xl text-white px-6 py-4 rounded-xl shadow-2xl z-50 transition-all duration-300 border border-pink-400/20 max-w-sm';
                      toast.innerHTML = `
                        <div class="text-center">
                          <div class="flex items-center justify-center space-x-2 mb-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span class="font-medium">Instagram Caption Copied!</span>
                          </div>
                          <div class="text-xs text-pink-100">Perfect for stories or posts 📸</div>
                        </div>
                      `;
                      document.body.appendChild(toast);
                      
                      setTimeout(() => {
                        toast.style.opacity = '0';
                        toast.style.transform = 'translate(-50%, -100%)';
                        setTimeout(() => document.body.removeChild(toast), 300);
                      }, 4000);
                      
                    } catch (err) {
                      alert(instagramMessage);
                    }
                  }}
                  className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-200 group transform hover:scale-110"
                  title="Copy for Instagram"
                >
                  <svg className="w-5 h-5 text-pink-400 group-hover:text-pink-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </button>

                {/* X (Twitter) */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("📚 Found an amazing platform for AKTU exam prep! AcademicArk has AKTU study notes, important questions & PYQ papers. Perfect for B.Tech students! 🚀")}&url=${encodeURIComponent(window.location.origin)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800/20 border border-gray-600/30 rounded-full hover:bg-gray-800/30 transition-all duration-200 group transform hover:scale-110"
                  title="Share on X"
                >
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent("Found an amazing platform for AKTU exam preparation! AcademicArk provides comprehensive AKTU study notes, important questions, and previous year papers for B.Tech students.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-600/20 border border-blue-600/30 rounded-full hover:bg-blue-600/30 transition-all duration-200 group transform hover:scale-110"
                  title="Share on LinkedIn"
                >
                  <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
      <EnhancedFooter />
    </>
  );
};

export default Homepage;