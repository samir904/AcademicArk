// TrendingSection.jsx
import { Link } from 'react-router-dom';

export default function TrendingSection({ trending }) {
    if (!trending.hasData) {
        return null;
    }

    return (
        <div className="mb-12">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                {/* <span className="text-2xl">🔥</span> */}
                <h2 className="text-2xl font-semibold text-white">
                    {trending.section}
                </h2>
            </div>

            {/* Trending list - minimal */}
            <div className="space-y-2">
                {trending.notes.map((note, index) => (
                    <Link key={note.id} to={`/notes/${note.id}/read`}>
                        <div className="group bg-[#0F0F0F] border border-[#1F1F1F] rounded-lg p-4 hover:border-[#9CA3AF] hover:bg-[#111111] transition-all duration-300 cursor-pointer">
                            
                            <div className="flex items-start gap-4">
                                {/* Rank number */}
                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1F1F1F] flex items-center justify-center">
                                    <span className="text-[#9CA3AF] font-bold text-xs">
                                        #{index + 1}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[#9CA3AF] text-xs uppercase font-semibold tracking-wide mb-1">
                                        {note.subject}
                                    </p>
                                    <h4 className="font-medium text-white truncate group-hover:text-[#9CA3AF] transition">
                                        {note.title}
                                    </h4>
                                </div>

                                {/* Stats on right */}
                                <div className="flex-shrink-0 text-right">
                                    <p className="text-[#9CA3AF] text-xs font-medium">
                                        {note.downloads > 1000 
                                            ? `${(note.downloads / 1000).toFixed(1)}k` 
                                            : note.downloads} downloads
                                    </p>
                                    <span className="text-[#4B5563] text-xs">
                                        {note.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
