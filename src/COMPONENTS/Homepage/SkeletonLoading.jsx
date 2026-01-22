// Skeleton pulse animation
const SkeletonBase = ({ className = "" }) => (
    <div className={`bg-[#161616] rounded-lg animate-pulse ${className}`} />
);

export function GreetingSkeleton() {
    return (
        <div className="mb-8 pt-4">
            <div className="space-y-3">
                <SkeletonBase className="h-16 w-96 md:w-full" />
                <SkeletonBase className="h-4 w-48" />
            </div>
        </div>
    );
}

export function ContinueWhereSkeleton() {
    return (
        <div className="mb-16">
            <div className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border border-[#1F1F1F] rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="px-8 md:px-12 py-4 border-b border-[#1F1F1F]">
                    <SkeletonBase className="h-3 w-40" />
                </div>

                {/* Main content */}
                <div className="px-8 md:px-12 py-10 space-y-6">
                    {/* Subject */}
                    <SkeletonBase className="h-4 w-32" />

                    {/* Title */}
                    <div className="space-y-2">
                        <SkeletonBase className="h-8 w-full" />
                        <SkeletonBase className="h-8 w-72" />
                    </div>

                    {/* Category badge */}
                    <SkeletonBase className="h-6 w-24" />

                    {/* Stats */}
                    <div className="flex gap-6">
                        <SkeletonBase className="h-4 w-32" />
                        <SkeletonBase className="h-4 w-32" />
                    </div>

                    {/* Button */}
                    <div className="pt-4">
                        <SkeletonBase className="h-12 w-48" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function RecommendedSkeleton() {
    return (
        <div className="mb-16">
            {/* Header */}
            <div className="mb-8">
                <SkeletonBase className="h-7 w-48 mb-4" />
            </div>

            {/* Cards */}
            <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-shrink-0 w-80 md:w-full bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6">
                        <SkeletonBase className="h-3 w-32 mb-3" />
                        <SkeletonBase className="h-6 w-full mb-4" />
                        <SkeletonBase className="h-4 w-24 mb-4" />
                        <SkeletonBase className="h-12 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TrendingSkeleton() {
    return (
        <div className="mb-12">
            {/* Header */}
            <SkeletonBase className="h-7 w-40 mb-6" />

            {/* List items */}
            <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-lg p-4 flex gap-4">
                        <SkeletonBase className="h-7 w-7 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <SkeletonBase className="h-3 w-24" />
                            <SkeletonBase className="h-4 w-48" />
                        </div>
                        <SkeletonBase className="h-8 w-24 flex-shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function FullHomeSkeleton() {
    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                <GreetingSkeleton />
                <ContinueWhereSkeleton />
                <RecommendedSkeleton />
                <TrendingSkeleton />
            </div>
        </div>
    );
}


// Leaderboard Skeleton
export function LeaderboardSkeleton() {
  return (
    <div className="mb-16">
      <div className="h-8 w-48 bg-[#1F1F1F] rounded-lg mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6 space-y-4 animate-pulse">
            <div className="h-6 bg-[#1F1F1F] rounded w-full"></div>
            <div className="h-4 bg-[#1F1F1F] rounded w-3/4"></div>
            <div className="h-12 bg-[#1F1F1F] rounded"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-8 bg-[#1F1F1F] rounded"></div>
              <div className="h-8 bg-[#1F1F1F] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Attendance Skeleton
export function AttendanceSkeleton() {
  return (
    <div className="mb-16">
      <div className="h-8 w-48 bg-[#1F1F1F] rounded-lg mb-8 animate-pulse"></div>
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center space-y-4 animate-pulse">
            <div className="w-24 h-24 bg-[#1F1F1F] rounded-full"></div>
            <div className="h-4 bg-[#1F1F1F] rounded w-24"></div>
          </div>
          <div className="space-y-4 animate-pulse">
            <div className="h-16 bg-[#1F1F1F] rounded"></div>
            <div className="h-16 bg-[#1F1F1F] rounded"></div>
          </div>
          <div className="space-y-4 animate-pulse">
            <div className="h-16 bg-[#1F1F1F] rounded"></div>
            <div className="h-10 bg-[#1F1F1F] rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Downloads Skeleton
export function DownloadsSkeleton() {
  return (
    <div className="mb-16">
      <div className="h-8 w-48 bg-[#1F1F1F] rounded-lg mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6 space-y-3 animate-pulse">
            <div className="h-4 bg-[#1F1F1F] rounded"></div>
            <div className="h-8 bg-[#1F1F1F] rounded"></div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-lg h-16 animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}
