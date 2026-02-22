import { Link, useLocation } from "react-router-dom";
import {
  Search, Library, CalendarDays,
  BookMarked, MessageCircle, ClipboardList,CalendarCog
} from "lucide-react";

const ACTIONS = [
//   { id: "search",     label: "Search",     icon: Search,        to: "/search"                },
//   { id: "library",    label: "Library",    icon: Library,       to: "/notes"                 },
//   { id: "planner",    label: "Planner",    icon: CalendarCog,  to: "/planner"               },
  { id: "saved",      label: "Saved",      icon: BookMarked,    to: "/bookmarks" },
//   { id: "buddy",      label: "AI Buddy",   icon: MessageCircle, to: "/study-buddy"           },
  { id: "attendance", label: "Attendance", icon: ClipboardList, to: "/attendance"            },
];

export default function QuickActionsBar() {
  const { pathname } = useLocation();

  return (
    <div className="mb-16">
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {ACTIONS.map((action) => {
          const Icon     = action.icon;
          const isActive = pathname === action.to;

          return (
            <Link
              key={action.id}
              to={action.to}
              className={`
                flex items-center gap-2.5 px-4 py-2.5 rounded-full border
                flex-shrink-0 transition-all duration-200
                ${isActive
                  ? "bg-white text-black border-white"
                  : "bg-[#0F0F0F] border-[#1F1F1F] text-[#9CA3AF] hover:border-[#3F3F3F] hover:text-white"
                }
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
