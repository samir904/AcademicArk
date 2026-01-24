// ============================================
// PROGRESS SNAPSHOT — FINAL POLISHED VERSION
// ============================================
import React, { useEffect, useState } from "react";
import {
  Flame,
  Clock,
  TrendingUp,
  Target,
  Award
} from "lucide-react";

export default function ProgressSnapshot({ stats }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!stats) return null;

  const {
    totalUnitsStarted,
    totalUnitsCompleted,
    streak,
    lifetime
  } = stats;

  // ✅ Completion %
  const completionPercent =
    totalUnitsStarted > 0
      ? Math.round((totalUnitsCompleted / totalUnitsStarted) * 100)
      : 0;

  // ✅ Time formatting
  const totalMinutes = lifetime?.totalStudyTimeMinutes || 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // ✅ Achievement level
  const getLevel = () => {
    if (completionPercent === 100) return "Master";
    if (completionPercent >= 80) return "Expert";
    if (completionPercent >= 60) return "Advanced";
    if (completionPercent >= 40) return "Intermediate";
    return "Beginner";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* ===================== COMPLETION ===================== */}
      <StatCard
        icon={<Target />}
        title="Completion"
        value={`${completionPercent}%`}
        sub={`${totalUnitsCompleted} of ${totalUnitsStarted} units`}
        highlight={completionPercent >= 75}
        footer={getLevel()}
      />

      {/* ===================== STREAK ===================== */}
      <StatCard
        icon={<Flame />}
        title="Study Streak"
        value={`${streak?.current || 0}`}
        unit="days"
        sub={
          streak?.current >= 7
            ? "🔥 Consistency unlocked"
            : "Keep the chain alive"
        }
        highlight={streak?.current >= 3}
        footer={
          streak?.current >= 30 ? "Legend" : "Active"
        }
      />

      {/* ===================== TIME ===================== */}
      <StatCard
        icon={<Clock />}
        title="Total Study Time"
        value={`${hours}`}
        unit="hrs"
        sub={`${minutes} min • ${totalMinutes} min total`}
        highlight={totalMinutes >= 600}
        footer={totalMinutes >= 1000 ? "Dedicated" : "Growing"}
      />
    </div>
  );
}

/* ====================================================== */
/* ===================== CARD =========================== */
/* ====================================================== */

function StatCard({
  icon,
  title,
  value,
  unit,
  sub,
  highlight,
  footer
}) {
  return (
    <div
      className={`relative bg-neutral-900 border rounded-2xl p-6 transition-all ${
        highlight
          ? "border-indigo-500/40 bg-indigo-500/5"
          : "border-neutral-800"
      }`}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
          highlight
            ? "bg-indigo-500/20 text-indigo-400"
            : "bg-neutral-800 text-neutral-400"
        }`}
      >
        {icon}
      </div>

      {/* Title */}
      <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
        {title}
      </p>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-neutral-100">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-neutral-500">
            {unit}
          </span>
        )}
      </div>

      {/* Subtext */}
      <p className="text-xs text-neutral-500 mt-1">
        {sub}
      </p>

      {/* Footer badge */}
      {footer && (
        <div className="mt-4 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300">
          <Award className="w-3 h-3" />
          {footer}
        </div>
      )}
    </div>
  );
}