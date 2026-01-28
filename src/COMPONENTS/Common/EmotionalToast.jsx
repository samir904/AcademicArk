
import { CheckCircle, Save } from "lucide-react";
import { useEffect } from "react";

export default function EmotionalToast({ show, onClose }) {
    useEffect(() => {
        if (!show) return;

        const timer = setTimeout(() => {
            onClose();
        }, 2800); // ⏱ auto hide

        return () => clearTimeout(timer);
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div
            className="
        fixed
        bottom-6
        left-1/2
        -translate-x-1/2
        z-50
        px-4
        w-full
        max-w-sm
      "
        >
            <div
                className="
          flex items-start gap-3
          bg-[#0F0F0F]
          border border-[#2F2F2F]
          rounded-xl
          px-4 py-3
          shadow-xl
          animate-slide-up
        "
            >
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />

                <div className="text-left">
                    <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <Save className="w-4 h-4 text-[#9CA3AF]" />
                        Saved
                    </p>

                    <p className="text-xs text-[#9CA3AF] mt-0.5 leading-snug">
                        This will save you time before exams.<br />
                        You’ve got this 💪
                    </p>
                </div>
            </div>
        </div>
    );
}

