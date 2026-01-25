// 🎓 FILE: FRONTEND/src/pages/EditAcademicProfile.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  updateAcademicProfile, 
  getAcademicProfile,
  getCollegeList 
} from '../../REDUX/Slices/academicProfileSlice';

const EditAcademicProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const academicProfile = useSelector((state) => state?.academicProfile?.profile);
  const collegeList = useSelector((state) => state?.academicProfile?.collegeList);
  const loading = useSelector((state) => state?.academicProfile?.loading);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const userData = useSelector((state) => state?.auth?.data);

  const [formData, setFormData] = React.useState({
    semester: '',
    college: '',
    branch: '',
  });

  // Load existing data and college list on mount
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load academic profile data if exists
    if (academicProfile) {
      setFormData({
        semester: academicProfile.semester || '',
        college: academicProfile.college?.value || academicProfile.college?.name || '',
        branch: academicProfile.branch || '',
      });
    }

    // Load college list
    if (collegeList.length === 0) {
      dispatch(getCollegeList());
    }
  }, [isLoggedIn, navigate, academicProfile, collegeList.length, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.semester || !formData.college || !formData.branch) {
      alert('Please fill all fields');
      return;
    }

    try {
      const result = await dispatch(updateAcademicProfile(formData));
      if (result.payload) {
        // Success - navigate back
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/profile"
              className="text-blue-400 hover:text-blue-300 mb-4 inline-block"
            >
              ← Back to Profile
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">Academic Profile</h1>
            <p className="text-gray-400">Update your academic information</p>
          </div>

          {/* Form Card */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none transition"
                  required
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* College */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  College <span className="text-red-500">*</span>
                </label>
                <select
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none transition"
                  required
                >
                  <option value="">Select College</option>
                  {collegeList.length > 0 ? (
                    collegeList.map((college) => (
                      <option key={college.value} value={college.value}>
                        {college.label}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading colleges...</option>
                  )}
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Branch <span className="text-red-500">*</span>
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none transition"
                  required
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">Computer Science Engineering (CSE)</option>
                  <option value="ECE">Electronics and Communication Engineering (ECE)</option>
                  <option value="ME">Mechanical Engineering (ME)</option>
                  <option value="CE">Civil Engineering (CE)</option>
                  <option value="EE">Electrical Engineering (EE)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="BT">Biotechnology (BT)</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? 'Saving...' : 'Save Academic Profile'}
                </button>
              </div>
            </form>

            {/* Current Info (if exists) */}
            {academicProfile?.isCompleted && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Current Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-400">Semester</p>
                    <p className="text-lg font-semibold text-white">
                      {academicProfile.semester}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-400">College</p>
                    <p className="text-lg font-semibold text-white">
                      {academicProfile.college?.name?.substring(0, 15)}...
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-400">Branch</p>
                    <p className="text-lg font-semibold text-white">
                      {academicProfile.branch}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAcademicProfile;