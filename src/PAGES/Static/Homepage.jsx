// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeLayout from '../../LAYOUTS/Homelayout';
import { useSelector } from 'react-redux';

const Homepage = () => {
  const [isVisible, setIsVisible] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLoggedIn=useSelector((state)=>state?.auth?.isLoggedIn);

  const features = [
    'Notes',
    'Important question',
    'PYQ',
    'Instant access',
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
            setIsVisible(prev => ({...prev, [entry.target.id]: true}));
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
    { name: 'Data Structure', count: '20+ notes & pyq' },
    { name: 'Java Oops', count: '20+ notes & pyq' },
    { name: 'Python', count: '20+ notes & pyq' },
    { name: 'Operating System', count: '20+ notes & pyq' },
    { name: 'TAFL', count: '20+ notes & pyq' },
    { name: 'PPS', count: '20+ notes & pyq' }
  ];

  const stats = [
    { number: '100+', label: 'Study Materials' },
    { number: '50+', label: 'Expert Teachers' },
    { number: '100+', label: 'Students' },
    { number: 'AKTU', label: 'University' }
  ];

  return (
    <HomeLayout>
      {/* Hero Section - Apple Style */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-none mb-8">
            Academic excellence
            <span className="block font-normal text-gray-400 text-4xl sm:text-5xl lg:text-6xl mt-4">
              {features[currentIndex]}
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Access  study materials curated by us. 
            Transform your learning experience today.
            
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!isLoggedIn&&
            <Link 
              to="/signup" 
              className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
}
            <Link 
              to="/notes" 
              className="text-white border border-gray-700 hover:border-gray-600 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Notes
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className={`py-20 border-t border-gray-900 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-light text-white">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-32 border-t border-gray-900 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-white mb-6">
              Built for excellence
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Every feature designed to enhance your learning experience 
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-2xl font-light text-white">
                Notes
              </h3>
              <p className="text-gray-400 leading-relaxed">
                All content created are according to current syllabus
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-light text-white">
                Important question
              </h3>
              <p className="text-gray-400 leading-relaxed">
                All the questions that are frequently asked in exams
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-light text-white">
                Pyq
              </h3>
              <p className="text-gray-400 leading-relaxed">
                All the pyq for every subject, organized and updated for your exam preparation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section id="subjects" className={`py-32 border-t border-gray-900 transition-all duration-1000 ${isVisible.subjects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-white mb-6">
              Popular subjects
            </h2>
            <p className="text-xl text-gray-400">
              Explore our comprehensive collection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <Link 
                key={index}
                to={`/notes?subject=${encodeURIComponent(subject.name)}`}
                className="group p-8 bg-gray-900/50 hover:bg-gray-900 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300"
              >
                <h3 className="text-xl font-medium text-white mb-2 group-hover:text-gray-100">
                  {subject.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {subject.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-32 border-t border-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-light text-white mb-8">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of students accessing  study materials 
            from AcademiArk.
          </p>
          {!isLoggedIn&&
          <Link 
            to="/signup" 
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Create Account
          </Link>
          }
        </div>
      </section>
    </HomeLayout>
  );
};

export default Homepage;
