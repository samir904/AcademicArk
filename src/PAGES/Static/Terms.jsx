// src/PAGES/Terms.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Icons
const DocumentIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const UserIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ShieldIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const BookIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const LockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const GavelIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
);

const ExclamationIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
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

const XIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const MailIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

export default function Terms() {
    const [expandedSection, setExpandedSection] = useState(null);
    const lastUpdated = "August 15, 2025";
    const effectiveDate = "August 15, 2025";

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const Section = ({ icon: Icon, title, children, id }) => (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection(id)}>
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>
                <div className="text-white">
                    {expandedSection === id ? '−' : '+'}
                </div>
            </div>
            {(expandedSection === id || expandedSection === null) && (
                <div className="mt-6 space-y-4 text-gray-300 leading-relaxed">
                    {children}
                </div>
            )}
        </div>
    );

    const ListItem = ({ children, type = 'check' }) => (
        <div className="flex items-start space-x-3">
            {type === 'check' ? (
                <CheckIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            ) : (
                <XIcon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            )}
            <span>{children}</span>
        </div>
    );

    const ImportantBox = ({ title, children, type = 'info' }) => {
        const colors = {
            info: 'bg-blue-900/20 border-blue-500/30 text-blue-200',
            warning: 'bg-yellow-900/20 border-yellow-500/30 text-yellow-200',
            danger: 'bg-red-900/20 border-red-500/30 text-red-200'
        };

        return (
            <div className={`${colors[type]} border rounded-lg p-4`}>
                <h4 className="font-semibold mb-2">{title}</h4>
                <div className="text-sm">{children}</div>
            </div>
        );
    };

    return (
        <>
            <div className="min-h-screen bg-black text-white">
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-900 via-black to-purple-900 py-16">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6">
                                <DocumentIcon className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                                Terms of Service
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                Please read these terms carefully before using Academic Ark. By using our platform, you agree to these terms and conditions.
                            </p>
                            <div className="mt-6 flex items-center justify-center space-x-6">
                                <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2">
                                    <ClockIcon className="w-4 h-4 text-blue-400" />
                                    <span className="text-blue-300 text-sm">Last updated: {lastUpdated}</span>
                                </div>
                                <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2">
                                    <CheckIcon className="w-4 h-4 text-green-400" />
                                    <span className="text-green-300 text-sm">Effective: {effectiveDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
                    {/* Quick Navigation */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Navigation</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            {['Acceptance', 'Accounts', 'Content', 'Usage Rules', 'Privacy', 'Prohibited', 'Moderation', 'Termination', 'Disclaimers', 'Governing Law'].map((item, index) => (
                                <button
                                    key={item}
                                    onClick={() => toggleSection(index + 1)}
                                    className="text-blue-400 hover:text-blue-300 transition-colors text-left p-2 rounded hover:bg-white/5"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 1. Acceptance of Terms */}
                    <Section icon={DocumentIcon} title="1. Acceptance of Terms" id={1}>
                        <p>
                            Welcome to Academic Ark, an online platform for sharing and accessing academic notes and study materials. 
                            These Terms of Service ("Terms") govern your use of our website, mobile applications, and related services 
                            (collectively, the "Service") operated by Academic Ark ("we," "us," or "our").
                        </p>
                        <p>
                            By accessing or using Academic Ark, you agree to be bound by these Terms. If you disagree with any part 
                            of these terms, then you may not access the Service.
                        </p>
                        
                        <ImportantBox title="Important Notice" type="warning">
                            <p>
                                These Terms constitute a legally binding agreement between you and Academic Ark. 
                                Please read them carefully and keep a copy for your records.
                            </p>
                        </ImportantBox>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white">By using Academic Ark, you confirm that:</h3>
                            <ListItem>You are at least 13 years old or have parental consent</ListItem>
                            <ListItem>You have the legal capacity to enter into this agreement</ListItem>
                            <ListItem>You will comply with all applicable laws and regulations</ListItem>
                            <ListItem>You understand that your use is subject to our Privacy Policy</ListItem>
                        </div>
                    </Section>

                    {/* 2. User Accounts and Registration */}
                    <Section icon={UserIcon} title="2. User Accounts and Registration" id={2}>
                        <p>
                            To access certain features of Academic Ark, you must register for an account. You are responsible 
                            for maintaining the confidentiality of your account credentials and for all activities that occur 
                            under your account.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Account Requirements</h3>
                                <div className="space-y-2">
                                    <ListItem>Provide accurate and complete information during registration</ListItem>
                                    <ListItem>Keep your account information updated</ListItem>
                                    <ListItem>Use a secure password and keep it confidential</ListItem>
                                    <ListItem>Notify us immediately of any unauthorized access</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Account Types</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-300 mb-2">Student</h4>
                                        <p className="text-blue-200 text-sm">Access and download study materials</p>
                                    </div>
                                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                        <h4 className="font-semibold text-green-300 mb-2">Teacher</h4>
                                        <p className="text-green-200 text-sm">Upload and share educational content</p>
                                    </div>
                                    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                                        <h4 className="font-semibold text-purple-300 mb-2">Admin</h4>
                                        <p className="text-purple-200 text-sm">Moderate content and manage platform</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ImportantBox title="Account Security" type="info">
                            <p>
                                You are solely responsible for maintaining the security of your account. 
                                Academic Ark cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                            </p>
                        </ImportantBox>
                    </Section>

                    {/* 3. User Content and Uploads */}
                    <Section icon={BookIcon} title="3. User Content and Uploads" id={3}>
                        <p>
                            Academic Ark allows users to upload, share, and access educational content including notes, 
                            study materials, and academic resources ("User Content"). You retain ownership of your User Content, 
                            but grant us certain rights as outlined below.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Content Guidelines</h3>
                                <div className="space-y-2">
                                    <ListItem>Content must be educational or academic in nature</ListItem>
                                    <ListItem>Original work or properly attributed sources</ListItem>
                                    <ListItem>Free from copyrighted material without permission</ListItem>
                                    <ListItem>No offensive, harmful, or illegal content</ListItem>
                                    <ListItem>Accurate subject, semester, and university tags</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">License Grant</h3>
                                <p>
                                    By uploading User Content to Academic Ark, you grant us a worldwide, non-exclusive, 
                                    royalty-free license to use, display, reproduce, modify, and distribute your content 
                                    for the purposes of operating and improving our Service.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Content Removal</h3>
                                <p>
                                    We reserve the right to remove any User Content that violates these Terms or our 
                                    community guidelines. You may delete your own content at any time through your account settings.
                                </p>
                            </div>
                        </div>

                        <ImportantBox title="Copyright Notice" type="warning">
                            <p>
                                Do not upload copyrighted material without proper authorization. Repeat copyright violations 
                                may result in account termination. See our DMCA policy for more information.
                            </p>
                        </ImportantBox>
                    </Section>

                    {/* 4. Acceptable Use Policy */}
                    <Section icon={ShieldIcon} title="4. Acceptable Use Policy" id={4}>
                        <p>
                            Your use of Academic Ark must comply with all applicable laws and regulations. 
                            The following activities are prohibited on our platform:
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Prohibited Activities</h3>
                                <div className="space-y-2">
                                    <ListItem type="x">Uploading malicious software, viruses, or harmful code</ListItem>
                                    <ListItem type="x">Attempting to hack, disrupt, or compromise platform security</ListItem>
                                    <ListItem type="x">Creating multiple accounts to circumvent restrictions</ListItem>
                                    <ListItem type="x">Selling or commercializing access to the platform</ListItem>
                                    <ListItem type="x">Spamming or sending unsolicited communications</ListItem>
                                    <ListItem type="x">Impersonating others or providing false information</ListItem>
                                    <ListItem type="x">Harassing, threatening, or abusing other users</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Permitted Uses</h3>
                                <div className="space-y-2">
                                    <ListItem>Accessing educational content for personal study</ListItem>
                                    <ListItem>Sharing original academic work and notes</ListItem>
                                    <ListItem>Collaborating with other students and educators</ListItem>
                                    <ListItem>Providing constructive feedback and ratings</ListItem>
                                    <ListItem>Reporting inappropriate content or behavior</ListItem>
                                </div>
                            </div>
                        </div>

                        <ImportantBox title="Enforcement" type="danger">
                            <p>
                                Violation of this Acceptable Use Policy may result in immediate suspension or termination 
                                of your account, along with potential legal action if applicable.
                            </p>
                        </ImportantBox>
                    </Section>

                    {/* 5. Privacy and Data Protection */}
                    <Section icon={LockIcon} title="5. Privacy and Data Protection" id={5}>
                        <p>
                            Your privacy is important to us. Our collection, use, and protection of your personal information 
                            is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Data We Collect</h3>
                                <div className="space-y-2">
                                    <ListItem>Account information (name, email, university)</ListItem>
                                    <ListItem>Educational content you upload or interact with</ListItem>
                                    <ListItem>Usage data and platform interactions</ListItem>
                                    <ListItem>Device and technical information</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Your Rights</h3>
                                <div className="space-y-2">
                                    <ListItem>Access and download your personal data</ListItem>
                                    <ListItem>Correct inaccurate information</ListItem>
                                    <ListItem>Request deletion of your account and data</ListItem>
                                    <ListItem>Opt-out of certain data processing activities</ListItem>
                                </div>
                            </div>
                        </div>

                        <ImportantBox title="Privacy Policy" type="info">
                            <p>
                                For detailed information about our data practices, please review our 
                                <Link to="/privacy" className="text-blue-400 hover:text-blue-300 underline ml-1">Privacy Policy</Link>.
                            </p>
                        </ImportantBox>
                    </Section>

                    {/* 6. Content Moderation */}
                    <Section icon={ExclamationIcon} title="6. Content Moderation" id={6}>
                        <p>
                            Academic Ark employs both automated and human moderation to ensure content quality and compliance 
                            with our guidelines. We reserve the right to review, modify, or remove any content at our discretion.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Moderation Process</h3>
                                <div className="space-y-2">
                                    <ListItem>Automated screening for prohibited content</ListItem>
                                    <ListItem>Community reporting and flagging system</ListItem>
                                    <ListItem>Human review of flagged content</ListItem>
                                    <ListItem>Appeals process for removed content</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Reporting Guidelines</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                                        <h4 className="font-semibold text-red-300 mb-2">Report If:</h4>
                                        <div className="space-y-1 text-sm">
                                            <p className="text-red-200">• Copyright infringement</p>
                                            <p className="text-red-200">• Inappropriate content</p>
                                            <p className="text-red-200">• Spam or fake content</p>
                                            <p className="text-red-200">• Harassment or abuse</p>
                                        </div>
                                    </div>
                                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                        <h4 className="font-semibold text-green-300 mb-2">Don't Report:</h4>
                                        <div className="space-y-1 text-sm">
                                            <p className="text-green-200">• Personal disagreements</p>
                                            <p className="text-green-200">• Different study methods</p>
                                            <p className="text-green-200">• Language preferences</p>
                                            <p className="text-green-200">• Technical difficulties</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* 7. Account Termination */}
                    <Section icon={XIcon} title="7. Account Termination" id={7}>
                        <p>
                            Either you or Academic Ark may terminate your account at any time. Upon termination, 
                            your right to use the Service will cease immediately.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Termination by You</h3>
                                <div className="space-y-2">
                                    <ListItem>Delete your account through account settings</ListItem>
                                    <ListItem>Contact support for account deletion assistance</ListItem>
                                    <ListItem>Download your data before termination</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Termination by Us</h3>
                                <p>We may suspend or terminate your account for:</p>
                                <div className="space-y-2 mt-2">
                                    <ListItem type="x">Violation of these Terms</ListItem>
                                    <ListItem type="x">Repeated policy violations</ListItem>
                                    <ListItem type="x">Fraudulent or illegal activity</ListItem>
                                    <ListItem type="x">Extended periods of inactivity</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Effect of Termination</h3>
                                <div className="space-y-2">
                                    <ListItem type="x">Loss of access to your account and content</ListItem>
                                    <ListItem type="x">Deletion of personal data (subject to legal requirements)</ListItem>
                                    <ListItem type="x">Forfeiture of any unused credits or benefits</ListItem>
                                </div>
                            </div>
                        </div>

                        <ImportantBox title="Data Retention" type="warning">
                            <p>
                                After account termination, we may retain certain data for legal, regulatory, or legitimate business purposes. 
                                See our Privacy Policy for details on data retention periods.
                            </p>
                        </ImportantBox>
                    </Section>

                    {/* 8. Disclaimers and Limitations */}
                    <Section icon={ExclamationIcon} title="8. Disclaimers and Limitations" id={8}>
                        <p>
                            Academic Ark is provided "as is" without any warranties, express or implied. 
                            We do not guarantee the accuracy, completeness, or reliability of any content on the platform.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Service Disclaimers</h3>
                                <div className="space-y-2">
                                    <ListItem type="x">No guarantee of service availability or uptime</ListItem>
                                    <ListItem type="x">No warranty of content accuracy or quality</ListItem>
                                    <ListItem type="x">No responsibility for user-generated content</ListItem>
                                    <ListItem type="x">No guarantee of academic success or outcomes</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Limitation of Liability</h3>
                                <p>
                                    To the fullest extent permitted by law, Academic Ark shall not be liable for any indirect, 
                                    incidental, special, consequential, or punitive damages, including but not limited to loss of 
                                    profits, data, or other intangible losses.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Indemnification</h3>
                                <p>
                                    You agree to indemnify and hold harmless Academic Ark from any claims, damages, or expenses 
                                    arising from your use of the Service or violation of these Terms.
                                </p>
                            </div>
                        </div>

                        <ImportantBox title="Legal Notice" type="danger">
                            <p>
                                Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability. 
                                In such cases, our liability will be limited to the fullest extent permitted by applicable law.
                            </p>
                        </ImportantBox>
                    </Section>

                    {/* 9. Governing Law and Disputes */}
                    <Section icon={GavelIcon} title="9. Governing Law and Disputes" id={9}>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], 
                            without regard to its conflict of law provisions.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Dispute Resolution</h3>
                                <div className="space-y-2">
                                    <ListItem><strong>Direct Communication:</strong> Contact our support team first</ListItem>
                                    <ListItem><strong>Mediation:</strong> Attempt mediation before legal proceedings</ListItem>
                                    <ListItem><strong>Arbitration:</strong> Binding arbitration for unresolved disputes</ListItem>
                                    <ListItem><strong>Court Jurisdiction:</strong> [Specific court jurisdiction]</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Class Action Waiver</h3>
                                <p>
                                    You agree that any dispute resolution proceedings will be conducted only on an individual basis 
                                    and not in a class, consolidated, or representative action.
                                </p>
                            </div>
                        </div>
                    </Section>

                    {/* 10. Changes to Terms */}
                    <Section icon={ClockIcon} title="10. Changes to Terms" id={10}>
                        <p>
                            We reserve the right to modify these Terms at any time. We will notify users of significant 
                            changes through email, platform notifications, or by posting a notice on our website.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Notification Process</h3>
                                <div className="space-y-2">
                                    <ListItem>Email notification to registered users</ListItem>
                                    <ListItem>In-app notification upon next login</ListItem>
                                    <ListItem>30-day notice period for major changes</ListItem>
                                    <ListItem>Updated terms posted with new effective date</ListItem>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Your Options</h3>
                                <p>If you disagree with any changes:</p>
                                <div className="space-y-2 mt-2">
                                    <ListItem>Discontinue use of the Service</ListItem>
                                    <ListItem>Delete your account before changes take effect</ListItem>
                                    <ListItem>Contact us with concerns or questions</ListItem>
                                </div>
                            </div>
                        </div>

                        <ImportantBox title="Continued Use" type="info">
                            <p>
                                Your continued use of Academic Ark after any changes to these Terms constitutes your acceptance 
                                of the new terms. If you do not agree to the modified terms, you must stop using our Service.
                            </p>
                        </ImportantBox>
                    </Section>

                    {/* Contact Information */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                                <MailIcon className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                        </div>
                        
                        <p className="text-gray-300 mb-4">
                            If you have questions about these Terms of Service, please contact us:
                        </p>
                        
                        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-white mb-3">Legal Team</h4>
                                    <div className="space-y-2 text-gray-300">
                                        <p>📧 legal@academicark.com</p>
                                        <p>📧 terms@academicark.com</p>
                                        <p>🌐 www.academicark.com/contact</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mb-3">Response Time</h4>
                                    <div className="space-y-2 text-gray-300">
                                        <p>• Legal inquiries: 5 business days</p>
                                        <p>• Terms questions: 2 business days</p>
                                        <p>• General support: 24 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="text-center space-y-4 pt-8">
                        <div className="flex items-center justify-center space-x-4">
                            <Link
                                to="/privacy"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                            >
                                Privacy Policy
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
                                to="/help"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                            >
                                Help Center
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
