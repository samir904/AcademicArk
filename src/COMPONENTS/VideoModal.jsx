import { useState, useEffect } from 'react';
import axios from 'axios';

const VideoModal = ({ video, onClose }) => {
    const [currentVideo, setCurrentVideo] = useState(video);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [watchProgress, setWatchProgress] = useState(0);

    const handleRate = async () => {
        try {
            await axios.post(`/api/v1/videos/${video._id}/rate`, {
                rating,
                review
            });
            alert('Rating submitted!');
        } catch (error) {
            console.error('❌ Error rating video:', error);
        }
    };

    const handleBookmark = async () => {
        try {
            const response = await axios.get(`/api/v1/videos/${video._id}/bookmark`);
            setIsBookmarked(response.data.isBookmarked);
        } catch (error) {
            console.error('❌ Error bookmarking video:', error);
        }
    };

    const handleVideoEnded = async () => {
        try {
            await axios.put(`/api/v1/videos/${video._id}/watch-progress`, {
                watchTimeSeconds: video.duration,
                watchPercentage: 100,
                completed: true
            });
        } catch (error) {
            console.error('❌ Error updating watch progress:', error);
        }
    };

    const handleVideoProgress = (e) => {
        const seconds = (e.currentTarget.currentTime || 0);
        const percentage = (seconds / video.duration) * 100;
        setWatchProgress(percentage);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                >
                    ✕
                </button>

                {/* Video Player */}
                <div className="w-full bg-black">
                    <iframe
                        width="100%"
                        height="500"
                        src={currentVideo.embedUrl}
                        title={currentVideo.title}
                        frameBorder="0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        onEnded={handleVideoEnded}
                    ></iframe>
                </div>

                {/* Video Info */}
                <div className="p-6 space-y-6">
                    {/* Title & Stats */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {currentVideo.title}
                        </h2>
                        <div className="flex items-center gap-6 text-gray-400 text-sm">
                            <span>👁️ {currentVideo.statistics?.views} views</span>
                            <span>⭐ {currentVideo.averageRating}/5 ({currentVideo.totalRatings} ratings)</span>
                            <span>📌 {currentVideo.totalBookmarks} bookmarks</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleBookmark}
                            className={`px-6 py-2 rounded-lg font-semibold transition ${
                                isBookmarked
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {isBookmarked ? '✓ Bookmarked' : '+ Bookmark'}
                        </button>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-white font-semibold mb-2">Description</h3>
                        <p className="text-gray-400">{currentVideo.description}</p>
                    </div>

                    {/* Chapter Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-gray-400 text-sm">Chapter</span>
                            <p className="text-white font-semibold">
                                Chapter {currentVideo.chapter?.number}: {currentVideo.chapter?.title}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-400 text-sm">Semester</span>
                            <p className="text-white font-semibold">Semester {currentVideo.semester}</p>
                        </div>
                    </div>

                    {/* Rating Section */}
                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-white font-semibold mb-4">Rate this video</h3>
                        <div className="flex gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`text-3xl transition ${
                                        star <= rating ? 'text-yellow-400' : 'text-gray-600'
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Write a review..."
                            className="w-full bg-gray-800 text-white rounded px-4 py-2 mb-4 resize-none"
                            rows="3"
                        />
                        <button
                            onClick={handleRate}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Submit Rating
                        </button>
                    </div>

                    {/* Reviews */}
                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-white font-semibold mb-4">Reviews ({currentVideo.ratings?.length})</h3>
                        <div className="space-y-4">
                            {currentVideo.ratings?.map(rating => (
                                <div key={rating._id} className="bg-gray-800 p-4 rounded">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img
                                            src={rating.user?.avatar?.secure_url || '/avatar.png'}
                                            alt={rating.user?.fullName}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div>
                                            <p className="text-white font-semibold">{rating.user?.fullName}</p>
                                            <p className="text-yellow-400 text-sm">{'⭐'.repeat(rating.rating)}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300">{rating.review}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoModal;