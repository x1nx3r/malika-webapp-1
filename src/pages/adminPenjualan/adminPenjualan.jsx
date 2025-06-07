import { useState, useEffect, useMemo, useRef } from "react";
import { auth } from "../../firebase";
import AdminHeader from "./components/AdminHeader";
import DateDisplay from "./components/DateDisplay";
import OrderStats from "./components/OrderStats";
import OrderList from "./components/OrderList";
import OrderSummary from "./components/OrderSummary";
import Swal from 'sweetalert2';

// Komponen Preloader
function Preloader({ size = "md" }) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-orange-500 ${sizes[size]}`}></div>
  );
}

export default function AdminPenjualan() {
  const [activeTab, setActiveTab] = useState("pesanan");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  
  // State untuk sticky OrderSummary
  const [isSticky, setIsSticky] = useState(false);
  const orderSummaryRef = useRef(null);
  const stickyTriggerRef = useRef(null);

  // Today's date
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("id-ID", options);
  const [day, date] = formattedDate.split(", ");

  // Status labels for UI display
  const statusLabels = {
    pending: "Butuh Konfirmasi",
    processed: "Sedang Diproses",
    delivery: "Dalam Pengiriman",
    arrived: "Sudah Sampai",
    paid: "Lunas",
    completed: "Pesanan Selesai",
    cancelled: "Dibatalkan"
  };

  // Status colors for UI styling
  const statusColors = {
    pending: "bg-orange-500",
    processed: "bg-yellow-500",
    delivery: "bg-blue-500",
    arrived: "bg-green-500",
    paid: "bg-green-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500"
  };

  // Effect untuk handle scroll dan sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      if (stickyTriggerRef.current && orderSummaryRef.current) {
        const triggerRect = stickyTriggerRef.current.getBoundingClientRect();
        const shouldBeSticky = triggerRect.top <= 0;
        setIsSticky(shouldBeSticky);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getFirebaseToken();
        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error(`Gagal memuat data pesanan: ${response.status}`);
        
        const data = await response.json();
        
        // Transform data untuk memudahkan penggunaan di frontend
        const transformedOrders = data.orders.map(order => ({
          ...order,
          customer: order.receiverInfo?.name || 'Nama tidak tersedia',
          address: order.receiverInfo?.address || 'Alamat tidak tersedia',
          deliveryDate: order.deliveryInfo?.date 
            ? new Date(order.deliveryInfo.date).toLocaleDateString('id-ID') 
            : 'Tanggal tidak tersedia',
          deliveryTime: order.deliveryInfo?.time || 'Waktu tidak tersedia',
          paymentInfo: order.paymentInfo || {}
        }));

        // Filter orders untuk ditampilkan (exclude cancelled dan completed)
        const displayedOrders = transformedOrders.filter(
          order => order.status !== 'cancelled' && order.status !== 'completed'
        );
        
        setOrders(transformedOrders);
        setDisplayedOrders(displayedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
        showErrorAlert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to show error alert
  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Terjadi Kesalahan',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  };

  // Function to get Firebase token
  const getFirebaseToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    return await user.getIdToken();
  };

  // Calculate order status counts dynamically
  const [orderStatusCounts, setOrderStatusCounts] = useState({
    pending: 0,
    processed: 0,
    completed: 0
  });

  // Calculate counts when orders are updated
  useEffect(() => {
    const counts = {
      pending: orders.filter(order => order.status === "pending").length,
      processed: orders.filter(order => order.status === "processed").length,
      arrived: orders.filter(order => order.status === "arrived").length,
      paid: orders.filter(order => order.status === "paid").length,
      completed: orders.filter(order => order.status === "completed").length
    };
    setOrderStatusCounts(counts);
  }, [orders]);

  // Selected order state
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const selectedOrder = useMemo(() => {
    if (!selectedOrderId && displayedOrders.length > 0) {
      return displayedOrders[0];
    }
    return displayedOrders.find(order => order.id === selectedOrderId) || null;
  }, [selectedOrderId, displayedOrders]);

  // Get status label and color for the selected order
  const getStatusLabel = (status) => statusLabels[status] || "";
  const getStatusColor = (status) => statusColors[status] || "bg-gray-500";

  // Fungsi untuk memperbarui order tertentu dalam state
  const updateOrderInState = (updatedOrder) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    
    // Juga update displayedOrders jika perlu
    if (updatedOrder.status !== 'cancelled' && updatedOrder.status !== 'completed') {
      setDisplayedOrders(displayedOrders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ));
    } else {
      // Jika status berubah ke cancelled/completed, hapus dari displayedOrders
      setDisplayedOrders(displayedOrders.filter(order => order.id !== updatedOrder.id));
    }
  };

  // Handle status change function for buttons
  const handleStatusChange = async (orderId, newStatus, additionalData = {}) => {
    try {
      let updateData = {};

      if (newStatus === 'dp_verified') {
        // Special case for DP verification
        updateData = {
          status: 'processed',
          paymentInfo: {
            statusDownPayment: 'verified',
            downPaymentAmount: selectedOrder?.paymentInfo?.downPaymentAmount,
            downPaymentPercent: selectedOrder?.paymentInfo?.downPaymentPercent
          }
        };
      } else if (newStatus === 'update_shipping') {
        // Special case for shipping cost update
        updateData = {
          paymentInfo: {
            ...additionalData,
            // Update total juga
            total: (selectedOrder?.paymentInfo?.subtotal || 0) + (additionalData.shipingCost || 0)
          }
        };
      } else if (newStatus === 'delivery') {
        updateData = {
          status: 'delivery'
        };
      } else if (newStatus === 'arrived') {
        updateData = {
          status: 'arrived'
        }
      } else if (newStatus === 'paid') {
        updateData = {
          status: 'paid',
          paymentInfo: {
            statusRemainingPayment: 'verified',
            remainingPaymentAmount: selectedOrder?.paymentInfo?.remainingPaymentAmount
          }
        };
      } else if (newStatus === 'completed') {
        updateData = {
          status: 'completed'
        };
      } else {
        // Normal status change
        updateData = { status: newStatus };
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getFirebaseToken()}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui status pesanan');
      }

      // Fetch data terbaru dari server untuk order ini saja
      const updatedResponse = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${await getFirebaseToken()}`
        }
      });
      
      if (!updatedResponse.ok) {
        throw new Error('Gagal memuat data terbaru pesanan');
      }
      
      const updatedOrderData = await updatedResponse.json();

      // Transform data seperti di fetchOrders
      const updatedOrder = {
        ...updatedOrderData,
        customer: updatedOrderData.receiverInfo?.name || 'Nama tidak tersedia',
        address: updatedOrderData.receiverInfo?.address || 'Alamat tidak tersedia',
        deliveryDate: updatedOrderData.deliveryInfo?.date 
          ? new Date(updatedOrderData.deliveryInfo.date).toLocaleDateString('id-ID') 
          : 'Tanggal tidak tersedia',
        deliveryTime: updatedOrderData.deliveryInfo?.time || 'Waktu tidak tersedia',
        paymentInfo: updatedOrderData.paymentInfo || {}
      };

      // Perbarui state dengan data terbaru
      updateOrderInState(updatedOrder);

      // Tampilkan notifikasi sukses
      let successMessage = 'Status pesanan berhasil diperbarui';
      if (newStatus === 'dp_verified') successMessage = 'Pembayaran DP telah dikonfirmasi';
      if (newStatus === 'paid') successMessage = 'Pelunasan telah dikonfirmasi';
      if (newStatus === 'completed') successMessage = 'Pesanan telah diselesaikan';
      
      await Swal.fire({
        title: 'Berhasil!',
        text: successMessage,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire({
        title: 'Gagal',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const refreshData = () => {
    setLoading(true);
    setError(null);
    const fetchOrders = async () => {
      try {
        const token = await getFirebaseToken();
        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error(`Gagal memuat data pesanan: ${response.status}`);
        
        const data = await response.json();
        
        const transformedOrders = data.orders.map(order => ({
          ...order,
          customer: order.receiverInfo?.name || 'Nama tidak tersedia',
          address: order.receiverInfo?.address || 'Alamat tidak tersedia',
          deliveryDate: order.deliveryInfo?.date 
            ? new Date(order.deliveryInfo.date).toLocaleDateString('id-ID') 
            : 'Tanggal tidak tersedia',
          deliveryTime: order.deliveryInfo?.time || 'Waktu tidak tersedia',
          paymentInfo: order.paymentInfo || {}
        }));

        const displayedOrders = transformedOrders.filter(
          order => order.status !== 'cancelled' && order.status !== 'completed'
        );
        
        setOrders(transformedOrders);
        setDisplayedOrders(displayedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
        showErrorAlert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  };

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <AdminHeader activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={refreshData}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <AdminHeader activeTab={activeTab} onTabChange={handleTabChange} />
        <section className="px-6 mt-8">
          <h2 className="text-3xl font-semibold mb-4">Pesanan Hari Ini:</h2>
          <div className="flex justify-center items-center py-12">
            <Preloader size="sm" />
            <p className="ml-4">Memuat pesanan...</p>
          </div>
        </section>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <AdminHeader activeTab={activeTab} onTabChange={handleTabChange} />
        <section className="px-6 mt-8">
          <h2 className="text-3xl font-semibold mb-4">Pesanan Hari Ini:</h2>
          <div className="flex bg-orange-500 rounded-lg overflow-hidden mb-8">
            <DateDisplay day={day} date={date} />
            <OrderStats counts={orderStatusCounts} />
          </div>
          <p>Tidak ada pesanan ditemukan</p>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <AdminHeader activeTab={activeTab} onTabChange={handleTabChange} />
      <section className="px-6 mt-8">
        <h2 className="text-3xl font-semibold mb-4">Pesanan Hari Ini:</h2>

        <div className="flex bg-orange-500 rounded-3xl drop-shadow overflow-hidden mb-8">
          <DateDisplay day={day} date={date} />
          <OrderStats counts={orderStatusCounts} />
        </div>

        {/* Trigger point untuk sticky behavior */}
        <div ref={stickyTriggerRef} className="h-0 w-full"></div>

        <div className="flex gap-6 flex-wrap relative">
          <div 
            className="flex-1"
            style={{
              maxWidth: selectedOrder && isSticky ? 'calc(100% - 386px)' : 'auto' // 400px + 24px gap
            }}
          >
            <OrderList
              orders={displayedOrders}
              selectedOrderId={selectedOrder?.id}
              onSelectOrder={setSelectedOrderId}
              statusLabels={statusLabels}
              statusColors={statusColors}
            />
          </div>

          {selectedOrder && (
            <>
              {/* Placeholder untuk mempertahankan layout saat OrderSummary fixed */}
              {isSticky && (
                <div 
                  className="flex-shrink-0"
                  style={{ width: '386px' }}
                />
              )}
              
              <div 
                ref={orderSummaryRef}
                className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
                  isSticky 
                    ? 'fixed top-6 right-12 z-50' 
                    : 'relative'
                }`}
                style={{
                  width: '386px',
                }}
              >
                <OrderSummary
                  order={selectedOrder}
                  statusLabel={getStatusLabel(selectedOrder.status)}
                  statusColor={getStatusColor(selectedOrder.status)}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}