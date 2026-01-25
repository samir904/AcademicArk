import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { shallowEqual } from 'react-redux';
import { 
  getVideoLecture, 
  incrementVideoViewCount,
  addVideoRating,
  bookmarkVideoLecture
} from '../../REDUX/Slices/videoLecture.slice';

// Lucide Icons
import {
  Play,
  Bookmark,
  Share2,
  ArrowLeft,
  Star,
  Eye,
  Calendar,
  Clock,
  User,
  MessageSquare,
  Send,
  X,
  Film,
  BookOpen,
  Award,
  Heart,
  Check,
  Loader,
  AlertCircle,
  University
} from 'lucide-react';

export default function VideoWatch() {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  
  const { currentVideo, loadingDetail, errorDetail } = useSelector(
    state => state.videoLecture,
    shallowEqual
  );
  const user = useSelector(state => state.auth.data, shallowEqual);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (videoId) {
      dispatch(getVideoLecture(videoId));
      dispatch(incrementVideoViewCount(videoId));
    }
  }, [videoId, dispatch]);

  useEffect(() => {
    if (currentVideo?.bookmarkedBy?.includes(user?._id)) {
      setIsBookmarked(true);
    }
  }, [currentVideo, user]);

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (!rating) {
      alert('Please select a rating');
      return;
    }
    if (!user) {
      alert('Please login to rate');
      return;
    }
    dispatch(addVideoRating({ videoId, rating, review }));
    setRating(0);
    setReview('');
    setShowReviewForm(false);
  };

  const handleBookmark = () => {
    if (!user) {
      alert('Please login to bookmark');
      return;
    }
    dispatch(bookmarkVideoLecture(videoId));
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loadingDetail) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-[#0B0B0B]">
          <div className="text-center">
            <Loader className="w-16 h-16 text-[#9CA3AF] animate-spin mx-auto mb-4" />
            <p className="text-[#B3B3B3] text-lg">Loading video...</p>
          </div>
        </div>
      </>
    );
  }

  if (errorDetail || !currentVideo) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-[#0B0B0B]">
          <div className="text-center max-w-md">
            <div className="bg-[#111111] border border-[#1F1F1F] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-[#B3B3B3]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Video Not Found</h2>
            <p className="text-[#B3B3B3] mb-8">{errorDetail || 'The video you are looking for does not exist'}</p>
            <Link 
              to="/notes" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#9CA3AF] text-[#0B0B0B] hover:bg-white rounded-lg font-bold transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Notes
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0B0B0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Video Player Container */}
          <div className="mb-8">
            <div className="relative w-full bg-black rounded-lg overflow-hidden border border-[#1F1F1F]">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {currentVideo?.embedUrl ? (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={currentVideo.embedUrl}
                    title={currentVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#0B0B0B]">
                    <div className="text-center">
                      <Film className="w-20 h-20 text-[#1F1F1F] mx-auto mb-4" />
                      <p className="text-[#B3B3B3] mb-4">Video embed not available</p>
                      {currentVideo?.videoUrl && (
                        <a 
                          href={currentVideo.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-white font-semibold transition"
                        >
                          Watch on {currentVideo?.platform || 'YouTube'}
                          <Play className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Content - 3 Columns */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Video Header */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-6">
                  {currentVideo?.title}
                </h1>
                
                {/* Tags/Badges */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="inline-flex items-center gap-2 bg-transparent border border-[#1F1F1F] text-[#B3B3B3] px-4 py-2 rounded-lg text-sm font-medium cursor-default">
                    <BookOpen className="w-4 h-4" />
                    {currentVideo?.subject}
                  </div>
                  <div className="inline-flex items-center gap-2 bg-transparent border border-[#1F1F1F] text-[#B3B3B3] px-4 py-2 rounded-lg text-sm font-medium cursor-default">
                    <Award className="w-4 h-4" />
                    Chapter {currentVideo?.chapterNumber}
                  </div>
                  <div className="inline-flex items-center gap-2 bg-transparent border border-[#1F1F1F] text-[#B3B3B3] px-4 py-2 rounded-lg text-sm font-medium cursor-default">
                    <Star className="w-4 h-4" />
                    Sem {currentVideo?.semester}
                  </div>
                  <div className="inline-flex items-center gap-2 bg-transparent border border-[#1F1F1F] text-[#B3B3B3] px-4 py-2 rounded-lg text-sm font-medium cursor-default">
                    <University className="w-4 h-4" />
                    {currentVideo?.university}
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-[#1F1F1F]">
                  <div className="bg-[#111111] border border-[#1F1F1F] rounded-lg p-4 cursor-default">
                    <div className="flex items-center gap-3 mb-2">
                      <Eye className="w-5 h-5 text-[#9CA3AF]" />
                      <span className="text-[#B3B3B3] text-sm">Views</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{(currentVideo?.views || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-[#111111] border border-[#1F1F1F] rounded-lg p-4 cursor-default">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-[#9CA3AF]" />
                      <span className="text-[#B3B3B3] text-sm">Uploaded</span>
                    </div>
                    <p className="text-xl font-bold text-white">{new Date(currentVideo?.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="bg-[#111111] border border-[#1F1F1F] rounded-lg p-4 cursor-default">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-[#9CA3AF]" />
                      <span className="text-[#B3B3B3] text-sm">Duration</span>
                    </div>
                    <p className="text-xl font-bold text-white">{currentVideo?.durationSeconds ? `${Math.round(currentVideo.durationSeconds / 60)}m` : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#111111] border border-[#1F1F1F] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#9CA3AF]" />
                  Description
                </h3>
                <p className="text-[#B3B3B3] leading-relaxed whitespace-pre-wrap">
                  {currentVideo?.description || 'No description available'}
                </p>
              </div>

              {/* Uploader Info */}
              <div className="bg-[#111111] border border-[#1F1F1F] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#9CA3AF]" />
                  Uploaded By
                </h3>
                <Link to={`/profile/${currentVideo?.uploadedBy?._id}`}>
                  <div className="flex items-center gap-4">
                    {currentVideo?.uploadedBy?.avatar?.secure_url ? (
                      <img
                        src={currentVideo.uploadedBy.avatar.secure_url}
                        alt={currentVideo.uploadedBy.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-[#1F1F1F]"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#9CA3AF]/20 border border-[#9CA3AF]/50 flex items-center justify-center text-[#9CA3AF] text-sm font-semibold">
                        {currentVideo?.uploadedBy?.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-lg font-bold capitalize text-white">
                        {currentVideo?.uploadedBy?.fullName || 'Unknown Teacher'}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Rating Section */}
              <div className="bg-[#111111] border border-[#1F1F1F] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#9CA3AF]" />
                  Rate This Video
                </h3>
                
                {!showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full px-4 py-3 bg-[#9CA3AF] text-[#0B0B0B] hover:bg-white rounded-lg font-semibold text-base transition flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Add Your Rating & Review
                  </button>
                ) : (
                  <form onSubmit={handleRatingSubmit} className="space-y-4">
                    {/* Star Rating */}
                    <div>
                      <p className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#9CA3AF]" />
                        Select Rating
                      </p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition"
                          >
                            <Star
                              className={`w-8 h-8 transition ${
                                (hoverRating || rating) >= star
                                  ? 'fill-[#9CA3AF] text-[#9CA3AF]'
                                  : 'text-[#1F1F1F] hover:text-[#9CA3AF]/50'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {rating > 0 && (
                        <p className="text-[#9CA3AF] mt-2 font-semibold flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          You selected {rating} star{rating !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    {/* Review Textarea */}
                    <div>
                      <label className="text-white font-semibold block mb-2">Your Review:</label>
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your thoughts about this video... (Optional)"
                        className="w-full bg-[#0B0B0B] border border-[#1F1F1F] rounded-lg px-3 py-2 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#9CA3AF] transition resize-none"
                        rows="4"
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-[#9CA3AF] text-[#0B0B0B] hover:bg-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReviewForm(false);
                          setRating(0);
                          setReview('');
                        }}
                        className="flex-1 px-4 py-2 bg-[#141414] border border-[#1F1F1F] hover:border-[#9CA3AF]/50 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Sidebar - 1 Column */}
            <div className="lg:col-span-1">
              
              {/* Action Buttons - Sticky */}
              <div className="sticky top-4 space-y-3 mb-8">
                
                {/* Save Button */}
                <button
                  onClick={handleBookmark}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    isBookmarked
                      ? 'bg-[#9CA3AF] text-[#0B0B0B] hover:bg-white'
                      : 'bg-[#111111] border border-[#1F1F1F] text-white hover:bg-[#141414]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="w-full py-3 px-4 bg-[#111111] border border-[#1F1F1F] text-white rounded-lg font-semibold transition hover:bg-[#141414] flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </>
                  )}
                </button>

                {/* Open Original Button */}
                {currentVideo?.videoUrl && (
                  <a
                    href={currentVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-[#111111] border border-[#1F1F1F] text-white rounded-lg font-semibold transition hover:bg-[#141414] flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Original</span>
                  </a>
                )}

                {/* Back Button */}
                <Link
                  to="/notes"
                  className="w-full py-3 px-4 bg-[#111111] border border-[#1F1F1F] text-white rounded-lg font-semibold transition hover:bg-[#141414] flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Link>
              </div>

              {/* More Content Card */}
              <div className="bg-[#111111] border border-[#1F1F1F] rounded-lg p-4">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Film className="w-5 h-5 text-[#9CA3AF]" />
                  More Content
                </h4>
                <p className="text-[#B3B3B3] text-sm mb-4">
                  Related videos from the same subject coming soon!
                </p>
                <button className="w-full py-2 px-3 bg-[#9CA3AF] text-[#0B0B0B] rounded-lg font-semibold text-sm transition hover:bg-white flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Browse Videos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
