// src/pages/Note.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotes, setFilters, clearFilters } from '../../REDUX/Slices/noteslice';
import aktulogo from "../../../public/download.jpeg";
import HomeLayout from '../../LAYOUTS/Homelayout';
import CardRenderer from './CardRenderer';
import { Link } from 'react-router-dom';
import AdBanner from '../../COMPONENTS/AdBanner';
import RequestModal from '../../COMPONENTS/RequestModal';
import { getAllRequests, upvoteRequest } from '../../REDUX/Slices/requestSlice';

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
      'Electrical Engineering', 'environment and ecology', "FUNDAMENTALS OF ELECTRONICS ENGINEERING", "soft skills",
      "fundamentals of mechanical engineering", "engineering chemistry", "fundamentals of electrical engineering"
    ],
    2: [
      'Mathematics-II', , 'engineering physics', 'programming for problem solving',
      'Electrical Engineering', 'environment and ecology', "FUNDAMENTALS OF ELECTRONICS ENGINEERING", "soft skills",
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
const { allRequests: popularRequests, loading: requestsLoading } = useSelector((state) => state.request);
  // const [localFilters, setLocalFilters] = useState({ semester: 3 });

  // Fetch popular requests for current semester
  useEffect(() => {
    if (localFilters.semester) {
      dispatch(getAllRequests({
        semester: localFilters.semester,
        sortBy: 'upvotes',  // Show most upvoted
        page: 1,
        requestType: ''
      }));
    }
  }, [localFilters.semester, dispatch]);

  return (
    <HomeLayout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section - Enhanced for AKTU */}
     <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
  {/* Subtle Overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>

  <div className="relative max-w-5xl mx-auto px-6 py-8 text-center">
    {/* Logo & Badge - Compact */}
    <div className="inline-flex items-center justify-center mb-3 space-x-2">
      <img src={aktulogo} alt="AKTU Logo" loading="lazy" className="w-10 h-10 rounded-full" />
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        AKTU
      </div>
    </div>

    {/* Title - Very Compact */}
    <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
      AKTU Notes, PYQs & Questions
    </h1>

    {/* Tagline - One Liner */}
    <p className="text-sm text-gray-400 max-w-xl mx-auto mb-4">
      Semester-wise notes, PYQ papers & important questions
    </p>

    {/* Features - Single Row */}
    <div className="flex flex-wrap justify-center gap-3 text-xs">
      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">📚 Notes</span>
      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">📄 PYQs</span>
      <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full">⭐ Questions</span>
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
            <div className="mb-8 hidden md:block  ">
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
            {/* STEP 1: Select Semester */}
<div className="mb-6 md:hidden ">
  <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-3">
    {/* Header */}
    <div className="flex items-center gap-2 mb-3">
      <span className="text-lg">🎓</span>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-white">Select Semester</h3>
        <p className="text-xs text-gray-400">Choose your current semester</p>
      </div>
    </div>

    {/* Semester Buttons - Compact Grid */}
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
        <button
          key={sem}
          onClick={() => {
            handleFilterChange('semester', sem);
            handleFilterChange('subject', '');
          }}
          className={`
            relative p-2 rounded-lg border transition-all duration-300 transform hover:scale-105 text-center
            ${localFilters.semester === sem
              ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-transparent shadow-lg scale-105'
              : 'bg-gray-900/40 border-gray-700/50 hover:border-blue-500/50'
            }
          `}
        >
          <div className={`text-lg font-bold ${localFilters.semester === sem ? 'text-white' : 'text-gray-300'}`}>
            {sem}
          </div>

          {localFilters.semester === sem && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  </div>
</div>


            {/* STEP 2: Filters (Only show when semester is selected) */}
     {/* STEP 2: Filters - Modern Cards */}
{localFilters.semester && (
  <div className="mb-6 space-y-3">
    {/* Header with Reset */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FilterIcon className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-semibold text-white">
          Filter Semester {localFilters.semester}
        </span>
        <span className="text-xs text-slate-500">
          ({subjectsBySemester[localFilters.semester]?.length || 0} subjects)
        </span>
      </div>
      {(localFilters.subject || localFilters.category || localFilters.uploadedBy) && (
        <button
          onClick={handleClearFilters}
          className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors flex items-center gap-1"
        >
          <CloseIcon className="w-3 h-3" />
          Clear All
        </button>
      )}
    </div>

    {/* Filter Controls - Responsive Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {/* Subject */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5">
        <label className="text-xs text-slate-400 font-semibold block mb-1">Subject</label>
        <select
          value={localFilters.subject}
          onChange={(e) => handleFilterChange('subject', e.target.value)}
          className="w-full bg-black/50 border border-slate-600/50 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option className="bg-gray-900" value="">
            All Subjects
          </option>
          {(subjectsBySemester[localFilters.semester] || []).map((subject) => (
            <option className="bg-gray-900" key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        {localFilters.subject && (
          <p className="text-xs text-blue-400 mt-1.5 px-2 py-1 bg-blue-500/10 rounded">
            📌 {localFilters.subject}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5">
        <label className="text-xs text-slate-400 font-semibold block mb-1">Type</label>
        <select
          value={localFilters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full bg-black/50 border border-slate-600/50 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option className="bg-gray-900" value="">
            All Materials
          </option>
          <option className="bg-gray-900" value="Notes">📚 Study Notes</option>
          <option className="bg-gray-900" value="Important Question">⭐ Important Q's</option>
          <option className="bg-gray-900" value="PYQ">📄 Previous Year Q's</option>
          <option className="bg-gray-900" value="Handwritten Notes">✏️ Handwritten</option>
        </select>
        {localFilters.category && (
          <p className="text-xs text-purple-400 mt-1.5 px-2 py-1 bg-purple-500/10 rounded">
            ✓ {localFilters.category}
          </p>
        )}
      </div>

      {/* Contributor */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5">
        <label className="text-xs text-slate-400 font-semibold block mb-1">By</label>
        <select
          value={localFilters.uploadedBy}
          onChange={(e) => handleFilterChange('uploadedBy', e.target.value)}
          className="w-full bg-black/50 border border-slate-600/50 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option className="bg-gray-900" value="">
            All Contributors
          </option>
          {uniqueUploaders.map((uploader) => (
            <option className="bg-gray-900" key={uploader.id} value={uploader.id}>
              {uploader.name}
            </option>
          ))}
        </select>
        {localFilters.uploadedBy && (
          <p className="text-xs text-green-400 mt-1.5 px-2 py-1 bg-green-500/10 rounded">
            👤 {uniqueUploaders.find((u) => u.id === localFilters.uploadedBy)?.name}
          </p>
        )}
      </div>
    </div>
  </div>
)}



            {/* Message when no semester selected */}
            {/* {!localFilters.semester && (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-yellow-500/30 rounded-2xl p-12 text-center mb-8">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👆</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Select Your Semester First</h3>
                <p className="text-gray-400">
                  Choose your semester above to see available subjects and study materials
                </p>
              </div>
            )} */}
            {!localFilters.semester && (
  <div className="mb-6 text-center py-3 px-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
    <p className="text-sm text-yellow-300 font-medium mb-1">👆 Select a semester first</p>
    <p className="text-xs text-slate-400">Materials will appear once you choose</p>
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

 {/* ✨ REDESIGNED: Simple Stats Section - ONLY SHOW WHEN LOADED */} 
{!loading && localFilters.semester && (
  <div className="mb-8">
    {/* Stats Cards */}
  {/* Stats Cards - Compact Version */}
<div className="mb-8 space-y-3">
  {/* Total Resources - Featured Card */}
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">Total Resources</p>
        <p className="text-3xl font-bold text-white">{totalNotes}</p>
      </div>
      <span className="text-5xl opacity-30">📊</span>
    </div>
  </div>

  {/* Category Stats - Inline Compact */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
    {Object.entries(categoryStats).map(([category, count]) => {
      const config = getCategoryConfig(category);
      const isActive = localFilters.category === category;

      return (
        <button
          key={category}
          onClick={() => handleFilterChange('category', category)}
          className={`
            relative rounded-lg p-3 transition-all duration-300 transform hover:scale-105 group
            ${isActive
              ? `bg-gradient-to-br ${config.gradient} border-transparent shadow-lg scale-105`
              : `bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600`
            }
          `}
        >
          {/* Icon and Count */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <div className="text-left flex-1">
              <p className={`text-xs font-medium mb-0.5 ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
                {category}
              </p>
              <p className={`text-xl font-bold ${isActive ? 'text-white' : config.textColor}`}>
                {count}
              </p>
            </div>
          </div>

          {/* Clear button if active */}
          {isActive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFilterChange('category', '');
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-500/80 hover:bg-red-600 rounded-full transition-colors shadow-md"
              title="Clear filter"
            >
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </button>
      );
    })}
  </div>
</div>






    {/* Active Filter Badge */}
    {/* {localFilters.category && (
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
    )} */}

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
  <div className="space-y-6 py-8">
    {/* Header Skeleton */}
    <div className="space-y-3">
      <div className="h-8 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg w-3/4 animate-pulse"></div>
      <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg w-1/2 animate-pulse"></div>
    </div>

    {/* Search Bar Skeleton */}
    <div className="h-12 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl animate-pulse"></div>

    {/* Filter Buttons Skeleton */}
    <div className="flex gap-3 flex-wrap">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full w-24 animate-pulse"
        ></div>
      ))}
    </div>

    {/* Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700/50 p-4 space-y-4"
        >
          {/* Thumbnail Skeleton */}
          <div className="h-40 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-pulse"></div>

          {/* Title Skeleton */}
          <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg w-5/6 animate-pulse"></div>

          {/* Subtitle Skeleton */}
          <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg w-4/6 animate-pulse"></div>

          {/* Button Skeleton */}
          <div className="pt-2">
            <div className="h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


       {/* Enhanced Empty State with Popular Requests */}
{!loading && localFilters.semester && filteredNotes.length === 0 && (
  <div className="text-center py-12 px-4">
    
    {/* TOP: PROMINENT REQUEST BUTTON - MAIN CTA */}
    <div className="mb-10">
      <button
        onClick={() => setShowRequestModal(true)}
        className="group relative mx-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-xl font-bold text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 mb-3"
      >
        <svg className="w-6 h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Request This Material</span>
        <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
      <p className="text-xs text-gray-500 mt-2">
        Missing something? Let us know! We'll add it to our library.
      </p>
    </div>

    {/* Icon */}
    <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.771 2 16.5S6.5 26.747 12 26.747s10-4.518 10-10.247S17.5 6.253 12 6.253z" />
      </svg>
    </div>

    {/* Main Message */}
    <h3 className="text-2xl font-bold text-white mb-2">
      No Resources Found Yet
    </h3>

    {/* Detailed Context */}
    <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
      We don't have notes for <span className="text-blue-400 font-semibold">Semester {localFilters.semester}</span>
      {localFilters.subject && (
        <> in <span className="text-purple-400 font-semibold">{localFilters.subject}</span></>
      )}
      {searchTerm && (
        <> matching <span className="text-green-400 font-semibold">"{searchTerm}"</span></>
      )} just yet.
    </p>

    {/* POPULAR REQUESTS SECTION - NEW FEATURE */}
    <div className="max-w-4xl mx-auto mb-12">
      <div className="text-left mb-6">
        <h4 className="text-lg font-bold text-white mb-2">📋 Popular Requests for Semester {localFilters.semester}</h4>
        <p className="text-xs text-gray-400">
          Help the community by upvoting what you need. Popular requests get prioritized! ⬆️
        </p>
      </div>

      {/* Popular Requests Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {popularRequests && popularRequests.length > 0 ? (
    popularRequests.map((request) => (
      <div
        key={request._id}
        className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-5  text-left group"
      >
        {/* Header with Type Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h5 className="font-bold text-white group-hover:text-blue-300 transition mb-2">
              {request.subject}
            </h5>
            <div className="flex gap-2 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                request.requestType === 'NOTES'
                  ? 'bg-blue-500/20 text-blue-300'
                  : request.requestType === 'PYQ'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-pink-500/20 text-pink-300'
              }`}>
                {request.requestType === 'NOTES' ? '📖 Notes' : request.requestType === 'PYQ' ? '📄 PYQs' : '❓ Questions'}
              </span>
              <span className="text-xs bg-gray-700/40 text-gray-300 px-2 py-1 rounded-full">
                {request.branch} • Sem {request.semester}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          {request.status === 'FULFILLED' && (
            <div className="flex-shrink-0 ml-2">
              <span className="inline-block bg-green-500/20 text-green-300 text-lg">✓</span>
            </div>
          )}
        </div>

        {/* Description */}
        {request.description && (
          <p className="text-xs text-gray-400 mb-4 line-clamp-2">
            {request.description}
          </p>
        )}

        {/* Upvote Button & Count */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => dispatch(upvoteRequest(request._id))}
            disabled={request.hasUpvoted}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              request.hasUpvoted
                ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50 cursor-not-allowed'
                : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20 hover:border-blue-400/50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-up-icon lucide-thumbs-up"><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/><path d="M7 10v12"/></svg>
            <span>{request.upvoteCount}</span>
          </button>
        </div>

        {/* Already Upvoted Badge */}
        {request.hasUpvoted && (
          <p className="text-xs text-blue-300 mb-4">✓ You've upvoted this</p>
        )}

        {/* REQUESTER INFO SECTION - With Avatar */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Avatar Image */}
            {request.requestedBy?.avatar?.secure_url ? (
              <img
                src={request.requestedBy.avatar.secure_url}
                alt={request.requestedBy.fullName}
                className="w-10 h-10 rounded-full object-cover border border-white/20 hover:border-white/40 transition"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border border-white/20">
                <span className="text-white font-bold text-sm">
                  {request.requestedBy?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            )}

            {/* Requester Name & Details */}
            <div className="flex-1">
              <p className="text-xs  capitalize font-semibold text-white">
                {request.requestedBy?.fullName || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-400">
                {request.requestedBy?.academicProfile?.branch} • Sem {request.requestedBy?.academicProfile?.semester}
              </p>
            </div>
          </div>

          {/* Time Posted */}
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {new Date(request.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year:'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-2 text-center py-8">
      <p className="text-gray-400 text-sm">No requests yet for this semester. Be the first to request! 🚀</p>
    </div>
  )}
</div>


      {/* View All Requests Link */}
      <div className="mt-6">
        <Link
          to="/browse-requests"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm group"
        >
          View all requests
          <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>

    {/* HELPFUL INFO BOX */}
    <div className="max-w-3xl mx-auto mb-8">
      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/30 border border-blue-500/40 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01" />
              </svg>
            </div>
          </div>

          <div className="flex-1 text-left">
            <h4 className="text-lg font-semibold text-blue-300 mb-2">
              💡 Can't Find Your Subject?
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              AKTU allows flexibility in subject selection per semester. Your desired subject might be in a different semester. Check the popular requests above - if someone else needs it too, upvote to help prioritize!
            </p>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <span className="text-green-400 font-bold mt-0.5">✓</span>
                <span className="text-gray-300"><span className="text-green-300 font-semibold">Upvote requests</span> - Show what's in demand</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold mt-0.5">→</span>
                <span className="text-gray-300"><span className="text-blue-300 font-semibold">Request new material</span> - Add to community wishlist</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold mt-0.5">♦</span>
                <span className="text-gray-300"><span className="text-purple-300 font-semibold">Browse all requests</span> - See what others need</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ACTION BUTTONS */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
      <Link
        to="/search"
        className="group flex-1 sm:flex-none px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500/50 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search All Semesters</span>
      </Link>

      <Link
        to="/notes"
        className="group flex-1 sm:flex-none px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.771 2 16.5S6.5 26.747 12 26.747s10-4.518 10-10.247S17.5 6.253 12 6.253z" />
        </svg>
        <span>Browse Library</span>
      </Link>
    </div>

    {/* QUICK ACTIONS GRID */}
    <div className="mb-6">
      <p className="text-xs text-gray-500 mb-3">⚡ Quick Actions</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link to="/search">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/30 hover:border-blue-500/60 rounded-lg p-4 text-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-sm font-semibold text-blue-300 mb-1">Advanced Search</div>
            <div className="text-xs text-gray-500">Find across all semesters</div>
          </div>
        </Link>

        <Link to="/notes">
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/30 hover:border-purple-500/60 rounded-lg p-4 text-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-sm font-semibold text-purple-300 mb-1">Browse All Subjects</div>
            <div className="text-xs text-gray-500">Explore full library</div>
          </div>
        </Link>

        <button
          onClick={() => setShowRequestModal(true)}
          className="bg-gradient-to-br from-pink-900/30 to-pink-900/10 border border-pink-500/30 hover:border-pink-500/60 rounded-lg p-4 text-center transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 cursor-pointer w-full"
        >
          <div className="text-3xl mb-2">📝</div>
          <div className="text-sm font-semibold text-pink-300 mb-1">Request Material</div>
          <div className="text-xs text-gray-500">Add to library</div>
        </button>
      </div>
    </div>

    {/* PRO TIP */}
    <div className="max-w-lg mx-auto pt-4 border-t border-gray-800">
      <p className="text-xs text-gray-500 leading-relaxed">
        <span className="text-yellow-400 font-bold">💡 Pro Tip:</span> The more people upvote a request, the faster our team works to add it! Start with popular requests and help your community get the materials they need.
      </p>
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
<RequestModal
  isOpen={showRequestModal}
  onClose={() => setShowRequestModal(false)}
  defaultSemester={localFilters.semester}
  defaultSubject={localFilters.subject}
/>

      </div>
    </HomeLayout>
  );
}
