// src/PAGES/Contact.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { showToast } from '../../HELPERS/Toaster';
import HomeLayout from '../../LAYOUTS/Homelayout';

// Icons
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

const ClockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ChatIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const HeadphonesIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const BugIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
);

const BookIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const ShieldIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const SendIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
        priority: 'medium'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const contactMethods = [
        {
            icon: MailIcon,
            title: 'Email Support',
            description: 'Get help via email',
            contact: 'support@academicark.com',
            responseTime: '24 hours',
            color: 'blue'
        },
        {
            icon: ChatIcon,
            title: 'Live Chat',
            description: 'Chat with our team',
            contact: 'Available 9 AM - 6 PM',
            responseTime: 'Instant',
            color: 'green'
        },
        {
            icon: PhoneIcon,
            title: 'Phone Support',
            description: 'Call us directly',
            contact: '+1 (555) 123-4567',
            responseTime: 'Immediate',
            color: 'purple'
        },
        {
            icon: BugIcon,
            title: 'Bug Reports',
            description: 'Report technical issues',
            contact: 'bugs@academicark.com',
            responseTime: '12 hours',
            color: 'red'
        }
    ];

    const supportCategories = [
        {
            icon: BookIcon,
            title: 'Academic Content',
            description: 'Help with notes, uploads, and study materials',
            email: 'academic@academicark.com'
        },
        {
            icon: HeadphonesIcon,
            title: 'Technical Support',
            description: 'Platform issues, bugs, and technical problems',
            email: 'tech@academicark.com'
        },
        {
            icon: ShieldIcon,
            title: 'Account & Privacy',
            description: 'Account management, privacy, and security concerns',
            email: 'privacy@academicark.com'
        },
        {
            icon: ChatIcon,
            title: 'General Inquiries',
            description: 'General questions and feedback',
            email: 'hello@academicark.com'
        }
    ];

    const faqs = [
        {
            question: 'How do I upload my notes?',
            answer: 'Navigate to the Upload page, fill out the required information (title, subject, semester), and select your file. Only PDF, DOC, and DOCX files are accepted.'
        },
        {
            question: 'Why can\'t I download notes?',
            answer: 'Make sure you\'re logged in to your account. Some notes may require specific permissions or may be restricted to certain user roles.'
        },
        {
            question: 'How do I reset my password?',
            answer: 'Click on "Forgot Password" on the login page and enter your email. You\'ll receive a reset link within a few minutes.'
        },
        {
            question: 'Can I delete my uploaded notes?',
            answer: 'Yes, you can delete your own notes from your profile page. However, notes that have been downloaded by others may remain in the system for educational purposes.'
        },
        {
            question: 'How is my privacy protected?',
            answer: 'We take privacy seriously. Please review our Privacy Policy for detailed information about how we collect, use, and protect your data.'
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            showToast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                category: '',
                message: '',
                priority: 'medium'
            });
        } catch (error) {
            showToast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const ContactCard = ({ method }) => (
        <div className={`bg-gradient-to-br from-${method.color}-900/20 to-${method.color}-800/10 backdrop-blur-xl border border-${method.color}-500/20 rounded-2xl p-6 hover:scale-105 transition-transform shadow-lg`}>
            <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 bg-${method.color}-500/20 rounded-lg`}>
                    <method.icon className={`w-6 h-6 text-${method.color}-400`} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">{method.title}</h3>
                    <p className="text-gray-400 text-sm">{method.description}</p>
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-white font-medium">{method.contact}</p>
                <p className={`text-${method.color}-400 text-sm`}>Response: {method.responseTime}</p>
            </div>
        </div>
    );

    return (
        <HomeLayout>
            <div className="min-h-screen bg-black text-white">
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-900 via-black to-purple-900 py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6">
                                <HeadphonesIcon className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                                Contact Us
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                Have questions, feedback, or need help? We're here to assist you with anything related to Academic Ark.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-12">
                    {/* Contact Methods */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-white text-center mb-8">Get in Touch</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {contactMethods.map((method, index) => (
                                <ContactCard key={index} method={method} />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                                    <MailIcon className="w-6 h-6 text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Send us a Message</h2>
                            </div>

                            <form  onSubmit={handleSubmit} className="space-y-6">
                                {/* Name and Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                {/* Category and Priority */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select category</option>
                                            <option value="academic">Academic Content</option>
                                            <option value="technical">Technical Support</option>
                                            <option value="account">Account & Privacy</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="bug">Bug Report</option>
                                            <option value="feedback">Feedback</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Brief description of your inquiry"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Please provide detailed information about your inquiry..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {isSubmitting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <SendIcon className="w-5 h-5" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Contact Information & FAQ */}
                        <div className="space-y-8">
                            {/* Support Categories */}
                            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-white mb-6">Support Categories</h3>
                                <div className="space-y-4">
                                    {supportCategories.map((category, index) => (
                                        <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                                                <category.icon className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white">{category.title}</h4>
                                                <p className="text-gray-400 text-sm mt-1">{category.description}</p>
                                                <p className="text-blue-400 text-sm mt-2">{category.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Office Hours */}
                            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg">
                                        <ClockIcon className="w-6 h-6 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Support Hours</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Monday - Friday</span>
                                        <span className="text-green-400 font-medium">9:00 AM - 6:00 PM EST</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Saturday</span>
                                        <span className="text-yellow-400 font-medium">10:00 AM - 4:00 PM EST</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Sunday</span>
                                        <span className="text-red-400 font-medium">Closed</span>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                    <p className="text-blue-200 text-sm">
                                        <strong>Emergency Support:</strong> For urgent issues outside business hours, 
                                        email urgent@academicark.com and we'll respond within 2 hours.
                                    </p>
                                </div>
                            </div>

                            {/* Response Times */}
                            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-white mb-6">Expected Response Times</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                                        <span className="text-green-200">General Inquiries</span>
                                        <span className="text-green-400 font-semibold">24 hours</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                                        <span className="text-yellow-200">Technical Issues</span>
                                        <span className="text-yellow-400 font-semibold">12 hours</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                                        <span className="text-orange-200">Account Problems</span>
                                        <span className="text-orange-400 font-semibold">6 hours</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                                        <span className="text-red-200">Urgent Issues</span>
                                        <span className="text-red-400 font-semibold">2 hours</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-12 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors">
                                    <div className="flex items-start space-x-3">
                                        <CheckIcon className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-white mb-2">{faq.question}</h4>
                                            <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link
                                to="/help"
                                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                            >
                                <BookIcon className="w-4 h-4" />
                                <span>View All FAQs</span>
                            </Link>
                        </div>
                    </div>

                    {/* Additional Resources */}
                    <div className="mt-12 text-center">
                        <h3 className="text-xl font-semibold text-white mb-6">Additional Resources</h3>
                        <div className="flex items-center justify-center space-x-6 flex-wrap">
                            <Link
                                to="/help"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                            >
                                Help Center
                            </Link>
                            <span className="text-gray-600">•</span>
                            <Link
                                to="/privacy"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                            >
                                Privacy Policy
                            </Link>
                            <span className="text-gray-600">•</span>
                            <Link
                                to="/terms"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                            >
                                Terms of Service
                            </Link>
                            <span className="text-gray-600">•</span>
                            <Link
                                to="/status"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                            >
                                System Status
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}
