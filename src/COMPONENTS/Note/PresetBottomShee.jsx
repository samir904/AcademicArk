import { Star } from "lucide-react";

export function PresetBottomSheet({
  isOpen,
  onClose,
  savedFilters,
  onApplyPreset,
  onSetDefaultPreset,
  onDeletePreset,
  onOpenSaveModal
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          bg-[#0F0F0F]
          rounded-t-2xl
          border-t border-[#2F2F2F]
          max-h-[80vh]
          overflow-y-auto
          p-4
          animate-slide-up
        "
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white">
            Saved presets
          </h3>
          <button onClick={onClose} className="text-[#9CA3AF]">
            ✕
          </button>
        </div>

        {savedFilters.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <Star className="w-8 h-8 text-yellow-400 mx-auto" />
            <p className="text-sm text-white font-semibold">
              No presets yet
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Select a semester and filters, then save them here.
            </p>

            <button
              onClick={onOpenSaveModal}
              className="mt-2 px-4 py-2 rounded-lg bg-yellow-400/10 text-yellow-400"
            >
              + Save first preset
            </button>
          </div>
        ) : (
          savedFilters.map(preset => (
            <div
              key={preset._id}
              className="border-b border-[#1F1F1F] py-3"
            >
              <button
                onClick={() => {
                  onApplyPreset(preset);
                  onClose();
                }}
                className="text-left w-full text-white font-medium"
              >
                {preset.name}
              </button>

              <div className="mt-1 text-xs text-[#6B7280]">
                Semester {preset.filters.semester}
              </div>

              <div className="flex gap-3 mt-2 text-xs">
                {!preset.isDefault && (
                  <button
                    onClick={() => onSetDefaultPreset(preset._id)}
                    className="text-yellow-400"
                  >
                    Set default
                  </button>
                )}
                <button
                  onClick={() => onDeletePreset(preset._id)}
                  className="text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}