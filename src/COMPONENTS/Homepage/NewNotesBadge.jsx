import { Link } from "react-router-dom";
import { Sparkles, ChevronRight, X } from "lucide-react";
import { useState } from "react";

export default function NewNotesBadge({ data }) {
  const [dismissed, setDismissed] = useState(false);

  // ── Don't render if no new notes or dismissed
  if (!data?.hasNew || dismissed) return null;

  const { count, sinceLabel, subjectSummary, preview } = data;

  return (
    <div className="mb-2">
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl
        overflow-hidden">

        {/* ── Header row */}
        <div className="flex items-center justify-between
          px-5 py-4 border-b border-[#1F1F1F]">

          <div className="flex items-center gap-3">
            {/* Pulse dot */}
            <div className="relative flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-white" />
              <div className="absolute inset-0 w-2 h-2 rounded-full
                bg-white animate-ping opacity-40" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white leading-tight">
                {count} new note{count > 1 ? "s" : ""} added
              </p>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Since your last visit · {sinceLabel}
              </p>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            className="w-7 h-7 rounded-lg bg-[#1A1A1A] hover:bg-[#222222]
              flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5 text-[#4B5563]" />
          </button>
        </div>

        {/* ── Preview list */}
        <div className="divide-y divide-[#1A1A1A]">
          {preview.map((note) => (
            <Link
              key={note.id}
              to={`/notes/${note.id}/read`}
              className="flex items-center justify-between
                px-5 py-3 hover:bg-[#141414] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Category dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-[#3F3F3F]
                  flex-shrink-0 group-hover:bg-[#9CA3AF] transition-colors" />

                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate
                    group-hover:text-[#9CA3AF] transition-colors">
                    {note.title}
                  </p>
                  <p className="text-xs text-[#4B5563] capitalize truncate mt-0.5">
                    {note.subject} · {note.category}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#2F2F2F]
                group-hover:text-[#9CA3AF] transition-colors flex-shrink-0 ml-3" />
            </Link>
          ))}
        </div>

        {/* ── Footer CTA — only if more than preview */}
        {count > 5 && (
          <div className="px-5 py-3 border-t border-[#1F1F1F]">
            <Link
              to="/notes"
              className="text-xs text-[#9CA3AF] hover:text-white
                transition-colors font-medium"
            >
              View all {count} new notes →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
