import React from 'react';
import { Award, TrendingUp, TrendingDown,Minus } from 'lucide-react';

const TopThreeRing = ({ entry, rank }) => {
  // Ring colors for top 3
  const ringColors = {
    1: {
      bg: 'from-yellow-500 to-yellow-600',
      glow: 'shadow-yellow-500/50',
      medal: <Award className="w-6 h-6 text-yellow-500" />
    },
    2: {
      bg: 'from-gray-400 to-gray-500',
      glow: 'shadow-gray-400/50',
      medal: <Award className="w-6 h-6 text-gray-400" />
    },
    3: {
      bg: 'from-orange-500 to-orange-600',
      glow: 'shadow-orange-500/50',
      medal: <Award className="w-6 h-6 text-orange-500" />
    }
  };

  const ringConfig = ringColors[rank] || ringColors;
  const engagementPoints = entry.metrics.engagement || 0;
  const displayName = entry.userName || entry.noteTitle;

  // Get trend icon
 const getTrendIcon = (trend) => {
  const base = "w-4 h-4";

  if (trend === "UP") {
    return <TrendingUp className={`${base} text-emerald-400`} />;
  }

  if (trend === "DOWN") {
    return <TrendingDown className={`${base} text-red-400`} />;
  }

  // STABLE
  return <Minus className={`${base} text-gray-400`} />;
};

  return (
    <div className="relative text-center">
      {/* Ring Badge */}
      <div
        className={`relative w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br ${ringConfig.bg} ${ringConfig.glow} shadow-2xl ring-4 ring-gray-800`}
      >
        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-700">
          {entry.userAvatar?.startsWith('http')  ? (
            <img
              src={entry.userAvatar}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white text-2xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Medal Icon */}
        <div className="absolute -top-2 -right-2 bg-gray-900 rounded-full p-2 border-2 border-gray-700">
          {ringConfig.medal}
        </div>

        {/* Rank Number */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white font-bold text-sm bg-gray-900 border-2 border-gray-700">
          #{rank}
        </div>
      </div>

      {/* User Info */}
      <h3 className="font-bold text-lg capitalize text-white truncate max-w-xs mx-auto mb-1">
        {displayName}
      </h3>
      {/* <p className="text-gray-400 text-sm truncate">{entry.userEmail}</p> */}

      {/* Engagement Points */}
      {/* <div className="mt-4 bg-[#1F1F1F] rounded-lg p-4 border border-gray-700 backdrop-blur">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Engagement Points</p>
        <p className="text-3xl font-bold text-blue-400 mt-1">
          {engagementPoints.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          👁️ {entry.metrics.views} • 📥 {entry.metrics.downloads}
        </p>
      </div> */}

     {entry.trend && (
  <div
    className="
      mt-3 inline-flex items-center gap-2
      px-3 py-1.5
      rounded-md
      border border-gray-700
      bg-gray-900
    "
  >
    {getTrendIcon(entry.trend)}

    {entry.trend !== "STABLE" ? (
      <span
        className={`text-xs font-medium ${
          entry.trend === "UP"
            ? "text-emerald-400"
            : "text-red-400"
        }`}
      >
        {entry.trend === "UP" ? "+" : "-"}
        {Math.abs(entry.trendValue)}%
      </span>
    ) : (
      <span className="text-xs text-gray-400">
        Stable
      </span>
    )}
  </div>
)}

    </div>
  );
};

export default TopThreeRing;
