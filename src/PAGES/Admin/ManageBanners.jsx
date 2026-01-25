import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listBanners,
  createBanner,
  updateBanner,    // ⭐ ADD THIS
  hideBanner,
  deleteBanner,
} from '../../REDUX/Slices/notificationSlice';

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const ROLES = ['USER', 'TEACHER', 'ADMIN'];

export default function ManageBanners() {
  const dispatch = useDispatch();
  const { allBanners } = useSelector((state) => state.notification);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);  // ⭐ NEW
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    expiresAt: '',
    targetSemesters: [],  // ⭐ NEW
    targetRoles: [],      // ⭐ NEW
  });

  useEffect(() => {
    dispatch(listBanners());
  }, [dispatch]);

  // ⭐ NEW: Toggle semester selection
  const toggleSemester = (semester) => {
    setFormData(prev => ({
      ...prev,
      targetSemesters: prev.targetSemesters.includes(semester)
        ? prev.targetSemesters.filter(s => s !== semester)
        : [...prev.targetSemesters, semester]
    }));
  };

  // ⭐ NEW: Toggle role selection
  const toggleRole = (role) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ⭐ NEW: Check if editing or creating
    if (editingId) {
      await dispatch(updateBanner({ id: editingId, data: formData }));
    } else {
      await dispatch(createBanner(formData));
    }
    
    resetForm();
    dispatch(listBanners());
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      expiresAt: '',
      targetSemesters: [],
      targetRoles: [],
    });
    setShowForm(false);
    setEditingId(null);
  };

  // ⭐ NEW: Edit handler
  const handleEdit = (banner) => {
    setFormData({
      title: banner.title,
      message: banner.message,
      type: banner.type,
      expiresAt: banner.expiresAt?.slice(0, 16) || '',
      targetSemesters: banner.targetSemesters || [],
      targetRoles: banner.targetRoles || [],
    });
    setEditingId(banner._id);
    setShowForm(true);
  };

  const handleHide = (id) => {
    dispatch(hideBanner(id)).then(() => dispatch(listBanners()));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      dispatch(deleteBanner(id)).then(() => dispatch(listBanners()));
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Manage Notification Banners</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
            >
              {showForm ? 'Cancel' : '+ Create Banner'}
            </button>
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 mb-8 space-y-6"
            >
              <h2 className="text-xl font-bold mb-4">
                {editingId ? 'Edit Banner' : 'Create New Banner'}
              </h2>

              {/* Basic Info */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Banner Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
                <textarea
                  placeholder="Banner Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="info">Info (Blue)</option>
                    <option value="success">Success (Green)</option>
                    <option value="warning">Warning (Yellow)</option>
                    <option value="error">Error (Red)</option>
                  </select>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* ⭐ Semester Targeting */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase">
                  Target Semesters (Leave empty for all)
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {SEMESTERS.map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => toggleSemester(sem)}
                      className={`p-3 rounded-lg font-semibold transition ${
                        formData.targetSemesters.includes(sem)
                          ? 'bg-blue-600 border border-blue-400 text-white'
                          : 'bg-gray-800 border border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      Sem {sem}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {formData.targetSemesters.length === 0 ? 'All semesters' : formData.targetSemesters.join(', ')}
                </p>
              </div>

              {/* ⭐ Role Targeting */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase">
                  Target Roles (Leave empty for all)
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={`p-3 rounded-lg font-semibold transition ${
                        formData.targetRoles.includes(role)
                          ? 'bg-purple-600 border border-purple-400 text-white'
                          : 'bg-gray-800 border border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {formData.targetRoles.length === 0 ? 'All roles' : formData.targetRoles.join(', ')}
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold transition"
              >
                {editingId ? 'Update Banner' : 'Create Banner'}
              </button>
            </form>
          )}

          {/* Banners List */}
          <div className="space-y-4">
            {allBanners.length === 0 ? (
              <div className="text-center text-gray-400 py-12">No banners created yet</div>
            ) : (
              allBanners.map((banner) => (
                <div
                  key={banner._id}
                  className={`bg-gray-900/50 border rounded-2xl p-6 ${
                    banner.visible ? 'border-white/10' : 'border-gray-700 opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            banner.type === 'info'
                              ? 'bg-blue-500/20 text-blue-400'
                              : banner.type === 'success'
                              ? 'bg-green-500/20 text-green-400'
                              : banner.type === 'warning'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {banner.type.toUpperCase()}
                        </span>
                        {!banner.visible && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-400">
                            HIDDEN
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">{banner.title}</h3>
                      <p className="text-gray-300 mb-4">{banner.message}</p>

                      {/* ⭐ Show targeting info */}
                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500">Semesters:</p>
                          <p className="text-gray-300">
                            {banner.targetSemesters?.length === 0
                              ? '✓ All semesters'
                              : `✓ Semester ${banner.targetSemesters?.join(', ')}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Roles:</p>
                          <p className="text-gray-300">
                            {banner.targetRoles?.length === 0
                              ? '✓ All roles'
                              : `✓ ${banner.targetRoles?.join(', ')}`}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 space-y-1">
                        <div>Created: {new Date(banner.createdAt).toLocaleString()}</div>
                        {banner.expiresAt && (
                          <div>Expires: {new Date(banner.expiresAt).toLocaleString()}</div>
                        )}
                      </div>
                    </div>

                    {/* ⭐ Add Edit button */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Edit
                      </button>
                      {banner.visible && (
                        <button
                          onClick={() => handleHide(banner._id)}
                          className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold transition"
                        >
                          Hide
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
