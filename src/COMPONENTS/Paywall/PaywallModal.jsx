import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closePaywall } from "../../REDUX/Slices/paywallSlice";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackPaywallEvent } from "../../REDUX/Slices/paywallTrackingSlice";
import { useRef } from "react";
export default function PaywallModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isOpen, reason,noteId  } = useSelector(state => state.paywall);

  const isLimit = reason === "LIMIT_REACHED";
  const isExpired = reason === "PLAN_EXPIRED";
  const isLocked = reason === "LOCKED_NOTE" || reason === "PREVIEW_ENDED";
const hasTrackedRef = useRef(false);

useEffect(() => {
  if (isOpen && !hasTrackedRef.current) {
    dispatch(trackPaywallEvent({
      eventType: "PAYWALL_SHOWN",
      noteId
    }));
    hasTrackedRef.current = true;
  }

  if (!isOpen) {
    hasTrackedRef.current = false;
  }
}, [isOpen,noteId,dispatch]);

if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl max-w-md w-full p-6 relative">

        {/* Close */}
        <button
          onClick={() => {
  dispatch(trackPaywallEvent({
    eventType: "PAYWALL_DISMISSED",
    noteId
  }));

  dispatch(closePaywall());
}}
          className="absolute top-4 right-4 p-2 hover:bg-neutral-900 rounded-lg"
        >
          <X className="w-5 h-5 text-neutral-400" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 mx-auto rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
          <Sparkles className="w-7 h-7 text-indigo-400" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white text-center">
  {isLimit && "You've reached today’s free limit"}
  {isExpired && "Your unlimited access has ended"}
  {isLocked && "This is a premium note"}
</h2>
        {/* Subtitle */}
        <p className="text-sm text-slate-400 text-center mt-2">
  {isLimit && "Free access resets tomorrow."}
  {isExpired && "Renew to continue full access."}
  {isLocked && "Preview is available. Full access requires support."}
</p>
        {/* Perks */}
        <div className="mt-5 bg-[#151515] border border-[#2A2A2A] rounded-xl p-4 space-y-2 text-sm text-slate-300">
  <p>✓ Full PDF access</p>
  <p>✓ Unlimited downloads</p>
  <p>✓ No interruptions during exams</p>
</div>
<div className="mt-4 text-center text-sm text-indigo-400 font-medium space-y-1">
  <p>₹29 • 14 Days Access</p>
  <p>₹59 • Full Semester (120 Days)</p>
</div>

        {/* CTA */}
        <button
  onClick={() => {
    dispatch(closePaywall());
    dispatch(trackPaywallEvent({
  eventType: "SUPPORT_CLICKED",
  noteId
}));
    navigate("/support", {
  state: { noteId }
});
  }}
  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-full py-3 font-semibold flex items-center justify-center gap-2"
>
  Unlock full access
  <ArrowRight className="w-4 h-4" />
</button>

        {/* Footer */}
        {/* <p className="text-xs text-slate-500 text-center mt-3">
          Fair usage helps keep AcademicArk accessible for everyone.
        </p> */}
      </div>
    </div>
  );
}
