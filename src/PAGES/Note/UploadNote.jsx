import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerNote } from '../../REDUX/Slices/noteslice';

// Icon components
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

const BookOpenIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

// NEW: Added EyeIcon for PDF preview
const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
// ✨ NEW: Category config for better UX
const CATEGORY_INFO = {
  'Notes': {
    emoji: '📚',
    description: 'Comprehensive study materials and lecture notes'
  },
  'Handwritten Notes': {
    emoji: '✏️',
    description: 'Personal handwritten notes and annotations'
  },
  'PYQ': {
    emoji: '📄',
    description: 'Previous year question papers and solutions'
  },
  'Important Question': {
    emoji: '⭐',
    description: 'Frequently asked and important questions'
  }
};


export default function UploadNote() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { uplodaing } = useSelector(state => state.note);
  const { role } = useSelector(state => state.auth.data || {});

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
  const [filePreview, setFilePreview] = useState(null); // NEW: Added for PDF preview
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // NEW: Cleanup effect for file preview
  useEffect(() => {
    return () => {
      // Clean up file preview URL on unmount
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    else if (formData.subject.trim().length < 2) newErrors.subject = 'Subject must be at least 2 characters';

    if (!formData.semester.length) {
      newErrors.semester = 'Select at least one semester';
    }
    if (!selectedFile) newErrors.file = 'File is required';

    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024; // 10MB
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

  // Auth check
  if (!role || !['TEACHER', 'ADMIN'].includes(role)) {
    return (
      <>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <XCircleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400 mb-4">You need TEACHER or ADMIN privileges to upload notes.</p>
            <button
              onClick={() => navigate('/notes')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600"
            >
              Browse Notes
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // MODIFIED: Added PDF preview functionality
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
      handleFileSelect(e.target.files[0]);
    }
  };

  // MODIFIED: Added preview cleanup
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
    formData.semester.forEach(sem => {
      submitFormData.append('semester[]', sem);
    });
    submitFormData.append('university', formData.university);
    submitFormData.append('category', formData.category); // ✨ Fixed:
    submitFormData.append('fileDetails', selectedFile);

    try {
      const result = await dispatch(registerNote(submitFormData));
      if (result.payload?.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({
            title: '',
            description: '',
            subject: '',
            course: 'BTECH',
            semester: [],
            university: 'AKTU',
            category: 'Notes'
          });
          removeFile();
        }, 3000);
      }
    } catch (error) {
      console.error('Upload failed:', error);
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
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };
  const handleSemesterChange = (sem) => {
    setFormData(prev => {
      const exists = prev.semester.includes(sem);
      return {
        ...prev,
        semester: exists
          ? prev.semester.filter(s => s !== sem)
          : [...prev.semester, sem]
      };
    });

    if (errors.semester) {
      setErrors(prev => ({ ...prev, semester: '' }));
    }
  };

  // Success UI
  if (isSuccess) {
    return (
      <>
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Upload Successful!</h2>
              <p className="text-gray-400 mb-6">
                Your note has been uploaded successfully and is now available for students.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setIsSuccess(false)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600"
                >
                  Upload Another Note
                </button>
                <button
                  onClick={() => navigate('/notes')}
                  className="w-full bg-white/10 border border-white/20 text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20"
                >
                  View All Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }



  return (
    <>
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpenIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Upload Study Material</h1>
            <p className="text-gray-400 text-lg">Share knowledge and help fellow students succeed</p>
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

                    <p className="text-xs text-gray-500 mb-2">
                      💡 Tip: Include <span className="text-blue-400">Unit-1, Unit-2</span> in title.
                      Unit will be auto-detected.
                    </p>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter note title (e.g., Data Structures Unit-1)"
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.title ? 'border-red-500' : 'border-white/20'
                        }`}
                    />
                    {errors.title && <p className="mt-2 text-sm text-red-400">{errors.title}</p>}
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
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${errors.description ? 'border-red-500' : 'border-white/20'
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
                      className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.subject ? 'border-red-500' : 'border-white/20'
                        }`}
                    />
                    {errors.subject && (
                      <p className="mt-2 text-sm text-red-400">{errors.subject}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Enter any BTECH subject name
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Semester *
                    </label>

                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => handleSemesterChange(sem)}
                          className={`
          px-3 py-2 rounded-lg text-sm font-medium border transition-all
          ${formData.semester.includes(sem)
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'bg-black/50 text-gray-300 border-white/20 hover:border-white/40'}
        `}
                        >
                          Sem {sem}
                        </button>
                      ))}
                    </div>

                    {errors.semester && (
                      <p className="mt-2 text-sm text-red-400">{errors.semester}</p>
                    )}

                    <p className="mt-1 text-xs text-gray-500">
                      You can select multiple semesters
                    </p>
                  </div>


                  {/* ✨ FIXED: Category toggle */}
                  <div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Category
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(CATEGORY_INFO).map(([key, info]) => {
                          const isSelected = formData.category === key;

                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() =>
                                handleInputChange({
                                  target: { name: "category", value: key }
                                })
                              }
                              className={`
            flex items-start gap-3 p-3 rounded-xl border text-left transition-all
            ${isSelected
                                  ? "bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500/40"
                                  : "bg-black/40 border-white/20 text-gray-300 hover:border-white/40"}
          `}
                            >
                              {/* Checkbox look */}
                              <div
                                className={`
              mt-1 w-4 h-4 rounded border flex items-center justify-center
              ${isSelected
                                    ? "bg-blue-500 border-blue-500"
                                    : "border-gray-400"}
            `}
                              >
                                {isSelected && (
                                  <div className="w-2 h-2 bg-white rounded-sm" />
                                )}
                              </div>

                              <div>
                                <div className="text-sm font-semibold flex items-center gap-1">
                                  <span>{info.emoji}</span>
                                  <span>{key}</span>
                                </div>
                                {/* <p className="text-xs text-gray-400 mt-0.5">
                                  {info.description}
                                </p> */}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ✨ NEW: Category description */}
                    {formData.category && (
                      <p className="mt-2 text-xs text-gray-400">
                        {CATEGORY_INFO[formData.category]?.description}
                      </p>
                    )}
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
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="AKTU">AKTU</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <CloudUploadIcon className="w-6 h-6" />
                  <span>Upload File</span>
                </h2>

                {/* Drag & Drop / Clickable Area */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${dragActive
                    ? 'border-blue-500 bg-blue-500/10'
                    : errors.file
                      ? 'border-red-500 bg-red-500/5'
                      : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
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
                          onClick={(e) => { e.stopPropagation(); removeFile(); }}
                          className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-500/10"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* NEW: PDF Preview */}
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

                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Choose Different File
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <CloudUploadIcon className="w-16 h-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-white text-lg font-medium mb-2">
                          Drag and drop your file here, or browse
                        </p>
                        <p className="text-gray-400 text-sm">
                          Supports: PDF, DOC, DOCX, TXT (Max: 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {errors.file && <p className="mt-2 text-sm text-red-400">{errors.file}</p>}
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/notes')}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20 disabled:opacity-50"
                  disabled={uplodaing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uplodaing}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 disabled:hover:scale-100"
                >
                  {uplodaing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <CloudUploadIcon className="w-5 h-5" />
                      <span>Upload Note</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Guidelines */}
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <h4 className="font-medium text-white mb-2">File Requirements</h4>
                <ul className="space-y-1">
                  <li>• Maximum file size: 10MB</li>
                  <li>• Accepted formats: PDF, DOC, DOCX, TXT</li>
                  <li>• Clear and readable content</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Content Guidelines</h4>
                <ul className="space-y-1">
                  <li>• Original or properly attributed content</li>
                  <li>• Relevant to the selected subject</li>
                  <li>• Well-organized and formatted</li>
                </ul>
              </div>
            </div>
          </div>
          {/* ✨ NEW: Category Tips */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="font-medium text-white mb-3">Choosing the Right Category</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>
                <span className="text-blue-400">📚 Study Notes:</span> Comprehensive lecture notes, tutorials, and study guides
              </p>
              <p>
                <span className="text-green-400">✏️ Handwritten Notes:</span> Personal handwritten notes, annotations, and scanned notebooks
              </p>
              <p>
                <span className="text-yellow-400">📄 PYQ:</span> Previous year exam papers and solved solutions
              </p>
              <p>
                <span className="text-purple-400">⭐ Important Questions:</span> Frequently asked questions and important topics
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
