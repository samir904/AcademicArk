import React from 'react';

/**
 * 🎨 Skeleton Loaders - Full Page Height
 * Dark Theme matching ContinueWhereSection
 * Each skeleton shows full page with multiple sections
 */

// ===== NOTES SECTION =====
export const NotesSkeleton = () => (
  <div className="min-h-screen p-4 space-y-4 animate-pulse bg-[#0A0A0A]">
    {/* Header Section */}
    <div className="space-y-4 mb-8">
      <div className="h-10 bg-[#2A2A2A] rounded-xl w-1/3" />
      <div className="h-5 bg-[#1F1F1F] rounded-lg w-1/2" />
    </div>

    {/* Filter/Sort Section */}
    <div className="flex gap-3 mb-8">
      <div className="h-10 bg-[#2A2A2A] rounded-full w-24" />
      <div className="h-10 bg-[#2A2A2A] rounded-full w-24" />
      <div className="h-10 bg-[#2A2A2A] rounded-full w-24" />
    </div>

    {/* Notes List - 6 items */}
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-3">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-[#2A2A2A] rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-[#2A2A2A] rounded-lg w-3/4" />
              <div className="h-4 bg-[#1F1F1F] rounded-lg w-1/2" />
              <div className="h-3 bg-[#1F1F1F] rounded-lg w-2/3" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <div className="h-4 bg-[#1F1F1F] rounded-full w-16" />
            <div className="h-4 bg-[#1F1F1F] rounded-full w-16" />
          </div>
        </div>
      ))}
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

export const NoteDetailSkeleton = () => (
  <div className="min-h-screen p-4 space-y-6 animate-pulse bg-[#0A0A0A]">
    {/* Header with Back Button */}
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 bg-[#2A2A2A] rounded-lg" />
      <div className="h-8 bg-[#2A2A2A] rounded-lg w-1/4" />
    </div>

    {/* Title Section */}
    <div className="space-y-4 mb-8 p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F]">
      <div className="h-10 bg-[#2A2A2A] rounded-xl w-4/5" />
      <div className="h-5 bg-[#1F1F1F] rounded-lg w-1/2" />
      <div className="flex gap-3">
        <div className="h-5 bg-[#1F1F1F] rounded-full w-20" />
        <div className="h-5 bg-[#1F1F1F] rounded-full w-20" />
        <div className="h-5 bg-[#1F1F1F] rounded-full w-20" />
      </div>
    </div>

    {/* Meta Information */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-3 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-2">
          <div className="h-4 bg-[#1F1F1F] rounded-lg w-1/2" />
          <div className="h-6 bg-[#2A2A2A] rounded-lg" />
        </div>
      ))}
    </div>

    {/* Content Preview - Multiple sections */}
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-3">
          <div className="h-6 bg-[#2A2A2A] rounded-lg w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-[#1F1F1F] rounded-lg" />
            <div className="h-4 bg-[#1F1F1F] rounded-lg w-5/6" />
            <div className="h-4 bg-[#1F1F1F] rounded-lg w-4/5" />
          </div>
        </div>
      ))}
    </div>

    {/* CTA Button */}
    <div className="flex gap-3 mt-8">
      <div className="h-12 bg-[#2A2A2A] rounded-full w-40" />
      <div className="h-12 bg-[#1F1F1F] rounded-full w-40" />
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

export const ReadNoteSkeleton = () => (
  <div className="min-h-screen p-4 space-y-6 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-[#2A2A2A] rounded-lg" />
        <div className="h-8 bg-[#2A2A2A] rounded-lg w-1/4" />
      </div>
    </div>

    {/* Title & Meta */}
    <div className="space-y-4 mb-8 p-6 bg-[#0F0F0F] rounded-2xl border border-[#1F1F1F]">
      <div className="h-12 bg-[#2A2A2A] rounded-xl w-5/6" />
      <div className="flex gap-4 items-center">
        <div className="h-8 w-8 bg-[#2A2A2A] rounded-full" />
        <div className="space-y-1 flex-1">
          <div className="h-4 bg-[#1F1F1F] rounded-lg w-1/3" />
          <div className="h-3 bg-[#1F1F1F] rounded-lg w-1/4" />
        </div>
      </div>
    </div>

    {/* Content - Long article */}
    <div className="space-y-6 p-6 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F]">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-3">
          {i % 3 === 0 && <div className="h-6 bg-[#2A2A2A] rounded-lg w-2/5" />}
          <div className="space-y-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-4 bg-[#1F1F1F] rounded-lg w-full" />
            ))}
            <div className="h-4 bg-[#1F1F1F] rounded-lg w-4/5" />
          </div>
        </div>
      ))}
    </div>

    {/* Related/Navigation */}
    <div className="space-y-3 mt-8">
      <div className="h-6 bg-[#2A2A2A] rounded-lg w-1/4" />
      {[...Array(2)].map((_, i) => (
        <div key={i} className="p-3 bg-[#0F0F0F] rounded-lg border border-[#1F1F1F] h-12" />
      ))}
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

