import React from "react";
import PlanCard from "./PlanCard";
import { X } from "lucide-react";

export default function SoftPaywallModal({
  open,
  onClose,
  plans = [],
  onSelectPlan,
  downloadsToday = 3,
  dailyLimit = 3
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-[#0F0F0F] border border-[#2F2F2F] shadow-xl">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#1F1F1F]">
          <div>
            <h2 className="text-xl font-semibold text-white">
              📘 You’ve reached today’s limit
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              You’ve downloaded {downloadsToday} notes today.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-300">
            AcademicArk is kept free for browsing.  
            Supporting it helps us keep notes high-quality and up-to-date.
          </p>

          {/* Plans */}
          <div className="grid gap-4">
            {plans.map((plan, index) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                highlight={index === 0}
                onSelect={onSelectPlan}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#1F1F1F] flex justify-center">
          <button
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
