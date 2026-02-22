import { Link } from 'react-router-dom';
import { Eye, CircleArrowDown, BookOpen, ArrowRight } from 'lucide-react';
import { useSelector } from "react-redux";
import { useSessionTracker } from "../Session/SessionTracker";

export default function ContinueWhereSection({ continue: continueData }) {

  // ✅ ALL hooks at top — before any conditional return
  const { trackClickEvent } = useSessionTracker();
  const sessionId = useSelector(
    (state) => state.session.currentSession?.sessionId
  );

  // ── Early exits after hooks
  if (!continueData || continueData.type === 'EMPTY') return null;

  // ── Suggestion type
  if (continueData.type === 'SUGGESTION') {
    return (
      <div className="mb-16">
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl p-10 md:p-12">
          <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-widest mb-3">
            Start learning
          </p>
          <h2 className="text-2xl font-semibold text-white mb-6">
            {continueData.message}
          </h2>
          {/* ✅ Link styled as button — no nested <button> */}
          <Link
            to={continueData.link || '/notes'}
            className="inline-flex items-center gap-2 bg-[#9CA3AF] hover:bg-white
              text-black px-8 py-3 rounded-full font-semibold
              transition-all duration-300"
          >
            {continueData.action}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ── Last viewed / Last downloaded type
  const { note } = continueData;
  if (!note) return null;

  return (
    <div className="mb-16">
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl overflow-hidden">

        {/* ── Label bar */}
        <div className="px-8 md:px-12 py-4 border-b border-[#1F1F1F]">
          <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-widest">
            Continue where you left off
          </p>
        </div>

        {/* ── Main content */}
        <div className="px-8 md:px-12 py-10 space-y-6">

          {/* Subject */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#4B5563] flex-shrink-0" />
            <p className="text-[#9CA3AF] text-sm font-medium capitalize">
              {note.subject}
            </p>
          </div>

          {/* Title + category */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
              {note.title}
            </h2>
            {note.category && (
              <span className="inline-block bg-[#1F1F1F] text-[#9CA3AF]
                text-xs font-semibold px-3 py-1 rounded-full">
                {note.category}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#4B5563]" />
              <span className="text-[#9CA3AF]">{note.views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleArrowDown className="w-4 h-4 text-[#4B5563]" />
              <span className="text-[#9CA3AF]">{note.downloads} downloads</span>
            </div>
          </div>

          {/* ✅ CTA — Link as button, no nested <button> */}
          <div className="pt-2">
            <Link
              to={`/notes/${note.id}/read`}
              onClick={() =>
                trackClickEvent?.({
                  resourceId: note.id,
                  resourceType: "NOTE",
                  sessionId,
                })
              }
              className="inline-flex items-center gap-2
                w-full md:w-auto justify-center md:justify-start
                bg-[#9CA3AF] hover:bg-white text-black
                px-10 py-4 rounded-full font-semibold
                transition-all duration-300 hover:scale-105"
            >
              {continueData.action}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
