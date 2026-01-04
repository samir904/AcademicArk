import React, { useState } from 'react';
import { X, Eye, Users, Search } from 'lucide-react';

const ViewersModal = ({ isOpen, viewers = [], totalViews = 0, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    if (!isOpen) return null;

    const filteredViewers = viewers.filter(viewer => {
        const matchesSearch = viewer.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || viewer.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] z-50">
                <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/10 rounded-2xl overflow-hidden flex flex-col">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/10 p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                                <Eye className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Note Viewers</h2>
                                <p className="text-cyan-300 text-sm">{filteredViewers.length} of {viewers.length} viewers</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    {/* Search & Filter */}
                    <div className="bg-gray-800/50 border-b border-white/10 p-6 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:border-cyan-500/50"
                            />
                        </div>
                        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                            <span className="text-sm text-gray-400">Filter:</span>
                            {['all', 'STUDENT', 'TEACHER', 'ADMIN'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setFilterRole(role)}
                                    className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${filterRole === role
                                            ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50'
                                            : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
                                        }`}
                                >
                                    {role === 'all' ? 'All' : role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Viewers List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-700/50">
                        {filteredViewers.map((viewer, index) => (
                            <div key={viewer._id || index} className="p-4 hover:bg-white/5 border-l-4 border-l-transparent hover:border-l-cyan-400">
                                <div className="flex items-center space-x-4">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        {viewer.avatar?.secure_url?.startsWith('http') ? (
                                            <img src={viewer.avatar.secure_url} alt={viewer.fullName} className="w-12 h-12 rounded-full border-2 border-cyan-400/50 object-cover" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center border-2 border-cyan-400/50">
                                                <span className="text-white font-bold">{viewer.fullName?.charAt(0)?.toUpperCase() || 'U'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold capitalize truncate">{viewer.fullName || 'Anonymous'}</h3>
                                        {/* <p className="text-sm text-gray-400 truncate">{viewer.email || 'No email'}</p> */}
                                    </div>

                                    {/* ✅ Role Badge */}
                                    <div className="flex justify-center mt-2 mb-2 flex-shrink-0">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium border whitespace-nowrap ${viewer.role === 'TEACHER'
                                                ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                                                : viewer.role === 'ADMIN'
                                                    ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                                                    : viewer.role === 'USER'
                                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                            }`}>
                                            {viewer.role === 'USER' ? 'STUDENT' : viewer.role}
                                        </span>
                                    </div>

                                    {/* Academic */}
                                    <div className="flex-shrink-0 text-right hidden sm:block">
                                        {viewer.academicProfile?.semester ? (
                                            <div>
                                                <p className="text-sm font-medium text-gray-300">Sem {viewer.academicProfile.semester}</p>
                                                {viewer.academicProfile?.branch && <p className="text-xs text-gray-500">{viewer.academicProfile.branch}</p>}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500">No profile</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-800/50 border-t border-white/10 p-4 flex items-center justify-between">
                        <div className="text-sm text-gray-400">Total Views: <span className="font-bold text-cyan-400">{totalViews}</span></div>
                        <button onClick={onClose} className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 rounded-lg">Close</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewersModal;
