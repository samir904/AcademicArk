import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DeleteConfirmModal from '../../COMPONENTS/DeleteConfirmModal'; // ✨ ADD THIS
import {
  getAttendance,
  getAttendanceStats,
  setCurrentSemester,
  addSubject,
  deleteSubject,
  editSubject  // ✨ NEW
} from '../../REDUX/Slices/attendanceSlice';
import SubjectCard from '../../COMPONENTS/SubjectCard';
import { PlusIcon, ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import HomeLayout from '../../LAYOUTS/Homelayout';
import Alert from '../../COMPONENTS/Alert'; // ✨ ADD THIS
import LoginRequiredModal from '../../COMPONENTS/LoginRequiredModal'; // ✨ ADD THIS

export default function AttendanceDashboard() {
  const dispatch = useDispatch();
  const { attendance, stats, currentSemester, loading } = useSelector(state => state.attendance);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);  // ✨ NEW
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // ✨ NEW
  const [subjectToDelete, setSubjectToDelete] = useState(null); // ✨ NEW
 // ✨ NEW: Alert state
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [showLowAttendanceModal, setShowLowAttendanceModal] = useState(false); // ✨ NEW
const [showLoginModal, setShowLoginModal] = useState(false); // ✨ ADD THIS

const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
 
  // ✨ UPDATED: Include initial classes
  const [newSubject, setNewSubject] = useState({ 
    name: '', 
    target: 75,
    initialTotalClasses: 0,
    initialPresentClasses: 0
  });

  useEffect(() => {
    dispatch(getAttendance(currentSemester));
    dispatch(getAttendanceStats(currentSemester));
  }, [currentSemester, dispatch]);

  // ✨ UPDATED: Better validation
  const handleAddSubject = async (e) => {
    e.preventDefault();
    
    // Clear previous alerts
    setAlertMessage('');
    
    if (!newSubject.name.trim()) {
      setAlertMessage('Subject name is required');
      setAlertType('error');
      return;
    }

    const totalClasses = newSubject.initialTotalClasses || 0;
    const presentClasses = newSubject.initialPresentClasses || 0;

    if (presentClasses > totalClasses) {
      setAlertMessage('Present classes cannot exceed total classes');
      setAlertType('error');
      return;
    }

    await dispatch(addSubject({
      semester: currentSemester,
      subject: newSubject.name,
      targetPercentage: newSubject.target,
      initialTotalClasses: totalClasses,
      initialPresentClasses: presentClasses
    }));

    setNewSubject({ name: '', target: 75, initialTotalClasses: 0, initialPresentClasses: 0 });
    setAlertMessage('');
    setShowAddModal(false);
    dispatch(getAttendance(currentSemester));
  };

  // ✨ UPDATED: Better validation for edit
  const handleEditSubject = async (e) => {
    e.preventDefault();
    
    setAlertMessage('');
    
    if (!selectedSubject) return;

    if (selectedSubject.initialPresentClasses > selectedSubject.initialTotalClasses) {
      setAlertMessage('Present classes cannot exceed total classes');
      setAlertType('error');
      return;
    }

    await dispatch(editSubject({
      semester: currentSemester,
      subject: selectedSubject.subject,
      initialTotalClasses: selectedSubject.initialTotalClasses,
      initialPresentClasses: selectedSubject.initialPresentClasses,
      targetPercentage: selectedSubject.targetPercentage
    }));

    setShowEditModal(false);
    setSelectedSubject(null);
    setAlertMessage('');
    dispatch(getAttendance(currentSemester));
  };
// ✨ NEW: Handle delete with modal
  const handleDeleteClick = (subject) => {
    setSubjectToDelete(subject);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!subjectToDelete) return;
    
    await dispatch(deleteSubject({ 
      semester: currentSemester, 
      subject: subjectToDelete.subject 
    }));
    
    setShowDeleteModal(false);
    setSubjectToDelete(null);
    dispatch(getAttendance(currentSemester));
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSubjectToDelete(null);
  };


  // ✨ NEW: Open edit modal
  const handleOpenEdit = (subject) => {
    setSelectedSubject({
      subject: subject.subject,
      initialTotalClasses: subject.initialTotalClasses || 0,
      initialPresentClasses: subject.initialPresentClasses || 0,
      targetPercentage: subject.targetPercentage
    });
    setShowEditModal(true);
  };

  if (loading && !attendance) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <HomeLayout>
      <div className="min-h-screen bg-black text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
         {/* Header - FIXED FOR MOBILE */}
