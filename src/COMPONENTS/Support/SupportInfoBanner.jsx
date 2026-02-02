import { X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SupportInfoBanner({ onDismiss }) {
  const navigate = useNavigate();

  return (
    <div
      className="
        fixed bottom-6 left-4 right-4
sm:left-auto sm:right-6 sm:max-w-md

        z-50
        animate-slide-up-fade
        sm:shadow-2xl sm:rounded-2xl

      "
    >
      <div
        className="
          relative
          bg-[#0F172A]
          border border-indigo-500/20
          rounded-xl
          p-4
          shadow-xl
        "
      >
        {/* Close */}
        <button
          onClick={onDismiss}
          className="
            absolute top-3 right-3
            text-slate-400 hover:text-white
          "
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="space-y-1 pr-6">
          <p className="text-sm font-semibold text-white">
            Support AcademicArk ❤️
          </p>

          <p className="text-xs text-slate-400 leading-relaxed">
            Free downloads are limited per day.  
            Support plans give unlimited access & help us keep notes free for everyone.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/support")}
            className="
              inline-flex items-center gap-1.5
              text-xs font-medium
              text-indigo-400 hover:text-indigo-300
            "
          >
            View support plans
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onDismiss}
            className="text-xs text-slate-500 hover:text-slate-300"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
