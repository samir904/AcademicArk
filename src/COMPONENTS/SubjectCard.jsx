// 📱 FILE: FRONTEND/src/COMPONENTS/SubjectCard.jsx
import React, { useState, useMemo } from 'react';
import { TrashIcon, PencilIcon, ArrowUpIcon, ArrowDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { markAttendance, getAttendance } from '../REDUX/Slices/attendanceSlice';
import { calculateAttendancePrediction } from '../HELPERS/attendancePrediction'; // ✨ Import helper

export default function SubjectCard({ subject, onDelete, onEdit, semester }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [marking, setMarking] = useState(false);

  // ✨ FIXED: Add safety checks and defaults
  const currentPercentage = subject?.currentPercentage ?? 0;
  const classesAttended = subject?.classesAttended ?? 0;
  const totalClasses = subject?.totalClasses ?? 0;
  const targetPercentage = subject?.targetPercentage ?? 75;

  // Safety check for NaN
  const safePercentage = isNaN(currentPercentage) ? 0 : currentPercentage;

  // ✨ NEW: Calculate prediction using helper function
  const prediction = useMemo(() => {
    return calculateAttendancePrediction(classesAttended, totalClasses, targetPercentage);
  }, [classesAttended, totalClasses, targetPercentage]);

  const getPercentageColor = (percentage) => {
    if (percentage >= targetPercentage) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getTextColor = (percentage) => {
    if (percentage >= targetPercentage) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  // ✨ NEW: Get prediction styling based on type
  const getPredictionStyle = () => {
    if (!prediction) return '';
    
    switch (prediction.type) {
      case 'on-track':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'need':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'neutral':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default:
        return '';
    }
  };

  // ✨ NEW: Get prediction icon
  const getPredictionIcon = () => {
    if (!prediction) return null;
    
    switch (prediction.type) {
      case 'on-track':
        return <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />;
      case 'need':
        return <ArrowUpIcon className="w-4 h-4 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const handleMark = async (status) => {
    setMarking(true);
    await dispatch(markAttendance({
      semester,
      subject: subject.subject,
      status
    }));
    await dispatch(getAttendance(semester));
    setMarking(false);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    navigate(`/attendance/${semester}/subject/${encodeURIComponent(subject.subject)}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition group cursor-pointer"
    >
      {/* Header with Edit & Delete */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white capitalize">{subject.subject}</h3>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subject);
            }}
            className="p-2 hover:bg-blue-500/20 rounded-lg transition"
          >
            <PencilIcon className="w-5 h-5 text-blue-400" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 hover:bg-red-500/20 rounded-lg transition"
          >
            <TrashIcon className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-gray-800"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - currentPercentage / 100)}
              className="transition-all duration-500"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={getPercentageColor(currentPercentage)} stopOpacity="1" />
                <stop offset="100%" className={getPercentageColor(currentPercentage)} stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${getTextColor(currentPercentage)}`}>
              {currentPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Classes Attended</span>
          <span className="text-white font-medium">{classesAttended}/{totalClasses}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Target</span>
          <span className="text-white font-medium">{targetPercentage}%</span>
        </div>
      </div>

      {/* ✨ NEW: INTELLIGENT Prediction Box - Shows 3 States */}
      {prediction && (
        <div className={`mb-4 p-3 rounded-lg border ${getPredictionStyle()}`}>
          <div className="flex items-start gap-2">
            {getPredictionIcon()}
            <div className="flex-1">
              <p className="text-xs font-medium leading-relaxed">
                {prediction.message}
              </p>
            </div>
          </div>

          {/* ✨ Additional info based on state */}
          {/* {prediction.type === 'on-track' && prediction.classes > 0 && (
            <div className="mt-2 pt-2 border-t border-green-500/20">
              <p className="text-xs text-green-300">
                💡 Your buffer: {prediction.classes} class{prediction.classes > 1 ? 'es' : ''}
              </p>
            </div>
          )} */}
          
          {/* {prediction.type === 'need' && (
            <div className="mt-2 pt-2 border-t border-red-500/20">
              <p className="text-xs text-red-300">
                📊 Required attendance: {Math.round(((classesAttended + prediction.classes) / (totalClasses + prediction.classes)) * 100)}%
              </p>
            </div>
          )} */}

          {prediction.type === 'neutral' && (
            <div className="mt-2 pt-2 border-t border-blue-500/20">
              <p className="text-xs text-blue-300">
                🚀 Start tracking to see your predictions
              </p>
            </div>
          )}
        </div>
      )}

      {/* Present/Absent Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleMark('present');
          }}
          disabled={marking}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✓ Present
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleMark('absent');
          }}
          disabled={marking}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✗ Absent
        </button>
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-2">Marks for today</p>
    </div>
  );
}