import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentStatus } from "../REDUX/Slices/paymentSlice";

export default function PaymentStatus() {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderId = params.get("order_id");
  const { paymentStatus } = useSelector(state => state.payment);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchPaymentStatus({ orderId }));
    }
  }, [orderId, dispatch]);

  useEffect(() => {
    if (paymentStatus === "SUCCESS") {
      navigate("/support?success=true");
    }
    if (paymentStatus === "FAILED") {
      navigate("/support?failed=true");
    }
  }, [paymentStatus, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Verifying payment…
    </div>
  );
}
