// src/pages/Note.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotes, setFilters, clearFilters } from '../../REDUX/Slices/noteslice';
import aktulogo from "../../../public/download.jpeg";
import HomeLayout from '../../LAYOUTS/Homelayout';
import CardRenderer from './CardRenderer';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AdBanner from '../../COMPONENTS/AdBanner';
import RequestModal from '../../COMPONENTS/RequestModal';
import { getAllRequests, upvoteRequest } from '../../REDUX/Slices/requestSlice';
import { getAllVideoLectures } from '../../REDUX/Slices/videoLecture.slice'; // ✨ NEW
import { selectVideoLectureData } from '../../REDUX/Slices/videoLecture.slice';
import { shallowEqual } from 'react-redux';
import TrackedNoteCard from '../../COMPONENTS/Session/TrackedNoteCardWrapper';
import { fetchPreferences, openPreferenceDrawer } from '../../REDUX/Slices/plannerSlice';
import StudyPreferenceDrawer from '../../COMPONENTS/Planner/StudyPreferenceDrawer';
import { markPlannerReminderAsShown, shouldShowPlannerReminder } from '../../UTILS/shouldShowPlannerReminder';
import ResourceFilter from '../../COMPONENTS/Note/ResourceFilter';
import { UserRoundSearch,CalendarCog } from 'lucide-react'
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

  const [showRequestModal, setShowRequestModal] = useState(false);


  const dispatch = useDispatch();
  const { notes, loading, totalNotes, filters } = useSelector(state => state.note);
  // ✨ UPDATED: Get notes AND videos from Redux
  // In your component:
  const { allVideos: videos, loading: videoLoading } = useSelector(selectVideoLectureData);

  const [localFilters, setLocalFilters] = useState({
    semester: filters.semester || '',
    subject: filters.subject || '',
    category: filters.category || '',
    uploadedBy: filters.uploadedBy || '', // NEW
    unit: filters.unit, // ✅ NEW: For chapter/unit filter
    videoChapter: '', // ✨ NEW: For filtering videos by chapter
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
    // ✨ NEW: From videos
    videos?.forEach(video => {
      if (video.uploadedBy?._id) {
        uploaders.set(video.uploadedBy._id, {
          id: video.uploadedBy._id,
          name: video.uploadedBy.fullName || 'Unknown',
          avatar: video.uploadedBy.avatar
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
      'computer organization and architecture', 'python programming',
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
      // ✨ NEW: Fetch videos for this semester
      dispatch(getAllVideoLectures({ semester: localFilters.semester }));

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
      unit: '', // ✅ NEW: For chapter/unit filter
      uploadedBy: '', // NEW
      videoChapter: '', // ✨ NEW: Reset chapter filter too
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
    // ✅ NEW: Add unit filter
    const matchesUnit = !localFilters.unit ||
      note.unit === parseInt(localFilters.unit);
    return matchesSearch && matchesUploader && matchesUnit;;
  }) || [];
  // ✨ NEW: Filter videos
  const filteredVideos = videos?.filter(video => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChapter = !localFilters.videoChapter ||
      video.chapterNumber === parseInt(localFilters.videoChapter);

    const matchesUploader = !localFilters.uploadedBy ||
      video.uploadedBy?._id === localFilters.uploadedBy;

    return matchesSearch && matchesChapter && matchesUploader;
  }) || [];
  const getCategoryStats = () => {
    const stats = {};
    notes?.forEach(note => {
      stats[note.category] = (stats[note.category] || 0) + 1;
    });
    // ✨ NEW: Add video count
    if (videos && videos.length > 0) {
      stats['Video'] = videos.length;
    }
    return stats;
  };

  const categoryStats = getCategoryStats();
  // Get unique chapters from filtered videos
  const getUniqueChapters = () => {
    const chapters = new Set();
    videos?.forEach(video => {
      if (video.chapterNumber) {
        chapters.add(video.chapterNumber);
      }
    });
    return Array.from(chapters).sort((a, b) => a - b);
  };

  const uniqueChapters = getUniqueChapters();


  // // Handle category selection with collapse/expand behavior
  // const handleCategoryClick = (category) => {
  //   if (localFilters.category === category) {
  //     // If clicking the same category, toggle collapse
  //     setIsStatsCollapsed(!isStatsCollapsed);
  //   } else {
  //     // If clicking a different category, select it and expand
  //     handleFilterChange('category', category);
  //     setIsStatsCollapsed(false);
  //   }
  // };

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
      },
      'Video': { // ✨ NEW: Video category
        icon: '🎬',
        gradient: 'from-red-600 to-pink-500',
        hoverGradient: 'hover:from-red-500 hover:to-pink-400',
        borderColor: 'border-red-500/30',
        bgGradient: 'from-red-900/90 to-pink-900/80',
        textColor: 'text-red-400'
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
  // ✅ FIXED: displayResources with COMPLETE debugging
  const displayResources = useMemo(() => {
    const category = localFilters.category?.trim();
    const categoryLower = category?.toLowerCase();

    console.log('🎯 displayResources check:', {
      category,
      categoryLower,
      isVideoCategory: categoryLower === 'video',
      filteredVideos: filteredVideos?.length,
      filteredNotes: filteredNotes?.length,
      allVideos: videos?.length
    });

    // ✨ If Video category selected → show FILTERED videos
    if (categoryLower === 'video') {
      console.log('✅ Returning videos:', filteredVideos);
      return filteredVideos || [];
    }

    // ✨ If no category selected → show all notes
    if (!category) {
      console.log('✅ No category, returning all notes');
      return filteredNotes || [];
    }

    // ✨ If specific category selected → exact match
    const result = filteredNotes.filter(note =>
      note.category?.toLowerCase() === categoryLower
    );
    console.log('✅ Filtering by category:', category, 'found:', result.length);
    return result;
  }, [filteredNotes, filteredVideos, localFilters.category, localFilters]);

  // ✅ FIXED: Better category handler
  // const handleCategoryClick = (category) => {
  //   console.log('🎬 Category clicked:', category);

  //   if (localFilters.category?.toLowerCase() === category.toLowerCase()) {
  //     // If clicking the same category, toggle collapse
  //     setIsStatsCollapsed(!isStatsCollapsed);
  //   } else {
  //     // If clicking a different category, select it and expand
  //     handleFilterChange('category', category);
  //     setIsStatsCollapsed(false);
  //   }
  // };

  // ✅ Ensure videos are being fetched when component mounts and category changes
  useEffect(() => {
    console.log('📡 Fetching videos for semester:', localFilters.semester);
    if (localFilters.semester) {
      dispatch(getAllVideoLectures({
        semester: localFilters.semester
      }));
    }
  }, [localFilters.semester, dispatch]);
  const handleCategoryClick = (category) => {
    console.log('=== CATEGORY CLICK DEBUG ===');
    console.log('Clicked category:', category);
    console.log('Current category:', localFilters.category);
    console.log('Videos in Redux:', videos?.length);
    console.log('Filtered videos:', filteredVideos?.length);

    if (localFilters.category?.toLowerCase() === category.toLowerCase()) {
      setIsStatsCollapsed(!isStatsCollapsed);
    } else {
      handleFilterChange('category', category);
      setIsStatsCollapsed(false);
    }

    // After state updates
    setTimeout(() => {
      console.log('After filter change:');
      console.log('New localFilters:', localFilters);
    }, 0);
  };
  const getChapterStats = () => {
    if (localFilters.category !== 'Video') return {};

    const videoMaterials = materials.filter(material =>
      material.category === 'Video' &&
      material.semester === localFilters.semester &&
      (!localFilters.subject || material.subject === localFilters.subject)
    );

    const stats = {};
    videoMaterials.forEach(video => {
      const chapter = video.chapter || 'Unknown';
      stats[chapter] = (stats[chapter] || 0) + 1;
    });

    return stats;
  };

  const getChapterConfig = (chapter) => {
    const colors = [
      { gradient: 'from-blue-600 to-blue-700', textColor: 'text-blue-300', icon: '📖' },
      { gradient: 'from-purple-600 to-purple-700', textColor: 'text-purple-300', icon: '📚' },
      { gradient: 'from-pink-600 to-pink-700', textColor: 'text-pink-300', icon: '💡' },
      { gradient: 'from-green-600 to-green-700', textColor: 'text-green-300', icon: '🎯' },
      { gradient: 'from-orange-600 to-orange-700', textColor: 'text-orange-300', icon: '⚡' },
      { gradient: 'from-cyan-600 to-cyan-700', textColor: 'text-cyan-300', icon: '🔥' },
      { gradient: 'from-indigo-600 to-indigo-700', textColor: 'text-indigo-300', icon: '✨' },
      { gradient: 'from-rose-600 to-rose-700', textColor: 'text-rose-300', icon: '🌟' },
    ];

    const index = (parseInt(chapter) - 1) % colors.length;
    return colors[index];
  };
  const navigate = useNavigate();
  const isPreferencesSet = useSelector((state) => state.planner.isPreferencesSet);
  const ctaText = localFilters.subject
    ? `Study ${localFilters.subject} properly →`
    : isPreferencesSet
      ? "Continue my study plan →"
      : "Study in order →";

  const [showPlannerReminder, setShowPlannerReminder] = useState(false);

  useEffect(() => {
    if (!localFilters.semester) return;

    const shouldShow = shouldShowPlannerReminder();

    if (shouldShow) {
      setShowPlannerReminder(true);
      // ⚠️ DO NOT call markPlannerReminderAsShown() here!
      // Wait for user interaction
    }
  }, [localFilters.semester]);
  // State

  // ✅ FIXED: Close handler - mark as shown when dismissed
  const handleClosePlannerReminder = () => {
    setShowPlannerReminder(false);
    markPlannerReminderAsShown();  // ← Mark AFTER closing
  };

  // ✅ NEW: Separate handler for opening planner
  const handleOpenPlanner = () => {
    markPlannerReminderAsShown();  // ← Mark BEFORE navigating

    if (isPreferencesSet) {
      navigate("/planner");
    } else {
      dispatch(openPreferenceDrawer());
    }
  };


  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);
  // ✨ NEW: When semester changes, reset all other filters
const handleSemesterChange = (newSemester) => {
  const resetFilters = {
    semester: newSemester,
    subject: '', // ✅ Clear
    category: '', // ✅ Clear
    uploadedBy: '', // ✅ Clear
    unit: '', // ✅ Clear
    videoChapter: '', // ✅ Clear
    university: 'AKTU',
    course: 'BTECH'
  };
  setLocalFilters(resetFilters);
  setSearchTerm(''); // Clear search term too
  dispatch(clearFilters());
};
  return (
    <HomeLayout>
      <div className="min-h-screen bg-black text-white">
  {/* Notes Library Hero – Calm & Academic */}
{/* Notes Page Hero – Calm, Academic, Complete */}
<div className="bg-[#0F0F0F] border-b border-[#1F1F1F]">
  <div className="max-w-5xl mx-auto px-6 py-8 text-center">

    {/* Logo + Context */}
    <div className="flex items-center justify-center gap-2 mb-3">
      <img
        src={aktulogo}
        alt="AKTU Logo"
        loading="lazy"
        className="w-9 h-9 rounded-full"
      />
      <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
        AKTU Study Library
      </span>
    </div>

    {/* Title */}
    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
      Notes, PYQs & Exam Resources
    </h1>

    {/* Subtitle */}
    <p className="text-sm text-[#9CA3AF] max-w-xl mx-auto">
      Semester-wise notes, video lectures, PYQs and important questions —
      organized for focused AKTU preparation
    </p>

    {/* Resource Types */}
    <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
      <span className="px-3 py-1 rounded-full bg-[#1F1F1F] text-[#9CA3AF]">
        📘 Notes 
      </span>
      <span className="px-3 py-1 rounded-full bg-[#1F1F1F] text-[#9CA3AF]">
        ✏️ Handwritten notes
      </span>
      <span className="px-3 py-1 rounded-full bg-[#1F1F1F] text-[#9CA3AF]">
        📄 PYQs
      </span>
      <span className="px-3 py-1 rounded-full bg-[#1F1F1F] text-[#9CA3AF]">
        ⭐ Important Questions
      </span>
      <span className="px-3 py-1 rounded-full bg-[#1F1F1F] text-[#9CA3AF]">
        🎥 Video Lectures
      </span>
    </div>
<div className="pt-4">
      <button
        onClick={() => {
          const semesterSection = document.querySelector('[data-semester-section]');
          semesterSection?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="
          inline-flex items-center gap-2
          px-6 py-1
          rounded-full
          bg-[#9CA3AF] text-black
          hover:bg-white
          font-semibold text-sm
          transition-all duration-200
        "
      >
        Browse by Semester →
      </button>
    </div>
  </div>
</div>

        {/* Filters Section */}
        <div data-semester-section className="max-w-7xl mx-auto px-4 py-8">
          <ResourceFilter
            localFilters={localFilters}
            handleFilterChange={handleFilterChange}
            handleClearFilters={handleClearFilters}
            handleSemesterChange={handleSemesterChange} // ✨ ADD THIS
            subjectsBySemester={subjectsBySemester}
            uniqueChapters={uniqueChapters}
            uniqueUploaders={uniqueUploaders}
            isPreferencesSet={isPreferencesSet}
            navigate={navigate}
            dispatch={dispatch}
            openPreferenceDrawer={openPreferenceDrawer}
            ctaText={ctaText}
            notes={notes}        // Add this
            videos={videos}      // Add this
          />


          {/* ✨ UPDATED: Stats Section - Include Video Count */}
          {!loading && !videoLoading && localFilters.semester && (
            <div className="mb-8 space-y-3">


              {/* Contributors Filter - Simple Version */}
              {notes && notes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <UserRoundSearch className='w-6 h-6' />
                    <span>Filter by Contributor</span>
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {/* All Contributors Button */}
                    <button
                      onClick={() => handleFilterChange('uploadedBy', '')}
                      className={`
              px-4 py-2 rounded-full font-medium transition-all
              ${!localFilters.uploadedBy
                          ? 'bg-[#9CA3AF] text-black shadow-lg'
                          : 'bg-[#1F1F1F] text-gray-300 hover:bg-gray-700'
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
                              ? 'bg-[#9CA3AF] text-black shadow-lg'
                              : 'bg-[#1F1F1F] text-gray-300 hover:bg-gray-700'
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
                  {/* {localFilters.uploadedBy && (
                    <div className="mt-3 text-sm text-gray-400">
                      Showing notes by: <span className="text-purple-400 font-medium">
                        {uniqueUploaders.find(u => u.id === localFilters.uploadedBy)?.name}
                      </span>
                    </div>
                  )} */}
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
       {!loading && !videoLoading && localFilters.semester && filteredNotes.length === 0 && displayResources.length === 0 && (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="max-w-4xl w-full space-y-8">
       {/* TOP: PROMINENT REQUEST BUTTON - MAIN CTA */}
             <div className="text-center space-y-3 pt-8">
        <button
          onClick={() => setShowRequestModal(true)}
          className="group relative mx-auto px-8 py-4 bg-[#9CA3AF] hover:bg-white rounded-full font-bold text-black transition-all duration-300 flex items-center justify-center gap-3 max-w-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className='font-extrabold text-black' >Request Missing Material</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <p className="text-sm text-gray-400">Help build our library by requesting what you need</p>
      </div>

      {/* Icon & Message */}
      <div className="text-center space-y-4">
        {/* Animated Empty Icon */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700/40 to-gray-600/40 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            No Resources Yet
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            We don't have materials for <span className="text-blue-300 font-semibold">Semester {localFilters.semester}</span>
            {localFilters.subject && <> in <span className="text-purple-300 font-semibold">{localFilters.subject}</span></>}
            {searchTerm && <> matching <span className="text-pink-300 font-semibold">"{searchTerm}"</span></>} yet.
          </p>
        </div>
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
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${request.requestType === 'NOTES'
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
                            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${request.hasUpvoted
                              ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50 cursor-not-allowed'
                              : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20 hover:border-blue-400/50'
                              }`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-up-icon lucide-thumbs-up"><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" /><path d="M7 10v12" /></svg>
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
                                year: 'numeric'
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

      {/* Info Box */}
      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/30 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-bold text-blue-300 mb-2">💡 Can't Find Your Subject?</h4>
            <p className="text-sm text-gray-300 mb-3">
              AKTU allows subject flexibility per semester. Your desired subject might be in a different semester. Upvote popular requests to help us prioritize!
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300"><span className="text-green-300 font-semibold">Upvote requests</span> to show demand</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-400">→</span>
                <span className="text-gray-300"><span className="text-blue-300 font-semibold">Request material</span> to add to wishlist</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
        <Link
          to="/search"
          className="group flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-blue-500/50 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          <SearchIcon className="w-5 h-5" />
          <span>Search All Semesters</span>
        </Link>

        <button
          onClick={() => setShowRequestModal(true)}
          className="group flex-1 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-500/50 hover:border-pink-500/50 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Request Material</span>
        </button>
      </div>
    </div>
  </div>
)}


          

          {/* Enhanced Semester Selection Prompt */}
         {!loading && !localFilters.semester && (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="max-w-2xl w-full text-center space-y-8">
      {/* Animated Icon - Enhanced */}
      <div className="relative w-32 h-32 mx-auto mb-8">
        {/* Rotating Rings */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 animate-spin" style={{animationDuration: '3s'}}></div>
        <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-purple-500 border-r-pink-500 animate-spin" style={{animationDuration: '4s', animationDirection: 'reverse'}}></div>
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full backdrop-blur-sm border border-blue-500/30">
          <BookIcon className="w-16 h-16 text-blue-300" />
        </div>
      </div>

      {/* Main Message */}
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-white">
          Choose Your
          <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Semester
          </span>
        </h2>
        
        <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
          Select your current semester above to explore curated study materials, previous year questions, and handwritten notes tailored to your academic needs.
        </p>
      </div>

      {/* Alternative Actions */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <p className="text-sm text-gray-400">Or explore without choosing:</p>
        <Link
          to="/search"
          className="inline-flex items-center  gap-2 px-6 py-2 bg-[#9CA3AF] hover:bg-white  text-black rounded-full  transition-all"
        >
          {/* <SearchIcon className="w-5 h-5" /> */}
          <span className='text-sm font-semibold'>Search All Resources →</span>
        </Link>
      </div>
    </div>
  </div>
)}
          {/* <AdBanner /> */}
          {/* Notes Grid */}
          {/* Notes/Videos Grid - FIXED */}

          {displayResources && displayResources.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayResources.map((resource) => {
                // ✅ FIXED: Better type detection
                const isVideo = resource?.videoId || resource?.embedUrl || resource?.platform === 'YOUTUBE';

                return (
                  <TrackedNoteCard
                    key={resource._id}
                    item={resource}
                    type={isVideo ? 'video' : 'note'} // ✅ Detect from resource properties
                    note={resource}
                  />
                );
              })}
            </div>
          )}
          {/* 📘 Planner Guidance — After Notes Grid */}
          {displayResources && displayResources.length > 0 && showPlannerReminder && (
            <div className="mb-10 px-3 sm:px-0">
              <div
                className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
        px-5 py-5 sm:py-4
        rounded-2xl
        border border-slate-600/20
        bg-[#1F1F1F]
        shadow-sm backdrop-blur
      "
              >
                {/* Left: Message */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-11 h-11 rounded-xl bg-slate-500/15 flex items-center justify-center flex-shrink-0 text-xl">
                    <CalendarCog className='w-6 h-6' />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-slate-100">
                      Studying chapter-by-chapter works better
                    </p>

                    <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                      Planner arranges these notes, PYQs and important questions into a
                      clear order — complete one chapter, then move to the next without confusion.
                    </p>
                  </div>
                </div>

                {/* Right: CTA */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleOpenPlanner}
                    className="
            flex-1 sm:flex-none
            px-5 py-2.5
            text-xs sm:text-sm font-semibold
            rounded-full
            bg-[#9CA3AF] hover:bg-white text-black
            active:scale-[0.98]
            transition-all duration-200
            whitespace-nowrap
            focus:outline-none focus:ring-2 focus:ring-slate-400/40
          "
                  >
                    Organize my study →
                  </button>

                  <button
                    onClick={handleClosePlannerReminder}
                    className="
            px-3 py-2.5
            text-slate-400 hover:text-slate-200
            hover:bg-white/5
            rounded-lg
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-slate-400/30
          "
                    aria-label="Dismiss"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}




          {/* Empty State - ADD THIS */}
          {!loading && !videoLoading && (!displayResources || displayResources.length === 0) && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">
                {localFilters.category === 'Video'
                  ? 'No videos found for this semester'
                  : 'No resources found'}
              </p>
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

      {/* Planner Drawer (must be mounted) */}
      <StudyPreferenceDrawer isFirstTime={false} />
    </HomeLayout>
  );
}
