import React, { useState, useRef, useEffect } from "react";
import { Star, ChevronDown, Plus, Trash2 } from "lucide-react";

export default function SavedFilterPresetsDropdown({
    savedFilters,
    onApplyPreset,
    onOpenSaveModal,
    onSetDefaultPreset,   // ✅ ADD
    onDeletePreset ,       // ✅ ADD
    isOpen,
    setIsOpen

}) {
    // const [open, setOpen] = useState(false);
    const ref = useRef(null);
// if (ref.current && !ref.current.contains(e.target)) {
//   setIsOpen(false);
// }
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (

        
        <div ref={ref} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
          flex items-center gap-2 px-3 py-1.5
          text-xs font-semibold rounded-lg
          bg-[#1F1F1F] border border-[#2F2F2F]
          text-[#9CA3AF] hover:text-white
        "
            >
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                Presets
                <ChevronDown className={`w-3.5 h-3.5 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
             <div
  className="
    absolute
    mt-2
    w-72
    max-w-[90vw]

    /* 📱 MOBILE: center */
    left-1/2 -translate-x-1/2

    /* 💻 DESKTOP: align right */
    sm:left-auto sm:translate-x-0 sm:right-0

    bg-[#0F0F0F]
    border border-[#2F2F2F]
    rounded-xl
    shadow-xl
    z-50
  "
>
<div className="max-h-72 overflow-y-auto">
  {savedFilters.length === 0 ? (
    <div className="px-4 py-6 text-center space-y-3">
      <Star className="w-8 h-8 text-yellow-400 mx-auto" />

      <p className="text-sm font-semibold text-white">
        No saved presets yet
      </p>

      <p className="text-xs text-[#9CA3AF] leading-relaxed">
        Save your current filters to quickly reuse them later.
      </p>

      <button
        onClick={() => {
          onOpenSaveModal();
          setIsOpen(false);
        }}
        className="
          mt-2
          inline-flex items-center gap-2
          px-3 py-2
          text-xs font-semibold
          rounded-lg
          bg-yellow-400/10
          text-yellow-400
          hover:bg-yellow-400/20
          transition
        "
      >
        <Plus className="w-4 h-4" />
        Save your first preset
      </button>
    </div>
  ) : (
    savedFilters.map(preset => (
      <div
        key={preset._id}
        className="px-3 py-2 border-b border-[#1F1F1F]"
      >
       <div className="flex items-center justify-between">
                                    <button
                    onClick={() => {
                      onApplyPreset(preset);
                      setIsOpen(false);
                    }}
                    className="text-sm text-white truncate text-left"
                  >
                    {preset.isDefault && (
                      <Star className="inline w-4 h-4 text-yellow-400 mr-1" />
                    )}
                    {preset.name}
                  </button>

                                    <div className="flex items-center gap-2">
                                        {!preset.isDefault && (
                                            <button
                                                onClick={() => onSetDefaultPreset(preset._id)}
                                                title="Set default"
                                            >
                                                <Star className="w-4 h-4 text-[#6B7280] hover:text-yellow-400" />
                                            </button>
                                        )}


                                        <button
                                            onClick={() => onDeletePreset(preset._id)}
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-[11px] text-[#6B7280] mt-1">
                                    Semester {preset.filters.semester}
                                    {preset.filters.subject && ` • ${preset.filters.subject}`}
                                    {preset.filters.category && ` • ${preset.filters.category}`}
                                    {preset.filters.unit && ` • Unit ${preset.filters.unit}`}
                                </div>
      </div>
    ))
  )}
</div>

                    

                    <button
                        onClick={() => {
                            onOpenSaveModal();
                            setIsOpen(false);
                        }}
                        className="
              w-full px-3 py-2 text-sm
              text-[#9CA3AF] hover:bg-[#1F1F1F]
              flex items-center gap-2
            "
                    >
                        <Plus className="w-4 h-4" />
                        Save current filters
                    </button>
                </div>
            )}
            
        </div>
    );
}

