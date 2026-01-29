import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFailedSearches,
  fetchFailedSearchActions,
  fetchTopSearchQueries,
  fetchSearchCorrections
} from "../../../REDUX/Slices/searchAdminAnalyticsSlice";

import {
  SearchX,
  MousePointerClick,
  TrendingUp,
  Wrench,
  Loader2,
  AlertTriangle
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-[#0F0F0F] border border-white/10 rounded-xl p-4 flex items-center gap-4">
    <div className="p-3 rounded-lg bg-white/10">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-[#0F0F0F] border border-white/10 rounded-xl p-5">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-gray-300" />
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const SearchMetricsDashboard = () => {
  const dispatch = useDispatch();

  const {
    loading,
    error,
    failedSearches,
    failedSearchActions,
    topSearches,
    corrections
  } = useSelector((state) => state.searchAdminAnalytics);

  useEffect(() => {
    dispatch(fetchFailedSearches());
    dispatch(fetchFailedSearchActions());
    dispatch(fetchTopSearchQueries());
    dispatch(fetchSearchCorrections());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm">
        <AlertTriangle className="w-4 h-4" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🔍 Search Metrics
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Understand search failures, recovery behavior, and improvement opportunities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={SearchX}
          label="Failed Searches"
          value={failedSearches.length}
        />
        <StatCard
          icon={MousePointerClick}
          label="Post-Failure Actions"
          value={failedSearchActions.reduce((a, b) => a + b.count, 0)}
        />
        <StatCard
          icon={TrendingUp}
          label="Tracked Queries"
          value={topSearches.length}
        />
        <StatCard
          icon={Wrench}
          label="Corrections"
          value={corrections.length}
        />
      </div>

      {/* Failed Searches */}
      <Section title="❌ Failed Searches" icon={SearchX}>
        {failedSearches.length === 0 ? (
          <p className="text-xs text-gray-500">No failed searches 🎉</p>
        ) : (
          <div className="space-y-2">
            {failedSearches.map((item) => (
              <div
                key={item._id}
                className="flex justify-between text-sm text-gray-300"
              >
                <span className="truncate">{item.rawQuery}</span>
                <span className="text-gray-500">{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Failed Search Actions */}
      <Section title="🔁 User Actions After Failure" icon={MousePointerClick}>
        {failedSearchActions.length === 0 ? (
          <p className="text-xs text-gray-500">No actions recorded</p>
        ) : (
          <div className="space-y-2">
            {failedSearchActions.map((a) => (
              <div
                key={a._id}
                className="flex justify-between text-sm text-gray-300"
              >
                <span className="capitalize">{a._id.replace("_", " ")}</span>
                <span className="text-gray-500">{a.count}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Top Searches */}
      <Section title="🔥 Top Search Queries" icon={TrendingUp}>
        {topSearches.length === 0 ? (
          <p className="text-xs text-gray-500">No data yet</p>
        ) : (
          <div className="space-y-2">
            {topSearches.map((q) => (
              <div
                key={q._id}
                className="flex justify-between text-sm text-gray-300"
              >
                <span className="truncate">{q.rawQuery}</span>
                <span className="text-gray-500">
                  {q.totalSearches} searches
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Corrections */}
      <Section title="🧠 Search Corrections" icon={Wrench}>
        {corrections.length === 0 ? (
          <p className="text-xs text-gray-500">No corrections added</p>
        ) : (
          <div className="space-y-2">
            {corrections.map((c) => (
              <div
                key={c._id}
                className="flex justify-between text-sm text-gray-300"
              >
                <span>
                  <span className="line-through text-gray-500">
                    {c.wrongQuery}
                  </span>{" "}
                  →{" "}
                  <span className="text-white">{c.correctQuery}</span>
                </span>
                <span className="text-gray-500">{c.frequency}</span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default SearchMetricsDashboard;
