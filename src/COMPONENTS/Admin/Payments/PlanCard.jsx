import { useState } from "react";
import { useDispatch } from "react-redux";
import { GripVertical, Users } from "lucide-react";
import { togglePlanStatus } from "../../../REDUX/Slices/planSlice";
import EditPlanModal from "./EditPlanModal";

export default function PlanCard({ plan, dragHandleProps }) {
  const dispatch = useDispatch();
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div
      className="
        bg-[#0F0F0F]
        border border-white/10
        rounded-xl p-5
        space-y-4
        hover:border-white/20
        transition
      "
    >
      {/* HEADER */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-start gap-3">
          {/* DRAG HANDLE */}
          <div
            {...dragHandleProps}
            className="mt-1 text-gray-500 hover:text-white cursor-grab"
            title="Reorder plan"
          >
            <GripVertical size={16} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              {plan.name}
            </h3>
            <p className="text-xs text-gray-400 max-w-xs">
              {plan.description}
            </p>
          </div>
        </div>

        {/* ACTIVE TOGGLE */}
        <button
          onClick={() => dispatch(togglePlanStatus(plan._id))}
          className={`
            px-3 py-1 rounded-full text-xs font-semibold
            transition
            ${plan.isActive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"}
          `}
        >
          {plan.isActive ? "Active" : "Inactive"}
        </button>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Price</span>
          <p className="text-white font-medium">₹{plan.price}</p>
        </div>

        <div>
          <span className="text-gray-400">Validity</span>
          <p className="text-white">{plan.validityDays} days</p>
        </div>

        <div>
          <span className="text-gray-400">Daily limit</span>
          <p className="text-white">
            {plan.dailyDownloadLimit >= 9999 ? "Unlimited" : plan.dailyDownloadLimit}
          </p>
        </div>

        <div>
          <span className="text-gray-400">Plan code</span>
          <p className="text-white text-xs">{plan.code}</p>
        </div>
      </div>

      {/* STATS (OPTIONAL, READY) */}
      {typeof plan.activeUsers === "number" && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Users size={14} />
          <span>{plan.activeUsers} active users</span>
        </div>
      )}

      {/* ACTION */}
      <div className="pt-2">
        <button
          onClick={() => setShowEdit(true)}
          className="text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          Edit plan →
        </button>
      </div>

      {showEdit && (
        <EditPlanModal
          plan={plan}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
