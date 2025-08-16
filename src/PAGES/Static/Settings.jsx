// // src/PAGES/Settings.jsx
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import HomeLayout from '../../LAYOUTS/Homelayout';
// import { showToast } from '../../HELPERS/Toaster';

// // Icons
// const UserIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//     </svg>
// );

// const ShieldIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//     </svg>
// );

// const BellIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//     </svg>
// );

// const CogIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
// );

// const DatabaseIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
//     </svg>
// );

// const KeyIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
//     </svg>
// );

// const PaletteIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
//     </svg>
// );

// const TrashIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//     </svg>
// );

// const CameraIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
// );

// const LogoutIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//     </svg>
// );

// const DownloadIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
//     </svg>
// );

// const MoonIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
//     </svg>
// );

// const SunIcon = ({ className }) => (
//     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
//     </svg>
// );

// export default function Settings() {
//     const dispatch = useDispatch();
//     const { data: user, role } = useSelector(state => state.auth);
    
//     const [activeTab, setActiveTab] = useState('profile');
//     const [isLoading, setIsLoading] = useState(false);
    
//     // Profile Settings
//     const [profileData, setProfileData] = useState({
//         fullName: user?.fullName || '',
//         email: user?.email || '',
//         bio: user?.bio || '',
//         university: user?.university || '',
//         semester: user?.semester || '',
//         course: user?.course || 'BTECH'
//     });

//     // Privacy Settings
//     const [privacySettings, setPrivacySettings] = useState({
//         profileVisibility: 'public',
//         showEmail: false,
//         showStats: true,
//         allowMessages: true
//     });

//     // Notification Settings
//     const [notifications, setNotifications] = useState({
//         emailNotifications: true,
//         pushNotifications: true,
//         newNotes: true,
//         comments: true,
//         ratings: true,
//         bookmarks: false,
//         systemUpdates: true,
//         marketing: false
//     });

//     // App Preferences
//     const [preferences, setPreferences] = useState({
//         theme: 'dark',
//         language: 'english',
//         defaultView: 'grid',
//         itemsPerPage: 12,
//         downloadQuality: 'high',
//         autoSave: true
//     });

//     // Security Settings
//     const [security, setSecurity] = useState({
//         twoFactorAuth: false,
//         loginAlerts: true,
//         dataEncryption: true
//     });

//     // Tab configuration
//     const tabs = [
//         { id: 'profile', label: 'Profile', icon: UserIcon },
//         { id: 'privacy', label: 'Privacy', icon: ShieldIcon },
//         { id: 'notifications', label: 'Notifications', icon: BellIcon },
//         { id: 'preferences', label: 'Preferences', icon: CogIcon },
//         { id: 'security', label: 'Security', icon: KeyIcon },
//         { id: 'data', label: 'Data', icon: DatabaseIcon }
//     ];

//     const handleProfileUpdate = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 1000));
//             showToast.success('Profile updated successfully!');
//         } catch (error) {
//             showToast.error('Failed to update profile');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleAvatarUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Handle avatar upload
//             showToast.success('Avatar uploaded successfully!');
//         }
//     };

//     const handlePasswordChange = () => {
//         // Handle password change
//         showToast.info('Password change email sent!');
//     };

//     const handleDeleteAccount = () => {
//         if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
//             // Handle account deletion
//             showToast.error('Account deletion initiated. Check your email for confirmation.');
//         }
//     };

//     const handleExportData = () => {
//         // Handle data export
//         showToast.success('Data export started. You will receive an email when ready.');
//     };

//     const ToggleSwitch = ({ enabled, onChange, label, description }) => (
//         <div className="flex items-center justify-between py-3">
//             <div>
//                 <div className="text-white font-medium">{label}</div>
//                 {description && <div className="text-gray-400 text-sm">{description}</div>}
//             </div>
//             <button
//                 onClick={onChange}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
//                     enabled ? 'bg-blue-600' : 'bg-gray-600'
//                 }`}
//             >
//                 <span
//                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                         enabled ? 'translate-x-6' : 'translate-x-1'
//                     }`}
//                 />
//             </button>
//         </div>
//     );

