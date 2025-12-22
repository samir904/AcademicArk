import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const OfflineModal = () => {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowModal(true);
    }
  }, [isOnline]);

  if (!showModal || isOnline) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-orange-500/30 rounded-2xl max-w-md w-full p-8 backdrop-blur-xl">
        
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          🌐 No Internet
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-center mb-6">
          You're currently offline, but you can still access your downloaded PDF notes!
        </p>

        {/* Info Box */}
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-200">
            ✅ <span className="font-semibold">Downloaded PDFs</span> - Available offline
            <br />
            ❌ <span className="font-semibold">New notes</span> - Requires internet
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
          >
            Close
          </button>
          <button
            onClick={() => {
              navigate('/downloads');
              setShowModal(false);
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-semibold transition-all"
          >
             View Downloads
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineModal;
