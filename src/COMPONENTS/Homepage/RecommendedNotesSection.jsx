// RecommendedNotesSection.jsx
import { Link } from 'react-router-dom';

export default function RecommendedNotesSection({ recommended }) {
    if (!recommended.hasData) {
        return null;
    }

    return (
        <div className="mb-16">
            {/* Header with view all */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-white">
                    Recommended for you
                </h2>
                <Link to="/notes" className="text-[#9CA3AF] hover:text-white text-sm font-medium transition">
                    View all →
                </Link>
            </div>

            {/* Horizontal scroll cards */}
            <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                {recommended.notes.map((note) => (
                    <Link key={note.id} to={`/notes/${note.id}/read`}>
                        <div className="flex-shrink-0 w-80 md:w-full bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6 hover:border-[#9CA3AF] transition-all duration-300 cursor-pointer group">
                            
                            {/* Subject */}
                            <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-3">
                                {note.subject}
                            </p>

                            {/* Title */}
                            <h3 className="font-semibold text-white mb-4 line-clamp-2 group-hover:text-[#9CA3AF] transition">
                                {note.title}
                            </h3>

                            {/* Rating + Bookmarks */}
                            {/* <div className="flex items-center gap-2 mb-4 text-sm">
                                <span className="text-[#9CA3AF]">⭐ {note.rating}</span>
                                <span className="text-[#4B5563]">•</span>
                                <span className="text-[#9CA3AF]">{note.bookmarks} saved</span>
                            </div> */}

                            {/* Stats */}
                            <div className="flex gap-4 text-xs text-[#9CA3AF] mb-4 pb-4 border-b border-[#1F1F1F]">
                                <span>{note.downloads} downloads</span>
                                <span>•</span>
                                <span>{note.views} views</span>
                            </div>

                            {/* Category tag */}
                            <span className="inline-block text-[#9CA3AF] text-xs font-medium">
                                {note.category}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
