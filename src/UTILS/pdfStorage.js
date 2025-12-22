// ✅ UPDATED PDF Storage with Deduplication Fix
// Initialize IndexedDB database
const DB_NAME = 'AcademicArkPWA';
const STORE_NAME = 'pdfs';
const DB_VERSION = 1;

let dbInstance = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('title', 'title', { unique: false });
        store.createIndex('downloadedAt', 'downloadedAt', { unique: false });
      }
    };
  });
};

// ✅ NEW: Check if PDF already exists (DEDUPLICATION)
export const checkIfExists = async (noteId) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(noteId);

      request.onsuccess = () => {
        resolve(!!request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error checking if PDF exists:', error);
    return false;
  }
};

// ✅ UPDATED: Save PDF using put() instead of add()
// put() = upsert (insert if new, update if exists)
// add() = insert only (fails if exists) ❌
export const savePDF = async (pdfData) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const data = {
      id: pdfData.id || Date.now().toString(),
      title: pdfData.title,
      url: pdfData.url,
      blob: pdfData.blob,
      size: pdfData.blob.size,
      downloadedAt: new Date().toISOString(),
      subject: pdfData.subject || 'General',
      courseCode: pdfData.courseCode || '',
      semester: pdfData.semester || null,
      university: pdfData.university || null,
      uploadedBy: pdfData.uploadedBy || null,
      thumbnail: pdfData.thumbnail || null,
    };

    // ✅ USE PUT INSTEAD OF ADD
    const request = store.put(data);
    request.onerror = () => {
      console.error('Error saving PDF:', request.error);
      reject(request.error);
    };
    request.onsuccess = () => {
      console.log(`✅ PDF saved: ${data.id}`);
      resolve(request.result);
    };
  });
};

// Get all PDFs
export const getAllPDFs = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

// Get single PDF
export const getPDF = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

// Delete PDF
export const deletePDF = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      console.log(`✅ PDF deleted: ${id}`);
      resolve(request.result);
    };
  });
};

// Get storage usage
export const getStorageUsage = async () => {
  const pdfs = await getAllPDFs();
  const totalSize = pdfs.reduce((sum, pdf) => sum + (pdf.size || 0), 0);
  return {
    count: pdfs.length,
    totalSize: totalSize,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
  };
};

// Clear all PDFs
export const clearAllPDFs = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      console.log('✅ All PDFs cleared');
      resolve(request.result);
    };
  });
};

// ✅ NEW: Get PDFs by subject (for filtering)
export const getPDFsBySubject = async (subject) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const allPDFs = store.getAll();

    allPDFs.onsuccess = () => {
      const filtered = allPDFs.result.filter(pdf => pdf.subject === subject);
      resolve(filtered);
    };

    allPDFs.onerror = () => reject(allPDFs.error);
  });
};

// ✅ NEW: Get PDFs sorted by download date
export const getPDFsSorted = async (sortBy = 'downloadedAt') => {
  const pdfs = await getAllPDFs();
  return pdfs.sort((a, b) => {
    if (sortBy === 'downloadedAt') {
      return new Date(b.downloadedAt) - new Date(a.downloadedAt);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
};