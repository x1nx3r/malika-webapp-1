import { useNavigate } from "react-router-dom"

function HistoryCard({ order }) {
    const navigate = useNavigate();

    const formatDate = (timestamp) => {
        if (!timestamp) return "-";
        
        let date;
        
        // Handle different timestamp formats
        if (timestamp.toDate && typeof timestamp.toDate === 'function') {
            // Firestore Timestamp
            date = timestamp.toDate();
        } else if (timestamp.seconds) {
            // Firestore Timestamp object with seconds property
            date = new Date(timestamp.seconds * 1000);
        } else if (timestamp instanceof Date) {
            // Already a Date object
            date = timestamp;
        } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
            // String or number timestamp
            date = new Date(timestamp);
        } else {
            // Fallback
            return "-";
        }
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return "-";
        }
        
        return date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const calculateTotalItems = (items) => {
        if (!Array.isArray(items)) return 0;
        return items.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    const formatPrice = (price) => {
        if (!price && price !== 0) return "0";
        return price.toLocaleString("id-ID");
    };

    const getTotalPrice = () => {
        // Coba beberapa kemungkinan struktur data
        if (order.paymentInfo?.total) {
            return order.paymentInfo.total;
        }
        if (order.total) {
            return order.total;
        }
        if (order.totalAmount) {
            return order.totalAmount;
        }
        
        // Jika tidak ada total yang tersedia, hitung dari items
        if (Array.isArray(order.items)) {
            return order.items.reduce((total, item) => {
                const price = item.price || 0;
                const quantity = item.quantity || 0;
                return total + (price * quantity);
            }, 0);
        }
        
        return 0;
    };

    // Validasi order object
    if (!order) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-500">Data pesanan tidak tersedia</p>
            </div>
        );
    }

    // Validasi items array
    const items = Array.isArray(order.items) ? order.items : [];

    return (
        <div className="flex justify-center items-center">
            <div className="w-[800px] bg-white rounded-2xl border border-gray-300 pl-6 pr-5 py-4">
                <div className="mb-2">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-2">
                            Order Id: {order.id}
                        </h3>
                        <span className={`px-4 py-1 rounded-full text-sm font-medium font-poppins ${
                            order.displayStatus === "Pesanan Selesai" ? "bg-green-300 border border-gray-600 text-gray-800" :
                            order.displayStatus === "Sedang Diproses" ? "bg-yellow-300 border border-yellow-600 text-gray-800" :
                            order.displayStatus === "Dalam Pengiriman" ? "bg-blue-200 border border-blue-600 text-gray-800" :
                            order.displayStatus === "Pesanan Diterima" ? "bg-purple-300 border border-purple-600 text-gray-800" :
                            order.displayStatus === "Pesanan Lunas" ? "bg-green-200 border border-green-600 text-gray-800" :
                            order.displayStatus === "Dibatalkan" ? "bg-red-200 border border-red-600 text-gray-800" :
                            "bg-[#C5FACF] border border-[#00D627] text-gray-800" // Untuk "Dalam Konfirmasi"
                        }`}>
                            {order.displayStatus}
                        </span>
                    </div>
                    <p className="text-xs text-gray-800 font-poppins">
                        {formatDate(order.createdAt)}
                    </p>
                </div>

                <div className="mb-6">
                    <ul className="text-md font-poppins text-gray-800">
                        {order.items.map((item, index) => (
                            <li key={index}>
                                • {item.name} ({item.quantity}x)
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex justify-between font-medium">
                        <span className="text-2xl font-poppins font-bold text-orange-500 cursor-default">Rp{formatPrice(getTotalPrice())}</span>
                    </div>
                    <button
                        onClick={() => navigate(`/history/${order.id}`)}
                        className="bg-green-700 px-5 py-2 text-white text-sm font-poppins font-medium rounded-lg cursor-pointer hover:bg-green-800 transition-all duration-200 ease-in"
                    >
                        <span>Detail</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HistoryCard;