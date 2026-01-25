import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendBroadcastEmail, getEmailStats } from '../../REDUX/Slices/emailSlice';

export const BroadcastEmail = () => {
const dispatch = useDispatch();
const { loading, emailStats, broadcastResult } = useSelector((state) => state.email);

const [formData, setFormData] = useState({
subject: '',
message: '',
ctaText: '',
ctaLink: '',
targetRole: 'ALL'
});

useEffect(() => {
dispatch(getEmailStats());
}, [dispatch]);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value
});
};

const handleSubmit = async (e) => {
e.preventDefault();
await dispatch(sendBroadcastEmail(formData));
// Reset form after success
setFormData({
subject: '',
message: '',
ctaText: '',
ctaLink: '',
targetRole: 'ALL'
});
};

return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
<div className="max-w-4xl mx-auto">
{/* Header */}
<div className="mb-8">
<h1 className="text-3xl font-bold text-white mb-2">📧 Broadcast Email</h1>
<p className="text-slate-400">Send beautiful emails to all your users</p>
</div>
    {/* Stats */}
    {emailStats && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="text-4xl font-bold text-white mb-2">{emailStats.totalUsers}</div>
          <div className="text-slate-400 text-sm">Total Users</div>
        </div>
        {emailStats.usersByRole?.map((role) => (
          <div key={role._id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="text-4xl font-bold text-white mb-2">{role.count}</div>
            <div className="text-slate-400 text-sm">{role._id}s</div>
          </div>
        ))}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8 space-y-6">
      
      {/* Target Role */}
      <div>
        <label className="block text-white font-semibold mb-2">Target Audience</label>
        <select
          name="targetRole"
          value={formData.targetRole}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option className='bg-black' value="ALL">All Users</option>
          <option className='bg-black'value="USER">Users Only</option>
          <option className='bg-black' value="TEACHER">Teachers Only</option>
          <option className='bg-black' value="ADMIN">Admins Only</option>
        </select>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-white font-semibold mb-2">Email Subject</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Enter email subject..."
          required
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-white font-semibold mb-2">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Enter your message..."
          required
          rows={8}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* CTA (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-semibold mb-2">Button Text (Optional)</label>
          <input
            type="text"
            name="ctaText"
            value={formData.ctaText}
            onChange={handleChange}
            placeholder="e.g., View Now"
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-white font-semibold mb-2">Button Link (Optional)</label>
          <input
            type="url"
            name="ctaLink"
            value={formData.ctaLink}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        {loading ? 'Sending...' : '📧 Send Broadcast Email'}
      </button>
    </form>

    {/* Result */}
    {broadcastResult && (
      <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-xl p-6">
        <h3 className="text-green-400 font-bold mb-2">✅ Email Sent Successfully!</h3>
        <p className="text-white">
          Sent to {broadcastResult.successCount} users
          {broadcastResult.failCount > 0 && ` (${broadcastResult.failCount} failed)`}
        </p>
      </div>
    )}
  </div>
</div>
);
};