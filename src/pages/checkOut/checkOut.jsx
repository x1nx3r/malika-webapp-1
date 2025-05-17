import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import DatePicker from "react-datepicker"; // You'll need to install this
import "react-datepicker/dist/react-datepicker.css";

export default function Checkout() {
  // State for cart items
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for form data
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

  // Format currency helper
  const formatCurrency = (amount) => {
    return `Rp${amount.toLocaleString("id-ID")},-`;
  };

  // Fetch cart items on component mount
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

  // Handle input changes
  const handleReceiverInfoChange = (e) => {
    const { name, value } = e.target;
    setReceiverInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Use account info handlers
  const useAccountName = async () => {
    try {
      const user = auth.currentUser;
      if (user && user.displayName) {
        setReceiverInfo((prev) => ({ ...prev, name: user.displayName }));
      }
    } catch (error) {
      console.error("Error getting user name:", error);
    }
  };

  const useAccountPhone = async () => {
    try {
      const user = auth.currentUser;
      if (user && user.phoneNumber) {
        setReceiverInfo((prev) => ({ ...prev, phone: user.phoneNumber }));
      }
    } catch (error) {
      console.error("Error getting user phone:", error);
    }
  };

  // Time change handlers
  const handleHoursChange = (e) => {
    let value = e.target.value;
    // Ensure valid hours (0-23)
    value = Math.min(23, Math.max(0, parseInt(value) || 0))
      .toString()
      .padStart(2, "0");
    setSelectedTime((prev) => ({ ...prev, hours: value }));
  };

  const handleMinutesChange = (e) => {
    let value = e.target.value;
    // Ensure valid minutes (0-59)
    value = Math.min(59, Math.max(0, parseInt(value) || 0))
      .toString()
      .padStart(2, "0");
    setSelectedTime((prev) => ({ ...prev, minutes: value }));
  };

  // Create order function
  const handleCreateOrder = async () => {
    // Validate form data
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

      // Navigate to order confirmation or payment
      navigate(`/payment/${orderResponse.orderId}`);
    } catch (error) {
      setError(error.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <header className="bg-green-700 py-6 px-8 rounded-b-2xl border-2 border-t-0 border-zinc-300">
        <div className="flex items-center justify-between">
          <div className="w-48 h-16 border border-black/20"></div>

          <h1 className="text-white text-4xl font-semibold font-poppins">
            Checkout
          </h1>

          <button
            onClick={handleCancel}
            className="bg-white px-6 py-2 rounded-xl flex items-center"
          >
            <span className="text-stone-950 text-xl font-semibold font-poppins">
              Batalkan
            </span>
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-6 my-4">
          {error}
        </div>
      )}

      <div className="flex flex-wrap">
        {/* Left Column */}
        <div className="w-full lg:w-2/3 p-6">
          {/* Receiver Information */}
          <div className="mb-8 pb-8 border-b border-slate-950/30">
            <h2 className="text-black text-3xl font-semibold font-poppins mb-6">
              Informasi Penerima
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-black text-lg font-medium font-poppins mb-2">
                  Nama Penerima:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="name"
                    value={receiverInfo.name}
                    onChange={handleReceiverInfoChange}
                    className="w-64 h-11 rounded-[10px] border border-slate-950 px-4 py-2 font-poppins"
                    placeholder="Masukkan nama penerima"
                  />
                  <button
                    onClick={useAccountName}
                    className="ml-4 bg-zinc-300 px-2 py-1 rounded-[10px] text-center font-semibold text-sm"
                  >
                    Gunakan
                    <br />
                    Nama Akun
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-black text-lg font-medium font-poppins mb-2">
                  No HP Penerima:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="phone"
                    value={receiverInfo.phone}
                    onChange={handleReceiverInfoChange}
                    className="w-64 h-11 rounded-[10px] border border-slate-950 px-4 py-2 font-poppins"
                    placeholder="Masukkan nomor telepon"
                  />
                  <button
                    onClick={useAccountPhone}
                    className="ml-4 bg-zinc-300 px-2 py-1 rounded-[10px] text-center font-semibold text-sm"
                  >
                    Gunakan
                    <br />
                    No HP Akun
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center mb-2">
                <label className="text-stone-950 text-lg font-medium font-poppins mr-4">
                  Alamat Penerima:
                </label>
                <button className="bg-zinc-300 px-4 py-1 rounded-[10px] text-center font-semibold text-sm">
                  Pilih Alamat
                </button>
              </div>
              <textarea
                name="address"
                value={receiverInfo.address}
                onChange={handleReceiverInfoChange}
                className="w-full h-28 rounded-[10px] border border-slate-950 p-4 font-poppins"
                placeholder="Masukkan alamat lengkap penerima"
              ></textarea>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h2 className="text-stone-950 text-3xl font-semibold font-poppins mb-6">
              Menu yang dipesan:
            </h2>

            <div className="border-t border-b py-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center mb-4">
                  <img
                    className="w-36 h-36 rounded-xl object-cover"
                    src={item.imageUrl || "https://placehold.co/140x140"}
                    alt={item.name}
                  />
                  <div className="ml-6 flex-grow">
                    <h3 className="text-stone-950 text-2xl font-semibold font-poppins">
                      {item.name}
                    </h3>
                    <p className="text-stone-950 text-xl font-semibold font-poppins mt-2">
                      Kemasan: {item.kemasan || "Styrofoam"}
                    </p>
                    <p className="text-stone-950 text-lg font-medium mt-1">
                      Jumlah: {item.quantity}
                    </p>
                  </div>
                  <div className="bg-zinc-300 rounded-md px-4 py-2">
                    <span className="text-stone-950 text-xl font-bold font-poppins">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3 border-l border-slate-950/30">
          {/* Notes Section */}
          <div className="p-6 border-b border-slate-950/30">
            <h2 className="text-stone-950 text-2xl font-semibold font-poppins mb-4">
              Catatan:
            </h2>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full h-28 rounded-[10px] border border-slate-950 p-4 font-poppins text-sm"
              placeholder="Buat catatan untuk pesanan Anda"
            ></textarea>
          </div>

          {/* Delivery Time */}
          <div className="p-6 border-b border-slate-950/30">
            <h2 className="text-stone-950 text-2xl font-semibold font-poppins mb-4">
              Pilih Waktu Tiba
            </h2>
            <div className="mb-4">
              <div
                className="w-full h-10 rounded-[10px] border border-slate-950 flex items-center justify-between px-4 cursor-pointer"
                onClick={() => document.getElementById("datePicker").click()}
              >
                <span className="text-stone-500 text-sm font-poppins">
                  {selectedDate
                    ? selectedDate.toLocaleDateString("id-ID")
                    : "Tekan untuk memilih tanggal"}
                </span>
                <div className="w-4 h-4 bg-stone-950"></div>
                <DatePicker
                  id="datePicker"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  className="hidden"
                />
              </div>
            </div>
            <div className="w-36 h-12 rounded-[10px] border border-slate-950 flex items-center justify-center">
              <input
                type="text"
                value={selectedTime.hours}
                onChange={handleHoursChange}
                className="w-12 text-center bg-transparent text-stone-950 text-2xl font-poppins"
                maxLength="2"
              />
              <span className="text-black text-2xl mx-2 font-poppins">:</span>
              <input
                type="text"
                value={selectedTime.minutes}
                onChange={handleMinutesChange}
                className="w-12 text-center bg-transparent text-stone-950 text-2xl font-poppins"
                maxLength="2"
              />
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-6">
            <h2 className="text-stone-950 text-2xl font-semibold font-poppins mb-4">
              Pembayaran Uang Muka
            </h2>
            <p className="text-black text-sm font-poppins mb-4">
              Berapa persen yang Anda bayarkan
              <br />
              untuk uang muka?
            </p>

            <div className="flex items-center mb-8">
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={downPaymentPercent}
                onChange={(e) =>
                  setDownPaymentPercent(parseInt(e.target.value))
                }
                className="mr-4"
              />
              <div className="w-24 h-10 rounded-[10px] border border-slate-950 flex items-center justify-between px-4">
                <span className="text-stone-950 text-base font-poppins">
                  {downPaymentPercent}%
                </span>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-amber-500 rounded-lg p-3 mb-4 flex justify-between items-center">
              <span className="text-zinc-100 text-xl font-semibold font-poppins">
                Subtotal:
              </span>
              <span className="text-zinc-100 text-xl font-poppins">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="bg-green-700 rounded-lg p-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-zinc-100 text-xl font-semibold font-poppins">
                  Uang Muka yang
                  <br />
                  perlu dibayar:
                </span>
                <span className="text-zinc-100 text-xl font-poppins">
                  {formatCurrency(downPaymentAmount)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-black text-xl font-semibold font-poppins">
                Sisa yang perlu
                <br />
                dibayar:
              </span>
              <span className="text-amber-500 text-xl font-poppins">
                {formatCurrency(remainingPayment)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-black text-xl font-semibold font-poppins">
                Ongkos Kirim:
              </span>
              <span className="text-amber-500 text-xl font-poppins">Nanti</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Button */}
      <div className="p-6 flex justify-center">
        <button
          onClick={handleCreateOrder}
          disabled={isSubmitting}
          className={`w-full max-w-4xl py-6 rounded-2xl text-white text-4xl font-bold font-poppins
            ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"}`}
        >
          {isSubmitting ? "Processing..." : "Buat Pesanan"}
        </button>
      </div>
    </div>
  );
}
