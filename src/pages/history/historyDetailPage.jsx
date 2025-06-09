import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import Swal from "sweetalert2";
import HistoryDetailHeader from "./components/HistoryDetailHeader";

function HistoryDetailPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Format tanggal
    const formatDate = (timestamp) => {
        if (!timestamp) return "-";
        
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "-";
        
        return date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Format harga
    const formatPrice = (price) => {
        if (!price && price !== 0) return "0";
        return price.toLocaleString("id-ID");
    };

    // Ambil data pesanan
    const fetchOrder = async () => {
        try {
            setLoading(true);
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

            if (!response.ok) throw new Error("Gagal mengambil data pesanan");

            const data = await response.json();
            setOrder(data);
        } catch (error) {
            console.error("Error fetching order:", error);
            Swal.fire({
                title: "Error!",
                text: "Gagal memuat detail pesanan",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#15803d"
            });
            navigate("/history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <HistoryDetailHeader />
                <p>Memuat data pesanan...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Data pesanan tidak ditemukan</p>
            </div>
        );
    }

    return (
        <div className="pb-10">
            {/* Header */}
            <HistoryDetailHeader />

            {/* Konten Detail */}
            <div className="px-4 pt-26">
                <div className="flex flex-col justify-center items-center">
                    {/* Info Dasar Pesanan */}
                    <div className="mb-12">
                        <div className="flex flex-col items-center gap-4">
                            <div className="px-5 pb-2 border-b border-gray-300">
                                <p className="font-poppins font-semibold text-2xl text-center text-gray-800">Order Id: {order.id}</p>
                            </div>
                            <div>
                                <span className={`px-8 py-1 rounded-full text-sm font-poppins font-semibold mb-6 ${
                                    order.status === "completed" ? "bg-green-300 border border-gray-600 text-gray-800" :
                                    order.status === "processed" ? "bg-yellow-300 border border-yellow-600 text-gray-800" :
                                    order.status === "delivery" ? "bg-blue-200 border border-blue-600 text-gray-800" :
                                    order.status === "arrived" ? "bg-purple-300 border border-purple-600 text-gray-800" :
                                    order.status === "paid" ? "bg-green-200 border border-green-600 text-gray-800" :
                                    order.status === "cancelled" ? "bg-red-200 border border-gray-600 text-gray-800" :
                                    "bg-[#C5FACF] border border-[#00D627] text-gray-800"
                                }`}>
                                    {order.status === "pending" ? "Dalam Konfirmasi" :
                                        order.status === "processed" ? "Sedang Diproses" :
                                        order.status === "delivery" ? "Dalam Pengiriman" :
                                        order.status === "arrived" ? "Pesanan Diterima" :
                                        order.status === "paid" ? "Pesanan Lunas" :
                                        order.status === "completed" ? "Pesanan Selesai" :
                                        order.status === "cancelled" ? "Dibatalkan" :
                                        order.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info Pembayaran */}
                    <div className="border border-gray-300 px-6 pt-6 pb-3 rounded-2xl mb-10">
                        <h2 className="font-poppins font-semibold text-xl text-center mb-4">Informasi Pesanan</h2>
                        <div className="flex flex-col items-center gap-2">
                            <div>
                                <p className="font-poppins text-gray-800">Nama Pemesan: {order.receiverInfo?.name || "-"}</p>
                            </div>
                            <div>
                                <p className="font-poppins text-gray-800">Nomor WhatsApp: {order.receiverInfo?.phone || "-"}</p>
                            </div>
                            <div className="px-3 py-2 border border-gray-300 rounded-xl mb-2 shadow-md">
                                <p className="font-poppins text-sm text-center text-gray-800 mb-1">Alamat Pengiriman:</p>
                                <p className="font-poppins text-center px-6 py-2 border border-gray-400 rounded-lg text-gray-800">{order.receiverInfo?.address || "-"}</p>
                            </div>
                            {order.deliveryInfo && (
                                <>
                                    <div>
                                        <p className="font-poppins text-gray-800">
                                            Waktu Pemesanan: {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-poppins text-gray-800">
                                            Tanggal Pengiriman: {order.deliveryInfo.date ? formatDate(order.deliveryInfo.date) : "-"}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="font-poppins text-gray-800">Waktu Pengiriman: {order.deliveryInfo.time || "-"} WIB</p>
                                    </div>
                                    {order.deliveryInfo.notes && (
                                        <div className="px-3 py-2 border border-gray-300 rounded-xl mb-2 shadow-md">
                                            <p className="font-poppins text-sm text-center text-gray-800 mb-1">Catatan:</p>
                                            <p className="font-poppins text-center px-6 py-2 border border-gray-400 rounded-lg text-gray-800">{order.deliveryInfo.notes}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Daftar Produk */}
                    <div className="mb-10">
                        <h2 className="font-poppins font-semibold text-lg text-center mb-2">Menu yang dipesan:</h2>
                        <div className="flex flex-col gap-2">
                            {order.items?.map((item, index) => (
                                <div key={index} className="px-6 py-2 flex items-center justify-between border border-gray-300 rounded-2xl">
                                    <div className="flex items-center justify-between">
                                        {item.imageUrl && (
                                            <div className="flex-shrink-0 h-16 w-16 mr-4">
                                                <img className="h-16 w-16 rounded-full" src={item.imageUrl} alt={item.name} />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <div className="font-poppins font-semibold text-gray-800">
                                                {item.name}
                                            </div>
                                            <div className="font-poppins font-medium text-sm text-gray-800 mb-1">
                                                {item.kemasan}
                                            </div>
                                            <div className="font-poppins font-semibold text-lg text-orange-500">
                                                Rp{formatPrice(item.price)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-orange-500 text-white text-center font-bold rounded-full w-8 h-8 flex items-center justify-center ml-2">
                                        {item.quantity}x
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ringkasan Pembayaran */}
                    <div className="w-full max-w-md border border-gray-300 px-6 pt-3 pb-4 rounded-2xl">
                        <h2 className="font-poppins font-semibold text-xl text-center mt-2 mb-6">Ringkasan Pembayaran</h2>
                        <div className="flex justify-between items-center mb-2 font-poppins">
                            <span className="font-semibold text-[15px] text-gray-800">Uang Muka ({order.paymentInfo?.downPaymentPercent || 0}%):</span>
                            <span className="font-bold text-[18px] text-gray-800">Rp{formatPrice(order.paymentInfo?.downPaymentAmount || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2 font-poppins">
                            <span className="font-semibold text-[15px] text-gray-800">Uang Pelunasan:</span>
                            <span className="font-bold text-[18px] text-gray-800">Rp{formatPrice(order.paymentInfo?.remainingPayment || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2 font-poppins">
                            <span className="font-semibold text-[15px] text-gray-800">Sub Total:</span>
                            <span className="font-bold text-[18px] text-gray-800">Rp{formatPrice(order.paymentInfo?.subtotal || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2 font-poppins">
                            <span className="font-semibold text-[15px] text-gray-800">Ongkos Kirim:</span>
                            <span
                                className={
                                order.paymentInfo?.shipingCost === 0 || order.paymentInfo?.shipingCost == null
                                    ? 'font-semibold text-[18px] text-red-700'
                                    : 'font-bold text-[18px] text-gray-800'
                                }
                            >
                                {order.paymentInfo?.shipingCost === 0 || order.paymentInfo?.shipingCost == null
                                ? 'Belum diatur'
                                : `Rp${formatPrice(order.paymentInfo?.shipingCost)}`}
                            </span>
                        </div>
                        <div className="border-t border-gray-300 my-3"></div>
                        <div className="flex justify-between items-center font-poppins">
                            <span className="font-semibold text-xl text-gray-800">Total:</span>
                            <span className="font-bold text-xl text-orange-500">Rp{formatPrice(order.paymentInfo?.total || 0)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistoryDetailPage;