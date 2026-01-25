import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAttendanceStats } from '../../REDUX/Slices/attendanceSlice';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { AttendanceSkeleton } from '../../COMPONENTS/Skeletons';

export default function AttendanceStats() {
  const dispatch = useDispatch();
  const { stats, currentSemester, loading } = useSelector(state => state.attendance);

  useEffect(() => {
    dispatch(getAttendanceStats(currentSemester));
  }, [currentSemester, dispatch]);

  if (loading) {
    return (
      <>
        <AttendanceSkeleton/>
      </>
    );
  }

  return (
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
          <div>
            <h1 className="text-4xl font-bold">Attendance Statistics</h1>
            <p className="text-gray-400 mt-2">Semester {currentSemester}</p>
          </div>
        </div>

        {stats && (
          <>
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
                <p className="text-blue-300 text-sm font-medium">Overall Attendance</p>
                <p className="text-5xl font-bold text-white mt-3">{stats.overallPercentage}%</p>
                <p className="text-gray-400 text-sm mt-2">
                  {stats.totalClassesAttended} of {stats.totalClasses} classes
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
                <p className="text-purple-300 text-sm font-medium">Total Subjects</p>
                <p className="text-5xl font-bold text-white mt-3">{stats.totalSubjects}</p>
                <p className="text-gray-400 text-sm mt-2">Active subjects</p>
              </div>

              <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-6">
                <p className="text-red-300 text-sm font-medium">Below Target</p>
                <p className="text-5xl font-bold text-white mt-3">{stats.subjectsBelow75}</p>
                <p className="text-gray-400 text-sm mt-2">Subjects under 75%</p>
              </div>
            </div>

            {/* Subject-wise breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Subject-wise Performance</h2>
              <div className="space-y-4">
                {stats.subjects && stats.subjects.map((subject) => (
                  <div key={subject.subject} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium capitalize">{subject.subject}</h3>
                      <span className={`text-2xl font-bold ${
                        subject.percentage >= 75 ? 'text-green-400' :
                        subject.percentage >= 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {subject.percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full transition-all duration-500 ${
                          subject.percentage >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          subject.percentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-red-500 to-pink-500'
                        }`}
                        style={{ width: `${subject.percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>{subject.classesAttended}/{subject.totalClasses} classes</span>
                      <span>Target: {subject.target}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
