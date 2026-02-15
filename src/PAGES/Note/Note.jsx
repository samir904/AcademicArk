// src/pages/Note.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotes, setFilters, clearFilters, getNextNotesPage, resetPagination, getNoteStats, getSemesterPreviewNotes } from '../../REDUX/Slices/noteslice';
import aktulogo from "../../../public/download.jpeg";
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
import { UserRoundSearch, CalendarCog, RefreshCcw } from 'lucide-react'
import PageTransition from '../../COMPONENTS/PageTransition';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import BottomLoader from '../../COMPONENTS/Note/BottomLoader';
import { useSearchParams } from "react-router-dom";
import ActiveFilterPills from '../../COMPONENTS/Note/ActiveFilterPills';
import ActiveFilterPillsRow from '../../COMPONENTS/Note/ActiveFilterPillsRow';
import {
  fetchSavedFilters,
  createSavedFilter,
  deleteSavedFilter,
  setDefaultSavedFilter,
  trackPresetUsage
} from "../../REDUX/Slices/savedFilterSlice";

import {
  selectSavedFilters,
  selectDefaultSavedFilter
} from "../../REDUX/selectors/savedFilter.selectors";
import SaveFilterPresetModal from '../../COMPONENTS/Note/SaveFilterPresetModal';
import toast from 'react-hot-toast';
import EmotionalToast from '../../COMPONENTS/Common/EmotionalToast';
import DefaultPresetToast from '../../COMPONENTS/Common/DefaultPresetToast';
import { checkPresetSuggestion, trackFilterEvent } from '../../REDUX/Slices/filterAnalyticsSlice';
import { calculateScrollDepth, getDeviceInfo, TimeTracker } from '../../HELPERS/analyticsHelper';
import axiosInstance from '../../HELPERS/axiosInstance';
import PresetSuggestionModal from '../../COMPONENTS/Note/PresetSuggestionModal';
import { getSubjectShortName } from '../../UTILS/subjectShortName';
import { fetchHybridFilters } from '../../REDUX/Slices/filterAnalyticsSlice';

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
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const { notes, loading, totalNotes, pagination, filters } = useSelector(state => state.note);
  // ✨ UPDATED: Get notes AND videos from Redux
  // In your component:
  const { allVideos: videos, loading: videoLoading } = useSelector(selectVideoLectureData);
  const { total, categories } = useSelector(state => state.note.stats);

  const savedFilters = useSelector(selectSavedFilters);
  const defaultSavedFilter = useSelector(selectDefaultSavedFilter);
  // const [localFilters, setLocalFilters] = useState({
  //   semester: filters.semester || '',
  //   subject: filters.subject || '',
  //   category: filters.category || '',
  //   uploadedBy: filters.uploadedBy || '', // NEW
  //   unit: filters.unit, // ✅ NEW: For chapter/unit filter
  //   videoChapter: '', // ✨ NEW: For filtering videos by chapter
  //   university: filters.university || 'AKTU',
  //   course: filters.course || 'BTECH'
  // });


  const getFiltersFromURL = () => ({
    semester: searchParams.get("semester") ? Number(searchParams.get("semester")) : "",
    subject: searchParams.get("subject") || "",
    category: searchParams.get("category") || "",
    unit: searchParams.get("unit") || "",
    uploadedBy: searchParams.get("uploadedBy") || "",
    videoChapter: searchParams.get("videoChapter") || "",
    university: "AKTU",
    course: "BTECH"
  });
  const [localFilters, setLocalFilters] = useState(getFiltersFromURL);
  // 🔥 URL → state ONLY on first mount
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    setLocalFilters(urlFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isOnlySemester =
    localFilters.semester &&
    !localFilters.subject &&
    !localFilters.category &&
    !localFilters.unit &&
    !localFilters.uploadedBy;
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

  const loadMore = useCallback(() => {
    if (
      !localFilters.semester ||              // 🚨 BLOCK
      !pagination.hasMore ||
      pagination.isLoadingMore
    ) {
      return;
    }

    dispatch(getAllNotes({
      filters: localFilters,
      cursor: pagination.nextCursor
    }));
  }, [pagination.nextCursor, pagination.hasMore, pagination.isLoadingMore, localFilters]);


  const bottomRef = useInfiniteScroll(
    loadMore,
    pagination.isLoadingMore,
    pagination.hasMore && !loading
  );

  // Subject mapping by semester
  const subjectsBySemester = {
    1: [
      'engineering mathematics-i', 'engineering physics', 'programming for problem solving',
      'environment and ecology', "FUNDAMENTALS OF ELECTRONICS ENGINEERING", "soft skills",
      "fundamentals of mechanical engineering", "engineering chemistry", "fundamentals of electrical engineering"
    ],
    2: [
      'engineering mathematics-II', , 'engineering physics', 'programming for problem solving',
      'environment and ecology', "FUNDAMENTALS OF ELECTRONICS ENGINEERING", "soft skills",
      "fundamentals of mechanical engineering", "engineering chemistry", "fundamentals of electrical engineering"
    ],
    3: [
      'data structure', 'digital electronics',
      'computer organization and architecture', 'python programming',
      "discrete structures & theory of logic", "mathematics-iv", "technical communication"
    ],
    4: [
      'digital electronics',
      "mathematics-iv",
      "operating system",
      "THEORY OF AUTОMАTА AND FORMAL LANGUAGES",
      "Object Oriented Programming with Java",
      "CYBER SECURITY", "Universal Human Values and Professional Ethics"
    ],
    5: [
      'Web Technology', 'cloud computing',
      'design and analysis of algorithm',
      "object oriented system design with c++", "machine learning techniques",
      "database management system", "artificial intelligence", "introduction to data analytics and visualization", "Constitution of India"
    ],
    6: [
      'Computer network',
      'software project management',
      "software engineering",
      'Big Data',
      'Social Media Analytics and Data Analysis',
      'compiler design',
      "Machine Learning Techniques",
      "cloud computing",
      'Indian Tradition, Culture and Society'
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
    if (!localFilters.semester) return;

    dispatch(resetPagination());

    const filterParams = Object.fromEntries(
      Object.entries(localFilters).filter(([_, value]) => value)
    );

    if (isOnlySemester) {
      // 🔥 SEMESTER PREVIEW MODE
      dispatch(getSemesterPreviewNotes(localFilters.semester));
    } else {
      // 🔥 FULL NOTES MODE
      dispatch(getAllNotes({
        filters: filterParams,
        cursor: null
      }));
    }
    // Fetch stats  in every  mode
    dispatch(getNoteStats(filterParams));

    // Videos always depend on semester
    dispatch(getAllVideoLectures({ semester: localFilters.semester }));

  }, [localFilters.semester, localFilters.subject, localFilters.category, localFilters.unit]);
  const filterParams = { ...localFilters };

  if (!['Notes', 'Handwritten Notes'].includes(filterParams.category)) {
    delete filterParams.unit;
  }

  if (filterParams.category !== 'Video') {
    delete filterParams.videoChapter;
  }

  const handleFilterChange = (keyOrObject, value) => {
    setLocalFilters(prev => {
      let updated = { ...prev };

      // ✅ Support object updates
      if (typeof keyOrObject === 'object') {
        updated = { ...updated, ...keyOrObject };
      } else {
        updated[keyOrObject] = value;
      }

      // 🔥 SUBJECT CHANGE → reset everything below
      if (
        (typeof keyOrObject === 'string' && keyOrObject === 'subject') ||
        keyOrObject?.subject
      ) {
        updated.category = '';
        updated.unit = '';
        updated.videoChapter = '';
      }

      // 🔥 CATEGORY CHANGE → reset dependent filters
      if (
        (typeof keyOrObject === 'string' && keyOrObject === 'category') ||
        keyOrObject?.category !== undefined
      ) {
        updated.unit = '';
        updated.videoChapter = '';
      }

      // 🔒 Guard rules
      const UNIT_ALLOWED = ['Notes', 'Handwritten Notes'];
      if (updated.unit && !UNIT_ALLOWED.includes(updated.category)) {
        updated.unit = '';
      }

      if (updated.videoChapter && updated.category !== 'Video') {
        updated.videoChapter = '';
      }

      // 🔗 Sync URL
      const params = Object.fromEntries(
        Object.entries(updated).filter(([_, v]) => v)
      );
      setSearchParams(params);

      return updated;
    });
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
    // Reset pagination
    dispatch(resetPagination());
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



  const { allRequests: popularRequests, loading: requestsLoading } = useSelector((state) => state.request);

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

    // console.log('🎯 displayResources check:', {
    //   category,
    //   categoryLower,
    //   isVideoCategory: categoryLower === 'video',
    //   filteredVideos: filteredVideos?.length,
    //   filteredNotes: filteredNotes?.length,
    //   allVideos: videos?.length
    // });

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
    // console.log('✅ Filtering by category:', category, 'found:', result.length);
    return result;
  }, [filteredNotes, filteredVideos, localFilters.category, localFilters]);



  // ✅ Ensure videos are being fetched when component mounts and category changes
  useEffect(() => {
    // console.log('📡 Fetching videos for semester:', localFilters.semester);
    if (localFilters.semester) {
      dispatch(getAllVideoLectures({
        semester: localFilters.semester
      }));
    }
  }, [localFilters.semester, dispatch]);



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
    // Reset pagination for new semester
    // 🔥 CRITICAL
    const params = Object.fromEntries(
      Object.entries(resetFilters).filter(([_, v]) => v)
    );
    setSearchParams(params);
    dispatch(resetPagination());
    dispatch(clearFilters());
  };
  const hasSemester = Boolean(localFilters.semester);
  const isInitialLoading = hasSemester && loading && notes.length === 0;
  const hasData =
    displayResources.length > 0 || filteredNotes.length > 0 || filteredVideos.length > 0;

  const showEmptyState =
    hasSemester &&
    !loading &&
    !videoLoading &&
    !hasData;
  const uploaderMap = useMemo(() => {
    const map = {};
    uniqueUploaders.forEach(u => {
      map[u.id] = u.name;
    });
    return map;
  }, [uniqueUploaders]);


  useEffect(() => {
    dispatch(fetchSavedFilters());
  }, [dispatch]);
  
