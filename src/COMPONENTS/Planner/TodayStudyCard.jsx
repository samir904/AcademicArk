// src/COMPONENTS/Planner/TodayStudyCard.jsx

import { Check, ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateProgress } from "../../REDUX/Slices/plannerSlice";
import { useState } from "react";

export default function TodayStudyCard() {
  const dispatch = useDispatch();
  const { todayPlan, ui, loading } = useSelector((state) => state.planner);
  const { tasks } = todayPlan;
  const [completingId, setCompletingId] = useState(null);

  if (!tasks || tasks.length === 0) return null;

  const handleMarkComplete = async (task) => {
    setCompletingId(task._id);
    try {
      await dispatch(
        updateProgress({
          subject: task.subject,
          unit: task.unit,
          status: "COMPLETED"
        })
      ).unwrap();
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-4">
        Today's Tasks
      </h3>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={`${task.subject}-${task.unit}`}
            className={`bg-neutral-900 border rounded-xl p-4 transition-all ${
              ui.activeTask?.subject === task.subject &&
              ui.activeTask?.unit === task.unit
                ? "border-indigo-500 bg-indigo-500/5"
                : "border-neutral-800 hover:border-neutral-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-neutral-100 font-medium truncate">
                  {task.subject}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Unit {task.unit} • {task.timeAllocated} min
                </p>
              </div>

              <button
                onClick={() => handleMarkComplete(task)}
                disabled={completingId === task._id || loading.updating}
                className="ml-4 flex-shrink-0 p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Mark as complete"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-neutral-600 mt-4">
        {tasks.length} task{tasks.length !== 1 ? "s" : ""} • {todayPlan.totalMinutes} minutes
      </p>
    </div>
  );
}
