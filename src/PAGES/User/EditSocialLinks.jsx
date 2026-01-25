// src/pages/EditSocialLinks.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateSocialLinks, toggleProfileVisibility } from '../../REDUX/Slices/authslice';

export default function EditSocialLinks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.data);
  const loading = useSelector(state => state.auth.loading);

  const [formData, setFormData] = useState({
    bio: userData?.bio || '',
    github: userData?.socialLinks?.github || '',
    linkedin: userData?.socialLinks?.linkedin || '',
    twitter: userData?.socialLinks?.twitter || '',
    website: userData?.socialLinks?.website || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(updateSocialLinks(formData));
    if (res.payload?.success) {
      navigate('/profile');
    }
  };

  const handleToggleVisibility = async () => {
    await dispatch(toggleProfileVisibility());
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link to="/profile" className="text-gray-400 hover:text-white flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Profile</span>
            </Link>
          </div>

          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Edit Social Links</h1>

            {/* Profile Visibility Toggle */}
            <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1">Public Profile</h3>
                  <p className="text-sm text-gray-400">
                    {userData?.isProfilePublic ? 'Your profile is visible to everyone' : 'Your profile is private'}
                  </p>
                </div>
                <button
                  onClick={handleToggleVisibility}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    userData?.isProfilePublic ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      userData?.isProfilePublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell others about yourself..."
                  rows={4}
                  maxLength={200}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">{formData.bio.length}/200 characters</p>
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Twitter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Twitter/X</label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
