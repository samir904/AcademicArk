import { IndianRupee, Users, TrendingUp } from "lucide-react";

export default function PaymentStatsCards({ summary,loading  }) {
    if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => (
          <div
            key={i}
            className="h-28 rounded-xl bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }
  if (!summary) return null;

  const paidUsers =
    summary.statusBreakdown?.find(s => s._id === "SUCCESS")?.count || 0;

  const popularPlan =
    summary.planBreakdown?.reduce((top, p) =>
      !top || p.purchases > top.purchases ? p : top
    , null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* TOTAL REVENUE */}
      <StatCard
        title="Total Revenue"
        value={`₹${summary.totalRevenue}`}
        icon={<IndianRupee />}
        accent="emerald"
      />

      {/* PAID USERS */}
      <StatCard
        title="Paid Users"
        value={paidUsers}
        icon={<Users />}
        accent="indigo"
      />

      {/* POPULAR PLAN */}
      <StatCard
        title="Most Popular Plan"
        value={popularPlan ? popularPlan._id : "—"}
        subValue={
          popularPlan ? `${popularPlan.purchases} purchases` : null
        }
        icon={<TrendingUp />}
        accent="amber"
      />
    </div>
  );
}

/* =========================
   SMALL CARD COMPONENT
========================= */
function StatCard({ title, value, subValue, icon, accent }) {
  const accentMap = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20"
  };

  return (
    <div
      className={`
        p-4 rounded-xl border
        bg-[#0F0F0F]
        ${accentMap[accent]}
      `}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 font-medium">
          {title}
        </p>
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xl font-bold text-white">
          {value}
        </p>
        {subValue && (
          <p className="text-xs text-gray-400 mt-1">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