<div className="mb-8">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Attendance Manager
      </h1>
      <p className="text-gray-400 mt-2">Track your daily attendance</p>
    </div>

    {/* ✨ FIXED: Stack buttons on mobile, horizontal on desktop */}
    <div className="flex gap-3 w-full sm:w-auto">
      <Link
        to="/attendance/calendar"
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
      >
        <CalendarIcon className="w-5 h-5" />
        <span>Calendar</span>
      </Link>
      <Link
        to="/attendance/stats"
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
      >
        <ChartBarIcon className="w-5 h-5" />
        <span>Stats</span>
      </Link>
    </div>
  </div>
</div>


          {/* Semester Selector */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">Select Semester</label>
            <select
              value={currentSemester}
              onChange={(e) => dispatch(setCurrentSemester(e.target.value))}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          {/* Overall Stats */}
{stats && (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
      <p className="text-blue-300 text-sm font-medium">Overall Attendance</p>
      <p className="text-4xl font-bold text-white mt-2">{stats.overallPercentage}%</p>
    </div>
    
    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
      <p className="text-purple-300 text-sm font-medium">Total Subjects</p>
      <p className="text-4xl font-bold text-white mt-2">{stats.totalSubjects}</p>
    </div>

    <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
      <p className="text-green-300 text-sm font-medium">Classes Attended</p>
      <p className="text-4xl font-bold text-white mt-2">{stats.totalClassesAttended}/{stats.totalClasses}</p>
    </div>

    {/* ✨ UPDATED: Clickable Card */}
    <button
      onClick={() => setShowLowAttendanceModal(true)}
      disabled={stats.subjectsBelow75 === 0}
      className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-6 hover:from-red-500/30 hover:to-red-600/30 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-left"
    >
      <p className="text-red-300 text-sm font-medium">Subjects Below 75%</p>
      <p className="text-4xl font-bold text-white mt-2">{stats.subjectsBelow75}</p>
      {stats.subjectsBelow75 > 0 && (
        <p className="text-xs text-red-400 mt-2">📊 Click to view details</p>
      )}
    </button>
  </div>
)}


         {/* Subjects Grid */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Subjects</h2>
              {/* ✨ FIX #2: Check login BEFORE opening modal */}
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowLoginModal(true); // Show login modal
                  } else {
                    setShowAddModal(true); // Show add subject modal
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                <PlusIcon className="w-5 h-5" />
                Add Subject
              </button>
            </div>

             {attendance && attendance.subjects && attendance.subjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attendance.subjects.map((subject) => (
                  <SubjectCard
                    key={subject.subject}
                    subject={subject}
                    semester={currentSemester}
                    onDelete={() => handleDeleteClick(subject)}
                    onEdit={handleOpenEdit}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
                {isLoggedIn ? (
                  <>
                    <p className="text-gray-400 mb-4">No subjects added yet</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                      Add Your First Subject
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Track Your Attendance</h3>
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Sign in to start tracking your class attendance, get insights, and never miss important targets.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                      Sign In to Get Started
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ✨ UPDATED: Add Subject Modal - No confusing 0s + Custom Alert */}
{showAddModal && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
      <h3 className="text-2xl font-bold mb-4">Add New Subject</h3>
      
      {/* ✨ NEW: Custom Alert */}
      {alertMessage && (
        <Alert 
          type={alertType} 
          message={alertMessage} 
          onClose={() => setAlertMessage('')} 
        />
      )}
      
      <form onSubmit={handleAddSubject}>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Subject Name *</label>
          <input
            type="text"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., Data Structures"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Total Classes (Already Held)</label>
          <input
            type="number"
            value={newSubject.initialTotalClasses === 0 ? '' : newSubject.initialTotalClasses}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setNewSubject({ ...newSubject, initialTotalClasses: value });
              // Clear alert on change
              if (alertMessage) setAlertMessage('');
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter total classes (optional)"
          />
          <p className="text-xs text-gray-500 mt-1">💡 Leave empty if starting fresh</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Present Classes (Already Attended)</label>
          <input
            type="number"
            value={newSubject.initialPresentClasses === 0 ? '' : newSubject.initialPresentClasses}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              const maxValue = newSubject.initialTotalClasses || 0;
              
              // Auto-cap at total classes
              const finalValue = value > maxValue ? maxValue : value;
              setNewSubject({ ...newSubject, initialPresentClasses: finalValue });
              
              // Show warning if exceeds
              if (value > maxValue && maxValue > 0) {
                setAlertMessage(`Present classes cannot exceed ${maxValue}`);
                setAlertType('warning');
              } else {
                setAlertMessage('');
              }
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter attended classes (optional)"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Must be ≤ {newSubject.initialTotalClasses || 0} (total classes)
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Target Percentage *</label>
          <input
            type="number"
            value={newSubject.target}
            onChange={(e) => setNewSubject({ ...newSubject, target: parseInt(e.target.value) || 75 })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            min="0"
            max="100"
            required
          />
          <p className="text-xs text-gray-500 mt-1">💡 Recommended: 75%</p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Add Subject
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAddModal(false);
              setAlertMessage('');
            }}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


          {/* ✨ NEW: Edit Subject Modal */}
          {showEditModal && selectedSubject && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
                <h3 className="text-2xl font-bold mb-4">Edit Subject</h3>
                <form onSubmit={handleEditSubject}>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Subject Name</label>
                    <input
                      type="text"
                      value={selectedSubject.subject}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Total Classes (Initial)</label>
                    <input
                      type="number"
                      value={selectedSubject.initialTotalClasses}
                      onChange={(e) => setSelectedSubject({ ...selectedSubject, initialTotalClasses: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder='0'
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Present Classes (Initial)</label>
                    <input
                      type="number"
                      value={selectedSubject.initialPresentClasses}
                      onChange={(e) => setSelectedSubject({ ...selectedSubject, initialPresentClasses: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder='0'
                      max={selectedSubject.initialTotalClasses}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-2">Target Percentage</label>
                    <input
                      type="number"
                      value={selectedSubject.targetPercentage}
                      onChange={(e) => setSelectedSubject({ ...selectedSubject, targetPercentage: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                      Update Subject
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedSubject(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* ✨ NEW: Low Attendance Modal */}
{showLowAttendanceModal && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Subjects Below 75%</h3>
          <p className="text-sm text-gray-400 mt-1">
            {stats.subjectsBelow75} {stats.subjectsBelow75 === 1 ? 'subject needs' : 'subjects need'} attention
          </p>
        </div>
        <button
          onClick={() => setShowLowAttendanceModal(false)}
          className="p-2 hover:bg-gray-800 rounded-lg transition"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Subject List */}
      {attendance && attendance.subjects && attendance.subjects.length > 0 ? (
        <div className="space-y-3">
          {attendance.subjects
            .filter(subject => subject.currentPercentage < 75)
            .sort((a, b) => a.currentPercentage - b.currentPercentage) // Sort by lowest first
            .map((subject) => {
              const getPercentageColor = (percentage) => {
                if (percentage >= 60) return 'text-yellow-400';
                return 'text-red-400';
              };

              const getProgressColor = (percentage) => {
                if (percentage >= 60) return 'bg-yellow-500';
                return 'bg-red-500';
              };

              return (
                <div
                  key={subject.subject}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-white capitalize">{subject.subject}</h4>
                    <span className={`text-2xl font-bold ${getPercentageColor(subject.currentPercentage)}`}>
                      {subject.currentPercentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(subject.currentPercentage)} transition-all duration-500`}
                        style={{ width: `${subject.currentPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Classes Attended</p>
                      <p className="text-white font-medium">{subject.classesAttended}/{subject.totalClasses}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Target</p>
                      <p className="text-white font-medium">{subject.targetPercentage}%</p>
                    </div>
                  </div>

                  {/* ✨ Show Prediction */}
                  {subject.prediction && subject.prediction.type === 'need' && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-xs text-red-400 font-medium">
                        📈 {subject.prediction.message}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No subjects below 75%</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowLowAttendanceModal(false)}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{/* ✨ FIX #4: Render Login Modal */}
          <LoginRequiredModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            feature="Attendance Tracking"
          />

          {/* ✨ NEW: Delete Confirmation Modal */}
          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            subjectName={subjectToDelete?.subject || ''}
            // loading={deleting}
          />
        </div>
      </div>
    </HomeLayout>
  );
}
