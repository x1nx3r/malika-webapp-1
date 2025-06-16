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
      <div className="flex items-center justify-center min-h-screen">
        <CheckoutHeader onCancel={() => navigate("/cart")} />
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
    <div className="w-full min-h-screen overflow-hidden px-20">
      <CheckoutHeader onCancel={() => navigate("/cart")} />
      
      <div className="flex flex-col lg:flex-row px-24 mt-16">
        {/* Left Column */}
        <div className="w-2/3 space-y-6">
          <ReceiverInfoForm
            receiverInfo={receiverInfo}
            setReceiverInfo={setReceiverInfo}
          />

          <OrderSummary items={cartItems} />
        </div>

        {/* Right Column */}
        <div className="w-1/3 lg:border-l border-gray-200">
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
      <div className="p-6">
        <button
          onClick={handleCreateOrder}
          disabled={isSubmitting}
          className={`w-full py-4 rounded-2xl text-white text-xl font-poppins font-semibold flex items-center justify-center transition-all duration-200 ease-in
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-400 hover:bg-orange-500 cursor-pointer"
            }`}
        >
          {isSubmitting ? (
            <>
              Memproses...
            </>
          ) : (
            <>
              Buat Pesanan
            </>
          )}
        </button>
      </div>
    </div>
  );
}
