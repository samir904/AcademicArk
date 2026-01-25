// src/PAGES/Privacy.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Icons
const ShieldIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const LockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const EyeIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const UserIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const DatabaseIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
);

const MailIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const ClockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export default function Privacy() {
    const lastUpdated = "August 15, 2025";

    const Section = ({ icon: Icon, title, children }) => (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed">
                {children}
            </div>
        </div>
    );

    const ListItem = ({ children }) => (
        <div className="flex items-start space-x-3">
            <CheckIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <span>{children}</span>
        </div>
    );

    return (
        <>
            <div className="min-h-screen bg-black text-white">
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-900 via-black to-purple-900 py-16">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6">
                                <ShieldIcon className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                                Privacy Policy
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                Your privacy is important to us. This policy explains how Academic Ark collects, uses, and protects your information.
                            </p>
                            <div className="mt-6 inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2">
                                <ClockIcon className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-300 text-sm">Last updated: {lastUpdated}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
                    {/* Introduction */}
                    <Section icon={EyeIcon} title="Introduction">
                        <p>
                            Welcome to Academic Ark, your trusted platform for academic notes and study materials. 
                            This Privacy Policy describes how we collect, use, disclose, and safeguard your information 
                            when you visit our platform or use our services.
                        </p>
                        <p>
                            By accessing or using Academic Ark, you agree to the collection and use of information 
                            in accordance with this policy. If you do not agree with our policies and practices, 
                            please do not use our services.
                        </p>
                    </Section>

                    {/* Information Collection */}
                    <Section icon={DatabaseIcon} title="Information We Collect">
                        <p>We collect information in the following ways:</p>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                                <div className="space-y-2">
                                    <ListItem>Full name and email address when you create an account</ListItem>
                                    <ListItem>Profile information including avatar, bio, and academic details</ListItem>
                                    <ListItem>University, course, and semester information for better content recommendations</ListItem>
                                    <ListItem>Communication preferences and notification settings</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Usage Information</h3>
                                <div className="space-y-2">
                                    <ListItem>Notes you upload, download, bookmark, and rate</ListItem>
                                    <ListItem>Search queries and browsing patterns</ListItem>
                                    <ListItem>Device information, IP address, and browser type</ListItem>
                                    <ListItem>Log files including access times and pages visited</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Content Information</h3>
                                <div className="space-y-2">
                                    <ListItem>Academic notes and study materials you upload</ListItem>
                                    <ListItem>Reviews and ratings you provide</ListItem>
                                    <ListItem>Comments and feedback on platform content</ListItem>
                                    <ListItem>Reports and moderation-related communications</ListItem>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* How We Use Information */}
                    <Section icon={UserIcon} title="How We Use Your Information">
                        <p>We use collected information for the following purposes:</p>
                        
                        <div className="space-y-2">
                            <ListItem><strong>Service Provision:</strong> To provide, maintain, and improve Academic Ark services</ListItem>
                            <ListItem><strong>Personalization:</strong> To personalize content recommendations and user experience</ListItem>
                            <ListItem><strong>Communication:</strong> To send important updates, notifications, and service-related communications</ListItem>
                            <ListItem><strong>Quality Assurance:</strong> To monitor and analyze usage patterns for service improvement</ListItem>
                            <ListItem><strong>Security:</strong> To protect against fraud, abuse, and security threats</ListItem>
                            <ListItem><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms of service</ListItem>
                            <ListItem><strong>Analytics:</strong> To understand user behavior and improve our platform functionality</ListItem>
                        </div>
                    </Section>

                    {/* Information Sharing */}
                    <Section icon={LockIcon} title="Information Sharing and Disclosure">
                        <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Service Providers</h3>
                                <p>We may share information with trusted third-party service providers who assist us in:</p>
                                <div className="space-y-2 mt-2">
                                    <ListItem>Cloud storage and file hosting services</ListItem>
                                    <ListItem>Email communication services</ListItem>
                                    <ListItem>Analytics and performance monitoring</ListItem>
                                    <ListItem>Payment processing (if applicable)</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Legal Requirements</h3>
                                <p>We may disclose your information if required by law or if we believe such action is necessary to:</p>
                                <div className="space-y-2 mt-2">
                                    <ListItem>Comply with legal processes or government requests</ListItem>
                                    <ListItem>Protect the rights, property, or safety of Academic Ark, our users, or others</ListItem>
                                    <ListItem>Investigate potential violations of our terms of service</ListItem>
                                    <ListItem>Respond to emergencies involving danger to life or health</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Public Information</h3>
                                <p>Some information is publicly visible on our platform:</p>
                                <div className="space-y-2 mt-2">
                                    <ListItem>Your profile name and avatar (if you choose to display them)</ListItem>
                                    <ListItem>Notes and study materials you upload</ListItem>
                                    <ListItem>Ratings and reviews you provide</ListItem>
                                    <ListItem>Public comments and contributions</ListItem>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Data Security */}
                    <Section icon={ShieldIcon} title="Data Security">
                        <p>We implement appropriate technical and organizational security measures to protect your personal information:</p>
                        
                        <div className="space-y-2">
                            <ListItem><strong>Encryption:</strong> All data transmission is encrypted using industry-standard SSL/TLS protocols</ListItem>
                            <ListItem><strong>Access Control:</strong> Strict access controls limit who can view or modify your information</ListItem>
                            <ListItem><strong>Secure Storage:</strong> Data is stored on secure servers with regular security updates</ListItem>
                            <ListItem><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments</ListItem>
                            <ListItem><strong>Backup Systems:</strong> Secure backup systems protect against data loss</ListItem>
                            <ListItem><strong>Staff Training:</strong> Our team is trained on data protection and privacy best practices</ListItem>
                        </div>

                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mt-4">
                            <p className="text-yellow-200">
                                <strong>Important:</strong> While we strive to protect your information, no method of transmission 
                                over the Internet is 100% secure. We cannot guarantee absolute security of your data.
                            </p>
                        </div>
                    </Section>

                    {/* User Rights */}
                    <Section icon={CheckIcon} title="Your Rights and Choices">
                        <p>You have several rights regarding your personal information:</p>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Account Management</h3>
                                <div className="space-y-2">
                                    <ListItem><strong>Access:</strong> View and download your personal information</ListItem>
                                    <ListItem><strong>Update:</strong> Correct or update your profile information</ListItem>
                                    <ListItem><strong>Delete:</strong> Request deletion of your account and associated data</ListItem>
                                    <ListItem><strong>Export:</strong> Download your uploaded notes and activity data</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Privacy Controls</h3>
                                <div className="space-y-2">
                                    <ListItem><strong>Profile Visibility:</strong> Control what information is publicly visible</ListItem>
                                    <ListItem><strong>Notifications:</strong> Manage email and in-app notification preferences</ListItem>
                                    <ListItem><strong>Data Processing:</strong> Opt-out of certain data processing activities</ListItem>
                                    <ListItem><strong>Marketing:</strong> Unsubscribe from promotional communications</ListItem>
                                </div>
                            </div>

                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                <p className="text-blue-200">
                                    <strong>How to Exercise Your Rights:</strong> Contact us at privacy@academicark.com 
                                    or use the privacy controls in your account settings.
                                </p>
                            </div>
                        </div>
                    </Section>

                    {/* Cookies */}
                    <Section icon={DatabaseIcon} title="Cookies and Tracking">
                        <p>We use cookies and similar technologies to enhance your experience:</p>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Types of Cookies</h3>
                                <div className="space-y-2">
                                    <ListItem><strong>Essential Cookies:</strong> Required for basic site functionality</ListItem>
                                    <ListItem><strong>Preference Cookies:</strong> Remember your settings and preferences</ListItem>
                                    <ListItem><strong>Analytics Cookies:</strong> Help us understand how you use our platform</ListItem>
                                    <ListItem><strong>Performance Cookies:</strong> Improve site speed and functionality</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Managing Cookies</h3>
                                <p>You can control cookies through:</p>
                                <div className="space-y-2 mt-2">
                                    <ListItem>Your browser settings to block or delete cookies</ListItem>
                                    <ListItem>Our cookie preference center (when available)</ListItem>
                                    <ListItem>Third-party opt-out mechanisms for analytics services</ListItem>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Data Retention */}
                    <Section icon={ClockIcon} title="Data Retention">
                        <p>We retain your information for different periods depending on the type of data:</p>
                        
                        <div className="space-y-2">
                            <ListItem><strong>Account Information:</strong> Retained until you delete your account</ListItem>
                            <ListItem><strong>Uploaded Content:</strong> Retained as long as it's available on the platform</ListItem>
                            <ListItem><strong>Usage Logs:</strong> Typically retained for 12-24 months for security purposes</ListItem>
                            <ListItem><strong>Marketing Data:</strong> Retained until you opt-out or request deletion</ListItem>
                            <ListItem><strong>Legal Holds:</strong> May be retained longer if required by law or litigation</ListItem>
                        </div>

                        <p className="mt-4">
                            When you delete your account, we will delete or anonymize your personal information 
                            within 30 days, except where retention is required by law.
                        </p>
                    </Section>

                    {/* Children's Privacy */}
                    <Section icon={UserIcon} title="Children's Privacy">
                        <p>
                            Academic Ark is not intended for children under 13 years of age. We do not knowingly 
                            collect personal information from children under 13. If we learn that we have collected 
                            personal information from a child under 13, we will delete such information immediately.
                        </p>
                        <p>
                            If you are a parent or guardian and believe your child has provided us with personal 
                            information, please contact us immediately at privacy@academicark.com.
                        </p>
                    </Section>

                    {/* International Users */}
                    <Section icon={DatabaseIcon} title="International Data Transfers">
                        <p>
                            Academic Ark operates globally, and your information may be transferred to and processed 
                            in countries other than your own. We ensure appropriate safeguards are in place for 
                            international data transfers.
                        </p>
                        <div className="space-y-2 mt-4">
                            <ListItem>We comply with applicable data protection laws</ListItem>
                            <ListItem>We use standard contractual clauses for data transfers</ListItem>
                            <ListItem>We ensure adequate protection levels in destination countries</ListItem>
                        </div>
                    </Section>

                    {/* Updates */}
                    <Section icon={ClockIcon} title="Changes to This Privacy Policy">
                        <p>
                            We may update this Privacy Policy from time to time to reflect changes in our practices 
                            or for other operational, legal, or regulatory reasons.
                        </p>
                        <div className="space-y-2 mt-4">
                            <ListItem>We will notify users of significant changes via email or platform notifications</ListItem>
                            <ListItem>Updated policies will be posted on this page with a new "Last Updated" date</ListItem>
                            <ListItem>Continued use of our services constitutes acceptance of the updated policy</ListItem>
                        </div>
                    </Section>

                    {/* Contact Information */}
                    <Section icon={MailIcon} title="Contact Us">
                        <p>
                            If you have questions about this Privacy Policy or our privacy practices, 
                            please contact us using the information below:
                        </p>
                        
                        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-white mb-2">Privacy Team</h4>
                                    <div className="space-y-2 text-gray-300">
                                        <p>📧 privacy@academicark.com</p>
                                        <p>📧 support@academicark.com</p>
                                        <p>🌐 www.academicark.com/contact</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mb-2">Response Time</h4>
                                    <div className="space-y-2 text-gray-300">
                                        <p>• Privacy inquiries: 48 hours</p>
                                        <p>• Data requests: 30 days</p>
                                        <p>• General support: 24 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Footer Actions */}
                    <div className="text-center space-y-4 pt-8">
                        <div className="flex items-center justify-center space-x-4">
                            <Link
                                to="/terms"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                            >
                                Terms of Service
                            </Link>
                            <span className="text-gray-600">•</span>
                            <Link
                                to="/contact"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                            >
                                Contact Us
                            </Link>
                            <span className="text-gray-600">•</span>
                            <Link
                                to="/"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                            >
                                Back to Home
                            </Link>
                        </div>
                        
                        <p className="text-gray-500 text-sm">
                            © 2025 Academic Ark. All rights reserved. | Last updated: {lastUpdated}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
