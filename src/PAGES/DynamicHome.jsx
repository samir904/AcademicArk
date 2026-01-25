import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPersonalizedHome, invalidateHomepageCache } from '../REDUX/Slices/homepageSlice';
import GreetingSection from '../COMPONENTS/Homepage/GreetingSection';
import ContinueWhereSection from '../COMPONENTS/Homepage/ContinueWhereSection';
import RecommendedNotesSection from '../COMPONENTS/Homepage/RecommendedNotesSection';
import TrendingSection from '../COMPONENTS/Homepage/TrendingSection';
// ⭐ ADD THESE IMPORTS
import LeaderboardSection from '../COMPONENTS/Homepage/LeaderboardSection';
import AttendanceSection from '../COMPONENTS/Homepage/AttendanceSection';
import DownloadsSection from '../COMPONENTS/Homepage/DownloadsSection';
import { BackgroundLines } from '../COMPONENTS/ui/background-lines';
import {
    GreetingSkeleton,
    ContinueWhereSkeleton,
    RecommendedSkeleton,
    TrendingSkeleton,
    DownloadsSkeleton,
    AttendanceSkeleton,
    LeaderboardSkeleton,
} from '../COMPONENTS/Homepage/SkeletonLoading';


export default function DynamicHome() {
    const dispatch = useDispatch();
    const { greeting, continue: continueData, recommended, trending, loading, error,leaderboard,attendance, downloads } = useSelector(state => state.home);
    const { isCompleted } = useSelector(state => state.academicProfile);
    
    // ✨ Track if we're in refresh mode
    const [isRefreshing, setIsRefreshing] = useState(false);

    // ✨ Initial load
    useEffect(() => {
        dispatch(fetchPersonalizedHome());
    }, [dispatch]);

    // ✨ Refresh homepage when profile is completed
    useEffect(() => {
        if (isCompleted) {
            console.log('✨ Profile completed! Refreshing homepage...');
            setIsRefreshing(true);
            
            // Add small delay to ensure backend cache is cleared
            setTimeout(() => {
                dispatch(invalidateHomepageCache());
                dispatch(fetchPersonalizedHome()).then(() => {
                    setIsRefreshing(false);
                });
            }, 500);
        }
    }, [isCompleted, dispatch]);

    if (error) {
        return (         
                <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-[#FF5454] mb-4">Failed to load homepage</p>
                        <p className="text-[#9CA3AF] text-sm">{error}</p>
                        <button
                            onClick={() => dispatch(fetchPersonalizedHome())}
                            className="mt-4 bg-[#9CA3AF] text-black px-6 py-2 rounded-lg font-semibold"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
        );
    }

    // ✨ Show skeletons when refreshing or initial loading
    const showSkeletons = loading || isRefreshing;

    return (
        <>
            <div className="min-h-screen bg-[#0B0B0B] text-[#FFFFFF]">
                <BackgroundLines svgOptions={{ duration: 10 }}>
                    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-12">
                        
   {/* // Option 2: Ultra Minimal (Cleanest) */}
{isRefreshing && (
    <div className="mb-8 px-1">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
            <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin flex-shrink-0"></div>
            <p className="text-white/80 text-sm font-medium">Updating content</p>
        </div>
    </div>
)}
                        {/* Section 1: Greeting */}
                        {showSkeletons && !greeting ? (
                            <GreetingSkeleton />
                        ) : greeting ? (
                            <GreetingSection greeting={greeting} />
                        ) : null}

                        {/* Section 2: Continue Where (PRIORITY) */}
                        {showSkeletons && !continueData ? (
                            <ContinueWhereSkeleton />
                        ) : continueData ? (
                            <ContinueWhereSection continue={continueData} />
                        ) : null}

                        {/* Section 3: Recommended */}
                        {showSkeletons && !recommended ? (
                            <RecommendedSkeleton />
                        ) : recommended ? (
                            <RecommendedNotesSection recommended={recommended} />
                        ) : null}

                        {/* Section 4: Trending */}
                        {showSkeletons && !trending ? (
                            <TrendingSkeleton />
                        ) : trending ? (
                            <TrendingSection trending={trending} />
                        ) : null}

                        

            {/* ⭐ Section 6: Attendance - NEW */}
            {showSkeletons && !attendance ? (
              <AttendanceSkeleton />
            ) : attendance ? (
              <AttendanceSection attendance={attendance} />
            ) : null}

            {/* ⭐ Section 7: Downloads - NEW */}
            {showSkeletons && !downloads ? (
              <DownloadsSkeleton />
            ) : downloads ? (
              <DownloadsSection downloads={downloads} />
            ) : null}
            {/* ⭐ Section 5: Leaderboard - NEW */}
            {showSkeletons && !leaderboard ? (
              <LeaderboardSkeleton />
            ) : leaderboard ? (
              <LeaderboardSection leaderboard={leaderboard} />
            ) : null}
                    </div>
                </BackgroundLines>
            </div>
        </>
    );
}