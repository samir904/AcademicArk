import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveMetric } from '../../../REDUX/Slices/retention.slice';
import RetentionFunnel from './RetentionFunnel';
import RetentionStatus from './RetentionStatus';
import EngagementMetrics from './EngagementMetrics';
import ChurnRiskUsers from './ChurnRiskUsers';

const RetentionTab = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('funnel');

  const tabs = [
    { id: 'funnel', label: 'Retention Funnel', icon: '' },
    { id: 'status', label: 'User Status', icon: '' },
    { id: 'engagement', label: 'Engagement', icon: '' },
    { id: 'churn', label: 'Churn Risk', icon: '' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    dispatch(setActiveMetric(tabId));
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-white/10 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-96">
        {activeTab === 'funnel' && <RetentionFunnel />}
        {activeTab === 'status' && <RetentionStatus />}
        {activeTab === 'engagement' && <EngagementMetrics />}
        {activeTab === 'churn' && <ChurnRiskUsers />}
      </div>
    </div>
  );
};

export default RetentionTab;
