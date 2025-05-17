// pages/checkOut/checkOut.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import CheckoutHeader from "./components/CheckoutHeader";
import ReceiverInfoForm from "./components/ReceiverInfoForm";
import OrderSummary from "./components/OrderSummary";
import OrderNotes from "./components/OrderNotes";
import DeliveryTimeSelector from "./components/DeliveryTimeSelector";
import PaymentDetails from "./components/PaymentDetails";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receiverInfo, setReceiverInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [orderNotes, setOrderNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState({
    hours: "00",
    minutes: "00",
  });
  const [downPaymentPercent, setDownPaymentPercent] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Calculate derived values
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const downPaymentAmount = Math.round(subtotal * (downPaymentPercent / 100));
  const remainingPayment = subtotal - downPaymentAmount;

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/auth");
          return;
        }

        const token = await user.getIdToken();
        const response = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch cart");
        const data = await response.json();
        if (data.length === 0) {
          navigate("/cart");
          return;
        }
        setCartItems(data);
      } catch (error) {
        setError("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [navigate]);

  // Order creation
  const handleCreateOrder = async () => {
    // Validation
    if (!receiverInfo.name || !receiverInfo.phone || !receiverInfo.address) {
      setError("Please fill in all receiver information");
      return;
    }
    if (!selectedDate) {
      setError("Please select a delivery date");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/auth");
        return;
      }

      const token = await user.getIdToken();
      const orderData = {
        receiverInfo,
        deliveryInfo: {
          date: selectedDate ? selectedDate.toISOString() : null,
          time: `${selectedTime.hours}:${selectedTime.minutes}`,
          notes: orderNotes,
        },
        paymentInfo: {
          downPaymentPercent,
          downPaymentAmount,
          subtotal,
        },
        items: cartItems,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const orderResponse = await response.json();
      navigate(`/payment/${orderResponse.orderId}`);
    } catch (error) {
      setError(error.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl bg-white shadow-md rounded-lg">
      <CheckoutHeader onCancel={() => navigate("/cart")} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Left Column */}
        <div className="w-full lg:w-3/5 p-4">
          <ReceiverInfoForm
            receiverInfo={receiverInfo}
            setReceiverInfo={setReceiverInfo}
          />
          <OrderSummary items={cartItems} />
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-2/5 p-4 lg:border-l border-slate-300">
          <div className="space-y-4">
            <OrderNotes notes={orderNotes} onChange={setOrderNotes} />
            <DeliveryTimeSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
            <PaymentDetails
              subtotal={subtotal}
              downPaymentPercent={downPaymentPercent}
              setDownPaymentPercent={setDownPaymentPercent}
              downPaymentAmount={downPaymentAmount}
              remainingPayment={remainingPayment}
            />
          </div>
        </div>
      </div>

      {/* Order Button */}
      <div className="p-4">
        <button
          onClick={handleCreateOrder}
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg text-white text-xl font-bold
            ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"}`}
        >
          {isSubmitting ? "Processing..." : "Buat Pesanan"}
        </button>
      </div>
    </div>
  );
}
