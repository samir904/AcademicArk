import React, { useState } from 'react';
import RequestLogsDisplay from './RequestLogsDisplay';
import ConsoleLogsDisplay from './ConsoleLogsDisplay';
import LogsStatsDisplay from './LogsStatsDisplay';

export default function LogsTab() {
  const [activeSubTab, setActiveSubTab] = useState('requests');

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        {['requests', 'console', 'stats'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 font-semibold transition ${
              activeSubTab === tab
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'requests' && 'Request Logs'}
            {tab === 'console' && 'Console Logs'}
            {tab === 'stats' && 'Statistics'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeSubTab === 'requests' && <RequestLogsDisplay />}
        {activeSubTab === 'console' && <ConsoleLogsDisplay />}
        {activeSubTab === 'stats' && <LogsStatsDisplay />}
      </div>
    </div>
  );
}
