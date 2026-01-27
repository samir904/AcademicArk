// ============================================
// TODAY PLAN HERO COMPONENT (FINAL)
// ============================================

import React from 'react';
import { BookOpen, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import {
  updateProgress,
  fetchTodayPlan,
  fetchStats,
  fetchProgress,
  openPreferenceDrawer
} from '../../REDUX/Slices/plannerSlice';
import toast from 'react-hot-toast';

export default function TodayPlanHero({ plan }) {
  const dispatch = useDispatch();

  // -------------------------
  // EMPTY STATE
  // -------------------------
  if (!plan?.tasks || plan.tasks.length === 0) {
  return (
    <div id="today-plan-anchor" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 sm:p-10 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-indigo-500" />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold text-neutral-100 mb-2">
        You’re all caught up 🎉
      </h2>

      <p className="text-neutral-400 text-sm sm:text-base mb-6">
        You’ve completed everything planned for today.
        <br />
        Want to study more or add another subject?
      </p>

      {/* CTA */}
      <button
        onClick={() => dispatch(openPreferenceDrawer())}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          px-6
          py-3
          rounded-full
          bg-neutral-100
          hover:bg-white
          text-neutral-950
          font-semibold
          transition-all
          duration-300
        "
      >
        Update Study Preferences
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* subtle guidance */}
      <p className="mt-4 text-xs text-neutral-500">
        You can add more subjects or increase your daily study time.
      </p>
    </div>
  );
}

  // -------------------------
  // MAIN TASK
  // -------------------------
  const firstTask = plan.tasks[0];
  const remainingTasks = plan.tasks.length - 1;

  const isInProgress = firstTask.status === 'IN_PROGRESS';
  const isCompleted = firstTask.status === 'COMPLETED';

  // -------------------------
  // HANDLERS
  // -------------------------
  const refreshPlanner = () => {
    dispatch(fetchTodayPlan());
    dispatch(fetchStats());
    dispatch(fetchProgress());
  };

  const handleStartStudy = async () => {
    const result = await dispatch(
      updateProgress({
        subject: firstTask.subject,
        unit: firstTask.unit,
        status: 'IN_PROGRESS'
      })
    );

    if (updateProgress.fulfilled.match(result)) {
      toast.success('Study session started 🚀');
      refreshPlanner();
    }
  };

  const handleCompleteStudy = async () => {
    const result = await dispatch(
      updateProgress({
        subject: firstTask.subject,
        unit: firstTask.unit,
        status: 'COMPLETED'
      })
    );

    if (updateProgress.fulfilled.match(result)) {
      toast.success('Unit completed 🎉');
      refreshPlanner();
    }
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 sm:p-10">
      {/* MAIN TASK */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="flex-1">
            <h3 className="text-xs uppercase tracking-wider text-neutral-500 font-medium mb-2">
              Today’s Focus
            </h3>

            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-100 mb-1">
              {firstTask.subject}
            </h2>

            <p className="text-neutral-400">
              Unit {firstTask.unit} •{' '}
              {isCompleted
                ? 'Completed'
                : isInProgress
                ? 'In progress'
                : 'Not started'}
            </p>
          </div>
        </div>

        {/* TIME */}
        <div className="flex items-center gap-2 mb-6 text-neutral-300">
          <Clock className="w-4 h-4 text-neutral-400" />
          <span className="text-sm font-medium">
            {firstTask.timeAllocated} minutes
          </span>
        </div>

        {/* CTA */}
        {!isCompleted && (
          <button
            onClick={isInProgress ? handleCompleteStudy : handleStartStudy}
            className={`w-full sm:w-auto px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2
              ${
                isInProgress
                  ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                  : 'bg-neutral-100 hover:bg-white text-neutral-950'
              }
            `}
          >
            {isInProgress ? 'Mark as Completed' : 'Start Studying'}
            {isInProgress ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        )}

        {/* GUIDANCE TEXT */}
        <p className="mt-4 text-xs text-neutral-500">
          Below you’ll find all available notes and resources for this unit.
        </p>
      </div>

      {/* REMAINING TASKS */}
      {remainingTasks > 0 && (
        <div className="pt-8 border-t border-neutral-800">
          <p className="text-neutral-400 text-sm mb-4">
            And {remainingTasks} more task{remainingTasks > 1 ? 's' : ''} today
          </p>

          <div className="space-y-2">
            {plan.tasks.slice(1).map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-300">
                    {task.subject}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Unit {task.unit}
                  </p>
                </div>

                <span className="text-xs text-neutral-400">
                  {task.timeAllocated} min
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOTAL TIME */}
      <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between">
        <span className="text-neutral-400 text-sm">Total daily plan</span>
        <span className="text-lg font-semibold text-indigo-500">
          {plan.totalMinutes} minutes
        </span>
      </div>
    </div>
  );
}