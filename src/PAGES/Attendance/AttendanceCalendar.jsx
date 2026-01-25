import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAttendance } from '../../REDUX/Slices/attendanceSlice';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function AttendanceCalendar() {
  const dispatch = useDispatch();
  const { attendance, currentSemester } = useSelector(state => state.attendance);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    dispatch(getAttendance(currentSemester));
  }, [currentSemester, dispatch]);

  // ✅ FIXED: Set first subject as default when attendance loads
  useEffect(() => {
    if (attendance && attendance.subjects && attendance.subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(attendance.subjects[0].subject); // ✅ FIXED: Added [0]
    }
  }, [attendance, selectedSubject]);

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // ✅ FIXED: Get status for a specific date
  const getStatusForDate = (date) => {
    if (!selectedSubject || !attendance) return null;
    
    const subject = attendance.subjects.find(s => s.subject === selectedSubject);
    if (!subject || !subject.records) return null;
    
    // Normalize the calendar date to midnight
    const calendarDate = new Date(date);
    calendarDate.setHours(0, 0, 0, 0);
    const calendarTimestamp = calendarDate.getTime();
    
    // Find matching record
    const record = subject.records.find(r => {
      const recordDate = new Date(r.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === calendarTimestamp;
    });
    
    return record?.status || null;
  };

  // ✨ UPDATED: Only present/absent colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-500/20 border-green-500/40 text-green-400';
      case 'absent':
        return 'bg-red-500/20 border-red-500/40 text-red-400';
      default:
        return 'bg-gray-800 border-gray-700 text-gray-400';
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = getCalendarDays();

  return (
    <>
      <div className="min-h-screen bg-black text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/attendance"
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold">Attendance Calendar</h1>
              <p className="text-gray-400 mt-2">Semester {currentSemester}</p>
            </div>
          </div>

          {/* Subject Selector */}
          {attendance && attendance.subjects && attendance.subjects.length > 0 ? (
            <>
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">Select Subject</label>
                <div className="flex gap-2 flex-wrap">
                  {attendance.subjects.map((subject) => (
                    <button
                      key={subject.subject}
                      onClick={() => setSelectedSubject(subject.subject)}
                      className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                        selectedSubject === subject.subject
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {subject.subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Controls */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{monthName}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPreviousMonth}
                      className="p-2 hover:bg-gray-800 rounded-lg transition"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={goToToday}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-medium"
                    >
                      Today
                    </button>
                    <button
                      onClick={goToNextMonth}
                      className="p-2 hover:bg-gray-800 rounded-lg transition"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Week day headers */}
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-400 pb-2"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Calendar days */}
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const status = getStatusForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isFuture = date > new Date();

                    return (
                      <div
                        key={date.toISOString()}
                        className={`aspect-square border rounded-lg p-2 flex flex-col items-center justify-center transition ${
                          status
                            ? getStatusColor(status)
                            : isFuture
                            ? 'bg-gray-800/50 border-gray-700/50 text-gray-500'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                        } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        <div className="text-lg font-medium">{date.getDate()}</div>
                        {status && (
                          <div className="text-xs mt-1 uppercase font-bold">
                            {status === 'present' ? '' : ''}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ✨ UPDATED: Legend - Only Present/Absent */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Legend</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-green-500/20 border border-green-500/40"></div>
                    <span className="text-sm text-gray-400">Present (P)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-red-500/20 border border-red-500/40"></div>
                    <span className="text-sm text-gray-400">Absent (A)</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
              <p className="text-gray-400 mb-4">No subjects added yet</p>
              <Link
                to="/attendance"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition inline-block"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
