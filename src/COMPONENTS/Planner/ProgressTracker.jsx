import React, { useEffect, useRef } from "react";
import { RefreshCcw, PlayCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateProgress, fetchTodayPlan } from "../../REDUX/Slices/plannerSlice";

const isToday = (date) => {
  if (!date) return false;
  return new Date(date).toDateString() === new Date().toDateString();
};

export default function ProgressTracker({ progress }) {
  const dispatch = useDispatch();
  const activeRef = useRef(null);

  // useEffect(() => {
  //   if (activeRef.current) {
  //     activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  //   }
  // }, []);

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

  const grouped = progress.reduce((acc, p) => {
    if (!acc[p.subject]) acc[p.subject] = [];
    acc[p.subject].push(p);
    return acc;
  }, {});

  return (
    <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl p-6 space-y-8">

      {/* Active Unit Reminder */}
      {activeUnit && (
        <div
          className="
            bg-[#1F1F1F] border border-[#2F2F2F]
            rounded-xl p-4 text-sm
            text-[#9CA3AF]
            cursor-pointer
            hover:bg-[#2F2F2F] transition-colors
          "
          onClick={() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth",
            });
          }}
        >
          <span className="text-base mr-2">🔔</span>
          You left <b className="text-white">{activeUnit.subject} – Unit {activeUnit.unit} </b>midway →
        </div>
      )}

      {/* Subjects & Units */}
      <div>
        <h3 className="text-white font-semibold text-base mb-6">
          Your Study Progress
        </h3>

        <div className="space-y-8">
          {Object.entries(grouped).map(([subject, units]) => (
            <div key={subject} className="space-y-3">
              <h4 className="text-[#9CA3AF] text-sm font-medium uppercase tracking-wide">
                {subject}
              </h4>

              <div className="space-y-2">
                {units.sort((a, b) => a.unit - b.unit).map(p => {
                  const studiedToday = isToday(p.lastStudiedAt);
                  const isActive = p.status === "IN_PROGRESS";

                  return (
                    <div
                      key={p._id}
                      ref={isActive ? activeRef : null}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border
                        transition-all duration-200
                        ${isActive
                          ? "border-[#9CA3AF] bg-[#9CA3AF]/10"
                          : "border-[#1F1F1F] bg-[#1F1F1F]/40 hover:bg-[#1F1F1F]/60"
                        }
                      `}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          Unit {p.unit}
                        </p>
                        <p className="text-xs text-[#4B5563] mt-1">
                          {p.status.replace("_", " ")}
                          {studiedToday && " · Studied today"}
                        </p>
                      </div>

                      {!studiedToday && (
                        <button
                          onClick={() => handleAction(p)}
                          className="
                            flex items-center gap-1.5
                            text-xs font-medium
                            text-[#9CA3AF]
                            hover:text-white
                            transition-colors
                          "
                        >
                          {p.status === "COMPLETED" ? (
                            <>
                              <RefreshCcw className="w-3 h-3" />
                              Review
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-3 h-3" />
                              Start
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap - ONLY ONCE */}
      <WeeklyHeatmap units={progress} />
    </div>
  );
}

// Minimal Weekly Heatmap
function WeeklyHeatmap({ units }) {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  const dayOfWeek = today.getDay();

  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - dayOfWeek + i);
    return d.toDateString();
  });

  const studiedDays = new Set(
    units
      .filter(u => u.lastStudiedAt)
      .map(u => new Date(u.lastStudiedAt).toDateString())
  );

  const getActivityCount = (dayString) => {
    return units.filter(
      u => u.lastStudiedAt && new Date(u.lastStudiedAt).toDateString() === dayString
    ).length;
  };

  const getActivityColor = (dayString) => {
    const count = getActivityCount(dayString);
    if (count === 0) return 'bg-[#1F1F1F] border border-[#2F2F2F]';
    if (count >= 5) return 'bg-[#9CA3AF]';
    if (count >= 3) return 'bg-[#9CA3AF]/70';
    return 'bg-[#9CA3AF]/40';
  };

  const isToday_check = (dayString) => dayString === today.toDateString();

  return (
    <div className="space-y-3 pt-4 border-t border-[#1F1F1F]">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">This Week's Activity</h4>
        <span className="text-xs text-[#4B5563]">{studiedDays.size} active</span>
      </div>

      <div className="flex items-end gap-1.5">
        {daysOfWeek.map((day, i) => {
          const count = getActivityCount(day);
          const isToday_flag = isToday_check(day);

          return (
            <div key={day} className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-7 h-7 rounded-md transition-all duration-200 cursor-default
                  hover:scale-110 hover:shadow-lg hover:shadow-[#9CA3AF]/20
                  ${getActivityColor(day)}
                  ${isToday_flag ? 'ring-2 ring-[#9CA3AF] ring-offset-1 ring-offset-[#0F0F0F]' : ''}
                `}
                title={`${labels[i]} - ${count > 0 ? `${count} units` : 'No activity'}`}
              />
              <span
                className={`text-[10px] font-semibold ${isToday_flag ? 'text-[#9CA3AF]' : 'text-[#4B5563]'
                  }`}
              >
                {labels[i].slice(0, 1)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-[#4B5563] pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#1F1F1F] border border-[#2F2F2F]"></div>
          <span>No activity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#9CA3AF]/40"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#9CA3AF]/70"></div>
          <span>High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#9CA3AF]"></div>
          <span>Very High</span>
        </div>
      </div>
    </div>
  );
}
