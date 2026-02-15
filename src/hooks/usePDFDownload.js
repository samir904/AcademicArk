import { useState, useCallback } from "react";
import axiosInstance from "../HELPERS/axiosInstance";
import { savePDF } from "../UTILS/pdfStorage";

// 🔐 FEATURE FLAG (disable next semester)
const ALLOW_DEVICE_DOWNLOAD = true;

export const usePDFDownload = () => {
  const [downloading, setDownloading] = useState({});
  const [error, setError] = useState(null);

  const downloadPDF = useCallback(async ({ id, title, meta }) => {
    try {
      setDownloading(prev => ({
        ...prev,
        [id]: { status: "starting" }
      }));
      setError(null);

      const response = await axiosInstance.get(
        `/notes/${id}/download`,
        { responseType: "blob" }
      );

      const blob = response.data;

      // ✅ 1. Save for in-app reading
      await savePDF({
        id,
        title,
        blob,
        ...meta
      });

      // ✅ 2. Optional device download
      if (ALLOW_DEVICE_DOWNLOAD) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
 // 🔥 MARK DOWNLOAD CONVERSION (fire-and-forget)
      // console.log('🔥 [ANALYTICS] Starting download tracking...');
      
      try {
        const sessionId = localStorage.getItem("sessionId");
        
        if (!sessionId) {
          // console.warn('⚠️ [ANALYTICS] No session ID found');
        } else {
          // console.log('📤 [ANALYTICS] Session ID:', sessionId);
          
          const analyticsRes = await axiosInstance.post(
            "/filter-analytics/mark-download",
            {noteId: id},
            {
              headers: {
                "x-session-id": sessionId
              }
            }
          );
          
          // console.log('✅ [ANALYTICS] Download marked:', analyticsRes.data);
        }
      } catch (analyticsError) {
        // console.error('❌ [ANALYTICS] Failed (non-critical):', analyticsError.message);
      }

      setDownloading(prev => ({
        ...prev,
        [id]: { status: "complete" }
      }));

      return { success: true };

   } catch (err) {
  // ❗ ALWAYS mark error state
  setDownloading(prev => ({
    ...prev,
    [id]: { status: "error" }
  }));

  const response = err?.response;

  // 🧠 CRITICAL FIX: handle blob error responses
  if (response?.data instanceof Blob) {
    try {
      const text = await response.data.text(); // 👈 read blob
      const parsed = JSON.parse(text);          // 👈 parse JSON

      if (parsed?.code) {
        return {
          success: false,
          code: parsed.code,
          message: parsed.message
        };
      }
    } catch (e) {
      console.error("❌ Failed to parse blob error", e);
    }
  }

  // Normal JSON error (non-blob)
  if (response?.data?.code) {
    return {
      success: false,
      code: response.data.code,
      message: response.data.message
    };
  }

  return {
    success: false,
    code: "UNKNOWN_ERROR",
    message: "Download failed"
  };
}
  }, []);

  return {
    downloadPDF,
    downloading,
    error
  };
};
