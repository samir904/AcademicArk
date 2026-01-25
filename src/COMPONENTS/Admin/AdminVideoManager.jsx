import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVideos, deleteVideo, getVideo } from '../../REDUX/Slices/videoSlice';
import { showToast } from '../../HELPERS/Toaster';

export default function AdminVideoManager() {
    const dispatch = useDispatch();
    const { videos, loading, deleting, pagination } = useSelector(state => state.videoLecture);

    const [filters, setFilters] = useState({
        subject: '',
        semester: '',
        sortBy: 'newest'
    });
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        dispatch(getAllVideos(filters));
    }, [filters, dispatch]);

    const handleDelete = (videoId) => {
        setDeleteConfirm(videoId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (deleteConfirm) {
            dispatch(deleteVideo(deleteConfirm));
            setShowDeleteModal(false);
            setDeleteConfirm(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">📹 Video Manager</h2>
                <span className="text-gray-400">Total Videos: {pagination.total}</span>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-4">
                <select
                    value={filters.subject}
                    onChange={(e) => setFilters({...filters, subject: e.target.value})}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                >
                    <option value="">All Subjects</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Database">Database</option>
                </select>

                <select
                    value={filters.semester}
                    onChange={(e) => setFilters({...filters, semester: e.target.value})}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                >
                    <option value="">All Semesters</option>
                    {[1,2,3,4,5,6,7,8].map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                    ))}
                </select>

                <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
                >
                    <option value="newest">Newest</option>
                    <option value="views">Most Viewed</option>
                    <option value="rating">Top Rated</option>
                </select>
            </div>

            {/* Videos Table */}
            <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                {loading ? (
                    <div className="text-center py-8 text-gray-400">Loading videos...</div>
                ) : videos.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No videos found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-900 border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Title</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Subject</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Semester</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Views</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Rating</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map(video => (
                                <tr key={video._id} className="border-b border-gray-700 hover:bg-gray-700/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={video.thumbnail?.url || '/placeholder.jpg'}
                                                alt={video.title}
                                                className="w-12 h-12 rounded object-cover"
                                            />
                                            <div>
                                                <p className="text-white font-medium">{video.title}</p>
                                                <p className="text-sm text-gray-400">Ch {video.chapter?.number}: {video.chapter?.title}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{video.subject}</td>
                                    <td className="px-6 py-4 text-gray-300">{video.semester}</td>
                                    <td className="px-6 py-4 text-gray-300">👁️ {video.statistics?.views || 0}</td>
                                    <td className="px-6 py-4 text-gray-300">⭐ {video.averageRating?.toFixed(1) || 0}/5</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => setSelectedVideo(video)}
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(video._id)}
                                            disabled={deleting}
                                            className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-lg p-6 max-w-sm">
                        <h3 className="text-xl font-bold text-white mb-4">Delete Video?</h3>
                        <p className="text-gray-400 mb-6">This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

