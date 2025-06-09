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
      setError("Silakan lengkapi informasi penerima");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!selectedDate) {
      setError("Silakan pilih tanggal pengiriman");
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        },
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          imageUrl: item.imageUrl,
          kemasan: item.kemasan,
          price: item.price,
          quantity: item.quantity,
        })),
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
        throw new Error(errorData.error || "Gagal membuat pesanan");
      }

      const orderResponse = await response.json();
      navigate(`/payment/${orderResponse.orderId}`);
    } catch (error) {
      setError(error.message || "Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">
            Mempersiapkan checkout...
          </div>
          <p className="text-gray-500 mt-2">
            Mohon tunggu sebentar sementara kami menyiapkan detail pesanan Anda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl bg-white shadow-lg rounded-lg my-8 overflow-hidden border border-gray-100">
      <CheckoutHeader onCancel={() => navigate("/cart")} />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mx-4 mb-4 rounded-md flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 flex-shrink-0 text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Left Column */}
        <div className="w-full lg:w-3/5 p-6 space-y-6">
          <ReceiverInfoForm
            receiverInfo={receiverInfo}
            setReceiverInfo={setReceiverInfo}
          />

          <OrderSummary items={cartItems} />
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-2/5 p-6 bg-gray-50 lg:bg-white lg:border-l border-slate-200 space-y-6">
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

      {/* Order Button */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleCreateOrder}
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg text-white text-xl font-bold flex items-center justify-center transition-all duration-200
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 hover:shadow-md"
            }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memproses...
            </>
          ) : (
            <>
              Buat Pesanan
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