//     const SettingCard = ({ title, children, icon: Icon }) => (
//         <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
//             <div className="flex items-center space-x-3 mb-6">
//                 {Icon && (
//                     <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
//                         <Icon className="w-6 h-6 text-blue-400" />
//                     </div>
//                 )}
//                 <h3 className="text-xl font-bold text-white">{title}</h3>
//             </div>
//             {children}
//         </div>
//     );

//     return (
//         <HomeLayout>
//             <div className="min-h-screen bg-black text-white">
//                 {/* Header */}
//                 <div className="bg-gradient-to-br from-blue-900 via-black to-purple-900 py-12">
//                     <div className="max-w-6xl mx-auto px-4">
//                         <div className="flex items-center space-x-4">
//                             <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full">
//                                 <CogIcon className="w-8 h-8 text-blue-400" />
//                             </div>
//                             <div>
//                                 <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
//                                     Settings
//                                 </h1>
//                                 <p className="text-blue-200 text-lg">Manage your account and preferences</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Tabs */}
//                 <div className="bg-gray-900/50 border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
//                     <div className="max-w-6xl mx-auto px-4">
//                         <div className="flex space-x-8 overflow-x-auto">
//                             {tabs.map(tab => (
//                                 <button
//                                     key={tab.id}
//                                     onClick={() => setActiveTab(tab.id)}
//                                     className={`py-4 px-2 border-b-2 transition-colors flex items-center space-x-2 whitespace-nowrap ${
//                                         activeTab === tab.id 
//                                             ? 'border-blue-500 text-blue-400' 
//                                             : 'border-transparent text-gray-400 hover:text-white'
//                                     }`}
//                                 >
//                                     <tab.icon className="w-5 h-5" />
//                                     <span>{tab.label}</span>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="max-w-6xl mx-auto px-4 py-8">
//                     {/* Profile Tab */}
//                     {activeTab === 'profile' && (
//                         <div className="space-y-6">
//                             <SettingCard title="Profile Information" icon={UserIcon}>
//                                 <form onSubmit={handleProfileUpdate} className="space-y-6">
//                                     {/* Avatar Section */}
//                                     <div className="flex items-center space-x-6">
//                                         <div className="relative">
//                                             {user?.avatar?.secure_url ? (
//                                                 <img 
//                                                     src={user.avatar.secure_url} 
//                                                     alt={user.fullName}
//                                                     className="w-24 h-24 rounded-full border-4 border-white/20"
//                                                 />
//                                             ) : (
//                                                 <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
//                                                     {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
//                                                 </div>
//                                             )}
//                                             <label className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
//                                                 <CameraIcon className="w-4 h-4 text-white" />
//                                                 <input 
//                                                     type="file" 
//                                                     className="hidden" 
//                                                     accept="image/*"
//                                                     onChange={handleAvatarUpload}
//                                                 />
//                                             </label>
//                                         </div>
//                                         <div>
//                                             <h4 className="text-lg font-semibold text-white">{user?.fullName}</h4>
//                                             <p className="text-gray-400">{role}</p>
//                                             <p className="text-blue-400 text-sm">Click camera to change photo</p>
//                                         </div>
//                                     </div>

//                                     {/* Form Fields */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
//                                             <input
//                                                 type="text"
//                                                 value={profileData.fullName}
//                                                 onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
//                                                 className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
//                                             <input
//                                                 type="email"
//                                                 value={profileData.email}
//                                                 onChange={(e) => setProfileData({...profileData, email: e.target.value})}
//                                                 className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-300 mb-2">University</label>
//                                             <input
//                                                 type="text"
//                                                 value={profileData.university}
//                                                 onChange={(e) => setProfileData({...profileData, university: e.target.value})}
//                                                 className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-300 mb-2">Semester</label>
//                                             <select
//                                                 value={profileData.semester}
//                                                 onChange={(e) => setProfileData({...profileData, semester: e.target.value})}
//                                                 className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             >
//                                                 <option value="">Select Semester</option>
//                                                 {[1,2,3,4,5,6,7,8].map(sem => (
//                                                     <option key={sem} value={sem}>Semester {sem}</option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
//                                         <textarea
//                                             value={profileData.bio}
//                                             onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
//                                             rows={4}
//                                             className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                                             placeholder="Tell us about yourself..."
//                                         />
//                                     </div>

//                                     <div className="flex items-center space-x-4">
//                                         <button
//                                             type="submit"
//                                             disabled={isLoading}
//                                             className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium disabled:opacity-50"
//                                         >
//                                             {isLoading ? 'Updating...' : 'Update Profile'}
//                                         </button>
//                                         <button
//                                             type="button"
//                                             onClick={handlePasswordChange}
//                                             className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors font-medium"
//                                         >
//                                             Change Password
//                                         </button>
//                                     </div>
//                                 </form>
//                             </SettingCard>
//                         </div>
//                     )}

//                     {/* Privacy Tab */}
//                     {activeTab === 'privacy' && (
//                         <div className="space-y-6">
//                             <SettingCard title="Privacy Settings" icon={ShieldIcon}>
//                                 <div className="space-y-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-300 mb-3">Profile Visibility</label>
//                                         <div className="space-y-2">
//                                             {[
//                                                 { value: 'public', label: 'Public', desc: 'Anyone can see your profile' },
//                                                 { value: 'students', label: 'Students Only', desc: 'Only registered students can see your profile' },
//                                                 { value: 'private', label: 'Private', desc: 'Only you can see your profile' }
//                                             ].map(option => (
//                                                 <label key={option.value} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
//                                                     <input
//                                                         type="radio"
//                                                         name="profileVisibility"
//                                                         value={option.value}
//                                                         checked={privacySettings.profileVisibility === option.value}
//                                                         onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
//                                                         className="mt-1"
//                                                     />
//                                                     <div>
//                                                         <div className="text-white font-medium">{option.label}</div>
//                                                         <div className="text-gray-400 text-sm">{option.desc}</div>
//                                                     </div>
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div className="border-t border-white/10 pt-6">
//                                         <ToggleSwitch
//                                             enabled={privacySettings.showEmail}
//                                             onChange={() => setPrivacySettings({...privacySettings, showEmail: !privacySettings.showEmail})}
//                                             label="Show Email Address"
//                                             description="Display your email on your public profile"
//                                         />
//                                         <ToggleSwitch
//                                             enabled={privacySettings.showStats}
//                                             onChange={() => setPrivacySettings({...privacySettings, showStats: !privacySettings.showStats})}
//                                             label="Show Statistics"
//                                             description="Display your notes count, downloads, and ratings"
//                                         />
//                                         <ToggleSwitch
//                                             enabled={privacySettings.allowMessages}
//                                             onChange={() => setPrivacySettings({...privacySettings, allowMessages: !privacySettings.allowMessages})}
//                                             label="Allow Messages"
//                                             description="Let other users send you direct messages"
//                                         />
//                                     </div>
//                                 </div>
//                             </SettingCard>
//                         </div>
//                     )}

//                     {/* Notifications Tab */}
//                     {activeTab === 'notifications' && (
//                         <div className="space-y-6">
//                             <SettingCard title="Notification Preferences" icon={BellIcon}>
//                                 <div className="space-y-6">
//                                     <div>
//                                         <h4 className="text-lg font-semibold text-white mb-4">General Notifications</h4>
//                                         <div className="space-y-1">
//                                             <ToggleSwitch
//                                                 enabled={notifications.emailNotifications}
//                                                 onChange={() => setNotifications({...notifications, emailNotifications: !notifications.emailNotifications})}
//                                                 label="Email Notifications"
//                                                 description="Receive notifications via email"
//                                             />
//                                             <ToggleSwitch
//                                                 enabled={notifications.pushNotifications}
//                                                 onChange={() => setNotifications({...notifications, pushNotifications: !notifications.pushNotifications})}
//                                                 label="Push Notifications"
//                                                 description="Receive browser push notifications"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="border-t border-white/10 pt-6">
//                                         <h4 className="text-lg font-semibold text-white mb-4">Activity Notifications</h4>
//                                         <div className="space-y-1">
//                                             <ToggleSwitch
//                                                 enabled={notifications.newNotes}
//                                                 onChange={() => setNotifications({...notifications, newNotes: !notifications.newNotes})}
//                                                 label="New Notes"
//                                                 description="When new notes are uploaded in your subjects"
//                                             />
//                                             <ToggleSwitch
//                                                 enabled={notifications.comments}
//                                                 onChange={() => setNotifications({...notifications, comments: !notifications.comments})}
//                                                 label="Comments & Reviews"
//                                                 description="When someone comments on or reviews your notes"
//                                             />
//                                             <ToggleSwitch
//                                                 enabled={notifications.ratings}
//                                                 onChange={() => setNotifications({...notifications, ratings: !notifications.ratings})}
//                                                 label="Ratings"
//                                                 description="When your notes receive ratings"
//                                             />
//                                             <ToggleSwitch
//                                                 enabled={notifications.bookmarks}
//                                                 onChange={() => setNotifications({...notifications, bookmarks: !notifications.bookmarks})}
//                                                 label="Bookmarks"
//                                                 description="When someone bookmarks your notes"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="border-t border-white/10 pt-6">
//                                         <h4 className="text-lg font-semibold text-white mb-4">System Notifications</h4>
//                                         <div className="space-y-1">
//                                             <ToggleSwitch
//                                                 enabled={notifications.systemUpdates}
//                                                 onChange={() => setNotifications({...notifications, systemUpdates: !notifications.systemUpdates})}
//                                                 label="System Updates"
//                                                 description="Important system updates and maintenance notifications"
//                                             />
//                                             <ToggleSwitch
//                                                 enabled={notifications.marketing}
//                                                 onChange={() => setNotifications({...notifications, marketing: !notifications.marketing})}
//                                                 label="Marketing Communications"
//                                                 description="Tips, newsletters, and feature announcements"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </SettingCard>
//                         </div>
//                     )}

