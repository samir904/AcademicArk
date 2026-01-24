import React, { useEffect, useRef } from "react";
import { RefreshCcw, PlayCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateProgress, fetchTodayPlan } from "../../REDUX/Slices/plannerSlice";

// ---------- helpers ----------
const isToday = (date) => {
  if (!date) return false;
  return new Date(date).toDateString() === new Date().toDateString();
};

export default function ProgressTracker({ progress }) {
  const dispatch = useDispatch();
  const activeRef = useRef(null);

  // auto scroll to active unit
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  const activeUnit = progress.find(p => p.status === "IN_PROGRESS");

  const handleAction = async (p) => {
    await dispatch(
      updateProgress({
        subject: p.subject,
        unit: p.unit,
        status: "IN_PROGRESS"
      })
    );
    dispatch(fetchTodayPlan());
  };

  // group by subject
  const grouped = progress.reduce((acc, p) => {
    if (!acc[p.subject]) acc[p.subject] = [];
    acc[p.subject].push(p);
    return acc;
  }, {});

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">

      {/* Smart Reminder */}
      {activeUnit && (
        <div
          className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 text-sm text-indigo-300 cursor-pointer hover:bg-indigo-500/15 transition"
          onClick={() =>
            activeRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        >
          🔔 You left <b>{activeUnit.subject} – Unit {activeUnit.unit}</b> midway. Continue now →
        </div>
      )}

      <h3 className="text-neutral-100 font-semibold">
        Your Study Progress
      </h3>

      {Object.entries(grouped).map(([subject, units]) => (
        <div key={subject} className="space-y-3">
          <h4 className="text-sm text-neutral-300 font-medium">
            {subject}
          </h4>

          <div className="space-y-2">
            {units
              .sort((a, b) => a.unit - b.unit)
              .map(p => {
                const studiedToday = isToday(p.lastStudiedAt);
                const isActive = p.status === "IN_PROGRESS";

                return (
                  <div
                    key={p._id}
                    ref={isActive ? activeRef : null}
                    className={`
                      flex items-center justify-between p-3 rounded-xl border
                      ${isActive
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-neutral-800 bg-neutral-800/40"}
                    `}
                  >
                    {/* LEFT */}
                    <div>
                      <p className="text-sm text-neutral-200">
                        Unit {p.unit}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {p.status.replace("_", " ")}
                        {studiedToday && " · Studied today"}
                      </p>
                    </div>

                    {/* RIGHT ACTION */}
                    {!studiedToday && (
                      <button
                        onClick={() => handleAction(p)}
                        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        {p.status === "COMPLETED" ? (
                          <>
                            <RefreshCcw className="w-3 h-3" />
                            Review
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3 h-3" />
                            Continue
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Weekly Heatmap */}
          <WeeklyHeatmap units={units} />
        </div>
      ))}
    </div>
  );
}

// ---------- Heatmap ----------
// ============================================
// WEEKLY HEATMAP COMPONENT - FIXED
// ============================================

function WeeklyHeatmap({ units }) {
  const labels = ["S", "M", "T", "W", "T", "F", "S"];

  // Get today's day of week (0 = Sunday, 6 = Saturday)
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Calculate days for the week (Sunday to Saturday)
  // We need to go back to the start of the week (Sunday)
  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    // Set to the start of the week (Sunday) and add the day offset
    d.setDate(d.getDate() - dayOfWeek + i);
    return d.toDateString();
  });

  // Get all days when user studied
  const studiedDays = new Set(
    units
      .filter(u => u.lastStudiedAt)
      .map(u => new Date(u.lastStudiedAt).toDateString())
  );

  // Determine the intensity of the heatmap color based on activity
  const getActivityColor = (dayString) => {
    if (!studiedDays.has(dayString)) {
      return 'bg-neutral-800/40 border border-neutral-700/30';
    }

    // Count how many units were studied on this day
    const activitiesOnDay = units.filter(
      u => u.lastStudiedAt && new Date(u.lastStudiedAt).toDateString() === dayString
    ).length;

    // Color intensity based on number of activities
    if (activitiesOnDay >= 5) {
      return 'bg-indigo-600  ';
    } else if (activitiesOnDay >= 3) {
      return 'bg-indigo-500 border ';
    } else if (activitiesOnDay >= 1) {
      return 'bg-indigo-400 border ';
    }
    return 'bg-neutral-800/40 border ';
  };

  // Check if day is today
  const isToday = (dayString) => dayString === today.toDateString();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-neutral-300">This Week's Activity</h4>
        <span className="text-xs text-neutral-500">
          {studiedDays.size} days active
        </span>
      </div>

      <div className="flex items-center gap-1.5 p-3 bg-neutral-800/30 rounded-lg border border-neutral-700/30">
        {daysOfWeek.map((day, i) => {
          const hasActivity = studiedDays.has(day);
          const today_check = isToday(day);

          return (
            <div key={day} className="flex flex-col items-center gap-1">
              {/* Heatmap Box */}
              <div
                className={`w-5 h-5 rounded-md transition-all duration-200 cursor-default hover:scale-110 ${getActivityColor(
                  day
                )} ${today_check ? '' : ''}`}
                title={`${labels[i]}, ${day} - ${hasActivity ? 'Studied' : 'Not studied'}`}
              />
              {/* Day Label */}
              <span
                className={`text-[11px] font-medium ${
                  today_check ? 'text-indigo-400' : 'text-neutral-500'
                }`}
              >
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs text-neutral-500 px-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-neutral-800/40 border border-neutral-700/30"></div>
          <span>No activity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-indigo-400"></div>
          <span>1-2 units</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-indigo-500"></div>
          <span>3-4 units</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-indigo-600"></div>
          <span>5+ units</span>
        </div>
      </div>
    </div>
  );
}

