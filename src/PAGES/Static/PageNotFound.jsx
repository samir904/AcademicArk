// src/PAGES/PageNotFound.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomeLayout from '../../LAYOUTS/Homelayout';

// Icons
const BookIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const HomeIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const SearchIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const LibraryIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
);

const ArrowLeftIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const SparkleIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

export default function PageNotFound() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    // Auto redirect countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const quickLinks = [
        { name: 'Home', path: '/', icon: HomeIcon, description: 'Back to homepage' },
        { name: 'Library', path: '/notes', icon: LibraryIcon, description: 'Browse study materials' },
        { name: 'Search', path: '/search', icon: SearchIcon, description: 'Find specific notes' },
        { name: 'Go Back', path: -1, icon: ArrowLeftIcon, description: 'Return to previous page' }
    ];

    const handleLinkClick = (path) => {
        if (path === -1) {
            navigate(-1);
        }
    };

    return (
        <HomeLayout>
            <div className="min-h-screen bg-black text-white relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20">
                    <div className="absolute inset-0">
                        {/* Floating Books Animation */}
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className={`absolute opacity-10 animate-pulse`}
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${i * 0.5}s`,
                                    animationDuration: `${3 + Math.random() * 2}s`
                                }}
                            >
                                <BookIcon className="w-16 h-16 text-blue-400 transform rotate-12" />
                            </div>
                        ))}
                        
                        {/* Sparkles */}
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={`sparkle-${i}`}
                                className="absolute opacity-20 animate-ping"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${i * 0.3}s`,
                                    animationDuration: `${2 + Math.random()}s`
                                }}
                            >
                                <SparkleIcon className="w-4 h-4 text-purple-400" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
                    {/* Main 404 Content */}
                    <div className="mb-12">
                        {/* 404 Number */}
                        <div className="mb-8">
                            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 animate-pulse">
                                404
                            </h1>
                            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                        </div>

                        {/* Main Message */}
                        <div className="space-y-4 mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                📚 Page Not in the Library!
                            </h2>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                Looks like this page took a study break and wandered off somewhere. 
                                Don't worry, we'll help you find what you're looking for!
                            </p>
                        </div>

                        {/* Countdown */}
                        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 mx-auto max-w-md">
                            <p className="text-gray-300 mb-2">Auto-redirecting to home in:</p>
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                {countdown}s
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-white mb-6">
                            Where would you like to go?
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quickLinks.map((link) => (
                                <div key={link.name}>
                                    {link.path === -1 ? (
                                        <button
                                            onClick={() => handleLinkClick(link.path)}
                                            className="group w-full bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-105 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl text-left"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                                                    <link.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                                                        {link.name}
                                                    </h4>
                                                    <p className="text-gray-400 text-sm">
                                                        {link.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ) : (
                                        <Link
                                            to={link.path}
                                            className="group block w-full bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-105 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                                                    <link.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                                                        {link.name}
                                                    </h4>
                                                    <p className="text-gray-400 text-sm">
                                                        {link.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fun Academic Message */}
                    <div className="mt-12 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6">
                        <div className="flex items-center justify-center space-x-2 mb-3">
                            <span className="text-2xl">💡</span>
                            <h4 className="text-lg font-semibold text-yellow-300">Study Tip</h4>
                        </div>
                        <p className="text-yellow-200/80 text-sm">
                            Just like this missing page, sometimes the best learning happens when we explore unexpected paths. 
                            Why not discover something new in our library while you're here?
                        </p>
                    </div>

                    {/* Contact Support */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm mb-4">
                            Still can't find what you're looking for?
                        </p>
                        <div className="flex items-center justify-center space-x-4">
                            <Link
                                to="/contact"
                                className="text-blue-400 hover:text-blue-300 transition-colors text-sm underline underline-offset-4"
                            >
                                Contact Support
                            </Link>
                            <span className="text-gray-600">•</span>
                            <Link
                                to="/help"
                                className="text-blue-400 hover:text-blue-300 transition-colors text-sm underline underline-offset-4"
                            >
                                Help Center
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}
