import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listBanners,
  createBanner,
  hideBanner,
  deleteBanner,
} from '../../REDUX/Slices/notificationSlice';
import HomeLayout from '../../LAYOUTS/Homelayout';

export default function ManageBanners() {
  const dispatch = useDispatch();
  const { allBanners } = useSelector((state) => state.notification);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    expiresAt: '',
  });

  useEffect(() => {
    dispatch(listBanners());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createBanner(formData));
    setFormData({ title: '', message: '', type: 'info', expiresAt: '' });
    setShowForm(false);
    dispatch(listBanners());
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
    <HomeLayout>
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

          {/* Create Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 mb-8 space-y-4"
            >
              <h2 className="text-xl font-bold mb-4">Create New Banner</h2>
              <input
                type="text"
                placeholder="Banner Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
              <textarea
                placeholder="Banner Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={3}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
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
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold transition"
              >
                Create Banner
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
                      <div className="flex items-center space-x-3 mb-2">
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
                      <p className="text-gray-300 mb-3">{banner.message}</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div>Created: {new Date(banner.createdAt).toLocaleString()}</div>
                        {banner.expiresAt && (
                          <div>Expires: {new Date(banner.expiresAt).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {banner.visible && (
                        <button
                          onClick={() => handleHide(banner._id)}
                          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-semibold transition"
                        >
                          Hide
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition"
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
    </HomeLayout>
  );
}
