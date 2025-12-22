import React from 'react';
import { usePDFDownload } from '../hooks/usePDFDownload';

const DownloadButton = ({ pdfData, onDownloadComplete }) => {
  const { downloadPDF, downloading } = usePDFDownload();
  const { id } = pdfData;
  const downloadState = downloading[id];

  const handleDownload = async () => {
    const success = await downloadPDF(pdfData);
    if (success && onDownloadComplete) {
      onDownloadComplete(pdfData);
    }
  };

  if (downloadState?.status === 'complete') {
    return (
      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Downloaded
      </button>
    );
  }

  if (downloadState?.status === 'starting') {
    return (
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold" disabled>
        <div className="animate-spin">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        Downloading...
      </button>
    );
  }

  if (downloadState?.status === 'error') {
    return (
      <button 
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Retry
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download PDF
    </button>
  );
};

export default DownloadButton;
