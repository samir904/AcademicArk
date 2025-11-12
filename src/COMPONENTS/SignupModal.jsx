import React from 'react';
import { useNavigate } from 'react-router-dom';

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function SignupModal({ isOpen, email, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-40" onClick={onClose} />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-sm w-full">
          
          <button onClick={onClose} className="absolute top-5 right-5">
            <XIcon className="w-5 h-5 text-white/60 hover:text-white" />
          </button>

          <h2 className="text-3xl font-bold text-white mb-2">Create Account?</h2>
          <p className="text-white/70 mb-6">We didn't find this email. Let's create a new account!</p>

          <div className="bg-white/5 rounded-xl p-3 mb-6 border border-white/10">
            <p className="text-sm text-white/60">{email}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                navigate('/signup/email', { state: { email } });
                onClose();
              }}
              className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Create Account
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              Try Another Email
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
