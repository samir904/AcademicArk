// src/pages/Note.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotes, setFilters, clearFilters } from '../../REDUX/Slices/noteslice';
import aktulogo from "../../../public/download.jpeg";
import HomeLayout from '../../LAYOUTS/Homelayout';
import CardRenderer from './CardRenderer';
import { Link } from 'react-router-dom';
import AdBanner from '../../COMPONENTS/AdBanner';
// import RequestModal from '../../COMPONENTS/RequestModal';

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

  const[showRequestModal,setShowRequestModal]=useState(false);


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
      'engineering mathematics-i', 'engineering physics', 'programming for problem solving',
      'Electrical Engineering', 'EVS', "FUNDAMENTALS OF ELECTRONICS ENGINEERING", "soft skills",
      "fundamentals of mechanical engineering", "engineering chemistry", "fundamentals of electrical engineering"
    ],
    2: [
      'Mathematics-II', , 'engineering physics', 'programming for problem solving',
      'Electrical Engineering', 'EVS', "FUNDAMENTALS OF ELECTRONICS ENGINEERING", "soft skills",
      "fundamentals of mechanical engineering", "engineering chemistry", "fundamentals of electrical engineering"
    ],
    3: [
      'data structure', 'digital electronics',
      'computer organization and architecture', 'python programming', 'discrete structures & theory of logic',
      "technical communication",
      "discrete structures & theory of logic", "mathematics-iv", "technical communication"
    ],
    4: [
      'data structure', 'digital electronics',
      'computer organization and architecture', 'python programming', 'discrete structures & theory of logic',
      "technical communication",
      "discrete structures & theory of logic", "mathematics-iv", "technical communication"
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
      // 'Advanced Machine Learning', 'Distributed Systems','Data Mining', 'Blockchain Technology',
      "internet of things",
      'project management', "cryptography & network security",
      "deep learning"
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
        gradient: 'from-clan-00 to-blue-500',
        hoverGradient: 'hover:from-clan-500 hover:to-blue-400',
        borderColor: 'border-red-500/30',
        bgGradient: 'from-clan-900/90 to-blue-900/80',
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

            {/* STEP 1: Select Semester FIRST */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Step 1: Choose Your Semester</h3>
                    <p className="text-sm text-gray-400">Start by selecting your current semester</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <button
                      key={sem}
                      onClick={() => {
                        handleFilterChange('semester', sem);
                        handleFilterChange('subject', ''); // Reset subject when semester changes
                      }}
                      className={`
            relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105
            ${localFilters.semester === sem
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-transparent shadow-xl scale-105'
                          : 'bg-gray-900/50 border-gray-700 hover:border-blue-500/50'
                        }
          `}
                    >
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-1 ${localFilters.semester === sem ? 'text-white' : 'text-gray-300'}`}>
                          {sem}
                        </div>
                        <div className={`text-xs ${localFilters.semester === sem ? 'text-white/80' : 'text-gray-500'}`}>
                          Semester
                        </div>
                      </div>

                      {localFilters.semester === sem && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 2: Filters (Only show when semester is selected) */}
            {localFilters.semester && (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <FilterIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Step 2: Filter Resources</h3>
                      <p className="text-sm text-gray-400">
                        Showing Semester {localFilters.semester} - {subjectsBySemester[localFilters.semester]?.length || 0} subjects available
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group"
                  >
                    <CloseIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Reset All</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Subject Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                      <span className="ml-2 text-xs text-blue-400">
                        ({subjectsBySemester[localFilters.semester]?.length || 0} available)
                      </span>
                    </label>
                    <select
                      value={localFilters.subject}
                      onChange={(e) => handleFilterChange('subject', e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option className='bg-gray-900' value="">All Subjects in Semester {localFilters.semester}</option>
                      {(subjectsBySemester[localFilters.semester] || []).map(subject => (
                        <option className='bg-gray-900' key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select
                      value={localFilters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option className='bg-gray-900' value="">All Materials</option>
                      <option className='bg-gray-900' value="Notes">📚 Study Notes</option>
                      <option className='bg-gray-900' value="Important Question">⭐ Important Questions</option>
                      <option className='bg-gray-900' value="PYQ">📄 Previous Year Questions</option>
                      <option className='bg-gray-900' value="Handwritten Notes">✏️ Handwritten Notes</option>
                    </select>
                  </div>

                  {/* Uploader Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Contributor</label>
                    <select
                      value={localFilters.uploadedBy}
                      onChange={(e) => handleFilterChange('uploadedBy', e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option className='bg-gray-900' value="">All Contributors</option>
                      {uniqueUploaders.map(uploader => (
                        <option className='bg-gray-900' key={uploader.id} value={uploader.id}>
                          {uploader.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search in Semester ${localFilters.semester}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Active Filters Display */}
                {(localFilters.subject || localFilters.category || localFilters.uploadedBy) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-400">Active filters:</span>
                    {localFilters.subject && (
                      <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-400 flex items-center space-x-2">
                        <span>{localFilters.subject}</span>
                        <button onClick={() => handleFilterChange('subject', '')} className="hover:text-blue-300">
                          <CloseIcon className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {localFilters.category && (
                      <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-400 flex items-center space-x-2">
                        <span>{localFilters.category}</span>
                        <button onClick={() => handleFilterChange('category', '')} className="hover:text-purple-300">
                          <CloseIcon className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {localFilters.uploadedBy && (
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-sm text-green-400 flex items-center space-x-2">
                        <span>{uniqueUploaders.find(u => u.id === localFilters.uploadedBy)?.name}</span>
                        <button onClick={() => handleFilterChange('uploadedBy', '')} className="hover:text-green-300">
                          <CloseIcon className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Message when no semester selected */}
            {!localFilters.semester && (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-yellow-500/30 rounded-2xl p-12 text-center mb-8">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👆</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Select Your Semester First</h3>
                <p className="text-gray-400">
                  Choose your semester above to see available subjects and study materials
                </p>
              </div>
            )}


            {/* Spotify-style OR divider */}
            {/* <div className="flex items-center my-8">
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
            </div> */}

            {/* Search Bar */}
            {/* <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div> */}
          </div>

         {/* ✨ REDESIGNED: Simple Stats Section */}
{localFilters.semester && (
  <div className="mb-8">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Resources Card */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Resources</p>
            <p className="text-3xl font-bold text-blue-400">{totalNotes}</p>
          </div>
          <span className="text-4xl">📊</span>
        </div>
      </div>

      {/* Category Cards */}
      {Object.entries(categoryStats).map(([category, count]) => {
        const config = getCategoryConfig(category);
        const isActive = localFilters.category === category;

        return (
          <button
            key={category}
            onClick={() => handleFilterChange('category', category)}
            className={`
              relative rounded-2xl p-6 transition-all duration-300 transform hover:scale-105
              ${isActive
                ? `bg-gradient-to-br ${config.gradient} border-transparent shadow-xl scale-105`
                : `bg-gradient-to-br from-gray-900/40 to-gray-800/30 border ${config.borderColor} hover:border-white/30`
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className={`text-sm font-medium mb-1 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                  {category}
                </p>
                <p className={`text-3xl font-bold ${isActive ? 'text-white' : config.textColor}`}>
                  {count}
                </p>
              </div>
              <span className="text-4xl">{config.icon}</span>
            </div>

            {/* Clear button if active */}
            {isActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFilterChange('category', '');
                }}
                className="absolute top-2 right-2 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Clear filter"
              >
                <CloseIcon className="w-4 h-4 text-white" />
              </button>
            )}
          </button>
        );
      })}
    </div>

    {/* Active Filter Badge */}
    {localFilters.category && (
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span>Filtering by:</span>
          <span className="px-3 py-1 bg-blue-600 text-white rounded-full font-medium">
            {localFilters.category}
          </span>
        </div>
        <button
          onClick={() => handleFilterChange('category', '')}
          className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1"
        >
          <CloseIcon className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>
    )}

    {/* Contributors Filter - Simple Version */}
    {notes && notes.length > 0 && (
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <span>👤</span>
          <span>Filter by Contributor</span>
        </h3>

        <div className="flex flex-wrap gap-3">
          {/* All Contributors Button */}
          <button
            onClick={() => handleFilterChange('uploadedBy', '')}
            className={`
              px-4 py-2 rounded-full font-medium transition-all
              ${!localFilters.uploadedBy
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }
            `}
          >
            All Contributors ({notes.length})
          </button>

          {/* Individual Contributors */}
          {uniqueUploaders.map(uploader => {
            const uploaderCount = notes.filter(n => n.uploadedBy?._id === uploader.id).length;
            const isActive = localFilters.uploadedBy === uploader.id;

            return (
              <button
                key={uploader.id}
                onClick={() => handleFilterChange('uploadedBy', uploader.id)}
                className={`
                  px-4 py-2 rounded-full font-medium transition-all flex items-center space-x-2
                  ${isActive
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                {/* Avatar */}
                {uploader?.avatar?.secure_url ? (
                  <img
                    src={uploader.avatar.secure_url}
                    alt={uploader.name}
                    className="w-5 h-5 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {uploader.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className='capitalize'>{uploader.name} ({uploaderCount})</span>
              </button>
            );
          })}
        </div>

        {/* Active Contributor Badge */}
        {localFilters.uploadedBy && (
          <div className="mt-3 text-sm text-gray-400">
            Showing notes by: <span className="text-purple-400 font-medium">
              {uniqueUploaders.find(u => u.id === localFilters.uploadedBy)?.name}
            </span>
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

             {/* Action Buttons - UPDATED */}
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
      {/* Request Material Button - NEW PRIMARY CTA */}
      <button
        onClick={() => setShowRequestModal(true)}
        className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
      >
        <div className="relative flex items-center space-x-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Request This Material</span>
        </div>
      </button>

      {/* Search All Semesters */}
      <Link
        to="/search"
        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition"
      >
        <div className="flex items-center space-x-2">
          <SearchIcon className="w-5 h-5" />
          <span>Search All Semesters</span>
        </div>
      </Link>
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

{/* <AdBanner /> */}
          {/* Notes Grid */}
          {!loading && filteredNotes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <CardRenderer key={note._id} note={note} />
              ))}
            </div>
          )}
          {/* <AdBanner /> */}
        </div>
        {/* Request Modal */}
{/* <RequestModal
  isOpen={showRequestModal}
  onClose={() => setShowRequestModal(false)}
  defaultSemester={localFilters.semester}
  defaultSubject={localFilters.subject}
/> */}

      </div>
    </HomeLayout>
  );
}
