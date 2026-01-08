// FRONTEND/COMPONENTS/ADMIN/RedisHealth.jsx - FIXED VERSION

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getRedisHealth,
    getMemoryStats,
    getKeyStats,
    getHitMissStats,
    getCachePerformance
} from '../../REDUX/Slices/redisHealthSlice';

const RedisHealth = ({ autoRefresh }) => {
    const dispatch = useDispatch();

    const {
        loading,
        redisHealth,
        memoryStats,
        keyStats,
        hitMissStats,
        cachePerformance
    } = useSelector(state => state.redisHealth);

    // Fetch all health data
    const fetchAllData = () => {
        dispatch(getRedisHealth());
        dispatch(getMemoryStats());
        dispatch(getKeyStats());
        dispatch(getHitMissStats());
        dispatch(getCachePerformance());
    };

    useEffect(() => {
        // Initial fetch
        fetchAllData();

        // Set up auto-refresh
        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchAllData();
            }, 10000); // 10 seconds

            return () => clearInterval(interval);
        }
    }, [dispatch, autoRefresh]);

    // Get status color
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

    // Safe value getter with fallback
    const safeValue = (value, fallback = 0) => {
        return value !== undefined && value !== null ? value : fallback;
    };

    if (loading && !redisHealth.status) {
        return (
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-white/60">Loading Redis health...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Redis Health Header */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-500/20 rounded-xl">
                            <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                Redis Cache Health
                            </h3>
                            <p className={`text-sm mt-1 ${getStatusColor(redisHealth.status)}`}>
                                Status: {redisHealth.status.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchAllData}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-all"
                    >
                        Refresh
                    </button>
                </div>

                {/* Connection Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Connection Status */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-2">Connection Status</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBgColor(redisHealth.status)} ${getStatusColor(redisHealth.status)}`}>
                            {redisHealth.connected ? '● Connected' : '● Disconnected'}
                        </div>
                    </div>

                    {/* Response Time */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-2">Response Time</div>
                        <div className="text-2xl font-bold text-blue-400">
                            {safeValue(redisHealth.responseTime)}
                            <span className="text-sm text-gray-500">ms</span>
                        </div>
                    </div>

                    {/* Uptime */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-2">Uptime</div>
                        <div className="text-lg font-bold text-green-400">
                            {Math.floor(safeValue(redisHealth.uptime) / 86400)}d {Math.floor((safeValue(redisHealth.uptime) % 86400) / 3600)}h
                        </div>
                    </div>

                    {/* Connected Clients */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-2">Connected Clients</div>
                        <div className="text-2xl font-bold text-cyan-400">
                            {safeValue(redisHealth.clients?.connected)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Memory & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Memory Usage */}
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Memory Usage</h3>

                    <div className="space-y-4">
                        {/* Memory Percentage */}
                        <div className="bg-gray-800/50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">Used Memory</span>
                                <span className="text-purple-400 font-semibold">
                                    {safeValue(memoryStats?.percentage)}%
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all ${
                                        safeValue(memoryStats.percentage) > 80
                                            ? 'bg-red-500'
                                            : safeValue(memoryStats.percentage) > 50
                                            ? 'bg-yellow-500'
                                            : 'bg-green-500'
                                    }`}
                                    style={{ width: `${safeValue(memoryStats.percentage)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Memory Stats */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Used</span>
                                <span className="text-white font-semibold">{memoryStats.used || '0 MB'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Peak</span>
                                <span className="text-white font-semibold">{memoryStats.peak || '0 MB'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total</span>
                                <span className="text-white font-semibold">{memoryStats.total || '0 MB'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Fragmentation</span>
                                <span className="text-white font-semibold">
                                    {safeValue(memoryStats.fragmentation, 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cache Performance */}
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Cache Performance</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Commands/Sec</span>
                            <span className="text-blue-400 font-semibold">
                                {safeValue(cachePerformance?.commandsPerSec)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Total Commands</span>
                            <span className="text-green-400 font-semibold">
                                {safeValue(cachePerformance?.totalCommands).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Evictions</span>
                            <span className="text-yellow-400 font-semibold">
                                {safeValue(cachePerformance.evictions).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Connected Clients</span>
                            <span className="text-purple-400 font-semibold">
                                {safeValue(cachePerformance.connectedClients)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key & Hit/Miss Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Statistics */}
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Key Statistics</h3>

                    <div className="space-y-4">
                        <div className="bg-gray-800/50 rounded-xl p-4">
                            <div className="text-gray-400 text-sm mb-2">Total Keys</div>
                            <div className="text-3xl font-bold text-cyan-400">
                                {safeValue(keyStats.total).toLocaleString()}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 bg-gray-800/50 rounded-xl p-4">
                                <div className="text-gray-400 text-sm mb-2">Expired</div>
                                <div className="text-2xl font-bold text-yellow-400">
                                    {safeValue(keyStats.expired)}
                                </div>
                            </div>
                            <div className="flex-1 bg-gray-800/50 rounded-xl p-4">
                                <div className="text-gray-400 text-sm mb-2">Evicted</div>
                                <div className="text-2xl font-bold text-red-400">
                                    {safeValue(keyStats.evicted)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hit/Miss Statistics */}
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Hit/Miss Statistics</h3>

                    <div className="space-y-4">
                        <div className="bg-gray-800/50 rounded-xl p-4">
                            <div className="text-gray-400 text-sm mb-2">Hit Rate</div>
                            <div className="text-3xl font-bold text-green-400">
                                {hitMissStats.hitRate || '0%'}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 bg-gray-800/50 rounded-xl p-4">
                                <div className="text-gray-400 text-sm mb-2">Hits</div>
                                <div className="text-2xl font-bold text-green-400">
                                    {safeValue(hitMissStats.hits).toLocaleString()}
                                </div>
                            </div>
                            <div className="flex-1 bg-gray-800/50 rounded-xl p-4">
                                <div className="text-gray-400 text-sm mb-2">Misses</div>
                                <div className="text-2xl font-bold text-red-400">
                                    {safeValue(hitMissStats.misses).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RedisHealth;