import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRequest } from '../REDUX/Slices/requestSlice';

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function RequestModal({ isOpen, onClose, defaultSemester, defaultSubject }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.request);
  const userData = useSelector((state) => state.auth.data);

  const [formData, setFormData] = useState({
    requestType: 'NOTES',
    subject: defaultSubject || '',
    semester: defaultSemester || userData?.academicProfile?.semester || 1,
    branch: userData?.academicProfile?.branch || 'CSE',
    college: userData?.academicProfile?.college?.name || '',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim()) {
      return;
    }

    const result = await dispatch(createRequest(formData));
    
    if (result.type === 'request/create/fulfilled') {
      setSubmitted(true);
      
      setTimeout(() => {
        onClose();
        setFormData({
          requestType: 'NOTES',
          subject: '',
          semester: userData?.academicProfile?.semester || 1,
          branch: userData?.academicProfile?.branch || 'CSE',
          college: userData?.academicProfile?.college?.name || '',
          description: ''
        });
        setSubmitted(false);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Glassmorphism effect */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-40" 
        onClick={onClose} 
      />
      
      {/* Modal Container - Clean & Minimalist */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full relative overflow-hidden">
          
          {/* Success State */}
          {submitted ? (
            <div className="text-center py-12">
              <div className="mb-6 relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-xl opacity-50"></div>
                <div className="relative w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center border border-green-400/50">
                  <svg className="w-8 h-8 text-green-300 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Request Submitted! 🎉</h2>
              <p className="text-white/70 text-sm">
                Thank you! Our team will review and add this material soon.
              </p>
            </div>
          ) : (
            <>
              {/* Close Button */}
              <button 
                onClick={onClose} 
                className="absolute top-5 right-5 p-1 hover:bg-white/10 rounded-full transition"
              >
                <XIcon className="w-5 h-5 text-white/70 hover:text-white" />
              </button>

              {/* Header - Minimal */}
              <h2 className="text-2xl font-bold text-white mb-1 mt-2">Request Material</h2>
              <p className="text-white/70 text-sm mb-6">
                Can't find what you need? Let us know! 📚
              </p>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Error Message */}
                {error && (
                  <div className="bg-red-400/10 border border-red-400/30 rounded-xl p-3 flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-200 text-xs">{error}</p>
                  </div>
                )}

                {/* Request Type Selection */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2 uppercase tracking-wide">
                    What do you need?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'NOTES', label: 'Notes', icon: '📖' },
                      { value: 'PYQ', label: 'PYQs', icon: '📄' },
                      { value: 'IMPORTANT_QUESTIONS', label: 'Questions', icon: '❓' }
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, requestType: type.value })}
                        className={`p-3 rounded-xl border transition-all text-center ${
                          formData.requestType === type.value
                            ? 'border-white/40 bg-white/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-xl mb-1">{type.icon}</div>
                        <div className="text-xs font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Input */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2 uppercase tracking-wide">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Data Structures"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-white/40 focus:bg-white/15 outline-none transition"
                  />
                </div>

                {/* Semester & Branch */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2 uppercase tracking-wide">
                      Semester *
                    </label>
                    <select
                      required
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-white/40 focus:bg-white/15 outline-none transition appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option className='bg-gray-900' key={sem} value={sem}>Sem {sem}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold  text-white/80 mb-2 uppercase tracking-wide">
                      Branch *
                    </label>
                    <select
                      required
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-white/40 focus:bg-white/15 outline-none transition appearance-none"
                    >
                      {['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CHEMICAL', 'BIOTECH', 'OTHER'].map(br => (
                        <option className='bg-gray-900' key={br} value={br}>{br}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* College (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2 uppercase tracking-wide">
                    College <span className="text-white/50">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="Your college name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-white/40 focus:bg-white/15 outline-none transition"
                  />
                </div>

                {/* Description (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2 uppercase tracking-wide">
                    Details <span className="text-white/50">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Any specific topics or details..."
                    rows={2}
                    maxLength={300}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-white/40 focus:bg-white/15 outline-none transition resize-none"
                  />
                  <div className="text-xs text-white/50 mt-1 text-right">
                    {formData.description.length}/300
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.subject.trim()}
                    className="flex-1 px-6 py-3 bg-white text-black hover:bg-gray-100 disabled:bg-white/50 disabled:text-white/50 rounded-xl font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
