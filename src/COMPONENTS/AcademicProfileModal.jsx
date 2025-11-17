// 🎓 FILE: FRONTEND/src/COMPONENTS/AcademicProfileModal.jsx - REDESIGNED
// ✨ Matches SignupModal design - Beautiful, clean, professional

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAcademicProfile, getCollegeList } from '../REDUX/Slices/academicProfileSlice';

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const AcademicProfileModal = () => {
  const dispatch = useDispatch();
  const { isCompleted, showProfileModal, collegeList, loading } = useSelector(state => state.academicProfile);
  
  const [formData, setFormData] = useState({
    semester: '',
    college: '',
    customCollege: '',
    branch: ''
  });

  const [errors, setErrors] = useState({});
  const [showCustomInput, setShowCustomInput] = useState(false);

  const branches = [
    { value: 'CSE', label: 'Computer Science & Engineering (CSE)' },
    { value: 'IT', label: 'Information Technology (IT)' },
    { value: 'ECE', label: 'Electronics & Communication (ECE)' },
    { value: 'EEE', label: 'Electrical & Electronics (EEE)' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' },
    { value: 'CHEMICAL', label: 'Chemical Engineering' },
    { value: 'BIOTECH', label: 'Biotechnology' },
    { value: 'OTHER', label: 'Other' }
  ];

  // ✨ Fetch college list on mount
  useEffect(() => {
    if (showProfileModal && collegeList.length === 0) {
      dispatch(getCollegeList());
    }
  }, [showProfileModal, collegeList.length, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Show custom input if "Other" is selected
    if (name === 'college') {
      setShowCustomInput(value === 'Other');
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.college) newErrors.college = 'College is required';
    
    if (formData.college === 'Other') {
      if (!formData.customCollege.trim()) {
        newErrors.customCollege = 'Please enter your college name';
      } else if (formData.customCollege.length > 100) {
        newErrors.customCollege = 'College name must be less than 100 characters';
      }
    }
    
    if (!formData.branch) newErrors.branch = 'Branch is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    await dispatch(updateAcademicProfile({
      semester: parseInt(formData.semester),
      college: formData.college,
      customCollege: formData.customCollege,
      branch: formData.branch
    }));
  };

  if (isCompleted || !showProfileModal) return null;
const truncateText = (text, maxLength = 40) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-40" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-sm w-full relative">
          
          {/* Close Button */}
          {/* <button 
            onClick={() => {}} 
            disabled 
            className="absolute top-5 right-5 opacity-50 cursor-not-allowed"
          >
            <XIcon className="w-5 h-5 text-white/60" />
          </button> */}

          {/* Header */}
          <h2 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h2>
          <p className="text-white/70 mb-6">Help us personalize your learning experience!</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Current Semester <span className="text-blue-400">*</span>
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  errors.semester ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                }`}
              >
                <option className='bg-gray-900' value="">Select your semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option className='bg-gray-900' key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
              {errors.semester && <p className="text-red-400 text-xs mt-1">{errors.semester}</p>}
            </div>

            {/* College */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                College <span className="text-blue-400">*</span>
              </label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  errors.college ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                }`}
              >
                <option className='bg-gray-900' value="">Select your college</option>
                {collegeList.length > 0 ? (
                  collegeList.map(college => (
                    <option 
    key={college.value} 
    value={college.value}
    title={college.label}  // ✨ Hover tooltip
    style={{
      color: '#ffffff',
      backgroundColor: '#1f2937'
    }}
  >
    {truncateText(college.label, 35)}  {/* ✨ Truncated display */}
  </option>
                  ))
                ) : (
                  <>
                    <option  value="KCC Institute of Technology and Management">KCC Institute of Technology and Management</option>
                    <option value="GL Bajaj Institute of Technology and Management">GL Bajaj Institute of Technology and Management</option>
                    <option value="GNIOT (Greater Noida Institute of Technology)">GNIOT (Greater Noida Institute of Technology)</option>
                    <option value="NIET (Noida Institute of Engineering and Technology)">NIET (Noida Institute of Engineering and Technology)</option>
                    <option value="ABESIT (ABESIT GROUP OF INSTITUTIONS)">ABESIT (ABESIT GROUP OF INSTITUTIONS)</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
              {errors.college && <p className="text-red-400 text-xs mt-1">{errors.college}</p>}
            </div>

            {/* Custom College Input - Shows only if "Other" is selected */}
            {showCustomInput && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Enter Your College Name <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  name="customCollege"
                  value={formData.customCollege}
                  onChange={handleChange}
                  placeholder="e.g., Your College Name"
                  maxLength="100"
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                    errors.customCollege ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  <p className={`text-xs ${errors.customCollege ? 'text-red-400' : 'text-white/40'}`}>
                    {errors.customCollege || `${formData.customCollege.length}/100`}
                  </p>
                </div>
                <p className="text-xs text-blue-400 mt-2">
                  💡 Our team will verify your college information
                </p>
              </div>
            )}

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Branch <span className="text-blue-400">*</span>
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  errors.branch ? 'border-red-500/50' : 'border-white/20 hover:border-white/30'
                }`}
              >
                <option className='bg-gray-900' value="">Select your branch</option>
                {branches.map(branch => (
                  <option className='bg-gray-900' key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
              {errors.branch && <p className="text-red-400 text-xs mt-1">{errors.branch}</p>}
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Complete Profile</span>
                  </>
                )}
              </button>
              
              {/* <button
                type="button"
                onClick={() => {}}
                disabled
                className="w-full bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 opacity-50 cursor-not-allowed"
              >
                Skip for Now
              </button> */}
            </div>
          </form>

          {/* Info Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/60 leading-relaxed">
              <span className="text-blue-400 font-semibold">Why we need this?</span> We use your academic information to send personalized study materials, resources, and notifications relevant to your semester and branch.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcademicProfileModal;