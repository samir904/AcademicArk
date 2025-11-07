import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { markAttendance, getAttendance } from '../REDUX/Slices/attendanceSlice';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function DailyMarkModal({ subject, semester, onClose }) {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T'));
  const [status, setStatus] = useState('present');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await dispatch(markAttendance({
      semester,
      subject: subject.subject,
      date: selectedDate,
      status,
      reason
    }));

    await dispatch(getAttendance(semester));
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold capitalize">{subject.subject}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <div className="grid grid-cols-2 gap-3">
              {['present', 'absent', 'holiday', 'leave'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-4 py-3 rounded-lg font-medium transition capitalize ${
                    status === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Reason (optional) */}
          {(status === 'absent' || status === 'leave') && (
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Reason (Optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                rows="3"
                placeholder="Why were you absent?"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium disabled:opacity-50"
            >
              {loading ? 'Marking...' : 'Mark Attendance'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
