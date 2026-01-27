// ============================================
// PLANNER NOTES STRIP COMPONENT - FIXED
// ============================================
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../HELPERS/axiosInstance';
import { BookMarked, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PlannerNotesStrip({ subject, unit }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!subject || !unit) return;

    const fetchPlannerNotes = async () => {
      try {
        const res = await axiosInstance.get(
          `/planner/notes?subject=${subject}&unit=${unit}`,
          { withCredentials: true }
        );
        setData(res.data.data);
      } catch (err) {
        console.error("Planner notes error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlannerNotes();
  }, [subject, unit]);

  if (loading) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="h-20 bg-neutral-800 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
      <Header />

      <Section title="Notes" notes={data.notes} navigate={navigate} />
      <Section title="Handwritten" notes={data.handwritten} navigate={navigate} />
      <Section title="Important Questions" notes={data.important} navigate={navigate} />
      <Section title="PYQs" notes={data.pyqs} navigate={navigate} />
    </div>
  );
}

function Header() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <BookMarked className="w-5 h-5 text-indigo-500" />
        <h3 className="text-neutral-100 font-semibold">
          Study Materials for Today
        </h3>
      </div>
      <p className="text-xs text-neutral-500 mt-1">
        Tap any card to open and start studying
      </p>
    </div>
  );
}

function Section({ title, notes = [], navigate }) {
  if (!notes.length) return null;

  // Sort recommended first
  const sortedNotes = [...notes].sort(
    (a, b) => (b.isRecommended === true) - (a.isRecommended === true)
  );

  return (
    <div>
      <h4 className="text-sm text-neutral-400 mb-2">{title}</h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sortedNotes.map((note, index) => {
          const showRecommended = note.recommended===true ;

          return (
            <div
              key={note._id}
              onClick={() => navigate(`/notes/${note._id}/read`)}
              className="
                cursor-pointer
                relative
                bg-neutral-800
                border border-neutral-700
                rounded-xl
                p-3
                hover:border-indigo-500/40
                hover:bg-neutral-800/80
                transition-all
                duration-300
                group
                min-h-20
                flex
                flex-col
                justify-center
              "
            >
              {/* Badge - Positioned absolutely at top-left */}
              {showRecommended && (
                <div className="absolute -top-2 -left-2 flex items-center gap-1 bg-indigo-600 px-2 py-1 rounded-full shadow-lg border border-indigo-500/50 z-10">
                  <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  <span className="text-[10px] text-white font-semibold whitespace-nowrap">
                    Recommended
                  </span>
                </div>
              )}

              {/* Title with Arrow - Fixed size container */}
              <div className="flex items-center justify-between gap-2 w-full">
                <p className="text-xs text-neutral-200 line-clamp-2 group-hover:text-indigo-300 transition flex-1">
                  {note.title}
                </p>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-indigo-400 flex-shrink-0 transition-all group-hover:translate-x-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}