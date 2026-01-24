import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LeaderboardSection({ leaderboard }) {
  if (!leaderboard || !leaderboard.hasData || !leaderboard.topEntries || leaderboard.topEntries.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h2 className="text-lg font-semibold text-white">Top Performers</h2>
      </div>

      <div className="space-y-2">
        {leaderboard.topEntries?.slice(0, 5).map((user) => (
          <div 
            key={`${user.name}-${user.rank}`}
            className="flex items-center justify-between bg-[#0F0F0F] border border-[#1F1F1F] rounded-lg px-4 py-3  transition-all"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="font-bold text-yellow-400 w-6 text-center">#{user.rank}</span>
              <span className="text-white font-medium truncate capitalize">{user.name}</span>
            </div>
            <span className="text-[#9CA3AF] text-sm font-medium ml-2 flex-shrink-0">{user.score}</span>
          </div>
        ))}
      </div>

      <Link to="/leaderboard" className="inline-block mt-4 text-[#9CA3AF] hover:text-white text-sm font-medium transition">
        View full →
      </Link>
    </div>
  );
}
