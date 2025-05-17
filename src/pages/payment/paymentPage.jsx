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
        <div className="text-xl font-semibold text-gray-700">
          Loading payment information...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl bg-white shadow-md min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="bg-green-700 w-full py-6 px-8 rounded-b-2xl border-2 border-t-0 border-zinc-300 mb-10">
        <div className="flex items-center justify-between">
          <div className="w-48 h-16 border border-black/20"></div>
          <h1 className="text-white text-4xl font-semibold font-poppins">
            Pembayaran
          </h1>
          <div className="w-48 h-16"></div> {/* Placeholder for symmetry */}
        </div>
      </header>

      {/* Order Summary Box */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 mb-12">
        <div className="bg-zinc-300 rounded-2xl p-4 mb-6">
          <p className="text-center text-stone-950 text-2xl font-medium font-poppins">
            No. Pemesan: {orderId || "XSDF26032025002"}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500 p-4 flex items-center justify-between">
          <span className="text-stone-950 text-2xl font-medium font-poppins">
            Uang Muka:
          </span>
          <span className="text-stone-950 text-3xl font-bold font-poppins">
            {order?.downPaymentAmount
              ? `Rp${order.downPaymentAmount.toLocaleString("id-ID")},-`
              : "Rp16.500,-"}
          </span>
        </div>
      </div>

      {/* Payment Information */}
      <h2 className="text-black text-5xl font-semibold font-poppins mb-8">
        Transfer BCA
      </h2>

      <div className="mb-4">
        <h3 className="text-center text-black text-3xl font-semibold font-poppins mb-4">
          No. Rekening:
        </h3>

        <div className="flex items-center justify-center gap-4">
          <div className="bg-green-700 rounded-2xl p-4">
            <p className="text-zinc-100 text-5xl font-semibold font-poppins">
              5410 4257 87
            </p>
          </div>

          <button className="bg-green-700 rounded-2xl w-24 h-24 flex items-center justify-center">
            <div className="w-14 h-14 relative">
              <div className="absolute w-9 h-9 left-1 top-5 bg-zinc-100"></div>
              <div className="absolute w-9 h-9 left-5 top-1 bg-zinc-100"></div>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-zinc-300 rounded-2xl p-4 mb-12">
        <p className="text-center text-stone-500 text-2xl font-semibold font-poppins">
          a/n Kedai Malika
        </p>
      </div>

      {/* Instructions */}
      <div className="max-w-2xl text-justify mb-8">
        <p className="text-black text-xl font-normal font-poppins">
          Lakukan pembayaran Uang Muka dengan nominal yang sudah tertera di
          kotak berwarna oranye. Perhatikan nomor rekening dan nama pemilik.
          Selalu periksa dengan teliti sebelum melakukan pembayaran!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center w-full max-w-2xl gap-4 mb-6">
        <button
          onClick={handlePayLater}
          className="w-full max-w-xl py-4 bg-zinc-300 rounded-2xl text-stone-950 text-3xl font-normal font-poppins"
        >
          Bayar Nanti
        </button>

        <button
          onClick={handleCheckPaymentStatus}
          className="w-full max-w-xl py-4 bg-amber-500 rounded-2xl text-white text-3xl font-bold font-poppins"
        >
          Cek Status Pembayaran
        </button>
      </div>

      {/* Contact Info */}
      <div className="text-center mb-6">
        <p className="text-black text-xl font-normal font-poppins">
          Hubungi admin{" "}
          <span className="font-semibold underline">0822-5737-4357</span> jika
          mengalami kendala.
        </p>
      </div>
    </div>
  );
}
