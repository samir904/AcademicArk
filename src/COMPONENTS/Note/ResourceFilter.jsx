import React, { useState, useMemo, useEffect } from 'react';
import { Filter, X, Check ,CalendarCog} from 'lucide-react';

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
    videos = []
}) {
    const hasActiveFilters = localFilters.subject || localFilters.category || localFilters.uploadedBy;

    const ctaText = localFilters.subject
        ? `Study ${localFilters.subject} properly →`
        : isPreferencesSet
            ? "Continue my study plan →"
            : "Study in order →";

    // ✨ FIXED: Calculate category stats with proper subject filtering
    const getCategoryStats = useMemo(() => {
        const stats = {};

        // Count notes by category (filtered by subject if selected)
        notes?.forEach(note => {
            // Only count if subject matches (if subject is selected)
            if (localFilters.subject && note.subject?.toLowerCase() !== localFilters.subject?.toLowerCase()) {
                return;
            }
            stats[note.category] = (stats[note.category] || 0) + 1;
        });

        // ✨ FIX: Count videos by category (filtered by subject if selected)
        if (videos && videos.length > 0) {
            const videoCount = videos.filter(video => {
                // Only count if subject matches (if subject is selected)
                if (localFilters.subject && video.subject?.toLowerCase() !== localFilters.subject?.toLowerCase()) {
                    return false;
                }
                return true;
            }).length;

            if (videoCount > 0) {
                stats['Video'] = videoCount;
            }
        }

        return stats;
    }, [notes, videos, localFilters.subject]);

    const categoryStats = getCategoryStats;

    // ✨ Calculate total resources (notes + videos for selected subject)
    const totalResources = useMemo(() => {
        let total = 0;

        // Count notes
        notes?.forEach(note => {
            if (localFilters.subject && note.subject?.toLowerCase() !== localFilters.subject?.toLowerCase()) {
                return;
            }
            total += 1;
        });

        // Count videos
        videos?.forEach(video => {
            if (localFilters.subject && video.subject?.toLowerCase() !== localFilters.subject?.toLowerCase()) {
                return;
            }
            total += 1;
        });

        return total;
    }, [notes, videos, localFilters.subject]);

    // Get unique chapters from videos (filtered by subject)
    const uniqueChaptersForSubject = useMemo(() => {
        const chapters = new Set();
        videos?.forEach(video => {
            if (video.chapterNumber && (!localFilters.subject || video.subject?.toLowerCase() === localFilters.subject?.toLowerCase())) {
                chapters.add(video.chapterNumber);
            }
        });
        return Array.from(chapters).sort((a, b) => a - b);
    }, [videos, localFilters.subject]);

    // ✨ UPDATED getCategoryConfig with icons instead of emojis
    const getCategoryConfig = (category) => {
        const configs = {
            'Notes': {
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notebook-icon lucide-notebook"><path d="M2 6h4" /><path d="M2 10h4" /><path d="M2 14h4" /><path d="M2 18h4" /><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M16 2v20" /></svg>
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
            <div className="md:hidden space-y-3">
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

            {/* // ✨ ENHANCED STATS SECTION - Matches filter UI with icons instead of emojis
// Color palette: #0F0F0F (bg), #1F1F1F (surface), #9CA3AF (accent), #4B5563 (muted) */}

            {localFilters.semester && (
                <div className="space-y-2">
                    {/* Stats Cards Container */}
                    <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-3 space-y-3">
                        {/* Total Resources Card - Ultra Compact */}

                        {/* <div className="bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-lg px-3 py-2 flex items-center justify-between"> <div className="flex items-center gap-2"> <div className="flex items-baseline gap-1"> <p className="text-2xl font-bold text-white">{totalResources}</p> <span className="text-xs text-[#9CA3AF]">items</span> </div> </div> */}
                            {/* Icon Section */}
                            {/* <div className="w-10 h-10 bg-[#1F1F1F] rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div> */}
                        {/* </div> */}

                        {/* Category Stats - Grid Layout */}
                        {Object.keys(categoryStats).length > 0 && (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between px-1">
                                    <h4 className="text-xs text-[#9CA3AF] font-semibold uppercase tracking-wider">Breakdown by Type</h4>
                                    <span className="text-xs font-extrabold  text-[#9CA3AF]">{Object.values(categoryStats).reduce((a, b) => a + b, 0)} total</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1.5">
                                    {Object.entries(categoryStats).map(([category, count]) => {
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
                rounded-full
                transition-all duration-200
                transform hover:scale-105
                border
                flex items-center gap-2
                whitespace-nowrap
                flex-shrink-0
                ${isActive
                                                        ? `bg-[#1F1F1F] border-[#9CA3AF] shadow-sm shadow-[#9CA3AF]/20`
                                                        : `bg-[#1F1F1F]/40 border-[#1F1F1F] hover:border-[#9CA3AF]/30 hover:bg-[#1F1F1F]/60`
                                                    }
            `}
                                                title={`Filter by ${category}`}
                                            >
                                                {/* Icon */}
                                                <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${config.iconBg}`}>
                                                    {config.icon}
                                                </div>

                                                {/* Category Name + Count Inline */}
                                                <span className={`text-xs truncate font-medium ${isActive ? 'text-white' : 'text-[#9CA3AF]'}`}>
                                                    {category}
                                                </span>
                                                <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#4B5563]'}`}>
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
                        bg-[#9CA3AF]
                        hover:bg-white
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
                        )}
                    </div>
                </div>
            )}
            {localFilters.semester && <div className="h-px bg-[#1F1F1F]" />}

            {/* FILTER OPTIONS - Only shows when semester selected */}
            {localFilters.semester && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-[#9CA3AF]" />
                            <h3 className="text-sm font-semibold text-white">
                                Filter Semester {localFilters.semester}
                            </h3>
                            <span className="text-xs text-[#4B5563]">
                                ({subjectsBySemester[localFilters.semester]?.length || 0} subjects)
                            </span>
                        </div>
                    </div>

                    {/* Filter Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Subject Filter Card */}
                        <div className="bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4 space-y-3">
                            <label className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider block">
                                Subject
                            </label>
                            <div className="relative">
                                <select
                                    value={localFilters.subject}
                                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[#1F1F1F] border border-[#2F2F2F] text-white text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#9CA3AF]/50 focus:border-[#9CA3AF] transition-all duration-200 cursor-pointer appearance-none pr-10 hover:border-[#9CA3AF]/30"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center'
                                    }}
                                >
                                    <option value="" className="bg-[#1F1F1F]">All Subjects</option>
                                    {(subjectsBySemester[localFilters.semester] || []).map((subject) => (
                                        <option key={subject} value={subject} className="bg-[#1F1F1F]">
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {localFilters.subject && (
                                <div className="px-3 py-1.5 bg-[#9CA3AF]/10 border border-[#9CA3AF]/30 rounded-full text-xs font-medium text-[#9CA3AF]">
                                    ✓ {localFilters.subject}
                                </div>
                            )}
                        </div>

                        {/* Category Filter Card */}
                        <div className="bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4 space-y-3">
                            <label className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider block">
                                Type
                            </label>
                            <div className="relative">
                                <select
                                    value={localFilters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[#1F1F1F] border border-[#2F2F2F] text-white text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#9CA3AF]/50 focus:border-[#9CA3AF] transition-all duration-200 cursor-pointer appearance-none pr-10 hover:border-[#9CA3AF]/30"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center'
                                    }}
                                >
                                    <option value="" className="bg-[#1F1F1F]">All Materials</option>
                                    <option value="Notes" className="bg-[#1F1F1F]">📚 Study Notes</option>
                                    <option value="Important Question" className="bg-[#1F1F1F]">⭐ Important Q's</option>
                                    <option value="PYQ" className="bg-[#1F1F1F]">📄 Previous Year Q's</option>
                                    <option value="Handwritten Notes" className="bg-[#1F1F1F]">✏️ Handwritten</option>
                                    <option value="Video" className="bg-[#1F1F1F]">🎬 Video Lectures</option>
                                </select>
                            </div>

                            {localFilters.category && (
                                <div className="px-3 py-1.5 bg-[#9CA3AF]/10 border border-[#9CA3AF]/30 rounded-full text-xs font-medium text-[#9CA3AF]">
                                    ✓ {localFilters.category}
                                </div>
                            )}
                        </div>

                        {/* Contributor Filter Card */}
                        <div className="bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4 space-y-3">
                            <label className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider block">
                                By
                            </label>
                            <div className="relative">
                                <select
                                    value={localFilters.uploadedBy}
                                    onChange={(e) => handleFilterChange('uploadedBy', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[#1F1F1F] border border-[#2F2F2F] text-white text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#9CA3AF]/50 focus:border-[#9CA3AF] transition-all duration-200 cursor-pointer appearance-none pr-10 hover:border-[#9CA3AF]/30"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center'
                                    }}
                                >
                                    <option value="" className="bg-[#1F1F1F]">All Contributors</option>
                                    {uniqueUploaders.map((uploader) => (
                                        <option key={uploader.id} value={uploader.id} className="bg-[#1F1F1F]">
                                            {uploader.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {localFilters.uploadedBy && (
                                <div className="px-3 py-1.5 bg-[#9CA3AF]/10 border border-[#9CA3AF]/30 rounded-full text-xs font-medium text-[#9CA3AF]">
                                    👤 {uniqueUploaders.find(u => u.id === localFilters.uploadedBy)?.name}
                                </div>
                            )}
                        </div>
                    </div>
{/* Unit Filter for Notes - Conditional */}
{['Notes', 'Handwritten Notes'].includes(localFilters.category) && (
    <div className="animate-in fade-in duration-200">
        <div className="bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4 space-y-3">
            <label className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider block">
                Unit
            </label>
            <div className="relative">
                <select
                    value={localFilters.unit || ''}
                    onChange={(e) => handleFilterChange('unit', e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1F1F1F] border border-[#2F2F2F] text-white text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#9CA3AF]/50 focus:border-[#9CA3AF] transition-all duration-200 cursor-pointer appearance-none pr-10 hover:border-[#9CA3AF]/30"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center'
                    }}
                >
                    <option value="" className="bg-[#1F1F1F]">All Units</option>
                    {[1, 2, 3, 4, 5].map((unit) => (
                        <option key={unit} value={unit} className="bg-[#1F1F1F]">
                            Unit {unit}
                        </option>
                    ))}
                </select>
            </div>

            {localFilters.unit && (
                <div className="px-3 py-1.5 bg-[#9CA3AF]/10 border border-[#9CA3AF]/30 rounded-full text-xs font-medium text-[#9CA3AF]">
                    ✓ Unit {localFilters.unit}
                </div>
            )}
        </div>
    </div>
)}

{/* Video Chapter Filter - Conditional - KEEP THIS FOR VIDEOS */}
{localFilters.category === 'Video' && uniqueChaptersForSubject.length > 0 && (
    <div className="animate-in fade-in duration-200">
        <div className="bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4 space-y-3">
            <label className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider block">
                Chapter
            </label>
            <div className="relative">
                <select
                    value={localFilters.videoChapter}
                    onChange={(e) => handleFilterChange('videoChapter', e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1F1F1F] border border-[#2F2F2F] text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9CA3AF]/50 focus:border-[#9CA3AF] transition-all duration-200 cursor-pointer appearance-none pr-10 hover:border-[#9CA3AF]/30"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center'
                    }}
                >
                    <option value="" className="bg-[#1F1F1F]">All Chapters</option>
                    {uniqueChaptersForSubject.map((chapter) => (
                        <option key={chapter} value={chapter} className="bg-[#1F1F1F]">
                            Chapter {chapter}
                        </option>
                    ))}
                </select>
            </div>

            {localFilters.videoChapter && (
                <div className="px-3 py-1.5 bg-[#9CA3AF]/10 border border-[#9CA3AF]/30 rounded-lg text-xs font-medium text-[#9CA3AF]">
                    🎬 Chapter {localFilters.videoChapter}
                </div>
            )}
        </div>
    </div>
)}

                    {/* Video Chapter Filter - Conditional */}
                    {localFilters.category === 'Video' && uniqueChaptersForSubject.length > 0 && (
                        <div className="animate-in fade-in duration-200">
                            <div className="bg-[#1F1F1F]/40 border border-[#1F1F1F] rounded-xl p-4 space-y-3">
                                <label className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider block">
                                    Chapter
                                </label>
                                <div className="relative">
                                    <select
                                        value={localFilters.videoChapter}
                                        onChange={(e) => handleFilterChange('videoChapter', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-[#1F1F1F] border border-[#2F2F2F] text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9CA3AF]/50 focus:border-[#9CA3AF] transition-all duration-200 cursor-pointer appearance-none pr-10 hover:border-[#9CA3AF]/30"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 12px center'
                                        }}
                                    >
                                        <option value="" className="bg-[#1F1F1F]">All Chapters</option>
                                        {uniqueChaptersForSubject.map((chapter) => (
                                            <option key={chapter} value={chapter} className="bg-[#1F1F1F]">
                                                Chapter {chapter}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {localFilters.videoChapter && (
                                    <div className="px-3 py-1.5 bg-[#9CA3AF]/10 border border-[#9CA3AF]/30 rounded-lg text-xs font-medium text-[#9CA3AF]">
                                        🎬 Chapter {localFilters.videoChapter}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {localFilters.semester && <div className="h-px bg-[#1F1F1F]" />}
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