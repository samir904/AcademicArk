import { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePlan } from "../../../REDUX/Slices/planSlice";

export default function EditPlanModal({ plan, onClose }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    price: plan.price,
    description: plan.description,
    validityDays: plan.validityDays,
    dailyDownloadLimit: plan.dailyDownloadLimit
  });

  const submit = () => {
    dispatch(updatePlan({
      id: plan._id,
      updates: form
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0F0F0F] w-full max-w-md rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Edit {plan.name}
        </h3>

        {[
          ["Price", "price"],
          ["Validity (days)", "validityDays"],
          ["Daily limit", "dailyDownloadLimit"]
        ].map(([label, key]) => (
          <div key={key}>
            <label className="text-xs text-gray-400">{label}</label>
            <input
              type="number"
              value={form[key]}
              onChange={e =>
                setForm({ ...form, [key]: Number(e.target.value) })
              }
              className="w-full mt-1 bg-[#1F1F1F] border border-white/10 rounded px-3 py-2 text-sm"
            />
          </div>
        ))}

        <div>
          <label className="text-xs text-gray-400">Description</label>
          <textarea
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })}
            className="w-full mt-1 bg-[#1F1F1F] border border-white/10 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="text-gray-400 text-sm">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
