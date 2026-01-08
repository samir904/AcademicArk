// FRONTEND/COMPONENTS/ADMIN/MongoDBHealth.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getMongoDBHealth,
    getDatabaseStats,
    getPerformanceMetrics,
    getConnectionDetails
} from '../../REDUX/Slices/mongoDbHealthSlice';

const MongoDBHealth = ({ autoRefresh }) => {
    const dispatch = useDispatch();
    const [refreshInterval, setRefreshInterval] = useState(null);

    const {
        loading,
        mongodbHealth,
        databaseStats,
        performanceMetrics,
        connectionDetails
    } = useSelector(state => state.mongodbHealth);

    // Fetch all health data
    const fetchAllData = () => {
        dispatch(getMongoDBHealth());
        dispatch(getDatabaseStats());
        dispatch(getPerformanceMetrics());
        dispatch(getConnectionDetails());
    };

    useEffect(() => {
        // Initial fetch
        fetchAllData();

        // Set up auto-refresh
        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchAllData();
            }, 10000); // 10 seconds

            setRefreshInterval(interval);
            return () => clearInterval(interval);
        }
    }, [dispatch, autoRefresh]);

    // Get status color based on health
    const getStatusColor = (status) => {
        switch (status) {
            case 'connected':
                return 'text-green-400';
            case 'connecting':
                return 'text-yellow-400';
            case 'disconnected':
            case 'error':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    // Get status badge background
    const getStatusBgColor = (status) => {
        switch (status) {
            case 'connected':
                return 'bg-green-500/20';
            case 'connecting':
                return 'bg-yellow-500/20';
            case 'disconnected':
            case 'error':
                return 'bg-red-500/20';
            default:
                return 'bg-gray-500/20';
        }
    };

    // Format bytes to human readable
    const formatBytes = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    // Format uptime
    const formatUptime = (seconds) => {
        if (!seconds) return '0s';
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${minutes}m`;
    };

    if (loading && !mongodbHealth.status) {
        return (
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-white/60">Loading MongoDB health...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* MongoDB Health Header */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-4h10m-10 3h10m-10 3h10M17 1.5v6m-3-3h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                MongoDB Database Health
                            </h3>
                            <p className={`text-sm mt-1 ${getStatusColor(mongodbHealth.status)}`}>
                                Status: {mongodbHealth.status.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchAllData}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-all"
                    >
                        Refresh
                    </button>
                </div>

                {/* Connection Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Connection Status */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-2">Connection Status</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBgColor(mongodbHealth.status)} ${getStatusColor(mongodbHealth.status)}`}>
                            {mongodbHealth.connected ? '● Connected' : '● Disconnected'}
                        </div>
                    </div>

                    {/* Response Time */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-2">Response Time</div>
                        <div className="text-2xl font-bold text-blue-400">
                            {mongodbHealth.responseTime}
                            <span className="text-sm text-gray-500">ms</span>
                        </div>
                    </div>

                    {/* Uptime */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-2">Uptime</div>
                        <div className="text-lg font-bold text-green-400">
                            {formatUptime(mongodbHealth.uptime)}
                        </div>
                    </div>

                    {/* DB Size */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-2">Database Size</div>
                        <div className="text-2xl font-bold text-purple-400">
                            {mongodbHealth.dbSize}
                        </div>
                    </div>
                </div>
            </div>

            {/* Database Statistics */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Database Statistics</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Collections */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-2">Collections</div>
                        <div className="text-3xl font-bold text-cyan-400">
                            {databaseStats.collections}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            {mongodbHealth.collections.length} total
                        </div>
                    </div>

                    {/* Indexes */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-2">Indexes</div>
                        <div className="text-3xl font-bold text-yellow-400">
                            {databaseStats.indexes}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            indexed fields
                        </div>
                    </div>

                    {/* Data Size */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-2">Data Size</div>
                        <div className="text-2xl font-bold text-green-400">
                            {databaseStats.dataSize}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            actual data
                        </div>
                    </div>

                    {/* Storage Size */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-2">Storage Size</div>
                        <div className="text-2xl font-bold text-orange-400">
                            {databaseStats.storageSize}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            allocated space
                        </div>
                    </div>
                </div>
            </div>

            {/* Operations & Memory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Database Operations */}
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Database Operations</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Total Inserts</span>
                            <span className="text-blue-400 font-semibold">
                                {mongodbHealth.operations.totalInserts.toLocaleString()}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: '100%' }}></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Total Updates</span>
                            <span className="text-green-400 font-semibold">
                                {mongodbHealth.operations.totalUpdates.toLocaleString()}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '100%' }}></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Total Deletes</span>
                            <span className="text-red-400 font-semibold">
                                {mongodbHealth.operations.totalDeletes.toLocaleString()}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: '100%' }}></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Total Queries</span>
                            <span className="text-purple-400 font-semibold">
                                {mongodbHealth.operations.totalQueries.toLocaleString()}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Memory Usage */}
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Memory Usage</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Resident Memory</span>
                            <span className="text-cyan-400 font-semibold">
                                {formatBytes(mongodbHealth.memory.resident * 1024 * 1024)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Virtual Memory</span>
                            <span className="text-yellow-400 font-semibold">
                                {formatBytes(mongodbHealth.memory.virtual * 1024 * 1024)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Mapped Memory</span>
                            <span className="text-pink-400 font-semibold">
                                {formatBytes(mongodbHealth.memory.mapped * 1024 * 1024)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Connection Details */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Connection Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <span className="text-gray-400 text-sm">Host</span>
                        <div className="text-white font-semibold mt-2">
                            {connectionDetails.host || 'localhost'}
                        </div>
                    </div>
                    <div>
                        <span className="text-gray-400 text-sm">Port</span>
                        <div className="text-white font-semibold mt-2">
                            {connectionDetails.port || 27017}
                        </div>
                    </div>
                    <div>
                        <span className="text-gray-400 text-sm">Database Name</span>
                        <div className="text-white font-semibold mt-2">
                            {connectionDetails.name || 'academicark'}
                        </div>
                    </div>
                    <div>
                        <span className="text-gray-400 text-sm">DB Version</span>
                        <div className="text-white font-semibold mt-2">
                            {mongodbHealth.version}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MongoDBHealth;
