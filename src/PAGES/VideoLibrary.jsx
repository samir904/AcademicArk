import { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../COMPONENTS/VideoCard';
import VideoModal from '../COMPONENTS/VideoModal';

const VideoLibrary = () => {
    const [videos, setVideos] = useState([]);
    const [filters, setFilters] = useState({
        subject: '',
        semester: '',
        chapter: '',
        sortBy: 'newest'
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0
    });
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, [filters, pagination.page]);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            
            if (filters.subject) params.append('subject', filters.subject);
            if (filters.semester) params.append('semester', filters.semester);
            if (filters.chapter) params.append('chapter', filters.chapter);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            
            params.append('page', pagination.page);
            params.append('limit', pagination.limit);

            const response = await axios.get(`/api/v1/videos?${params}`);
            
            setVideos(response.data.data);
            setPagination(prev => ({
                ...prev,
                total: response.data.pagination.total,
                pages: response.data.pagination.pages
            }));
        } catch (error) {
            console.error('❌ Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Video Lectures</h1>
                    <p className="text-gray-400">Stream educational video lectures directly on our platform</p>
                </div>

                {/* Filters */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Subject Filter */}
                        <select
                            name="subject"
                            value={filters.subject}
                            onChange={handleFilterChange}
                            className="bg-gray-700 text-white rounded px-4 py-2"
                        >
                            <option value="">All Subjects</option>
                            <option value="data structures">Data Structures</option>
                            <option value="algorithms">Algorithms</option>
                            <option value="web development">Web Development</option>
                            <option value="database">Database</option>
                        </select>

                        {/* Semester Filter */}
                        <select
                            name="semester"
                            value={filters.semester}
                            onChange={handleFilterChange}
                            className="bg-gray-700 text-white rounded px-4 py-2"
                        >
                            <option value="">All Semesters</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                        </select>

                        {/* Chapter Filter */}
                        <input
                            type="number"
                            name="chapter"
                            placeholder="Chapter number"
                            value={filters.chapter}
                            onChange={handleFilterChange}
                            className="bg-gray-700 text-white rounded px-4 py-2"
                        />

                        {/* Sort Filter */}
                        <select
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={handleFilterChange}
                            className="bg-gray-700 text-white rounded px-4 py-2"
                        >
                            <option value="newest">Newest</option>
                            <option value="views">Most Viewed</option>
                            <option value="rating">Top Rated</option>
                            <option value="trending">Trending</option>
                        </select>
                    </div>
                </div>

                {/* Videos Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        <p>No videos found. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {videos.map(video => (
                                <VideoCard 
                                    key={video._id}
                                    video={video}
                                    onClick={() => setSelectedVideo(video)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center gap-2">
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                                    className={`px-4 py-2 rounded ${
                                        pagination.page === page
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <VideoModal 
                    video={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </div>
    );
};

export default VideoLibrary;