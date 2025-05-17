import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/auth");
          return;
        }

        const token = await user.getIdToken();
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch order details");
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Could not load order information");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, navigate]);

  const handleCheckPaymentStatus = async () => {
    // Implementation for checking payment status
    alert("Checking payment status...");
  };

  const handlePayLater = () => {
    navigate("/orders");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-base font-medium text-gray-700">
          Loading payment information...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-base font-medium text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl bg-white shadow-md min-h-screen flex flex-col items-center py-4">
      {/* Header */}
      <header className="bg-green-700 w-full py-3 px-4 rounded-b-lg border border-t-0 border-zinc-300 mb-4">
        <div className="flex items-center justify-between">
          <div className="w-28 h-10 border border-black/20"></div>
          <h1 className="text-white text-2xl font-semibold font-poppins">
            Pembayaran
          </h1>
          <div className="w-28 h-10"></div> {/* Placeholder for symmetry */}
        </div>
      </header>

      {/* Order Summary Box */}
      <div className="w-full max-w-md bg-white rounded-lg shadow p-4 mb-6">
        <div className="bg-zinc-200 rounded-lg p-3 mb-3">
          <p className="text-center text-stone-950 text-lg font-medium font-poppins">
            No. Pemesan: {orderId || "XSDF26032025002"}
          </p>
        </div>

        <div className="rounded-lg border border-amber-500 p-3 flex items-center justify-between">
          <span className="text-stone-950 text-lg font-medium font-poppins">
            Uang Muka:
          </span>
          <span className="text-stone-950 text-xl font-bold font-poppins">
            {order?.paymentInfo?.downPaymentAmount
              ? `Rp${order.paymentInfo.downPaymentAmount.toLocaleString("id-ID")},-`
              : "Rp16.500,-"}
          </span>
        </div>
      </div>

      {/* Payment Information */}
      <h2 className="text-black text-2xl font-semibold font-poppins mb-3">
        Transfer BCA
      </h2>

      <div className="mb-3">
        <h3 className="text-center text-black text-lg font-semibold font-poppins mb-2">
          No. Rekening:
        </h3>

        <div className="flex items-center justify-center gap-2">
          <div className="bg-green-700 rounded-lg p-2">
            <p className="text-zinc-100 text-2xl font-semibold font-poppins">
              5410 4257 87
            </p>
          </div>

          <button className="bg-green-700 rounded-lg w-12 h-12 flex items-center justify-center">
            <div className="w-8 h-8 relative">
              <div className="absolute w-5 h-5 left-0 top-3 bg-zinc-100"></div>
              <div className="absolute w-5 h-5 left-3 top-0 bg-zinc-100"></div>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-zinc-200 rounded-lg p-2 mb-5">
        <p className="text-center text-stone-500 text-base font-medium font-poppins">
          a/n Kedai Malika
        </p>
      </div>

      {/* Instructions */}
      <div className="max-w-lg text-center mb-5 px-4">
        <p className="text-black text-sm font-normal font-poppins">
          Lakukan pembayaran Uang Muka dengan nominal yang sudah tertera di
          kotak berwarna oranye. Perhatikan nomor rekening dan nama pemilik.
          Selalu periksa dengan teliti sebelum melakukan pembayaran!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center w-full px-4 max-w-md gap-2 mb-4">
        <button
          onClick={handlePayLater}
          className="w-full py-2 bg-zinc-200 rounded-lg text-stone-950 text-base font-normal font-poppins"
        >
          Bayar Nanti
        </button>

        <button
          onClick={handleCheckPaymentStatus}
          className="w-full py-2 bg-amber-500 rounded-lg text-white text-base font-bold font-poppins"
        >
          Cek Status Pembayaran
        </button>
      </div>

      {/* Contact Info */}
      <div className="text-center mb-4">
        <p className="text-black text-sm font-normal font-poppins">
          Hubungi admin{" "}
          <span className="font-semibold underline">0822-5737-4357</span> jika
          mengalami kendala.
        </p>
      </div>
    </div>
  );
}
