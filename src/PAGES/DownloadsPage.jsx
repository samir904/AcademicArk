import React, { useState, useEffect } from 'react';
import { getAllPDFs, deletePDF, getStorageUsage } from '../UTILS/pdfStorage';
import HomeLayout from '../LAYOUTS/Homelayout';
import DeleteConfirmModalPdf from '../COMPONENTS/DeleteConfirmModalPdf';


const DownloadsPage = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageUsage, setStorageUsage] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);


  // Delete Modal States
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: 'single', // 'single' or 'all'
    targetId: null,
    isDeleting: false,
  });


  useEffect(() => {
    loadPDFs();
  }, []);


  const loadPDFs = async () => {
    try {
      setLoading(true);
      const allPDFs = await getAllPDFs();
      const usage = await getStorageUsage();
      
      allPDFs.sort((a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt));
      
      setPdfs(allPDFs);
      setStorageUsage(usage);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    } finally {
      setLoading(false);
    }
  };


  // Open delete confirmation
  const openDeleteModal = (type, pdfId = null) => {
    setDeleteModal({
      show: true,
      type,
      targetId: pdfId,
      isDeleting: false,
    });
  };


  // Handle delete single PDF
  const handleDeleteSingle = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isDeleting: true }));
      
      await deletePDF(deleteModal.targetId);
      
      setPdfs(pdfs.filter(pdf => pdf.id !== deleteModal.targetId));
      setStorageUsage(await getStorageUsage());
      
      // Close modal and show success
      setDeleteModal({ show: false, type: 'single', targetId: null, isDeleting: false });
      
      // Show success toast
      showToast('✅ PDF deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting PDF:', error);
      showToast('❌ Error deleting PDF', 'error');
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };


  // Handle delete all PDFs
  const handleDeleteAll = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isDeleting: true }));
      
      // Delete each PDF
      await Promise.all(pdfs.map(pdf => deletePDF(pdf.id)));
      
      setPdfs([]);
      setStorageUsage(await getStorageUsage());
      
      // Close modal and show success
      setDeleteModal({ show: false, type: 'all', targetId: null, isDeleting: false });
      
      // Show success toast
      showToast('✅ All downloads cleared', 'success');
    } catch (error) {
      console.error('Error clearing downloads:', error);
      showToast('❌ Error clearing downloads', 'error');
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };


  // Show toast notification
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-24 right-4 px-6 py-3 rounded-lg z-50 text-white font-semibold animate-fade-in ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };


  const handleViewPDF = (pdf) => {
    const url = URL.createObjectURL(pdf.blob);
    setSelectedPDF({ ...pdf, objectUrl: url });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
    );
  }


  if (pdfs.length === 0) {
    return (
      <HomeLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="text-6xl mb-4">📥</div>
            <h2 className="text-2xl font-bold mb-2">No Downloads Yet</h2>
            <p className="text-gray-400 mb-6">Start downloading PDF notes to access them offline!</p>
            <a href="/notes" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all">
              Browse Notes
            </a>
          </div>
        </div>
      </HomeLayout>
    );
  }


  return (
    <HomeLayout>
      <div className="min-h-screen bg-black text-white pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Downloads</h1>
            <p className="text-gray-400">{pdfs.length} files • {storageUsage?.totalSizeMB} MB</p>
          </div>


          {/* Storage Info */}
          {storageUsage && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Local Storage Used</p>
                  <p className="text-2xl font-bold">{storageUsage.totalSizeMB} MB</p>
                </div>
                <button
                  onClick={() => openDeleteModal('all')}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all font-semibold"
                >
                   Clear All
                </button>
              </div>
            </div>
          )}


          {/* PDF List */}
          <div className="grid gap-4">
            {pdfs.map((pdf) => (
              <div 
                key={pdf.id} 
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{pdf.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span>📚 {pdf.subject}</span>
                      <span>📦 {(pdf.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>📅 {new Date(pdf.downloadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleViewPDF(pdf)}
                      className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
                    >
                       View
                    </button>
                    <button
                      onClick={() => openDeleteModal('single', pdf.id)}
                      className="flex-1 md:flex-none px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* PDF Viewer Modal - FIXED VERSION */}
        {selectedPDF && (
          <PDFViewerModal pdf={selectedPDF} onClose={() => setSelectedPDF(null)} />
        )}


        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <DeleteConfirmModalPdf
            title={
              deleteModal.type === 'all'
                ? 'Clear All Downloads?'
                : 'Delete PDF?'
            }
            message={
              deleteModal.type === 'all'
                ? `You are about to delete all ${pdfs.length} downloaded PDFs. This action cannot be undone.`
                : `You are about to delete "${pdfs.find(p => p.id === deleteModal.targetId)?.title || 'this PDF'}". This action cannot be undone.`
            }
            isDeleting={deleteModal.isDeleting}
            onConfirm={
              deleteModal.type === 'all'
                ? handleDeleteAll
                : handleDeleteSingle
            }
            onCancel={() => 
              setDeleteModal({ show: false, type: 'single', targetId: null, isDeleting: false })
            }
          />
        )}
      </div>
    </HomeLayout>
  );
};


// FIXED PDF VIEWER COMPONENT
const PDFViewerModal = ({ pdf, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Fix PDF URL for proper loading
  useEffect(() => {
    if (pdf?.objectUrl) {
      // Ensure URL has proper parameters for all devices
      let url = pdf.objectUrl;
      
      // Add PDF.js viewer parameters
      if (!url.includes('#')) {
        url += '#view=FitH&toolbar=1&navpanes=0';
      }
      
      setPdfUrl(url);
    }
  }, [pdf]);

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load PDF. Try opening in a new tab.');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  // Fallback: Open PDF in new tab if iframe fails
  const openInNewTab = () => {
    if (pdf?.objectUrl) {
      window.open(pdf.objectUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-0">
      {/* Container - Full screen on mobile, fixed height on desktop */}
      <div className="w-full h-screen md:h-[95vh]  md:rounded-lg bg-gray-900 overflow-hidden flex flex-col">
        
        {/* Header - Fixed Height */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-800 bg-gray-900 flex-shrink-0 h-14 md:h-16">
          <h3 className="text-xs md:text-lg font-bold text-white truncate flex-1 pr-2">
            {pdf?.title || 'PDF Viewer'}
          </h3>
          <div className="flex items-center gap-2">
            {/* Open in New Tab Button */}
            <button
              onClick={openInNewTab}
              className="p-2 hover:bg-gray-800 rounded-lg transition-all flex-shrink-0"
              title="Open in New Tab"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-all flex-shrink-0"
              title="Close (ESC)"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* PDF Container - Flexible Height */}
        <div className="flex-1 overflow-auto w-full bg-black relative flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-center">
                <div className="animate-spin mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" fill="white"/><path d="M12 2v4M17 7l-2.8 2.8M20 12h-4M17 17l-2.8-2.8M12 20v-4M7 17l2.8-2.8M4 12h4M7 7l2.8 2.8"/>
                  </svg>
                </div>
                <p className="text-white text-sm font-medium">Loading PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-center bg-gray-900/90 p-6 rounded-lg max-w-sm mx-4">
                <p className="text-white mb-4">{error}</p>
                <button
                  onClick={openInNewTab}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Open in New Tab
                </button>
              </div>
            </div>
          )}
          
          {pdfUrl && (
            <iframe
              key={pdfUrl}
              src={pdfUrl}
              className="w-full h-full border-none"
              title={pdf?.title || 'PDF Viewer'}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              allow="geolocation"
              // sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          )}
        </div>
      </div>
    </div>
  );
};


export default DownloadsPage;