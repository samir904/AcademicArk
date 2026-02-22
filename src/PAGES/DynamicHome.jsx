import { useEffect, useState, useRef } from 'react';   // ✅ add useRef
import { useDispatch, useSelector } from 'react-redux';
import { fetchPersonalizedHome, invalidateHomepageCache } from '../REDUX/Slices/homepageSlice';
import GreetingSection           from '../COMPONENTS/Homepage/GreetingSection';
import ContinueWhereSection      from '../COMPONENTS/Homepage/ContinueWhereSection';
import StudyMaterialToday        from '../COMPONENTS/Homepage/StudyMaterialToday';
import RecommendedNotesSection   from '../COMPONENTS/Homepage/RecommendedNotesSection';
import TrendingSection           from '../COMPONENTS/Homepage/TrendingSection';
import AttendanceSection         from '../COMPONENTS/Homepage/AttendanceSection';
import DownloadsSection          from '../COMPONENTS/Homepage/DownloadsSection';
import LeaderboardSection        from '../COMPONENTS/Homepage/LeaderboardSection';
import { BackgroundLines }       from '../COMPONENTS/ui/background-lines';
import {
  GreetingSkeleton,
  ContinueWhereSkeleton,
  StudyMaterialTodaySkeleton,
  RecommendedSkeleton,
  TrendingSkeleton,
  AttendanceSkeleton,
  DownloadsSkeleton,
  LeaderboardSkeleton,
} from '../COMPONENTS/Homepage/SkeletonLoading';
import PageTransition from '../COMPONENTS/PageTransition';
import NewNotesBadge from '../COMPONENTS/Homepage/NewNotesBadge';
import QuickActionsBar from '../COMPONENTS/Homepage/QuickActionsBar';

export default function DynamicHome() {
  const dispatch = useDispatch();

  const {
    greeting, continue: continueData, studyMaterialToday,newNotesBadge,
    recommended, trending, attendance, downloads, leaderboard,
    loading, error,
  } = useSelector(state => state.home);

  const { isCompleted } = useSelector(state => state.academicProfile);

  const [isRefreshing,    setIsRefreshing]    = useState(false);
  const prevIsCompleted = useRef(false);          // ✅ guards repeat fires

  // ── Initial load
  useEffect(() => {
    dispatch(fetchPersonalizedHome());
  }, [dispatch]);

  // ── Refresh only on false → true transition
  useEffect(() => {
    if (isCompleted && !prevIsCompleted.current) {
      prevIsCompleted.current = true;
      setIsRefreshing(true);
      setTimeout(() => {
        dispatch(invalidateHomepageCache())         // ✅ single API call
          .unwrap()
          .finally(() => setIsRefreshing(false));
      }, 500);
    }
  }, [isCompleted, dispatch]);

  const showSkeletons = loading || isRefreshing;

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

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0B0B] text-white">
        <BackgroundLines svgOptions={{ duration: 10 }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-12">

            {/* Refreshing banner */}
            {isRefreshing && (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10
                rounded-xl px-4 py-3 backdrop-blur-sm">
                <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400
                  rounded-full animate-spin flex-shrink-0" />
                <p className="text-white/80 text-sm font-medium">Updating content</p>
              </div>
            )}

            {/* 1 — Greeting */}
            {showSkeletons && !greeting
              ? <GreetingSkeleton />
              : greeting
                ? <GreetingSection greeting={greeting} />
                : null}
    {/* ✅ Quick Actions — always visible, no skeleton needed */}
{/* <QuickActionsBar /> */}
            {/* 2 — Continue */}
            {showSkeletons && !continueData
              ? <ContinueWhereSkeleton />
              : continueData
                ? <ContinueWhereSection continue={continueData} />
                : null}

            {/* 3 — Study Material Today */}
            {/* ✅ null = not fetched → skeleton | {hasData:false} = empty → nothing */}
            {showSkeletons && studyMaterialToday === null
              ? <StudyMaterialTodaySkeleton />
              : studyMaterialToday?.hasData
                ? <StudyMaterialToday data={studyMaterialToday} />
                : null}

            {/* 4 — Recommended */}
            {newNotesBadge?.hasNew && (
  <NewNotesBadge data={newNotesBadge} />   // ✅ above recommended
)}
            {showSkeletons && !recommended
              ? <RecommendedSkeleton />
              : recommended
                ? <RecommendedNotesSection recommended={recommended} />
                : null}

            {/* 5 — Trending */}
            {showSkeletons && !trending
              ? <TrendingSkeleton />
              : trending
                ? <TrendingSection trending={trending} />
                : null}

            {/* 6 — Attendance */}
            {showSkeletons && !attendance
              ? <AttendanceSkeleton />
              : attendance
                ? <AttendanceSection attendance={attendance} />
                : null}

            {/* 7 — Downloads */}
            {showSkeletons && !downloads
              ? <DownloadsSkeleton />
              : downloads
                ? <DownloadsSection downloads={downloads} />
                : null}

            {/* 8 — Leaderboard */}
            {showSkeletons && !leaderboard
              ? <LeaderboardSkeleton />
              : leaderboard
                ? <LeaderboardSection leaderboard={leaderboard} />
                : null}

          </div>
        </BackgroundLines>
      </div>
    </PageTransition>
  );
}
