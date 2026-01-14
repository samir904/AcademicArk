import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bookmarkVideoLecture } from '../../REDUX/Slices/videoLecture.slice';
import { shallowEqual } from 'react-redux';
import { Play, Eye, Bookmark } from 'lucide-react';
import { useState } from 'react';

export default function VideoCard({ video }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.data, shallowEqual);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!video) {
    return (
      <div className="text-white text-center py-8 bg-[#111111] border border-[#1F1F1F] rounded-lg">
        No video data available
      </div>
    );
  }

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      console.log('Please login to bookmark');
      return;
    }
    
    dispatch(bookmarkVideoLecture(video._id));
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="bg-[#111111] border border-[#1F1F1F] rounded-lg overflow-hidden hover:border-[#9CA3AF]/30 transition-colors duration-200">
      
      {/* Video Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-black group cursor-pointer">
        {/* Thumbnail */}
        <img
          src={video.thumbnailUrl || 'https://via.placeholder.com/320x180?text=Video'}
          alt={video.title || 'Video'}
          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-200"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/320x180?text=Video';
          }}
        />

        {/* Play Button Overlay */}
        <Link to={`/video/${video._id}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-200 opacity-0 group-hover:opacity-100">
          <div className="w-12 h-12 flex items-center justify-center bg-[#9CA3AF] rounded-full transition hover:bg-white">
            <Play className="w-6 h-6 text-[#0B0B0B] fill-current ml-1" />
          </div>
        </div>
        </Link>

        {/* Views Badge - Bottom Left */}
        <div className="absolute bottom-2 left-2 z-10">
          <div className="bg-[#0B0B0B]/90 text-[#B3B3B3] text-xs px-2 py-1 rounded flex items-center gap-1 border border-[#1F1F1F]">
            <Eye className="w-3 h-3" />
            <span>{(video.views || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Category Badge - Top Right */}
        <div className="absolute top-2 right-2">
          <span className="bg-[#9CA3AF]/20 border border-[#9CA3AF]/50 text-[#B3B3B3] text-xs font-semibold px-2 py-1 rounded">
            Video
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        
        {/* Title */}
        <Link to={`/video/${video._id}`}>
          <h3 className="text-sm font-semibold text-white hover:text-[#9CA3AF] transition-colors line-clamp-2 cursor-pointer">
            {video.title || 'Untitled Video'}
          </h3>
        </Link>

        {/* Subject, Chapter, Semester */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#B3B3B3]">
          <span className="bg-[#141414] border border-[#1F1F1F] px-2 py-1 rounded">
            {video.subject || 'N/A'}
          </span>
          <span className="bg-[#141414] border border-[#1F1F1F] px-2 py-1 rounded">
            Ch {video.chapterNumber || '1'}
          </span>
          <span className="bg-[#141414] border border-[#1F1F1F] px-2 py-1 rounded">
            Sem {video.semester || 'N/A'}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#B3B3B3] line-clamp-2">
          {video.description || 'No description available'}
        </p>

        {/* Uploader Info */}
        <div className="flex items-center gap-2 pt-2 pb-3 border-t border-[#1F1F1F]">
          {video.uploadedBy?.avatar?.secure_url ? (
            <img
              src={video.uploadedBy.avatar.secure_url}
              alt={video.uploadedBy.fullName || 'Uploader'}
              className="w-8 h-8 rounded-full object-cover border border-[#1F1F1F]"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#9CA3AF]/20 border border-[#9CA3AF]/50 flex items-center justify-center text-[#9CA3AF] text-xs font-semibold">
              {video.uploadedBy?.fullName?.charAt(0)?.toUpperCase() || 'T'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium capitalize text-white truncate">
              {video.uploadedBy?.fullName || 'Unknown Teacher'}
            </p>
            <p className="text-xs text-[#B3B3B3]">
              {video.createdAt ? new Date(video.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : 'Date unknown'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link
            to={`/video/${video._id}`}
            className="flex-1 bg-[#9CA3AF] text-[#0B0B0B] hover:bg-white py-2 px-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-1"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Watch</span>
          </Link>
          
          <button
            onClick={handleBookmark}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-1 ${
              isBookmarked
                ? 'bg-[#9CA3AF]/20 border border-[#9CA3AF]/50 text-[#9CA3AF]'
                : 'bg-[#141414] border border-[#1F1F1F] text-[#B3B3B3] hover:border-[#9CA3AF]/50'
            }`}
            title={isBookmarked ? 'Remove from bookmarks' : 'Bookmark this video'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
