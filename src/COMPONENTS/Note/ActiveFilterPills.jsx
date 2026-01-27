import { X } from "lucide-react";

export default function ActiveFilterPills({ localFilters, handleFilterChange }) {
  const pills = [];

  if (localFilters.semester) {
    pills.push({
      key: "semester",
      label: `Semester ${localFilters.semester}`,
      onRemove: () =>
        handleFilterChange({
          semester: "",
          subject: "",
          category: "",
          unit: "",
          videoChapter: ""
        })
    });
  }

  if (localFilters.subject) {
    pills.push({
      key: "subject",
      label: localFilters.subject,
      onRemove: () =>
        handleFilterChange({
          subject: "",
          category: "",
          unit: "",
          videoChapter: ""
        })
    });
  }

  if (localFilters.category) {
    pills.push({
      key: "category",
      label: localFilters.category,
      onRemove: () =>
        handleFilterChange({
          category: "",
          unit: "",
          videoChapter: ""
        })
    });
  }

  if (localFilters.unit) {
    pills.push({
      key: "unit",
      label: `Unit ${localFilters.unit}`,
      onRemove: () => handleFilterChange("unit", "")
    });
  }

  if (localFilters.videoChapter) {
    pills.push({
      key: "videoChapter",
      label: `Chapter ${localFilters.videoChapter}`,
      onRemove: () => handleFilterChange("videoChapter", "")
    });
  }
  if (localFilters.uploadedBy) {
  pills.push({
    key: "uploadedBy",
    label: "Contributor",
    onRemove: () =>
      handleFilterChange("uploadedBy", "")
  });
}

  if (pills.length === 0) return null;

  return (
    <div
  className="
    flex gap-2 mb-4
    overflow-x-auto
    whitespace-nowrap
    -mx-4 px-4
    scrollbar-hide
    md:flex-wrap md:overflow-visible md:whitespace-normal md:mx-0 md:px-0
  "
>
      {pills.map(pill => (
        <div
          key={pill.key}
          className="
            flex items-center gap-1.5
            px-3 py-1.5
            text-xs font-semibold
            rounded-full
            bg-[#1F1F1F]
            border border-[#2F2F2F]
            text-[#E5E7EB]
          "
        >
          <span className="capitalize truncate max-w-[120px]">
            {pill.label}
          </span>

          <button
            onClick={pill.onRemove}
            className="
              w-4 h-4
              rounded-full
              bg-[#374151]
              hover:bg-[#EF4444]
              flex items-center justify-center
              transition
            "
            title="Remove filter"
          >
            <X className="w-3 h-3 text-white" strokeWidth={2.5} />
          </button>
        </div>
      ))}
    </div>
  );
}