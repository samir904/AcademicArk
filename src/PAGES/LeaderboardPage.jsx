import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard, setActiveTab } from '../REDUX/Slices/leaderboard.slice.js';
import TopThreeRing from '../COMPONENTS/Leaderboard/TopThreeRing.jsx';
import LeaderboardCard from '../COMPONENTS/Leaderboard/LeaderboardCard.jsx';
import LeaderboardTabs from '../COMPONENTS/Leaderboard/LeaderboardTabs.jsx';
import HomeLayout from '../LAYOUTS/Homelayout.jsx';
import {Trophy} from 'lucide-react'
const LeaderboardPage = () => {
  const dispatch = useDispatch();
  const { data, activeTab, loading, error } = useSelector(
    (state) => state.leaderboard
  );
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    dispatch(fetchLeaderboard({ type: activeTab, limit }));
  }, [activeTab, limit, dispatch]);

  const handleTabChange = (newTab) => {
    dispatch(setActiveTab(newTab));
  };

  const topThree = data.entries?.slice(0, 3) || [];
  const restEntries = data.entries?.slice(3) || [];

  return (
    <HomeLayout>
      {/* Minimal dark background */}
      <div className="min-h-screen bg-[#0B0B0B] py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Trophy className="w-10 h-10 text-yellow-400" />
              <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>
            <p className="text-gray-400">
              See who's leading based on engagement points
            </p>
            {data.generatedAt && (
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {new Date(data.generatedAt).toLocaleString()}
              </p>
            )}
          </div>


          {/* Tabs */}
          <div className="mb-8 bg-[#111111] border border-[#1F1F1F] rounded-lg overflow-hidden">
            <LeaderboardTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Loading State - Minimal */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 border-2 border-[#1F1F1F] border-t-[#9CA3AF] rounded-full animate-spin"></div>
              <p className="text-sm text-[#B3B3B3] mt-3">Loading rankings...</p>
            </div>
          )}

          {/* Error State - Minimal */}
          {error && (
            <div className="bg-[#111111] border border-[#1F1F1F] rounded-lg p-4">
              <p className="text-sm text-[#B3B3B3]">Unable to load rankings. Please try again.</p>
            </div>
          )}

          {/* Top 3 - Card Layout */}
          {!loading && topThree.length > 0 && (
            <div className="mb-12">
              <h2 className="text-base font-semibold text-white mb-4">Top Rankings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topThree.map((entry) => (
                  <TopThreeRing key={entry._id || entry.userId} entry={entry} rank={entry.rank} />
                ))}
              </div>
            </div>
          )}

          {/* Rest - Table Layout */}
          <div>
            {!loading && restEntries.length > 0 && (
              <>
                {/* Controls */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white">All Rankings</h2>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                    className="px-3 py-1 bg-[#111111] border border-[#1F1F1F] text-white text-xs rounded hover:border-[#9CA3AF] transition-colors cursor-pointer focus:outline-none focus:border-[#9CA3AF]"
                  >
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                    <option value={50}>Top 50</option>
                    <option value={100}>Top 100</option>
                  </select>
                </div>

                {/* Cards */}
                <div className="bg-[#111111] border border-[#1F1F1F] rounded-lg overflow-hidden">
                  {/* Header Row */}
                  <div className="hidden md:flex items-center gap-3 px-4 py-3 border-b border-[#1F1F1F] bg-[#0B0B0B]">
                    <div className="w-8 text-xs font-medium text-[#B3B3B3] text-center">Rank</div>
                    <div className="w-10"></div>
                    <div className="flex-1 text-xs font-medium text-[#B3B3B3]">User</div>
                    {/* <div className="flex gap-4 text-xs font-medium text-[#B3B3B3]">
                      <span>Metrics</span>
                    </div> */}
                    {/* <div className="w-20 text-xs font-medium text-[#B3B3B3] text-right">Points</div> */}
                    <div className="w-20 text-xs font-medium text-[#B3B3B3] text-right">Trend</div>
                  </div>

                  {/* Rows */}
                  {restEntries.map((entry) => (
                    <LeaderboardCard key={entry._id || entry.userId} entry={entry} />
                  ))}
                </div>
              </>
            )}

            {!loading && data.entries?.length === 0 && (
              <div className="text-center py-8 bg-[#111111] border border-[#1F1F1F] rounded-lg">
                <p className="text-sm text-[#B3B3B3]">No rankings available yet.</p>
              </div>
            )}
          </div>

          {/* Info Footer - Minimal */}
          {/* {data.dataQuality && (
            <div className="mt-8 text-center text-xs text-[#B3B3B3]">
              <p>
                {data.dataQuality.uniqueUsers} users • {data.dataQuality.totalActivities} activities
              </p>
            </div>
          )} */}
        </div>
      </div>
    </HomeLayout>
  );
};

export default LeaderboardPage;
