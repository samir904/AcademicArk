// ContinueWhereSection.jsx
import { Link } from 'react-router-dom';
import {Eye,CircleArrowDown, Book} from 'lucide-react'
export default function ContinueWhereSection({ continue: continueData }) {
    if (!continueData || continueData.type === 'EMPTY') {
        return null;
    }

    // Handle suggestion type
    if (continueData.type === 'SUGGESTION') {
        return (
            <div className="mb-16">
                <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl p-10 md:p-12 hover:border-[#9CA3AF] transition-all duration-300">
                    <p className="text-[#9CA3AF] text-sm font-medium uppercase tracking-wider mb-3">
                        Start learning
                    </p>
                    <h2 className="text-2xl font-semibold text-white mb-6">
                        {continueData.message}
                    </h2>
                    <Link to={continueData.link || '/notes'}>
                        <button className="bg-[#9CA3AF] hover:bg-white text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                            {continueData.action}
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const { note } = continueData;

    return (
        <div className="mb-16">
            {/* Hero card for continuing notes */}
            <div className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border border-[#1F1F1F] rounded-2xl overflow-hidden hover:border-[#9CA3AF] transition-all duration-300">
                {/* Top section - light label */}
                <div className="px-8 md:px-12 py-4 border-b border-[#1F1F1F]">
                    <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-widest">
                        Continue where you left off
                    </p>
                </div>

                {/* Main content */}
                <div className="px-8 md:px-12 py-10 space-y-6">
                    {/* Subject tag */}
                    <div className="flex items-center gap-2">
                        <span className="text-[#4B5563]"><Book className='w-4 h-4'/></span>
                        <p className="text-[#9CA3AF] text-sm font-medium">
                            {note.subject}
                        </p>
                    </div>

                    {/* Title - hero text */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                            {note.title}
                        </h2>
                        
                        {/* Category badge */}
                        {note.category && (
                            <span className="inline-block bg-[#1F1F1F] text-[#9CA3AF] text-xs font-semibold px-3 py-1 rounded-full">
                                {note.category}
                            </span>
                        )}
                    </div>

                    {/* Stats - minimalist */}
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-[#4B5563]"><Eye className='w-4 h-4' /></span>
                            <span className="text-[#9CA3AF]">{note.views} views</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#4B5563]"><CircleArrowDown className='w-4 h-4' /></span>
                            <span className="text-[#9CA3AF]">{note.downloads} downloads</span>
                        </div>
                    </div>

                    {/* CTA - big and clear */}
                    <div className="pt-4">
                        <Link to={`/notes/${note.id}/read`}>
                            <button className="w-full md:w-auto bg-[#9CA3AF] hover:bg-white text-black px-10 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                                {continueData.action} →
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