// ===== DOWNLOADS SECTION =====
export const DownloadsSkeleton = () => (
  <div className="min-h-screen p-4 space-y-4 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="space-y-4 mb-8">
      <div className="h-10 bg-[#2A2A2A] rounded-xl w-1/3" />
      <div className="h-5 bg-[#1F1F1F] rounded-lg w-1/2" />
    </div>

    {/* Filter Tabs */}
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-[#2A2A2A] rounded-full w-24 flex-shrink-0" />
      ))}
    </div>

    {/* Downloads List - 8 items */}
    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] flex gap-4">
          <div className="w-20 h-20 bg-[#2A2A2A] rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-[#2A2A2A] rounded-lg w-3/4" />
            <div className="h-4 bg-[#1F1F1F] rounded-lg w-1/2" />
            <div className="h-3 bg-[#1F1F1F] rounded-lg w-2/3" />
          </div>
          <div className="w-10 h-10 bg-[#2A2A2A] rounded-lg flex-shrink-0" />
        </div>
      ))}
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

// ===== PLANNER SECTION =====
export const PlannerSkeleton = () => (
  <div className="min-h-screen p-4 space-y-4 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="space-y-4 mb-8">
      <div className="h-10 bg-[#2A2A2A] rounded-xl w-1/3" />
      <div className="flex gap-2">
        <div className="h-10 bg-[#2A2A2A] rounded-full w-24" />
        <div className="h-10 bg-[#2A2A2A] rounded-full w-24" />
      </div>
    </div>

    {/* Calendar/Timeline View */}
    <div className="mb-8 p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F]">
      <div className="h-40 bg-[#1F1F1F] rounded-lg" />
    </div>

    {/* Task List - 7 items */}
    <div className="space-y-3">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#2A2A2A] rounded" />
            <div className="h-5 bg-[#2A2A2A] rounded-lg flex-1" />
            <div className="h-5 bg-[#1F1F1F] rounded-full w-20" />
          </div>
          <div className="h-4 bg-[#1F1F1F] rounded-lg w-2/3 ml-9" />
        </div>
      ))}
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

// ===== ATTENDANCE SECTION =====
export const AttendanceSkeleton = () => (
  <div className="min-h-screen p-4 space-y-4 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="space-y-4 mb-8">
      <div className="h-10 bg-[#2A2A2A] rounded-xl w-1/3" />
      <div className="h-5 bg-[#1F1F1F] rounded-lg w-1/2" />
    </div>

    {/* Overall Stats */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-2">
          <div className="h-4 bg-[#1F1F1F] rounded-lg w-1/2" />
          <div className="h-8 bg-[#2A2A2A] rounded-lg" />
        </div>
      ))}
    </div>

    {/* Subjects List - 6 items */}
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-[#2A2A2A] rounded-lg w-2/3" />
            <div className="h-5 bg-[#1F1F1F] rounded-full w-16" />
          </div>
          <div className="w-full h-2 bg-[#1F1F1F] rounded-full">
            <div className="h-full w-2/3 bg-[#2A2A2A] rounded-full" />
          </div>
          <div className="h-4 bg-[#1F1F1F] rounded-lg w-1/2" />
        </div>
      ))}
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

export const SubjectSkeleton = () => (
  <div className="min-h-screen p-4 space-y-6 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 bg-[#2A2A2A] rounded-lg" />
      <div className="h-8 bg-[#2A2A2A] rounded-lg flex-1" />
    </div>

    {/* Subject Title & Stats */}
    <div className="p-6 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-4 mb-8">
      <div className="h-8 bg-[#2A2A2A] rounded-lg w-2/3" />
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-4 bg-[#1F1F1F] rounded-lg" />
            <div className="h-6 bg-[#2A2A2A] rounded-lg" />
          </div>
        ))}
      </div>
    </div>

    {/* Attendance Records - 7 items */}
    <div className="space-y-3">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F]">
          <div className="flex justify-between items-center mb-2">
            <div className="h-5 bg-[#2A2A2A] rounded-lg w-2/5" />
            <div className="h-5 bg-[#1F1F1F] rounded-full w-16" />
          </div>
          <div className="h-3 bg-[#1F1F1F] rounded-lg w-1/2" />
        </div>
      ))}
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

