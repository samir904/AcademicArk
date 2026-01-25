import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    createStudyPlan,
    getStudyPlans,
    deleteStudyPlan
} from '../../REDUX/Slices/studyPlanner.slice';
import AILayout from '../../LAYOUTS/AILayout';

const AKTU_SUBJECTS = {
    'semester1': ['Calculus', 'Physics', 'Chemistry', 'Digital Electronics'],
    'semester2': ['ODE & PDE', 'Mechanics', 'Electronics', 'Programming'],
    'semester3': ['Data Structure', 'Web Design', 'DBMS', 'Discrete Math'],
    'semester4': ['Java OOP', 'Database Design', 'Software Engineering', 'Compiler Design'],
    'semester5': ['Web Technology', 'Cloud Computing', 'Design and Analysis of Algorithm', 'Object Oriented System Design with C++', 'Machine Learning Techniques', 'Database Management System', 'Artificial Intelligence', 'Introduction to Data Analytics and Visualization', 'Constitution of India'],
    'semester6': ['Cloud Computing', 'Machine Learning', 'Cryptography', 'Big Data'],
    'semester7': ['Advanced ML', 'Distributed Systems', 'IOT', 'Elective 1'],
    'semester8': ['Project', 'Internship', 'Elective 2', 'Seminar']
};

const StudyPlanner = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { studyPlans, loading } = useSelector(state => state.studyPlanner);

    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    
    const [formData, setFormData] = useState({
        examName: '',
        examType: 'semester',
        examDate: '',
        semester: 'semester1',
    });

    useEffect(() => {
        dispatch(getStudyPlans());
        // Initialize subjects for semester1
        setAvailableSubjects(AKTU_SUBJECTS['semester1']);
        setSelectedSubjects(AKTU_SUBJECTS['semester1']);
    }, [dispatch]);

    const handleSemesterChange = (e) => {
        const semester = e.target.value;
        const subjects = AKTU_SUBJECTS[semester] || [];
        setFormData({ ...formData, semester });
        setAvailableSubjects(subjects);
        setSelectedSubjects([...subjects]);
    };

    const toggleSubject = (subject) => {
        setSelectedSubjects(prev =>
            prev.includes(subject)
                ? prev.filter(s => s !== subject)
                : [...prev, subject]
        );
    };
    const handleCreatePlan = (e) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) {
        alert('Please select at least one subject');
        return;
    }
    if (!formData.examName || !formData.examDate) {
        alert('Please fill all required fields');
        return;
    }

    // Each subject: include initialized full chapter fields
    const subjects = selectedSubjects.map(name => ({
        name,
        chapters: Array.from({ length: 5 }, (_, i) => ({
            name: `Chapter ${i + 1}`,
            chapterNumber: i + 1,
            syllabusCompleted: false,
            revisionCompleted: false,
            pyqCompleted: false,
            completionStage: 0
        }))
    }));

    dispatch(createStudyPlan({
        examName: formData.examName,
        examType: formData.examType,
        examDate: formData.examDate,
        subjects
    })).then((result) => {
        if (result.payload && result.payload._id) {
            setShowModal(false);
            setFormData({
                examName: '',
                examType: 'semester',
                examDate: '',
                semester: 'semester1',
            });
            setSelectedSubjects([]);
            // Use _id from backend
            navigate(`/study-planner/${result.payload._id}`);
        }
    });
};


    // const handleCreatePlan = (e) => {
    //     e.preventDefault();
    //     if (selectedSubjects.length === 0) {
    //         alert('Please select at least one subject');
    //         return;
    //     }
    //     if (!formData.examName || !formData.examDate) {
    //         alert('Please fill all required fields');
    //         return;
    //     }

    //     const subjects = selectedSubjects.map(name => ({
    //         name,
    //         chapters: Array.from({ length: 5 }, (_, i) => ({ name: `Chapter ${i + 1}` }))
    //     }));

    //     dispatch(createStudyPlan({
    //         examName: formData.examName,
    //         examType: formData.examType,
    //         examDate: formData.examDate,
    //         subjects
    //     })).then((result) => {
    //         if (result.payload) {
    //             setShowModal(false);
    //             setFormData({
    //                 examName: '',
    //                 examType: 'semester',
    //                 examDate: '',
    //                 semester: 'semester1',
    //             });
    //             setSelectedSubjects([]);
    //             navigate(`/study-planner/${result.payload._id}`);
    //         }
    //     });
    // };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Delete this study plan?')) {
            dispatch(deleteStudyPlan(id));
        }
    };

    const getDaysUntil = (date) => {
        const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
        return days;
    };

    const filteredPlans = studyPlans.filter(plan =>
        plan.examName.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(a.examDate) - new Date(b.examDate));

    const stats = {
        total: studyPlans.length,
        inProgress: studyPlans.filter(p => p.overallProgress > 0 && p.overallProgress < 100).length,
        completed: studyPlans.filter(p => p.overallProgress === 100).length,
    };

    return (
        <AILayout>
            <div className="h-full flex flex-col bg-black overflow-hidden">
                
                {/* Header */}
                <div className="flex-shrink-0 border-b border-gray-800 bg-black">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">Study Planner</h1>
                                <p className="text-sm text-gray-500">Plan your exam preparation smartly</p>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all active:scale-95"
                            >
                                <span className="flex items-center gap-2">
                                    <span>✨</span> Create Plan
                                </span>
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                <div className="text-2xl font-bold text-white">{stats.total}</div>
                                <div className="text-xs text-gray-500">Plans</div>
                            </div>
                            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
                                <div className="text-xs text-gray-500">In Progress</div>
                            </div>
                            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
                                <div className="text-xs text-gray-500">Completed</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="flex-shrink-0 border-b border-gray-800 px-4 py-3">
                    <div className="max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search study plans..."
                            className="w-full bg-gray-900 border border-gray-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder-gray-600"
                        />
                    </div>
                </div>

                {/* Plans List */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        {filteredPlans.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">📅</div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {searchQuery ? 'No plans found' : 'No study plans yet'}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {searchQuery ? 'Try a different search' : 'Create your first study plan to get started'}
                                </p>
                                {!searchQuery && (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all"
                                    >
                                        Create Plan
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredPlans.map(plan => {
                                    const daysLeft = getDaysUntil(plan.examDate);
                                    const isUrgent = daysLeft <= 7 && daysLeft >= 0;
                                    const isPast = daysLeft < 0;

                                    return (
                                        <div
                                            key={plan._id}
                                            onClick={() => navigate(`/study-planner/${plan._id}`)}
                                            className="group bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-gray-900/80"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Progress Circle */}
                                                <div className="flex-shrink-0 w-16 h-16 relative">
                                                    <svg className="w-16 h-16 transform -rotate-90">
                                                        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
                                                        <circle
                                                            cx="32"
                                                            cy="32"
                                                            r="28"
                                                            fill="none"
                                                            stroke="url(#grad)"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeDasharray={`${2 * Math.PI * 28}`}
                                                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - plan.overallProgress / 100)}`}
                                                            className="transition-all duration-1000"
                                                        />
                                                        <defs>
                                                            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#6366f1" />
                                                                <stop offset="100%" stopColor="#14b8a6" />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <div className="text-sm font-bold text-white">{plan.overallProgress}%</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                                {plan.examName}
                                                            </h3>
                                                            <p className="text-xs text-gray-500 uppercase mt-1">
                                                                {plan.examType} • {plan.subjects.length} subjects
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            isPast ? 'bg-gray-800 text-gray-500' :
                                                            isUrgent ? 'bg-red-500/20 text-red-400' :
                                                            'bg-blue-500/20 text-blue-400'
                                                        }`}>
                                                            {isPast ? '✓ Past' : isUrgent ? `🔥 ${daysLeft}d` : `📅 ${daysLeft}d`}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 mt-3">
                                                        <div className="text-xs text-gray-500">
                                                            📅 {new Date(plan.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </div>
                                                        <div className="w-1 h-1 bg-gray-700 rounded-full" />
                                                        <div className="text-xs text-gray-500">
                                                            📚 {plan.subjects.length} subjects
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/study-planner/${plan._id}`); }}
                                                        className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-600/50 text-indigo-400 text-sm rounded-lg transition-all"
                                                    >
                                                        Open
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(plan._id, e)}
                                                        className="p-1.5 bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 text-red-400 rounded-lg transition-all"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
       
        </AILayout>
    );
};

export default StudyPlanner;