//                     {/* Preferences Tab */}
//                     {activeTab === 'preferences' && (
//                         <div className="space-y-6">
//                             <SettingCard title="App Preferences" icon={PaletteIcon}>
//                                 <div className="space-y-6">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
//                                             <select
//                                                 value={preferences.theme}
//                                                 onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
//                                                 className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             >
//                                                 <option value="dark">Dark Theme</option>
//                                                 <option value="light">Light Theme</option>
//                                                 <option value="auto">Auto (System)</option>
//                                             </select>
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-300 mb-3">Language</label>
//                                             <select
//                                                 value={preferences.language}
//                                                 onChange={(e) => setPreferences({...preferences, language: e.target.value})}
//                                                 className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             >
//                                                 <option value="english">English</option>
//                                                 <option value="hindi">हिन्दी (Hindi)</option>
//                                                 <option value="spanish">Español</option>
//                                             </select>
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-300 mb-3">Default View</label>
//                                             <select
//                                                 value={preferences.defaultView}
//                                                 onChange={(e) => setPreferences({...preferences, defaultView: e.target.value})}
//                                                 className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             >
//                                                 <option value="grid">Grid View</option>
//                                                 <option value="list">List View</option>
//                                             </select>
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-300 mb-3">Items Per Page</label>
//                                             <select
//                                                 value={preferences.itemsPerPage}
//                                                 onChange={(e) => setPreferences({...preferences, itemsPerPage: parseInt(e.target.value)})}
//                                                 className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             >
//                                                 <option value="6">6 items</option>
//                                                 <option value="12">12 items</option>
//                                                 <option value="24">24 items</option>
//                                                 <option value="48">48 items</option>
//                                             </select>
//                                         </div>
//                                     </div>

//                                     <div className="border-t border-white/10 pt-6">
//                                         <ToggleSwitch
//                                             enabled={preferences.autoSave}
//                                             onChange={() => setPreferences({...preferences, autoSave: !preferences.autoSave})}
//                                             label="Auto Save"
//                                             description="Automatically save your work and preferences"
//                                         />
//                                     </div>
//                                 </div>
//                             </SettingCard>
//                         </div>
//                     )}

//                     {/* Security Tab */}
//                     {activeTab === 'security' && (
//                         <div className="space-y-6">
//                             <SettingCard title="Security Settings" icon={KeyIcon}>
//                                 <div className="space-y-6">
//                                     <ToggleSwitch
//                                         enabled={security.twoFactorAuth}
//                                         onChange={() => setSecurity({...security, twoFactorAuth: !security.twoFactorAuth})}
//                                         label="Two-Factor Authentication"
//                                         description="Add an extra layer of security to your account"
//                                     />
//                                     <ToggleSwitch
//                                         enabled={security.loginAlerts}
//                                         onChange={() => setSecurity({...security, loginAlerts: !security.loginAlerts})}
//                                         label="Login Alerts"
//                                         description="Get notified when someone logs into your account"
//                                     />
//                                     <ToggleSwitch
//                                         enabled={security.dataEncryption}
//                                         onChange={() => setSecurity({...security, dataEncryption: !security.dataEncryption})}
//                                         label="Data Encryption"
//                                         description="Encrypt your personal data for additional security"
//                                     />

