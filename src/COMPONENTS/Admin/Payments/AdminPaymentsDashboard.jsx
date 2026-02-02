import { CreditCard, BarChart3, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentStatsAdmin } from "../../../REDUX/Slices/paymentSlice";

// Sub pages (empty for now)
import AdminPayments from "./AdminPayments";
import AdminPlans from "./AdminPlans";
import PaymentStatsCards from "./PaymentStatsCards";

export default function AdminPaymentsDashboard() {
  const [subTab, setSubTab] = useState("overview");
const dispatch = useDispatch();
 useEffect(() => {
   if (subTab === "overview") {
     dispatch(fetchPaymentStatsAdmin());
   }
 }, [subTab, dispatch]);
 const { stats, adminLoading } = useSelector(
   state => state.payment
 );

  const tabs = [
    {
      key: "overview",
      label: "Overview",
      icon: BarChart3
    },
    {
      key: "payments",
      label: "Payments",
      icon: CreditCard
    },
    {
      key: "plans",
      label: "Plans",
      icon: Layers
    }
  ];

  return (
    <div className="space-y-6">
      {/* ───── HEADER ───── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="text-sm text-gray-400">
          Manage subscriptions, payments, and revenue
        </p>
      </div>

      {/* ───── SUB TABS ───── */}
      <div className="border-b border-white/10">
        <div className="flex gap-6">
          {tabs.map(({ key, label, icon: Icon }) => {
            const active = subTab === key;

            return (
              <button
                key={key}
                onClick={() => setSubTab(key)}
                className={`
                  relative pb-3 flex items-center gap-2
                  text-sm font-medium transition-colors
                  ${
                    active
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-white"
                  }
                `}
              >
                <Icon size={16} />
                {label}

                {/* Active underline */}
                {active && (
                  <span className="
                    absolute left-0 -bottom-px
                    w-full h-0.5
                    bg-blue-500 rounded-full
                  " />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ───── TAB CONTENT PLACEHOLDER ───── */}
      <div>
        {subTab === "overview" && (
   <PaymentStatsCards
     summary={stats?.summary}
     loading={adminLoading}
   />
 )}
        {subTab === "payments" && <AdminPayments />}
        {subTab === "plans" && <AdminPlans />}
      </div>
    </div>
  );
}
