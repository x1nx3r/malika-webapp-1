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

  // Tampilkan loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <div className="text-base font-medium text-gray-700">
            Memeriksa order aktif Anda...
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
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Aktif Anda</h1>
          <p className="text-gray-600">Pilih order yang ingin Anda lihat atau lanjutkan</p>
        </div>
        
        <div className="grid gap-4">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/payment/${order.id}`)}
              className="p-6 border rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 cursor-pointer transition-all duration-200 bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {order.status.toLowerCase() === 'pending' && (
                    <span>Menunggu pembayaran uang muka</span>
                  )}
                  {order.status.toLowerCase() === 'processed' && (
                    <span>Order sedang diproses</span>
                  )}
                  {order.status.toLowerCase() === 'delivery' && (
                    <span>Order sedang dalam pengiriman</span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Uang Muka</div>
                  <div className="text-lg font-bold text-amber-600">
                    Rp {order.paymentInfo?.downPaymentAmount?.toLocaleString("id-ID") || "0"}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Klik untuk melihat detail</span>
                  <span className="text-amber-600 font-medium">→</span>
                </div>
              </div>
            </div>
          ))}
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