import { useState, useEffect, useMemo } from "react";
import AdminHeader from "./components/AdminHeader";
import SummaryCard from "./components/SummaryCard";
import MonthSelector from "./components/MonthSelector";
import OrderCard from "./components/OrderCard";
import OrderDetails from "./components/OrderDetails";

export default function AdminKeuangan() {
  const [activeTab, setActiveTab] = useState("laporan");
  const [selectedMonth, setSelectedMonth] = useState("Maret");
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Sample orders data with multiple months - keep your existing order data
  const orders = useMemo(
    () => [
      // March 2025 data
      {
        id: 1,
        name: "Udin Subagio",
        items: [
          {
            name: "Lodho Ayam Kampung (Besar)",
            qty: 12,
            price: 195000,
            notes: "Ukuran Besar",
          },
          {
            name: "Bandeng Presto",
            qty: 15,
            price: 65000,
            notes: "Sambal Bajak",
          },
          { name: "Lumpia Beef", qty: 16, price: 55000, notes: "" },
        ],
        deliveryTime: "15 Maret, 15:00",
        address: "Jalan Rungkut Kidul RK 5 Blok N 8, Rungkut, Kota Surabaya",
        status: "LUNAS",
        highlighted: true,
        orderDate: "15 Maret 2025",
        orderMonth: "Maret",
        orderYear: 2025,
      },
      {
        id: 2,
        name: "Ahmad Kanabawiy",
        items: [
          {
            name: "Lodho Ayam Kampung (Kecil)",
            qty: 8,
            price: 150000,
            notes: "Ukuran Kecil",
          },
          {
            name: "Bandeng Presto",
            qty: 10,
            price: 65000,
            notes: "Sambal Matah",
          },
        ],
        deliveryTime: "20 Maret, 12:00",
        address: "Jalan Keputih Tegal No. 100, Surabaya",
        status: "LUNAS",
        highlighted: false,
        orderDate: "20 Maret 2025",
        orderMonth: "Maret",
        orderYear: 2025,
      },
      {
        id: 3,
        name: "Dina Sastro",
        items: [
          {
            name: "Bandeng Presto",
            qty: 5,
            price: 65000,
            notes: "Extra Pedas",
          },
        ],
        deliveryTime: "25 Maret, 18:00",
        address: "Jalan Diponegoro 45, Surabaya",
        status: "DIBATALKAN",
        highlighted: false,
        orderDate: "25 Maret 2025",
        orderMonth: "Maret",
        orderYear: 2025,
      },

      // April 2025 data
      {
        id: 4,
        name: "Bunga Citra",
        items: [
          {
            name: "Lodho Ayam Kampung (Besar)",
            qty: 5,
            price: 195000,
            notes: "Pedas",
          },
          {
            name: "Bandeng Presto",
            qty: 6,
            price: 65000,
            notes: "Extra Pedas",
          },
        ],
        deliveryTime: "5 April, 18:00",
        address: "Jalan Diponegoro 45, Surabaya",
        status: "LUNAS",
        highlighted: false,
        orderDate: "5 April 2025",
        orderMonth: "April",
        orderYear: 2025,
      },
      {
        id: 5,
        name: "Dian Sastro",
        items: [
          {
            name: "Lodho Ayam Kampung (Besar)",
            qty: 4,
            price: 195000,
            notes: "",
          },
          { name: "Lumpia Beef", qty: 8, price: 55000, notes: "" },
        ],
        deliveryTime: "10 April, 12:00",
        address: "Jalan Basuki Rahmat 10, Surabaya",
        status: "LUNAS",
        highlighted: false,
        orderDate: "10 April 2025",
        orderMonth: "April",
        orderYear: 2025,
      },
      {
        id: 6,
        name: "Edwin Supriadi",
        items: [
          { name: "Kare Ayam", qty: 10, price: 175000, notes: "Pedas" },
          {
            name: "Lumpia Beef",
            qty: 15,
            price: 55000,
            notes: "Pedas Level 3",
          },
        ],
        deliveryTime: "20 April, 19:00",
        address: "Jalan Pemuda 56, Surabaya",
        status: "DIBATALKAN",
        highlighted: false,
        orderDate: "20 April 2025",
        orderMonth: "April",
        orderYear: 2025,
      },

      // May 2025 data
      {
        id: 7,
        name: "Fachri Albar",
        items: [
          { name: "Kare Ayam", qty: 7, price: 175000, notes: "Non-pedas" },
          {
            name: "Bandeng Presto",
            qty: 12,
            price: 65000,
            notes: "Sambal Terasi",
          },
        ],
        deliveryTime: "3 Mei, 14:00",
        address: "Jalan Darmo Permai III/45, Surabaya",
        status: "LUNAS",
        highlighted: false,
        orderDate: "3 Mei 2025",
        orderMonth: "Mei",
        orderYear: 2025,
      },
      {
        id: 8,
        name: "Gina Natasya",
        items: [
          {
            name: "Lodho Ayam Kampung (Besar)",
            qty: 15,
            price: 195000,
            notes: "Untuk Acara",
          },
          { name: "Lumpia Beef", qty: 30, price: 55000, notes: "Untuk Acara" },
        ],
        deliveryTime: "17 Mei, 10:00",
        address: "Jalan Kertajaya Indah 78, Surabaya",
        status: "LUNAS",
        highlighted: false,
        orderDate: "17 Mei 2025",
        orderMonth: "Mei",
        orderYear: 2025,
      },

      // February 2025 data
      {
        id: 9,
        name: "Hadi Wijaya",
        items: [
          {
            name: "Bandeng Presto",
            qty: 8,
            price: 65000,
            notes: "Sambal Bajak",
          },
        ],
        deliveryTime: "14 Februari, 16:00",
        address: "Jalan Manyar Kertoarjo 45, Surabaya",
        status: "LUNAS",
        highlighted: false,
        orderDate: "14 Februari 2025",
        orderMonth: "Februari",
        orderYear: 2025,
      },
      {
        id: 10,
        name: "Indah Permata",
        items: [
          {
            name: "Lodho Ayam Kampung (Kecil)",
            qty: 3,
            price: 150000,
            notes: "Level 2",
          },
          { name: "Lumpia Beef", qty: 5, price: 55000, notes: "Level 2" },
        ],
        deliveryTime: "20 Februari, 13:00",
        address: "Jalan Ngagel Jaya 123, Surabaya",
        status: "DIBATALKAN",
        highlighted: false,
        orderDate: "20 Februari 2025",
        orderMonth: "Februari",
        orderYear: 2025,
      },
    ],
    []
  ); // Empty dependency array since this is static data

  // Filter orders based on selected month and year
  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.orderMonth === selectedMonth && order.orderYear === selectedYear
    );
    setFilteredOrders(filtered);

    // Reset selected order when changing month/year
    setSelectedOrderId(null);
  }, [selectedMonth, selectedYear, orders]);

  // Find the selected order if any
  const selectedOrder = selectedOrderId
    ? filteredOrders.find((order) => order.id === selectedOrderId)
    : null;

  // Calculate monthly summary data based on filtered orders
  const calculateMonthlySummary = () => {
    // Count completed orders
    const completed = filteredOrders.filter(
      (order) => order.status === "LUNAS"
    ).length;

    // Calculate total revenue from all orders for the month
    const totalRevenue = filteredOrders.reduce((sum, order) => {
      // Only include revenue from completed orders
      if (order.status === "LUNAS") {
        const orderTotal = order.items.reduce(
          (itemSum, item) => itemSum + item.qty * item.price,
          0
        );
        return sum + orderTotal;
      }
      return sum;
    }, 0);

    // Count cancelled orders
    const cancelled = filteredOrders.filter(
      (order) => order.status === "DIBATALKAN"
    ).length;

    return {
      month: selectedMonth,
      year: selectedYear,
      completedOrders: completed,
      revenue: totalRevenue,
      cancelledOrders: cancelled,
    };
  };

  // Monthly summary data
  const monthlySummaryData = calculateMonthlySummary();

  // Handle order selection - simplified to just update selectedOrderId
  const handleOrderSelect = (orderId) => {
    const isAlreadySelected = selectedOrderId === orderId;
    setSelectedOrderId(isAlreadySelected ? null : orderId);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <AdminHeader
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Laporan Penjualan:</h2>
      </div>

      {/* Always show monthly data in SummaryCard */}
      <SummaryCard data={monthlySummaryData} showOrderDetails={false} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <MonthSelector
          months={[
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
          ]}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          setSelectedMonth={setSelectedMonth}
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
                Tidak ada pesanan untuk {selectedMonth} {selectedYear}
              </p>
            </div>
          )}
        </div>

        {/* Pass the selected order to OrderDetails or first filtered order */}
        {filteredOrders.length > 0 ? (
          <OrderDetails order={selectedOrder || filteredOrders[0]} />
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
