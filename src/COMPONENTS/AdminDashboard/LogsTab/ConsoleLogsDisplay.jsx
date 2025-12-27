import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConsoleLogs, setConsoleFilters, setConsolePage } from '../../../REDUX/Slices/logsSlice';
import { formatDistanceToNow } from 'date-fns';

export default function ConsoleLogsDisplay() {
  const dispatch = useDispatch();
  const { consoleLogs, consoleLogsPagination, consoleLoading, consoleError, consoleFilters } = useSelector(state => state.logs);
  const [levelFilter, setLevelFilter] = useState('');

  useEffect(() => {
    dispatch(getConsoleLogs(consoleFilters));
  }, [dispatch, consoleFilters]);

  const handleLevelFilter = (level) => {
    setLevelFilter(level);
    dispatch(setConsoleFilters({ level }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setConsolePage(newPage));
  };

  const getLevelColor = (level) => {
    const colors = {
      'log': 'bg-blue-500/20 text-blue-400',
      'info': 'bg-cyan-500/20 text-cyan-400',
      'warn': 'bg-yellow-500/20 text-yellow-400',
      'error': 'bg-red-500/20 text-red-400',
      'debug': 'bg-purple-500/20 text-purple-400'
    };
    return colors[level] || 'bg-gray-500/20 text-gray-400';
  };

  const getLevelIcon = (level) => {
    const icons = {
      'log': '📝',
      'info': 'ℹ️',
      'warn': '⚠️',
      'error': '❌',
      'debug': '🐛'
    };
    return icons[level] || '📋';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-900/50 p-4 rounded-lg border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Filter by Level</h3>
        
        <div className="flex flex-wrap gap-2">
          {['log', 'info', 'warn', 'error', 'debug'].map((level) => (
            <button
              key={level}
              onClick={() => handleLevelFilter(levelFilter === level ? '' : level)}
              className={`px-4 py-2 rounded capitalize font-semibold transition ${
                levelFilter === level
                  ? getLevelColor(level)
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {getLevelIcon(level)} {level}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {consoleLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full"></div>
          </div>
          <p className="text-gray-400 mt-2">Loading console logs...</p>
        </div>
      )}

      {/* Error State */}
      {consoleError && (
        <div className="bg-red-500/20 border border-red-500/50 rounded p-4">
          <p className="text-red-400">Error: {consoleError}</p>
        </div>
      )}

      {/* Logs List */}
      {!consoleLoading && consoleLogs.length > 0 && (
        <div className="space-y-3">
          {consoleLogs.map((log, index) => (
            <div key={index} className="bg-gray-900/50 border border-white/10 rounded p-4 hover:border-white/20 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${getLevelColor(log.level)}`}>
                      {getLevelIcon(log.level)} {log.level.toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-gray-200 font-mono text-sm break-words">{log.message}</p>
                  
                  {log.context && (
                    <p className="text-gray-500 text-xs mt-2">Context: {log.context}</p>
                  )}
                  
                  {log.data && typeof log.data === 'object' && (
                    <pre className="bg-black/50 p-2 rounded mt-2 text-xs text-gray-300 overflow-x-auto">
                      {JSON.stringify(log.data, null, 2).slice(0, 300)}
                      {JSON.stringify(log.data, null, 2).length > 300 && '...'}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!consoleLoading && consoleLogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No console logs found</p>
        </div>
      )}

      {/* Pagination */}
      {consoleLogsPagination && consoleLogsPagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(consoleLogsPagination.currentPage - 1)}
            disabled={consoleLogsPagination.currentPage === 1}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white"
          >
            Previous
          </button>
          
          <span className="text-gray-400">
            Page {consoleLogsPagination.currentPage} of {consoleLogsPagination.pages}
          </span>
          
          <button
            onClick={() => handlePageChange(consoleLogsPagination.currentPage + 1)}
            disabled={consoleLogsPagination.currentPage === consoleLogsPagination.pages}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
