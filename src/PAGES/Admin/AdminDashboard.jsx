// src/PAGES/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDashboardStats,
  getAllUsers,
  getAllNotesAdmin,
  deleteUser,
  deleteNoteAdmin,
  updateUserRole,
  getRecentActivity,
  getServerMetrics,
  getSessionMetrics,
  getSessionHistory,
  getWeeklyComparison,
  getTrafficPattern,
  getAdminLogs,
} from "../../REDUX/Slices/adminSlice";
import { Link } from "react-router-dom";
import AdminLogs from "./AdminLogs";
// import Analytics from "./Analytics";
import AdminColleges from "./AdminColleges";
import { getAcademicAnalytics } from "../../REDUX/Slices/academicProfileSlice";
import AdminRequests from "./AdminRequests";
import AdminFeedback from "./AdminFeedback";
// import RetentionTab from "./RetentionTab";
import LoginLogsDisplay from "../../COMPONENTS/LoginLogsDisplay";
import LoginAnalytics from "../../COMPONENTS/LoginAnalytics";
import AdminSecurityDashboard from "../../COMPONENTS/AdminSecurityDashboard";
import LogsTab from "../../COMPONENTS/AdminDashboard/LogsTab/LogsTab";
import RetentionTab from "../../COMPONENTS/Admin/RetentionAnalytics/RetentionTab";
import MongoDBHealth from "../../COMPONENTS/Admin/MongoDBHealth";
import RedisHealth from "../../COMPONENTS/Admin/RedisHealth";
import QueryMetricsDisplay from "../../COMPONENTS/Admin/QueryMetricsDisplay";
// import AdminVideoManager from "../../COMPONENTS/Admin/AdminVideoManager";
import AnalyticsTab from "../../COMPONENTS/Admin/Analytics/AnalyticsTab";
import { AdminDashboardSkeleton } from "../../COMPONENTS/Skeletons";
import PageTransition from "../../COMPONENTS/PageTransition";
// Icons
const UsersIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
    />
  </svg>
);

const NotesIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
    />
  </svg>
);

const UserPlusIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const AcademicIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>);



