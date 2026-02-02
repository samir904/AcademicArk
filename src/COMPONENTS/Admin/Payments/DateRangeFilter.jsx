import { Calendar } from "lucide-react";

export default function DateRangeFilter({ from, to, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <Calendar size={14} className="text-gray-400" />

      <input
        type="date"
        value={from}
        onChange={e => onChange("from", e.target.value)}
        className="bg-[#1F1F1F] border border-white/10 text-sm rounded-lg px-2 py-1 text-white"
      />

      <span className="text-gray-500 text-sm">to</span>

      <input
        type="date"
        value={to}
        onChange={e => onChange("to", e.target.value)}
        className="bg-[#1F1F1F] border border-white/10 text-sm rounded-lg px-2 py-1 text-white"
      />
    </div>
  );
}
