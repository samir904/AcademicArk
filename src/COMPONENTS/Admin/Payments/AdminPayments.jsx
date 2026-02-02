import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPaymentsAdmin } from "../../../REDUX/Slices/paymentSlice";
import { Filter } from "lucide-react";

export default function AdminPayments() {
  const dispatch = useDispatch();
  const {
    payments = [],
    pagination,
    adminLoading
  } = useSelector(state => state.payment);

  const [status, setStatus] = useState("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
const [page, setPage] = useState(1);
useEffect(() => {
  dispatch(
    fetchAllPaymentsAdmin({
      page,
      limit: 20,
      from,
      to,
      status
    })
  );
}, [dispatch, page, from, to, status]);

  useEffect(() => {
    dispatch(fetchAllPaymentsAdmin({ from, to, status }));
  }, [dispatch, from, to, status]);
useEffect(() => {
  setPage(1);
}, [from, to, status]);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Payments
        </h2>

        {/* FILTERS */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="filter-input"
          />
          <input
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
            className="filter-input"
          />

          <Filter size={14} className="text-gray-400" />

          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="filter-input"
          >
            <option value="ALL">All</option>
            <option value="SUCCESS">Success</option>
            <option value="CREATED">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Plan</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {adminLoading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Loading payments…
                </td>
              </tr>
            )}

            {!adminLoading && payments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            )}

            {!adminLoading &&
              payments.map(p => (
                <tr
                  key={p._id}
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">
                      {p.user?.fullName}
                    </div>
                    <div className="text-xs text-gray-400">
                      {p.user?.email}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {p.planType}
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    ₹{p.amount}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>

                  <td className="px-4 py-3 text-gray-400">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* PAGINATION CONTROLS */}
{pagination && pagination.totalPages > 1 && (
  <div className="flex items-center justify-between text-sm text-gray-400">
    <span>
      Showing page {pagination.page} of {pagination.totalPages}
    </span>

    <div className="flex items-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => setPage(p => Math.max(1, p - 1))}
        className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-40"
      >
        Prev
      </button>

      <button
        disabled={page === pagination.totalPages}
        onClick={() =>
          setPage(p => Math.min(pagination.totalPages, p + 1))
        }
        className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  </div>
)}


      {/* PAGINATION (READY) */}
      {pagination && (
        <p className="text-xs text-gray-500">
          Page {pagination.page} of {pagination.totalPages} ·
          Total {pagination.total} payments
        </p>
      )}
    </div>
  );
}

/* ======================
   STATUS BADGE
====================== */
function StatusBadge({ status }) {
  const styles = {
    SUCCESS: "bg-emerald-500/10 text-emerald-400",
    FAILED: "bg-red-500/10 text-red-400",
    CREATED: "bg-amber-500/10 text-amber-400"
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
