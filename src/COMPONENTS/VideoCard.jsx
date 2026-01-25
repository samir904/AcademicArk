import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideo, toggleBookmarkVideo, rateVideo } from '../REDUX/Slices/videoSlice';
import { useNavigate } from 'react-router-dom';

export default function VideoCard({ video }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.auth);
    const { bookmarkingVideos, rating } = useSelector(state => state.video);

    const [showRatingModal, setShowRatingModal] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    const isBookmarked = video?.bookmarkedBy?.includes(userData?._id);
    const isBookmarking = bookmarkingVideos.includes(video._id);

    // Extract YouTube video ID from URL
    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const youtubeId = getYoutubeId(video?.youtubeUrl);

    const handleWatchVideo = () => {
        dispatch(getVideo(video._id));
        navigate(`/videos/watch/${video._id}`);
    };

    const handleToggleBookmark = () => {
        if (!userData) {
            navigate('/login');
            return;
        }
        dispatch(toggleBookmarkVideo(video._id));
    };

    const handleSubmitRating = () => {
        if (userRating === 0) {
            alert('Please select a rating');
            return;
        }
        dispatch(rateVideo({
            videoId: video._id,
            rating: userRating,
            review: userReview
        }));
        setShowRatingModal(false);
        setUserRating(0);
        setUserReview('');
    };

    return (
        <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            {/* Thumbnail */}
            <div className="relative overflow-hidden bg-black aspect-video">
                {/* YouTube Thumbnail */}
                {youtubeId ? (
                    <img
                        src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
                        <span className="text-4xl">🎥</span>
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                        onClick={handleWatchVideo}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform"
                    >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 3v14l11-7z" />
                        </svg>
                    </button>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                    </div>
                )}

                {/* Difficulty Badge */}
                {video.difficulty && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">
                        {video.difficulty}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Chapter Info */}
                <div className="text-xs text-gray-400 font-medium">
                    Chapter {video.chapter?.number}: {video.chapter?.title}
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {video.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-400 line-clamp-2">
                    {video.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex gap-3">
                        <span className="flex items-center gap-1">
                            👁️ {video.statistics?.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            ⭐ {video.averageRating?.toFixed(1) || 0}/5
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-700">
                    <button
                        onClick={handleWatchVideo}
                        className="flex-1 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 3v14l11-7z" />
                        </svg>
                        Watch
                    </button>

                    <button
                        onClick={handleToggleBookmark}
                        disabled={isBookmarking}
                        className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                            isBookmarked
                                ? 'bg-yellow-600/20 text-yellow-400'
                                : 'bg-gray-700/20 text-gray-400 hover:bg-gray-600/20'
                        } disabled:opacity-50`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark video'}
                    >
                        {isBookmarking ? 'Adding...' : (
                            <>
                                <svg className="w-4 h-4 inline mr-1" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                Save
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => setShowRatingModal(true)}
                        className="px-3 py-2 bg-orange-600/20 hover:bg-orange-600/40 text-orange-400 text-xs font-semibold rounded-lg transition-all"
                    >
                        ⭐ Rate
                    </button>
                </div>
            </div>

            {/* Rating Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl p-6 max-w-sm w-full border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Rate this Video</h3>

                        {/* Star Rating */}
                        <div className="flex gap-3 justify-center mb-4">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setUserRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="text-4xl transition-transform hover:scale-125"
                                >
                                    {(hoveredRating || userRating) >= star ? '⭐' : '☆'}
                                </button>
                            ))}
                        </div>

                        {/* Review Text */}
                        <textarea
                            value={userReview}
                            onChange={(e) => setUserReview(e.target.value)}
                            placeholder="Write your review (optional)"
                            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg mb-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="3"
                        />

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRatingModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitRating}
                                disabled={rating || userRating === 0}
                                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-all"
                            >
                                {rating ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
