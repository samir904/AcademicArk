
import { BookOpen, Star } from "lucide-react";
import { useEffect } from "react";

export default function DefaultPresetToast({ show, onClose }) {
    useEffect(() => {
        if (!show) return;

        // ⏱ auto close
        const timer = setTimeout(onClose, 2600);

        // 📱 haptic feedback (mobile)
        if (navigator.vibrate) {
            navigator.vibrate(15);
        }

        return () => clearTimeout(timer);
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div
            className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        z-50 w-full max-w-sm px-4
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
                <Star className="w-5 h-5 text-yellow-400 mt-0.5" />

                <div>
                    <p className="text-sm font-semibold text-white">
                        Default preset applied
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5 leading-snug flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#9CA3AF]" />
                        Focus on studying
                    </p>
                </div>
            </div>
        </div>
    );
}
