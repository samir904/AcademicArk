import { useState } from "react";
import PlanCard from "../Paywall/PlanCard";

export default function PlanList({ plans = [], onSelect, userAccess,creatingOrder }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="max-w-4xl mx-auto mb-20">
      
      {/* 🔁 MOBILE TOGGLE */}
      {plans.length > 1 && (
        <div className="md:hidden mb-6 flex justify-center">
          <div className="flex rounded-full bg-[#111] border border-[#9CA3AF] p-1">
            {plans.map((plan, index) => (
              <button
                key={plan._id}
                onClick={() => setActiveIndex(index)}
                className={`
                  px-4 py-1.5 text-xs font-semibold rounded-full
                  transition-all
                  ${
                    activeIndex === index
                      ? "bg-white text-black"
                      : "text-neutral-400 hover:text-white"
                  }
                `}
              >
                {plan.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🖥️ DESKTOP GRID */}
      <div className="hidden md:grid gap-6 md:grid-cols-2">
        {plans.map((plan, index) => (
          <PlanCard
            key={plan._id}
            plan={plan}
            highlight={index === 0}
            onSelect={onSelect}
            creatingOrder={creatingOrder}
            userAccess={userAccess}
          />
        ))}
      </div>

      {/* 📱 MOBILE SINGLE PLAN VIEW */}
      <div className="md:hidden">
        {plans[activeIndex] && (
          <PlanCard
            plan={plans[activeIndex]}
            highlight={activeIndex === 0}   // 🔥 FIX
            onSelect={onSelect}
            creatingOrder={creatingOrder}
            userAccess={userAccess}
          />
        )}
      </div>
    </div>
  );
}
