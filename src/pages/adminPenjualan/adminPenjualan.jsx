import { useState, useEffect, useMemo } from "react";
import AdminHeader from "./components/AdminHeader";
import DateDisplay from "./components/DateDisplay";
import OrderStats from "./components/OrderStats";
import OrderList from "./components/OrderList";
import OrderSummary from "./components/OrderSummary";

export default function AdminPenjualan() {
  const [activeTab, setActiveTab] = useState("pesanan");
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
    needConfirmation: "Butuh Konfirmasi Ongkir",
    readyToShip: "Pesanan Harus Dikirim",
    completed: "Pesanan Selesai",
  };

  // Status colors for UI styling
  const statusColors = {
    needConfirmation: "bg-orange-500",
    readyToShip: "bg-blue-500",
    completed: "bg-green-500",
  };

  // Move orders to useMemo to prevent recreation on each render
  const orders = useMemo(
    () => [
      {
        id: 1,
        customer: "Udin Subagio",
        items: [
          { name: "Lodho Ayam Kampung (Besar)", quantity: 12, price: 195000 },
          {
            name: "Bandeng Presto",
            quantity: 15,
            price: 65000,
            note: "Sambal Bajak",
          },
          { name: "Lumpia Beef", quantity: 16, price: 55000 },
        ],
        deliveryTime: "Hari Ini, 15:00",
        address:
          "Jalan Rungkut Kidul RK 5 Blok N 8, Rungkut, Kota Surabaya, Medokan Ayu, Kec. Rungkut, Surabaya, Jawa Timur 60295",
        orderBorder: "border-orange-500",
        status: "needConfirmation",
      },
      {
        id: 2,
        customer: "Budi Santoso",
        items: [
          { name: "Lodho Ayam Kampung (Kecil)", quantity: 5, price: 150000 },
          {
            name: "Bandeng Presto",
            quantity: 3,
            price: 65000,
            note: "Extra Pedas",
          },
        ],
        deliveryTime: "Besok, 09:00",
        address: "Jalan Raya Darmo 45, Surabaya",
        orderBorder: "border-blue-500",
        status: "readyToShip",
      },
      {
        id: 3,
        customer: "Citra Lestari",
        items: [
          { name: "Bandeng Presto", quantity: 8, price: 65000 },
          { name: "Lumpia Beef", quantity: 10, price: 55000 },
        ],
        deliveryTime: "Hari Ini, 18:00",
        address: "Jalan Kertajaya Indah 23, Surabaya",
        orderBorder: "border-green-500",
        status: "completed",
      },
      {
        id: 4,
        customer: "Denny Sumargo",
        items: [
          { name: "Lodho Ayam Kampung (Besar)", quantity: 3, price: 195000 },
        ],
        deliveryTime: "Besok, 12:00",
        address: "Jalan Ngagel Jaya 10, Surabaya",
        orderBorder: "border-orange-500",
        status: "needConfirmation",
      },
    ],
    []
  ); // Empty dependency array means this will only be created once

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Calculate order status counts dynamically
  const [orderStatusCounts, setOrderStatusCounts] = useState({
    needConfirmation: 0,
    readyToShip: 0,
    completed: 0,
  });

  // Calculate counts when component mounts or orders are updated
  useEffect(() => {
    const counts = {
      needConfirmation: orders.filter(
        (order) => order.status === "needConfirmation"
      ).length,
      readyToShip: orders.filter((order) => order.status === "readyToShip")
        .length,
      completed: orders.filter((order) => order.status === "completed").length,
    };
    setOrderStatusCounts(counts);
  }, [orders]); // This is safe now since orders is memoized

  // Selected order state
  const [selectedOrderId, setSelectedOrderId] = useState(1);
  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) || orders[0];

  // Get status label and color for the selected order
  const getStatusLabel = (status) => statusLabels[status] || "";
  const getStatusColor = (status) => statusColors[status] || "bg-gray-500";

  // Handle status change function for buttons
  const handleStatusChange = (orderId, action) => {
    console.log(`Status change for order ${orderId}: ${action}`);
    // Implement status change logic here
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <AdminHeader activeTab={activeTab} onTabChange={handleTabChange} />
      <section className="px-6 mt-8">
        <h2 className="text-3xl font-semibold mb-4">Pesanan Hari Ini:</h2>

        <div className="flex bg-orange-500 rounded-lg overflow-hidden mb-8">
          <DateDisplay day={day} date={date} />
          <OrderStats counts={orderStatusCounts} />
        </div>

        <div className="flex gap-6 flex-wrap">
          <div className="flex-1">
            <OrderList
              orders={orders}
              selectedOrderId={selectedOrderId}
              onSelectOrder={setSelectedOrderId}
              statusLabels={statusLabels}
              statusColors={statusColors}
            />
          </div>

          <OrderSummary
            order={selectedOrder}
            statusLabel={getStatusLabel(selectedOrder?.status)}
            statusColor={getStatusColor(selectedOrder?.status)}
            onStatusChange={handleStatusChange}
          />
        </div>
      </section>
    </div>
  );
}
