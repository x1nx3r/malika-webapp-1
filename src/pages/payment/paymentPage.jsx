import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import Swal from "sweetalert2";

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
    // Loading overlay
    const loadingSwal = Swal.fire({
      title: 'Memeriksa Status Pembayaran',
      html: 'Mohon tunggu sebentar...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      backdrop: `
        rgba(0,0,0,0.5)
        url("/images/loading.gif")
        center top
        no-repeat
      `
    });

    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      const response = await fetch(`/api/orders/${orderId}?checkStatus=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to check payment status");
      
      const data = await response.json();
      
      // Tutup loading
      await loadingSwal.close();
      
      // Tampilkan status pembayaran
      let statusMessage = '';
      let statusIcon = 'info';
      
      if (paymentType === 'downPayment') {
        const status = data.statusDownPayment;
        statusMessage = `Status Uang Muka: ${
          status === 'verified' ? 'Terverifikasi' : 
          status === 'pending_verification' ? 'Menunggu verifikasi' : 
          'Belum dibayar'
        }`;
        
        if (status === 'verified') statusIcon = 'success';
        else if (status === 'pending_verification') statusIcon = 'info';
        else statusIcon = 'warning';
      } else {
        const status = data.statusRemainingPayment;
        statusMessage = `Status Pelunasan: ${
          status === 'verified' ? 'Terverifikasi' : 
          status === 'pending_verification' ? 'Menunggu verifikasi' : 
          'Belum dibayar'
        }`;
        
        if (status === 'verified') statusIcon = 'success';
        else if (status === 'pending_verification') statusIcon = 'info';
        else statusIcon = 'warning';
      }
      
      Swal.fire({
        title: 'Status Pembayaran',
        text: statusMessage,
        icon: statusIcon,
        confirmButtonText: 'OK',
        confirmButtonColor: '#15803d' // green-700
      });
      
    } catch (err) {
      console.error("Error checking payment status:", err);
      // Tutup loading jika error
      await loadingSwal.close();
      
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal memeriksa status pembayaran',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#15803d' // green-700
      });
    }
  };

  const handlePayLater = () => {
    navigate("/payment");
  };

  const handleCopyAccountNumber = () => {
    const textToCopy = `Pembayaran hanya melalui transfer BCA di Nomor Rekening:

    5410 4257 87

    atas nama Kedai Malika

    Lakukan pembayaran sesuai dengan nominal yang tertera di kotak berwarna oranye.
    Terima kasih telah mempercayai produk kami -Kedai Malika-`;

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Informasi rekening berhasil disalin!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#15803d' // green-700
        });
      })
      .catch(err => {
        console.error('Gagal menyalin teks:', err);
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal menyalin informasi rekening',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#15803d' // green-700
        });
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Header */}
        <div className="px-30 fixed top-0 left-0 right-0 z-50">
          <header className="w-full h-16 bg-green-700 py-3 px-4 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="w-28 h-10 border border-black/20"></div>
              <h1 className="text-white text-2xl font-semibold font-poppins">
                Pembayaran
              </h1>
              <button
              onClick={() => navigate("/payment")}
              className="w-[130px] h-10 bg-white rounded-lg overflow-hidden flex justify-center items-center hover:bg-gray-100 transition-all duration-200 ease-in"
              >
                <div className="mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                    <g fill="none">
                      <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                      <path fill="currentColor" d="M3.283 10.94a1.5 1.5 0 0 0 0 2.12l5.656 5.658a1.5 1.5 0 1 0 2.122-2.122L7.965 13.5H19.5a1.5 1.5 0 0 0 0-3H7.965l3.096-3.096a1.5 1.5 0 1 0-2.122-2.121z" />
                    </g>
                  </svg>
                </div>
                <span className="ml-2 mr-1 text-stone-950 text-sm font-semibold font-poppins cursor-pointer">
                  Kembali
                </span>
              </button>
            </div>
          </header>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <div className="text-base font-medium text-gray-700">
            Sedang memuat...
          </div>
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
          <div className="rounded-xl border border-amber-500 px-11 py-2 flex items-center justify-between mb-3">
            <span className="text-stone-950 text-md font-medium font-poppins">
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
            <div className="flex justify-center">
              <button
                onClick={() => window.open(order.paymentInfo.proofDownPayment, '_blank', 'noopener,noreferrer')}
                className="px-13 py-2 flex items-center justify-between rounded-xl border border-green-700 bg-green-200 text-md font-medium font-poppins cursor-pointer hover:bg-green-300 transition-all duration-150 ease-in"
              >
                Lihat Bukti Pembayaran Uang Muka
              </button>
            </div>
          )}
        </>
      );
    } else if (paymentType === 'remainingPayment') {
      return (
        <>
          <div className="rounded-xl border border-amber-500 px-11 py-3 mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-stone-950 text-md font-medium font-poppins">
                Pelunasan:
              </span>
              <span className="text-stone-950 text-xl font-bold font-poppins">
                {order?.paymentInfo?.remainingPayment
                  ? `Rp${order.paymentInfo.remainingPayment.toLocaleString("id-ID")},-`
                  : "Rp0,-"}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-950 text-md font-medium font-poppins">
                Ongkos Kirim:
              </span>
              <span className="text-stone-950 text-xl font-bold font-poppins">
                {order?.paymentInfo?.shipingCost
                  ? `Rp${order.paymentInfo.shipingCost.toLocaleString("id-ID")},-`
                  : "Rp0,-"}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-400">
              <span className="text-stone-950 text-lg font-semibold font-poppins">
                Total:
              </span>
              <span className="text-stone-950 text-xl font-bold font-poppins">
                Rp{((order?.paymentInfo?.remainingPayment || 0) + (order?.paymentInfo?.shipingCost || 0)).toLocaleString("id-ID")},-
              </span>
            </div>
          </div>

          {/* Bukti Pembayaran Remaining Payment */}
          {order?.paymentInfo?.proofRemainingPayment && (
            <div className="flex justify-center">
              <button
                onClick={() => window.open(order.paymentInfo.proofRemainingPayment, '_blank', 'noopener,noreferrer')}
                className="px-14.5 py-2 flex items-center justify-between rounded-xl border border-green-700 bg-green-200 text-md font-medium font-poppins cursor-pointer hover:bg-green-300 transition-all duration-150 ease-in"
              >
                Lihat Bukti Pembayaran Pelunasan
              </button>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="px-30 fixed top-0 left-0 right-0 z-50">
        <header className="w-full h-16 bg-green-700 py-3 px-4 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="w-28 h-10 border border-black/20"></div>
            <h1 className="text-white text-2xl font-semibold font-poppins">
              Pembayaran
            </h1>
            <button
            onClick={() => navigate("/payment")}
            className="w-[130px] h-10 bg-white rounded-lg overflow-hidden flex justify-center items-center hover:bg-gray-100 transition-all duration-200 ease-in"
            >
              <div className="mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                  <g fill="none">
                    <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                    <path fill="currentColor" d="M3.283 10.94a1.5 1.5 0 0 0 0 2.12l5.656 5.658a1.5 1.5 0 1 0 2.122-2.122L7.965 13.5H19.5a1.5 1.5 0 0 0 0-3H7.965l3.096-3.096a1.5 1.5 0 1 0-2.122-2.121z" />
                  </g>
                </svg>
              </div>
              <span className="ml-2 mr-1 text-stone-950 text-sm font-semibold font-poppins cursor-pointer">
                Kembali
              </span>
            </button>
          </div>
        </header>
      </div>

      {/* Content */}
      <div className="pt-22 pb-4">
        <div className="flex flex-col items-center">
          {/* Order Summary Box */}
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-300 drop-shadow px-6 py-4 mb-6">
            <div className="bg-gray-200 rounded-xl p-3 mb-3 border border-gray-400">
              <p className="text-center text-stone-950 text-md font-semibold font-poppins">
                No. Pemesan: {orderId}
              </p>
            </div>

            {renderPaymentInfo()}
          </div>

          {/* Payment Information */}
          <h2 className="text-black text-3xl font-semibold font-poppins mb-3">
            Transfer BCA
          </h2>

          <div className="mb-2">
            <h3 className="text-center text-black text-lg font-semibold font-poppins mb-1">
              No. Rekening:
            </h3>

            <div className="flex items-center justify-center gap-2">
              <div className="bg-green-700 rounded-xl px-6 py-2">
                <p className="text-zinc-100 text-2xl font-semibold font-poppins">
                  5410 4257 87
                </p>
              </div>

              <div className="relative group">
                <button 
                  onClick={handleCopyAccountNumber}
                  className="bg-green-700 rounded-xl w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-green-800 transition-all duration-150 ease-in"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                    <path fill="#fff" d="M14 8H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2" />
                    <path fill="#fff" d="M20 2H10a2 2 0 0 0-2 2v2h8a2 2 0 0 1 2 2v8h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2" />
                  </svg>
                </button>

                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  Salin No. Rek
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-200 rounded-lg px-8 py-1 mb-8 hover:bg-gray-100 hover:text-gray-800 transition-all duration-150 ease-in">
            <p className="text-center text-gray-600 text-base font-semibold font-poppins">
              a/n Kedai Malika
            </p>
          </div>

          {/* Upload Bukti Pembayaran */}
          <div className="w-full max-w-md mb-5">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
                disabled={uploading}
              />
              
              {uploading ? (
                <div className="text-gray-800">Mengupload bukti pembayaran...</div>
              ) : (
                <>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-green-700 text-white px-6 py-2 rounded-xl mb-4 cursor-pointer hover:bg-green-800 transition-all duration-150 ease-in"
                  >
                    {paymentType === 'downPayment' 
                      ? 'Pilih Bukti Uang Muka' 
                      : 'Pilih Bukti Pelunasan'}
                  </button>
                  <p className="text-gray-800 text-sm font-poppins">
                    Unggah foto/screenshot bukti transfer di sini.
                  </p>
                  <p className="text-gray-600 text-xs font-poppins">
                    Format: JPG/PNG (maks. 5MB)
                  </p>
                </>
              )}
              
              {uploadError && (
                <div className="text-red-600 mt-2">{uploadError}</div>
              )}
              {uploadSuccess && (
                <div className="text-green-600 mt-2">
                  Bukti pembayaran berhasil diunggah!
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="w-full max-w-md text-justify mb-6">
            <p className="text-gray-800 text-sm font-poppins">
              Lakukan pembayaran dengan nominal yang sudah tertera di
              kotak berwarna oranye. Perhatikan nomor rekening dan nama pemilik.
              Selalu periksa dengan teliti sebelum melakukan pembayaran!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center w-full max-w-md gap-2 mb-3">
            <button
              onClick={handlePayLater}
              className="w-full py-2 bg-gray-200 rounded-xl text-gray-800 text-lg font-medium font-poppins cursor-pointer hover:bg-gray-300 transition-all duration-150 ease-in"
            >
              Bayar Nanti
            </button>

            <button
              onClick={handleCheckPaymentStatus}
              className="w-full py-2 bg-orange-400 rounded-xl text-white text-lg font-semibold font-poppins cursor-pointer hover:bg-orange-500 transition-all duration-150 ease-in"
            >
              Cek Status Pembayaran
            </button>
          </div>

          {/* Contact Info */}
          <div className="text-center mb-4">
            <p className="text-black text-sm font-normal font-poppins">
              Hubungi admin{" "}
              <span className="font-semibold underline cursor-pointer">0822-5737-4357</span> jika
              mengalami kendala.
            </p>
          </div>
        </div>
        </div>
    </div>
  );
}