// ===== PROFILE SECTION =====
export const ProfileSkeleton = () => (
  <div className="min-h-screen p-4 space-y-6 animate-pulse bg-[#0A0A0A]">
    {/* Profile Header */}
    <div className="p-6 bg-[#0F0F0F] rounded-2xl border border-[#1F1F1F] text-center space-y-4">
      <div className="w-24 h-24 bg-[#2A2A2A] rounded-full mx-auto" />
      <div className="space-y-2">
        <div className="h-8 bg-[#2A2A2A] rounded-lg mx-auto w-1/2" />
        <div className="h-4 bg-[#1F1F1F] rounded-lg mx-auto w-1/3" />
        <div className="h-3 bg-[#1F1F1F] rounded-lg mx-auto w-2/5" />
      </div>
    </div>

    {/* Statistics Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-2 text-center">
          <div className="h-4 bg-[#1F1F1F] rounded-lg" />
          <div className="h-8 bg-[#2A2A2A] rounded-lg" />
        </div>
      ))}
    </div>

    {/* Info Sections */}
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-3">
          <div className="h-6 bg-[#2A2A2A] rounded-lg w-1/3" />
          <div className="space-y-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex justify-between">
                <div className="h-4 bg-[#1F1F1F] rounded-lg w-1/3" />
                <div className="h-4 bg-[#1F1F1F] rounded-lg w-1/3" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

export const EditProfileSkeleton = () => (
  <div className="min-h-screen p-4 space-y-6 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-[#2A2A2A] rounded-lg" />
        <div className="h-8 bg-[#2A2A2A] rounded-lg flex-1" />
      </div>
    </div>

    {/* Profile Image */}
    <div className="flex justify-center mb-8">
      <div className="relative">
        <div className="w-32 h-32 bg-[#2A2A2A] rounded-full" />
        <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#2A2A2A] rounded-full border-4 border-[#0A0A0A]" />
      </div>
    </div>

    {/* Form Fields - 8 items */}
    <div className="space-y-4 mb-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-[#2A2A2A] rounded-lg w-1/4" />
          <div className="h-12 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F]" />
        </div>
      ))}
    </div>

    {/* Save/Cancel Buttons */}
    <div className="flex gap-3">
      <div className="h-12 bg-[#2A2A2A] rounded-full flex-1" />
      <div className="h-12 bg-[#1F1F1F] rounded-full flex-1" />
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

// ===== SEARCH SECTION =====
export const SearchSkeleton = () => (
  <div className="min-h-screen p-4 space-y-4 animate-pulse bg-[#0A0A0A]">
    {/* Search Bar */}
    {/* <div className="mb-8 sticky top-0 z-10">
      <div className="h-12 bg-[#0F0F0F] rounded-full border border-[#1F1F1F]" />
    </div> */}

    {/* Filter Tags */}
    {/* <div className="flex flex-wrap gap-2 mb-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-8 bg-[#2A2A2A] rounded-full w-20" />
      ))}
    </div> */}

    {/* Results Header */}
    <div className="h-6 bg-[#2A2A2A] rounded-lg w-1/3 mb-4" />

    {/* Search Results - 8 items */}
    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-3">
          <div className="h-6 bg-[#2A2A2A] rounded-lg w-4/5" />
          <div className="space-y-2">
            <div className="h-3 bg-[#1F1F1F] rounded-lg" />
            <div className="h-3 bg-[#1F1F1F] rounded-lg w-4/5" />
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-3 bg-[#1F1F1F] rounded-full w-16" />
            <div className="h-3 bg-[#1F1F1F] rounded-full w-16" />
          </div>
        </div>
      ))}
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

// ===== BOOKMARKS SECTION =====
export const BookmarksSkeleton = () => (
  <div className="min-h-screen p-4 space-y-4 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="space-y-4 mb-8">
      <div className="h-10 bg-[#2A2A2A] rounded-xl w-1/3" />
      <div className="h-5 bg-[#1F1F1F] rounded-lg w-1/2" />
    </div>

    {/* Collection Tabs */}
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-[#2A2A2A] rounded-full w-24 flex-shrink-0" />
      ))}
    </div>

    {/* Bookmarked Items - 6 items */}
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-[#2A2A2A] rounded-lg w-3/4" />
              <div className="h-4 bg-[#1F1F1F] rounded-lg w-1/2" />
            </div>
            <div className="w-8 h-8 bg-[#2A2A2A] rounded-lg flex-shrink-0" />
          </div>
          <div className="h-3 bg-[#1F1F1F] rounded-lg w-2/3" />
        </div>
      ))}
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

