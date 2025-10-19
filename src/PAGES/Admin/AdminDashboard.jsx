// src/PAGES/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getDashboardStats,
    getAllUsers,
    getAllNotesAdmin,
    deleteUser,
    deleteNoteAdmin,
    updateUserRole,
    getRecentActivity
} from '../../REDUX/Slices/adminSlice';
import HomeLayout from '../../LAYOUTS/Homelayout';
import { Link } from 'react-router-dom';

// Icons
const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
);

const NotesIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const DownloadIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
);

const UserPlusIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);

const TrashIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const SearchIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export default function AdminDashboard() {
    const dispatch = useDispatch();
    const {
        loading,
        dashboardStats,
        users,
        notes,
        usersPagination,
        notesPagination,
        recentActivity
    } = useSelector(state => state.admin);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [userSearch, setUserSearch] = useState('');
    const [noteSearch, setNoteSearch] = useState('');
    const [userPage, setUserPage] = useState(1);
    const [notePage, setNotePage] = useState(1);

    useEffect(() => {
        if (activeTab === 'dashboard') {
            dispatch(getDashboardStats());
            dispatch(getRecentActivity());
        } else if (activeTab === 'users') {
            dispatch(getAllUsers({ page: userPage, search: userSearch }));
        } else if (activeTab === 'notes') {
            dispatch(getAllNotesAdmin({ page: notePage, search: noteSearch }));
        }
    }, [dispatch, activeTab, userPage, notePage, userSearch, noteSearch]);

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(userId));
        }
    };

    const handleDeleteNote = (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            dispatch(deleteNoteAdmin(noteId));
        }
    };

    const handleRoleUpdate = (userId, newRole) => {
        dispatch(updateUserRole({ userId, role: newRole }));
    };

    const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
        <div className={`${bgColor} backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform`}>
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
                <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-blue-200 mt-2">Manage users, notes, and monitor platform activity</p>
                </div>

                {/* Tabs */}
                <div className="bg-gray-900/50 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex space-x-8">
                            {['dashboard', 'users', 'notes'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-2 border-b-2 transition-colors capitalize ${activeTab === tab
                                            ? 'border-blue-500 text-blue-400'
                                            : 'border-transparent text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && dashboardStats && (
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

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Users by Role */}
                                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Users by Role</h3>
                                    <div className="space-y-4">
                                        {dashboardStats.usersByRole?.map(role => (
                                            <div key={role._id} className="flex items-center justify-between">
                                                <span className="text-gray-300 capitalize">{role._id.toLowerCase()}</span>
                                                <span className="text-white font-semibold">{role.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes by Category */}
                                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Notes by Category</h3>
                                    <div className="space-y-4">
                                        {dashboardStats.notesByCategory?.map(category => (
                                            <div key={category._id} className="flex items-center justify-between">
                                                <span className="text-gray-300">{category._id}</span>
                                                <span className="text-white font-semibold">{category.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top Rated Notes */}
                            {dashboardStats.topRatedNotes?.length > 0 && (
                                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Top Rated Notes</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    <th className="text-left py-3 text-gray-400">Title</th>
                                                    <th className="text-left py-3 text-gray-400">Author</th>
                                                    <th className="text-center py-3 text-gray-400">Rating</th>
                                                    <th className="text-center py-3 text-gray-400">Downloads</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboardStats.topRatedNotes.map(note => (
                                                    <tr key={note._id} className="border-b border-white/5">
                                                        <td className="py-3 text-white">{note.title}</td>
                                                        <td className="py-3 text-gray-300">{note.uploadedBy.fullName}</td>
                                                        <td className="py-3 text-center text-yellow-400">
                                                            {note.avgRating.toFixed(1)} ({note.ratingCount})
                                                        </td>
                                                        <td className="py-3 text-center text-gray-300">{note.downloads}</td>
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
                    {activeTab === 'users' && (
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
                                                <th className="text-left py-4 px-6 text-gray-400">User</th>
                                                <th className="text-left py-4 px-6 text-gray-400">Email</th>
                                                <th className="text-center py-4 px-6 text-gray-400">Role</th>
                                                <th className="text-center py-4 px-6 text-gray-400">Joined</th>
                                                <th className="text-center py-4 px-6 text-gray-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user._id} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="py-4 px-6">
                                                        <Link
                                                            to={`/profile/${user?._id}`}
                                                            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                {user?.avatar?.secure_url?.startsWith('http')  ? (
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
                                                                <span className="text-white font-medium">{user.fullName}</span>
                                                            </div>
                                                        </Link>

                                                    </td>
                                                    <td className="py-4 px-6 text-gray-300">{user.email}</td>
                                                    <td className="py-4 px-6 text-center">
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
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
                                            Showing {((usersPagination.currentPage - 1) * 10) + 1} to {Math.min(usersPagination.currentPage * 10, usersPagination.totalUsers)} of {usersPagination.totalUsers} users
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
                                                Page {usersPagination.currentPage} of {usersPagination.totalPages}
                                            </span>
                                            <button
                                                onClick={() => setUserPage(Math.min(usersPagination.totalPages, userPage + 1))}
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
                    {activeTab === 'notes' && (
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
                                                <th className="text-left py-4 px-6 text-gray-400">Title</th>
                                                <th className="text-left py-4 px-6 text-gray-400">Author</th>
                                                <th className="text-center py-4 px-6 text-gray-400">Subject</th>
                                                <th className="text-center py-4 px-6 text-gray-400">Category</th>
                                                <th className="text-center py-4 px-6 text-gray-400">Downloads</th>
                                                <th className="text-center py-4 px-6 text-gray-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {notes.map(note => (
                                                <tr key={note._id} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="py-4 px-6">
                                                        <div className="text-white font-medium">{note.title}</div>
                                                        <div className="text-gray-400 text-sm mt-1">
                                                            {note.description.substring(0, 60)}...
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-300">
                                                        {note.uploadedBy?.fullName || 'Unknown'}
                                                    </td>
                                                    <td className="py-4 px-6 text-center text-gray-300">{note.subject}</td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${note.category === 'Notes' ? 'bg-blue-500/20 text-blue-400' :
                                                                note.category === 'PYQ' ? 'bg-red-500/20 text-red-400' :
                                                                    'bg-yellow-500/20 text-yellow-400'
                                                            }`}>
                                                            {note.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-center text-gray-300">{note.downloads}</td>
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
                                            Showing {((notesPagination.currentPage - 1) * 10) + 1} to {Math.min(notesPagination.currentPage * 10, notesPagination.totalNotes)} of {notesPagination.totalNotes} notes
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
                                                Page {notesPagination.currentPage} of {notesPagination.totalPages}
                                            </span>
                                            <button
                                                onClick={() => setNotePage(Math.min(notesPagination.totalPages, notePage + 1))}
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
                </div>
            </div>
        </HomeLayout>
    );
}
