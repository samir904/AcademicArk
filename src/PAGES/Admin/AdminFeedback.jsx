import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllFeedbacks,
    updateFeedbackStatus,
    getFeedbackAnalytics
} from '../../REDUX/Slices/feedbackSlice';
import toast from 'react-hot-toast';

export default function AdminFeedback() {
    const dispatch = useDispatch();
    const { allFeedbacks, loading, feedbackAnalytics, allFeedbacksPagination } = useSelector(
        state => state.feedback
    );

    // State
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [filters, setFilters] = useState({
        feedbackType: '',
        status: '',
        rating: '',
        page: 1,
        limit: 20,
        sortBy: 'createdAt'
    });

    // Fetch data on mount and when filters change
    useEffect(() => {
        dispatch(getAllFeedbacks(filters));
        dispatch(getFeedbackAnalytics());
    }, [dispatch, filters]);

    // Handle status update
    const handleStatusUpdate = async (feedbackId, newStatus, adminResponse = '') => {
        try {
            const result = await dispatch(updateFeedbackStatus({
                feedbackId,
                status: newStatus,
                adminResponse: adminResponse || 'Thank you for your feedback!'
            }));

            if (updateFeedbackStatus.fulfilled.match(result)) {
                toast.success('Feedback status updated!');
                setSelectedFeedback(null);
            }
        } catch (error) {
            toast.error('Failed to update feedback');
        }
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1 // Reset to first page when filtering
        }));
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const feedbackTypeOptions = [
        { value: '', label: 'All Types' },
        { value: 'BUG_REPORT', label: '🐛 Bug Reports' },
        { value: 'FEATURE_REQUEST', label: '✨ Feature Requests' },
        { value: 'UI_UX', label: '🎨 UI/UX Feedback' },
        { value: 'PERFORMANCE', label: '⚡ Performance Issues' },
        { value: 'CONTENT', label: '📚 Content Quality' },
        { value: 'OTHER', label: '💬 Other' }
    ];

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'NEW', label: 'New' },
        { value: 'IN_REVIEW', label: 'In Review' },
        { value: 'ACKNOWLEDGED', label: 'Acknowledged' },
        { value: 'RESOLVED', label: 'Resolved' },
        { value: 'CLOSED', label: 'Closed' }
    ];

    const getStatusColor = (status) => {
        const colors = {
            'NEW': 'bg-red-500/20 text-red-300 border-red-500/30',
            'IN_REVIEW': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            'ACKNOWLEDGED': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            'RESOLVED': 'bg-green-500/20 text-green-300 border-green-500/30',
            'CLOSED': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
        };
        return colors[status] || colors['NEW'];
    };

    const getTypeIcon = (type) => {
        const icons = {
            'BUG_REPORT': '🐛',
            'FEATURE_REQUEST': '✨',
            'UI_UX': '🎨',
            'PERFORMANCE': '⚡',
            'CONTENT': '📚',
            'OTHER': '💬'
        };
        return icons[type] || '💬';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">📊 Feedback Management</h2>
                    <p className="text-gray-400 mt-2">Review and respond to user feedback</p>
                </div>
            </div>

            {/* Analytics Cards */}
            {feedbackAnalytics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Total Feedback */}
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Feedback</p>
                                <h3 className="text-3xl font-bold text-white mt-2">
                                    {feedbackAnalytics.totalFeedback}
                                </h3>
                            </div>
                            <span className="text-3xl">📨</span>
                        </div>
                    </div>

                    {/* Average Rating */}
                    <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Avg Rating</p>
                                <h3 className="text-3xl font-bold text-white mt-2">
                                    {feedbackAnalytics.avgRating.toFixed(1)}/5
                                </h3>
                                <p className="text-xs text-yellow-300 mt-1">
                                    {'⭐'.repeat(Math.round(feedbackAnalytics.avgRating))}
                                </p>
                            </div>
                            <span className="text-3xl">⭐</span>
                        </div>
                    </div>

                    {/* Bug Reports */}
                    <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Bug Reports</p>
                                <h3 className="text-3xl font-bold text-white mt-2">
                                    {feedbackAnalytics.byType.find(t => t._id === 'BUG_REPORT')?.count || 0}
                                </h3>
                            </div>
                            <span className="text-3xl">🐛</span>
                        </div>
                    </div>

                    {/* Feature Requests */}
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Feature Requests</p>
                                <h3 className="text-3xl font-bold text-white mt-2">
                                    {feedbackAnalytics.byType.find(t => t._id === 'FEATURE_REQUEST')?.count || 0}
                                </h3>
                            </div>
                            <span className="text-3xl">✨</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Feedback Type Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                            Feedback Type
                        </label>
                        <select
                            name="feedbackType"
                            value={filters.feedbackType}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none transition"
                        >
                            {feedbackTypeOptions.map(option => (
                                <option  className='bg-gray-900'  key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none transition"
                        >
                            {statusOptions.map(option => (
                                <option  className='bg-gray-900'  key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rating Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                            Rating
                        </label>
                        <select
                            name="rating"
                            value={filters.rating}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none transition"
                        >
                            <option  className='bg-gray-900' value="">All Ratings</option>
                            <option  className='bg-gray-900' value="5">5 Stars ⭐⭐⭐⭐⭐</option>
                            <option  className='bg-gray-900' value="4">4 Stars ⭐⭐⭐⭐</option>
                            <option className='bg-gray-900'  value="3">3 Stars ⭐⭐⭐</option>
                            <option  className='bg-gray-900'  value="2">2 Stars ⭐⭐</option>
                            <option  className='bg-gray-900'  value="1">1 Star ⭐</option>
                        </select>
                    </div>

                    {/* Sort By */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                            Sort By
                        </label>
                        <select
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none transition"
                        >
                            <option  className='bg-gray-900'  value="createdAt">Newest First</option>
                            <option  className='bg-gray-900'  value="-createdAt">Oldest First</option>
                            <option  className='bg-gray-900'  value="rating">Low Rating First</option>
                            <option  className='bg-gray-900'  value="-rating">High Rating First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Feedbacks List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="inline-block animate-spin">
                            <div className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full"></div>
                        </div>
                        <p className="text-gray-400 mt-4">Loading feedbacks...</p>
                    </div>
                </div>
            ) : allFeedbacks && allFeedbacks.length > 0 ? (
                <>
                    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">User</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Subject</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rating</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allFeedbacks.map(feedback => (
                                        <tr key={feedback._id} className="border-b border-white/10 hover:bg-white/5 transition">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-white text-sm">
                                                        {feedback.userId?.fullName || 'Unknown'}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {feedback.userId?.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-lg">
                                                    {getTypeIcon(feedback.feedbackType)}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {feedback.feedbackType.replace(/_/g, ' ')}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <p className="text-white text-sm truncate">
                                                    {feedback.subject}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-lg">
                                                    {'⭐'.repeat(feedback.rating)}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {feedback.rating}/5
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(feedback.status)}`}>
                                                    {feedback.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {new Date(feedback.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelectedFeedback(feedback)}
                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {allFeedbacksPagination && allFeedbacksPagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <button
                                onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                                disabled={filters.page === 1}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: allFeedbacksPagination.totalPages }, (_, i) => i + 1).map(
                                    page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-lg font-semibold transition ${
                                                filters.page === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}
                            </div>

                            <button
                                onClick={() => handlePageChange(Math.min(allFeedbacksPagination.totalPages, filters.page + 1))}
                                disabled={filters.page === allFeedbacksPagination.totalPages}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No feedbacks found</p>
                </div>
            )}

            {/* Detail Modal */}
            {selectedFeedback && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    {getTypeIcon(selectedFeedback.feedbackType)} Feedback Details
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedFeedback(null)}
                                className="text-white/80 hover:text-white text-2xl font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* User Info */}
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-white mb-3">👤 User Information</h4>
                                <div className="space-y-2">
                                    <p className="text-white">
                                        <span className="text-gray-400">Name:</span> {selectedFeedback.userId?.fullName}
                                    </p>
                                    <p className="text-white">
                                        <span className="text-gray-400">Email:</span> {selectedFeedback.userId?.email}
                                    </p>
                                    {selectedFeedback.userSnapshot && (
                                        <>
                                            <p className="text-white">
                                                <span className="text-gray-400">Branch:</span> {selectedFeedback.userSnapshot.branch}
                                            </p>
                                            <p className="text-white">
                                                <span className="text-gray-400">Semester:</span> {selectedFeedback.userSnapshot.semester}
                                            </p>
                                            <p className="text-white">
                                                <span className="text-gray-400">College:</span> {selectedFeedback.userSnapshot.college}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Feedback Info */}
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-white mb-3">📝 Feedback Details</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">Type</p>
                                        <p className="text-white">
                                            {getTypeIcon(selectedFeedback.feedbackType)} {selectedFeedback.feedbackType.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Subject</p>
                                        <p className="text-white">{selectedFeedback.subject}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Message</p>
                                        <p className="text-white whitespace-pre-wrap">{selectedFeedback.message}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Rating</p>
                                        <p className="text-white text-lg">
                                            {'⭐'.repeat(selectedFeedback.rating)} ({selectedFeedback.rating}/5)
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Page</p>
                                        <p className="text-white text-sm">{selectedFeedback.page}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Management */}
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-white mb-3">⚙️ Status Management</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-white mb-2">
                                            Update Status
                                        </label>
                                        <select
                                            onChange={(e) => {
                                                handleStatusUpdate(selectedFeedback._id, e.target.value);
                                            }}
                                            defaultValue={selectedFeedback.status}
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none transition"
                                        >
                                            <option  className='bg-gray-900'  value="NEW">New</option>
                                            <option  className='bg-gray-900'  value="IN_REVIEW">In Review</option>
                                            <option  className='bg-gray-900'  value="ACKNOWLEDGED">Acknowledged</option>
                                            <option  className='bg-gray-900'  value="RESOLVED">Resolved</option>
                                            <option  className='bg-gray-900'  value="CLOSED">Closed</option>
                                        </select>
                                    </div>

                                    {/* Current Status Badge */}
                                    <div>
                                        <p className="text-gray-400 text-sm mb-2">Current Status</p>
                                        <span className={`inline-block px-4 py-2 rounded-full font-semibold border ${getStatusColor(selectedFeedback.status)}`}>
                                            {selectedFeedback.status}
                                        </span>
                                    </div>

                                    {/* Admin Response */}
                                    {selectedFeedback.adminResponse && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <p className="text-gray-400 text-sm mb-2">Admin Response</p>
                                            <p className="text-white bg-white/5 rounded p-3">
                                                {selectedFeedback.adminResponse.response}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Responded: {new Date(selectedFeedback.adminResponse.respondedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Attachments */}
                            {selectedFeedback.attachments && selectedFeedback.attachments.length > 0 && (
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-white mb-3">📎 Attachments</h4>
                                    <div className="space-y-2">
                                        {selectedFeedback.attachments.map((attachment, idx) => (
                                            <a
                                                key={idx}
                                                href={attachment.secure_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-blue-400 text-sm transition"
                                            >
                                                📥 {attachment.fileName}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedFeedback(null)}
                                className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-semibold transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
