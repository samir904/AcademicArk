// ============================================
// PLANNER HEADER — FINAL POLISHED VERSION
// ============================================
import React from "react";
import { Settings, CalendarDays } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openPreferenceDrawer } from "../../REDUX/Slices/plannerSlice";

export default function PlannerHeader() {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.planner);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

  return (
    <header className="bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7">
        <div className="flex items-center justify-between gap-4">
          
          {/* LEFT */}
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-100 leading-tight">
              Smart Study Planner
            </h1>

            <div className="flex items-center gap-3 mt-2 text-sm text-neutral-500">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                <span>{today}</span>
              </div>

              <span className="hidden sm:inline-block">•</span>

              <span className="hidden sm:inline-block">
                Build consistency, not pressure
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* Optional streak chip (safe if stats not loaded) */}
            {stats?.streak?.current > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
                🔥
                <span className="font-medium">
                  {stats.streak.current}-day streak
                </span>
              </div>
            )}

            {/* Settings */}
            <button
              onClick={() => dispatch(openPreferenceDrawer())}
              className="
                p-2.5 rounded-lg
                bg-neutral-900
                border border-neutral-800
                text-neutral-400
                hover:text-indigo-400
                hover:border-indigo-500/40
                hover:bg-neutral-900/80
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500/30
              "
              aria-label="Study preferences"
              title="Study preferences"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}