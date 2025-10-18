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

export default function Note() {
  const dispatch = useDispatch();
  const { notes, loading, totalNotes, filters } = useSelector(state => state.note);
  
  const [localFilters, setLocalFilters] = useState({
    semester: filters.semester || '',
    subject: filters.subject || '',
    category: filters.category || 'Notes',
    university: filters.university || 'AKTU',
    course: filters.course || 'BTECH'
  });

  const [searchTerm, setSearchTerm] = useState('');

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
    'computer organization and architecture', 'Python Programming', 'discrete structures & theory of logic',"mathematics-iv",
    "technical communication",
  ],
  4: [
    'Mathematics-IV', 'TAFL', 'Operating System', 
    'Oops-Java', 'Cyber Security', 'UHV'
  ],
  5: [
    'Web Technology', 'cloud computing', 
    'design and analysis of algorithm', 
    "object oriented system design with c++","machine learning techniques",
    "database management system","artificial intelligence","introduction to data analytics and visualization","Constitution of India"
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
      category: 'Notes',
      university: 'AKTU',
      course: 'BTECH'
    };
    setLocalFilters(resetFilters);
    setSearchTerm('');
    dispatch(clearFilters());
  };

  // Filter notes by search term
  const filteredNotes = notes?.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getCategoryStats = () => {
    const stats = {};
    notes?.forEach(note => {
      stats[note.category] = (stats[note.category] || 0) + 1;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

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
      <img src={aktulogo} alt="AKTU Logo" className="w-14 rounded-4xl h-14" />
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
      Your one-stop portal for semester‐wise lecture notes, previous year question papers, 
      and curated important questions—officially organized by AKTU syllabus.
    </p>

    {/* Key Feature Highlights */}
    <div className="flex flex-col sm:flex-row justify-center gap-6">
      <div className="flex items-center space-x-3">
        <BookIcon className="w-7 h-7 text-blue-400" />
        <span className="text-lg text-gray-200">Semester‐wise Lecture Notes</span>
      </div>
      <div className="flex items-center space-x-3">
        <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-5-5-5 5m10 0H5" />
        </svg>
        <span className="text-lg text-gray-200">Previous Year Question Papers</span>
      </div>
      <div className="flex items-center space-x-3">
        <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-lg text-gray-200">Curated Important Questions</span>
      </div>
    </div>

    {/* Call to Action */}
    {/* <div className="mt-10">
      <Link
        to="/search"
        className="inline-flex items-center gap-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transform transition"
      >
        <SearchIcon className="w-5 h-5" />
        Search AKTU Resources
      </Link>
    </div> */}
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
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear All
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


              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                
                <select
                  value={localFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Show All Materials</option>
                  <option value="Notes">Notes</option>
                  <option value="PYQ">Previous Year Questions</option>
                  <option value="Important Question">Important Questions</option>
                </select>
                <div className="mt-1 text-xs text-gray-400 text-center">
    Choose <span className="text-green-400">PYQ</span> for exam prep, <span className="text-blue-400">Notes</span> for learning
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
        ? ` All Semester ${localFilters.semester} Subjects` 
        : ' All Subjects'
      }
    </option>
    
    {/* Show filtered subjects based on semester */}
    {(localFilters.semester 
      ? subjectsBySemester[localFilters.semester] || []
      : allSubjects
    ).map(subject => (
      <option key={subject} value={subject}>
        {subject}
      </option>
    ))}
  </select>
  
  {/* Helper text */}
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

         {/* Stats Cards (Interactive) */}
{localFilters.semester && (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    {/* Total Resources (non-clickable) */}
    <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/20 rounded-xl p-4">
      <div className="text-2xl font-bold text-blue-400">{totalNotes}</div>
      <div className="text-sm text-gray-400">Total Resources</div>
    </div>

    {/* Clickable category cards */}
    {Object.entries(categoryStats).map(([category, count]) => {
      const isActive = localFilters.category === category;
      return (
        <button
          key={category}
          onClick={() => handleFilterChange('category', category)}
          className={`
            relative flex flex-col items-center justify-center p-4 rounded-xl
            transition-colors duration-200
            ${isActive
              ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-transparent text-white shadow-lg'
              : 'bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-white/10 text-gray-300 hover:bg-gray-800 hover:border-purple-500'}
          `}
        >
          <div className="text-2xl font-bold">
            {count}
          </div>
          <div className="text-sm mt-1">
            {category}
          </div>
          {/* Active indicator */}
          {isActive && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></div>
          )}
        </button>
      );
    })}
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
    <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 ">
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
        <Link to={"/search"} >
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
    <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 ">
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
      <button
        onClick={handleClearFilters}
        className="inline-flex items-center px-5 py-2 border-2 border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 rounded-full transition-colors"
      >
        <svg
  className="w-5 h-5 mr-2 relative z-10"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M4 4v6h6M20 20v-6h-6M4 14a8 8 0 0114-4.9M20 10a8 8 0 01-14 4.9"
  />
</svg>
        <span>Reset Filters</span>
      </button>
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