// ===== UPLOAD SECTION =====
export const UploadSkeleton = () => (
  <div className="min-h-screen p-4 space-y-6 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="space-y-4 mb-8">
      <div className="h-10 bg-[#2A2A2A] rounded-xl w-1/3" />
      <div className="h-5 bg-[#1F1F1F] rounded-lg w-1/2" />
    </div>

    {/* Upload Area */}
    <div className="h-64 bg-[#0F0F0F] rounded-2xl border-2 border-dashed border-[#1F1F1F] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-[#2A2A2A] rounded-full mx-auto" />
        <div className="h-5 bg-[#2A2A2A] rounded-lg w-32 mx-auto" />
        <div className="h-4 bg-[#1F1F1F] rounded-lg w-40 mx-auto" />
      </div>
    </div>

    {/* Form Fields */}
    <div className="space-y-4 mb-8">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-[#2A2A2A] rounded-lg w-1/4" />
          <div className="h-12 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F]" />
        </div>
      ))}
    </div>

    {/* Upload Button */}
    <div className="h-12 bg-[#2A2A2A] rounded-full" />

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

export const VideoUploadSkeleton = () => (
  <div className="min-h-screen p-4 space-y-6 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="space-y-4 mb-8">
      <div className="h-10 bg-[#2A2A2A] rounded-xl w-1/3" />
      <div className="h-5 bg-[#1F1F1F] rounded-lg w-1/2" />
    </div>

    {/* Video Upload Area */}
    <div className="h-80 bg-[#0F0F0F] rounded-2xl border-2 border-dashed border-[#1F1F1F] flex items-center justify-center mb-8">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-[#2A2A2A] rounded-full mx-auto" />
        <div className="h-6 bg-[#2A2A2A] rounded-lg w-40 mx-auto" />
        <div className="h-4 bg-[#1F1F1F] rounded-lg w-48 mx-auto" />
      </div>
    </div>

    {/* Video Details Form */}
    <div className="space-y-4 mb-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-[#2A2A2A] rounded-lg w-1/4" />
          <div className="h-12 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F]" />
        </div>
      ))}
    </div>

    {/* Upload Buttons */}
    <div className="flex gap-3">
      <div className="h-12 bg-[#2A2A2A] rounded-full flex-1" />
      <div className="h-12 bg-[#1F1F1F] rounded-full flex-1" />
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

// ===== ADMIN SECTION =====
export const AdminDashboardSkeleton = () => (
  <div className="min-h-screen p-4 space-y-6 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="h-10 bg-[#2A2A2A] rounded-xl w-1/3" />

    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-3">
          <div className="h-4 bg-[#1F1F1F] rounded-lg" />
          <div className="h-10 bg-[#2A2A2A] rounded-lg" />
          <div className="h-3 bg-[#1F1F1F] rounded-lg w-2/3" />
        </div>
      ))}
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F]">
          <div className="h-6 bg-[#2A2A2A] rounded-lg w-1/3 mb-4" />
          <div className="h-56 bg-[#1F1F1F] rounded-lg" />
        </div>
      ))}
    </div>

    {/* Recent Activity Table */}
    <div className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F]">
      <div className="h-6 bg-[#2A2A2A] rounded-lg w-1/4 mb-4" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3 items-center py-3 border-b border-[#1F1F1F]">
            <div className="w-10 h-10 bg-[#2A2A2A] rounded-lg" />
            <div className="flex-1 h-4 bg-[#1F1F1F] rounded-lg w-1/3" />
            <div className="h-4 bg-[#1F1F1F] rounded-lg w-1/4" />
          </div>
        ))}
      </div>
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

