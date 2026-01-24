import React from "react";
import { CheckCircle, Clock, Circle, RotateCcw, Play } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateProgress } from "../../REDUX/Slices/plannerSlice";
import { useNavigate } from "react-router-dom";

export default function StudyProgressOverview({ progress }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!progress || progress.length === 0) return null;

  // Group by subject
  const subjectMap = {};
  progress.forEach(p => {
    if (!subjectMap[p.subject]) subjectMap[p.subject] = [];
    subjectMap[p.subject].push(p);
  });

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
      {/* Header */}
      <h3 className="text-neutral-100 font-semibold mb-1">
        Your Progress
      </h3>
      <p className="text-xs text-neutral-500 mb-6">
        Review or continue where you left off
      </p>

      <div className="space-y-6">
        {Object.entries(subjectMap).map(([subject, units]) => {
          const completed = units.filter(u => u.status === "COMPLETED").length;
          const total = Math.max(...units.map(u => u.unit));

          return (
            <div key={subject}>
              {/* Subject Header */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-200 font-medium">
                  {subject}
                </p>
                <p className="text-xs text-neutral-500">
                  {completed} / {total} units
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${(completed / total) * 100}%` }}
                />
              </div>

              {/* Unit Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {units
                  .sort((a, b) => a.unit - b.unit)
                  .map(unit => (
                    <UnitChip
                      key={unit._id}
                      unit={unit}
                      onContinue={() =>
                        navigate(`/planner?subject=${unit.subject}&unit=${unit.unit}`)
                      }
                      onReview={async () => {
                        await dispatch(
                          updateProgress({
                            subject: unit.subject,
                            unit: unit.unit,
                            status: "IN_PROGRESS"
                          })
                        );
                        navigate(`/planner?subject=${unit.subject}&unit=${unit.unit}`);
                      }}
                    />
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===============================
   UNIT CHIP
================================ */
function UnitChip({ unit, onContinue, onReview }) {
  let icon;
  let accent = "text-neutral-500";

  if (unit.status === "COMPLETED") {
    icon = <CheckCircle className="w-4 h-4" />;
    accent = "text-neutral-300";
  } else if (unit.status === "IN_PROGRESS") {
    icon = <Clock className="w-4 h-4" />;
    accent = "text-indigo-400";
  } else {
    icon = <Circle className="w-4 h-4" />;
  }

  return (
    <div
      className="
        flex items-center justify-between
        bg-neutral-800
        border border-neutral-700
        rounded-lg
        px-3 py-2
        text-xs
        hover:bg-neutral-800/70
        transition
      "
    >
      {/* Left */}
      <div className="flex items-center gap-2">
        {icon}
        <span className={accent}>Unit {unit.unit}</span>
      </div>

      {/* Right Action */}
      {unit.status === "IN_PROGRESS" && (
        <button
          onClick={onContinue}
          className="text-indigo-400 hover:text-indigo-300 transition"
          title="Continue"
        >
          <Play className="w-3.5 h-3.5" />
        </button>
      )}

      {unit.status === "COMPLETED" && (
        <button
          onClick={onReview}
          className="text-neutral-400 hover:text-indigo-400 transition"
          title="Review"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}