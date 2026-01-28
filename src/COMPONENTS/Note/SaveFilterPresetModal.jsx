import React, { useState } from "react";
import { X, Star } from "lucide-react";

export default function SaveFilterPresetModal({
  isOpen,
  onClose,
  onSave,
  defaultName = ""
}) {
  const [name, setName] = useState(defaultName);
  const [isDefault, setIsDefault] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl bg-[#0F0F0F] border border-[#2F2F2F] p-5">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold text-sm">
            Save filter preset
          </h3>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-[#9CA3AF]" />
          </button>
        </div>

        {/* Name */}
        <label className="text-xs text-[#9CA3AF]">Preset name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Semester 5 – Cloud Computing"
          className="
            mt-1 w-full px-3 py-2 rounded-lg
            bg-[#1F1F1F] border border-[#2F2F2F]
            text-sm text-white
            focus:outline-none focus:border-[#9CA3AF]/50
          "
        />

        {/* Default */}
        <button
          onClick={() => setIsDefault(!isDefault)}
          className="
            mt-4 flex items-center gap-2
            text-xs font-semibold
            text-[#9CA3AF] hover:text-white
          "
        >
          <Star className={`w-4 h-4 ${isDefault ? "text-yellow-400" : ""}`} />
          Set as default preset
        </button>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-md text-[#9CA3AF]"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave({ name, isDefault })}
            disabled={!name.trim()}
            className="
              text-xs font-semibold
              px-4 py-1.5 rounded-md
              bg-[#9CA3AF] text-black
              disabled:opacity-50
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}