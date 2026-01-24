import { Calendar, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AttendanceSection({ attendance }) {
  if (!attendance || !attendance.hasData) {
    return (
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-semibold text-white">
              Attendance Overview
            </h2>
          </div>
        </div>

        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl p-12 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No Attendance Data</h3>
          <p className="text-[#9CA3AF] mb-6">
            Attendance information will be available once your attendance is tracked.
          </p>
          <Link to="/attendance">
            <button className="w-full md:w-auto bg-[#9CA3AF] hover:bg-white text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2">
              Start Managing Attendance
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const { overallPercentage, totalSubjects, subjectsBelow75, status, primaryMessage } = attendance;

  const getStatusColor = (percent) => {
    if (percent >= 75) return 'text-green-400';
    if (percent >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBg = (percent) => {
    if (percent >= 75) return 'bg-[#0F0F0F]';
    if (percent >= 60) return 'bg-[#0F0F0F]';
    return 'bg-[#0F0F0F]';
  };

  const getStatusIcon = (status) => {
    if (status === 'GOOD' || status === 'SAFE') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status === 'WARNING') return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    return <AlertCircle className="w-5 h-5 text-red-400" />;
  };

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-semibold text-white">
            Attendance Overview
          </h2>
        </div>
        <Link 
          to="/attendance" 
          className="text-[#9CA3AF] hover:text-white text-sm font-medium transition"
        >
          Details →
        </Link>
      </div>

      <div className={`
        bg-[#0F0F0F]  rounded-2xl p-8 mb-6
        ${getStatusBg(overallPercentage)}
      `}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#1F1F1F"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={overallPercentage >= 75 ? '#22C55E' : overallPercentage >= 60 ? '#EAB308' : '#EF4444'}
                  strokeWidth="8"
                  strokeDasharray={`${(overallPercentage / 100) * 282.7} 282.7`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className={`text-2xl font-bold ${getStatusColor(overallPercentage)}`}>
                  {Math.round(overallPercentage)}%
                </p>
              </div>
            </div>
            <p className="text-[#9CA3AF] text-sm">Overall Attendance</p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#1F1F1F] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2">
                Total Subjects
              </p>
              <p className="text-2xl font-bold text-white">
                {totalSubjects}
              </p>
            </div>
            <div className="bg-[#1F1F1F] rounded-lg p-4">
              <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2">
                Below 75%
              </p>
              <p className={`text-2xl font-bold ${subjectsBelow75 > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {subjectsBelow75}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="bg-[#1F1F1F] rounded-lg p-4 mb-4">
              <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2">
                Status
              </p>
              <div className="flex items-center gap-2">
                {getStatusIcon(status)}
                <p className={`font-semibold ${getStatusColor(overallPercentage)}`}>
                  {status === 'RISK' ? 'At Risk' : status === 'WARNING' ? 'Warning' : 'Good'}
                </p>
              </div>
            </div>
            <Link to="/attendance">
              <button className="w-full bg-[#9CA3AF] hover:bg-white text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm">
                View Details →
              </button>
            </Link>
          </div>
        </div>

        {primaryMessage && (
          <div className="mt-6 pt-6 border-t border-[#1F1F1F]">
            <p className={`text-sm font-medium ${overallPercentage >= 75 ? 'text-green-400' : 'text-yellow-400'}`}>
              {primaryMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
