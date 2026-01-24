// ============================================
// STUDY PREFERENCE DRAWER COMPONENT
// ============================================
import React, { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  closePreferenceDrawer,
  fetchProgress,
  fetchStats,
  fetchTodayPlan,
  savePreferences,
  updatePreferences
} from '../../REDUX/Slices/plannerSlice';
import toast from 'react-hot-toast';
import axiosInstance from '../../HELPERS/axiosInstance';
import { useNavigate } from 'react-router-dom';

const DAILY_STUDY_OPTIONS = [30, 45, 60, 90, 120, 240, 360, 480, 600];
const STUDY_TIME_OPTIONS = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'];

export default function StudyPreferenceDrawer({ isFirstTime = false }) {
  const dispatch = useDispatch();
  const { showPreferenceDrawer, preferences, loading } = useSelector(
    (state) => state.planner
  );

  const [formData, setFormData] = useState({
    dailyStudyMinutes: 60,
    preferredStudyTime: 'EVENING',
    subjectsToFocus: [],
    examDates: []
  });
const [subjectSuggestions, setSubjectSuggestions] = useState([]);
const [subjectsAutoFilled, setSubjectsAutoFilled] = useState(false);
  const [subjectInput, setSubjectInput] = useState('');
  const [examInput, setExamInput] = useState('');
  const [examDate, setExamDate] = useState('');

  // Populate form when preferences are loaded
  useEffect(() => {
    if (preferences._id) {
      setFormData({
        dailyStudyMinutes: preferences.dailyStudyMinutes || 60,
        preferredStudyTime: preferences.preferredStudyTime || 'EVENING',
        subjectsToFocus: preferences.subjectsToFocus || [],
        examDates: preferences.examDates || []
      });
    }
  }, [preferences]);

  const handleDailyMinutesChange = (minutes) => {
    setFormData((prev) => ({
      ...prev,
      dailyStudyMinutes: minutes
    }));
  };

  const handleTimeChange = (time) => {
    setFormData((prev) => ({
      ...prev,
      preferredStudyTime: time
    }));
  };

  const handleAddSubject = () => {
  const value = subjectInput.trim();
  if (!value) return;

  if (formData.subjectsToFocus.includes(value)) {
    setSubjectInput('');
    return;
  }

  setFormData((prev) => ({
    ...prev,
    subjectsToFocus: [...prev.subjectsToFocus, value]
  }));

  setSubjectInput('');
};

  const handleRemoveSubject = (subject) => {
    setFormData((prev) => ({
      ...prev,
      subjectsToFocus: prev.subjectsToFocus.filter((s) => s !== subject)
    }));
  };

  const handleAddExam = () => {
    if (examInput.trim() && examDate) {
      setFormData((prev) => ({
        ...prev,
        examDates: [
          ...prev.examDates,
          {
            subject: examInput.trim(),
            examDate: new Date(examDate).toISOString()
          }
        ]
      }));
      setExamInput('');
      setExamDate('');
    }
  };

  const handleRemoveExam = (subject) => {
    setFormData((prev) => ({
      ...prev,
      examDates: prev.examDates.filter((e) => e.subject !== subject)
    }));
  };

 
const navigate = useNavigate();

const handleSave = async () => {
  if (formData.subjectsToFocus.length === 0) {
    toast.error('Please keep at least one subject selected');
    return;
  }

  try {
    const result = preferences._id
      ? await dispatch(updatePreferences(formData))
      : await dispatch(savePreferences(formData));

    if (updatePreferences.fulfilled.match(result) || savePreferences.fulfilled.match(result)) {
      toast.success(
        (t) => (
          <div className="flex items-center gap-3">
            <span>Planner is ready 🚀</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                navigate("/planner");
              }}
              className="ml-2 px-3 py-1 text-xs font-semibold bg-indigo-500 text-white rounded-full"
            >
              Open Planner →
            </button>
          </div>
        ),
        { duration: 6000 }
      );
    }
  } catch {
    toast.error("Failed to save preferences");
  }
};
  useEffect(() => {
  const fetchAndAutoFillSubjects = async () => {
    try {
      const res = await axiosInstance.get('/planner/subjects', {
        withCredentials: true
      });

      const subjects = res.data?.data || [];

      setSubjectSuggestions(subjects);

      // 🔥 AUTO-ADD LOGIC (ONLY ONCE)
      if (
        subjects.length > 0 &&
        !subjectsAutoFilled &&
        (!preferences.subjectsToFocus || preferences.subjectsToFocus.length === 0)
      ) {
        setFormData((prev) => ({
          ...prev,
          subjectsToFocus: subjects.map((s) => s.label)
        }));

        setSubjectsAutoFilled(true);
      }
    } catch (err) {
      console.error('Failed to fetch subject suggestions', err);
    }
  };

  if (showPreferenceDrawer) {
    fetchAndAutoFillSubjects();
  }
}, [showPreferenceDrawer, preferences.subjectsToFocus, subjectsAutoFilled]);
const remainingSuggestions = subjectSuggestions
  .map(s => s.label)
  .filter(
    (s) =>
      !formData.subjectsToFocus
        .map(x => x.toLowerCase())
        .includes(s.toLowerCase())
  );
  if (!showPreferenceDrawer) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => !isFirstTime && dispatch(closePreferenceDrawer())}
        aria-hidden="true"
      ></div>

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-neutral-950 border-l border-neutral-800 overflow-y-auto transform transition-transform animate-in slide-in-from-right">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-950 border-b border-neutral-800 px-6 py-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-100">
            Study Preferences
          </h2>
          {!isFirstTime && (
            <button
              onClick={() => dispatch(closePreferenceDrawer())}
              className="p-1 hover:bg-neutral-900 rounded-lg transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Daily Study Minutes */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-4">
              Daily Study Time
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DAILY_STUDY_OPTIONS.map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => handleDailyMinutesChange(minutes)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.dailyStudyMinutes === minutes
                      ? 'bg-indigo-500 text-white'
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-indigo-500/50'
                  }`}
                >
                  {minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h`}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Study Time */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-4">
              Preferred Study Time
            </label>
            <div className="space-y-2">
              {STUDY_TIME_OPTIONS.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeChange(time)}
                  className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                    formData.preferredStudyTime === time
                      ? 'bg-indigo-500/10 border border-indigo-500 text-indigo-400'
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-indigo-500/30'
                  }`}
                >
                  {time}
                  {formData.preferredStudyTime === time && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Subjects */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-4">
              Subjects to Focus
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                placeholder="Add subject..."
                className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none transition-colors text-sm"
              />
              <button
                onClick={handleAddSubject}
                className="px-4 py-2.5 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors text-sm"
              >
                Add
              </button>
            </div>

            {formData.subjectsToFocus.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.subjectsToFocus.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-sm text-indigo-400"
                  >
                    {subject}
                    <button
                      onClick={() => handleRemoveSubject(subject)}
                      className="hover:text-indigo-300 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Suggested Subjects */}
{remainingSuggestions.length > 0 && (
  <div className="mt-4">
    <p className="text-xs text-neutral-500 mb-2">
      Suggested for your semester
    </p>

    <div className="flex flex-wrap gap-2">
      {remainingSuggestions.map((subject) => (
        <button
          key={subject}
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              subjectsToFocus: [...prev.subjectsToFocus, subject]
            }))
          }
          className="
            flex items-center gap-1.5
            px-3 py-1.5
            rounded-full
            text-xs font-medium
            border
            border-dashed border-indigo-500/40
            text-indigo-400
            hover:bg-indigo-500/10
            hover:border-indigo-500
            transition-all
          "
        >
          <span className="text-sm">＋</span>
          {subject}
        </button>
      ))}
    </div>
  </div>
)}
          </div>

          {/* Exam Dates */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-4">
              Upcoming Exams
            </label>
            <div className="space-y-2 mb-4">
              <input
                type="text"
                value={examInput}
                onChange={(e) => setExamInput(e.target.value)}
                placeholder="Subject name..."
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none transition-colors text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:border-indigo-500 focus:outline-none transition-colors text-sm"
                />
                <button
                  onClick={handleAddExam}
                  className="px-4 py-2.5 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            {formData.examDates.length > 0 && (
              <div className="space-y-2">
                {formData.examDates.map((exam) => (
                  <div
                    key={exam.subject}
                    className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-100">
                        {exam.subject}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {new Date(exam.examDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveExam(exam.subject)}
                      className="p-1 hover:bg-neutral-800 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-neutral-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-neutral-950 border-t border-neutral-800 px-6 py-6 space-y-3">
          <button
            onClick={handleSave}
            disabled={loading.savingPreferences}
            className="w-full bg-neutral-100 hover:bg-white disabled:opacity-50 text-neutral-950 py-3 rounded-full font-semibold transition-all duration-300 text-sm"
          >
            {loading.savingPreferences ? 'Saving...' : 'Save Preferences'}
          </button>
          {!isFirstTime && (
            <button
              onClick={() => dispatch(closePreferenceDrawer())}
              className="w-full py-3 px-4 rounded-full border border-neutral-800 text-neutral-300 hover:bg-neutral-900 font-medium transition-colors text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// subject input validation atleat one subject must be there ok 
//get from backend subject name and all for that current semseter for sugesstion ok 