const [showDefaultPresetToast, setShowDefaultPresetToast] = useState(false);
  const defaultAppliedRef = useRef(false);
  useEffect(() => {
    if (
      defaultAppliedRef.current ||
      localFilters.semester ||          // user already interacted
      !defaultSavedFilter?.filters
    ) {
      return;
    }

    defaultAppliedRef.current = true;

    setLocalFilters(prev => ({
      ...prev,
      ...defaultSavedFilter.filters
    }));

    setSearchParams(
      Object.fromEntries(
        Object.entries(defaultSavedFilter.filters).filter(([_, v]) => v)
      )
    );
    
  // ⭐ Emotional confirmation
  setShowDefaultPresetToast(true);


  }, [defaultSavedFilter]);

const [showSavePresetModal, setShowSavePresetModal] = useState(false);

const [showPresetToast, setShowPresetToast] = useState(false);


const handleSavePreset = async({ name, isDefault }) => {
  const filtersToSave = Object.fromEntries(
    Object.entries(localFilters).filter(([_, v]) => v)
  );
if (!filtersToSave.semester) {
  toast.error("Select a semester before saving a preset");
  return;
}
  dispatch(
    createSavedFilter({
      name,
      filters: filtersToSave,
      isDefault
    })
  );
  // ✅ Mark in analytics
  const sessionId = localStorage.getItem("sessionId");
  if (sessionId) {
    try {
      await axiosInstance.post(
        "/filter-analytics/mark-saved-preset",
        {},
        {
          headers: {
            "x-session-id": sessionId
          }
        }
      );
      // console.log('💾 Filter marked as saved preset');
    } catch (error) {
      console.warn('⚠️ Failed to mark preset (non-critical):', error.message);
    }
  }

    // ❤️ Emotional touch
  setShowPresetToast(true);


  setShowSavePresetModal(false);
};

