// PaymentRedirect.jsx - Multiple API Calls Approach
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";

export default function PaymentRedirect() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/auth");
          return;
        }

        // Dapatkan token dengan claims yang berisi informasi user
        const token = await user.getIdToken(true);
        const userId = user.uid;
        
        // Request options yang akan digunakan untuk semua API calls
        const requestOptions = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: "include",
        };

        // Approach: Multiple API calls untuk setiap status
        // Ini memastikan kita mendapatkan semua order dengan status yang diinginkan
        const statuses = ['pending', 'processed', 'delivery', 'arrived'];
        
        const fetchPromises = statuses.map(async (status) => {
          try {
            const response = await fetch(`/api/orders?status=${status}&userId=${userId}`, requestOptions);
            
            if (!response.ok) {
              if (response.status === 401) {
                throw new Error("UNAUTHORIZED");
              } else if (response.status === 403) {
                throw new Error("Anda tidak memiliki akses untuk melihat data ini");
              }
              // Jika status tidak ditemukan (404), return array kosong
              if (response.status === 404) {
                return [];
              }
              throw new Error(`Failed to fetch ${status} orders`);
            }
            
            const data = await response.json();
            return data.orders || [];
          } catch (err) {
            // Jika error adalah UNAUTHORIZED, throw ulang
            if (err.message === "UNAUTHORIZED") {
              throw err;
            }
            // Untuk error lain, log dan return array kosong
            console.warn(`Failed to fetch ${status} orders:`, err.message);
            return [];
          }
        });

        // Tunggu semua request selesai
        const results = await Promise.all(fetchPromises);
        
        // Gabungkan semua hasil dan hapus duplikat
        const allOrders = results.flat();
        const uniqueOrders = allOrders.filter((order, index, self) => 
          index === self.findIndex(o => o.id === order.id)
        );
        
        // Validasi tambahan di frontend
        const validOrders = uniqueOrders.filter(order => 
          order.userId === userId || order.customerId === userId
        );

        if (validOrders.length === 1) {
          // Jika hanya 1 order, langsung redirect
          navigate(`/payment/${validOrders[0].id}`);
        } else if (validOrders.length > 1) {
          // Jika banyak order, simpan datanya untuk ditampilkan
          setActiveOrders(validOrders);
        } else {
          // Tidak ada order yang valid
          setActiveOrders([]);
        }
        
      } catch (err) {
        console.error("Error:", err);
        
        if (err.message === "UNAUTHORIZED") {
          navigate("/auth");
          return;
        }
        
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveOrders();
  }, [navigate]);

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'processed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'delivery':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'arrived':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Fungsi untuk mendapatkan label status dalam bahasa Indonesia
  const getStatusLabel = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Menunggu Pembayaran';
      case 'processed':
        return 'Sedang Diproses';
      case 'delivery':
        return 'Sedang Dikirim';
      case 'arrived':
        return 'Sudah Sampai, Belum Lunas';
      default:
        return status;
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Tampilkan loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Header */}
        <div className="px-30 fixed top-0 left-0 right-0">
          <div className="w-full h-16 bg-green-700 rounded-bl-2xl rounded-br-2xl mb-6">
            <div className="absolute right-34 top-3">
              <button
              onClick={() => navigate("/")}
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
            <div className="absolute left-1/2 top-4.5 transform -translate-x-1/2">
              <h1 className="text-white text-2xl font-semibold font-poppins">
                Pembayaran
              </h1>
            </div>
          </div>
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

  // Tampilkan error jika ada
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <div className="text-lg font-medium text-red-600 mb-2">
            Terjadi Kesalahan
          </div>
          <div className="text-sm text-gray-600 mb-4">
            {error}
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-amber-500 rounded-lg text-white font-medium hover:bg-amber-600 transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Tampilkan daftar order jika ada lebih dari 1
  if (activeOrders.length > 1) {
    // Filter order untuk pembayaran DP
    const dpOrders = activeOrders.filter(order => 
      order.paymentInfo?.statusDownPayment === 'pending' || 
      order.paymentInfo?.statusDownPayment === 'pending_verification'
    );

    // Filter order untuk pelunasan
    const fullPaymentOrders = activeOrders.filter(order => 
      order.paymentInfo?.statusDownPayment === 'verified' && 
      (order.paymentInfo?.statusRemainingPayment === 'pending' || 
      order.paymentInfo?.statusRemainingPayment === 'pending_verification')
    );

    return (
      <div className=" py-8">
        {/* Header */}
        <div className="px-30 fixed top-0 left-0 right-0">
          <div className="w-full h-16 bg-green-700 rounded-bl-2xl rounded-br-2xl mb-6">
            <div className="absolute right-34 top-3">
              <button
              onClick={() => navigate("/")}
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
            <div className="absolute left-1/2 top-4.5 transform -translate-x-1/2">
              <h1 className="text-white text-2xl font-semibold font-poppins">
                Pembayaran
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-16 pb-8 flex justify-center items-center px-44">
          <div className="w-[1400px]">
            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-10">
              {/* Left Column - Pembayaran DP */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold font-poppins text-gray-800 text-center mb-4">
                  Pembayaran DP
                </h2>
                
                {dpOrders.length > 0 ? (
                  dpOrders.map((order) => (
                    <div
                      key={`dp-${order.id}`}
                      className="bg-white rounded-xl border border-gray-300 px-6 py-4"
                    >
                      {/* Card DP */}
                      <div className="mb-2">
                        <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-2">
                          Order Id: {order.id}
                        </h3>
                        <p className="text-xs text-gray-800 font-poppins">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-start">
                        <div className="mb-2">
                          <ul className="text-sm text-gray-800 font-poppins">
                            {order.items?.map((item, index) => (
                              <li key={index}>
                                • {item.name} ({item.quantity}x)
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col justify-between items-end mb-6">
                          <span className="text-xs text-gray-800 font-poppins">Uang Muka</span>
                          <span className="text-lg font-bold text-orange-500">
                            {formatCurrency(order.paymentInfo?.downPaymentAmount)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                        <p className="text-xs text-gray-800 italic font-poppins">
                          Tekan "BUKA" bila ingin melakukan pembayaran
                        </p>
                        <button 
                          className="w-20 h-8 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 flex justify-center items-center rounded-lg transition-all duration-200 ease-in cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/payment/${order.id}?type=dp`);
                          }}
                        >
                          <span className="font-poppins text-sm mt-0.5">
                            Buka
                          </span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl border border-gray-300 p-6 text-center">
                    <p className="text-gray-500">Tidak ada pesanan yang memerlukan pembayaran DP</p>
                  </div>
                )}
              </div>

              {/* Right Column - Pelunasan */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold font-poppins text-gray-800 text-center mb-4">
                  Pelunasan
                </h2>
                
                {fullPaymentOrders.length > 0 ? (
                  fullPaymentOrders.map((order) => (
                    <div
                      key={`full-${order.id}`}
                      className="bg-white rounded-xl border border-gray-300 px-6 py-4"
                    >
                      {/* Card Pelunasan */}
                      <div className="mb-2">
                        <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-2">
                          Order Id: {order.id}
                        </h3>
                        <p className="text-xs text-gray-800 font-poppins">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-start">
                        <div className="mb-2">
                          <ul className="text-sm text-gray-800 font-poppins">
                            {order.items?.map((item, index) => (
                              <li key={index}>
                                • {item.name} ({item.quantity}x)
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col justify-between items-end mb-6">
                          <span className="text-xs text-gray-800 font-poppins">Uang Lunas</span>
                          <span className="text-lg font-bold text-orange-500">
                            Rp{((order?.paymentInfo?.remainingPayment || 0) + (order?.paymentInfo?.shipingCost || 0)).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                        <p className="text-xs text-gray-800 italic font-poppins">
                          Tekan "BUKA" bila ingin melakukan pembayaran
                        </p>
                        <button 
                          className="w-20 h-8 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 flex justify-center items-center rounded-lg transition-all duration-200 ease-in"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/payment/${order.id}?type=full`);
                          }}
                        >
                          <span className="font-poppins text-sm mt-0.5">
                            Buka
                          </span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl border border-gray-300 p-6 text-center">
                    <p className="text-gray-500">Tidak ada pesanan yang memerlukan pelunasan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tampilkan pesan jika tidak ada order aktif
  if (activeOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <div className="text-xl font-medium text-gray-700 mb-2">
            Tidak Ada Order Aktif
          </div>
          <div className="text-gray-500 max-w-md">
            Anda belum memiliki order yang sedang pending, diproses, atau dalam pengiriman saat ini.
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-amber-500 rounded-lg text-white font-medium hover:bg-amber-600 transition-colors"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Lihat Semua Order
          </button>
        </div>
      </div>
    );
  }

  return null; // Redirect akan dilakukan di useEffect
}