// src/PAGES/User/UserAnalytics.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HomeLayout from '../../LAYOUTS/Homelayout';
import CardRenderer from '../Note/CardRenderer';
import { getMyAnalytics, getMyBookmarks, getMyNotes } from '../../REDUX/Slices/authslice';

// Icons
const AnalyticsIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const NotesIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const BookmarkIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const DownloadIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
);

const StarIcon = ({ className, filled }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const TrendingUpIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const ActivityIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export default function UserAnalytics() {
    const dispatch = useDispatch();
    const { loading, analytics, myNotes, myBookmarks } = useSelector(state => state.auth);
    const { data: user } = useSelector(state => state.auth);
    
    const [activeTab, setActiveTab] = useState('overview');

    const role=useSelector((state)=>state?.auth?.role)

    useEffect(() => {
        dispatch(getMyAnalytics());
        dispatch(getMyNotes({ page: 1, limit: 6 }));
        dispatch(getMyBookmarks({ page: 1, limit: 6 }));
    }, [dispatch]);

    const StatCard = ({ icon: Icon, title, value, color, bgColor, subtitle }) => (
        <div className={`${bgColor} backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${bgColor} ${color}`}>
                    <Icon className="w-8 h-8" />
                </div>
                <TrendingUpIcon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
                {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
            </div>
        </div>
    );

    if (loading && !analytics) {
        return (
            <HomeLayout>
                <div className="min-h-screen bg-black flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            </HomeLayout>
        );
    }

    return (
        <HomeLayout>
            <div className="min-h-screen bg-black text-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center space-x-4 mb-6">
                            {user?.avatar?.secure_url ? (
                                <img 
                                    src={user.avatar.secure_url} 
                                    alt={user.fullName}
                                    className="w-16 h-16 rounded-full border-4 border-white/20"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    {user?.fullName || 'User'}'s Analytics
                                </h1>
                                <p className="text-blue-200">Track your learning progress and contributions</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-gray-900/50 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex space-x-8">
                            {[
                                { id: 'overview', label: 'Overview', icon: AnalyticsIcon },
                                { id: 'notes', label: 'My Notes', icon: NotesIcon },
                                { id: 'bookmarks', label: 'Bookmarks', icon: BookmarkIcon }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-2 border-b-2 transition-colors flex items-center space-x-2 ${
                                        activeTab === tab.id 
                                            ? 'border-blue-500 text-blue-400' 
                                            : 'border-transparent text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && analytics && (
                        <div className="space-y-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    icon={NotesIcon}
                                    title="Notes Uploaded"
                                    value={analytics.overview.totalNotes}
                                    color="text-blue-400"
                                    bgColor="bg-blue-900/20"
                                    subtitle="Total contributions"
                                />
                                <StatCard
                                    icon={DownloadIcon}
                                    title="Total Downloads"
                                    value={analytics.overview.totalDownloads}
                                    color="text-green-400"
                                    bgColor="bg-green-900/20"
                                    subtitle="Across all notes"
                                />
                                <StatCard
                                    icon={StarIcon}
                                    title="Average Rating"
                                    value={analytics.overview.avgRating}
                                    color="text-yellow-400"
                                    bgColor="bg-yellow-900/20"
                                    subtitle="From user feedback"
                                />
                                <StatCard
                                    icon={BookmarkIcon}
                                    title="Bookmarks"
                                    value={analytics.overview.totalBookmarks}
                                    color="text-purple-400"
                                    bgColor="bg-purple-900/20"
                                    subtitle="Saved for later"
                                />
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Subject Stats */}
                                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-6">Subject Distribution</h3>
                                    <div className="space-y-4">
                                        {Object.entries(analytics.subjectStats).map(([subject, stats]) => (
                                            <div key={subject} className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-white font-medium capitalize">{subject}</div>
                                                    <div className="text-gray-400 text-sm">
                                                        {stats.downloads} downloads • {stats.avgRating.toFixed(1)}★
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-white font-semibold">{stats.count}</div>
                                                    <div className="text-gray-400 text-sm">notes</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Category Stats */}
                                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-6">Category Breakdown</h3>
                                    <div className="space-y-4">
                                        {Object.entries(analytics.categoryStats).map(([category, count]) => (
                                            <div key={category} className="flex items-center justify-between">
                                                <span className="text-white">{category}</span>
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-24 bg-gray-700 rounded-full h-2">
                                                        <div 
                                                            className="bg-blue-500 h-2 rounded-full"
                                                            style={{ 
                                                                width: `${(count / analytics.overview.totalNotes) * 100}%` 
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-white font-semibold w-8">{count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top Performing Notes */}
                            {analytics.topNotes?.length > 0 && (
                                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-6">Top Performing Notes</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    <th className="text-left py-3 text-gray-400">Title</th>
                                                    <th className="text-center py-3 text-gray-400">Downloads</th>
                                                    <th className="text-center py-3 text-gray-400">Rating</th>
                                                    <th className="text-center py-3 text-gray-400">Bookmarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analytics.topNotes.map(note => (
                                                    <tr key={note.id} className="border-b border-white/5">
                                                        <td className="py-3 text-white">{note.title}</td>
                                                        <td className="py-3 text-center text-green-400">{note.downloads}</td>
                                                        <td className="py-3 text-center text-yellow-400">{note.rating}★</td>
                                                        <td className="py-3 text-center text-purple-400">{note.bookmarks}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Recent Activity */}
                            {analytics.recentActivity?.length > 0 && (
                                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                                        <ActivityIcon className="w-6 h-6 text-blue-400" />
                                        <span>Recent Activity</span>
                                    </h3>
                                    <div className="space-y-4">
                                        {analytics.recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                                                <div className={`p-2 rounded-full ${
                                                    activity.type === 'upload' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                    {activity.type === 'upload' ? 
                                                        <NotesIcon className="w-4 h-4" /> : 
                                                        <BookmarkIcon className="w-4 h-4" />
                                                    }
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-white font-medium">{activity.title}</div>
                                                    <div className="text-gray-400 text-sm">
                                                        {activity.type === 'upload' ? 'Uploaded' : 'Bookmarked'} • {new Date(activity.date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                {activity.data.downloads && (
                                                    <div className="text-right">
                                                        <div className="text-green-400 font-semibold">{activity.data.downloads}</div>
                                                        <div className="text-gray-400 text-sm">downloads</div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Insights */}
                            {analytics.insights && (
                                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">📊 Insights</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-white/5 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-400 capitalize">
                                                {analytics.insights.mostPopularSubject}
                                            </div>
                                            <div className="text-gray-400 text-sm">Most Popular Subject</div>
                                        </div>
                                        <div className="text-center p-4 bg-white/5 rounded-lg">
                                            <div className="text-2xl font-bold text-green-400">
                                                {analytics.insights.bestPerformingCategory}
                                            </div>
                                            <div className="text-gray-400 text-sm">Best Performing Category</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* My Notes Tab */}
                    {activeTab === 'notes' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">My Notes</h2>
                                <div className="text-gray-400">
                                    {analytics?.overview.totalNotes || 0} notes uploaded
                                </div>
                            </div>
                            
                            {myNotes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myNotes.map((note) => (
                                        <CardRenderer key={note._id} note={note} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <NotesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">No Notes Yet</h3>
                                    <p className="text-gray-400 mb-6">
                                        Start contributing by uploading your first note
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bookmarks Tab */}
                    {activeTab === 'bookmarks' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">My Bookmarks</h2>
                                <div className="text-gray-400">
                                    {analytics?.overview.totalBookmarks || 0} bookmarked notes
                                </div>
                            </div>
                            
                            {myBookmarks.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myBookmarks.map((note) => (
                                        <CardRenderer key={note._id} note={note} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <BookmarkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">No Bookmarks Yet</h3>
                                    <p className="text-gray-400 mb-6">
                                        Save interesting notes to access them later
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </HomeLayout>
    );
}
