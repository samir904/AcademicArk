import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../HELPERS/Toaster';
import { updateProfile } from '../../REDUX/Slices/authslice';

// Icon components
const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CameraIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SaveIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function Updateprofile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const image_sec = useSelector((state) => state?.auth?.data?.avatar?.secure_url);
  const user_name = useSelector((state) => state?.auth?.data?.fullName);
  const userEmail = useSelector((state) => state?.auth?.data?.email);

  const [previewimage, setpreviewimage] = useState(image_sec || null);
  const [formdata, setformdata] = useState({
    fullName: user_name || '',
    avatar: ''
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setformdata({
      ...formdata,
      [name]: value
    });
  }

  async function handleImage(e) {
    e.preventDefault();
    const uploadImage = e.target.files[0];

    if (!uploadImage) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(uploadImage.type)) {
      showToast.error('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (5MB)
    if (uploadImage.size > 5 * 1024 * 1024) {
      showToast.error('Image size should be less than 5MB');
      return;
    }

    setformdata({
      ...formdata,
      avatar: uploadImage
    });

    const fileReader = new FileReader();
    fileReader.readAsDataURL(uploadImage);
    fileReader.addEventListener("load", () => {
      setpreviewimage(fileReader.result);
    });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!formdata.fullName.trim()) {
      showToast.error("Full name is required");
      return;
    }

    if (formdata.fullName.trim().length < 2) {
      showToast.error("Full name must be at least 2 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const formres = new FormData();
      formres.append("fullName", formdata.fullName.trim());
      
      if (formdata.avatar) {
        formres.append("avatar", formdata.avatar);
      }

      const res = await dispatch(updateProfile(formres));
      
      if (res?.payload?.success) {
        showToast.success("Profile updated successfully!");
        navigate("/profile");
      }
    } catch (error) {
      showToast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/profile')}
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Profile</span>
            </button>
            
            <h1 className="text-4xl font-bold text-white mb-2">Update Profile</h1>
            <p className="text-gray-400">Keep your information up to date</p>
          </div>

          {/* Form Container */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <form onSubmit={handleFormSubmit} className="space-y-8">
              
              {/* Profile Picture Section */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 hover:border-white/40 transition-all duration-300 shadow-2xl">
                    {previewimage ? (
                      <img
                        src={previewimage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <UserIcon className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Button Overlay */}
                  <label
                    htmlFor="avatar"
                    className="absolute bottom-2 right-2 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                  >
                    <CameraIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <input
                      type="file"
                      id="avatar"
                      name="avatar"
                      accept="image/*"
                      onChange={handleImage}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  Click the camera icon to change your profile picture
                </p>
                <p className="text-gray-500 text-xs">
                  Supported formats: JPEG, PNG, GIF (Max: 5MB)
                </p>
              </div>

              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formdata.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    disabled={isLoading}
                    required
                  />
                </div>
                {formdata.fullName.trim() && formdata.fullName.trim().length < 2 && (
                  <p className="mt-2 text-sm text-red-400">Name must be at least 2 characters long</p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={userEmail || ''}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed"
                  disabled
                />
                <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20 transition-all duration-300"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading || !formdata.fullName.trim() || formdata.fullName.trim().length < 2}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-5 h-5" />
                      <span>Update Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-3">Profile Tips</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>• Use a clear, professional photo for your profile picture</li>
              <li>• Keep your name up to date for better recognition</li>
              <li>• Profile changes may take a few moments to appear across the platform</li>
            </ul>
          </div>
        </div>
      </div>
  );
}
