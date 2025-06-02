import { useState, useEffect, useMemo } from "react";
import AdminHeader from "./components/AdminHeader";
import SummaryCard from "./components/SummaryCard";
import MonthSelector from "./components/MonthSelector";
import OrderCard from "./components/OrderCard";
import OrderDetails from "./components/OrderDetails";

export default function AdminKeuangan() {
  const [activeTab, setActiveTab] = useState("laporan");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nama bulan dalam Bahasa Indonesia
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Fetch semua pesanan dari Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
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
        return sum + (order.paymentInfo?.subtotal || 0); // Ubah dari total ke subtotal
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
      revenue: totalRevenue, // Ini sekarang berisi subtotal
      cancelledOrders: cancelled,
    };
  };

  const monthlySummaryData = calculateMonthlySummary();

  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="text-xl">Memuat data pesanan...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Laporan Penjualan:</h2>
      </div>

      <SummaryCard data={monthlySummaryData} showOrderDetails={false} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <MonthSelector
          months={monthNames}
          selectedMonth={monthNames[selectedMonth - 1]}
          selectedYear={selectedYear}
          setSelectedMonth={(month) => setSelectedMonth(monthNames.indexOf(month) + 1)}
          setSelectedYear={setSelectedYear}
        />

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

        {filteredOrders.length > 0 ? (
          <OrderDetails order={selectedOrderId 
            ? filteredOrders.find(o => o.id === selectedOrderId) 
            : filteredOrders[0]} 
          />
        ) : (
          <div className="lg:col-span-4 bg-white rounded-xl border border-gray-300 shadow-md h-fit p-8 text-center">
            <div className="text-gray-600 text-lg">
              Pilih bulan lain untuk melihat detail pesanan
            </div>
          </div>
        )}
      </div>
    </div>
  );
}