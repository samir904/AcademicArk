// src/pages/Note.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotes, setFilters, clearFilters } from '../../REDUX/Slices/noteslice';
import aktulogo from "../../../public/download.jpeg";
import HomeLayout from '../../LAYOUTS/Homelayout';
import CardRenderer from './CardRenderer';
import { Link } from 'react-router-dom';

// Icon components
const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>
);

const BookIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function Note() {
  const dispatch = useDispatch();
  const { notes, loading, totalNotes, filters } = useSelector(state => state.note);

  const [localFilters, setLocalFilters] = useState({
    semester: filters.semester || '',
    subject: filters.subject || '',
    category: filters.category || '',
    uploadedBy: filters.uploadedBy || '', // NEW
    university: filters.university || 'AKTU',
    course: filters.course || 'BTECH'
  });

  // Get unique uploaders from notes
const getUniqueUploaders = () => {
  const uploaders = new Map();
  notes?.forEach(note => {
    if (note.uploadedBy?._id) {
      uploaders.set(note.uploadedBy._id, {
        id: note.uploadedBy._id,
        name: note.uploadedBy.fullName || 'Unknown',
        avatar: note.uploadedBy.avatar
      });
    }
  });
  return Array.from(uploaders.values()).sort((a, b) => a.name.localeCompare(b.name));
};

const uniqueUploaders = getUniqueUploaders();

  const [searchTerm, setSearchTerm] = useState('');
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);

  // Subject mapping by semester
  const subjectsBySemester = {
    1: [
      'Mathematics-I', 'Physics', 'PPS', 'Engineering Graphics',
      'Electrical Engineering', 'EVS'
    ],
    2: [
      'Mathematics-II', 'Chemistry', 'FME',
      'Electronics', 'Soft Skill'
    ],
    3: [
      'Data Structure', 'Digital Electronics',
      'computer organization and architecture', 'Python Programming', 'discrete structures & theory of logic', "mathematics-iv",
      "technical communication",
    ],
    4: [
      'Mathematics-IV', 'TAFL', 'Operating System',
      'Oops-Java', 'Cyber Security', 'UHV'
    ],
    5: [
      'Web Technology', 'cloud computing',
      'design and analysis of algorithm',
      "object oriented system design with c++", "machine learning techniques",
      "database management system", "artificial intelligence", "introduction to data analytics and visualization", "Constitution of India"
    ],
    6: [
      'Machine Learning', 'Artificial Intelligence', 'Mobile Computing',
      'Network Security', 'Advanced Database', 'Human Computer Interaction'
    ],
    7: [
      'Advanced Machine Learning', 'Distributed Systems', 'Cloud Computing',
      'Data Mining', 'Blockchain Technology', 'Project Management'
    ],
    8: [
      'Advanced AI', 'IoT Systems', 'Big Data Analytics',
      'Cyber Security', 'Industry Training', 'Major Project'
    ]
  };

  // Get all unique subjects for "All Subjects" option
  const allSubjects = Object.values(subjectsBySemester).flat().sort();

  // Fetch notes when filters change
  useEffect(() => {
    if (localFilters.semester) {
      const filterParams = Object.fromEntries(
        Object.entries(localFilters).filter(([_, value]) => value)
      );
      dispatch(setFilters(filterParams));
      dispatch(getAllNotes(filterParams));
    }
  }, [localFilters, dispatch]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    const resetFilters = {
      semester: '',
      subject: '',
      category: '',
      uploadedBy: '', // NEW
      university: 'AKTU',
      course: 'BTECH'
    };
    setLocalFilters(resetFilters);
    setSearchTerm('');
    setIsStatsCollapsed(false);
    dispatch(clearFilters());
  };

  // Filter notes by search term AND uploadedBy
