// src/PAGES/Search/AdvancedSearch.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchNotes, getTrendingNotes, getPopularNotes, clearSearch, setFilters } from '../../REDUX/Slices/searchSlice';
import HomeLayout from '../../LAYOUTS/Homelayout';
import CardRenderer from '../Note/CardRenderer';

// Icons
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

export default function AdvancedSearch() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const { 
        loading, 
        searchResults, 
        trendingNotes, 
        popularNotes, 
        pagination, 
        filters,
        suggestions 
    } = useSelector(state => state.search);

    const [searchForm, setSearchForm] = useState({
        query: searchParams.get('query') || '',
        subject: searchParams.get('subject') || '',
        semester: searchParams.get('semester') || '',
        category: searchParams.get('category') || '',
        university: searchParams.get('university') || 'AKTU',
        course: searchParams.get('course') || 'BTECH',
        sortBy: searchParams.get('sortBy') || 'relevance',
        minRating: searchParams.get('minRating') || '',
        minDownloads: searchParams.get('minDownloads') || ''
    });

    const [showFilters, setShowFilters] = useState(false);
    const [activeTab, setActiveTab] = useState('search');

    // Subjects list
    const subjects = [
        'Mathematics', 'Physics', 'Chemistry', 'Computer Science',
        'Operating System', 'Database Management', 'Computer Networks',
        'Software Engineering', 'Data Structures', 'Algorithms',
        'Machine Learning', 'Artificial Intelligence', 'Web Development'
    ];

    const sortOptions = [
        { value: 'relevance', label: 'Most Relevant' },
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'popular', label: 'Most Downloaded' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'alphabetical', label: 'Alphabetical' }
    ];

    // Load data on component mount
    useEffect(() => {
        if (activeTab === 'trending') {
            dispatch(getTrendingNotes());
        } else if (activeTab === 'popular') {
            dispatch(getPopularNotes());
        }
    }, [dispatch, activeTab]);

    // Perform search when URL params change
    useEffect(() => {
        const urlFilters = Object.fromEntries(searchParams.entries());
        if (urlFilters.query || Object.keys(urlFilters).some(key => urlFilters[key] && key !== 'query')) {
            dispatch(searchNotes(urlFilters));
            setActiveTab('search');
        }
    }, [searchParams, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        
        // Filter out empty values
        const filteredForm = Object.fromEntries(
            Object.entries(searchForm).filter(([_, value]) => value !== '')
        );
        
        // Update URL params
        setSearchParams(filteredForm);
        dispatch(setFilters(filteredForm));
        setActiveTab('search');
    }, [searchForm, setSearchParams, dispatch]);

    const handleClearFilters = () => {
        const clearedForm = {
            query: '',
            subject: '',
            semester: '',
            category: '',
            university: 'AKTU',
            course: 'BTECH',
            sortBy: 'relevance',
            minRating: '',
            minDownloads: ''
        };
        setSearchForm(clearedForm);
        setSearchParams({});
        dispatch(clearSearch());
    };

    const handlePagination = (newPage) => {
        const currentFilters = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...currentFilters, page: newPage.toString() });
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchForm(prev => ({ ...prev, subject: suggestion }));
        const updatedParams = { ...Object.fromEntries(searchParams.entries()), subject: suggestion };
        setSearchParams(updatedParams);
    };

    return (
        <HomeLayout>
            <div className="min-h-screen bg-black text-white">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-blue-900 via-black to-purple-900 py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                                Find Perfect Study Materials
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                Search through thousands of notes, previous year questions, and study materials
                            </p>
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
                            {/* Main Search Bar */}
                            <div className="relative mb-6">
                                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                                <input
                                    type="text"
                                    name="query"
                                    value={searchForm.query}
                                    onChange={handleInputChange}
                                    placeholder="Search for notes, subjects, topics..."
                                    className="w-full pl-12 pr-20 py-4 bg-black/50 border border-white/20 rounded-2xl text-white placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
                                >
                                    Search
                                </button>
                            </div>

                            {/* Filter Toggle */}
                            <div className="flex items-center justify-center mb-4">
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center space-x-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <FilterIcon className="w-5 h-5" />
                                    <span>Advanced Filters</span>
                                </button>
                            </div>

                            {/* Advanced Filters */}
                            {showFilters && (
                                <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {/* Subject */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                            <select
                                                name="subject"
                                                value={searchForm.subject}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">All Subjects</option>
                                                {subjects.map(subject => (
                                                    <option key={subject} value={subject}>{subject}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Semester */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Semester</label>
                                            <select
                                                name="semester"
                                                value={searchForm.semester}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">All Semesters</option>
                                                {[...Array(8)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                            <select
                                                name="category"
                                                value={searchForm.category}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">All Categories</option>
                                                <option value="Notes">Notes</option>
                                                <option value="PYQ">Previous Year Questions</option>
                                                <option value="Important Question">Important Questions</option>
                                            </select>
                                        </div>

                                        {/* Sort By */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                                            <select
                                                name="sortBy"
                                                value={searchForm.sortBy}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {sortOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Min Rating */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Min Rating</label>
                                            <select
                                                name="minRating"
                                                value={searchForm.minRating}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Any Rating</option>
                                                <option value="4">4+ Stars</option>
                                                <option value="3">3+ Stars</option>
                                                <option value="2">2+ Stars</option>
                                            </select>
                                        </div>

                                        {/* Min Downloads */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Min Downloads</label>
                                            <select
                                                name="minDownloads"
                                                value={searchForm.minDownloads}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Any Downloads</option>
                                                <option value="100">100+ Downloads</option>
                                                <option value="50">50+ Downloads</option>
                                                <option value="10">10+ Downloads</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <button
                                            type="button"
                                            onClick={handleClearFilters}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            Clear All Filters
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* Search Suggestions */}
                        {suggestions?.popularSubjects?.length > 0 && (
                            <div className="max-w-4xl mx-auto">
                                <p className="text-gray-400 text-sm mb-2">Popular subjects:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.popularSubjects.slice(0, 8).map(subject => (
                                        <button
                                            key={subject}
                                            onClick={() => handleSuggestionClick(subject)}
                                            className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-sm hover:bg-blue-500/30 transition-colors"
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-gray-900/50 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex space-x-8">
                            {[
                                { id: 'search', label: 'Search Results', icon: SearchIcon },
                                { id: 'trending', label: 'Trending', icon: TrendingIcon },
                                { id: 'popular', label: 'Popular', icon: FireIcon }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-2 border-b-2 transition-colors flex items-center space-x-2 ${
                                        activeTab === tab.id 
                                            ? 'border-blue-500 text-blue-400' 
                                            : 'border-transparent text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                    )}

                    {/* Search Results Tab */}
                    {activeTab === 'search' && !loading && (
                        <div>
                            {/* Results Header */}
                            {searchResults.length > 0 && pagination && (
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        Search Results ({pagination.totalNotes} found)
                                    </h2>
                                    <div className="text-gray-400 text-sm">
                                        Showing {((pagination.currentPage - 1) * 12) + 1} to {Math.min(pagination.currentPage * 12, pagination.totalNotes)} of {pagination.totalNotes} results
                                    </div>
                                </div>
                            )}

                            {/* Results Grid */}
                            {searchResults.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {searchResults.map((note) => (
                                        <CardRenderer key={note._id} note={note} />
                                    ))}
                                </div>
                            ) : (
                                !loading && (
                                    <div className="text-center py-20">
                                        <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                                        <p className="text-gray-400 mb-6">
                                            Try adjusting your search terms or filters
                                        </p>
                                    </div>
                                )
                            )}

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex items-center justify-center space-x-4">
                                    <button
                                        onClick={() => handlePagination(pagination.currentPage - 1)}
                                        disabled={!pagination.hasPrev}
                                        className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
                                    >
                                        Previous
                                    </button>
                                    
                                    <div className="flex items-center space-x-2">
                                        {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                                            const pageNumber = Math.max(1, pagination.currentPage - 2) + index;
                                            if (pageNumber <= pagination.totalPages) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => handlePagination(pageNumber)}
                                                        className={`px-3 py-2 rounded-lg transition-colors ${
                                                            pageNumber === pagination.currentPage
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => handlePagination(pagination.currentPage + 1)}
                                        disabled={!pagination.hasNext}
                                        className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Trending Tab */}
                    {activeTab === 'trending' && !loading && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                                <TrendingIcon className="w-6 h-6 text-orange-400" />
                                <span>Trending Notes</span>
                            </h2>
                            
                            {trendingNotes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {trendingNotes.map((note) => (
                                        <CardRenderer key={note._id} note={note} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <TrendingIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">No Trending Notes</h3>
                                    <p className="text-gray-400">Check back later for trending content</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Popular Tab */}
                    {activeTab === 'popular' && !loading && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                                <FireIcon className="w-6 h-6 text-red-400" />
                                <span>Popular Notes</span>
                            </h2>
                            
                            {popularNotes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {popularNotes.map((note) => (
                                        <CardRenderer key={note._id} note={note} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <FireIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">No Popular Notes</h3>
                                    <p className="text-gray-400">Check back later for popular content</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </HomeLayout>
    );
}