const handleSetDefaultPreset = (presetId) => {
  dispatch(setDefaultSavedFilter(presetId));
};

const handleDeletePreset = (presetId) => {
  if (!window.confirm("Delete this preset?")) return;
  dispatch(deleteSavedFilter(presetId));
};
useEffect(() => {
  if (showPresetToast && navigator.vibrate) {
    navigator.vibrate(20);
  }
}, [showPresetToast]);
// 🔹 Add this at the top of your component (after state declarations)
const hasTrackedRef = useRef(false);
// ✨ Initialize time tracker
const timeTrackerRef = useRef(null);
const scrollListenerRef = useRef(null);
const engagementUpdateTimerRef = useRef(null);

// ✨ Track device info on mount
useEffect(() => {
  const deviceInfo = getDeviceInfo();
  // console.log('📱 Device detected:', deviceInfo);
  
  // Store in ref for later use
  timeTrackerRef.current = { deviceInfo };
}, []);
// ✨ Initialize time tracker when filters are applied
useEffect(() => {
  if (!localFilters.semester) return;

  // Don't track in preview mode
  const isOnlySemester =
    localFilters.semester &&
    !localFilters.subject &&
    !localFilters.category;

  if (isOnlySemester) return;

  // ✅ Initialize time tracker
  if (!timeTrackerRef.current?.tracker) {
    timeTrackerRef.current = {
      ...timeTrackerRef.current,
      tracker: new TimeTracker()
    };
    // console.log('⏱️ Time tracking started');
  } else {
    // Reset for new filter
    timeTrackerRef.current.tracker.reset();
    // console.log('⏱️ Time tracking reset');
  }

  // ✅ Setup scroll tracking
  const handleScroll = () => {
    const scrollDepth = calculateScrollDepth();
    
    if (timeTrackerRef.current) {
      timeTrackerRef.current.maxScrollDepth = Math.max(
        timeTrackerRef.current.maxScrollDepth || 0,
        scrollDepth
      );
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  scrollListenerRef.current = handleScroll;

  // ✅ Periodic engagement updates (every 10 seconds)
  const updateEngagement = async () => {
    if (!timeTrackerRef.current?.tracker) return;

    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    const timeSpent = timeTrackerRef.current.tracker.getTimeSpent();
    const scrollDepth = timeTrackerRef.current.maxScrollDepth || 0;

    try {
      await axiosInstance.post(
        "/filter-analytics/update-engagement",
        {
          scrollDepth,
          timeOnResults: timeSpent
        },
        {
          headers: {
            "x-session-id": sessionId
          }
        }
      );
      // console.log('📊 Engagement updated:', { scrollDepth, timeSpent });
    } catch (error) {
      console.warn('⚠️ Engagement update failed:', error.message);
    }
  };

  // Update every 10 seconds
  engagementUpdateTimerRef.current = setInterval(updateEngagement, 10000);

  // Cleanup
  return () => {
    window.removeEventListener('scroll', scrollListenerRef.current);
    if (engagementUpdateTimerRef.current) {
      clearInterval(engagementUpdateTimerRef.current);
    }
    
    // Final update before cleanup
    updateEngagement();
  };
}, [
  localFilters.semester,
  localFilters.subject,
  localFilters.category,
  localFilters.unit
]);
// 🔹 Replace your analytics useEffect with this:
useEffect(() => {
  // 🚫 Guard: Must have semester
  if (!localFilters.semester) {
    hasTrackedRef.current = false;
    return;
  }

  // 🚫 Guard: Don't track semester-only (preview mode)
  const isOnlySemester =
    localFilters.semester &&
    !localFilters.subject &&
    !localFilters.category &&
    !localFilters.unit &&
    !localFilters.videoChapter &&
    !localFilters.uploadedBy;

  if (isOnlySemester) {
    hasTrackedRef.current = false;
    return;
  }

  // ✅ Wait for data to load before tracking
  if (loading || videoLoading) {
    // console.log('⏳ Waiting for data to load before tracking...');
    return;
  }

  // ✅ Prevent duplicate tracking
  if (hasTrackedRef.current) {
    // console.log('✋ Already tracked this filter combination');
    hasTrackedRef.current = false; // Reset for next change
  }

  hasTrackedRef.current = true;
const deviceInfo = getDeviceInfo();  // ✅ Get device info
  // 🎯 Track the filter event
  const analyticsPayload = {
    semester: Number(localFilters.semester),
    subject: localFilters.subject || undefined,
    category: localFilters.category || undefined,
    unit: localFilters.unit ? Number(localFilters.unit) : undefined,
    videoChapter: localFilters.videoChapter
      ? Number(localFilters.videoChapter)
      : undefined,
    uploadedBy: localFilters.uploadedBy || undefined,
    resultsCount: total || 0,
    deviceInfo  // ✅ Include device info
  };

  // console.log('📊 Tracking filter analytics:', analyticsPayload);

  dispatch(trackFilterEvent(analyticsPayload))
    // .unwrap()
    // .then(() => console.log('✅ Analytics tracked successfully'))
    // .catch((err) => console.error('❌ Analytics tracking failed:', err));

}, [
  dispatch, // 👈 IMPORTANT: Add dispatch
  localFilters.semester,
  localFilters.subject,
  localFilters.category,
  localFilters.unit,
  localFilters.videoChapter,
  localFilters.uploadedBy,
  total,
  loading,
  videoLoading
]);
// ✨ Track shown suggestions (session storage)
// ✨ Track if ANY suggestion was shown this session (simple boolean)
const SHOWN_SUGGESTION_KEY = 'preset_suggestion_shown';

const hasShownAnySuggestionThisSession = () => {
  try {
    return sessionStorage.getItem(SHOWN_SUGGESTION_KEY) === 'true';
  } catch {
    return false;
  }
};

const markSuggestionAsShown = () => {
  try {
    sessionStorage.setItem(SHOWN_SUGGESTION_KEY, 'true');
    console.log('✅ Marked suggestion as shown for this session');
  } catch (error) {
    console.warn('⚠️ Failed to save suggestion state:', error);
  }
};

const generateFilterKey = (filters) => {
  return `${filters.semester}-${filters.subject || ''}-${filters.category || ''}-${filters.unit || ''}`;
};

// ✨ NEW: Preset Suggestion State
const [showPresetSuggestion, setShowPresetSuggestion] = useState(false);
const [suggestedFilter, setSuggestedFilter] = useState(null);
const hasCheckedSuggestionRef = useRef(false);
const suggestionCheckTimerRef = useRef(null);
// ✅ NEW: Check for preset suggestion after tracking filters
// ✅ FIXED: Check for preset suggestion after tracking filters
// ✅ FIXED: Check for preset suggestion (ONCE PER SESSION)
// ✅ FIXED: Check for preset suggestion (MAX ONCE PER SESSION)
useEffect(() => {
  // Clear any pending timer
  if (suggestionCheckTimerRef.current) {
    clearTimeout(suggestionCheckTimerRef.current);
    suggestionCheckTimerRef.current = null;
  }

  // 🚫 Guard: Must have semester
  if (!localFilters.semester) {
    hasCheckedSuggestionRef.current = false;
    return;
  }

  // 🚫 Guard: Don't check semester-only (preview mode)
  const isOnlySemester =
    localFilters.semester &&
    !localFilters.subject &&
    !localFilters.category &&
    !localFilters.unit;

  if (isOnlySemester) {
    hasCheckedSuggestionRef.current = false;
    // console.log('⏭️ Skipping suggestion check (semester-only mode)');
    return;
  }

  // 🚫 Guard: Don't check if data is loading
  if (loading || videoLoading) {
    return;
  }

  // ✅ NEW: Check if we already showed ANY suggestion this session
  if (hasShownAnySuggestionThisSession()) {
    // console.log('🚫 Already showed a suggestion this session - respecting user flow');
    return;
  }

  // ✅ Prevent duplicate checks for same filter
  if (hasCheckedSuggestionRef.current) {
    // console.log('✋ Already checked suggestion for this filter combo');
    return;
  }

  // Mark as checked
  hasCheckedSuggestionRef.current = true;

  // 🎯 BUILD FILTER PARAMS
  const filterParams = {
    semester: localFilters.semester
  };

  if (localFilters.subject?.trim()) {
    filterParams.subject = localFilters.subject.trim();
  }
  
  if (localFilters.category) {
    filterParams.category = localFilters.category;
  }
  
  if (localFilters.unit) {
    filterParams.unit = localFilters.unit;
  }

  // console.log('🔍 Checking preset suggestion for:', filterParams);

  // Wait 2 seconds before checking (let user see results first)
  suggestionCheckTimerRef.current = setTimeout(() => {
    dispatch(checkPresetSuggestion(filterParams))
      .unwrap()
      .then((response) => {
        // console.log('💡 Preset suggestion response:', response);
        
        if (response.showSuggestion && response.suggestedFilter) {
          // console.log('🎯 SHOWING SUGGESTION MODAL (ONCE PER SESSION)');
          setSuggestedFilter(response.suggestedFilter);
          setShowPresetSuggestion(true);
          
          // ✅ MARK AS SHOWN - Won't show again this session for ANY filter
          markSuggestionAsShown();
          
          // Haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate([10, 50, 10]);
          }
        } else {
          console.log('⏭️ No suggestion needed:', response.reason);
        }
      })
      .catch((err) => {
        console.error('❌ Preset suggestion check failed:', err);
      });
  }, 2000);

  // Cleanup
  return () => {
    if (suggestionCheckTimerRef.current) {
      clearTimeout(suggestionCheckTimerRef.current);
      suggestionCheckTimerRef.current = null;
    }
  };
}, [
  dispatch,
  localFilters.semester,
  localFilters.subject,
  localFilters.category,
  localFilters.unit,
  loading,
  videoLoading
]);



// ✅ Reset check ref when filter changes (allows re-checking new combos)
useEffect(() => {
  hasCheckedSuggestionRef.current = false;
}, [
  localFilters.semester,
  localFilters.subject,
  localFilters.category,
  localFilters.unit
]);

// ✅ NEW: Handle preset suggestion save
// ✅ NEW: Handle preset suggestion save - AUTO SAVE with generated name
// ✅ Import the utility at the top
// ... inside your component ...

// ✅ UPDATED: Handle preset suggestion save with SHORT names
const handleSaveFromSuggestion = async () => {
  setShowPresetSuggestion(false);
  
  // 🎯 Generate smart SHORT preset name (max 60 chars)
  const generatePresetName = () => {
    const parts = [];
    
    // Subject - Use abbreviation/short name
    if (suggestedFilter?.subject) {
      const shortSubject = getSubjectShortName(suggestedFilter.subject);
      parts.push(shortSubject);
    }
    
    // Category - Use short form
    if (suggestedFilter?.category) {
      const categoryShort = {
        'Notes': 'Notes',
        'Handwritten Notes': 'HW Notes',
        'PYQ': 'PYQ',
        'Important Question': 'IQ'
      }[suggestedFilter.category] || suggestedFilter.category;
      
      parts.push(categoryShort);
    }
    
    // Unit
    if (suggestedFilter?.unit) {
      parts.push(`U${suggestedFilter.unit}`);  // "U3" instead of "Unit 3"
    }
    
    // Fallback: if only semester
    if (parts.length === 0) {
      return `Sem ${suggestedFilter?.semester}`;
    }
    
    // Join with separator
    let name = parts.join(' • ');  // Using bullet for cleaner look
    
    // ✅ Safety: Truncate if still too long (shouldn't happen now)
    if (name.length > 60) {
      name = name.substring(0, 57) + '...';
    }
    
    return name;
  };

  const presetName = generatePresetName();
  
  // console.log('💾 Auto-saving preset with name:', presetName, `(${presetName.length} chars)`);

  // Prepare filters to save
  const filtersToSave = {
    semester: suggestedFilter.semester,
    ...(suggestedFilter.subject && { subject: suggestedFilter.subject }),
    ...(suggestedFilter.category && { category: suggestedFilter.category }),
    ...(suggestedFilter.unit && { unit: suggestedFilter.unit })
  };

  // Save the preset
  try {
    await dispatch(
      createSavedFilter({
        name: presetName,
        filters: filtersToSave,
        isDefault: false
      })
    ).unwrap();

    // ✅ Mark in analytics
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      try {
        await axiosInstance.post(
          "/filter-analytics/mark-saved-preset",
          {},
          {
            headers: {
              "x-session-id": sessionId
            }
          }
        );
        console.log('💾 Filter marked as saved preset in analytics');
      } catch (error) {
        console.warn('⚠️ Failed to mark preset (non-critical):', error.message);
      }
    }

    // 🎉 Success feedback with short name
    // toast.success(
    //   <div className="flex items-center gap-2">
    //     <span className="text-yellow-400">⭐</span>
    //     <div>
    //       <p className="font-semibold">Preset saved!</p>
    //       <p className="text-xs text-gray-400 mt-0.5">{presetName}</p>
    //     </div>
    //   </div>,
    //   {
    //     duration: 3000,
    //     position: 'bottom-center'
    //   }
    // );

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([10, 20, 10]);
    }

    // Show preset toast
    setShowPresetToast(true);

  } catch (error) {
    console.error('❌ Failed to save preset:', error);
    
    // ✅ Better error message
    const errorMsg = error?.message?.includes('longer than')
      ? 'Preset name too long. Please try again.'
      : 'Failed to save preset. Please try again.';
    
    toast.error(errorMsg);
  }
};