const filteredNotes = notes?.filter(note => {
  const matchesSearch = 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesUploader = !localFilters.uploadedBy || 
    note.uploadedBy?._id === localFilters.uploadedBy;
  
  return matchesSearch && matchesUploader;
}) || [];

  const getCategoryStats = () => {
    const stats = {};
    notes?.forEach(note => {
      stats[note.category] = (stats[note.category] || 0) + 1;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  // Handle category selection with collapse/expand behavior
  const handleCategoryClick = (category) => {
    if (localFilters.category === category) {
      // If clicking the same category, toggle collapse
      setIsStatsCollapsed(!isStatsCollapsed);
    } else {
      // If clicking a different category, select it and expand
      handleFilterChange('category', category);
      setIsStatsCollapsed(false);
    }
  };

  // Handle clear category filter
  const handleClearCategory = () => {
    handleFilterChange('category', '');
    setIsStatsCollapsed(false);
  };

  // ✨ FIXED: Updated getCategoryConfig with Handwritten Notes
  const getCategoryConfig = (category) => {
    const configs = {
      'Notes': {
        icon: '📚',
        gradient: 'from-blue-600 to-blue-500',
        hoverGradient: 'hover:from-blue-500 hover:to-blue-400',
        borderColor: 'border-blue-500/30',
        bgGradient: 'from-blue-900/90 to-purple-900/80',
        textColor: 'text-blue-400'
      },
      'Important Question': {
        icon: '⭐',
        gradient: 'from-yellow-600 to-orange-500',
        hoverGradient: 'hover:from-yellow-500 hover:to-orange-400',
        borderColor: 'border-yellow-500/30',
        bgGradient: 'from-yellow-900/90 to-orange-900/80',
        textColor: 'text-yellow-400'
      },
      'PYQ': {
        icon: '📄',
        gradient: 'from-red-600 to-pink-500',
        hoverGradient: 'hover:from-red-500 hover:to-pink-400',
        borderColor: 'border-red-500/30',
        bgGradient: 'from-red-900/90 to-pink-900/80',
        textColor: 'text-red-400'
      },
      'Handwritten Notes': {
        icon: '✏️',
        gradient: 'from-green-600 to-teal-500',
        hoverGradient: 'hover:from-green-500 hover:to-teal-400',
        borderColor: 'border-green-500/30',
        bgGradient: 'from-green-900/90 to-teal-900/80',
        textColor: 'text-green-400'
      }
    };
    return configs[category] || configs['Notes'];
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section - Enhanced for AKTU */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>

          <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
            {/* AKTU Logo & Badge */}
            <div className="inline-flex items-center justify-center mb-6 space-x-4">
              <img src={aktulogo} alt="AKTU Logo" loading='lazy' className="w-14 rounded-4xl h-14" />
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-bold px-3 py-1 rounded-full">
                AKTU Resources
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-4">
              AKTU Notes, PYQs & Important Questions
            </h1>

            {/* Supporting Tagline */}
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Your one-stop portal for semester‐wise subject notes, previous year question papers,
              and curated important questions—officially organized by AKTU syllabus.
            </p>

            {/* Key Feature Highlights */}
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <div className="flex items-center space-x-3">
                <BookIcon className="w-7 h-7 text-blue-400" />
                <span className="text-lg text-gray-200">Semester‐wise subject Notes</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3v4a2 2 0 002 2h4" />
                </svg>
                <span className="text-lg text-gray-200">Previous Year Question Papers</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-lg text-gray-200">Curated Important Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <FilterIcon className="w-5 h-5" />
                <span>Filter Resources</span>
              </h2>
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group"
              >
                <CloseIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span>Clear All</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Semester *</label>
                <select
                  value={localFilters.semester}
                  onChange={e => handleFilterChange('semester', Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Semester</option>
                  {[...Array(8)].map((_, i) => {
                    const sem = i + 1;
                    return (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* ✨ FIXED: Updated Category Select with Handwritten Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={localFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Show All Materials</option>
                  <option value="Notes">📚 Study Notes</option>
                  <option value="Important Question">⭐ Important Questions</option>
                  <option value="PYQ">📄 Previous Year Questions</option>
                  <option value="Handwritten Notes">✏️ Handwritten Notes</option>
                </select>
                <div className="mt-1 text-xs text-gray-400 text-center">
                  Choose <span className="text-green-400">Handwritten</span> for personal notes, <span className="text-yellow-400">Important</span> for key topics
                </div>
              </div>
            

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                  {localFilters.semester && (
                    <span className="ml-2 text-xs text-blue-400">
                      (Semester {localFilters.semester} subjects)
                    </span>
                  )}
                </label>
                <select
                  value={localFilters.subject}
                  onChange={(e) => handleFilterChange('subject', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">
                    {localFilters.semester
                      ? `All Semester ${localFilters.semester} Subjects`
                      : 'All Subjects'
                    }
                  </option>
                  {(localFilters.semester
                    ? subjectsBySemester[localFilters.semester] || []
                    : allSubjects
                  ).map(subject => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-xs text-gray-400 text-center">
                  {localFilters.semester ? (
                    <>Showing subjects for <span className="text-blue-400">Semester {localFilters.semester}</span></>
                  ) : (
                    <>Select a <span className="text-green-400">semester</span> to filter subjects</>
                  )}
                </div>
              </div>

              {/* University */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">University</label>
                <select
                  value={localFilters.university}
                  onChange={(e) => handleFilterChange('university', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="AKTU">AKTU</option>
                </select>
              </div>
            </div>

            {/* Spotify-style OR divider */}
            <div className="flex items-center my-8">
              <div className="flex-1">
                <div className="h-px bg-gradient-to-r from-white/5 via-white/20 to-white/5"></div>
              </div>
              <div className="mx-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border border-white/10 backdrop-blur-sm">
                  <span className="text-white font-bold text-sm">OR</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-px bg-gradient-to-l from-white/5 via-white/20 to-white/5"></div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Enhanced Collapsible Stats Cards - Spotify Style */}
          {localFilters.semester && (
            <div className="mb-8">
              {/* Stats Header Bar - Shows when collapsed or no category selected */}
              {(isStatsCollapsed || !localFilters.category) && (
                <div
                  className={`
                    bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl 
                    border border-white/10 rounded-2xl p-6 mb-4
                    transition-all duration-300 ease-in-out
                    ${!localFilters.category ? 'shadow-lg' : 'cursor-pointer hover:border-white/20'}
                  `}
                  onClick={() => !localFilters.category && setIsStatsCollapsed(false)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      {/* Total Resources */}
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">📊</span>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-400">{totalNotes}</div>
                          <div className="text-xs text-gray-400">Total Resources</div>
                        </div>
                      </div>

                      {/* Category Stats Preview */}
                      <div className="hidden md:flex items-center space-x-4">
                        {Object.entries(categoryStats).map(([category, count]) => {
                          const config = getCategoryConfig(category);
                          return (
                            <div key={category} className="flex items-center space-x-2 px-3 py-2 bg-black/30 rounded-lg">
                              <span className="text-lg">{config.icon}</span>
                              <div className="text-sm">
                                <span className="font-bold text-white">{count}</span>
                                <span className="text-gray-400 ml-1">{category}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Expand hint */}
                    {!localFilters.category && (
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <span>Click to filter by category</span>
                        <ChevronDownIcon className="w-5 h-5 " />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Expanded Category Cards - Spotify Playlist Style */}
              {!isStatsCollapsed && (
                <div className="space-y-4">
                  {/* Selected Category Bar (when category is selected) */}
                  {localFilters.category && (
                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={handleClearCategory}
                            className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg flex items-center justify-center transition-all duration-200 group"
                            title="Clear category filter"
                          >
                            <CloseIcon className="w-5 h-5 text-red-400 group-hover:rotate-90 transition-transform duration-300" />
                          </button>

                          <div className="flex items-center space-x-3">
                            {(() => {
                              const config = getCategoryConfig(localFilters.category);
                              return (
                                <>
                                  <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <span className="text-2xl">{config.icon}</span>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-400">Viewing</div>
                                    <div className="text-xl font-bold text-white">{localFilters.category}</div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>

                          <div className="h-8 w-px bg-white/10"></div>

                          <div className="text-sm text-gray-400">
                            <span className="text-2xl font-bold text-white">{categoryStats[localFilters.category] || 0}</span>
                            <span className="ml-2">resources found</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setIsStatsCollapsed(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200 group"
                        >
                          <span className="text-sm text-gray-400 group-hover:text-white">Collapse</span>
                          <ChevronDownIcon className="w-4 h-4 text-gray-400 group-hover:text-white rotate-180 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Category Selection Grid - ✨ Now includes Handwritten Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(categoryStats).map(([category, count]) => {
                    const isActive = localFilters.category === category;
                    const config = getCategoryConfig(category);

                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`
                          group relative p-6 rounded-2xl
                          transition-all duration-300 transform
                          ${isActive
                            ? `bg-gradient-to-br ${config.gradient} border-transparent shadow-2xl scale-105`
                            : `bg-gradient-to-br from-gray-900/50 to-gray-800/30 border ${config.borderColor} hover:scale-102 ${config.hoverGradient}`
                          }
                          hover:shadow-xl
                        `}
                      >
                        {/* Background Glow Effect */}
                        {isActive && (
                          <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl"></div>
                        )}

                        {/* Content */}
                        <div className="relative flex items-center space-x-4">
                          {/* Icon */}
                          <div className={`
                            w-16 h-16 rounded-xl flex items-center justify-center
                            ${isActive ? 'bg-white/20' : 'bg-black/30 group-hover:bg-black/50'}
                            transition-all duration-300
                          `}>
                            <span className="text-3xl">{config.icon}</span>
                          </div>

                          {/* Text */}
                          <div className="flex-1 text-left">
                            <div className={`
                              text-3xl font-bold mb-1
                              ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                            `}>
                              {count}
                            </div>
                            <div className={`
                              text-sm font-medium
                              ${isActive ? 'text-white/90' : 'text-gray-400 group-hover:text-gray-300'}
                            `}>
                              {category}
                            </div>
                          </div>

                          {/* Arrow Indicator */}
                          <div className={`
                            transition-all duration-300
                            ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                          `}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        {/* Clear button for active category */}
                        {isActive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearCategory();
                            }}
                            className="absolute top-3 right-3 p-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                            title="Clear filter"
                          >
                            <CloseIcon className="w-4 h-4 text-white" />
                          </button>
                        )}

                        {/* Hover Tooltip */}
                        {!isActive && (
                          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <div className="bg-black/90 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                              Click to filter
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>


                  {/*filter by uploaded by where i need to change the logic */ }
{/* NEW: Uploaded By Filter - Only show when category is selected or no filter active */}
{localFilters.semester && notes && notes.length > 0 && (
  <div className="mt-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Filter by Contributor</span>
      </h3>
      {localFilters.uploadedBy && (
        <button
          onClick={() => handleFilterChange('uploadedBy', '')}
          className="text-sm text-red-400 hover:text-red-300 flex items-center space-x-1"
        >
          <CloseIcon className="w-4 h-4" />
          <span>Clear</span>
        </button>
      )}
    </div>

   {/* Horizontal scrollable uploaders */}
<div className="relative">
  <div className="flex overflow-x-auto space-x-3 pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
    {/* All Contributors Option */}
    <button
      onClick={() => handleFilterChange('uploadedBy', '')}
      className={`
        flex-shrink-0 flex items-center space-x-3 px-5 py-3 rounded-xl border transition-all duration-200
        ${!localFilters.uploadedBy
          ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-transparent shadow-lg'
          : 'bg-gray-900/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
        }
      `}
    >
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
        ${!localFilters.uploadedBy ? 'bg-white/20' : 'bg-gray-800'}
      `}>
        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <div className="flex flex-col items-start">
        <span className={`text-sm font-medium whitespace-nowrap ${!localFilters.uploadedBy ? 'text-white' : 'text-gray-300'}`}>
          All Contributors
        </span>
        <span className="text-xs text-gray-400">
          {notes.length} notes
        </span>
      </div>
    </button>

    {/* Individual Uploaders */}
    {uniqueUploaders.map((uploader) => {
      const isActive = localFilters.uploadedBy === uploader.id;
      const uploaderNotesCount = notes.filter(n => n.uploadedBy?._id === uploader.id).length;
      
      return (
        <button
          key={uploader.id}
          onClick={() => handleFilterChange('uploadedBy', uploader.id)}
          className={`
            relative flex-shrink-0 flex items-center space-x-3 px-5 py-3 rounded-xl border transition-all duration-200 min-w-[160px]
            ${isActive
              ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-transparent shadow-lg scale-105'
              : 'bg-gray-900/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
            }
          `}
        >
          {/* Avatar */}
          <div className={`
            w-10 h-10 rounded-full overflow-hidden border-2 transition-colors flex-shrink-0
            ${isActive ? 'border-white/30' : 'border-gray-700'}
          `}>
            {uploader?.avatar?.secure_url?.startsWith('http') ? (
              <img
                src={uploader?.avatar?.secure_url}
                alt={uploader.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm ${uploader?.avatar?.secure_url ? 'hidden' : 'flex'}`}
              style={{ display: uploader?.avatar?.secure_url ? 'none' : 'flex' }}
            >
              {uploader.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-start min-w-0 flex-1">
            {/* Name */}
            <span className={`text-sm font-medium truncate w-full text-left ${isActive ? 'text-white' : 'text-gray-300'}`}>
              {uploader.name}
            </span>

            {/* Notes Count */}
            <span className="text-xs text-gray-400">
              {uploaderNotesCount} {uploaderNotesCount === 1 ? 'note' : 'notes'}
            </span>
          </div>

          {/* Active Indicator */}
          {/* {isActive && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          )} */}
        </button>
      );
    })}
  </div>

  {/* Scroll indicators (optional) */}
  {uniqueUploaders.length > 5 && (
    <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
  )}
</div>


    {/* Currently filtered by */}
    {localFilters.uploadedBy && (
      <div className="mt-3 flex items-center space-x-2 text-sm text-gray-400">
        <span>Showing notes by:</span>
        <span className="text-blue-400 font-medium">
          {uniqueUploaders.find(u => u.id === localFilters.uploadedBy)?.name || 'Unknown'}
        </span>
      </div>
    )}
  </div>
)}
                  {/* Quick Actions */}
                  {!localFilters.category && (
                    <div className="text-center mt-4">
                      <p className="text-sm text-gray-400">
                        💡 <span className="text-gray-300">Tip:</span> Click any category card to filter resources, or click again to collapse
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookIcon className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Empty State with Global Search Suggestion */}
          {!loading && localFilters.semester && filteredNotes.length === 0 && (
            <div className="text-center py-20 px-4">
              {/* Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookIcon className="w-12 h-12 text-gray-400" />
              </div>

              {/* Main Message */}
              <h3 className="text-2xl font-bold text-white mb-3">
                No Resources Found
              </h3>

              {/* Detailed Context */}
              <p className="text-gray-400 mb-2 max-w-2xl mx-auto">
                No notes found for <span className="text-blue-400 font-semibold">Semester {localFilters.semester}</span>
                {localFilters.subject && (
                  <> in <span className="text-purple-400 font-semibold">{localFilters.subject}</span></>
                )}
                {searchTerm && (
                  <> matching <span className="text-green-400 font-semibold">"{searchTerm}"</span></>
                )}.
              </p>

              {/* AKTU Subject Variation Explanation */}
              <div className="max-w-3xl mx-auto mt-8 mb-8">
                <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-lg font-semibold text-yellow-300 mb-2">
                        📚 AKTU Subject Flexibility
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed mb-3">
                        AKTU allows you to choose some subjects per semester. For example, if you're studying
                        <span className="text-blue-300 font-medium"> Digital Electronics</span> this semester,
                        another student might study it in a different semester. However, notes and PYQs are organized
                        by their <span className="text-purple-300 font-medium">official semester placement</span>.
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-yellow-200 bg-yellow-900/30 px-3 py-2 rounded-lg">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Can't find your current semester subjects? Try searching globally!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                {/* Primary CTA - Global Search */}
                <Link
                  to="/search"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Content */}
                  <div className="relative flex items-center space-x-3">
                    <SearchIcon className="w-5 h-5" />
                    <span>Search All Semesters</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 bg-white/20 blur-xl"></div>
                  </div>
                </Link>

                {/* Secondary CTA - Clear Filters */}
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl font-medium border border-gray-700 hover:border-gray-600 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reset Filters</span>
                </button>
              </div>

              {/* Additional Help Text */}
              <div className="max-w-xl mx-auto">
                <p className="text-sm text-gray-500 mb-4">
                  💡 <span className="text-gray-400">Pro Tip:</span> Use the global search to find notes from any semester,
                  especially for elective subjects that might be taught in different semesters.
                </p>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  <Link to={"/search"}>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 text-center hover:border-blue-500/30 transition-colors cursor-pointer">
                      <div className="text-2xl mb-1">🔍</div>
                      <div className="text-xs text-gray-400">Advanced Search</div>
                    </div>
                  </Link>
                  <Link to={"/notes"}>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 text-center hover:border-purple-500/30 transition-colors cursor-pointer">
                      <div className="text-2xl mb-1">📖</div>
                      <div className="text-xs text-gray-400">Browse All Subjects</div>
                    </div>
                  </Link>
                  <Link to={"/notes"}>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 text-center hover:border-pink-500/30 transition-colors cursor-pointer">
                      <div className="text-2xl mb-1">📝</div>
                      <div className="text-xs text-gray-400">View All PYQs</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Semester Selection Prompt */}
          {!loading && !localFilters.semester && (
            <div className="text-center py-20 px-4 space-y-6">
              {/* Animated Icon */}
              <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookIcon className="w-14 h-14 text-white" />
              </div>

              {/* Primary Message */}
              <h3 className="text-3xl font-extrabold text-white mb-2">
                Pick Your Semester
              </h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Start by selecting your current semester to see tailored study resources.
              </p>

              {/* Secondary Action - Global Search */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/search"
                  className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 overflow-hidden"
                >
                  {/* Subtle Glow */}
                  <span className="absolute inset-0 bg-white opacity-20 blur-sm"></span>
                  <SearchIcon className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">Search All Resources</span>
                </Link>
              </div>

              {/* Tertiary Hint */}
              <p className="mt-4 text-sm text-gray-500 max-w-md mx-auto">
                Or&nbsp;
                <Link to="/search" className="text-blue-400 hover:underline">
                  search everything
                </Link>
                &nbsp;if your elective notes are stored under a different semester.
              </p>
            </div>
          )}

          {/* Notes Grid */}
          {!loading && filteredNotes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <CardRenderer key={note._id} note={note} />
              ))}
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}
