import React from 'react';
import { Check } from 'lucide-react';

export const SubjectChips = ({
  subjects = [],
  selectedSubject,
  onSubjectChange,
  subjectCounts = {}
}) => {
  if (!subjects || subjects.length === 0) return null;

  return (
    <div className="space-y-2 animate-in fade-in duration-200">
      <h4 className="text-xs text-[#9CA3AF] font-semibold uppercase tracking-wider px-1">
        Select Subject
      </h4>
      
      {/* Scrollable container - horizontal on mobile, grid on desktop */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
        <div className="flex gap-2 min-w-min md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-2">
          {subjects.map((subject) => {
            const isActive = selectedSubject === subject;
            const count = subjectCounts[subject] || 0;
            
            return (
              <button
                key={subject}
                onClick={() => onSubjectChange(subject)}
                className={`
                  relative
                  px-4 py-2.5
                  rounded-lg
                  border
                  transition-all duration-200
                  transform hover:scale-105
                  flex items-center gap-2
                  whitespace-nowrap
                  flex-shrink-0
                  md:flex-shrink
                  md:justify-between
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#9CA3AF]/50
                  ${isActive
                    ? 'bg-[#9CA3AF] border-[#9CA3AF] text-black shadow-lg shadow-[#9CA3AF]/30'
                    : 'bg-[#1F1F1F]/40 border-[#1F1F1F] text-[#9CA3AF] hover:bg-[#1F1F1F]/60 hover:border-[#9CA3AF]/30'
                  }
                `}
                title={`Select ${subject} (${count} resources)`}
              >
                {/* Subject name */}
                <span className="font-medium text-sm truncate">{subject}</span>
                
                {/* Count badge */}
                <span className={`
                  text-xs font-bold px-2 py-0.5 rounded-full
                  flex-shrink-0
                  ${isActive
                    ? 'bg-black/20 text-black'
                    : 'bg-[#9CA3AF]/20 text-[#9CA3AF]'
                  }
                `}>
                  {count}
                </span>
                
                {/* Active checkmark */}
                {isActive && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#22C55E] rounded-full flex items-center justify-center border-2 border-[#0F0F0F] shadow-lg animate-bounce">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
