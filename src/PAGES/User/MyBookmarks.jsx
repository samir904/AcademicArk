// src/PAGES/User/MyBookmarks.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CardRenderer from '../Note/CardRenderer';
import { getMyBookmarks } from '../../REDUX/Slices/authslice';
import PageTransition from '../../COMPONENTS/PageTransition';
import { BookmarksSkeleton } from '../../COMPONENTS/Skeletons';

// Icons
const BookmarkIcon = ({ className, filled }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
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

const HeartIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const FolderIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);

const StarIcon = ({ className, filled }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const GridIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const ListIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);

const TrashIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export default function MyBookmarks() {
    const dispatch = useDispatch();
    const { myBookmarks, loading } = useSelector(state => state.auth);
    const { data: user } = useSelector(state => state.auth);
    
    // State for filtering and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        dispatch(getMyBookmarks({ page: 1, limit: 50 })); // Get more items for client-side pagination
    }, [dispatch]);

    // Extract unique values for filters
    const subjects = useMemo(() => {
        const uniqueSubjects = [...new Set(myBookmarks.map(note => note.subject))];
        return ['all', ...uniqueSubjects];
    }, [myBookmarks]);

    const semesters = useMemo(() => {
        const uniqueSemesters = [...new Set(myBookmarks.map(note => note.semester))].sort((a, b) => a - b);
        return ['all', ...uniqueSemesters];
    }, [myBookmarks]);

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(myBookmarks.map(note => note.category))];
        return ['all', ...uniqueCategories];
    }, [myBookmarks]);

    // Filter and sort bookmarks
    const filteredBookmarks = useMemo(() => {
        let filtered = myBookmarks.filter(note => {
            const matchesSearch = searchTerm === '' || 
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.subject.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
            const matchesSemester = selectedSemester === 'all' || note.semester === selectedSemester;
            const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;

            return matchesSearch && matchesSubject && matchesSemester && matchesCategory;
        });

        // Sort bookmarks
        switch (sortBy) {
            case 'alphabetical':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'subject':
                filtered.sort((a, b) => a.subject.localeCompare(b.subject));
                break;
            case 'rating':
                filtered.sort((a, b) => {
                    const avgA = a.rating?.length > 0 ? a.rating.reduce((sum, r) => sum + r.rating, 0) / a.rating.length : 0;
                    const avgB = b.rating?.length > 0 ? b.rating.reduce((sum, r) => sum + r.rating, 0) / b.rating.length : 0;
                    return avgB - avgA;
                });
                break;
            case 'downloads':
                filtered.sort((a, b) => b.downloads - a.downloads);
                break;
            default: // recent
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return filtered;
    }, [myBookmarks, searchTerm, selectedSubject, selectedSemester, selectedCategory, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredBookmarks.length / itemsPerPage);
    const paginatedBookmarks = filteredBookmarks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Statistics
    const bookmarkStats = useMemo(() => {
        const subjectCount = {};
        const categoryCount = {};
        let totalRating = 0;
        let ratedCount = 0;

        myBookmarks.forEach(note => {
            subjectCount[note.subject] = (subjectCount[note.subject] || 0) + 1;
            categoryCount[note.category] = (categoryCount[note.category] || 0) + 1;
            
            if (note.rating?.length > 0) {
                const avgRating = note.rating.reduce((sum, r) => sum + r.rating, 0) / note.rating.length;
                totalRating += avgRating;
                ratedCount++;
            }
        });

        return {
            total: myBookmarks.length,
            subjects: Object.keys(subjectCount).length,
            avgRating: ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : 0,
            mostBookmarkedSubject: Object.keys(subjectCount).reduce((a, b) => 
                subjectCount[a] > subjectCount[b] ? a : b, Object.keys(subjectCount)[0] || 'None'
            ),
            subjectBreakdown: subjectCount,
            categoryBreakdown: categoryCount
        };
    }, [myBookmarks]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedSubject('all');
        setSelectedSemester('all');
        setSelectedCategory('all');
        setSortBy('recent');
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <BookmarksSkeleton/>
        );
    }

    return (
       <PageTransition>
            <div className="min-h-screen bg-black text-white">
                {/* Header */}
                <div className="bg-gradient-to-br from-purple-900 via-black to-pink-900 py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center space-x-4 mb-8">
                            {user?.avatar?.secure_url ? (
                                <img 
                                    src={user.avatar.secure_url} 
                                    alt={user.fullName}
                                    className="w-16 h-16 rounded-full border-4 border-white/20"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    My Bookmarks
                                </h1>
                                <p className="text-purple-200 text-lg">Your saved study materials collection</p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-purple-400">{bookmarkStats.total}</div>
                                <div className="text-sm text-gray-400">Total Bookmarks</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-400">{bookmarkStats.subjects}</div>
                                <div className="text-sm text-gray-400">Subjects Covered</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-400">{bookmarkStats.avgRating}★</div>
                                <div className="text-sm text-gray-400">Average Rating</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-400">{bookmarkStats.mostBookmarkedSubject}</div>
                                <div className="text-sm text-gray-400">Top Subject</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Search and Filters */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search your bookmarks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Toggle and View Mode */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <FilterIcon className="w-5 h-5" />
                                <span>Filters</span>
                                {(selectedSubject !== 'all' || selectedSemester !== 'all' || selectedCategory !== 'all') && (
                                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">Active</span>
                                )}
                            </button>

                            <div className="flex items-center space-x-4">
                                <div className="text-gray-400 text-sm">
                                    {filteredBookmarks.length} of {myBookmarks.length} bookmarks
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}
                                    >
                                        <GridIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}
                                    >
                                        <ListIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-black/30 rounded-lg">
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                                    className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {semesters.map(semester => (
                                        <option key={semester} value={semester}>
                                            {semester === 'all' ? 'All Semesters' : `Semester ${semester}`}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'all' ? 'All Categories' : category}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="recent">Recently Added</option>
                                    <option value="alphabetical">Alphabetical</option>
                                    <option value="subject">By Subject</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="downloads">Most Downloaded</option>
                                </select>

                                <button
                                    onClick={clearFilters}
                                    className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    {filteredBookmarks.length > 0 ? (
                        <>
                            {/* Bookmarks Grid/List */}
                            <div className={viewMode === 'grid' 
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                                : "space-y-4 mb-8"
                            }>
                                {paginatedBookmarks.map((note) => (
                                    <div key={note._id} className={viewMode === 'list' ? "flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-xl" : ""}>
                                        {viewMode === 'list' ? (
                                            <>
                                                <div className="flex-1">
                                                    <Link to={`/notes/${note._id}`} className="text-lg font-semibold text-white hover:text-purple-300 transition-colors">
                                                        {note.title}
                                                    </Link>
                                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                                                        <span>{note.subject}</span>
                                                        <span>•</span>
                                                        <span>Semester {note.semester}</span>
                                                        <span>•</span>
                                                        <span>{note.category}</span>
                                                        <span>•</span>
                                                        <span>{note.downloads} downloads</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {note.rating?.length > 0 && (
                                                        <div className="flex items-center space-x-1 text-yellow-400">
                                                            <StarIcon className="w-4 h-4" filled />
                                                            <span className="text-sm">
                                                                {(note.rating.reduce((sum, r) => sum + r.rating, 0) / note.rating.length).toFixed(1)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <BookmarkIcon className="w-5 h-5 text-purple-400" filled />
                                                </div>
                                            </>
                                        ) : (
                                            <CardRenderer note={note} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center space-x-4">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
                                    >
                                        Previous
                                    </button>
                                    
                                    <div className="flex items-center space-x-2">
                                        {[...Array(Math.min(5, totalPages))].map((_, index) => {
                                            const pageNumber = Math.max(1, currentPage - 2) + index;
                                            if (pageNumber <= totalPages) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => setCurrentPage(pageNumber)}
                                                        className={`px-3 py-2 rounded-lg transition-colors ${
                                                            pageNumber === currentPage
                                                                ? 'bg-purple-500 text-white'
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
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <BookmarkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {myBookmarks.length === 0 ? 'No Bookmarks Yet' : 'No Results Found'}
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {myBookmarks.length === 0 
                                    ? 'Start bookmarking interesting notes to build your collection' 
                                    : 'Try adjusting your search terms or filters'
                                }
                            </p>
                            {myBookmarks.length === 0 ? (
                                <Link
                                    to="/notes"
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
                                >
                                    Browse Notes
                                </Link>
                            ) : (
                                <button
                                    onClick={clearFilters}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Subject Breakdown */}
                    {myBookmarks.length > 0 && (
                        <div className="mt-12 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold text-white mb-6">Your Bookmark Collection</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4">By Subject</h4>
                                    <div className="space-y-3">
                                        {Object.entries(bookmarkStats.subjectBreakdown).map(([subject, count]) => (
                                            <div key={subject} className="flex items-center justify-between">
                                                <span className="text-gray-300 capitalize">{subject}</span>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-24 bg-gray-700 rounded-full h-2">
                                                        <div 
                                                            className="bg-purple-500 h-2 rounded-full"
                                                            style={{ width: `${(count / myBookmarks.length) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-white font-semibold w-8">{count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4">By Category</h4>
                                    <div className="space-y-3">
                                        {Object.entries(bookmarkStats.categoryBreakdown).map(([category, count]) => (
                                            <div key={category} className="flex items-center justify-between">
                                                <span className="text-gray-300">{category}</span>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-24 bg-gray-700 rounded-full h-2">
                                                        <div 
                                                            className="bg-pink-500 h-2 rounded-full"
                                                            style={{ width: `${(count / myBookmarks.length) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-white font-semibold w-8">{count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
