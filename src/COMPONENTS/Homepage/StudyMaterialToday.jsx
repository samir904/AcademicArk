import { Link } from "react-router-dom";
import {
  BookOpen,
  PenLine,
  HelpCircle,
  ScrollText,
  Eye,
  CircleArrowDown,
  ChevronRight,
  CheckCircle2,
  PartyPopper,
  FileX,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";   // ✅ ADD

// ============================================
// 🎯 CATEGORY CONFIG
// ============================================
const CATEGORY_CONFIG = {
  notes: {
    icon:        BookOpen,
    label:       "Notes",
    emptyText:   "No notes available yet",
  },
  handwritten: {
    icon:        PenLine,
    label:       "Handwritten Notes",
    emptyText:   "No handwritten notes available yet",
  },
  imp: {
    icon:        HelpCircle,
    label:       "Important Questions",
    emptyText:   "No important questions available yet",
  },
  pyq: {
    icon:        ScrollText,
    label:       "Previous Year Papers",
    emptyText:   "No PYQs available yet",
  },
};

// ============================================
// 🎯 SINGLE NOTE CARD
// ============================================
const NoteCard = ({ item, isLastViewed }) => (
  <Link
    to={`/notes/${item.id}/read`}
    className={`
      flex-shrink-0 w-64 bg-[#111111] border rounded-xl p-4
      transition-all duration-300 cursor-pointer group relative block
      ${isLastViewed
        ? "border-[#9CA3AF]"
        : item.isViewed
          ? "border-[#1F1F1F] opacity-60 hover:opacity-100 hover:border-[#3F3F3F]"
          : "border-[#1F1F1F] hover:border-[#3F3F3F]"
      }
    `}
  >
    {/* ── Top row: Recommended badge + Viewed check */}
    <div className="flex items-center justify-between mb-3">

      {/* ── Recommended badge */}
      {item.isRecommended ? (
        <span className="text-[10px] font-semibold uppercase tracking-wider
          text-[#9CA3AF] bg-[#1F1F1F] px-2 py-0.5 rounded-full">
          Recommended
        </span>
      ) : (
        <span /> // keeps layout stable
      )}

      {/* ── Viewed checkmark */}
      {item.isViewed && (
        <CheckCircle2 className="w-4 h-4 text-[#3F3F3F] flex-shrink-0" />
      )}
    </div>

    {/* ── Title */}
    <h4
      className="font-semibold text-white text-sm leading-snug mb-4
        line-clamp-2 group-hover:text-[#9CA3AF] transition-colors min-h-[40px]"
    >
      {item.title}
    </h4>

    {/* ── Stats */}
    <div className="flex items-center gap-4 text-xs text-[#4B5563]">
        <div className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-[#9CA3AF]">{item.views}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <CircleArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-[#9CA3AF]">{item.downloads}</span>
      </div>
    </div>
  </Link>
);


// ============================================
// 🎯 EMPTY STATE (Upgrade 4)
// ============================================
const EmptyRow = ({ text }) => (
  <div className="flex items-center gap-2.5 px-6 md:px-8 py-3">
    <FileX className="w-4 h-4 text-[#2F2F2F] flex-shrink-0" />
    <span className="text-xs text-[#2F2F2F]">{text}</span>
  </div>
);

// ============================================
// 🎯 CATEGORY ROW
// ============================================
const CategoryRow = ({ section, lastViewedId }) => {
  const cfg = CATEGORY_CONFIG[section.category];
  if (!cfg) return null;
  const Icon = cfg.icon;

  const scrollRef = useRef(null);
  const [showLeftHint,  setShowLeftHint]  = useState(false);
  const [showRightHint, setShowRightHint] = useState(false);

  // ── Reusable checker for both hints
  const checkHints = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftHint(scrollLeft > 4);
    setShowRightHint(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    checkHints();
    const ro = new ResizeObserver(checkHints);
    if (scrollRef.current) ro.observe(scrollRef.current);
    return () => ro.disconnect();
  }, [section.items]);

  const scrollRight = (e) => {
    e.preventDefault();
    scrollRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  const scrollLeft = (e) => {
    e.preventDefault();
    scrollRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  };

  return (
    <div>
      {/* ── Row header */}
      <div className="flex items-center gap-2.5 px-6 md:px-8 mb-3">
        <div className="w-6 h-6 bg-[#1F1F1F] rounded-lg flex items-center
          justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </div>
        <span className="text-sm font-semibold text-white">{cfg.label}</span>
        <span className="text-xs text-[#4B5563]">{section.items.length}</span>
      </div>

      {/* ── Scroll area */}
      {section.items.length === 0 ? (
        <EmptyRow text={cfg.emptyText} />
      ) : (
        <div className="relative">

          {/* ── Scroll container */}
          <div
            ref={scrollRef}
            onScroll={checkHints}
            className="flex gap-3 overflow-x-auto pb-3"
            style={{
              paddingLeft:     "24px",
              paddingRight:    "24px",
              scrollbarWidth:  "none",
              msOverflowStyle: "none",
            }}
          >
            {section.items.map((item) => (
              <NoteCard
                key={item.id}
                item={item}
                isLastViewed={item.id === lastViewedId}
              />
            ))}
          </div>

          {/* ── LEFT hint */}
          <div
            className={`
              absolute top-0 left-0 h-[calc(100%-12px)]
              flex items-center justify-start
              pointer-events-none
              transition-opacity duration-300
              ${showLeftHint ? "opacity-100" : "opacity-0"}
            `}
            style={{
              width:      "80px",
              background: "linear-gradient(to left, transparent, #0F0F0F 75%)",
            }}
          >
            <button
              onClick={scrollLeft}
              className="pointer-events-auto ml-3 w-7 h-7 rounded-full
                bg-[#1F1F1F] border border-[#2F2F2F]
                flex items-center justify-center
                hover:bg-[#2F2F2F] transition-colors"
              aria-label="Scroll left"
            >
              {/* Flipped ChevronRight = left arrow */}
              <ChevronRight className="w-4 h-4 text-[#9CA3AF] rotate-180" />
            </button>
          </div>

          {/* ── RIGHT hint */}
          <div
            className={`
              absolute top-0 right-0 h-[calc(100%-12px)]
              flex items-center justify-end
              pointer-events-none
              transition-opacity duration-300
              ${showRightHint ? "opacity-100" : "opacity-0"}
            `}
            style={{
              width:      "80px",
              background: "linear-gradient(to right, transparent, #0F0F0F 75%)",
            }}
          >
            <button
              onClick={scrollRight}
              className="pointer-events-auto mr-3 w-7 h-7 rounded-full
                bg-[#1F1F1F] border border-[#2F2F2F]
                flex items-center justify-center
                hover:bg-[#2F2F2F] transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

// ============================================
// 🎯 PROGRESS BAR
// ============================================
const ProgressBar = ({ completed, total, percentage }) => (
  <div className="flex items-center gap-4">
    <div className="flex-1 h-1 bg-[#1F1F1F] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#9CA3AF] rounded-full transition-all duration-700"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
    <span className="text-xs text-[#4B5563] whitespace-nowrap flex-shrink-0">
      {completed} / {total} studied
    </span>
  </div>
);

// ============================================
// 🎯 MAIN COMPONENT
// ============================================
export default function StudyMaterialToday({ data }) {
  if (!data?.hasData || !data?.sections?.length) return null;

  const {
    focusLabel,
    sections,
    totalMaterials,
    progress,
    subject,
    unit,
    lastViewedId,   // ← pass from backend (continue.note.id)
  } = data;

  const isUnitComplete = progress?.percentage === 100;

  return (
    <div className="mb-16">

      {/* ── Section header */}
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-widest">
            Tap any card to open and start studying
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Study Materials for Today
          </h2>
          <p className="text-sm text-[#4B5563] capitalize">
            {focusLabel} · {totalMaterials} resources
          </p>
        </div>

        <Link
          to={`/notes?subject=${encodeURIComponent(subject)}&unit=${unit}`}
          className="flex items-center gap-1 text-[#9CA3AF] hover:text-white
            text-sm font-medium transition-colors flex-shrink-0 mt-1"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── Progress section */}
      {progress && (
        <div className="mb-6 space-y-3">

          {/* ── Upgrade 1: Completion celebration */}
          {isUnitComplete ? (
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                border border-[#1F1F1F] bg-[#0F0F0F]"
            >
              <PartyPopper className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-sm font-medium text-white">
                Unit completed!
              </span>
              <span className="text-sm text-[#4B5563]">
                All {progress.total} materials studied 🎉
              </span>
            </div>
          ) : (
            <ProgressBar
              completed={progress.completed}
              total={progress.total}
              percentage={progress.percentage}
            />
          )}
        </div>
      )}

      {/* ── Content rows */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl">
        {sections.map((section, i) => (
          <div
            key={section.category}
            className={
              i < sections.length - 1
                ? "border-b border-[#1F1F1F] py-5"
                : "py-5"
            }
          >
            <CategoryRow
              section={section}
              lastViewedId={lastViewedId}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
