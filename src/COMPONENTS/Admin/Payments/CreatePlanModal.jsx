import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPlan } from "../../../REDUX/Slices/planSlice";
import { X } from "lucide-react";

export default function CreatePlanModal({ onClose }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    price: "",
    validityDays: "",
    dailyDownloadLimit: "",
    sortOrder: ""
  });

  const [error, setError] = useState(null);

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = () => {
    // 🛑 Basic validation
    if (
      !form.code ||
      !form.name ||
      !form.price ||
      !form.validityDays ||
      !form.dailyDownloadLimit
    ) {
      setError("Please fill all required fields");
      return;
    }

    dispatch(
      createPlan({
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        validityDays: Number(form.validityDays),
        dailyDownloadLimit: Number(form.dailyDownloadLimit),
        sortOrder: Number(form.sortOrder) || 0
      })
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="
        w-full max-w-lg
        bg-[#0F0F0F]
        border border-white/10
        rounded-2xl
        shadow-2xl
        p-6
        space-y-5
      ">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Create New Plan
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {/* CODE */}
          <Field
            label="Plan Code"
            hint="Unique identifier (e.g. EXAM_BOOST)"
            value={form.code}
            onChange={v => update("code", v)}
          />

          {/* NAME */}
          <Field
            label="Plan Name"
            value={form.name}
            onChange={v => update("name", v)}
          />

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs text-gray-400">Description</label>
            <textarea
              value={form.description}
              onChange={e => update("description", e.target.value)}
              rows={2}
              className="mt-1 w-full bg-[#1F1F1F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Price (₹)"
              type="number"
              value={form.price}
              onChange={v => update("price", v)}
            />
            <Field
              label="Validity (days)"
              type="number"
              value={form.validityDays}
              onChange={v => update("validityDays", v)}
            />
            <Field
              label="Daily Download Limit"
              type="number"
              value={form.dailyDownloadLimit}
              onChange={v => update("dailyDownloadLimit", v)}
            />
            <Field
              label="Sort Order"
              type="number"
              value={form.sortOrder}
              onChange={v => update("sortOrder", v)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="
              px-5 py-2
              rounded-lg
              bg-blue-600 hover:bg-blue-500
              text-sm font-semibold text-white
            "
          >
            Create Plan
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Small reusable input */
function Field({ label, hint, type = "text", value, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="
          mt-1 w-full
          bg-[#1F1F1F]
          border border-white/10
          rounded-lg
          px-3 py-2
          text-sm text-white
        "
      />
      {hint && (
        <p className="text-[11px] text-gray-500 mt-1">
          {hint}
        </p>
      )}
    </div>
  );
}
