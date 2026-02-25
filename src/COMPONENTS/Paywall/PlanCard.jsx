import React from "react";
import { CheckCircle, ArrowRight, Check } from "lucide-react";

export default function PlanCard({
  plan,
  onSelect,
  highlight = false,
  userAccess,
  paying = false,        // ✅ NEW — passed from parent during payment
}) {

  const isActivePlan =
    String(userAccess?.plan) === String(plan._id) &&
    new Date(userAccess?.expiresAt) > new Date();

  // ✅ NEW — single source of truth for disabled state
  const isDisabled = isActivePlan || paying;

  const expiryText = userAccess?.expiresAt
    ? new Date(userAccess.expiresAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : null;

  // ✅ NEW — added "Processing..." state
  let ctaText = "Unlock Access";
  if (isActivePlan)  ctaText = "Currently Active";
  else if (paying)   ctaText = "Processing...";       // ✅ NEW
  else if (highlight) ctaText = "Unlock Full Access";

  const rawPerDay = plan.price / plan.validityDays;
  const perDayPrice = rawPerDay < 1
    ? rawPerDay.toFixed(2)
    : Math.round(rawPerDay);

  return (
    <div
      className={`
        relative rounded-2xl border p-6 transition-all
        ${isActivePlan
          ? "border-emerald-500 bg-emerald-500/10"
          : highlight
          ? "border-indigo-500 bg-indigo-500/10 shadow-lg"
          : "border-[#2F2F2F] bg-[#141414] hover:border-indigo-400/60"}
      `}
    >
      {/* BADGES */}
      {highlight && !isActivePlan && (
        <div className="absolute -top-3 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500 text-white">
          Recommended
        </div>
      )}
      {isActivePlan && (
        <div className="absolute -top-3 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500 text-black">
          Active
        </div>
      )}

      {/* PLAN NAME */}
      <h3 className="text-lg font-semibold text-white">
        {plan.name}
      </h3>

      {/* PRICE */}
      {/* ✅ FIX — removed <br/> inside flex, per-day moved outside flex row */}
      <div className="mt-2">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-white">
            ₹{plan.price}
          </span>
          <span className="text-sm text-slate-400">
            / {plan.validityDays} days
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          ( Only ₹{perDayPrice} per day )
        </p>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-3 text-sm text-indigo-300">
        {plan.description}
      </p>

      {/* FEATURES */}
      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        <li className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Full access to all notes & PDFs
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Unlimited downloads
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Early access to new notes & PYQs
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Keep AcademicArk independent & ad-free
        </li>
      </ul>

      {/* VALIDITY INFO */}
      {isActivePlan && expiryText && (
        <p className="mt-4 text-xs text-emerald-400">
          Valid till {expiryText}
        </p>
      )}

      {/* CTA BUTTON */}
      <button
        disabled={isDisabled}                           // ✅ blocks active + paying
        onClick={() => !isDisabled && onSelect(plan)}  // ✅ double guard
        className={`
          mt-6 w-full flex items-center justify-center gap-2
          px-5 py-3 rounded-full font-semibold text-sm
          transition-all
          ${isActivePlan
            ? "bg-emerald-600/40 text-emerald-200 cursor-not-allowed"
            : paying
            ? "bg-indigo-500/50 text-white cursor-not-allowed opacity-70"  // ✅ NEW
            : highlight
            ? "bg-indigo-500 hover:bg-indigo-400 text-white"
            : "bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white border border-[#2F2F2F]"}
        `}
      >
        {isActivePlan ? (
          <>
            <Check className="w-4 h-4" />
            Active Plan
          </>
        ) : paying ? (
          // ✅ NEW — spinner while processing
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {ctaText}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
