import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerVideoLecture } from '../../REDUX/Slices/videoLecture.slice';
import PageTransition from '../../COMPONENTS/PageTransition';

// Icon components (same as UploadNote)
const CloudUploadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlayIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const VideoIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ✨ NEW: Video category config
const VIDEO_CATEGORY_INFO = {
  'Lecture': {
    emoji: '🎥',
    description: 'Complete lecture videos covering topics and concepts'
  },
  'Tutorial': {
    emoji: '👨‍🏫',
    description: 'Step-by-step tutorials and problem-solving videos'
  },
  'Solution': {
    emoji: '✅',
    description: 'Problem solutions and worked examples'
  },
  'Extra': {
    emoji: '⭐',
    description: 'Extra resources, tips, and advanced topics'
  }
};

export default function UploadVideoLecture() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const youtubeInputRef = useRef(null);

  const { uploading } = useSelector(state => state.videoLecture);
  const { role } = useSelector(state => state.auth.data || {});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    course: 'BTECH',
    semester: '',
    university: 'AKTU',
    chapterNumber: '',
    chapterTitle: '',
    videoUrl: '',
    category: 'Lecture' // NEW: category for videos
  });

  const [videoPreview, setVideoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [youtubeError, setYoutubeError] = useState('');

  // Extract YouTube ID and build thumbnail/embed URLs
  const extractYouTubeData = (url) => {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      const videoId = match[1];
      return {
        videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
      };
    }
    return null;
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    else if (formData.subject.trim().length < 2) newErrors.subject = 'Subject must be at least 2 characters';

    if (!formData.semester) newErrors.semester = 'Semester is required';
    
    if (!formData.chapterNumber) newErrors.chapterNumber = 'Chapter number is required';
    else if (isNaN(formData.chapterNumber) || formData.chapterNumber < 1) {
      newErrors.chapterNumber = 'Chapter number must be a positive number';
    }

    if (!formData.chapterTitle.trim()) newErrors.chapterTitle = 'Chapter title is required';

    if (!formData.videoUrl.trim()) newErrors.videoUrl = 'YouTube URL is required';
    else {
      const youtubeData = extractYouTubeData(formData.videoUrl);
      if (!youtubeData) {
        newErrors.videoUrl = 'Invalid YouTube URL. Please use the full URL (e.g., https://www.youtube.com/watch?v=...).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auth check
  if (!role || !['TEACHER', 'ADMIN'].includes(role)) {
    return (
      <>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <XCircleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400 mb-4">You need TEACHER or ADMIN privileges to upload videos.</p>
            <button 
              onClick={() => navigate('/videos')} 
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600"
            >
              Browse Videos
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle YouTube URL paste
  const handleYoutubeUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, videoUrl: url }));
    
    if (url.trim()) {
      const youtubeData = extractYouTubeData(url);
      if (youtubeData) {
        setVideoPreview(youtubeData);
        setYoutubeError('');
        if (errors.videoUrl) {
          setErrors(prev => ({ ...prev, videoUrl: '' }));
        }
      } else {
        setVideoPreview(null);
        setYoutubeError('Invalid YouTube URL format');
      }
    } else {
      setVideoPreview(null);
      setYoutubeError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const youtubeData = extractYouTubeData(formData.videoUrl);
    if (!youtubeData) {
      setErrors(prev => ({ ...prev, videoUrl: 'Invalid YouTube URL' }));
      return;
    }

    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      subject: formData.subject.trim(),
      course: formData.course,
      semester: parseInt(formData.semester),
      university: formData.university,
      chapterNumber: parseInt(formData.chapterNumber),
      chapterTitle: formData.chapterTitle.trim(),
      videoUrl: formData.videoUrl.trim(),
      // These will be generated on backend, but we can include them here too
    };

    try {
      const result = await dispatch(registerVideoLecture(submitData));
      if (result.payload?.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({
            title: '',
            description: '',
            subject: '',
            course: 'BTECH',
            semester: '',
            university: 'AKTU',
            chapterNumber: '',
            chapterTitle: '',
            videoUrl: '',
            category: 'Lecture'
          });
          setVideoPreview(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Success UI
  if (isSuccess) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Upload Successful!</h2>
              <p className="text-gray-400 mb-6">
                Your video lecture has been uploaded successfully and is now available for students.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setIsSuccess(false)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600"
                >
                  Upload Another Video
                </button>
                <button
                  onClick={() => navigate('/videos')}
                  className="w-full bg-white/10 border border-white/20 text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20"
                >
                  View All Videos
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlayIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Upload Video Lecture</h1>
            <p className="text-gray-400 text-lg">Share educational content and engage students with video lectures</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <DocumentIcon className="w-6 h-6" />
                  <span>Basic Information</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter video title (e.g., Data Structures - Linked Lists Introduction)"
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.title ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.title && <p className="mt-2 text-sm text-red-400">{errors.title}</p>}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Provide a detailed description of the video content, topics covered, key concepts, etc..."
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                        errors.description ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-400">{errors.description}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter subject name (e.g., Data Structures)"
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.subject ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.subject && (
                      <p className="mt-2 text-sm text-red-400">{errors.subject}</p>
                    )}
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Semester *
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.semester ? 'border-red-500' : 'border-white/20'
                      }`}
                    >
                      <option value="">Select Semester</option>
                      {[...Array(8)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                      ))}
                    </select>
                    {errors.semester && (
                      <p className="mt-2 text-sm text-red-400">{errors.semester}</p>
                    )}
                  </div>

                  {/* Chapter Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Chapter Number *
                    </label>
                    <input
                      type="number"
                      name="chapterNumber"
                      value={formData.chapterNumber}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      placeholder="e.g., 1, 2, 3..."
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.chapterNumber ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.chapterNumber && (
                      <p className="mt-2 text-sm text-red-400">{errors.chapterNumber}</p>
                    )}
                  </div>

                  {/* Chapter Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Chapter Title *
                    </label>
                    <input
                      type="text"
                      name="chapterTitle"
                      value={formData.chapterTitle}
                      onChange={handleInputChange}
                      placeholder="e.g., Introduction to Trees"
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.chapterTitle ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.chapterTitle && (
                      <p className="mt-2 text-sm text-red-400">{errors.chapterTitle}</p>
                    )}
                  </div>

                  {/* University */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      University
                    </label>
                    <select
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="AKTU">AKTU</option>
                    </select>
                  </div>

                  {/* Course */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Course
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="BTECH">B.Tech</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Video URL Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <CloudUploadIcon className="w-6 h-6" />
                  <span>YouTube Video Link</span>
                </h2>

                {/* YouTube URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    YouTube URL *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-3 text-red-500 text-lg">
                      ▶
                    </div>
                    <input
                      ref={youtubeInputRef}
                      type="text"
                      value={formData.videoUrl}
                      onChange={handleYoutubeUrlChange}
                      placeholder="Paste your YouTube URL here (e.g., https://www.youtube.com/watch?v=...)"
                      className={`w-full pl-10 pr-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.videoUrl || youtubeError ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                  </div>
                  {errors.videoUrl && <p className="mt-2 text-sm text-red-400">{errors.videoUrl}</p>}
                  {youtubeError && <p className="mt-2 text-sm text-red-400">{youtubeError}</p>}
                  <p className="mt-2 text-xs text-gray-500">
                    ✓ Copy the full URL from your YouTube video and paste it here
                  </p>
                </div>

                {/* Video Preview */}
                {videoPreview && (
                  <div className="mt-6">
                    <h3 className="text-white font-medium mb-4">Video Preview</h3>
                    <div className="bg-black/50 rounded-xl overflow-hidden border border-white/20">
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={videoPreview.embedUrl}
                          title={formData.title || 'Video preview'}
                          className="absolute top-0 left-0 w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <img
                        src={videoPreview.thumbnailUrl}
                        alt="Thumbnail"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">
                          Video ID: {videoPreview.videoId}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          ✓ Video verified and ready to upload
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/videos')}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20 disabled:opacity-50"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 disabled:hover:scale-100"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <CloudUploadIcon className="w-5 h-5" />
                      <span>Upload Video</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Guidelines */}
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <h4 className="font-medium text-white mb-2">Video Requirements</h4>
                <ul className="space-y-1">
                  <li>• Link must be from YouTube</li>
                  <li>• Video should be public or unlisted</li>
                  <li>• Clear audio and video quality</li>
                  <li>• Minimum duration: 1 minute recommended</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Content Guidelines</h4>
                <ul className="space-y-1">
                  <li>• Original or properly attributed content</li>
                  <li>• Relevant to the selected subject</li>
                  <li>• Educational and clear explanations</li>
                  <li>• No copyrighted material without permission</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="font-medium text-white mb-3">Tips for Better Engagement</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>
                <span className="text-blue-400">📝 Good Description:</span> Include topic summary, key concepts, and timestamps for different sections
              </p>
              <p>
                <span className="text-green-400">✅ Correct Category:</span> Use accurate chapter numbers so students can find videos easily
              </p>
              <p>
                <span className="text-yellow-400">🎯 Quality Content:</span> Videos with clear explanations get more views and bookmarks
              </p>
              <p>
                <span className="text-purple-400">🌟 Engagement:</span> Students can rate and bookmark your videos - engage with feedback!
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}