export default function AdminDashboard() {
  const dispatch = useDispatch();
  const {
    loading,
    dashboardStats,
    users,
    notes,
    usersPagination,
    notesPagination,
    recentActivity,
    serverMetrics,
    sessionMetrics,
    sessionHistory,
    weeklyComparison,
    trafficPattern,
    adminLogs, // ✅ ADD THIS
    adminLogsPagination, // ✅ ADD THIS
  } = useSelector((state) => state.admin);
  // ✨ ADD THIS - Get analytics from academicProfileSlice
  const { analytics } = useSelector((state) => state.academicProfile);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userSearch, setUserSearch] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [notePage, setNotePage] = useState(1);

  const [autoRefresh, setAutoRefresh] = useState(true);

  // auto-refresh metrics every 5 seconds
  useEffect(() => {
    if (activeTab === "dashboard" && autoRefresh) {
      const interval = setInterval(() => {
        dispatch(getServerMetrics());
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [dispatch, activeTab, autoRefresh]);

  // Initial fetch
  useEffect(() => {
    if (activeTab === "dashboard") {
      dispatch(getServerMetrics());
    }
  }, [dispatch, activeTab]);

  // Auto-refresh session metrics every 10 seconds
  useEffect(() => {
    if (activeTab === "dashboard") {
      //what is this line meaning exapin me
      dispatch(getSessionMetrics());
      const interval = setInterval(() => {
        dispatch(getSessionMetrics());
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [dispatch, activeTab]);

  // Fetch historical data on mount
  useEffect(() => {
    if (activeTab === "dashboard") {
      dispatch(getSessionHistory(30));
      dispatch(getWeeklyComparison());
      dispatch(getTrafficPattern());
    }
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (activeTab === "dashboard") {
      dispatch(getDashboardStats());
      dispatch(getRecentActivity());
    } else if (activeTab === "analytics") {
      // Analytics component handles its own data fetching
    } else if (activeTab === "users") {
      dispatch(getAllUsers({ page: userPage, search: userSearch }));
    } else if (activeTab === "notes") {
      dispatch(getAllNotesAdmin({ page: notePage, search: noteSearch }));
    } else if (activeTab === "academic") {
      // ✨ NEW: Fetch academic data
      dispatch(getAcademicAnalytics())
    } else if (activeTab === "logs") {
      // ✅ ADD THIS
      dispatch(getAdminLogs({ days: 7, page: 1 })); // ✅ ADD THIS
    }
  }, [dispatch, activeTab, userPage, notePage, userSearch, noteSearch]);

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      dispatch(deleteNoteAdmin(noteId));
    }
  };

  const handleRoleUpdate = (userId, newRole) => {
    dispatch(updateUserRole({ userId, role: newRole }));
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div
      className={`${bgColor} backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-2`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor} ${color}`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );

  if (loading && !dashboardStats) {
    return (
      <>
        <AdminDashboardSkeleton/>
      </>
    );
  }
  // Inside AdminDashboard, before returning HomeLayout:
  if (activeTab === "dashboard" && !serverMetrics) {
    return (
      <>
        <AdminDashboardSkeleton/>
      </>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-blue-200 mt-2">
            Manage users, notes, and monitor platform activity
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900/50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8 overflow-x-auto">
              {["dashboard","session", "requestlogs", "querymetrics", "users", "loginLogs", "loginanalytics", "notes", "academic", "colleges", "logs", "requests", "feedback", "Security", "retention"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-2 border-b-2 transition-colors capitalize whitespace-nowrap ${activeTab === tab
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-white"
                      }`}
                  >
                    {tab === "logs"
                      ? "Admin Logs"
                      // : tab === "analytics"
                      //   ? "Analytics"
                      : tab === "academic"
                        ? "Academic Data"
                        : tab === "colleges"
                          ? "College Approvals"
                          : tab === 'requests'
                            ? 'notes requests'
                            : tab === "feedback"
                              ? "feedback"
                              : tab === "retention"
                                ? "retention"
                                : tab === "loginLogs"
                                  ? "User Logins"
                                  : tab === "loginanalytics"
                                    ? "Logins analytics"
                                    : tab === "Security"
                                      ? "Security"
                                      : tab === "requestlogs"
                                        ? "Request Logs"
                                        : tab === "querymetrics"
                                          ? "Query Metrics"
                                          : tab === "session"
                                          ? "Sesion Analytics"
                                          // : tab === "videos"
                                          // ? "videos"
                                          : tab}

                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && dashboardStats && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={UsersIcon}
                  title="Total Users"
                  value={dashboardStats.totalUsers}
                  color="text-blue-400"
                  bgColor="bg-blue-900/20"
                />
                <StatCard
                  icon={NotesIcon}
                  title="Total Notes"
                  value={dashboardStats.totalNotes}
                  color="text-green-400"
                  bgColor="bg-green-900/20"
                />
                {/* ✅ ADD THIS - Total Views Card */}
                <StatCard
                  icon={EyeIcon}
                  title="Total Views"
                  value={dashboardStats.totalViews}
                  color="text-cyan-400"
                  bgColor="bg-cyan-900/20"
                />
                <StatCard
                  icon={DownloadIcon}
                  title="Total Downloads"
                  value={dashboardStats.totalDownloads}
                  color="text-purple-400"
                  bgColor="bg-purple-900/20"
                />
                <StatCard
                  icon={UserPlusIcon}
                  title="New Users (30 days)"
                  value={dashboardStats.recentUsers}
                  color="text-yellow-400"
                  bgColor="bg-yellow-900/20"
                />
              </div>

              {/* Server Health Section */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">
                    Server Health
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`px-3 py-1 rounded-lg text-sm ${autoRefresh
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-700 text-gray-400"
                        }`}
                    >
                      {autoRefresh ? "● Live" : "○ Paused"}
                    </button>
                    <button
                      onClick={() => dispatch(getServerMetrics())}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* CPU Usage */}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-2">CPU Usage</div>
                    <div className="flex items-end space-x-2">
                      <span className="text-3xl font-bold text-blue-400">
                        {serverMetrics.cpu.usage ?? "--"}%
                      </span>
                      <span className="text-gray-500 text-sm mb-1">
                        {serverMetrics.cpu.cores ?? "--"} cores
                      </span>
                    </div>
                    <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${parseFloat(serverMetrics.cpu.usage ?? "--") > 80
                          ? "bg-red-500"
                          : parseFloat(serverMetrics.cpu.usage ?? "--") > 50
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          }`}
                        style={{ width: `${serverMetrics.cpu.usage ?? "--"}%` }}
                      />
                    </div>
                  </div>

                  {/* Memory Usage */}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-2">
                      Memory Usage
                    </div>
                    <div className="flex items-end space-x-2">
                      <span className="text-3xl font-bold text-purple-400">
                        {serverMetrics.memory.percentage ?? "--"}%
                      </span>
                      <span className="text-gray-500 text-sm mb-1">
                        {serverMetrics.memory.used}/
                        {serverMetrics.memory.total ?? "--"} GB
                      </span>
                    </div>
                    <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${parseFloat(serverMetrics.memory.percentage ?? "--") >
                          80
                          ? "bg-red-500"
                          : parseFloat(
                            serverMetrics.memory.percentage ?? "--"
                          ) > 50
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          }`}
                        style={{
                          width: `${serverMetrics.memory.percentage ?? "--"}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Avg Response Time */}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-2">
                      Avg Response Time
                    </div>
                    <div className="flex items-end space-x-2">
                      <span className="text-3xl font-bold text-green-400">
                        {serverMetrics.requests.avgResponseTime ?? "--"}
                      </span>
                      <span className="text-gray-500 text-sm mb-1">ms</span>
                    </div>
                    <div className="text-gray-500 text-xs mt-2">
                      {serverMetrics.requests.total ?? "--"} total requests
                    </div>
                  </div>

                  {/* Uptime */}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-2">
                      Server Uptime
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {serverMetrics.uptime.hours ?? "--"}h{" "}
                      {serverMetrics.uptime.minutes ?? "--"}m
                    </div>
                    <div className="text-gray-500 text-xs mt-2">
                      {serverMetrics.errors.total ?? "--"} errors logged
                    </div>
                  </div>
                </div>

                {/* System Info */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
                  <div>
                    <span className="text-gray-400 text-sm">Platform:</span>
                    <span className="text-white ml-2 font-medium">
                      {serverMetrics.system.platform ?? "--"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Node Version:</span>
                    <span className="text-white ml-2 font-medium">
                      {serverMetrics.system.nodeVersion ?? "--"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Hostname:</span>
                    <span className="text-white ml-2 font-medium">
                      {serverMetrics.system.hostname ?? "--"}
                    </span>
                  </div>
                </div>
              </div>
              {/* MongoDB Database Health Section */}
              <MongoDBHealth autoRefresh={autoRefresh} />
              {/* Redis Cache Health Section */}
              <RedisHealth autoRefresh={autoRefresh} />


              {/* Recent Errors */}
              {serverMetrics.errors.recent.length > 0 && (
                <div className="bg-gradient-to-br from-red-900/20 to-gray-800/30 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-red-400 mb-4">
                    Recent Errors ({serverMetrics.errors.total})
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {serverMetrics.errors.recent.map((error, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-red-400 font-medium">
                              {error.message}
                            </div>
                            <div className="text-gray-500 text-xs mt-1">
                              {new Date(error.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {error.stack && (
                          <details className="mt-2">
                            <summary className="text-gray-400 text-xs cursor-pointer hover:text-white">
                              View Stack Trace
                            </summary>
                            <pre className="mt-2 text-xs text-gray-500 overflow-x-auto">
                              {error.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* // Add to Dashboard UI (after Server Health section) */}
              {activeTab === "dashboard" && sessionMetrics && (
                <>
                  {/* Session Metrics */}
                  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">
                      User Sessions
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Current Concurrent Users */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border-l-4 border-green-500">
                        <div className="text-gray-400 text-sm mb-2">
                          Active Users Now
                        </div>
                        <div className="text-4xl font-bold text-green-400 mb-2">
                          {sessionMetrics.currentConcurrent}
                        </div>
                        <div className="text-gray-500 text-xs">
                          Currently online
                        </div>
                      </div>

                      {/* Max Concurrent Users */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border-l-4 border-blue-500">
                        <div className="text-gray-400 text-sm mb-2">
                          Peak Users
                        </div>
                        <div className="text-4xl font-bold text-blue-400 mb-2">
                          {sessionMetrics.maxConcurrent}
                        </div>
                        <div className="text-gray-500 text-xs">
                          Maximum recorded
                        </div>
                      </div>

                      {/* Session Timeout */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border-l-4 border-purple-500">
                        <div className="text-gray-400 text-sm mb-2">
                          Session Timeout
                        </div>
                        <div className="text-4xl font-bold text-purple-400 mb-2">
                          {sessionMetrics.sessionTimeout}
                        </div>
                        <div className="text-gray-500 text-xs">
                          Minutes of inactivity
                        </div>
                      </div>
                    </div>

                    {/* Active Users List */}
                    {sessionMetrics.activeUserDetails?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-white font-semibold mb-4">
                          Currently Active Users
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                          {sessionMetrics.activeUserDetails.map((user) => (
                            <div
                              key={user._id}
                              className="bg-gray-800/50 rounded-lg p-3 flex items-center space-x-3"
                            >
                              {user.avatar?.secure_url ? (
                                <img
                                  src={user.avatar.secure_url}
                                  alt={user.fullName}
                                  className="w-10 h-10 rounded-full"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {user.fullName.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-medium truncate">
                                  {user.fullName}
                                </div>
                                <div className="text-gray-400 text-xs truncate">
                                  {user.email}
                                </div>
                              </div>
                              <div
                                className={`px-2 py-1 rounded text-xs font-medium ${user.role === "ADMIN"
                                  ? "bg-red-500/20 text-red-400"
                                  : user.role === "TEACHER"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-green-500/20 text-green-400"
                                  }`}
                              >
                                {user.role}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              {/* // Add this UI after User Sessions section */}
              {activeTab === "dashboard" && weeklyComparison && (
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Weekly Growth
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="text-gray-400 text-sm mb-2">
                        This Week Avg Peak
                      </div>
                      <div className="text-3xl font-bold text-blue-400">
                        {weeklyComparison.thisWeekAvg}
                      </div>
                      <div className="text-gray-500 text-xs mt-2">
                        users per day
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="text-gray-400 text-sm mb-2">
                        Last Week Avg Peak
                      </div>
                      <div className="text-3xl font-bold text-purple-400">
                        {weeklyComparison.lastWeekAvg}
                      </div>
                      <div className="text-gray-500 text-xs mt-2">
                        users per day
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="text-gray-400 text-sm mb-2">Growth</div>
                      <div
                        className={`text-3xl font-bold ${parseFloat(weeklyComparison.growth) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                          }`}
                      >
                        {weeklyComparison.growth > 0 ? "+" : ""}
                        {weeklyComparison.growth}%
                      </div>
                      <div className="text-gray-500 text-xs mt-2">
                        week-over-week
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "dashboard" && trafficPattern && (
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Traffic Pattern by Day of Week
                  </h3>

                  <div className="space-y-3">
                    {trafficPattern.map((day, index) => {
                      const maxPeak = Math.max(
                        ...trafficPattern.map((d) => d.avgPeak)
                      );
                      const percentage = (day.avgPeak / maxPeak) * 100;

                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <div className="w-24 text-gray-400 text-sm">
                            {day.day}
                          </div>
                          <div className="flex-1">
                            <div className="h-8 bg-gray-700 rounded-lg overflow-hidden relative">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center px-3 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              >
                                <span className="text-white text-sm font-semibold">
                                  {day.avgPeak} users
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-gray-500 text-xs w-20 text-right">
                            {day.dataPoints} days
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "dashboard" &&
                sessionHistory &&
                sessionHistory.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">
                      Last 30 Days Peak Users
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 text-gray-400">
                              Date
                            </th>
                            <th className="text-center py-3 text-gray-400">
                              Peak Users
                            </th>
                            <th className="text-center py-3 text-gray-400">
                              Avg Concurrent
                            </th>
                            <th className="text-center py-3 text-gray-400">
                              Peak Time
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessionHistory
                            .slice(-14)
                            .reverse()
                            .map((log, index) => (
                              <tr
                                key={index}
                                className="border-b border-white/5 hover:bg-white/5"
                              >
                                <td className="py-3 text-white">
                                  {new Date(log.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </td>
                                <td className="py-3 text-center text-blue-400 font-semibold">
                                  {log.maxConcurrent}
                                </td>
                                <td className="py-3 text-center text-gray-300">
                                  {log.avgConcurrent}
                                </td>
                                <td className="py-3 text-center text-gray-400 text-sm">
                                  {log.peakTime
                                    ? new Date(log.peakTime).toLocaleTimeString(
                                      "en-US",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )
                                    : "—"}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {recentActivity && (
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Recent Activity
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <div>
                      <h4 className="text-lg font-semibold text-blue-400 mb-3">
                        New Users (Last 7 days)
                      </h4>
                      {recentActivity.recentUsers &&
                        recentActivity.recentUsers.length > 0 ? (
                        <ul>
                          {recentActivity.recentUsers.map((u) => (
                            <li
                              key={u._id}
                              className="text-white py-1 flex justify-between border-b border-gray-700"
                            >
                              <span>{u.fullName}</span>
                              <span className="text-sm text-gray-400">
                                {new Date(u.createdAt).toLocaleDateString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-gray-500">
                          No new users in last week.
                        </div>
                      )}
                    </div>

                    {/* Recent Notes */}
                    <div>
                      <h4 className="text-lg font-semibold text-green-400 mb-3">
                        New Notes (Last 7 days)
                      </h4>
                      {recentActivity.recentNotes &&
                        recentActivity.recentNotes.length > 0 ? (
                        <ul>
                          {recentActivity.recentNotes.map((n) => (
                            <li
                              key={n._id}
                              className="text-white py-1 flex justify-between border-b border-gray-700"
                            >
                              <span>
                                {n.title}{" "}
                                <span className="text-xs text-gray-400">
                                  ({n.uploadedBy?.fullName || "Unknown"})
                                </span>
                              </span>
                              <span className="text-sm text-gray-400">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-gray-500">
                          No new notes in last week.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions Section - Add this after Stats Cards */}
              {activeTab === "dashboard" && (
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* 📧 Broadcast Email */}
                    {/* <Link
                                            to="/admin/broadcast-email"
                                            className="group p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:bg-purple-500/5 text-center"
                                        >
                                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📧</div>
                                            <div className="text-white font-medium">Broadcast Email</div>
                                            <div className="text-gray-400 text-sm">Send to all users</div>
                                        </Link> */}
                    {/* 📅 Email Campaigns */}
                    <Link
                      to="/admin/campaigns"
                      className="group p-4 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:bg-blue-500/5 text-center"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                        📅
                      </div>
                      <div className="text-white font-medium">Campaigns</div>
                      <div className="text-gray-400 text-sm">Scheduled</div>
                    </Link>
                    <Link
                      to="/admin/banners"
                      className="group p-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/5 text-center"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                        📢
                      </div>
                      <div className="text-white font-medium">
                        Manage Banners
                      </div>
                      <div className="text-gray-400 text-sm">
                        Create announcements
                      </div>
                    </Link>

                    {/* <Link
                to="/admin/users"
                className="group p-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/5 text-center"
            >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
                <div className="text-white font-medium">Manage Users</div>
                <div className="text-gray-400 text-sm">User administration</div>
            </Link>
             */}
                    {/* <Link
                to="/admin/notes"
                className="group p-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/5 text-center"
            >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📚</div>
                <div className="text-white font-medium">Manage Notes</div>
                <div className="text-gray-400 text-sm">Content moderation</div>
            </Link>
             */}
                    {/* <Link
                to="/admin/reports"
                className="group p-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/5 text-center"
            >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                <div className="text-white font-medium">View Reports</div>
                <div className="text-gray-400 text-sm">Analytics & insights</div>
            </Link> */}
                  </div>
                </div>
              )}

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Users by Role */}
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Users by Role
                  </h3>
                  <div className="space-y-4">
                    {dashboardStats.usersByRole?.map((role) => (
                      <div
                        key={role._id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-300 capitalize">
                          {role._id.toLowerCase()}
                        </span>
                        <span className="text-white font-semibold">
                          {role.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes by Category */}
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Notes by Category
                  </h3>
                  <div className="space-y-4">
                    {dashboardStats.notesByCategory?.map((category) => (
                      <div
                        key={category._id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-300">{category._id}</span>
                        <span className="text-white font-semibold">
                          {category.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Rated Notes */}
              {dashboardStats.topRatedNotes?.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Top Rated Notes
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 text-gray-400">
                            Title
                          </th>
                          <th className="text-left py-3 text-gray-400">
                            Author
                          </th>
                          <th className="text-center py-3 text-gray-400">
                            Rating
                          </th>
                          <th className="text-center py-3 text-gray-400">
                            Downloads
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardStats.topRatedNotes.map((note) => (
                          <tr
                            key={note._id}
                            className="border-b border-white/5"
                          >
                            <td className="py-3 text-white">{note.title}</td>
                            <td className="py-3 text-gray-300">
                              {note.uploadedBy.fullName}
                            </td>
                            <td className="py-3 text-center text-yellow-400">
                              {note.avgRating.toFixed(1)} ({note.ratingCount})
                            </td>
                            <td className="py-3 text-center text-gray-300">
                              {note.downloads}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Users Table */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="text-left py-4 px-6 text-gray-400">
                          User
                        </th>
                        <th className="text-left py-4 px-6 text-gray-400">
                          Email
                        </th>
                        <th className="text-center py-4 px-6 text-gray-400">
                          Role
                        </th>
                        <th className="text-center py-4 px-6 text-gray-400">
                          Joined
                        </th>
                        <th className="text-center py-4 px-6 text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          <td className="py-4 px-6">
                            <Link
                              to={`/profile/${user?._id}`}
                              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                            >
                              <div className="flex items-center space-x-3">
                                {user?.avatar?.secure_url?.startsWith(
                                  "http"
                                ) ? (
                                  <img
                                    src={user.avatar.secure_url}
                                    alt={user.fullName}
                                    loading="lazy"
                                    className="w-10 h-10 rounded-full"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {user.fullName.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <span className="text-white font-medium">
                                  {user.fullName}
                                </span>
                              </div>
                            </Link>
                          </td>
                          <td className="py-4 px-6 text-gray-300">
                            {user.email}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleUpdate(user._id, e.target.value)
                              }
                              className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm"
                            >
                              <option value="USER">User</option>
                              <option value="TEACHER">Teacher</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>
                          <td className="py-4 px-6 text-center text-gray-300">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {usersPagination && (
                  <div className="flex items-center justify-between px-6 py-4 bg-gray-800/50">
                    <span className="text-gray-400">
                      Showing {(usersPagination.currentPage - 1) * 10 + 1} to{" "}
                      {Math.min(
                        usersPagination.currentPage * 10,
                        usersPagination.totalUsers
                      )}{" "}
                      of {usersPagination.totalUsers} users
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setUserPage(Math.max(1, userPage - 1))}
                        disabled={userPage === 1}
                        className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600"
                      >
                        Previous
                      </button>
                      <span className="text-white">
                        Page {usersPagination.currentPage} of{" "}
                        {usersPagination.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setUserPage(
                            Math.min(usersPagination.totalPages, userPage + 1)
                          )
                        }
                        disabled={userPage === usersPagination.totalPages}
                        className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notes Table */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="text-left py-4 px-6 text-gray-400">
                          Title
                        </th>
                        <th className="text-left py-4 px-6 text-gray-400">
                          Author
                        </th>
                        <th className="text-center py-4 px-6 text-gray-400">
                          Subject
                        </th>
                        <th className="text-center py-4 px-6 text-gray-400">
                          Category
                        </th>
                        <th className="text-center py-4 px-6 text-gray-400">
                          Downloads
                        </th>
                        <th className="text-center py-4 px-6 text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {notes.map((note) => (
                        <tr
                          key={note._id}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          <td className="py-4 px-6">
                            <div className="text-white font-medium">
                              {note.title}
                            </div>
                            <div className="text-gray-400 text-sm mt-1">
                              {note.description.substring(0, 60)}...
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-300">
                            {note.uploadedBy?.fullName || "Unknown"}
                          </td>
                          <td className="py-4 px-6 text-center text-gray-300">
                            {note.subject}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${note.category === "Notes"
                                ? "bg-blue-500/20 text-blue-400"
                                : note.category === "PYQ"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                                }`}
                            >
                              {note.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center text-gray-300">
                            {note.downloads}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleDeleteNote(note._id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {notesPagination && (
                  <div className="flex items-center justify-between px-6 py-4 bg-gray-800/50">
                    <span className="text-gray-400">
                      Showing {(notesPagination.currentPage - 1) * 10 + 1} to{" "}
                      {Math.min(
                        notesPagination.currentPage * 10,
                        notesPagination.totalNotes
                      )}{" "}
                      of {notesPagination.totalNotes} notes
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setNotePage(Math.max(1, notePage - 1))}
                        disabled={notePage === 1}
                        className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600"
                      >
                        Previous
                      </button>
                      <span className="text-white">
                        Page {notesPagination.currentPage} of{" "}
                        {notesPagination.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setNotePage(
                            Math.min(notesPagination.totalPages, notePage + 1)
                          )
                        }
                        disabled={notePage === notesPagination.totalPages}
                        className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* // 5. Add the Logs Tab Content - BEFORE THE CLOSING </div> OF max-w-7xl */}
          {/* ===== ADMIN LOGS TAB ===== */}
          {activeTab === "logs" && <AdminLogs />}

          {/* Add Analytics Tab Content */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <Analytics />
            </div>
          )}
          {/* Academic Data Tab */}
          {/* Academic Data Tab */}
          {activeTab === "academic" && analytics && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-white mb-2">Academic Data</h2>
                <p className="text-indigo-200">User academic profile analytics</p>
              </div>

              {/* Profile Completion Stats */}
              {analytics.profileCompletionStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-900/20 to-gray-800/30 border border-green-500/20 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm mb-2">Completed Profiles</p>
                    <p className="text-4xl font-bold text-green-400">
                      {analytics.profileCompletionStats.completed}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">users</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/20 to-gray-800/30 border border-blue-500/20 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm mb-2">Total Users</p>
                    <p className="text-4xl font-bold text-blue-400">
                      {analytics.profileCompletionStats.total}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">registered</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/30 border border-purple-500/20 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm mb-2">Completion Rate</p>
                    <p className="text-4xl font-bold text-purple-400">
                      {analytics.profileCompletionStats.percentage}%
                    </p>
                    <p className="text-gray-500 text-xs mt-2">completion</p>
                  </div>
                </div>
              )}

              {/* Semester Distribution */}
              {analytics.semesterDistribution && analytics.semesterDistribution.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Semester Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {analytics.semesterDistribution.map((item, idx) => (
                      <div key={idx} className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-xs mb-1">Sem {item.semester}</p>
                        <p className="text-2xl font-bold text-blue-400">{item.count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* College Distribution */}
              {analytics.collegeDistribution && analytics.collegeDistribution.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">College Distribution</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-gray-400">College</th>
                          <th className="text-center py-3 px-4 text-gray-400">Users</th>
                          <th className="text-center py-3 px-4 text-gray-400">Type</th>
                          <th className="text-center py-3 px-4 text-gray-400">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.collegeDistribution.map((item, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4 text-white">{item.college.substring(0, 30)}</td>
                            <td className="py-3 px-4 text-center text-blue-400 font-semibold">{item.count}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${item.isPredefined ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                {item.isPredefined ? 'Predefined' : 'Custom'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${item.isApproved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {item.isApproved ? '✓ Approved' : '⚠ Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pending Custom Colleges */}
              {analytics.pendingCustomColleges && analytics.pendingCustomColleges.length > 0 && (
                <div className="bg-gradient-to-br from-yellow-900/20 to-gray-800/30 border border-yellow-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">
                    Pending Custom Colleges ({analytics.pendingCustomColleges.length})
                  </h3>
                  <div className="space-y-2">
                    {analytics.pendingCustomColleges.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-white">{item.college}</span>
                        <span className="text-yellow-400 font-semibold">{item.count} users</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Branch Distribution */}
              {analytics.branchDistribution && analytics.branchDistribution.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Branch Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {analytics.branchDistribution.map((item, idx) => (
                      <div key={idx} className="bg-gray-800/50 rounded-lg p-4 border border-white/5">
                        <p className="text-gray-400 text-sm mb-2">{item.branch}</p>
                        <p className="text-3xl font-bold text-green-400">{item.count}</p>
                        <p className="text-gray-500 text-xs mt-1">users</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* College Approvals Tab */}
          {activeTab === "colleges" && (
            <AdminColleges />
          )}

          {activeTab === "requests" && <AdminRequests />}
          {/* Feedback Tab */}
          {activeTab === "feedback" && <AdminFeedback />}

          {/* Retention Tab - NEW */}
          {activeTab === 'retention' && <RetentionTab />}
          {activeTab === "loginLogs" && <LoginLogsDisplay />}
          {activeTab === "loginanalytics" && <LoginAnalytics />}
          {activeTab === "Security" && <AdminSecurityDashboard />}
          {activeTab === 'requestlogs' && <LogsTab />}
          {/* Query Metrics Tab - NEW */}
{activeTab === "querymetrics" && <QueryMetricsDisplay />} 
{activeTab === "session" && <AnalyticsTab />} 
{/* {activeTab === "videos" && <AdminVideoManager />}  */}

        </div>
      </div>
    </PageTransition>
  );
}
