// src/pages/Note/UpdateNote.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateNote, getNote, clearCurrentNote } from '../../REDUX/Slices/noteslice';
import HomeLayout from '../../LAYOUTS/Homelayout';

// Icon components (same as before)
const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const CloudUploadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EditIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default function UpdateNote() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const { currentNote, updating, loading } = useSelector(state => state.note);
  const user = useSelector(state => state.auth.data);
  const role = useSelector(state => state.auth.data?.role || '');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    course: 'BTECH',
    semester: '',
    university: 'AKTU',
    category: 'Notes'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // For PDF preview
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Authorization checks
  const isAdmin = role === 'ADMIN';
  const isNoteCreator = currentNote && user && currentNote.uploadedBy?._id === user._id;
  const canEditNote = isAdmin || (role === 'TEACHER' && isNoteCreator);

  // Load note data on mount
  useEffect(() => {
    if (id) {
      dispatch(getNote(id));
    }
    
    return () => {
      dispatch(clearCurrentNote());
      // Clean up file preview URL
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [id, dispatch]);

  // Populate form when note loads
  useEffect(() => {
    if (currentNote) {
      setFormData({
        title: currentNote.title || '',
        description: currentNote.description || '',
        subject: currentNote.subject || '',
        course: currentNote.course || 'BTECH',
        semester: currentNote.semester || '',
        university: currentNote.university || 'AKTU',
        category: currentNote.category || 'Notes'
      });
    }
  }, [currentNote]);

  // Check authorization
  if (!canEditNote) {
    return (
      <HomeLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <XCircleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400 mb-4">You don't have permission to update this note.</p>
            <button 
              onClick={() => navigate('/notes')} 
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Back to Notes
            </button>
          </div>
        </div>
      </HomeLayout>
    );
  }

  // Loading state
  if (loading) {
    return (
      <HomeLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading note data...</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  // Note not found
  if (!currentNote) {
    return (
      <HomeLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <XCircleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Note Not Found</h2>
            <p className="text-gray-400 mb-4">The note you're trying to update doesn't exist.</p>
            <button 
              onClick={() => navigate('/notes')} 
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Back to Notes
            </button>
          </div>
        </div>
      </HomeLayout>
    );
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    else if (formData.subject.trim().length < 2) newErrors.subject = 'Subject must be at least 2 characters';
    
    if (!formData.semester) newErrors.semester = 'Semester is required';

    // File validation (optional for update)
    if (selectedFile) {
      const maxSize = 50 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (selectedFile.size > maxSize) {
        newErrors.file = 'File size must be less than 10MB';
      } else if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.file = 'Only PDF, DOC, DOCX, and TXT files are allowed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]); // FIXED: Pass single file
    }
  };

  const handleFileSelect = (file) => {
    // Clean up previous preview
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setSelectedFile(file);
    
    // Create preview for PDF files
    if (file.type === 'application/pdf') {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }

    if (errors.file) {
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]); // FIXED: Pass single file
    }
  };

  // FIXED: Make entire drop area clickable
  const handleDropAreaClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitFormData = new FormData();
    submitFormData.append('title', formData.title.trim());
    submitFormData.append('description', formData.description.trim());
    submitFormData.append('subject', formData.subject.trim());
    submitFormData.append('course', formData.course);
    submitFormData.append('semester', formData.semester);
    submitFormData.append('university', formData.university);
    submitFormData.append('category', formData.category);
    
    // Only append file if new file is selected
    if (selectedFile) {
      submitFormData.append('fileDetails', selectedFile);
    }

    try {
      const result = await dispatch(updateNote({ noteId: id, data: submitFormData }));
      
      if (result.payload?.success) {
        setIsSuccess(true);
        // Navigate back to note detail after success
        setTimeout(() => {
          navigate(`/notes/${id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;
    
    if (selectedFile.type === 'application/pdf') return '📄';
    if (selectedFile.type.includes('word')) return '📝';
    if (selectedFile.type === 'text/plain') return '📋';
    return '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Success state
  if (isSuccess) {
    return (
      <HomeLayout>
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Update Successful!</h2>
              <p className="text-gray-400 mb-6">
                Your note has been updated successfully. Redirecting to note details...
              </p>
            </div>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6 group"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <EditIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Update Study Material</h1>
              <p className="text-gray-400 text-lg">Edit and improve your shared knowledge</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <DocumentIcon className="w-6 h-6" />
                  <span>Basic Information</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter note title (e.g., Data Structures - Unit 1)"
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                        errors.title ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-400">{errors.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Provide a detailed description of the content, topics covered, and any special notes..."
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none ${
                        errors.description ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-400">{errors.description}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter subject name (e.g., Operating System, Machine Learning)"
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                        errors.subject ? 'border-red-500' : 'border-white/20'
                      }`}
                    />
                    {errors.subject && (
                      <p className="mt-2 text-sm text-red-400">{errors.subject}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Enter any BTECH subject name
                    </p>
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Semester *
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                        errors.semester ? 'border-red-500' : 'border-white/20'
                      }`}
                    >
                      <option value="">Select Semester</option>
                      {[...Array(8)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                      ))}
                    </select>
                    {errors.semester && (
                      <p className="mt-2 text-sm text-red-400">{errors.semester}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="Notes">Notes</option>
                      <option value="PYQ">Previous Year Questions</option>
                      <option value="Important Question">Important Questions</option>
                    </select>
                  </div>

                  {/* University */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      University
                    </label>
                    <select
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="AKTU">AKTU</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* File Upload (Optional for update) */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <CloudUploadIcon className="w-6 h-6" />
                  <span>Update File (Optional)</span>
                </h2>
                
                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    📝 <strong>Current file:</strong> {currentNote.fileDetails?.public_id || 'Unknown file'}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Upload a new file only if you want to replace the existing one.
                  </p>
                </div>
                
                {/* FIXED: Drag & Drop Area - Full clickable */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                    dragActive 
                      ? 'border-green-500 bg-green-500/10' 
                      : errors.file 
                        ? 'border-red-500 bg-red-500/5' 
                        : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleDropAreaClick} // FIXED: Make entire area clickable
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInputChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-xl">
                        <span className="text-2xl">{getFileIcon()}</span>
                        <div className="flex-1 text-left">
                          <p className="text-white font-medium truncate">{selectedFile.name}</p>
                          <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering file picker
                            removeFile();
                          }}
                          className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* PDF Preview */}
                      {filePreview && selectedFile.type === 'application/pdf' && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">PDF Preview</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(filePreview, '_blank');
                              }}
                              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span>View Full</span>
                            </button>
                          </div>
                          <div className="border border-white/20 rounded-lg overflow-hidden">
                            <embed
                              src={filePreview}
                              type="application/pdf"
                              width="100%"
                              height="200"
                              className="bg-white"
                            />
                          </div>
                        </div>
                      )}
                      
                      <p className="text-green-400 text-sm">Click anywhere to choose a different file</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <CloudUploadIcon className="w-16 h-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-white text-lg font-medium mb-2">
                          Drag and drop a new file here, or click to browse
                        </p>
                        <p className="text-gray-400 text-sm">
                          Supports: PDF, DOC, DOCX, TXT (Max: 50MB) - Leave empty to keep current file
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {errors.file && (
                  <p className="mt-2 text-sm text-red-400">{errors.file}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/notes/${id}`)}
                  className="flex-1 bg-white/10 border cursor-pointer border-white/20 text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20 transition-all duration-300"
                  disabled={updating}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 cursor-pointer hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 disabled:hover:scale-100"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <EditIcon className="w-5 h-5" />
                      <span>Update Note</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
}
