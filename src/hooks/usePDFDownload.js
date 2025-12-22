import { useState, useCallback } from 'react';
import { savePDF } from '../UTILS/pdfStorage';

export const usePDFDownload = () => {
  const [downloading, setDownloading] = useState({});
  const [error, setError] = useState(null);

  const downloadPDF = useCallback(async (pdfData) => {
    const { id, url, title } = pdfData;
    
    try {
      setDownloading(prev => ({ ...prev, [id]: { progress: 0, status: 'starting' } }));
      setError(null);

      // Fetch PDF from server
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      // Get total file size
      const totalSize = parseInt(response.headers.get('content-length'), 10);

      // Read blob
      const blob = await response.blob();

      // Save to IndexedDB
      await savePDF({
        id,
        title,
        url,
        blob,
        ...pdfData,
      });

      setDownloading(prev => ({
        ...prev,
        [id]: { progress: 100, status: 'complete' },
      }));

      // Clear status after 2 seconds
      setTimeout(() => {
        setDownloading(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
      }, 2000);

      return true;
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message);
      setDownloading(prev => ({
        ...prev,
        [id]: { progress: 0, status: 'error', error: err.message },
      }));
      return false;
    }
  }, []);

  return {
    downloadPDF,
    downloading,
    error,
  };
};
