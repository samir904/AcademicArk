// src/PAGES/Search/AdvancedSearch.jsx (COMPLETE REDESIGN)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchNotes, getTrendingNotes, getPopularNotes, clearSearch, setFilters, setSearchQuery } from '../../REDUX/Slices/searchSlice';
import CardRenderer from '../Note/CardRenderer';
import PageTransition from '../../COMPONENTS/PageTransition';
import { Check, Library } from 'lucide-react';

// Icons
const SearchIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const TrendingIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const ClockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
import {
  BookOpen,
  PenTool,
  AlertCircle,
  FileQuestion,
  PlayCircle
} from "lucide-react";
import { SearchSkeleton } from '../../COMPONENTS/Skeletons';


// Search Intent Hints
const SEARCH_HINTS = [
    { id: 'pyq', icon: '📝', label: 'Unit-wise PYQs', color: 'blue' },
    { id: 'notes', icon: '📘', label: 'Short Notes', color: 'purple' },
    { id: 'videos', icon: '🎥', label: 'Video Lectures', color: 'pink' },
    { id: 'important', icon: '✍️', label: 'Important Questions', color: 'orange' },
    { id: 'numericals', icon: '🧠', label: 'Numericals', color: 'green' }
];

// Popular searches to teach intent
const POPULAR_SEARCHES = [
    'DBMS Unit 3 PYQ',
    'OS deadlock numericals',
    'COA pipeline questions',
    'Maths Laplace PYQ',
    'DAA greedy algorithm',
    'Data Structures sorting',
    'CN TCP/IP protocols',
    'Compiler design parser'
];

export default function AdvancedSearch() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const [searchParams, setSearchParams] = useSearchParams();
    const searchInputRef = useRef(null);

    const {
        loading,
        searchResults,
        pagination,
        query: searchQuery
    } = useSelector(state => state.search);

    // const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
 

    const [activeHint, setActiveHint] = useState(null);
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('recentSearches');
        return saved ? JSON.parse(saved) : [];
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Auto-focus search on mount
    useEffect(() => {
        searchInputRef.current?.focus();
    }, []);

    // Handle search input change (instant results)
    // const handleSearchChange = useCallback((e) => {
    //     const query = e.target.value;
    //     setSearchQuery(query);

    //     if (query.trim()) {
    //         // Apply hint filter if one is selected
    //         const filters = {
    //             query: query
    //         };

    //         if (activeHint === 'pyq') filters.category = 'PYQ';
    //         if (activeHint === 'notes') filters.category = 'Notes';
    //         if (activeHint === 'videos') filters.category = 'Video';
    //         if (activeHint === 'important') filters.category = 'Important Question';
    //         if (activeHint === 'numericals') filters.searchKeyword = 'numericals';

    //         setSearchParams(filters);
    //         dispatch(setFilters(filters));
    //         dispatch(searchNotes(filters));
    //     } else {
    //         // Clear results if query is empty
    //         dispatch(clearSearch());
    //     }
    // }, [activeHint, searchParams, setSearchParams, dispatch]);

    // Handle hint click
    // const handleHintClick = (hintId) => {
    //     setActiveHint(activeHint === hintId ? null : hintId);
    //     // Re-search with new hint
    //     if (searchQuery.trim()) {
    //         handleSearchChange({ target: { value: searchQuery } });
    //     }
    // };

    // Handle popular search click
    // const handlePopularSearchClick = (search) => {
    //     setSearchQuery(search);
    //     const filters = { query: search };
    //     setSearchParams(filters);
    //     dispatch(setFilters(filters));
    //     dispatch(searchNotes(filters));
    //     addToRecentSearches(search);
    // };

    // Handle recent search click
    // const handleRecentSearchClick = (search) => {
    //     setSearchQuery(search);
    //     const filters = { query: search };
    //     setSearchParams(filters);
    //     dispatch(setFilters(filters));
    //     dispatch(searchNotes(filters));
    // };

    // Clear recent search
    const clearRecentSearch = (search) => {
        const updated = recentSearches.filter(s => s !== search);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // Add to recent searches
    const addToRecentSearches = (search) => {
        const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // Show success toast
    const showSuccessToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Handle card click
    const handleResultClick = () => {
        addToRecentSearches(searchQuery);
        showSuccessToast('Found fast ⚡ Less searching, more studying.');
    };
    const handleViewAll = (category) => {
  const params = new URLSearchParams(searchParams);

  params.set("category", category);
  params.set("page", "1");

  navigate(`/search?${params.toString()}`);
};
const [searchParams] = useSearchParams();
const queryFromURL = searchParams.get("query") || "";
useEffect(() => {
  if (!queryFromURL.trim()) {
    dispatch(clearSearch());
    setHasSubmitted(false); // 🔥 reset
    return;
  }

  const filters = {
    query: queryFromURL,
    ...Object.fromEntries(searchParams.entries())
  };

  dispatch(setSearchQuery(queryFromURL));
  dispatch(setFilters(filters));
  dispatch(searchNotes(filters));
  setHasSubmitted(true); // 🔥 THIS IS THE KEY
}, [queryFromURL, searchParams, dispatch]);
const query = queryFromURL.toLowerCase();

const isNotesIntent = query.includes("notes");
const isHandwrittenIntent = query.includes("handwritten");
const isPYQIntent = query.includes("pyq");
const isVideoIntent = query.includes("video");

const isBroadSearch =
  !isNotesIntent &&
  !isHandwrittenIntent &&
  !isPYQIntent &&
  !isVideoIntent;

const [expandedCategories, setExpandedCategories] = useState({});
const isExpanded = (category) => expandedCategories[category];
const handleExpandCategory = (category) => {
  setExpandedCategories(prev => ({
    ...prev,
    [category]: true
  }));
};
const CATEGORY_ICON_MAP = {
  "Notes": BookOpen,
  "Handwritten Notes": PenTool,
  "Important Question": AlertCircle,
  "PYQ": FileQuestion,
  "Video": PlayCircle
};

const getCategoryItems = (category) =>
  searchResults.filter(n => n.category === category);
const isNotesDominant =
  isNotesIntent && !isHandwrittenIntent;
const getVisibleItems = (category) => {
  const items = getCategoryItems(category);

  // 🔥 Handwritten-only intent
  if (isHandwrittenIntent && !isNotesIntent) {
    return category === "Handwritten Notes" ? items : [];
  }

  // 🔥 Notes-dominant intent → show BOTH fully
  if (isNotesDominant) {
    if (category === "Notes" || category === "Handwritten Notes") {
      return items; // ❗ FULL, NO SLICE
    }
    return [];
  }

  // 🔥 Other single-category intents
  if (
    (category === "PYQ" && isPYQIntent) ||
    (category === "Video" && isVideoIntent)
  ) {
    return items;
  }

  // 🔥 Broad search → slice unless expanded
  if (!isExpanded(category)) {
    return items.slice(0, 6);
  }

  return items;
};

const renderCategory = (category, title, emoji) => {
  const items = getVisibleItems(category);
  const total = getCategoryItems(category).length;
const Icon = CATEGORY_ICON_MAP[category];

  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      {/* CATEGORY HEADER */}
      <div className="flex items-center gap-3 mb-5">
        
        {/* Icon */}
        <div className="w-9 h-9 rounded-lg bg-[#1F1F1F] border border-[#2F2F2F] flex items-center justify-center">
          <Icon size={18} className="text-[#9CA3AF]" />
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base md:text-lg font-semibold text-white leading-tight">
            {title}
          </h3>
          <p className="text-xs text-gray-500">
            {total} resources
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Optional badge (future-ready) */}
        {/* <span className="text-xs px-2 py-0.5 rounded-full bg-[#1F1F1F] border border-[#2F2F2F] text-gray-400">
          Category
        </span> */}
      </div>


      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(note => (
          <div key={note._id} onClick={handleResultClick}>
            <CardRenderer note={note} />
          </div>
        ))}
      </div>

      {/* View All (ONLY for broad search) */}
      {isBroadSearch && total > 6 && !isExpanded(category) && (
        <button
          onClick={() => handleExpandCategory(category)}
          className="mt-4 text-[#9CA3AF] hover:text-white text-sm font-medium transition-colors"
        >
          View all {title.toLowerCase()} →
        </button>
      )}
    </div>
  );
};

