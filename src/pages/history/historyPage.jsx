import { useState, useEffect } from "react";
import HistoryHeader from "./components/HistoryHeader";
import StatusNav from "./components/StatusNav";
import HistoryCard from "./components/HistoryCard";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function HistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeStatus, setActiveStatus] = useState("Belum diproses");
    const navigate = useNavigate();

    // Fungsi untuk mengambil data pesanan dari API
    const fetchOrders = async (statusFilter) => {
        try {
            setLoading(true);
            const user = auth.currentUser;
            
            if (!user) {
                navigate("/auth");
                return;
            }

            const token = await user.getIdToken();
            const response = await fetch(`/api/orders?userId=${user.uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to fetch orders");

            const data = await response.json();
            const ordersData = [];

            // Handle berbagai format respons
            const ordersArray = Array.isArray(data) ? data : 
                            data.orders ? data.orders : 
                            data.data ? data.data : 
                            [];

            // Filter tambahan di client side sebagai safety net
            const filteredOrders = ordersArray.filter(order => {
                // Pastikan order memiliki userId dan sesuai dengan user yang login
                return order.userId === user.uid;
            });

            filteredOrders.forEach((order) => {
                // Mapping status untuk menyesuaikan dengan filter
                let displayStatus = "Dalam Konfirmasi";
                let statusMatch = false;
                
                if (statusFilter === "Belum diproses" && order.status === "pending") {
                    displayStatus = "Dalam Konfirmasi";
                    statusMatch = true;
                } 
                else if (statusFilter === "Diproses" && 
                        (order.status === "processed" || 
                        order.status === "delivery" || 
                        order.status === "arrived" || 
                        order.status === "paid")) {
                    // Set display status berdasarkan status sebenarnya
                    if (order.status === "processed") {
                        displayStatus = "Sedang Diproses";
                    } else if (order.status === "delivery") {
                        displayStatus = "Dalam Pengiriman";
                    } else if (order.status === "arrived") {
                        displayStatus = "Pesanan Diterima";
                    } else if (order.status === "paid") {
                        displayStatus = "Pesanan Lunas";
                    }
                    statusMatch = true;
                }
                else if (statusFilter === "Selesai" && order.status === "completed") {
                    displayStatus = "Pesanan Selesai";
                    statusMatch = true;
                }
                else if (statusFilter === "Dibatalkan" && order.status === "cancelled") {
                    displayStatus = "Dibatalkan";
                    statusMatch = true;
                }
                else if (statusFilter === "Semua") {
                    // Untuk filter "Semua", tampilkan semua pesanan dengan displayStatus yang sesuai
                    if (order.status === "pending") {
                        displayStatus = "Dalam Konfirmasi";
                    } else if (order.status === "processed") {
                        displayStatus = "Sedang Diproses";
                    } else if (order.status === "delivery") {
                        displayStatus = "Dalam Pengiriman";
                    } else if (order.status === "arrived") {
                        displayStatus = "Pesanan Diterima";
                    } else if (order.status === "paid") {
                        displayStatus = "Pesanan Lunas";
                    } else if (order.status === "completed") {
                        displayStatus = "Pesanan Selesai";
                    } else if (order.status === "cancelled") {
                        displayStatus = "Dibatalkan";
                    }
                    statusMatch = true;
                }
                
                // Filter berdasarkan status yang dipilih
                if (statusMatch) {
                    ordersData.push({
                        id: order._id || order.id,
                        ...order,
                        displayStatus
                    });
                }
            });

            setOrders(ordersData);
        } catch (error) {
            console.error("Error fetching orders:", error);
            Swal.fire({
                title: "Error!",
                text: "Gagal memuat data pesanan",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#15803d"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(activeStatus);
    }, [activeStatus]);

    const handleStatusClick = (status) => {
        setActiveStatus(status);
    };

    return (
        <div className="pb-10">
            <HistoryHeader />
            <StatusNav 
                onStatusClick={handleStatusClick} 
                activeStatus={activeStatus} 
            />
            
            <div className="mt-40 px-4">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <p>Memuat data...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex justify-center items-center h-40">
                        <p>Tidak ada pesanan dengan status {activeStatus}</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.map((order) => (
                            <HistoryCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HistoryPage;