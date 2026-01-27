import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodayPlan,
  fetchPreferences,
  fetchProgress,
  fetchStats,
  openPreferenceDrawer,
  setFirstTimeSetup
} from '../REDUX/Slices/plannerSlice';
import PlannerHeader from '../COMPONENTS/Planner/PlannerHeader';
import TodayPlanHero from '../COMPONENTS/Planner/TodayPlanHero';
import PlannerNotesStrip from '../COMPONENTS/Planner/PlannerNotesStrip';
import ProgressSnapshot from '../COMPONENTS/Planner/ProgressSnapshot';
import StudyPreferenceDrawer from '../COMPONENTS/Planner/StudyPreferenceDrawer';
import EmptyState from '../COMPONENTS/Planner/EmptyState';
import ProgressTracker from '../COMPONENTS/Planner/ProgressTracker';
import { PlannerSkeleton } from '../COMPONENTS/Skeletons';
import PageTransition from '../COMPONENTS/PageTransition';

export default function PlannerPage() {
  const dispatch = useDispatch();
  const {
    todayPlan,
    preferences,
    progress,
    stats,
    preferencesFetched, // ✅ ADD THIS
    isPreferencesSet,
    firstTimeSetup,
    loading,
    error
  } = useSelector((state) => state.planner);

  useEffect(() => {
    // Initial load
    dispatch(fetchPreferences());
  }, [dispatch]);

  useEffect(() => {
  if (!preferencesFetched) return;

  if (isPreferencesSet) {
    dispatch(fetchTodayPlan());
    dispatch(fetchProgress());
    dispatch(fetchStats());
    dispatch(setFirstTimeSetup(false));
  } else {
    dispatch(openPreferenceDrawer());
    dispatch(setFirstTimeSetup(true));
  }
}, [preferencesFetched, isPreferencesSet, dispatch]);
  // Show loading state
  if (loading.preferences) {
    return (
        <>
      <PlannerSkeleton/>
      </>
    );
  }

  // Show empty state if no preferences
  if (!isPreferencesSet) {
    return (
        <>
      <div className="min-h-screen bg-neutral-950">
        <PlannerHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState onSetupClick={() => dispatch(openPreferenceDrawer())} />
        </div>
        <StudyPreferenceDrawer />
      </div>
      </>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <PlannerHeader />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Error Alert */}
        {error.todayPlan && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error.todayPlan}
          </div>
        )}

        {/* Today Plan Hero */}
        <div className="mb-8">
          {loading.todayPlan ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 h-48 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-neutral-700 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-neutral-500 text-sm">Generating your plan...</p>
              </div>
            </div>
          ) : (
            <TodayPlanHero  plan={todayPlan} />
          )}
        </div>

        {/* Notes Strip */}
        {todayPlan?.tasks?.length > 0 && (
          <div className="mb-8">
            <PlannerNotesStrip
              subject={todayPlan.tasks[0]?.subject}
              unit={todayPlan.tasks[0]?.unit}
            />
          </div>
        )}

        {progress?.length > 0 && (
  <div className="mb-8">
    <ProgressTracker progress={progress} />
  </div>
)}

        {/* Progress Snapshot */}
        <div className="mb-8">
          {loading.stats ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 h-32 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-neutral-700 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-neutral-500 text-sm">Loading stats...</p>
              </div>
            </div>
          ) : (
            <ProgressSnapshot stats={stats} streak={stats.streak} />
          )}
        </div>
      </main>

      {/* Study Preference Drawer */}
      <StudyPreferenceDrawer isFirstTime={firstTimeSetup} />
    </div>
    </PageTransition>
  );
}