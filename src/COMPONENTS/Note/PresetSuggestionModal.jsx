import React from 'react';
import { Star, X, Sparkles } from 'lucide-react';

export default function PresetSuggestionModal({
  isOpen,
  onClose,
  onSave,
  suggestedFilter
}) {
  if (!isOpen) return null;

  const formatFilterText = () => {
    const parts = [];
    
    if (suggestedFilter?.subject) {
      parts.push(`${suggestedFilter.subject}`);
    }
    
    if (suggestedFilter?.category) {
      parts.push(suggestedFilter.category);
    }
    
    if (suggestedFilter?.unit) {
      parts.push(`Unit ${suggestedFilter.unit}`);
    }

    return parts.join(' • ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#1F1F1F] to-[#0F0F0F] rounded-2xl border border-[#2F2F2F] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-yellow-500/10 via-purple-500/10 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#1F1F1F]/80 hover:bg-[#2F2F2F] border border-[#2F2F2F] flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4 text-[#9CA3AF]" />
        </button>

        {/* Content */}
        <div className="relative p-6 space-y-6">
          
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/20 to-purple-500/20 border-2 border-yellow-400/30 flex items-center justify-center">
                <Star className="w-10 h-10 text-yellow-400 fill-yellow-400 " />
              </div>
              
              {/* Sparkles */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 " />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">
              Save this as a preset?
            </h3>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              You've used this filter combination <span className="text-yellow-400 font-semibold">3+ times</span>. 
              Save it for quick access next time!
            </p>
          </div>

          {/* Filter Preview Card */}
          <div className="bg-[#0F0F0F] border border-[#2F2F2F] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#6B7280] uppercase tracking-wider font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
              Your Filter
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#9CA3AF]">Semester:</span>
                <span className="text-white font-semibold">{suggestedFilter?.semester}</span>
              </div>
              
              {suggestedFilter?.subject && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#9CA3AF]">Subject:</span>
                  <span className="text-white font-semibold capitalize">{suggestedFilter.subject}</span>
                </div>
              )}
              
              {suggestedFilter?.category && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#9CA3AF]">Type:</span>
                  <span className="text-white font-semibold">{suggestedFilter.category}</span>
                </div>
              )}
              
              {suggestedFilter?.unit && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#9CA3AF]">Unit:</span>
                  <span className="text-white font-semibold">{suggestedFilter.unit}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-[#9CA3AF] bg-[#1F1F1F] hover:bg-[#2F2F2F] border border-[#2F2F2F] transition-all"
            >
              Not now
            </button>
            
            <button
              onClick={onSave}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-lg shadow-yellow-400/20 transition-all active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                Save Preset
              </span>
            </button>
          </div>

          {/* Subtle benefit hint */}
          <p className="text-center text-xs text-[#6B7280]">
            💡 Saved presets appear in the filters section for one-click access
          </p>
        </div>
      </div>
    </div>
  );
}
