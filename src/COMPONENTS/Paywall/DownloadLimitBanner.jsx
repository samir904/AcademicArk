import { Info, AlertTriangle, X, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DownloadLimitBanner({ quota, onClose }) {
  const navigate = useNavigate();
  if (!quota) return null;

  const isLimitReached = quota.remaining <= 0;
  const getTimeUntilReset = () => {
    const now = new Date();
    const reset = new Date();
    reset.setHours(24, 0, 0, 0); // next midnight

    const diffMs = reset - now;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m`;
  };
  const timeLeft = getTimeUntilReset();

  return (
    <div
      className={`
        flex items-start justify-between gap-3
        rounded-lg border px-3.5 py-2.5
        text-xs shadow-sm
        ${isLimitReached
          ? "border-amber-500/20 bg-[#1A1408] text-amber-300"
          : "border-indigo-500/20 bg-[#0E1224] text-indigo-300"
        }
      `}
    >
      {/* LEFT */}
      <div className="flex items-start gap-2">
        {isLimitReached ? (
          <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
        ) : (
          <Info className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
        )}

        <div className="leading-snug">
          {!isLimitReached ? (
            <>
              <div className="font-medium">
                {quota.remaining} free downloads left today
              </div>

              <div className="text-[11px] text-indigo-400/60">
                Resets in {timeLeft}
              </div>

              <span
                onClick={() => navigate("/support")}
                className="
    mt-0.5 inline-flex items-center gap-1
    text-[11px] font-medium
    text-indigo-300 hover:text-indigo-200
    cursor-pointer
  "
              >
                Unlock unlimited access
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </>
          ) : (
            <>
              <div className="font-medium">
  Free limit reached for today
</div>

<div className="text-[11px] text-amber-400/70">
  Next reset in {timeLeft}
</div>

<span
  onClick={() => navigate("/support")}
  className="
    mt-0.5 inline-flex items-center gap-1
    text-[11px] font-semibold
    text-amber-300 hover:text-amber-200
    cursor-pointer
  "
>
  Continue without limits • ₹29 
  <ArrowUpRight className="w-3.5 h-3.5" />
</span>
            </>
          )}
        </div>
      </div>

      {/* CLOSE */}
      <button
        onClick={onClose}
        className="
          p-1 rounded-md
          text-neutral-400 hover:text-white
          hover:bg-white/5
          transition-colors
        "
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
