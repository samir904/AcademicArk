import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyIPs, blockIPAddress } from '../REDUX/Slices/loginLogsSlice';
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';

const UserLoginIPs = () => {
  const dispatch = useDispatch();

  const {
    myIPs,
    myIPsLoading,
    blockedIPs,
    blockingLoading,
  } = useSelector((state) => state.loginLogs);

  useEffect(() => {
    dispatch(getMyIPs());
  }, [dispatch]);

  const handleBlockIP = (ipAddress) => {
    const isBlocked = blockedIPs.includes(ipAddress);
    const action = isBlocked ? 'unblock' : 'block';

    if (
      window.confirm(
        `Are you sure you want to ${action} this IP?`
      )
    ) {
      dispatch(blockIPAddress({ ipAddress, action }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Login IPs</h3>

      {myIPsLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : myIPs.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No IP history available</p>
      ) : (
        <div className="space-y-3">
          {myIPs.map((ip) => {
            const isBlocked = blockedIPs.includes(ip._id);
            return (
              <div
                key={ip._id}
                className={`border rounded-lg p-4 flex items-center justify-between ${
                  isBlocked
                    ? 'border-red-500/20 bg-red-500/5'
                    : 'border-gray-700 bg-gray-800/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <GlobeAltIcon className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <div className="text-white font-mono">
                      {ip._id || 'Unknown IP'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {ip.count} login{ip.count > 1 ? 's' : ''} •{' '}
                      {ip.browser} • {ip.os}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      Last login: {formatDate(ip.lastLogin)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBlockIP(ip._id)}
                  disabled={blockingLoading}
                  className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                    isBlocked
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                  title={isBlocked ? 'Unblock' : 'Block'}
                >
                  {isBlocked ? (
                    <ShieldExclamationIcon className="w-5 h-5" />
                  ) : (
                    <ShieldCheckIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserLoginIPs;
