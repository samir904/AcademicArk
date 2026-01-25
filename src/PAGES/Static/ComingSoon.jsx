// src/PAGES/ComingSoon.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { showToast } from '../../HELPERS/Toaster';

// Icons
const RocketIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ClockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BellIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const MailIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const StarIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const CodeIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
);

const BookIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const ArrowRightIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const SparkleIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

export default function ComingSoon() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Countdown timer (optional - set your launch date)
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Set your launch date here
    const launchDate = new Date('2025-11-01T00:00:00').getTime(); // November 1, 2025
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [launchDate]);


    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            // Simulate API call - replace with your actual email subscription logic
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast.success('Thank you! You\'ll be notified when we launch.');
            setEmail('');
        } catch (error) {
            showToast.error('Failed to subscribe. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const upcomingFeatures = [
        {
            icon: BookIcon,
            title: 'Smart Study Guides',
            description: 'AI-powered study guides tailored to your subjects and learning style',
            progress: 85,
            color: 'blue'
        },
        {
            icon: UsersIcon,
            title: 'Study Groups',
            description: 'Connect with classmates and form collaborative study groups',
            progress: 60,
            color: 'green'
        },
        {
            icon: BellIcon,
            title: 'Real-time Notifications',
            description: 'Get instant updates about new notes in your subjects',
            progress: 40,
            color: 'purple'
        },
        {
            icon: CodeIcon,
            title: 'Advanced Analytics',
            description: 'Deep insights into your learning progress and patterns',
            progress: 25,
            color: 'orange'
        }
    ];

    return (
        <>
            <div className="min-h-screen bg-black text-white overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20">
                    {/* Floating Elements */}
                    <div className="absolute inset-0">
                        {[...Array(20)].map((_, i) => (
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
                                <SparkleIcon className="w-4 h-4 text-blue-400" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative max-w-6xl mx-auto px-4 py-20">
                    {/* Main Content */}
                    <div className="text-center mb-16">
                        {/* Logo/Icon */}
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-8 shadow-2xl animate-pulse">
                            <RocketIcon className="w-12 h-12 text-white" />
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6 animate-fade-in">
                            Coming Soon
                        </h1>

                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4">
                            Academic Ark V2.0
                        </h2>

                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12">
                            We're building something amazing! The next version of Academic Ark will feature 
                            AI-powered study tools, collaborative learning spaces, and enhanced user experiences 
                            to revolutionize how students share and discover knowledge.
                        </p>

                        {/* Launch Status */}
                        <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3 mb-8">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-300 font-medium">Currently in Development</span>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    {/* Fixed Countdown Timer */}
                <div className="mb-16">
                    <h3 className="text-2xl font-bold text-center text-white mb-8">Expected Launch</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-lg">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                                    {Math.max(0, value).toString().padStart(2, '0')}
                                </div>
                                <div className="text-gray-400 text-sm uppercase font-medium">{unit}</div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Show current date for debugging */}
                    <div className="text-center mt-4">
                        <p className="text-gray-500 text-xs">
                            Current time: {new Date().toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-xs">
                            Launch date: {new Date(launchDate).toLocaleString()}
                        </p>
                    </div>
                </div>

                    {/* Upcoming Features */}
                    <div className="mb-16">
                        <h3 className="text-3xl font-bold text-center text-white mb-12">What's Coming Next</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {upcomingFeatures.map((feature, index) => (
                                <div key={index} className={`bg-gradient-to-br from-${feature.color}-900/20 to-${feature.color}-800/10 backdrop-blur-xl border border-${feature.color}-500/20 rounded-2xl p-8 hover:scale-105 transition-transform shadow-lg`}>
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className={`p-3 bg-${feature.color}-500/20 rounded-lg`}>
                                            <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-semibold text-white">{feature.title}</h4>
                                            <p className="text-gray-400 mt-2">{feature.description}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-400 text-sm">Development Progress</span>
                                            <span className={`text-${feature.color}-400 text-sm font-semibold`}>{feature.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div 
                                                className={`bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-400 h-2 rounded-full transition-all duration-1000`}
                                                style={{ width: `${feature.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Email Notification Signup */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg mb-16">
                        <div className="text-center mb-8">
                            <BellIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-4">Get Notified When We Launch</h3>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Be the first to know when Academic Ark V2.0 goes live. We'll send you exclusive early access and feature updates.
                            </p>
                        </div>

                        <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1 relative">
                                    <MailIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-medium disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {isSubmitting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <span>Notify Me</span>
                                            <ArrowRightIcon className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <p className="text-gray-500 text-sm text-center mt-4">
                            No spam, unsubscribe at any time. We respect your privacy.
                        </p>
                    </div>

                    {/* Current Version Access */}
                    <div className="text-center mb-16">
                        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
                            <h3 className="text-2xl font-bold text-white mb-4">Meanwhile, Explore V1.0</h3>
                            <p className="text-gray-400 mb-6">
                                Don't wait! The current version of Academic Ark is live and ready to help with your studies.
                            </p>
                            <div className="flex items-center justify-center space-x-4">
                                <Link
                                    to="/notes"
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-medium flex items-center space-x-2"
                                >
                                    <BookIcon className="w-5 h-5" />
                                    <span>Browse Notes</span>
                                </Link>
                                <Link
                                    to="/search"
                                    className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-colors font-medium"
                                >
                                    Search Materials
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">Built with ❤️ by Samir Suman</p>
                        <div className="flex items-center justify-center space-x-6">
                            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
                            <span className="text-gray-600">•</span>
                            <Link to="/about-developer" className="text-gray-400 hover:text-white transition-colors">About Developer</Link>
                            <span className="text-gray-600">•</span>
                            <Link to="/" className="text-gray-400 hover:text-white transition-colors">Back to Home</Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
            `}</style>
        </>
    );
}
