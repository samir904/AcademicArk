import React from 'react';
import { Eye, Download, BookOpen, Users } from 'lucide-react';

const tabs = [
  { id: 'TOP_STUDENTS', label: 'Top Students', icon: Users },
  { id: 'MOST_VIEWED_NOTES', label: 'Most Viewed', icon: Eye },
  { id: 'MOST_DOWNLOADED_NOTES', label: 'Most Downloaded', icon: Download },
  { id: 'TOP_CONTRIBUTORS', label: 'Top Teachers', icon: BookOpen },
];

const LeaderboardTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-0 overflow-x-auto pb-0 border-b border-[#1F1F1F]">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'text-white border-b-2 border-[#9CA3AF]'
                : 'text-[#B3B3B3] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default LeaderboardTabs;
