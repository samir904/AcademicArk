// FRONTEND/COMPONENTS/Admin/QueryMetricsDisplay.jsx - NEW COMPONENT

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getOverallQueryMetrics,
    getQueryMetricsByRoute,
    getQueryMetricsByCollection,
    getSlowQueries,
    resetQueryMetrics
} from '../../REDUX/Slices/queryMetricsSlice';

export default function QueryMetricsDisplay() {
    const dispatch = useDispatch();
    const { loading, error, overall, byRoute, byCollection, slowQueries } = useSelector(
        state => state.queryMetrics
    );

    const [sortBy, setSortBy] = useState('avgQueryTime'); // Sort routes by this
    const [sortOrder, setSortOrder] = useState('desc'); // asc or desc
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // Fetch data on component mount
    useEffect(() => {
        dispatch(getOverallQueryMetrics());
        dispatch(getQueryMetricsByRoute());
        dispatch(getQueryMetricsByCollection());
        dispatch(getSlowQueries(20));
    }, [dispatch]);

    // Sort routes by selected field
    const sortedRoutes = Object.entries(byRoute)
        .sort((a, b) => {
            const valueA = a[1][sortBy] ?? 0;
            const valueB = b[1][sortBy] ?? 0;
            
            if (sortOrder === 'desc') {
                return valueB - valueA;
            } else {
                return valueA - valueB;
            }
        });

    // Sort collections
    const sortedCollections = Object.entries(byCollection)
        .sort((a, b) => b[1].totalQueries - a[1].totalQueries)
        .slice(0, 10);

    const handleResetMetrics = () => {
        dispatch(resetQueryMetrics());
        setShowResetConfirm(false);
    };

    const getStatusColor = (avgTime) => {
        if (avgTime < 50) return 'text-green-400'; // Fast
        if (avgTime < 100) return 'text-yellow-400'; // Ok
        return 'text-red-400'; // Slow
    };

    const getStatusBg = (avgTime) => {
        if (avgTime < 50) return 'bg-green-500/10 border-green-500/30';
        if (avgTime < 100) return 'bg-yellow-500/10 border-yellow-500/30';
        return 'bg-red-500/10 border-red-500/30';
    };

    const getStatusIndicator = (avgTime) => {
        if (avgTime < 50) return '🟢';
        if (avgTime < 100) return '🟡';
        return '🔴';
    };

    if (loading && Object.keys(byRoute).length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin">
                    <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full"></div>
                </div>
                <p className="text-gray-400 mt-2">Loading query metrics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overall Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Total Queries */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Total Queries</p>
                    <p className="text-3xl font-bold text-blue-400 mt-2">
                        {overall.totalQueries?.toLocaleString()}
                    </p>
                </div>

                {/* Avg Query Time */}
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Avg Query Time</p>
                    <p className={`text-3xl font-bold mt-2 ${
                        overall.avgQueryTime < 50 ? 'text-green-400' :
                        overall.avgQueryTime < 100 ? 'text-yellow-400' :
                        'text-red-400'
                    }`}>
                        {overall.avgQueryTime?.toFixed(2)}ms
                    </p>
                </div>

                {/* Routes Count */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Routes Tracked</p>
                    <p className="text-3xl font-bold text-cyan-400 mt-2">
                        {overall.routeCount}
                    </p>
                </div>

                {/* Collections Count */}
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Collections</p>
                    <p className="text-3xl font-bold text-orange-400 mt-2">
                        {overall.collectionCount}
                    </p>
                </div>

                {/* Slow Queries Count */}
                <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Slow Queries (&gt;100ms)</p>
                    <p className="text-3xl font-bold text-red-400 mt-2">
                        {overall.slowQueriesCount}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center bg-gray-900/50 border border-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                    <label className="text-gray-400 text-sm">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                    >
                        <option value="avgQueryTime">Avg Query Time (Slowest First)</option>
                        <option value="totalQueries">Total Queries (Most First)</option>
                    </select>
                </div>

                <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 transition text-sm"
                >
                    🔄 Reset Metrics
                </button>
            </div>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
                    <div className="bg-gray-800 border border-white/10 rounded-lg p-6 max-w-sm">
                        <p className="text-white mb-4">Reset all query metrics? This cannot be undone.</p>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleResetMetrics}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                            >
                                Yes, Reset
                            </button>
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Routes Performance Table */}
            <div className="bg-gray-900/50 border border-white/10 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Routes Performance</h3>
                    <p className="text-gray-400 text-sm mt-1">
                        {sortedRoutes.length} routes tracked - Sorted by {sortBy === 'avgQueryTime' ? 'Avg Query Time' : 'Total Queries'}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 bg-gray-800/50">
                                <th className="px-6 py-3 text-left text-gray-300 font-semibold">Route</th>
                                <th className="px-6 py-3 text-center text-gray-300 font-semibold">Total Queries</th>
                                <th className="px-6 py-3 text-center text-gray-300 font-semibold">Avg Query Time</th>
                                <th className="px-6 py-3 text-center text-gray-300 font-semibold">Total Time</th>
                                <th className="px-6 py-3 text-center text-gray-300 font-semibold">Status</th>
                                <th className="px-6 py-3 text-center text-gray-300 font-semibold">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRoutes.map(([route, data], index) => (
                                <tr
                                    key={index}
                                    className={`border-b border-white/5 hover:bg-white/5 transition ${getStatusBg(data.avgQueryTime)}`}
                                >
                                    <td className="px-6 py-4 text-gray-300 font-mono text-xs">
                                        {route}
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-400">
                                        {data.totalQueries?.toLocaleString()}
                                    </td>
                                    <td className={`px-6 py-4 text-center font-semibold ${getStatusColor(data.avgQueryTime)}`}>
                                        {data.avgQueryTime?.toFixed(2)}ms {getStatusIndicator(data.avgQueryTime)}
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-400">
                                        {(data.totalQueryTime / 1000).toFixed(2)}s
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            data.avgQueryTime < 50 ? 'bg-green-500/20 text-green-400' :
                                            data.avgQueryTime < 100 ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                            {data.avgQueryTime < 50 ? 'Fast' : data.avgQueryTime < 100 ? 'OK' : 'Slow'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-400 text-xs">
                                        {Object.keys(data.operations).map(op => `${op}(${data.operations[op].count})`).join(', ')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {sortedRoutes.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No query metrics collected yet. Make some API requests.</p>
                    </div>
                )}
            </div>

            {/* Collections Heat Map */}
            <div className="bg-gray-900/50 border border-white/10 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Top 10 Collections by Query Count</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-6">
                    {sortedCollections.map(([collection, data], index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-white/10 rounded-lg p-4 hover:border-white/20 transition"
                        >
                            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider truncate">
                                {collection}
                            </p>
                            <p className="text-2xl font-bold text-blue-400 mt-2">
                                {data.totalQueries?.toLocaleString()}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                                Avg: {data.avgQueryTime?.toFixed(2)}ms
                            </p>
                            <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${
                                        data.avgQueryTime < 50 ? 'bg-green-500' :
                                        data.avgQueryTime < 100 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                    }`}
                                    style={{
                                        width: `${Math.min(
                                            (data.totalQueries / Math.max(...sortedCollections.map(c => c[1].totalQueries))) * 100,
                                            100
                                        )}%`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {sortedCollections.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No collection data available</p>
                    </div>
                )}
            </div>

            {/* Slow Queries Alert */}
            {slowQueries.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-red-500/20">
                        <h3 className="text-lg font-semibold text-red-400">
                            ⚠️ Slow Queries Detected ({slowQueries.length})
                        </h3>
                        <p className="text-red-400/70 text-sm mt-1">These queries took longer than 100ms</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-red-500/20 bg-red-500/5">
                                    <th className="px-6 py-3 text-left text-red-400 font-semibold">Collection</th>
                                    <th className="px-6 py-3 text-left text-red-400 font-semibold">Route</th>
                                    <th className="px-6 py-3 text-center text-red-400 font-semibold">Duration</th>
                                    <th className="px-6 py-3 text-left text-red-400 font-semibold">Type</th>
                                    <th className="px-6 py-3 text-left text-red-400 font-semibold">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slowQueries.slice(0, 10).map((query, index) => (
                                    <tr key={index} className="border-b border-red-500/10 hover:bg-red-500/5 transition">
                                        <td className="px-6 py-3 text-gray-300 font-mono text-xs">{query.collection}</td>
                                        <td className="px-6 py-3 text-gray-400 text-xs">{query.route}</td>
                                        <td className="px-6 py-3 text-center">
                                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold">
                                                {query.duration}ms
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-gray-400 text-xs">{query.type}</td>
                                        <td className="px-6 py-3 text-gray-500 text-xs">
                                            {new Date(query.timestamp).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}