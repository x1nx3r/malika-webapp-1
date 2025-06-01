import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [paymentType, setPaymentType] = useState('downPayment');
  const fileInputRef = useRef(null);

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
        
        // Tentukan jenis pembayaran berdasarkan status order
        if (data.status === 'pending') {
          setPaymentType('downPayment');
        } else if (['processed', 'delivery', 'arrived'].includes(data.status)) {
          setPaymentType('remainingPayment');
        }
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi file
    if (!file.type.match('image.*')) {
      setUploadError('Hanya file gambar yang diperbolehkan');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setUploadError('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      const formData = new FormData();
      formData.append('paymentProof', file);
      formData.append('orderId', orderId);
      formData.append('paymentType', paymentType); // Tambahkan jenis pembayaran

      const response = await fetch('/api/uploadPaymentProof', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setUploadSuccess(true);
      
      // Update order data dengan bukti pembayaran baru
      setOrder(prev => ({
        ...prev,
        paymentInfo: {
          ...prev.paymentInfo,
          [`proof${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}`]: result.imageUrl,
          [`status${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}`]: 'pending_verification'
        }
      }));
      
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Gagal mengupload bukti pembayaran');
    } finally {
      setUploading(false);
    }
  };

  const handleCheckPaymentStatus = async () => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      // Tambahkan query parameter checkStatus=true
      const response = await fetch(`/api/orders/${orderId}?checkStatus=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to check payment status");
      
      const data = await response.json();
      
      // Tampilkan alert dengan status pembayaran
      let statusMessage = '';
      
      if (paymentType === 'downPayment') {
        statusMessage = `Status Uang Muka: ${
          data.statusDownPayment === 'verified' ? 'Terverifikasi' : 
          data.statusDownPayment === 'pending_verification' ? 'Menunggu verifikasi' : 
          'Belum dibayar'
        }`;
      } else {
        statusMessage = `Status Pelunasan: ${
          data.statusRemainingPayment === 'verified' ? 'Terverifikasi' : 
          data.statusRemainingPayment === 'pending_verification' ? 'Menunggu verifikasi' : 
          'Belum dibayar'
        }`;
      }
      
      alert(statusMessage);
      
    } catch (err) {
      console.error("Error checking payment status:", err);
      alert("Gagal memeriksa status pembayaran");
    }
  };

  const handlePayLater = () => {
    navigate("/");
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

  // Fungsi untuk menampilkan info pembayaran
  const renderPaymentInfo = () => {
    if (paymentType === 'downPayment') {
      return (
        <>
          <div className="rounded-lg border border-amber-500 p-3 flex items-center justify-between mb-3">
            <span className="text-stone-950 text-lg font-medium font-poppins">
              Uang Muka ({order?.paymentInfo?.downPaymentPercent}%):
            </span>
            <span className="text-stone-950 text-xl font-bold font-poppins">
              {order?.paymentInfo?.downPaymentAmount
                ? `Rp${order.paymentInfo.downPaymentAmount.toLocaleString("id-ID")},-`
                : "Rp0,-"}
            </span>
          </div>

          {/* Bukti Pembayaran Down Payment */}
          {order?.paymentInfo?.proofDownPayment && (
            <div className="mb-3">
              <p className="text-center text-stone-950 text-sm font-medium font-poppins mb-1">
                Bukti Pembayaran Down Payment:
              </p>
              <div className="flex justify-center">
                <a 
                  href={order.paymentInfo.proofDownPayment} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Lihat Bukti
                </a>
              </div>
            </div>
          )}
        </>
      );
    } else if (paymentType === 'remainingPayment') {
      return (
        <>
          <div className="rounded-lg border border-amber-500 p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-950 text-lg font-medium font-poppins">
                Pelunasan:
              </span>
              <span className="text-stone-950 text-xl font-bold font-poppins">
                {order?.paymentInfo?.remainingPayment
                  ? `Rp${order.paymentInfo.remainingPayment.toLocaleString("id-ID")},-`
                  : "Rp0,-"}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-950 text-lg font-medium font-poppins">
                Biaya Pengiriman:
              </span>
              <span className="text-stone-950 text-xl font-bold font-poppins">
                {order?.paymentInfo?.shipingCost
                  ? `Rp${order.paymentInfo.shipingCost.toLocaleString("id-ID")},-`
                  : "Rp0,-"}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-300">
              <span className="text-stone-950 text-lg font-medium font-poppins">
                Total:
              </span>
              <span className="text-stone-950 text-xl font-bold font-poppins">
                {order?.paymentInfo?.remainingPayment && order?.paymentInfo?.shipingCost
                  ? `Rp${(order.paymentInfo.remainingPayment + order.paymentInfo.shipingCost).toLocaleString("id-ID")},-`
                  : "Rp0,-"}
              </span>
            </div>
          </div>

          {/* Bukti Pembayaran Remaining Payment */}
          {order?.paymentInfo?.proofRemainingPayment && (
            <div className="mb-3">
              <p className="text-center text-stone-950 text-sm font-medium font-poppins mb-1">
                Bukti Pelunasan:
              </p>
              <div className="flex justify-center">
                <a 
                  href={order.paymentInfo.proofRemainingPayment} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Lihat Bukti
                </a>
              </div>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="container mx-auto max-w-4xl bg-white shadow-md min-h-screen flex flex-col items-center py-4">
      {/* Header */}
      <header className="bg-green-700 w-full py-3 px-4 rounded-b-lg border border-t-0 border-zinc-300 mb-4">
        <div className="flex items-center justify-between">
          <div className="w-28 h-10 border border-black/20"></div>
          <h1 className="text-white text-2xl font-semibold font-poppins">
            {paymentType === 'downPayment' ? 'Pembayaran Uang Muka' : 'Pelunasan Pembayaran'}
          </h1>
          <div className="w-28 h-10"></div>
        </div>
      </header>

      {/* Order Summary Box */}
      <div className="w-full max-w-md bg-white rounded-lg shadow p-4 mb-6">
        <div className="bg-zinc-200 rounded-lg p-3 mb-3">
          <p className="text-center text-stone-950 text-lg font-medium font-poppins">
            No. Pemesan: {orderId}
          </p>
        </div>

        {renderPaymentInfo()}
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

      {/* Upload Bukti Pembayaran */}
      <div className="w-full max-w-md px-4 mb-5">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="text-gray-600">Mengupload bukti pembayaran...</div>
          ) : (
            <>
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-green-700 text-white px-4 py-2 rounded-lg mb-2"
              >
                {paymentType === 'downPayment' 
                  ? 'Upload Bukti Uang Muka' 
                  : 'Upload Bukti Pelunasan'}
              </button>
              <p className="text-gray-600 text-sm">
                Unggah foto/screenshot bukti transfer
              </p>
              <p className="text-gray-500 text-xs">
                Format: JPG/PNG (maks. 5MB)
              </p>
            </>
          )}
          
          {uploadError && (
            <div className="text-red-600 mt-2">{uploadError}</div>
          )}
          {uploadSuccess && (
            <div className="text-green-600 mt-2">
              Bukti pembayaran berhasil diupload!
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-lg text-center mb-5 px-4">
        <p className="text-black text-sm font-normal font-poppins">
          Lakukan pembayaran dengan nominal yang sudah tertera di
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