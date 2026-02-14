import React, { useEffect } from "react";
import PageTransition from "../COMPONENTS/PageTransition";
import SupportHeader from "../COMPONENTS/Support/SupportHeader";
import PlanList from "../COMPONENTS/Support/PlanList";
import FAQSection from "../COMPONENTS/Support/FAQSection";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
  createPaymentOrder,
  resetPaymentState
} from "../REDUX/Slices/paymentSlice";
import { fetchActivePlans } from "../REDUX/Slices/planSlice";
import { getCashfree } from "../UTILS/cashfree";
import { trackPaywallEvent } from "../REDUX/Slices/paywallTrackingSlice";

export default function SupportPage() {
  const dispatch = useDispatch();

  const { activePlans, loading } = useSelector(state => state.plans);
  const userAccess = useSelector(state => state.auth?.data?.access);
  const { paymentSessionId } = useSelector(state => state.payment);


  const location = useLocation();
  const sourceNoteId = location.state?.noteId || null;

  // 🔹 Fetch plans once
  useEffect(() => {
    dispatch(fetchActivePlans());
  }, [dispatch]);

  // 🔹 Open Cashfree checkout (OFFICIAL WAY)
  useEffect(() => {
    if (!paymentSessionId) return;

    const openCheckout = async () => {
      const cashfree = await getCashfree();

      if (!cashfree) {
        console.error("❌ Cashfree SDK failed to load");
        return;
      }

      cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self", // redirect checkout
      });

      // 🧹 clear redux to avoid repeat trigger
      dispatch(resetPaymentState());
    };

    openCheckout();
  }, [paymentSessionId, dispatch]);
  useEffect(() => {
    dispatch(trackPaywallEvent({
      eventType: "SUPPORT_VIEWED",
      noteId: sourceNoteId
    }));
  }, [dispatch]);
  useEffect(() => {
    return () => {
      // Only track dismissal if user did NOT start payment
      if (!paymentSessionId) {
        dispatch(trackPaywallEvent({
          eventType: "SUPPORT_DISMISSED",
          noteId: sourceNoteId
        }));
      }
    };
  }, [paymentSessionId, dispatch]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0F0F0F] text-white pt-28 pb-20 px-4">
        <SupportHeader />

        {!loading && (
          <PlanList
            plans={activePlans}
            userAccess={userAccess}
            onSelect={(plan) => {
              if (sourceNoteId) {
                sessionStorage.setItem("lastPaywallNoteId", sourceNoteId);
              }
              dispatch(trackPaywallEvent({
                eventType: "PAYMENT_STARTED",
                noteId: sourceNoteId
              }));

              dispatch(createPaymentOrder({ planId: plan._id }));
            }}
          />
        )}

        <FAQSection />
      </div>
    </PageTransition>
  );
}
