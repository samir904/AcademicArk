import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getStudyPlanById, updateChapterProgress } from '../../REDUX/Slices/studyPlanner.slice';
import { getMyNotes } from '../../REDUX/Slices/authslice';
import AILayout from '../../LAYOUTS/AILayout';
import axiosInstance from '../../HELPERS/axiosInstance';

const StudyPlannerDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPlan, loading } = useSelector(state => state.studyPlanner);
  
  const [activeSubject, setActiveSubject] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [subjectMaterials, setSubjectMaterials] = useState(null);
  const [showTimetable, setShowTimetable] = useState(false);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  useEffect(() => {
    dispatch(getStudyPlanById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentPlan?.subjects?.length > 0 && !activeSubject) {
      setActiveSubject(currentPlan.subjects[0]._id);
    }
  }, [currentPlan, activeSubject]);

  // ✅ Fetch materials when subject changes
  useEffect(() => {
    if (activeSubject && id) {
      fetchSubjectMaterials();
    }
  }, [activeSubject]);

  const fetchSubjectMaterials = async () => {
    setMaterialsLoading(true);
    try {
      const res = await axiosInstance.get(`/study-planner/${id}/subjects/${activeSubject}/materials`);
      setSubjectMaterials(res.data.materials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setSubjectMaterials(null);
    } finally {
      setMaterialsLoading(false);
    }
  };

  const handleProgressUpdate = (subjectId, chapterId, progressType) => {
    dispatch(updateChapterProgress({
      planId: id,
      subjectId,
      chapterId,
      progressType
    }));
  };

  const getDaysUntil = () => {
    if (!currentPlan) return 0;
    const days = Math.ceil((new Date(currentPlan.examDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading || !currentPlan) {
    return (
      <AILayout>
        <div className="h-full flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading study plan...</p>
          </div>
        </div>
      </AILayout>
    );
  }

  const activeSubjectData = currentPlan.subjects?.find(s => s._id === activeSubject);
  const daysUntil = getDaysUntil();
  const isUrgent = daysUntil <= 7 && daysUntil >= 0;

  return (
    <AILayout>
      <div className="h-full flex flex-col bg-black overflow-hidden">
        
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-800 bg-black">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => navigate('/study-planner')}
                    className="p-1.5 hover:bg-gray-800 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h1 className="text-2xl font-bold text-white">{currentPlan.examName}</h1>
                </div>
                <p className="text-sm text-gray-500 ml-11">{currentPlan.subjects.length} subjects • Exam in {daysUntil} days</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowTimetable(!showTimetable)}
                  className="px-4 py-2 bg-purple-600/20 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-all text-sm font-semibold"
                >
                  📅 Timetable
                </button>
                <div className={`text-right px-4 py-2 rounded-xl ${
                  isUrgent ? 'bg-red-500/20 border border-red-500/30' : 'bg-indigo-500/20 border border-indigo-500/30'
                }`}>
                  <div className="text-2xl font-bold text-white">{currentPlan.overallProgress}%</div>
                  <div className="text-xs text-gray-400">Complete</div>
                </div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Overall Progress</span>
                <span>{currentPlan.subjects.filter(s => s.progress === 100).length}/{currentPlan.subjects.length} subjects done</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-teal-600 transition-all duration-1000"
                  style={{ width: `${currentPlan.overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Modal */}
        {showTimetable && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>📅</span> Study Timetable
                </h2>
                <button
                  onClick={() => setShowTimetable(false)}
                  className="p-1 hover:bg-gray-800 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {currentPlan.timetable && (
                <div className="space-y-4">
                  <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Days Until Exam</span>
                        <div className="text-2xl font-bold text-indigo-400">{currentPlan.timetable.daysUntilExam} days</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Study Hours/Day</span>
                        <div className="text-2xl font-bold text-indigo-400">{currentPlan.timetable.studyHoursPerDay} hrs</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Hours/Subject</span>
                        <div className="text-2xl font-bold text-teal-400">{currentPlan.timetable.hoursPerSubject} hrs</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Hours/Chapter</span>
                        <div className="text-2xl font-bold text-teal-400">{currentPlan.timetable.hoursPerChapter} hrs</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentPlan.timetable.schedule.map((item, idx) => (
                      <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3">{item.subjectName}</h4>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <span className="text-xs text-gray-500">Start Day</span>
                            <p className="text-lg font-bold text-indigo-400">Day {item.startDay}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">End Day</span>
                            <p className="text-lg font-bold text-teal-400">Day {item.endDay}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Daily Hours</span>
                            <p className="text-lg font-bold text-purple-400">{item.dailyHours}h</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {item.phases.map((phase, phaseIdx) => (
                            <div key={phaseIdx} className="flex items-center justify-between text-sm bg-gray-900/50 p-2 rounded">
                              <span className="text-gray-300">{phase.phase}</span>
                              <span className="text-gray-500">{phase.daysAllocated} days</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex gap-4">
          
          {/* Left Sidebar - Subjects */}
          <div className="hidden md:flex flex-col w-64 border-r border-gray-800 bg-gray-950/50 overflow-y-auto">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-sm font-bold text-gray-300 uppercase">Subjects</h2>
            </div>
            <div className="space-y-2 p-3">
              {currentPlan.subjects.map(subject => (
                <button
                  key={subject._id}
                  onClick={() => setActiveSubject(subject._id)}
                  className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                    activeSubject === subject._id
                      ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-300'
                      : 'bg-gray-800/30 hover:bg-gray-800/50 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">{subject.name}</span>
                    {subject.progress === 100 && <span className="text-green-400">✓</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-teal-500"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{subject.progress}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Content - Chapters + Materials */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-4 space-y-6">
              
              {activeSubjectData && (
                <>
                  {/* Subject Header */}
                  <div className="bg-gradient-to-r from-indigo-600/20 to-teal-600/20 border border-indigo-500/30 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{activeSubjectData.name}</h2>
                        <p className="text-sm text-gray-400">{activeSubjectData.chapters?.length || 0} chapters</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{activeSubjectData.progress}%</div>
                        <div className="text-xs text-gray-400">Progress</div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 transition-all"
                        style={{ width: `${activeSubjectData.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Chapters List */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span>📑</span> Syllabus ({activeSubjectData.chapters?.length || 0} chapters)
                    </h3>
                    <div className="space-y-3">
                      {activeSubjectData.chapters?.map(chapter => (
                        <div key={chapter._id} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
                          
                          {/* Chapter Header */}
                          <button
                            onClick={() => setExpandedChapter(expandedChapter === chapter._id ? null : chapter._id)}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-900/80 transition-all"
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-8 h-8 flex-shrink-0 bg-indigo-600/20 border border-indigo-500/30 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-bold text-indigo-400">{chapter.chapterNumber || '📖'}</span>
                              </div>
                              <div className="text-left">
                                <p className="font-semibold text-white">{chapter.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {chapter.syllabusCompleted ? '✓' : '○'} Syllabus • 
                                  {chapter.revisionCompleted ? ' ✓' : ' ○'} Revision • 
                                  {chapter.pyqCompleted ? ' ✓' : ' ○'} PYQ
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="text-right">
                                <div className="text-sm font-bold text-indigo-400">{chapter.completionStage || 0}/3</div>
                                <div className="text-xs text-gray-500">stages</div>
                              </div>
                              <svg
                                className={`w-5 h-5 text-gray-600 transition-transform ${
                                  expandedChapter === chapter._id ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                            </div>
                          </button>

                          {/* Chapter Expanded Content */}
                          {expandedChapter === chapter._id && (
                            <div className="border-t border-gray-800 bg-gray-950/50 p-4 space-y-4">
                              
                              {/* Stage 1: Syllabus */}
                              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="font-semibold text-white flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-xs font-bold text-blue-400">1</span>
                                      Syllabus Coverage
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">Study the complete chapter</p>
                                  </div>
                                  <button
                                    onClick={() => handleProgressUpdate(activeSubject, chapter._id, 'syllabus')}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                                      chapter.syllabusCompleted
                                        ? 'bg-green-600/30 text-green-400 border border-green-500/50'
                                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                                    }`}
                                  >
                                    {chapter.syllabusCompleted ? '✓ Done' : 'Mark Done'}
                                  </button>
                                </div>
                              </div>

                              {/* Stage 2: Revision */}
                              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="font-semibold text-white flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-full bg-yellow-600/30 border border-yellow-500/50 flex items-center justify-center text-xs font-bold text-yellow-400">2</span>
                                      Revision
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">Review and consolidate</p>
                                  </div>
                                  <button
                                    onClick={() => handleProgressUpdate(activeSubject, chapter._id, 'revision')}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                                      chapter.revisionCompleted
                                        ? 'bg-green-600/30 text-green-400 border border-green-500/50'
                                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600 disabled:opacity-50'
                                    }`}
                                    disabled={!chapter.syllabusCompleted}
                                  >
                                    {chapter.revisionCompleted ? '✓ Done' : 'Mark Done'}
                                  </button>
                                </div>
                              </div>

                              {/* Stage 3: PYQ */}
                              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="font-semibold text-white flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-full bg-red-600/30 border border-red-500/50 flex items-center justify-center text-xs font-bold text-red-400">3</span>
                                      PYQ & Important Questions
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">Solve practice questions</p>
                                  </div>
                                  <button
                                    onClick={() => handleProgressUpdate(activeSubject, chapter._id, 'pyq')}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                                      chapter.pyqCompleted
                                        ? 'bg-green-600/30 text-green-400 border border-green-500/50'
                                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600 disabled:opacity-50'
                                    }`}
                                    disabled={!chapter.revisionCompleted}
                                  >
                                    {chapter.pyqCompleted ? '✓ Done' : 'Mark Done'}
                                  </button>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-lg p-3">
                                <div className="flex gap-2">
                                  <div className={`h-2 flex-1 rounded-full ${chapter.syllabusCompleted ? 'bg-blue-500' : 'bg-gray-800'}`} />
                                  <div className={`h-2 flex-1 rounded-full ${chapter.revisionCompleted ? 'bg-yellow-500' : 'bg-gray-800'}`} />
                                  <div className={`h-2 flex-1 rounded-full ${chapter.pyqCompleted ? 'bg-red-500' : 'bg-gray-800'}`} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Materials Playlist Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>🎬</span> Study Materials Playlist
                    </h3>

                    {materialsLoading ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-gray-400">Loading materials...</p>
                      </div>
                    ) : !subjectMaterials || (subjectMaterials.notes.length === 0 && subjectMaterials.pyq.length === 0 && subjectMaterials.importantQuestions.length === 0) ? (
                      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
                        <p className="text-gray-400">No materials found for this subject</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        
                        {/* Notes */}
                        {subjectMaterials?.notes.length > 0 && (
                          <div>
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <span>📚</span> Notes ({subjectMaterials.notes.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {subjectMaterials.notes.map(note => (
                                <MaterialCard key={note._id} material={note} type="notes" />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* PYQ */}
                        {subjectMaterials?.pyq.length > 0 && (
                          <div>
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <span>📝</span> Previous Year Questions ({subjectMaterials.pyq.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {subjectMaterials.pyq.map(pyq => (
                                <MaterialCard key={pyq._id} material={pyq} type="pyq" />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Important Questions */}
                        {subjectMaterials?.importantQuestions.length > 0 && (
                          <div>
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <span>⭐</span> Important Questions ({subjectMaterials.importantQuestions.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {subjectMaterials.importantQuestions.map(iq => (
                                <MaterialCard key={iq._id} material={iq} type="important" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AILayout>
  );
};

// ✅ Material Card Component
const MaterialCard = ({ material, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'notes':
        return '📚';
      case 'pyq':
        return '📝';
      case 'important':
        return '⭐';
      default:
        return '📄';
    }
  };

  const downloadFile = () => {
    if (material.fileUrl) {
      window.open(material.fileUrl, '_blank');
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 rounded-lg p-4 transition-all group">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-600/30 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/50 transition-all text-lg">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
            {material.title}
          </p>
          <p className="text-xs text-gray-500 mt-1">{material.category}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-2">
          {material.rating && <span>⭐ {material.rating}</span>}
          {material.downloads && <span>• 📥 {material.downloads}</span>}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={downloadFile}
          className="flex-1 px-3 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-400 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
        >
          <span>⬇️</span> Download
        </button>
        <button className="px-3 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-400 text-sm rounded-lg transition-all">
          📌
        </button>
      </div>
    </div>
  );
};

export default StudyPlannerDetail;
