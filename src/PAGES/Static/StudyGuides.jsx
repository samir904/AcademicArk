// src/PAGES/StudyGuides.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Icons
const BookOpenIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const ClockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const StarIcon = ({ className, filled }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const BookmarkIcon = ({ className, filled }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const UserIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const SearchIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const FilterIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
    </svg>
);

const TrendingIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const FireIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const CheckCircleIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PlayIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M6 20l4-16m4 16l4-16" />
    </svg>
);

const TargetIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const BrainIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export default function StudyGuides() {
    const { isLoggedIn } = useSelector(state => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [sortBy, setSortBy] = useState('popular');

    // Sample study guides data
    const studyGuides = [
        {
            id: 1,
            title: 'Complete Data Structures Guide',
            subject: 'Computer Science',
            semester: 3,
            type: 'comprehensive',
            difficulty: 'intermediate',
            duration: '4 hours',
            chapters: 12,
            rating: 4.8,
            reviews: 245,
            bookmarked: true,
            completed: 75,
            author: 'Dr. Sarah Johnson',
            authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c1b2f?w=64&h=64&fit=crop&crop=face',
            description: 'Master all fundamental data structures with practical examples and coding challenges.',
            tags: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Hash Tables'],
            lastUpdated: '2 days ago',
            trending: true
        },
        {
            id: 2,
            title: 'Quick Calculus Review',
            subject: 'Mathematics',
            semester: 2,
            type: 'quick-review',
            difficulty: 'beginner',
            duration: '1.5 hours',
            chapters: 6,
            rating: 4.6,
            reviews: 189,
            bookmarked: false,
            completed: 100,
            author: 'Prof. Michael Chen',
            authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
            description: 'Essential calculus concepts for quick revision before exams.',
            tags: ['Derivatives', 'Integrals', 'Limits', 'Applications'],
            lastUpdated: '1 week ago',
            trending: false
        },
        {
            id: 3,
            title: 'Operating Systems Exam Prep',
            subject: 'Computer Science',
            semester: 4,
            type: 'exam-prep',
            difficulty: 'advanced',
            duration: '6 hours',
            chapters: 15,
            rating: 4.9,
            reviews: 312,
            bookmarked: true,
            completed: 45,
            author: 'Dr. Lisa Wong',
            authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
            description: 'Comprehensive exam preparation covering all OS concepts with practice questions.',
            tags: ['Process Management', 'Memory', 'File Systems', 'Synchronization'],
            lastUpdated: '3 days ago',
            trending: true
        },
        {
            id: 4,
            title: 'Physics Formula Reference',
            subject: 'Physics',
            semester: 1,
            type: 'reference',
            difficulty: 'beginner',
            duration: '30 mins',
            chapters: 8,
            rating: 4.7,
            reviews: 156,
            bookmarked: false,
            completed: 0,
            author: 'Prof. David Kumar',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
            description: 'Essential physics formulas and constants for quick reference.',
            tags: ['Mechanics', 'Thermodynamics', 'Waves', 'Optics'],
            lastUpdated: '5 days ago',
            trending: false
        },
        {
            id: 5,
            title: 'Database Design Mastery',
            subject: 'Computer Science',
            semester: 5,
            type: 'comprehensive',
            difficulty: 'advanced',
            duration: '8 hours',
            chapters: 20,
            rating: 4.8,
            reviews: 278,
            bookmarked: true,
            completed: 30,
            author: 'Dr. Amanda Rodriguez',
            authorAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64&h=64&fit=crop&crop=face',
            description: 'Complete guide to database design principles and implementation.',
            tags: ['ER Diagrams', 'Normalization', 'SQL', 'Indexing', 'Optimization'],
            lastUpdated: '1 day ago',
            trending: true
        },
        {
            id: 6,
            title: 'Chemistry Lab Techniques',
            subject: 'Chemistry',
            semester: 2,
            type: 'practical',
            difficulty: 'intermediate',
            duration: '3 hours',
            chapters: 10,
            rating: 4.5,
            reviews: 134,
            bookmarked: false,
            completed: 60,
            author: 'Dr. Robert Taylor',
            authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face',
            description: 'Essential laboratory techniques and safety procedures for chemistry students.',
            tags: ['Safety', 'Titration', 'Crystallization', 'Spectroscopy'],
            lastUpdated: '1 week ago',
            trending: false
        }
    ];

    // Filter options
    const subjects = ['all', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
    const semesters = ['all', 1, 2, 3, 4, 5, 6, 7, 8];
    const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
    const types = ['all', 'comprehensive', 'quick-review', 'exam-prep', 'reference', 'practical'];
    const sortOptions = [
        { value: 'popular', label: 'Most Popular' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'recent', label: 'Recently Updated' },
        { value: 'trending', label: 'Trending' },
        { value: 'duration', label: 'Duration (Short to Long)' }
    ];

    // Filter and sort study guides
    const filteredGuides = useMemo(() => {
        let filtered = studyGuides.filter(guide => {
            const matchesSearch = searchTerm === '' || 
                guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesSubject = selectedSubject === 'all' || guide.subject === selectedSubject;
            const matchesSemester = selectedSemester === 'all' || guide.semester === selectedSemester;
            const matchesDifficulty = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;
            const matchesType = selectedType === 'all' || guide.type === selectedType;

            return matchesSearch && matchesSubject && matchesSemester && matchesDifficulty && matchesType;
        });

        // Sort guides
        switch (sortBy) {
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'recent':
                filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
                break;
            case 'trending':
                filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
                break;
            case 'duration':
                filtered.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
                break;
            default: // popular
                filtered.sort((a, b) => b.reviews - a.reviews);
        }

        return filtered;
    }, [searchTerm, selectedSubject, selectedSemester, selectedDifficulty, selectedType, sortBy]);

    const trendingGuides = studyGuides.filter(guide => guide.trending);
    const popularGuides = studyGuides.slice().sort((a, b) => b.reviews - a.reviews).slice(0, 4);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'intermediate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'advanced': return 'text-red-400 bg-red-500/20 border-red-500/30';
            default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'comprehensive': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
            case 'quick-review': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
            case 'exam-prep': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
            case 'reference': return 'text-pink-400 bg-pink-500/20 border-pink-500/30';
            case 'practical': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
            default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    const StudyGuideCard = ({ guide, featured = false }) => (
        <div className={`group bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-white/20 ${featured ? 'ring-2 ring-blue-500/50' : ''}`}>
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            {guide.trending && (
                                <div className="flex items-center space-x-1 bg-orange-500/20 border border-orange-500/30 rounded-full px-2 py-1">
                                    <TrendingIcon className="w-3 h-3 text-orange-400" />
                                    <span className="text-orange-400 text-xs font-medium">Trending</span>
                                </div>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(guide.difficulty)}`}>
                                {guide.difficulty}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(guide.type)}`}>
                                {guide.type.replace('-', ' ')}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                            {guide.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                            {guide.description}
                        </p>
                    </div>
                    <button className="ml-4 p-2 rounded-full hover:bg-white/10 transition-colors">
                        <BookmarkIcon 
                            className={`w-5 h-5 ${guide.bookmarked ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition-colors`}
                            filled={guide.bookmarked}
                        />
                    </button>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-3 mb-4">
                    <img 
                        src={guide.authorAvatar} 
                        alt={guide.author}
                        className="w-8 h-8 rounded-full border-2 border-white/20"
                    />
                    <div>
                        <p className="text-white text-sm font-medium">{guide.author}</p>
                        <p className="text-gray-400 text-xs">Updated {guide.lastUpdated}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                {guide.completed > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">Progress</span>
                            <span className="text-blue-400 text-sm font-medium">{guide.completed}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                style={{ width: `${guide.completed}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {guide.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                    {guide.tags.length > 3 && (
                        <span className="bg-white/10 text-gray-400 text-xs px-2 py-1 rounded-full">
                            +{guide.tags.length - 3} more
                        </span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{guide.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <BookOpenIcon className="w-4 h-4" />
                            <span>{guide.chapters} chapters</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <StarIcon className="w-4 h-4 text-yellow-400" filled />
                            <span>{guide.rating}</span>
                            <span>({guide.reviews})</span>
                        </div>
                    </div>
                    <Link
                        to={`/study-guides/${guide.id}`}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium text-sm"
                    >
                        {guide.completed > 0 ? 'Continue' : 'Start'}
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="min-h-screen bg-black text-white">
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-900 via-black to-purple-900 py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6">
                                <BrainIcon className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                                Study Guides
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                Structured learning paths, comprehensive guides, and exam preparation materials to help you master your subjects.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Search and Filters */}
                    <div className="mb-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search study guides by title, topic, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {subjects.map(subject => (
                                    <option key={subject} value={subject}>
                                        {subject === 'all' ? 'All Subjects' : subject}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {semesters.map(semester => (
                                    <option key={semester} value={semester}>
                                        {semester === 'all' ? 'All Semesters' : `Semester ${semester}`}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {difficulties.map(difficulty => (
                                    <option key={difficulty} value={difficulty}>
                                        {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>
                                        {type === 'all' ? 'All Types' : type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedSubject('all');
                                    setSelectedSemester('all');
                                    setSelectedDifficulty('all');
                                    setSelectedType('all');
                                    setSortBy('popular');
                                }}
                                className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Trending Guides */}
                    {trendingGuides.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                                <FireIcon className="w-6 h-6 text-orange-400" />
                                <span>Trending Study Guides</span>
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {trendingGuides.slice(0, 2).map((guide) => (
                                    <StudyGuideCard key={guide.id} guide={guide} featured />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            All Study Guides ({filteredGuides.length})
                        </h2>
                    </div>

                    {/* Study Guides Grid */}
                    {filteredGuides.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGuides.map((guide) => (
                                <StudyGuideCard key={guide.id} guide={guide} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Study Guides Found</h3>
                            <p className="text-gray-400 mb-6">
                                Try adjusting your search terms or filters to find relevant study guides.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedSubject('all');
                                    setSelectedSemester('all');
                                    setSelectedDifficulty('all');
                                    setSelectedType('all');
                                }}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Popular Study Guides */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                            <StarIcon className="w-6 h-6 text-yellow-400" filled />
                            <span>Most Popular Study Guides</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {popularGuides.map((guide) => (
                                <div key={guide.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:scale-105 transition-transform">
                                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{guide.title}</h3>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{guide.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            <StarIcon className="w-4 h-4 text-yellow-400" filled />
                                            <span className="text-yellow-400 text-sm">{guide.rating}</span>
                                        </div>
                                        <span className="text-gray-400 text-xs">{guide.reviews} reviews</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                        <BrainIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-4">Create Your Own Study Guide</h3>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                            Share your knowledge and help other students by creating comprehensive study guides for your subjects.
                        </p>
                        <div className="flex items-center justify-center space-x-4 flex-wrap">
                            <Link
                                to="/create-guide"
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium flex items-center space-x-2"
                            >
                                <PlayIcon className="w-5 h-5" />
                                <span>Create Guide</span>
                            </Link>
                            <Link
                                to="/guide-templates"
                                className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all font-medium"
                            >
                                View Templates
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
