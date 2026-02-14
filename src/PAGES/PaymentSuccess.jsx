import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../HELPERS/axiosInstance";
import { showToast } from "../HELPERS/Toaster";
import { CheckCircle, Sparkles, Download } from "lucide-react";
import { useDispatch } from "react-redux";
import { getProfile } from "../REDUX/Slices/authslice";
import { trackPaywallEvent } from "../REDUX/Slices/paywallTrackingSlice";

export default function PaymentSuccess() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const orderId = params.get("order_id");
    const dispatch = useDispatch();
    const [status, setStatus] = useState("VERIFYING");
    // VERIFYING | SUCCESS | FAILED

    useEffect(() => {
        if (!orderId) {
            showToast.error("Invalid payment reference");
            navigate("/");
            return;
        }

        let attempts = 0;
        const MAX_ATTEMPTS = 6;

        const verifyPayment = async () => {
            try {
                const res = await axiosInstance.get(`/payments/status/${orderId}`);
                const paymentStatus = res.data.status;

                if (paymentStatus === "SUCCESS") {
                    const noteId = sessionStorage.getItem("lastPaywallNoteId");

                    dispatch(trackPaywallEvent({
                        eventType: "PAYMENT_SUCCESS",
                        noteId: noteId || null
                    }));

                    sessionStorage.removeItem("lastPaywallNoteId");
                    setStatus("SUCCESS");

                    // 🔁 REFRESH USER PROFILE FROM SERVER
                    await dispatch(getProfile()).unwrap();

                    showToast.success("Payment successful 🎉");
                }
                else if (paymentStatus === "FAILED") {
                    setStatus("FAILED");
                    showToast.error("Payment failed ❌");
                    navigate("/support");
                } else {
                    attempts++;
                    if (attempts < MAX_ATTEMPTS) {
                        setTimeout(verifyPayment, 2000);
                    } else {
                        showToast.error("Payment verification timed out");
                        navigate("/");
                    }
                }
            } catch {
                showToast.error("Unable to verify payment");
                navigate("/");
            }
        };

        verifyPayment();
    }, [orderId, navigate]);

    // 🟡 Loading / verifying
    if (status === "VERIFYING") {
        return <PaymentVerifyingLoader />;
    }

    // 🟢 Success UI
    if (status === "SUCCESS") {
        return <PaymentThankYou onContinue={() => navigate("/downloads")} />;
    }

    return null;
}
function PaymentVerifyingLoader() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0F0F0F]">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-500 border-t-transparent mb-6" />
            <p className="text-lg font-semibold">Confirming your support…</p>
            <p className="text-sm text-slate-400 mt-1">
                This usually takes just a few seconds
            </p>
        </div>
    );
}
function PaymentThankYou({ onContinue }) {
    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">

                <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto animate-scale-in" />

                <h1 className="text-2xl font-bold">
                    Thank you for supporting <span className="text-indigo-400">AcademicArk</span> 💙
                </h1>

                <p className="text-slate-400 text-sm">
                    Your support helps keep quality study material accessible for every student who needs it.
                </p>

                <PerksList />

                <button
                    onClick={onContinue}
                    className="
            w-full mt-4
            flex items-center justify-center gap-2
            px-4 py-3
            rounded-xl
            bg-indigo-600 hover:bg-indigo-500
            font-semibold
            transition
          "
                >
                    <Download className="w-4 h-4" />
                    Start downloading
                </button>
            </div>
        </div>
    );
}
function PerksList() {
    const perks = [
        "Full access to all notes & PDFs",
        "Unlimited downloads (fair usage)",
        "No interruptions during exam preparation",
        "Priority access to new notes & PYQs",
        "Support independent student creators",
        "Faster and smoother site experience"
    ];

    return (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-left space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                Your perks unlocked
            </div>

            <ul className="space-y-2 text-sm text-slate-300">
                {perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        {perk}
                    </li>
                ))}
            </ul>
        </div>
    );
}
