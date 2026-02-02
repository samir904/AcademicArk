import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPlansAdmin } from "../../../REDUX/Slices/planSlice";
import { useEffect } from "react";
import CreatePlanModal from "./CreatePlanModal";
import PlanCard from "./PlanCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { updatePlan } from "../../../REDUX/Slices/planSlice";

export default function AdminPlans() {
  const dispatch = useDispatch();

  const {
    adminPlans = [],
    adminLoading
  } = useSelector(state => state.plans || {});

  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPlansAdmin());
  }, [dispatch]);

  const sortedPlans = [...adminPlans].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Plans</h2>
          <p className="text-sm text-gray-400">
            Control pricing, limits, and availability
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold"
        >
          + Create Plan
        </button>
      </div>

      {/* PLANS LIST */}
      {adminLoading ? (
        <p className="text-gray-400">Loading plans…</p>
      ) : sortedPlans.length === 0 ? (
        <p className="text-gray-500 text-sm">No plans found</p>
      ) : (
        <DragDropContext
  onDragEnd={(result) => {
  if (!result.destination) return;

  const items = Array.from(adminPlans);
  const [moved] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, moved);

  // optimistic UI update
  items.forEach((plan, index) => {
    dispatch(updatePlan({
      id: plan._id,
      updates: { sortOrder: index + 1 }
    }));
  });
}}

>
  <Droppable droppableId="plans">
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="flex flex-col gap-4"
      >
        {sortedPlans.map((plan, index) => (
          <Draggable
            key={plan._id}
            draggableId={plan._id}
            index={index}
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
              >
                <PlanCard
                  plan={plan}
                  dragHandleProps={provided.dragHandleProps}
                />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>

      )}

      {showCreate && (
        <CreatePlanModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