// ===== SETTINGS SECTION =====
export const SettingsSkeleton = () => (
  <div className="min-h-screen p-4 space-y-6 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="space-y-4 mb-8">
      <div className="h-10 bg-[#2A2A2A] rounded-xl w-1/3" />
      <div className="h-5 bg-[#1F1F1F] rounded-lg w-1/2" />
    </div>

    {/* Settings Groups */}
    {[...Array(4)].map((_, groupIdx) => (
      <div key={groupIdx} className="space-y-4">
        <div className="h-6 bg-[#2A2A2A] rounded-lg w-1/4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] flex justify-between items-center">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-[#2A2A2A] rounded-lg w-1/2" />
                <div className="h-3 bg-[#1F1F1F] rounded-lg w-2/3" />
              </div>
              <div className="w-12 h-6 bg-[#2A2A2A] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    ))}

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

// ===== LEADERBOARD SECTION =====
export const LeaderboardSkeleton = () => (
  <div className="min-h-screen p-4 space-y-6 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="space-y-4 mb-8">
      <div className="h-10 bg-[#2A2A2A] rounded-xl w-1/3" />
      <div className="h-5 bg-[#1F1F1F] rounded-lg w-1/2" />
    </div>

    {/* Top 3 Podium */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 bg-[#0F0F0F] rounded-2xl border border-[#1F1F1F] text-center space-y-4">
          <div className={`w-16 h-16 bg-[#2A2A2A] rounded-full mx-auto`} />
          <div className="space-y-2">
            <div className="h-5 bg-[#2A2A2A] rounded-lg" />
            <div className="h-4 bg-[#1F1F1F] rounded-lg w-2/3 mx-auto" />
          </div>
          <div className="h-8 bg-[#2A2A2A] rounded-lg" />
        </div>
      ))}
    </div>

    {/* Leaderboard List */}
    <div className="space-y-2">
      <div className="h-6 bg-[#2A2A2A] rounded-lg w-1/4 mb-4" />
      {[...Array(10)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-8 h-8 bg-[#2A2A2A] rounded-full" />
            <div className="space-y-1 flex-1">
              <div className="h-4 bg-[#2A2A2A] rounded-lg w-1/3" />
              <div className="h-3 bg-[#1F1F1F] rounded-lg w-1/4" />
            </div>
          </div>
          <div className="h-5 bg-[#2A2A2A] rounded-lg w-20" />
        </div>
      ))}
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

// ===== GENERIC SECTION =====
export const GenericSkeleton = () => (
  <div className="min-h-screen p-4 space-y-4 animate-pulse bg-[#0A0A0A]">
    {/* Header */}
    <div className="space-y-4 mb-8">
      <div className="h-10 bg-[#2A2A2A] rounded-xl w-1/3" />
      <div className="h-5 bg-[#1F1F1F] rounded-lg w-1/2" />
    </div>

    {/* Content Grid */}
    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-3">
          <div className="h-5 bg-[#2A2A2A] rounded-lg w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-[#1F1F1F] rounded-lg" />
            <div className="h-4 bg-[#1F1F1F] rounded-lg w-5/6" />
          </div>
          <div className="h-3 bg-[#1F1F1F] rounded-lg w-2/3" />
        </div>
      ))}
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

// ===== MYSPACE SECTION =====
export const MySpaceSkeleton = () => (
  <div className="min-h-screen p-4 space-y-6 animate-pulse bg-[#0A0A0A]">
    {/* User Profile Card */}
    <div className="p-6 md:p-8 bg-[#0F0F0F] rounded-2xl border border-[#1F1F1F]">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-[#2A2A2A] rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-[#2A2A2A] rounded-xl w-1/3" />
          <div className="h-4 bg-[#1F1F1F] rounded-lg w-1/2" />
          <div className="h-4 bg-[#1F1F1F] rounded-lg w-2/3" />
        </div>
      </div>
    </div>

    {/* Stats Section */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-3 text-center">
          <div className="h-4 bg-[#1F1F1F] rounded-lg" />
          <div className="h-8 bg-[#2A2A2A] rounded-lg" />
          <div className="h-3 bg-[#1F1F1F] rounded-lg w-3/4 mx-auto" />
        </div>
      ))}
    </div>

    {/* Recent Activity */}
    <div className="space-y-4">
      <div className="h-6 bg-[#2A2A2A] rounded-lg w-1/4" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] space-y-3">
          <div className="h-5 bg-[#2A2A2A] rounded-lg w-3/4" />
          <div className="h-3 bg-[#1F1F1F] rounded-lg w-1/2" />
          <div className="h-3 bg-[#1F1F1F] rounded-lg w-2/3" />
        </div>
      ))}
    </div>

    {/* Quick Links */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 bg-[#2A2A2A] rounded-full border border-[#1F1F1F]" />
      ))}
    </div>

    {/* Footer Spacing */}
    <div className="h-20" />
  </div>
);

export default {
  NotesSkeleton,
  NoteDetailSkeleton,
  ReadNoteSkeleton,
  DownloadsSkeleton,
  PlannerSkeleton,
  AttendanceSkeleton,
  SubjectSkeleton,
  ProfileSkeleton,
  EditProfileSkeleton,
  SearchSkeleton,
  BookmarksSkeleton,
  UploadSkeleton,
  VideoUploadSkeleton,
  AdminDashboardSkeleton,
  SettingsSkeleton,
  LeaderboardSkeleton,
  GenericSkeleton,
  MySpaceSkeleton,
};