// ✅ NEW: Handle preset suggestion dismiss
// ✅ Handle preset suggestion dismiss
const handleDismissSuggestion = () => {
  setShowPresetSuggestion(false);
  setSuggestedFilter(null);
  
  // ✅ Mark as shown so we don't suggest again this session
  markSuggestionAsShown();
  
  // console.log('🚫 User dismissed suggestion - won\'t show again this session');
  
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(5);
  }
};


// ✨ Get recommended & trending from Redux
const { recommended, trending, trendingTimeframe } = useSelector((state) => state.filterAnalytics);

// ✨ Fetch hybrid filters when semester changes
useEffect(() => {
  if (localFilters.semester) {
    dispatch(fetchHybridFilters(localFilters.semester))
      // .unwrap()
      // .then((data) => {
      //   console.log('✨ Hybrid filters loaded:', {
      //     recommended: data.recommended?.length || 0,
      //     trending: data.trending?.length || 0
      //   });
      // })
      .catch((err) => {
        console.warn('⚠️ Failed to load hybrid filters:', err);
      });
  }
}, [dispatch, localFilters.semester]);

// ✨ Handler to apply quick filter
// ✨ Handler to apply quick filter
// ✨ Handler to apply quick filter
const handleApplyQuickFilter = (filter) => {
  const newFilters = {
    semester: localFilters.semester,
    subject: filter._id.subject || '',
    category: filter._id.category || '',
    unit: filter._id.unit ? String(filter._id.unit) : '',
    university: 'AKTU',
    course: 'BTECH',
    uploadedBy: '',
    videoChapter: ''
  };

  // Update URL
  const params = Object.fromEntries(
    Object.entries(newFilters).filter(([_, v]) => v)
  );
  setSearchParams(params, { replace: true });

  // Update state
  setLocalFilters(newFilters);

  // Reset pagination
  dispatch(resetPagination());

  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
  
  // ✅ Set a flag to trigger scroll after data loads
  setShouldScrollToResults(true);
};
const attemptScroll = () => {
  scrollAttempts++;
  // ✅ Scroll to parent container instead
  const resultsContainer = document.querySelector('[data-results-container]');
  
  if (resultsContainer) {
    console.log('✅ Scrolling to results container...');
    
    const headerOffset = 100;
    const elementPosition = resultsContainer.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  } else if (scrollAttempts < maxAttempts) {
    console.log(`⏳ Retry scroll (${scrollAttempts}/${maxAttempts})...`);
    setTimeout(attemptScroll, 100);
  } else {
    console.warn('❌ Could not find results container after 5 attempts');
  }
};

