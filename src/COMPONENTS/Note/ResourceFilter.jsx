import React, { useState, useMemo, useEffect } from 'react';
import { Filter, X, Check ,CalendarCog} from 'lucide-react';
import { getSubjectShortName } from '../../UTILS/subjectShortName';

/**
 * FIXED: Stats Section with Subject-Based Video Filtering
 * 
 * KEY FIXES:
 * 1. Videos filtered by BOTH semester AND subject ✓
 * 2. Category stats only count relevant items ✓
 * 3. Video count shows 0 if no subject selected ✓
 * 4. Enhanced UI with better visual hierarchy ✓
 */

export default function ResourceFilter({
    localFilters,
    handleFilterChange,
    handleClearFilters,
    handleSemesterChange, // ✨ ADD THIS
    subjectsBySemester,
    uniqueChapters,
    uniqueUploaders,
    isPreferencesSet,
    navigate,
    dispatch,
    openPreferenceDrawer,
    notes = [],
    videos = [],
    stats
}) {
    const hasActiveFilters = localFilters.subject || localFilters.category || localFilters.uploadedBy;

    const ctaText = localFilters.subject
        ? `Study ${localFilters.subject} properly →`
        : isPreferencesSet
            ? "Continue my study plan →"
            : "Study in order →";

    // ✨ FIXED: Calculate category stats with proper subject filtering
    // const getCategoryStats = useMemo(() => {
    //     const stats = {};

    //     // Count notes by category (filtered by subject if selected)
    //     notes?.forEach(note => {
    //         // Only count if subject matches (if subject is selected)
    //         if (localFilters.subject && note.subject?.toLowerCase() !== localFilters.subject?.toLowerCase()) {
    //             return;
    //         }
    //         stats[note.category] = (stats[note.category] || 0) + 1;
    //     });

    //     // ✨ FIX: Count videos by category (filtered by subject if selected)
    //     if (videos && videos.length > 0) {
    //         const videoCount = videos.filter(video => {
    //             // Only count if subject matches (if subject is selected)
    //             if (localFilters.subject && video.subject?.toLowerCase() !== localFilters.subject?.toLowerCase()) {
    //                 return false;
    //             }
    //             return true;
    //         }).length;

    //         if (videoCount > 0) {
    //             stats['Video'] = videoCount;
    //         }
    //     }

    //     return stats;
    // }, [notes, videos, localFilters.subject]);

    // const categoryStats = getCategoryStats;

    // ✨ Calculate total resources (notes + videos for selected subject)
    // const totalResources = useMemo(() => {
    //     let total = 0;

    //     // Count notes
    //     notes?.forEach(note => {
    //         if (localFilters.subject && note.subject?.toLowerCase() !== localFilters.subject?.toLowerCase()) {
    //             return;
    //         }
    //         total += 1;
    //     });

    //     // Count videos
    //     videos?.forEach(video => {
    //         if (localFilters.subject && video.subject?.toLowerCase() !== localFilters.subject?.toLowerCase()) {
    //             return;
    //         }
    //         total += 1;
    //     });

    //     return total;
    // }, [notes, videos, localFilters.subject]);

    // Get unique chapters from videos (filtered by subject)
   // 🎬 Video chapters (derived from videos list, NOT stats)
const uniqueChaptersForSubject = useMemo(() => {
  if (!videos || videos.length === 0) return [];

  const chapters = new Set();

  videos.forEach(video => {
    // Semester guard
    if (video.semester !== Number(localFilters.semester)) return;

    // Subject guard (if selected)
    if (
      localFilters.subject &&
      video.subject?.toLowerCase() !== localFilters.subject.toLowerCase()
    ) {
      return;
    }

    if (video.chapterNumber != null) {
      chapters.add(video.chapterNumber);
    }
  });

  return Array.from(chapters).sort((a, b) => a - b);
}, [videos, localFilters.semester, localFilters.subject]);

const categoryStats = stats?.categories || {};
const totalResources = stats?.total || 0;
const CATEGORY_ORDER = [
  "Notes",
  "Handwritten Notes",
  "PYQ",
  "Important Question",
  "Video"
];
const sortedCategories = CATEGORY_ORDER
  .filter(cat => categoryStats?.[cat] > 0)
  .map(cat => [cat, categoryStats[cat]]);


    // ✨ UPDATED getCategoryConfig with icons instead of emojis
    const getCategoryConfig = (category) => {
        const configs = {
            'Notes': {
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={2} stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notebook-icon lucide-notebook"><path d="M2 6h4" /><path d="M2 10h4" /><path d="M2 14h4" /><path d="M2 18h4" /><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M16 2v20" /></svg>
                ),

                iconBg: 'bg-blue-500/20',
                borderColor: 'border-blue-500/30',
                textColor: 'text-blue-400'
            },
            'Important Question': {
                icon: (
                    <svg className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                ),
                iconBg: 'bg-amber-500/20',
                borderColor: 'border-amber-500/30',
                textColor: 'text-amber-400'
            },
            'PYQ': {
                icon: (
                    <svg className="w-5 h-5 text-[#EF4444]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6z" />
                    </svg>
                ),
                iconBg: 'bg-red-500/20',
                borderColor: 'border-red-500/30',
                textColor: 'text-red-400'
            },
            'Handwritten Notes': {
                icon: (
                    <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                        <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                ),
                iconBg: 'bg-green-500/20',
                borderColor: 'border-green-500/30',
                textColor: 'text-green-400'
            },
            'Video': {
                icon: (
                    <svg className="w-5 h-5 text-[#A855F7]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                ),
                iconBg: 'bg-purple-500/20',
                borderColor: 'border-purple-500/30',
                textColor: 'text-purple-400'
            }
        };
        return configs[category] || configs['Notes'];
    };
    return (
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl p-6 mb-8 space-y-6">
            {/* HEADER SECTION */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1F1F1F] rounded-lg flex items-center justify-center">
                        <Filter className="w-5 h-5 text-[#9CA3AF]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Filter Resources</h2>
                        <p className="text-xs text-[#4B5563] mt-1">Find exactly what you need</p>
                    </div>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-[#1F1F1F] text-[#9CA3AF] hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-all duration-200"
                        title="Clear all filters"
                    >
                        <X className="w-3 h-3" />
                        Clear All
                    </button>
                )}
            </div>

            {/* SEMESTER SELECTION - DESKTOP */}
            <div className="hidden md:block space-y-4">
                <div className="bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#1F1F1F] rounded-lg flex items-center justify-center text-xl">🎓</div>
                        <div>
                            <h3 className="text-base font-semibold text-white">Step 1: Choose Your Semester</h3>
                            <p className="text-xs text-[#4B5563] mt-1">Start by selecting your current semester</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <button
                                key={sem}
                                onClick={() => {
                                    handleSemesterChange(sem); // ✨ Use new function
                                }}
                                className={`relative py-3 px-2 rounded-lg border font-semibold text-sm transition-all duration-200 flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#9CA3AF]/50
                  ${localFilters.semester === sem
                                        ? 'bg-[#9CA3AF] text-black border-[#9CA3AF] shadow-sm'
                                        : 'bg-[#1F1F1F] text-[#9CA3AF] border-[#2F2F2F] hover:border-[#9CA3AF]/50'
                                    }
                `}
                                title={`Select Semester ${sem}`}
                            >
                                <span className="text-lg font-extrabold">{sem}</span>
                                <span className="text-[10px] opacity-70">Sem</span>

                                {localFilters.semester === sem && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center border-2 border-[#0F0F0F] shadow-lg">
                                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* SEMESTER SELECTION - MOBILE */}
            <div className="md:hidden bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-white mb-3">Step 1: Choose Your Semester</h3>
                <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <button
                            key={sem}
                            onClick={() => {
                                handleSemesterChange(sem); // ✨ Use new function
                            }}
                            className={`relative py-2 px-1.5 rounded-lg border font-semibold text-xs transition-all duration-200 flex flex-col items-center gap-0.5 focus:outline-none focus:ring-1 focus:ring-[#9CA3AF]/50
                ${localFilters.semester === sem
                                    ? 'bg-[#9CA3AF] text-black border-[#9CA3AF]'
                                    : 'bg-[#1F1F1F] text-[#9CA3AF] border-[#2F2F2F]'
                                }
              `}
                        >
                            <span className="font-extrabold">{sem}</span>
                            {localFilters.semester === sem && (
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#22C55E] rounded-full flex items-center justify-center border-1.5 border-[#0F0F0F] shadow-md">
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {localFilters.semester && <div className="h-px bg-[#1F1F1F]" />}

{/* SUBJECT SELECTION - CHIPS (NEW) */}
{localFilters.semester &&
  subjectsBySemester[localFilters.semester]?.length > 0 && (
    <div className=" bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex  items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1F1F1F] rounded-lg flex items-center justify-center">
            📘
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Step 2: Choose Subject
            </h3>
            <p className="text-xs text-[#4B5563]">
              Select one subject to focus your study
            </p>
          </div>
        </div>

        {/* Clear subject */}
        {localFilters.subject && (
          <button
            onClick={() => handleFilterChange('subject', '')}
            className="text-xs text-[#9CA3AF] hover:text-white transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Subject Chips */}
      <div className="flex flex-wrap gap-2">
        {subjectsBySemester[localFilters.semester].map((subject) => {
          const isActive = localFilters.subject === subject;

          return (
            <button
              key={subject}
              onClick={() => handleFilterChange('subject', subject)}
              className={`
                px-3 py-2
                rounded-full
                border
                text-xs font-semibold
                transition-all duration-200
                flex items-center gap-2 
                capitalize
                ${
                  isActive
                    ? 'bg-[#9CA3AF] text-black border-[#9CA3AF] shadow-sm'
                    : 'bg-[#1F1F1F] text-[#9CA3AF] border-[#2F2F2F] hover:border-[#9CA3AF]/40'
                }
              `}
              title={`Study ${subject}`}
            >
              {getSubjectShortName(subject)}

              {isActive && (
                <span className="ml-1 w-4 h-4 bg-[#22C55E] rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
)}

    {localFilters.semester && <div className="h-px bg-[#1F1F1F]" />}
            {/* // ✨ ENHANCED STATS SECTION - Matches filter UI with icons instead of emojis
// Color palette: #0F0F0F (bg), #1F1F1F (surface), #9CA3AF (accent), #4B5563 (muted) */}

             {/* CATEGORY SELECTION - GRID CHIPS (PRIMARY FILTER, NON-COLLAPSIBLE) */}
{localFilters.semester && Object.entries(categoryStats).length > 0 && (
  <div className="space-y-2 bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4 ">
    <div className=" space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1F1F1F] rounded-lg flex items-center justify-center text-sm">
            🧩
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Step 3: Choose Material Type
            </h3>
            <p className="text-xs text-[#4B5563]">
              Notes, PYQs, videos or handwritten content
            </p>
          </div>
        </div>

        {localFilters.category && (
          <button
            onClick={() => {
              handleFilterChange('category', '');
              handleFilterChange('videoChapter', '');
            }}
            className="text-xs text-[#9CA3AF] hover:text-white transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1.5">
        {sortedCategories.map(([category, count]) => {
    const config = getCategoryConfig(category);
    const isActive = localFilters.category === category;

          return (
            <button
              key={category}
              onClick={() => {
                handleFilterChange('category', category);
                handleFilterChange('videoChapter', '');
              }}
              className={`
                relative
                px-3 py-2
                min-w-0 
                rounded-full
                text-xs font-semibold
                transition-all duration-200
                transform hover:scale-[1.03]
                border
                flex items-center gap-2
                justify-center
                whitespace-nowrap
                 ${
                  isActive
                    ? 'bg-[#9CA3AF] text-black border-[#9CA3AF] shadow-sm'
                    : 'bg-[#1F1F1F] text-[#9CA3AF] border-[#2F2F2F] hover:border-[#9CA3AF]/40'
                }
              `}
              title={`Filter by ${category}`}
            >
              {/* Icon */}
              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${config.iconBg}`}>
                {config.icon}
              </div>

              {/* Label */}
              <span className={`text-xs truncate font-semibold ${isActive ? 'text-black' : 'text-[#9CA3AF]'}`}>
                {category}
              </span>

              {/* Count */}
              <span className={`text-xs font-bold ${isActive ? 'text-black' : 'text-[#4B5563]'}`}>
                ({count})
              </span>

             {/* Clear Button */}
                                                {isActive && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleFilterChange('category', '');
                                                            handleFilterChange('videoChapter', '');
                                                        }}
                                                        className="
                        absolute -top-1 -right-1
                        w-4 h-4
                        bg-[#615FFF]
                        
                        rounded-full
                        flex items-center justify-center
                        transition-all duration-200
                        shadow-md
                    "
                                                        title="Clear filter"
                                                    >
                                                        <X className="w-2.5 h-2.5 text-[#0F0F0F]" strokeWidth={3} />
                                                    </button>
                                                )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
)}


            {localFilters.semester && <div className="h-px bg-[#1F1F1F]" />}
{/* UNIT SELECTION - CHIPS (Notes & Handwritten Only) */}
{['Notes', 'Handwritten Notes'].includes(localFilters.category) && (
  <div className="animate-in fade-in duration-200">
    <div className="bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4 space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1F1F1F] rounded-lg flex items-center justify-center">
            📚
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Step 4: Choose Unit
            </h3>
            <p className="text-xs text-[#4B5563]">
              Filter notes by unit
            </p>
          </div>
        </div>

        {/* Clear Unit */}
        {localFilters.unit && (
          <button
            onClick={() => handleFilterChange('unit', '')}
            className="text-xs text-[#9CA3AF] hover:text-white transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Unit Chips */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((unit) => {
          const isActive = Number(localFilters.unit) === unit;

          return (
            <button
              key={unit}
              onClick={() => handleFilterChange('unit', unit)}
              className={`
                px-3 py-2
                rounded-full
                border
                text-xs font-semibold
                transition-all duration-200
                flex items-center gap-2
                ${
                  isActive
                    ? 'bg-[#9CA3AF] text-black border-[#9CA3AF] shadow-sm'
                    : 'bg-[#1F1F1F] text-[#9CA3AF] border-[#2F2F2F] hover:border-[#9CA3AF]/40'
                }
              `}
              title={`Unit ${unit}`}
            >
              Unit {unit}

              {/* Active Check */}
              {isActive && (
                <span className="ml-1 w-4 h-4 bg-[#22C55E] rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
)}

 {/* {localFilters.semester && <div className="h-px bg-[#1F1F1F]" />} */}
{/* VIDEO CHAPTER SELECTION - CHIPS */}
{localFilters.category === 'Video' && uniqueChaptersForSubject.length > 0 && (
  <div className="animate-in fade-in duration-200">
    <div className="bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4 space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1F1F1F] rounded-lg flex items-center justify-center">
            🎬
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Step 4: Choose Chapter
            </h3>
            <p className="text-xs text-[#4B5563]">
              Filter videos by chapter
            </p>
          </div>
        </div>

        {/* Clear Chapter */}
        {localFilters.videoChapter && (
          <button
            onClick={() => handleFilterChange('videoChapter', '')}
            className="text-xs text-[#9CA3AF] hover:text-white transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Chapter Chips */}
      <div className="flex flex-wrap gap-2">
        {uniqueChaptersForSubject.map((chapter) => {
          const isActive = String(localFilters.videoChapter) === String(chapter);

          return (
            <button
              key={chapter}
              onClick={() => handleFilterChange('videoChapter', chapter)}
              className={`
                px-3 py-2
                rounded-full
                border
                text-xs font-semibold
                transition-all duration-200
                flex items-center gap-2
                ${
                  isActive
                    ? 'bg-[#9CA3AF] text-black border-[#9CA3AF] shadow-sm'
                    : 'bg-[#1F1F1F] text-[#9CA3AF] border-[#2F2F2F] hover:border-[#9CA3AF]/40'
                }
              `}
              title={`Chapter ${chapter}`}
            >
              Chapter {chapter}

              {/* Active Check */}
              {isActive && (
                <span className="ml-1 w-4 h-4 bg-[#22C55E] rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
)}

            
           {
  (
    ['Notes', 'Handwritten Notes'].includes(localFilters.category)
    ||
    (localFilters.category === 'Video' && uniqueChaptersForSubject.length > 0)
  )
  && <div className="h-px bg-[#1F1F1F]" />
}
 {localFilters.semester && (
              <div className="mb-6 px-3 sm:px-0">
                <div
                  className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
        px-4 py-4 sm:py-3
        rounded-xl
        border border-slate-500/20
        bg-[#1F1F1F] to-transparent
        transition-all duration-200
        shadow-sm backdrop-blur-sm
      "
                >
                  {/* Left: Icon + Text */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-slate-500/15 flex items-center justify-center flex-shrink-0 text-lg">
                      <CalendarCog className='w-6 h-6'/>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-semibold text-slate-100 leading-tight">
                        Want a clear study path?
                      </p>

                      <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-snug">
                        Planner organizes this subject chapter-by-chapter with notes, PYQs and
                        important questions — complete one step, then move ahead.
                      </p>
                    </div>
                  </div>

                  {/* Right: Button */}
                  <button
                    onClick={() => {
                      if (isPreferencesSet) {
                        navigate("/planner");
                      } else {
                        dispatch(openPreferenceDrawer());
                      }
                    }}
                    className="
          flex-shrink-0
          text-xs sm:text-sm font-semibold
          px-4 sm:px-5 py-2.5 sm:py-2
          rounded-full
          bg-[#9CA3AF] hover:bg-white text-black
          active:scale-[0.98]
          transition-all duration-200
          whitespace-nowrap truncate
          focus:outline-none focus:ring-2 focus:ring-slate-400/40
          w-full sm:w-auto
        "
                  >
                    {ctaText}
                  </button>
                </div>
              </div>
            )}
            {/* PLANNER CTA */}
            {/* {localFilters.semester && (
                <div className="bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 animate-in fade-in duration-300">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#1F1F1F] flex items-center justify-center flex-shrink-0 text-lg">
                            📘
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white leading-tight">
                                Want a clear study path?
                            </p>
                            <p className="text-xs text-[#4B5563] mt-1 leading-snug">
                                Planner organizes{localFilters.subject ? ` ${localFilters.subject}` : ' your subjects'} chapter-by-chapter with curated resources
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if (isPreferencesSet) {
                                navigate("/planner");
                            } else {
                                dispatch(openPreferenceDrawer());
                            }
                        }}
                        className="flex-shrink-0 px-4 py-2.5 bg-[#9CA3AF] text-black hover:bg-white active:scale-95 rounded-full font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9CA3AF]/50 whitespace-nowrap w-full sm:w-auto"
                    >
                        {ctaText}
                    </button>
                </div>
            )} */}

            {/* EMPTY STATE */}
            {!localFilters.semester && (
                <div className="text-center py-4 px-4 bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-lg">
                    <p className="text-sm text-[#9CA3AF] font-medium mb-1">👆 Select a semester first</p>
                    <p className="text-xs text-[#4B5563]">Materials will appear once you choose</p>
                </div>
            )}
        </div>
    );
}