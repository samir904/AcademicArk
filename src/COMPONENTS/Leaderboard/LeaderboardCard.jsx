import React from 'react';
import { TrendingUp, TrendingDown,Minus } from 'lucide-react';

const LeaderboardCard = ({ entry, isTopThree = false }) => {
  const engagementPoints = entry.metrics.engagement || 0;
  const displayName = entry.userName || entry.noteTitle;
  // Get trend indicator - minimal
  const getTrendIcon = (trend, value) => {
    if (trend === 'UP') {
      return (
        <span className="text-xs text-[#B3B3B3]">
          <TrendingUp className="w-3 h-3 inline mr-1 text-[#9CA3AF]" />
          +{value}%
        </span>
      );
    }
    if (trend === 'DOWN') {
      return (
        <span className="text-xs text-[#B3B3B3]">
          <TrendingDown className="w-3 h-3 inline mr-1 text-[#9CA3AF]" />
          -{value}%
        </span>
      );
    }
    return <span className="text-xs text-[#B3B3B3]"><Minus/></span>;
  };

  if (isTopThree) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1F1F1F] hover:bg-[#141414] transition-colors cursor-pointer">
      {/* Rank */}
      <div className="w-8 text-center">
        <span className="text-sm font-semibold text-[#B3B3B3]">#{entry.rank}</span>
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#1F1F1F]">
        {entry.userAvatar?.startsWith('http') ? (
          <img
            src={entry.userAvatar}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#1F1F1F] text-white text-xs font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name & Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium capitalize text-white truncate">{displayName}</h4>
        {/* <p className="text-xs text-[#B3B3B3] truncate">{entry.userEmail}</p> */}
      </div>

      {/* Metrics */}
      {/* <div className="flex gap-4 text-xs text-[#B3B3B3] flex-shrink-0">
        {entry.metrics.views !== undefined && (
          <span>{entry.metrics.views.toLocaleString()} views</span>
        )}
        {entry.metrics.downloads !== undefined && (
          <span>{entry.metrics.downloads.toLocaleString()} downloads</span>
        )}
      </div> */}

      {/* Engagement Points */}
      {/* <div className="text-right flex-shrink-0 w-20">
        <p className="text-base font-semibold text-white">
          {engagementPoints.toLocaleString()}
        </p>
        <p className="text-xs text-[#B3B3B3]">points</p>
      </div> */}

      {/* Trend */}
      <div className="w-20 text-right flex-shrink-0">
        {getTrendIcon(entry.trend, entry.trendValue)}
      </div>
    </div>
  );
};

export default LeaderboardCard;