//                                     <div className="border-t border-white/10 pt-6">
//                                         <h4 className="text-lg font-semibold text-white mb-4">Account Actions</h4>
//                                         <div className="space-y-4">
//                                             <button
//                                                 onClick={handlePasswordChange}
//                                                 className="flex items-center space-x-3 w-full p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
//                                             >
//                                                 <KeyIcon className="w-5 h-5 text-blue-400" />
//                                                 <div className="text-left">
//                                                     <div className="text-white font-medium">Change Password</div>
//                                                     <div className="text-gray-400 text-sm">Update your account password</div>
//                                                 </div>
//                                             </button>

//                                             <button
//                                                 onClick={handleDeleteAccount}
//                                                 className="flex items-center space-x-3 w-full p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
//                                             >
//                                                 <TrashIcon className="w-5 h-5 text-red-400" />
//                                                 <div className="text-left">
//                                                     <div className="text-white font-medium">Delete Account</div>
//                                                     <div className="text-gray-400 text-sm">Permanently delete your account and all data</div>
//                                                 </div>
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </SettingCard>
//                         </div>
//                     )}

//                     {/* Data Tab */}
//                     {activeTab === 'data' && (
//                         <div className="space-y-6">
//                             <SettingCard title="Data Management" icon={DatabaseIcon}>
//                                 <div className="space-y-6">
//                                     <div>
//                                         <h4 className="text-lg font-semibold text-white mb-4">Data Export</h4>
//                                         <p className="text-gray-400 mb-6">
//                                             Download a copy of your data including your profile information, uploaded notes, bookmarks, and activity history.
//                                         </p>
//                                         <button
//                                             onClick={handleExportData}
//                                             className="flex items-center space-x-3 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-lg hover:bg-green-500/20 transition-colors"
//                                         >
//                                             <DownloadIcon className="w-5 h-5" />
//                                             <span>Export My Data</span>
//                                         </button>
//                                     </div>

//                                     <div className="border-t border-white/10 pt-6">
//                                         <h4 className="text-lg font-semibold text-white mb-4">Storage Usage</h4>
//                                         <div className="space-y-4">
//                                             <div className="flex items-center justify-between">
//                                                 <span className="text-gray-300">Uploaded Notes</span>
//                                                 <span className="text-white">145 MB</span>
//                                             </div>
//                                             <div className="w-full bg-gray-700 rounded-full h-2">
//                                                 <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
//                                             </div>
//                                             <div className="flex items-center justify-between text-sm text-gray-400">
//                                                 <span>Used: 145 MB</span>
//                                                 <span>Available: 855 MB</span>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="border-t border-white/10 pt-6">
//                                         <h4 className="text-lg font-semibold text-white mb-4">Data Retention</h4>
//                                         <div className="space-y-4 text-gray-300">
//                                             <div className="flex items-start space-x-3">
//                                                 <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
//                                                 <div>
//                                                     <div className="font-medium">Profile Data</div>
//                                                     <div className="text-sm text-gray-400">Retained until account deletion</div>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-start space-x-3">
//                                                 <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
//                                                 <div>
//                                                     <div className="font-medium">Upload History</div>
//                                                     <div className="text-sm text-gray-400">Retained for legal compliance (7 years)</div>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-start space-x-3">
//                                                 <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
//                                                 <div>
//                                                     <div className="font-medium">Activity Logs</div>
//                                                     <div className="text-sm text-gray-400">Retained for 2 years</div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </SettingCard>
//                         </div>
//                     )}

//                     {/* Save Changes Button */}
//                     <div className="flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
//                         <div>
//                             <h3 className="text-lg font-semibold text-white">Save Changes</h3>
//                             <p className="text-gray-400 text-sm">Your settings are automatically saved as you make changes</p>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                             <Link
//                                 to="/"
//                                 className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors font-medium"
//                             >
//                                 Cancel
//                             </Link>
//                             <button
//                                 className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
//                             >
//                                 Save All Changes
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </HomeLayout>
//     );
// }
