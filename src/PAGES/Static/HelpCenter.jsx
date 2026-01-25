
// src/PAGES/HelpCenter.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Icons
const QuestionIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
// Add this DocumentIcon to the icons section (around line 10-15)
const DocumentIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);


const BookIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const UserIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const UploadIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const DownloadIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
);

const CogIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ShieldIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const SearchIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const PlayIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M6 20l4-16m4 16l4-16" />
    </svg>
);

const LightbulbIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const ChevronDownIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ChevronUpIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const ChatIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export default function HelpCenter() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    // Help categories
    const categories = [
        { id: 'all', name: 'All Topics', icon: QuestionIcon, color: 'blue' },
        { id: 'getting-started', name: 'Getting Started', icon: BookIcon, color: 'green' },
        { id: 'account', name: 'Account', icon: UserIcon, color: 'purple' },
        { id: 'upload', name: 'Uploading', icon: UploadIcon, color: 'orange' },
        { id: 'download', name: 'Downloading', icon: DownloadIcon, color: 'blue' },
        { id: 'technical', name: 'Technical', icon: CogIcon, color: 'red' },
        { id: 'privacy', name: 'Privacy', icon: ShieldIcon, color: 'yellow' }
    ];

    // FAQ Data
    const faqs = [
        {
            category: 'getting-started',
            question: 'How do I create an account on Academic Ark?',
            answer: 'To create an account, click the "Sign Up" button on the homepage. Fill in your details including name, email, university, and create a secure password. You\'ll receive a verification email to activate your account.',
            popular: true
        },
        {
            category: 'getting-started',
            question: 'What types of files can I upload?',
            answer: 'Academic Ark accepts PDF, DOC, and DOCX files. Files must be under 50MB and contain academic content like notes, study materials, or previous year questions.',
            popular: true
        },
        {
            category: 'getting-started',
            question: 'How do I navigate the platform?',
            answer: 'Use the main navigation bar to access Library (browse notes), Search (find specific content), Upload (share your notes), and your profile. The homepage shows trending and recommended content.'
        },
        {
            category: 'account',
            question: 'How do I reset my password?',
            answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions in the reset email. The reset link is valid for 15 minutes.',
            popular: true
        },
        {
            category: 'account',
            question: 'Can I change my email address?',
            answer: 'Yes, go to Account Settings > Profile Information. Enter your new email and verify it through the confirmation email we send.'
        },
        {
            category: 'account',
            question: 'How do I delete my account?',
            answer: 'Go to Account Settings > Privacy & Security > Delete Account. This action is permanent and will remove all your uploaded content and personal data.'
        },
        {
            category: 'account',
            question: 'What are user roles and how do I change mine?',
            answer: 'There are three roles: Student (download only), Teacher (can upload), and Admin (full access). Contact support to request a role change with appropriate verification.'
        },
        {
            category: 'upload',
            question: 'Why is my upload failing?',
            answer: 'Check that your file is under 50MB, in PDF/DOC format, and you have Teacher or Admin role. Ensure all required fields (title, subject, semester) are filled correctly.',
            popular: true
        },
        {
            category: 'upload',
            question: 'How do I organize my uploads?',
            answer: 'Use descriptive titles, select the correct subject and semester, add relevant tags, and write clear descriptions. This helps other students find your content easily.'
        },
        {
            category: 'upload',
            question: 'Can I edit my uploaded notes?',
            answer: 'You can edit the title, description, and tags of uploaded notes from your profile page. However, you cannot replace the file itself once uploaded.'
        },
        {
            category: 'upload',
            question: 'What happens if my content violates guidelines?',
            answer: 'Content that violates our guidelines will be removed. Repeated violations may result in account suspension. We\'ll notify you about any actions taken.'
        },
        {
            category: 'download',
            question: 'Why can\'t I download notes?',
            answer: 'Ensure you\'re logged in. Some content may be restricted or you might have reached daily download limits. Check your account status and try again.',
            popular: true
        },
        {
            category: 'download',
            question: 'Is there a limit on downloads?',
            answer: 'Free accounts have a daily download limit. Premium accounts (if available) have unlimited downloads. Limits reset every 24 hours.'
        },
        {
            category: 'download',
            question: 'Where are my downloaded files saved?',
            answer: 'Files are saved to your browser\'s default download location (usually Downloads folder). You can change this in your browser settings.'
        },
        {
            category: 'download',
            question: 'Can I download multiple files at once?',
            answer: 'Currently, files must be downloaded individually. We\'re working on batch download functionality for future updates.'
        },
        {
            category: 'technical',
            question: 'The website is loading slowly. What should I do?',
            answer: 'Clear your browser cache, check your internet connection, try a different browser, or switch to incognito mode. Contact support if issues persist.'
        },
        {
            category: 'technical',
            question: 'I\'m getting an error message. How do I fix it?',
            answer: 'Take a screenshot of the error, try refreshing the page, log out and back in, or try a different browser. Contact support with error details if the problem continues.'
        },
        {
            category: 'technical',
            question: 'Is Academic Ark mobile-friendly?',
            answer: 'Yes, our platform is fully responsive and works on mobile devices. For the best experience, we recommend using updated browsers like Chrome or Safari.'
        },
        {
            category: 'technical',
            question: 'Which browsers are supported?',
            answer: 'We support Chrome, Firefox, Safari, and Edge (latest versions). Internet Explorer is not supported. Enable JavaScript and cookies for full functionality.'
        },
        {
            category: 'privacy',
            question: 'How is my personal data protected?',
            answer: 'We use industry-standard encryption, secure servers, and strict access controls. Read our Privacy Policy for detailed information about data protection.'
        },
        {
            category: 'privacy',
            question: 'Who can see my uploaded content?',
            answer: 'Your uploaded notes are public and visible to all users. Your personal profile information visibility can be controlled in privacy settings.'
        },
        {
            category: 'privacy',
            question: 'Can I make my profile private?',
            answer: 'You can control what information is shown on your public profile in Account Settings > Privacy. Your uploaded content remains public for educational purposes.'
        },
        {
            category: 'privacy',
            question: 'Do you share my data with third parties?',
            answer: 'We don\'t sell your data. We only share information with service providers necessary for platform operation, as detailed in our Privacy Policy.'
        }
    ];

    // Quick actions
    const quickActions = [
        {
            title: 'Upload Your First Note',
            description: 'Share your study materials with the community',
            icon: UploadIcon,
            color: 'green',
            link: '/upload'
        },
        {
            title: 'Browse Study Materials',
            description: 'Explore notes from your subjects and semester',
            icon: BookIcon,
            color: 'blue',
            link: '/notes'
        },
        {
            title: 'Contact Support',
            description: 'Get help from our support team',
            icon: ChatIcon,
            color: 'purple',
            link: '/contact'
        },
        {
            title: 'Account Settings',
            description: 'Manage your profile and preferences',
            icon: CogIcon,
            color: 'orange',
            link: '/profile'
        }
    ];

    // Tutorials
    const tutorials = [
        {
            title: 'Getting Started with Academic Ark',
            description: 'Complete beginner guide to using the platform',
            duration: '5 min',
            views: '2.1K'
        },
        {
            title: 'How to Upload Quality Notes',
            description: 'Best practices for sharing study materials',
            duration: '3 min',
            views: '1.8K'
        },
        {
            title: 'Advanced Search Techniques',
            description: 'Find exactly what you need quickly',
            duration: '4 min',
            views: '1.2K'
        },
        {
            title: 'Managing Your Account',
            description: 'Profile settings and privacy controls',
            duration: '3 min',
            views: '956'
        }
    ];

    // Filter FAQs based on search and category
    const filteredFAQs = useMemo(() => {
        return faqs.filter(faq => {
            const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
            const matchesSearch = searchTerm === '' || 
                faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, selectedCategory]);

    const popularFAQs = faqs.filter(faq => faq.popular);

    const toggleFAQ = (index) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    return (
        <>
            <div className="min-h-screen bg-black text-white">
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-900 via-black to-purple-900 py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6">
                                <QuestionIcon className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                                Help Center
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                                Find answers to common questions, get help with your account, and learn how to make the most of Academic Ark.
                            </p>
                            
                            {/* Search Bar */}
                            <div className="relative max-w-2xl mx-auto">
                                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for help articles, FAQs, or guides..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-12">
                    {/* Quick Actions */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={index}
                                    to={action.link}
                                    className={`bg-gradient-to-br from-${action.color}-900/20 to-${action.color}-800/10 backdrop-blur-xl border border-${action.color}-500/20 rounded-2xl p-6 hover:scale-105 transition-transform shadow-lg group`}
                                >
                                    <div className={`p-3 bg-${action.color}-500/20 rounded-lg mb-4 group-hover:bg-${action.color}-500/30 transition-colors`}>
                                        <action.icon className={`w-6 h-6 text-${action.color}-400`} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                                    <p className="text-gray-400 text-sm">{action.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Popular FAQs */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                            <LightbulbIcon className="w-6 h-6 text-yellow-400" />
                            <span>Popular Questions</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {popularFAQs.map((faq, index) => (
                                <div key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:border-white/20 transition-colors">
                                    <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-blue-400 text-xs capitalize">{faq.category.replace('-', ' ')}</span>
                                        <CheckIcon className="w-4 h-4 text-green-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Video Tutorials */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                            <PlayIcon className="w-6 h-6 text-red-400" />
                            <span>Video Tutorials</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {tutorials.map((tutorial, index) => (
                                <div key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform">
                                    <div className="aspect-video bg-gradient-to-br from-red-900/30 to-pink-900/30 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                            <PlayIcon className="w-8 h-8 text-red-400" />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-white mb-2">{tutorial.title}</h3>
                                        <p className="text-gray-400 text-sm mb-3">{tutorial.description}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{tutorial.duration}</span>
                                            <span>{tutorial.views} views</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Category Filter */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg sticky top-4">
                                <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                                selectedCategory === category.id
                                                    ? `bg-${category.color}-500/20 text-${category.color}-300 border border-${category.color}-500/30`
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            <category.icon className="w-5 h-5" />
                                            <span className="text-sm font-medium">{category.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* FAQ List */}
                        <div className="lg:col-span-3">
                            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        Frequently Asked Questions
                                    </h2>
                                    <span className="text-gray-400 text-sm">
                                        {filteredFAQs.length} articles found
                                    </span>
                                </div>

                                {filteredFAQs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                                        <p className="text-gray-400 mb-4">
                                            Try adjusting your search terms or browse different categories
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSelectedCategory('all');
                                            }}
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredFAQs.map((faq, index) => (
                                            <div key={index} className="border border-white/10 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => toggleFAQ(index)}
                                                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
                                                >
                                                    <div className="flex items-start space-x-3 text-left">
                                                        <span className="text-blue-400 text-xs capitalize bg-blue-500/20 px-2 py-1 rounded mt-1">
                                                            {faq.category.replace('-', ' ')}
                                                        </span>
                                                        <span className="text-white font-medium">{faq.question}</span>
                                                    </div>
                                                    {expandedFAQ === index ? (
                                                        <ChevronUpIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                    )}
                                                </button>
                                                {expandedFAQ === index && (
                                                    <div className="p-4 bg-white/5 border-t border-white/10">
                                                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                                                        {faq.popular && (
                                                            <div className="mt-3 flex items-center space-x-2">
                                                                <LightbulbIcon className="w-4 h-4 text-yellow-400" />
                                                                <span className="text-yellow-300 text-xs">Popular Question</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Still Need Help */}
                    <div className="mt-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                        <h3 className="text-2xl font-bold text-white mb-4">Still need help?</h3>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                            Can't find what you're looking for? Our support team is here to help you with any questions or issues.
                        </p>
                        <div className="flex items-center justify-center space-x-4 flex-wrap">
                            <Link
                                to="/contact"
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium flex items-center space-x-2"
                            >
                                <ChatIcon className="w-5 h-5" />
                                <span>Contact Support</span>
                            </Link>
                            <Link
                                to="/feedback"
                                className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all font-medium"
                            >
                                Send Feedback
                            </Link>
                        </div>
                    </div>

                    {/* Additional Resources */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link to="/terms" className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform">
                            <DocumentIcon className="w-8 h-8 text-blue-400 mb-3" />
                            <h4 className="text-lg font-semibold text-white mb-2">Terms of Service</h4>
                            <p className="text-gray-400 text-sm">Understand our platform rules and guidelines</p>
                        </Link>
                        
                        <Link to="/privacy" className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform">
                            <ShieldIcon className="w-8 h-8 text-green-400 mb-3" />
                            <h4 className="text-lg font-semibold text-white mb-2">Privacy Policy</h4>
                            <p className="text-gray-400 text-sm">Learn how we protect your personal information</p>
                        </Link>
                        
                        <Link to="/community" className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform">
                            <UserIcon className="w-8 h-8 text-purple-400 mb-3" />
                            <h4 className="text-lg font-semibold text-white mb-2">Community Guidelines</h4>
                            <p className="text-gray-400 text-sm">Best practices for our academic community</p>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