const MIN_QUERY_LENGTH = 2;

const isValidQuery =
  searchQuery &&
  searchQuery.trim().length >= MIN_QUERY_LENGTH;

    return (
        <PageTransition>
            <div className="min-h-screen bg-neutral-950">


                {/* MAIN CONTENT */}
                <div className="max-w-6xl mx-auto px-4 py-8">

                    {/* RECENT SEARCHES - Only show if no active search */}
                    {/* {!searchQuery && recentSearches.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center gap-2 mb-4">
                                <ClockIcon className="w-5 h-5 text-[#9CA3AF]" />
                                <h2 className="text-lg font-semibold text-white">Recent exam searches</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {recentSearches.map((search, index) => (
                                    <div
                                        key={index}
                                        className="bg-[#1F1F1F] border border-[#2F2F2F] rounded-lg p-3 flex items-center justify-between hover:border-[#9CA3AF]/30 transition-all group"
                                    >
                                        <button
                                            onClick={() => handleRecentSearchClick(search)}
                                            className="flex-1 text-left text-gray-300 text-sm hover:text-white transition-colors truncate"
                                        >
                                            {search}
                                        </button>
                                        <button
                                            onClick={() => clearRecentSearch(search)}
                                            className="ml-2 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove"
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* POPULAR SEARCHES - Show when no query and no recent */}
                    {/* {!searchQuery && recentSearches.length === 0 && (
                        <div className="mb-12">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingIcon className="w-5 h-5 text-[#9CA3AF]" />
                                <h2 className="text-lg font-semibold text-white">Popular exam searches</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {POPULAR_SEARCHES.map((search, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePopularSearchClick(search)}
                                        className="bg-[#1F1F1F] border border-[#2F2F2F] rounded-lg p-3 text-left text-gray-300 text-sm hover:border-[#9CA3AF]/50 hover:bg-[#1F1F1F]/80 transition-all group"
                                    >
                                        <SearchIcon className="w-4 h-4 text-[#9CA3AF] mb-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {search}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* LOADING STATE */}
                    {loading && searchQuery && (
                        <SearchSkeleton/>
                    )}


                    {/* SEARCH RESULTS - Grouped by type */}
                   {/* SEARCH RESULTS - Grouped by type */}
{!loading && searchQuery && searchResults.length > 0 && (
  <div>
   {/* RESULTS HEADER */}
<div className="mb-10 flex flex-col gap-3">

  {/* Top line */}
  <div className="flex items-center gap-3 flex-wrap">
    <h2 className="text-xl md:text-2xl font-semibold text-white">
      {searchResults.length} results
    </h2>

    <span className="text-xs px-2 py-0.5 rounded-full bg-[#1F1F1F] border border-[#2F2F2F] text-gray-400">
      Search
    </span>
  </div>

  {/* Query context */}
  <p className="text-sm text-gray-400">
    Results for{" "}
    <span className="text-[#9CA3AF] font-medium">
      “{searchQuery}”
    </span>
  </p>

  {/* Subtle divider */}
  <div className="h-px bg-gradient-to-r from-[#2F2F2F] via-[#2F2F2F]/40 to-transparent mt-2" />
</div>


    {renderCategory("Notes", "Notes")}
{renderCategory("Handwritten Notes", "Handwritten Notes")}
{renderCategory("Important Question", "Important Questions")}
{renderCategory("PYQ", "Previous Year Questions")}
{renderCategory("Video", "Video Lectures")}

  </div>
)}

          {/* EMPTY RESULTS STATE */}
{!loading && hasSubmitted && searchResults.length === 0 && (
  <div className="text-center py-20 max-w-xl mx-auto">

    {/* Icon */}
    <SearchIcon className="w-14 h-14 text-gray-500 mx-auto mb-4 opacity-60" />

    {/* Title */}
    <h3 className="text-xl font-semibold text-white mb-2">
      No exact results found
    </h3>

    {/* Subtext */}
    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
      That doesn’t mean the notes don’t exist.
      Try adjusting how the search is written.
    </p>

    {/* How to search */}
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-left text-sm text-gray-300 mb-6">
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
        Try formats like
      </p>
      <ul className="space-y-1">
        <li>• <span className="text-white">DBMS Unit 3 PYQ</span></li>
        <li>• <span className="text-white">Data Structure notes</span></li>
        <li>• <span className="text-white">OS deadlock handwritten</span></li>
        <li>• <span className="text-white">DAA greedy algorithm</span></li>
      </ul>
    </div>

    {/* Quick retry chips */}
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {["DS notes", "DBMS PYQ", "Handwritten notes", "OS Unit 2"].map(
        (suggestion) => (
          <button
            key={suggestion}
            onClick={() =>
              navigate(`/search?query=${encodeURIComponent(suggestion)}`)
            }
            className="
              px-3 py-1.5
              rounded-full
              text-xs
              bg-[#1F1F1F]
              border border-[#2F2F2F]
              text-gray-300
              hover:text-white
              hover:border-[#9CA3AF]/40
              transition
            "
          >
            {suggestion}
          </button>
        )
      )}
    </div>

    {/* Divider */}
    <div className="border-t border-[#2A2A2A] my-8" />

    {/* Library Fallback (Secondary Action) */}
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 text-left">
      <div className="flex items-center gap-2 mb-2">
        <Library className="w-4 h-4 text-gray-400" />
        <h4 className="text-sm font-semibold text-white">
          Browse via Library
        </h4>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed mb-4">
        Some notes may exist but didn’t match this exact search.
        Use filters like <span className="text-white">Subject, Unit, and Type</span>.
      </p>

      <div className="flex justify-center">
        <button
          onClick={() => navigate("/notes")}
          className="
            inline-flex items-center gap-2
            px-5 py-2
            text-sm font-medium
            rounded-full
            bg-[#1F1F1F]
            border border-[#2F2F2F]
            text-gray-200
            hover:text-white
            hover:border-[#9CA3AF]/40
            transition
          "
        >
          Open Library
          <span className="text-xs opacity-70">→</span>
        </button>
      </div>
    </div>
  </div>
)}

{!loading && searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
  <p className="text-center text-xs text-gray-500 mt-12">
    Keep typing… try subject + type (e.g. <span className="text-gray-300">DS notes</span>)
  </p>
)}


                </div>

                {/* SUCCESS TOAST */}
                {showToast && (
                    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 bg-[#22C55E] text-black px-4 py-3 rounded-lg font-medium text-sm animate-bounce">
                        {toastMessage}
                    </div>
                )}
            </div>
        </PageTransition>
    );
}