// ✅ ADD THIS: State to track if we should scroll
const [shouldScrollToResults, setShouldScrollToResults] = React.useState(false);

// ✅ ADD THIS: useEffect to scroll when data is ready
React.useEffect(() => {
  if (shouldScrollToResults && displayResources && displayResources.length > 0) {
    console.log('✅ Data loaded, scrolling to results...');
    
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
      const resultsSection = document.querySelector('[data-results-section]');
      
      if (resultsSection) {
        const headerOffset = 100;
        const elementPosition = resultsSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        console.log('✅ Scrolled successfully');
        setShouldScrollToResults(false); // Reset flag
      }
    }, 100);
  }
}, [shouldScrollToResults, displayResources]);



// ✅ ADD THIS: Sync state when URL changes (for browser back/forward, direct links, quick filters)
useEffect(() => {
  const urlFilters = getFiltersFromURL();
  
  // Check if URL is different from current state
  const isDifferent = 
    urlFilters.semester !== localFilters.semester ||
    urlFilters.subject !== localFilters.subject ||
    urlFilters.category !== localFilters.category ||
    urlFilters.unit !== localFilters.unit ||
    urlFilters.uploadedBy !== localFilters.uploadedBy ||
    urlFilters.videoChapter !== localFilters.videoChapter;

  if (isDifferent) {
    // console.log('🔄 URL changed, syncing state:', urlFilters);
    setLocalFilters(urlFilters);
  }
}, [searchParams]); // Trigger when URL params change


  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-950 text-white">
        {/* Notes Library Hero – Calm & Academic */}
        {/* Notes Page Hero – Calm, Academic, Complete */}
        <div className="bg-[#0F0F0F] hidden  md:flex border-b border-[#1F1F1F] relative overflow-hidden">
  <div className="max-w-6xl mx-auto px-6 py-2 grid md:grid-cols-2 gap-10 items-center">


    {/* LEFT: CONTENT */}
    <div className="space-y-4">
      <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
        AKTU Study Library
      </span>

      <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
        Study resources, organized
      </h1>

      <p className="text-sm text-[#9CA3AF] max-w-md">
        Semester-wise notes, PYQs, important questions and video lectures —
        structured to help you study without confusion.
      </p>

      <div className="pt-2">
        <button
          onClick={() => {
            const semesterSection = document.querySelector('[data-semester-section]');
            semesterSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="
            inline-flex items-center gap-2
            px-5 py-2
            rounded-full
            bg-[#9CA3AF] text-black
            hover:bg-white
            font-semibold text-sm
            transition-all
          "
        >
          Browse by semester →
        </button>
      </div>
    </div>

    {/* RIGHT: CALM SVG */}
    <div className="hidden  md:flex justify-center opacity-35 pointer-events-none">
      <img
        src="/Studying-bro (1).svg"
        alt=""
        className="w-[300px] "
      />
    </div>

  </div>
</div>
{/* 📱 MOBILE LIBRARY HERO */}
<div className="md:hidden bg-[#0F0F0F] border-b border-[#1F1F1F]">
  <div className="px-5 py-6 space-y-4">

    {/* Context */}
    <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
      AKTU Study Library
    </span>

    {/* Title */}
    <h1 className="text-xl font-bold text-white leading-snug">
      Study resources,<br />organized
    </h1>

    {/* Subtext */}
    <p className="text-sm text-[#9CA3AF] leading-relaxed">
      Notes, PYQs and videos — neatly arranged semester-wise for focused study.
    </p>

    {/* CTA */}
    <button
      onClick={() => {
        const semesterSection = document.querySelector('[data-semester-section]');
        semesterSection?.scrollIntoView({ behavior: 'smooth' });
      }}
      className="
        inline-flex items-center gap-2
        px-5 py-2.5
        rounded-full
        bg-[#9CA3AF] text-black
        hover:bg-white
        font-semibold text-sm
        transition
      "
    >
      Choose semester →
    </button>

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
            trendingTimeframe={trendingTimeframe}  // ✨ NEW: Pass timeframe
            // ✅ NEW: presets data
            savedFilters={savedFilters}
            defaultSavedFilter={defaultSavedFilter}
            handleDeletePreset={handleDeletePreset}
            handleSetDefaultPreset={handleSetDefaultPreset}
            onApplySavedFilter={(preset) => {
              setLocalFilters(prev => ({
                ...prev,
                ...preset.filters
              }));

              setSearchParams(
                Object.fromEntries(
                  Object.entries(preset.filters).filter(([_, v]) => v)
                )
              );

              dispatch(trackPresetUsage(preset._id));
            }}
            // ✨ NEW: Trending & Recommended
          recommended={recommended}
          trending={trending}
          onApplyQuickFilter={handleApplyQuickFilter}
          
            //  onSaveCurrentFilters={onSaveCurrentFilters}   // ✅ ADD THIS
            onOpenSavePresetModal={()=>setShowSavePresetModal(true)}
            isPreferencesSet={isPreferencesSet}
            navigate={navigate}
            dispatch={dispatch}
            openPreferenceDrawer={openPreferenceDrawer}
            ctaText={ctaText}
            notes={notes}        // Add this
            videos={videos}      // Add this
            // ✅ FIXED
            stats={{
              total,
              categories
            }}
          />
          <SaveFilterPresetModal
  isOpen={showSavePresetModal}
  onClose={() => setShowSavePresetModal(false)}
  onSave={handleSavePreset}
/>
{/* ✨ NEW: Preset Suggestion Modal */}
      <PresetSuggestionModal
        isOpen={showPresetSuggestion}
        onClose={handleDismissSuggestion}
        onSave={handleSaveFromSuggestion}
        suggestedFilter={suggestedFilter}
      />

          {/* ✨ UPDATED: Stats Section - Include Video Count */}

          <ActiveFilterPillsRow
            localFilters={localFilters}
            handleFilterChange={handleFilterChange}
            uploaderMap={uploaderMap}
          />



          {/* Loading State */}
          {/* Loading State */}
          {isInitialLoading && (
            <div className="space-y-6 py-8">

              {/* Header Skeleton */}
              {/* <div className="space-y-3">
                <div className="h-8 rounded-lg w-3/4 bg-[#2A2A2A] animate-pulse" />
                <div className="h-4 rounded-lg w-1/2 bg-[#1F1F1F] animate-pulse" />
              </div> */}

              {/* Search Bar Skeleton */}
              {/* <div className="h-12 rounded-xl bg-[#1F1F1F] animate-pulse" /> */}

              {/* Filter Buttons Skeleton */}
              {/* <div className="flex gap-3 flex-wrap">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-24 rounded-full bg-[#1F1F1F] border border-[#2A2A2A]"
                  />
                ))}
              </div> */}

              {/* Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 space-y-4 bg-[#0F0F0F] border border-[#1F1F1F]"
                  >
                    {/* Thumbnail */}
                    <div className="h-40 rounded-lg bg-[#2A2A2A] animate-pulse" />

                    {/* Title */}
                    <div className="h-4 rounded-lg w-5/6 bg-[#2A2A2A] animate-pulse" />

                    {/* Subtitle */}
                    <div className="h-3 rounded-lg w-4/6 bg-[#1F1F1F] animate-pulse" />

                    {/* Button */}
                    <div className="pt-2">
                      <div className="h-10 rounded-lg bg-[#1F1F1F] animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}



          {/* Enhanced Empty State with Popular Requests */}
          {showEmptyState && (
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
          {!hasSemester && (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
              <div className="max-w-2xl w-full text-center space-y-8">
                {/* Animated Icon - Enhanced */}
                <div className="relative w-32 h-32 mx-auto mb-8">
                  {/* Rotating Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 animate-spin" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-purple-500 border-r-pink-500 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>

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

          {/* ✅ RESULTS SECTION WRAPPER */}
{displayResources && displayResources.length > 0 && (
  <section 
    data-results-section
    className="max-w-7xl mx-auto px-4 py-8"
  >
    {/* Optional: Add a header */}
    {/* <div className="mb-6">
      <h2 className="text-xl font-semibold text-white mb-2">
        {localFilters.category ? `${localFilters.category}` : 'All Resources'}
        {localFilters.subject && ` - ${getSubjectShortName(localFilters.subject)}`}
      </h2>
      <p className="text-sm text-[#9CA3AF]">
        Found {displayResources.length} resource{displayResources.length !== 1 ? 's' : ''}
      </p>
    </div> */}

    {/* Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {displayResources.map((resource) => {
        const isVideo = resource?.videoId || resource?.embedUrl || resource?.platform === 'YOUTUBE';

        return (
          <TrackedNoteCard
            key={resource._id}
            item={resource}
            type={isVideo ? 'video' : 'note'}
            note={resource}
          />
        );
      })}
    </div>
  </section>
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

          {/* ✨ NEW: BOTTOM LOADER (Infinite Scroll Trigger) */}
          {/* {pagination.hasMore && displayResources?.length > 0 && (
                <div
                    ref={bottomLoaderRef}
                    className="flex justify-center py-8 mb-16"
                >
                    {pagination.isLoadingMore ? (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <span className="text-[#9CA3AF] text-sm ml-2">Loading more notes...</span>
                        </div>
                    ) : (
                        <div className="text-[#9CA3AF] text-sm">Scroll for more</div>
                    )}
                </div>
            )} */}

          {/* ================= BOTTOM LOADER ================= */}
          {pagination.hasMore && (
            <BottomLoader
              isLoading={pagination.isLoadingMore}
              hasMore={pagination.hasMore}
            />
          )}

          {/* ================= OBSERVER TARGET (LAST ELEMENT) ================= */}
          <div ref={bottomRef} className="h-1" />

          {/* ================= END MESSAGE ================= */}
          {!pagination.hasMore && !pagination.isLoadingMore && (
            <div className="text-center py-8 space-y-2">
              <p className="text-slate-400 text-sm">
                You’ve reached the end
              </p>

              <p className="text-xs text-slate-500">
                Try changing your subject, material type, or unit to explore more content.
              </p>

              {(localFilters.subject || localFilters.category || localFilters.unit || localFilters.videoChapter) && (
                <button
                  onClick={handleClearFilters}
                  className="
          mt-3
          inline-flex items-center gap-2
          px-4 py-2
          text-xs font-semibold
          rounded-full
          bg-[#1F1F1F]
          border border-[#2F2F2F]
          text-[#9CA3AF]
          hover:text-white
          hover:border-[#9CA3AF]/40
          transition-all
        "
                >
                  <RefreshCcw className="w-4 h-4" />
                  Reset filters
                </button>
              )}
            </div>
          )}


          {/* Empty State - ADD THIS */}
          {!loading && !videoLoading && (!displayResources || displayResources.length === 0) && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">
                {localFilters.category === 'Video'
                  ? 'No videos found for this semester'
                  : ''}
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
        <EmotionalToast
  show={showPresetToast}
  onClose={() => setShowPresetToast(false)}
/>
<DefaultPresetToast
  show={showDefaultPresetToast}
  onClose={() => setShowDefaultPresetToast(false)}
/>


        {/* Planner Drawer (must be mounted) */}
        <StudyPreferenceDrawer isFirstTime={false} />
      </div>
    </PageTransition>
  );
}
