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
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-icon lucide-loader"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
          </div>
          <p className="text-gray-400">Loading downloads...</p>
        </div>
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
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{pdf.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>📚 {pdf.subject}</span>
                      <span>📦 {(pdf.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>📅 {new Date(pdf.downloadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleViewPDF(pdf)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
                    >
                       View
                    </button>
                    <button
                      onClick={() => openDeleteModal('single', pdf.id)}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Viewer Modal */}
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

const PDFViewerModal = ({ pdf, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* ✅ Header - Fixed Height */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-800 bg-gray-900 flex-shrink-0">
        <h3 className="text-sm md:text-lg font-bold text-white truncate flex-1 pr-2">
          {pdf.title}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-all flex-shrink-0"
        >
          {/* Close button */}
        </button>
      </div>

      {/* ✅ PDF Container - Flexible */}
      <div className="flex-1 overflow-auto w-full bg-black relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Loading spinner */}
          </div>
        )}
        
        {/* ✅ This now works on ALL devices */}
        <iframe
          src={pdf.objectUrl}
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* ✅ Footer - Fixed Height */}
      <div className="p-3 md:p-4 border-t border-gray-800 bg-gray-900 flex-shrink-0">
        <p className="text-xs md:text-sm text-gray-400">
          📄 {pdf.title} • 📦 {(pdf.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
};


export default DownloadsPage;
