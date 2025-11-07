import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectDetails } from '../../REDUX/Slices/attendanceSlice';
import { ArrowLeftIcon, CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import HomeLayout from '../../LAYOUTS/Homelayout';

export default function SubjectDetails() {
  const { semester, subject } = useParams();
  const dispatch = useDispatch();
  const { subjectDetails, loading } = useSelector(state => state.attendance);

  useEffect(() => {
    dispatch(getSubjectDetails({ 
      semester, 
      subject: decodeURIComponent(subject) 
    }));
  }, [semester, subject, dispatch]);

  if (loading || !subjectDetails) {
    return (
      <HomeLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </HomeLayout>
    );
  }

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBg = (status) => {
    return status === 'present' 
      ? 'bg-green-500/20 border-green-500/40 text-green-400'
      : 'bg-red-500/20 border-red-500/40 text-red-400';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-black text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/attendance"
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold capitalize">{subjectDetails.subject}</h1>
              <p className="text-gray-400 mt-2">Semester {semester}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
              <p className="text-blue-300 text-sm font-medium mb-2">Current Attendance</p>
              <p className={`text-5xl font-bold ${getPercentageColor(subjectDetails.currentPercentage)}`}>
                {subjectDetails.currentPercentage}%
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
              <p className="text-purple-300 text-sm font-medium mb-2">Classes Attended</p>
              <p className="text-5xl font-bold text-white">
                {subjectDetails.classesAttended}/{subjectDetails.totalClasses}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
              <p className="text-green-300 text-sm font-medium mb-2">Target</p>
              <p className="text-5xl font-bold text-white">
                {subjectDetails.targetPercentage}%
              </p>
            </div>
          </div>

          {/* Initial Data Info */}
          {(subjectDetails.initialTotalClasses > 0) && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Initial Data</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Initial Total Classes</p>
                  <p className="text-2xl font-bold text-white">{subjectDetails.initialTotalClasses}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Initial Present Classes</p>
                  <p className="text-2xl font-bold text-white">{subjectDetails.initialPresentClasses}</p>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Records */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Attendance History</h2>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">{subjectDetails.records.length} records</span>
              </div>
            </div>

            {subjectDetails.records && subjectDetails.records.length > 0 ? (
              <div className="space-y-3">
                {subjectDetails.records.map((record, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border ${getStatusBg(record.status)}`}
                  >
                    <div className="flex items-center gap-4">
                      {record.status === 'present' ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <XCircleIcon className="w-6 h-6" />
                      )}
                      <div>
                        <p className="font-medium capitalize">{record.status}</p>
                        <p className="text-sm opacity-80">{formatDate(record.date)}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm opacity-80">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>No attendance records yet</p>
                <p className="text-sm mt-2">Start marking attendance from the dashboard</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
