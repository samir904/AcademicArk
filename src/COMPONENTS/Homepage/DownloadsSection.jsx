import { Download, Clock, File, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSectionTracker } from '../../hooks/useSectionTracker';
import { useTracker } from '../../CONTEXT/HomepageTrackerContext';

export default function DownloadsSection({ downloads }) {
  // ✅ ALL hooks BEFORE any conditional return
  const sectionRef     = useSectionTracker("downloads");
  const { trackClick } = useTracker();

  // Fallback: No downloads yet
  if (!downloads || !downloads.hasData) {
    return (
      <div ref={sectionRef} className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Downloads</h2>
        </div>
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-lg p-6 text-center">
          <Download className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <p className="text-[#9CA3AF] text-sm mb-4">No downloads yet</p>
          <Link to="/downloads">
            <button onClick={() => trackClick("downloads", { resourceType: "LINK", ctaLabel: "Start Downloading Your First Note" })} className="inline-flex items-center gap-2 bg-[#9CA3AF] hover:bg-white text-black px-6 py-2 rounded-full font-semibold transition-all text-sm">
              Start Downloading Your First Note
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const { totalDownloads, lastDownloadedNote } = downloads;

  return (
    <div ref={sectionRef} className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Download className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-semibold text-white">
            Your Downloads
          </h2>
        </div>
        <Link 
          to="/downloads" 
          onClick={() => trackClick("downloads", {
            ctaLabel:     "View all header link",
            resourceType: "LINK",
          })}
          className="text-[#9CA3AF] hover:text-white text-sm font-medium transition"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6  transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2">
                Total Downloads
              </p>
              <p className="text-3xl font-bold text-white">
                {totalDownloads || 0}
              </p>
            </div>
            <Download className="w-6 h-6 text-purple-400 opacity-50" />
          </div>
        </div>

     {lastDownloadedNote && (
          <Link
            to={`/notes/${lastDownloadedNote.id}/read`}
            onClick={() => trackClick("downloads", {
              resourceId:   lastDownloadedNote.id,
              resourceType: "NOTE",
              ctaLabel:     "Last Downloaded",
            })}
          >
            <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6
              hover:border-[#3F3F3F] transition-all cursor-pointer h-full">
              <p className="text-[#9CA3AF] text-xs font-medium uppercase
                tracking-wider mb-3">Last Downloaded</p>
              <div className="flex items-start gap-3">
                <File className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate">
                    {lastDownloadedNote.title}
                  </p>
                  <p className="text-[#9CA3AF] text-sm">
                    {lastDownloadedNote.subject}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      <div className="mt-6">
        <Link
          to="/downloads"
          onClick={() => trackClick("downloads", { resourceType: "CTA", ctaLabel: "View All Downloads" })}
          className="w-full md:hidden bg-[#9CA3AF] hover:bg-white text-black
            px-8 py-3 rounded-full font-semibold transition-all duration-300
            hover:scale-105 inline-flex items-center justify-center gap-2"
        >
          View All Downloads
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}