import React, { useState, useEffect } from 'react';
import { getAllPDFs, deletePDF, getStorageUsage } from '../UTILS/pdfStorage';
import DeleteConfirmModalPdf from '../COMPONENTS/DeleteConfirmModalPdf';
import {
  FileText,
  Trash2,
  Eye,
  AlertCircle,
  X,
  ExternalLink,
  Book,
  Calendar,
  HardDrive,
  Search,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { DownloadsSkeleton } from '../COMPONENTS/Skeletons';

const DownloadsPage = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageUsage, setStorageUsage] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete Modal States
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: 'single',
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

      allPDFs.sort(
        (a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt)
      );

      setPdfs(allPDFs);
      setStorageUsage(usage);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter PDFs based on search term
  const filteredPDFs = pdfs.filter(
    (pdf) =>
      pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

      await deletePDF(deleteModal.targetId);

      setPdfs(pdfs.filter((pdf) => pdf.id !== deleteModal.targetId));
      setStorageUsage(await getStorageUsage());

      setDeleteModal({
        show: false,
        type: 'single',
        targetId: null,
        isDeleting: false,
      });

      showToast('✅ PDF deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting PDF:', error);
      showToast('❌ Error deleting PDF', 'error');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Handle delete all PDFs
  const handleDeleteAll = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

      await Promise.all(pdfs.map((pdf) => deletePDF(pdf.id)));

      setPdfs([]);
      setStorageUsage(await getStorageUsage());

      setDeleteModal({
        show: false,
        type: 'all',
        targetId: null,
        isDeleting: false,
      });

      showToast('✅ All downloads cleared', 'success');
    } catch (error) {
      console.error('Error clearing downloads:', error);
      showToast('❌ Error clearing downloads', 'error');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
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
      <>
        <DownloadsSkeleton/>
      </>
    );
  }

  if (pdfs.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center pt-20 px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">📥</div>
            <h2 className="text-2xl font-semibold mb-2">No Downloads Yet</h2>
            <p className="text-[#9CA3AF] mb-8">
              Start downloading PDF notes to access them offline and manage them here.
            </p>
            <a
              href="/notes"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#9CA3AF] hover:bg-white text-black font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Browse Notes <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0F0F0F] text-white pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <HardDrive className="w-6 h-6 text-[#9CA3AF]" />
              <h1 className="text-3xl md:text-4xl font-semibold text-white">
                My Downloads
              </h1>
            </div>
            <p className="text-[#9CA3AF] text-sm">
              {pdfs.length} {pdfs.length === 1 ? 'file' : 'files'} • {storageUsage?.totalSizeMB || '0'} MB total
            </p>
          </div>

          {/* Storage Overview Card */}
          {storageUsage && (
            <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl p-6 md:p-8 mb-8 hover:border-[#2F2F2F] transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Storage Usage */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <HardDrive className="w-5 h-5 text-[#9CA3AF]" />
                    <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider">
                      Storage Used
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {storageUsage.totalSizeMB} MB
                  </p>
                </div>

                {/* Total Files */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-[#9CA3AF]" />
                    <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider">
                      Total Files
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {pdfs.length}
                  </p>
                </div>

                {/* Clear All Action */}
                <div className="flex flex-col justify-between">
                  <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-3">
                    Manage Storage
                  </p>
                  <button
                    onClick={() => openDeleteModal('all')}
                    className="px-6 py-2 bg-[#1F1F1F] hover:bg-[#2F2F2F] text-[#9CA3AF] hover:text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-[#1F1F1F]"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1F1F1F] border border-[#1F1F1F] hover:border-[#2F2F2F] focus:border-[#9CA3AF] rounded-lg text-white placeholder-[#9CA3AF]/50 focus:outline-none focus:ring-1 focus:ring-[#9CA3AF]/20 transition-all duration-300"
              />
            </div>
            {searchTerm && filteredPDFs.length === 0 && (
              <p className="text-sm text-[#9CA3AF] mt-3">
                No PDFs found matching "{searchTerm}"
              </p>
            )}
          </div>

          {/* PDF Grid */}
          {filteredPDFs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPDFs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="group bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 hover:border-[#2F2F2F] hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Top Label */}
                  <div className="mb-4 pb-4 border-b border-[#1F1F1F]">
                    <div className="flex items-center gap-2">
                      <Book className="w-4 h-4 text-[#9CA3AF]" />
                      <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider">
                        {pdf.subject}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-4 line-clamp-2 group-hover:text-[#9CA3AF] transition-colors duration-300">
                    {pdf.title}
                  </h3>

                  {/* Metadata */}
                  <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                      <HardDrive className="w-4 h-4 flex-shrink-0" />
                      <span>{(pdf.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{new Date(pdf.downloadedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewPDF(pdf)}
                      className="flex-1 px-4 py-2 bg-[#9CA3AF] hover:bg-white text-black font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 group/btn text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => openDeleteModal('single', pdf.id)}
                      className="flex-1 px-4 py-2 bg-[#1F1F1F] hover:bg-[#2F2F2F] text-[#9CA3AF] hover:text-white font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 group/btn text-sm border border-[#1F1F1F]"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4 opacity-50" />
              <p className="text-[#9CA3AF] text-lg font-medium">No PDFs found</p>
              <p className="text-[#9CA3AF]/60 text-sm mt-2">Try adjusting your search filters</p>
            </div>
          )}
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
                : `You are about to delete "${
                    pdfs.find((p) => p.id === deleteModal.targetId)?.title ||
                    'this PDF'
                  }". This action cannot be undone.`
            }
            isDeleting={deleteModal.isDeleting}
            onConfirm={
              deleteModal.type === 'all' ? handleDeleteAll : handleDeleteSingle
            }
            onCancel={() =>
              setDeleteModal({
                show: false,
                type: 'single',
                targetId: null,
                isDeleting: false,
              })
            }
          />
        )}
      </div>
    </>
  );
};

// PDF Viewer Modal with Dismissible Error
const PDFViewerModal = ({ pdf, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dismissedError, setDismissedError] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load PDF. Try opening in a new tab.');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const openInNewTab = () => {
    if (pdf?.objectUrl) {
      window.open(pdf.objectUrl, '_blank');
    }
  };

  const pdfUrl = pdf?.objectUrl;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="w-full h-screen md:h-[95vh] md:rounded-2xl bg-[#0F0F0F] overflow-hidden flex flex-col border border-[#1F1F1F]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#1F1F1F] bg-[#0F0F0F] flex-shrink-0">
          <div className="flex-1 pr-4">
            <h3 className="text-sm md:text-lg font-semibold text-white truncate">
              {pdf?.title || 'PDF Viewer'}
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-1">
              {pdf?.size ? (pdf.size / 1024 / 1024).toFixed(2) : '0'} MB
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isMobile && (
              <button
                onClick={openInNewTab}
                className="p-2 hover:bg-[#1F1F1F] rounded-lg transition-all flex-shrink-0 text-[#9CA3AF] hover:text-white"
                title="Open in New Tab"
              >
                <ExternalLink className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 hover:bg-[#1F1F1F] rounded-lg transition-all flex-shrink-0 text-[#9CA3AF] hover:text-white"
              title="Close (ESC)"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* PDF Container */}
        <div className="flex-1 overflow-auto w-full bg-black relative flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9CA3AF] border-t-transparent mb-4 mx-auto"></div>
                <p className="text-white text-sm font-medium">Loading PDF...</p>
              </div>
            </div>
          )}

          {error && !dismissedError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
              <div className="bg-[#0F0F0F] p-6 rounded-2xl max-w-md mx-4 border border-[#1F1F1F]">
                {/* Error Icon */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#1F1F1F] rounded-full">
                    <AlertCircle className="w-8 h-8 text-[#9CA3AF]" />
                  </div>
                </div>

                {/* Error Title & Message */}
                <h3 className="text-center text-white font-semibold text-lg mb-2">
                  Cannot Display PDF
                </h3>
                <p className="text-center text-[#9CA3AF] text-sm mb-6">
                  The PDF viewer couldn't load this file. Try opening it in a new tab instead.
                </p>

                {/* Action Buttons */}
                <div className="space-y-3 mb-4">
                  <button
                    onClick={openInNewTab}
                    className="w-full px-4 py-3 bg-[#9CA3AF] hover:bg-white text-black rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Open in New Tab</span>
                  </button>

                  <button
                    onClick={() => setDismissedError(true)}
                    className="w-full px-4 py-3 bg-[#1F1F1F] hover:bg-[#2F2F2F] text-[#9CA3AF] hover:text-white rounded-lg font-semibold transition-all duration-300 border border-[#1F1F1F]"
                  >
                    Dismiss
                  </button>
                </div>

                {/* Help Text */}
                <div className="bg-[#1F1F1F] border border-[#2F2F2F] rounded-lg p-3 text-center">
                  <p className="text-xs text-[#9CA3AF]">
                    💡 <strong>Tip:</strong> You can also download the PDF directly to your device for offline access.
                  </p>
                </div>
              </div>
            </div>
          )}

          {pdfUrl && !error && (
            <iframe
              key={pdfUrl}
              src={pdfUrl}
              className="w-full h-full border-none"
              title={pdf?.title || 'PDF Viewer'}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              allow="geolocation"
            />
          )}

          {/* Mobile FAB - Open in New Tab */}
          {isMobile && !dismissedError && (
            <div className="absolute bottom-6 right-4 z-30 flex flex-col items-center gap-3">
              {/* Text Label */}
              <div className="bg-[#1F1F1F] backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs font-semibold whitespace-nowrap border border-[#2F2F2F] shadow-lg">
                ⚠️ Click to open in new tab
              </div>

              {/* FAB Button */}
              <button
                onClick={openInNewTab}
                className="w-14 h-14 bg-[#9CA3AF] hover:bg-white rounded-full shadow-lg flex items-center justify-center text-black transition-all duration-300 hover:scale-110 active:scale-95"
                title="Open in New Tab"
              >
                <ExternalLink className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadsPage;