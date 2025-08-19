// src/pages/Note.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotes, setFilters, clearFilters } from '../../REDUX/Slices/noteslice';

import HomeLayout from '../../LAYOUTS/Homelayout';
import CardRenderer from './CardRenderer';

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
    'Data Structures', 'Digital Electronics', 
    'Computer Organization and Architecture ', 'Python Programming', 'Discrete Mathematics'
  ],
  4: [
    'Mathematics-IV', 'TAFL', 'Operating System', 
    'Oops-Java', 'Cyber Security', 'UHV'
  ],
  5: [
    'Computer Graphics', 'Web Technology', 'Compiler Design', 
    'Analysis of Algorithms', 'System Programming', 'Microprocessors'
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
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
                <BookIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                Academic Notes & Resources
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Discover comprehensive study materials, previous year questions, and important notes for your semester
              </p>
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
                  onChange={(e) => handleFilterChange('semester', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Semester</option>
                  {[...Array(8)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                  ))}
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

          {/* Stats Cards */}
          {localFilters.semester && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/20 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">{totalNotes}</div>
                <div className="text-sm text-gray-400">Total Resources</div>
              </div>
              
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-sm text-gray-400">{category}</div>
                </div>
              ))}
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

          {/* Empty State */}
          {!loading && localFilters.semester && filteredNotes.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Resources Found</h3>
              <p className="text-gray-400 mb-6">
                No notes found for Semester {localFilters.semester}
                {localFilters.subject && ` in ${localFilters.subject}`}
                {searchTerm && ` matching "${searchTerm}"`}.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Semester Selection Prompt */}
          {!loading && !localFilters.semester && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookIcon className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Select Your Semester</h3>
              <p className="text-gray-400 mb-6">
                Choose your semester from the filter above to browse available study materials.
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
