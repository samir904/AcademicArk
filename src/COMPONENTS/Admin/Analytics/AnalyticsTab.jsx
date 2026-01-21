import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab, setSelectedRange } from "../../../REDUX/Slices/adminAnalyticsSlice";
import OverviewTab from "./tabs/OverviewTab";
import SessionsTab from "./tabs/SessionsTab";
import PagesTab from "./tabs/PagesTab";
import NotesTab from "./tabs/NotesTab";
import FunnelTab from "./tabs/FunnelTab";
import CTRTab from "./tabs/CTRTab";
import DevicesTab from "./tabs/DevicesTab";
import AcquisitionTab from './tabs/AcquisitionTab'


const AdminAnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { activeTab, selectedRange } = useSelector((state) => state.adminAnalytics);

  const tabs = [
    {
      id: "overview",
      label: "📊 Overview",
      description: "Platform health metrics"
    },
    {
      id: "sessions",
      label: "👥 Sessions",
      description: "User sessions & retention"
    },
    {
      id: "pages",
      label: "📄 Pages",
      description: "Page engagement analytics"
    },
    {
      id: "notes",
      label: "📚 Notes",
      description: "Study material performance"
    },
    {
      id: "funnel",
      label: "🔻 Funnel",
      description: "Conversion funnel analysis"
    },
    {
      id: "ctr",
      label: "📈 CTR & Engagement",
      description: "Click-through rates"
    },
    {
      id: "devices",
      label: "🖥️ Devices",
      description: "Device & browser breakdown"
    },
    { id: "acquisition", label: "Acquisition", component: AcquisitionTab }, // ADD THIS LINE
  ];

  const timeRanges = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
    { value: "365", label: "Last 365 days" }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "sessions":
        return <SessionsTab />;
      case "pages":
        return <PagesTab />;
      case "notes":
        return <NotesTab />;
      case "funnel":
        return <FunnelTab />;
      case "ctr":
        return <CTRTab />;
      case "devices":
        return <DevicesTab />;
        case "acquisition":
        return <AcquisitionTab />;
      default:
        return <OverviewTab />;
    }
  };

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          📊 Admin Analytics
        </h1>
        <p className="text-gray-400">
          Comprehensive platform insights and performance metrics for AcademicArk
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-8 flex flex-wrap gap-3">
        <span className="text-gray-400 flex items-center">📅 Select Period:</span>
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => dispatch(setSelectedRange(range.value))}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRange === range.value
                ? "bg-blue-600 text-white border border-blue-400"
                : "bg-[#111111] text-gray-300 border border-gray-700 hover:bg-gray-700/50"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="bg-[#111111] backdrop-blur rounded-lg border border-gray-700/50 p-2">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => dispatch(setActiveTab(tab.id))}
                className={`px-3 py-2 rounded-lg transition-all text-sm font-medium truncate ${
                  activeTab === tab.id
                    ? "bg-blue-600/80 text-white border border-blue-400/50"
                    : "bg-[#111111] text-gray-300 border border-gray-600/30 hover:bg-gray-700/60"
                }`}
                title={tab.label}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Description */}
        {currentTab && (
          <div className="mt-3 text-sm text-gray-400">
            <span className="font-semibold">{currentTab.label}</span> •{" "}
            {currentTab.description}
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="bg-[#111111] backdrop-blur rounded-lg border border-gray-700/50 p-8">
        {renderTabContent()}
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>
          💡 All data is updated in real-time. Contact support for custom reports
          or data export.
        </p>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard