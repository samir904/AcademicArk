// src/PAGES/AboutDeveloper.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Icons
const UserIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const AcademicCapIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
);

const CodeIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const BriefcaseIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.1M21 21l-9-9-9 9" />
    </svg>
);

const LightbulbIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const MailIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const PhoneIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const LocationIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ExternalLinkIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const StarIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const GitHubIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);

const LinkedInIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const TwitterIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
);

export default function AboutDeveloper() {
    const [activeTab, setActiveTab] = useState('about');

    // Skills data
    const skills = {
        frontend: ['React.js', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Redux Toolkit', 'React Router'],
        backend: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT Authentication', 'RESTful APIs', 'Cloudinary'],
        tools: ['Git & GitHub', 'VS Code', 'Postman', 'MongoDB Atlas', 'Render', 'npm/yarn', 'Thunder Client'],
        languages: ['JavaScript', 'Python (Basic)', 'Java (DSA)','C++', 'SQL', 'HTML/CSS']
    };

    // Projects data
    const projects = [
        {
    title: 'Academic Ark',
    description:
      'A comprehensive note-sharing platform for students to upload, download, and manage academic materials with advanced search, user roles, and analytics.',
    technologies: [
      'React.js',
      'Node.js',
      'MongoDB',
      'Express.js',
      'Cloudinary',
      'JWT',
      'Redux',
    ],
    features: [
      'User Authentication',
      'File Upload/Download',
      'Advanced Search',
      'Admin Dashboard',
      'User Analytics',
      'Rating System',
    ],
    status: 'Completed', // ✅ updated
    github: 'https://github.com/samir904/AcademicArk', // ✅ frontend/backend both share repo link
    live: 'https://academicark-mvp8.onrender.com',      // ✅ updated production live site
    color: 'blue',
  },
        {
            title: 'LMS',
            description: 'Learning Management System with course creation, enrollment, video streaming, and progress tracking for educators and students.',
            technologies: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Razorpay', 'JWT'],
            features: ['Course Management', 'Payment Integration', 'Video Lectures'],
            status: 'Completed',
            github: 'https://github.com/samir904/lms-fronted',
            live: 'https://lms-fronted-1.onrender.com/',
            color: 'green'
        },
        {
            title: 'SnipStory',
            description: 'Full-stack social media application with  post sharing,  and interactive features.',
            technologies: ['React.js', 'Node.js', 'MongoDB', 'Cloudinary', 'JWT'],
            features: [ 'Post Sharing', 'Like/Comment System', 'Image Upload'],
            status: 'Completed',
            github: 'https://github.com/samir904/BLOG-app-fronted',
            live: 'https://blog-app-fronted.onrender.com/',
            color: 'purple'
        }
    ];

    // Statistics
    const stats = [
        { label: 'Full-Stack Projects', value: '3+', icon: CodeIcon },
        { label: 'Technologies Mastered', value: '15+', icon: LightbulbIcon },
        { label: 'Years of Learning', value: '2+', icon: AcademicCapIcon },
        { label: 'GitHub Repositories', value: '20+', icon: GitHubIcon }
    ];

    // Career goals
    const careerGoals = [
        {
            title: 'MAANG Companies',
            description: 'Aspiring to work at top tech companies like Google, Microsoft, Amazon, Apple, and Netflix',
            icon: StarIcon,
            color: 'yellow'
        },
        {
            title: 'Startup Environment',
            description: 'Excited to contribute to innovative startups and build products that make a difference',
            icon: LightbulbIcon,
            color: 'blue'
        },
        {
            title: 'Service-Based Companies',
            description: 'Looking to gain experience in service-based companies working on diverse client projects',
            icon: BriefcaseIcon,
            color: 'green'
        }
    ];

    const SkillCard = ({ category, skillList, color }) => (
        <div className={`bg-gradient-to-br from-${color}-900/20 to-${color}-800/10 backdrop-blur-xl border border-${color}-500/20 rounded-2xl p-6`}>
            <h3 className={`text-lg font-semibold text-${color}-300 mb-4 capitalize`}>{category}</h3>
            <div className="flex flex-wrap gap-2">
                {skillList.map((skill, index) => (
                    <span key={index} className={`bg-${color}-500/20 text-${color}-300 px-3 py-1 rounded-full text-sm border border-${color}-500/30`}>
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );

    const ProjectCard = ({ project }) => (
        <div className={`bg-gradient-to-br from-${project.color}-900/20 to-${project.color}-800/10 backdrop-blur-xl border border-${project.color}-500/20 rounded-2xl p-8 hover:scale-105 transition-transform shadow-lg`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs bg-${project.color}-500/20 text-${project.color}-300 border border-${project.color}-500/30`}>
                        {project.status}
                    </span>
                </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>
            
            <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                    {project.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div className={`w-2 h-2 bg-${project.color}-400 rounded-full`}></div>
                            <span className="text-gray-400 text-sm">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-white/10 text-gray-300 px-2 py-1 rounded text-xs">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-2 bg-${project.color}-500/20 border border-${project.color}-500/30 text-${project.color}-300 px-4 py-2 rounded-lg hover:bg-${project.color}-500/30 transition-colors`}
                >
                    <GitHubIcon className="w-4 h-4" />
                    <span>Code</span>
                </a>
                <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-2 bg-${project.color}-500 text-white px-4 py-2 rounded-lg hover:bg-${project.color}-600 transition-colors`}
                >
                    <ExternalLinkIcon className="w-4 h-4" />
                    <span>Live Demo</span>
                </a>
            </div>
        </div>
    );

    return (
        <>
            <div className="min-h-screen bg-black text-white">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-blue-900 via-black to-purple-900 py-20">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-8xl font-bold text-white shadow-2xl">
                                    SS
                                </div>
                                <div className="absolute -bottom-4 -right-4 bg-green-500 w-16 h-16 rounded-full flex items-center justify-center border-4 border-black">
                                    <span className="text-white text-xs font-bold">Available</span>
                                </div>
                            </div>
                            
                            {/* Profile Info */}
                            <div className="flex-1 text-center lg:text-left">
                                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                                    Samir Suman
                                </h1>
                                <h2 className="text-2xl lg:text-3xl text-blue-400 mb-4 font-semibold">
                                    MERN Stack Developer
                                </h2>
                                <p className="text-xl text-gray-300 mb-6 max-w-2xl">
                                    B.Tech 3rd Year CSE Data Science student at KCC Institute of Technology & Management. 
                                    Passionate about building full-stack applications and solving real-world problems through code.
                                </p>
                                
                                {/* Stats */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="text-center">
                                            <div className="text-3xl font-bold text-blue-400">{stat.value}</div>
                                            <div className="text-sm text-gray-400">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Social Links */}
                                <div className="flex items-center justify-center lg:justify-start space-x-4">
                                    <a
                                        href="https://github.com/samir904"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                    >
                                        <GitHubIcon className="w-6 h-6 text-white" />
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/samirsumanm"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-blue-600/20 rounded-full hover:bg-blue-600/30 transition-colors"
                                    >
                                        <LinkedInIcon className="w-6 h-6 text-blue-400" />
                                    </a>
                                    <a
                                        href="https://twitter.com/samirsumanm"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-sky-500/20 rounded-full hover:bg-sky-500/30 transition-colors"
                                    >
                                        <TwitterIcon className="w-6 h-6 text-sky-400" />
                                    </a>
                                    <a
                                        href="mailto:sumansamir3@gmail.com"
                                        className="p-3 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors"
                                    >
                                        <MailIcon className="w-6 h-6 text-red-400" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-gray-900/50 border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex space-x-6 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'about', label: 'About Me', icon: UserIcon },
                                { id: 'skills', label: 'Skills', icon: CodeIcon },
                                { id: 'projects', label: 'Projects', icon: BriefcaseIcon },
                                { id: 'goals', label: 'Career Goals', icon: LightbulbIcon }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-2 border-b-2 transition-colors flex items-center space-x-2 ${
                                        activeTab === tab.id 
                                            ? 'border-blue-500 text-blue-400' 
                                            : 'border-transparent text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-12">
                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <div className="space-y-8">
                            {/* About Me */}
                            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                                <div className="flex items-center space-x-3 mb-6">
                                    <UserIcon className="w-8 h-8 text-blue-400" />
                                    <h2 className="text-3xl font-bold text-white">About Me</h2>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <p className="text-gray-300 leading-relaxed text-lg">
                                            Hello! I'm <span className="text-blue-400 font-semibold">Samir Suman</span>, 
                                            a passionate MERN stack developer currently pursuing my B.Tech in Computer Science 
                                            & Engineering with specialization in Data Science from KCC Institute of Technology & Management.
                                        </p>
                                        <p className="text-gray-300 leading-relaxed">
                                            I have developed <span className="text-purple-400 font-semibold">3 full-stack applications</span> 
                                            that demonstrate my proficiency in modern web development technologies. My journey in 
                                            programming started with curiosity and has evolved into a passion for creating 
                                            meaningful digital solutions.
                                        </p>
                                        <p className="text-gray-300 leading-relaxed">
                                            I'm actively seeking opportunities to work on <span className="text-green-400 font-semibold">real-world projects</span> 
                                            with startups, service-based companies, and MAANG companies where I can contribute 
                                            my skills while continuing to learn and grow as a developer.
                                        </p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-white/5 rounded-xl p-6">
                                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                                                <AcademicCapIcon className="w-6 h-6 text-blue-400" />
                                                <span>Education</span>
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-blue-400 font-semibold">B.Tech CSE Data Science</h4>
                                                    <p className="text-gray-300">KCC Institute of Technology & Management</p>
                                                    <p className="text-gray-400 text-sm">2023 - 2027 • Currently in 3rd Year</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-6">
                                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                                                <LocationIcon className="w-6 h-6 text-green-400" />
                                                <span>Location</span>
                                            </h3>
                                            <p className="text-gray-300">India</p>
                                            <p className="text-gray-400 text-sm">Available for Remote Work</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Journey Timeline */}
                            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-8">My Developer Journey</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                            1
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">Started Learning Programming</h3>
                                            <p className="text-gray-400 text-sm mb-2">2023 - College First Year</p>
                                            <p className="text-gray-300">Began my coding journey with C and DSA fundamentals</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                            2
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">Discovered Web Development</h3>
                                            <p className="text-gray-400 text-sm mb-2">2024 - Second Year</p>
                                            <p className="text-gray-300">Learned HTML, CSS, JavaScript and fell in love with web development</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                            3
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">MERN Stack Mastery</h3>
                                            <p className="text-gray-400 text-sm mb-2">2024-2025</p>
                                            <p className="text-gray-300">Mastered React.js, Node.js, Express.js, and MongoDB to become a full-stack developer</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                            4
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">Built Real Projects</h3>
                                            <p className="text-gray-400 text-sm mb-2">2025 - Present</p>
                                            <p className="text-gray-300">Created 3 full-stack applications and actively seeking real-world opportunities</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Skills Tab */}
                    {activeTab === 'skills' && (
                        <div className="space-y-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-white mb-4">Technical Skills</h2>
                                <p className="text-gray-400 max-w-2xl mx-auto">
                                    Here are the technologies and tools I've mastered during my journey as a MERN stack developer.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SkillCard category="Frontend" skillList={skills.frontend} color="blue" />
                                <SkillCard category="Backend" skillList={skills.backend} color="green" />
                                <SkillCard category="Tools & Platforms" skillList={skills.tools} color="purple" />
                                <SkillCard category="Languages" skillList={skills.languages} color="orange" />
                            </div>
                        </div>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div className="space-y-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-white mb-4">My Projects</h2>
                                <p className="text-gray-400 max-w-2xl mx-auto">
                                    Here are the full-stack applications I've built using the MERN stack, showcasing my development skills and creativity.
                                </p>
                            </div>
                            
                            <div className="space-y-8">
                                {projects.map((project, index) => (
                                    <ProjectCard key={index} project={project} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Career Goals Tab */}
                    {activeTab === 'goals' && (
                        <div className="space-y-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-white mb-4">Career Aspirations</h2>
                                <p className="text-gray-400 max-w-2xl mx-auto">
                                    I'm passionate about technology and eager to contribute to innovative projects. Here's what I'm looking for in my career.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                {careerGoals.map((goal, index) => (
                                    <div key={index} className={`bg-gradient-to-br from-${goal.color}-900/20 to-${goal.color}-800/10 backdrop-blur-xl border border-${goal.color}-500/20 rounded-2xl p-8 text-center hover:scale-105 transition-transform`}>
                                        <div className={`w-16 h-16 bg-${goal.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-6`}>
                                            <goal.icon className={`w-8 h-8 text-${goal.color}-400`} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-4">{goal.title}</h3>
                                        <p className="text-gray-300">{goal.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* What I Offer */}
                            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-8 text-center">What I Bring to the Table</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CodeIcon className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <h4 className="text-white font-semibold mb-2">Full-Stack Skills</h4>
                                        <p className="text-gray-400 text-sm">Complete MERN stack proficiency</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <LightbulbIcon className="w-6 h-6 text-green-400" />
                                        </div>
                                        <h4 className="text-white font-semibold mb-2">Problem Solving</h4>
                                        <p className="text-gray-400 text-sm">Strong analytical thinking</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <BriefcaseIcon className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <h4 className="text-white font-semibold mb-2">Project Experience</h4>
                                        <p className="text-gray-400 text-sm">3 full-stack applications</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AcademicCapIcon className="w-6 h-6 text-orange-400" />
                                        </div>
                                        <h4 className="text-white font-semibold mb-2">Continuous Learning</h4>
                                        <p className="text-gray-400 text-sm">Always updating skills</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact CTA */}
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border-t border-white/10">
                    <div className="max-w-6xl mx-auto px-4 py-12 text-center">
                        <h3 className="text-3xl font-bold text-white mb-4">Let's Work Together!</h3>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            I'm actively looking for opportunities to contribute to real-world projects. 
                            Let's discuss how I can add value to your team.
                        </p>
                        <div className="flex items-center justify-center space-x-6 flex-wrap">
                            <a
                                href="mailto:sumansamir3@gmail.com"
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium flex items-center space-x-2 shadow-lg"
                            >
                                <MailIcon className="w-5 h-5" />
                                <span>Email Me</span>
                            </a>
                            <a
                                href="https://linkedin.com/in/samirsumanm"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-lg hover:bg-white/20 transition-all font-medium flex items-center space-x-2"
                            >
                                <LinkedInIcon className="w-5 h-5" />
                                <span>Connect on LinkedIn</span>
                            </a>
                            <a
                                href="https://github.com/samir904"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-lg hover:bg-white/20 transition-all font-medium flex items-center space-x-2"
                            >
                                <GitHubIcon className="w-5 h-5" />
                                <span>View GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
