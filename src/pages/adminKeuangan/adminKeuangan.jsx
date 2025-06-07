import { useState, useEffect, useMemo } from "react";
import AdminHeader from "./components/AdminHeader";
import SummaryCard from "./components/SummaryCard";
import MonthSelector from "./components/MonthSelector";
import OrderCard from "./components/OrderCard";
import OrderDetails from "./components/OrderDetails";
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

export default function AdminKeuangan() {
  const [activeTab, setActiveTab] = useState("laporan");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [monthSelectorWidth, setMonthSelectorWidth] = useState(0);
  const [orderDetailsWidth, setOrderDetailsWidth] = useState(0);
  const [sidebarLeft, setSidebarLeft] = useState(0);

  // Nama bulan dalam Bahasa Indonesia
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Handle scroll untuk sticky positioning dan ukuran components
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const triggerPoint = 300; // Adjust this value based on when you want it to become sticky
      
      // Ambil ukuran components sebelum menjadi sticky
      if (scrollTop <= triggerPoint) {
        const monthSelector = document.getElementById('month-selector');
        const orderDetails = document.getElementById('order-details');
        
        if (monthSelector) {
          const rect = monthSelector.getBoundingClientRect();
          setMonthSelectorWidth(rect.width);
          setSidebarLeft(rect.left);
        }
        
        if (orderDetails) {
          const rect = orderDetails.getBoundingClientRect();
          setOrderDetailsWidth(rect.width);
        }
      }
      
      setIsSticky(scrollTop > triggerPoint);
    };

    const handleResize = () => {
      // Update ukuran saat window resize
      if (!isSticky) {
        const monthSelector = document.getElementById('month-selector');
        const orderDetails = document.getElementById('order-details');
        
        if (monthSelector) {
          const rect = monthSelector.getBoundingClientRect();
          setMonthSelectorWidth(rect.width);
          setSidebarLeft(rect.left);
        }
        
        if (orderDetails) {
          const rect = orderDetails.getBoundingClientRect();
          setOrderDetailsWidth(rect.width);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial measurement
    setTimeout(() => {
      handleScroll();
      handleResize();
    }, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSticky]);

  // Function to show error alert
  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Terjadi Kesalahan',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  };

  // Fetch semua pesanan dari Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data pesanan');
        }

        const data = await response.json();
        const ordersWithDates = data.orders.map(order => {
          // Format tanggal untuk tampilan
          const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
          const month = createdAt.getMonth() + 1;
          const year = createdAt.getFullYear();
          
          return {
            ...order,
            id: order.id,
            name: order.receiverInfo.name,
            items: order.items.map(item => ({
              name: item.name,
              qty: item.quantity,
              price: item.price,
              notes: item.kemasan || ''
            })),
            deliveryTime: order.deliveryInfo.date 
              ? `${new Date(order.deliveryInfo.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}, ${order.deliveryInfo.time}`
              : 'Belum ditentukan',
            address: order.receiverInfo.address,
            status: order.status === 'pending' ? 'Dalam Konfirmasi' : 
                  order.status === 'processed' ? 'Sudah DP & Diproses' :
                  order.status === 'delivery' ? 'Dalam Pengiriman' :
                  order.status === 'arrived' ? 'Pesanan Diterima' :
                  order.status === 'paid' ? 'Sudah Lunas' :
                  order.status === 'completed' ? 'Pesanan Selesai' :
                  order.status === 'cancelled' ? 'Pesanan Dibatalkan' : 
                  'Status Tidak Dikenal',
            orderDate: createdAt.toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            orderMonth: month,
            orderMonthName: monthNames[month - 1],
            orderYear: year,
            paymentInfo: order.paymentInfo,
            statusHistory: order.statusHistory || []
          };
        });

        setAllOrders(ordersWithDates);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
        showErrorAlert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders berdasarkan bulan dan tahun yang dipilih
  useEffect(() => {
    if (allOrders.length > 0) {
      const filtered = allOrders.filter(
        (order) => order.orderMonth === selectedMonth && order.orderYear === selectedYear
      );
      setFilteredOrders(filtered);
      setSelectedOrderId(null);
    }
  }, [selectedMonth, selectedYear, allOrders]);

  // Hitung ringkasan bulanan
  const calculateMonthlySummary = () => {
    const completed = filteredOrders.filter(
      (order) => order.status === "Sudah Lunas" || order.status === "Pesanan Selesai"
    ).length;

    const totalRevenue = filteredOrders.reduce((sum, order) => {
      if (order.status === "Sudah Lunas" || order.status === "Pesanan Selesai") {
        return sum + (order.paymentInfo?.subtotal || 0);
      }
      return sum;
    }, 0);

    const cancelled = filteredOrders.filter(
      (order) => order.status === "Pesanan Dibatalkan"
    ).length;

    return {
      month: monthNames[selectedMonth - 1],
      year: selectedYear,
      completedOrders: completed,
      revenue: totalRevenue,
      cancelledOrders: cancelled,
    };
  };

  const monthlySummaryData = calculateMonthlySummary();

  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data pesanan');
      }

      const data = await response.json();
      const ordersWithDates = data.orders.map(order => {
        const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
        const month = createdAt.getMonth() + 1;
        const year = createdAt.getFullYear();
        
        return {
          ...order,
          id: order.id,
          name: order.receiverInfo.name,
          items: order.items.map(item => ({
            name: item.name,
            qty: item.quantity,
            price: item.price,
            notes: item.kemasan || ''
          })),
          deliveryTime: order.deliveryInfo.date 
            ? `${new Date(order.deliveryInfo.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}, ${order.deliverInfo.time}`
            : 'Belum ditentukan',
          address: order.receiverInfo.address,
          status: order.status === 'pending' ? 'Dalam Konfirmasi' : 
                order.status === 'processed' ? 'Sudah DP & Diproses' :
                order.status === 'delivery' ? 'Dalam Pengiriman' :
                order.status === 'arrived' ? 'Pesanan Diterima' :
                order.status === 'paid' ? 'Sudah Lunas' :
                order.status === 'completed' ? 'Pesanan Selesai' :
                order.status === 'cancelled' ? 'Pesanan Dibatalkan' : 
                'Status Tidak Dikenal',
          orderDate: createdAt.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          orderMonth: month,
          orderMonthName: monthNames[month - 1],
          orderYear: year,
          paymentInfo: order.paymentInfo,
          statusHistory: order.statusHistory || []
        };
      });

      setAllOrders(ordersWithDates);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      showErrorAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />
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
        <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />
        <section className="px-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Laporan Penjualan:</h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <Preloader size="sm" />
            <p className="ml-4">Memuat laporan...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <section className="px-6 mt-8">
        <div className="flex justify-between items-center mb-6 mt-8">
          <h2 className="text-3xl font-semibold">Laporan Penjualan:</h2>
        </div>

        <SummaryCard data={monthlySummaryData} showOrderDetails={false} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MonthSelector dengan sticky positioning */}
          <div 
            id="month-selector"
            className={`lg:col-span-3 ${
              isSticky 
                ? 'fixed top-6 z-40' 
                : ''
            }`}
            style={isSticky ? {
              width: `${monthSelectorWidth}px`,
              left: `${sidebarLeft}px`
            } : {}}
          >
            <MonthSelector
              months={monthNames}
              selectedMonth={monthNames[selectedMonth - 1]}
              selectedYear={selectedYear}
              setSelectedMonth={(month) => setSelectedMonth(monthNames.indexOf(month) + 1)}
              setSelectedYear={setSelectedYear}
            />
          </div>

          {/* Spacer untuk mempertahankan layout ketika MonthSelector menjadi fixed */}
          {isSticky && <div className="lg:col-span-3 invisible">
            <div style={{ height: `${document.getElementById('month-selector')?.offsetHeight || 200}px` }}></div>
          </div>}

          <div className="lg:col-span-5 space-y-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={order.id === selectedOrderId}
                  onSelect={() => handleOrderSelect(order.id)}
                />
              ))
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600 text-lg">
                  Tidak ada pesanan untuk {monthNames[selectedMonth - 1]} {selectedYear}
                </p>
              </div>
            )}
          </div>

          {/* OrderDetails dengan sticky positioning */}
          {filteredOrders.length > 0 ? (
            <>
              <div 
                id="order-details"
                className={`lg:col-span-4 ${
                  isSticky 
                    ? 'fixed top-6 right-12 z-40' 
                    : ''
                }`}
                style={isSticky ? {
                  width: `${orderDetailsWidth}px`
                } : {}}
              >
                <OrderDetails order={selectedOrderId 
                  ? filteredOrders.find(o => o.id === selectedOrderId) 
                  : filteredOrders[0]} 
                />
              </div>
              
              {/* Spacer untuk mempertahankan layout ketika OrderDetails menjadi fixed */}
              {isSticky && <div className="lg:col-span-4 invisible">
                <div style={{ height: `${document.getElementById('order-details')?.offsetHeight || 400}px` }}></div>
              </div>}
            </>
          ) : (
            <div className="lg:col-span-4 bg-white rounded-xl border border-gray-300 shadow-md h-fit p-8 text-center">
              <div className="text-gray-600 text-lg">
                Pilih bulan lain untuk melihat detail pesanan
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}