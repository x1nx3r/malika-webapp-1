import PropTypes from "prop-types";

// Fungsi pembantu untuk memformat tanggal pengantaran
const formatTanggalPengantaran = (tanggalString, waktuString) => {
  if (!tanggalString || !waktuString) return "Waktu tidak tersedia";
  
  try {
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);
    
    const tanggalPengantaran = new Date(tanggalString);
    const waktuPengantaran = waktuString;
    
    // Hitung selisih hari
    const selisihHari = Math.floor((tanggalPengantaran - hariIni) / (1000 * 60 * 60 * 24));
    
    let bagianTanggal;
    if (selisihHari === 0) {
      bagianTanggal = "Hari ini";
    } else if (selisihHari === 1) {
      bagianTanggal = "Besok";
    } else if (selisihHari === 2) {
      bagianTanggal = "2 Hari Lagi";
    } else if (selisihHari === 3) {
      bagianTanggal = "3 Hari Lagi";
    } else {
      // Format sebagai "07 Juni 2025" untuk locale Indonesia
      bagianTanggal = tanggalPengantaran.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
    
    return `${bagianTanggal}, ${waktuPengantaran}`;
  } catch (e) {
    console.error("Gagal memformat tanggal pengantaran:", e);
    return `${tanggalString}, ${waktuString}`; // Fallback ke format asli
  }
};

export default function OrderCard({
  order,
  isSelected,
  onClick,
  statusLabels,
  statusColors,
}) {
  const isHighlighted = order.orderBorder === "border-orange-500";
  const textColor = isHighlighted ? "text-orange-500" : "text-slate-900";
  const statusLabel = statusLabels[order.status] || "";
  const statusColor = statusColors[order.status] || "bg-gray-500";
  
  // Format waktu pengantaran
  const waktuPengantaranTertata = formatTanggalPengantaran(
    order.deliveryInfo?.date, 
    order.deliveryInfo?.time
  );

  return (
    <div
      onClick={onClick}
      className={`mb-6 border border-gray-300 ${
        order.orderBorder
      } rounded-3xl shadow-lg p-6 bg-white ${
        isSelected ? "ring-2 ring-orange-500" : ""
      } cursor-pointer`}
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <div className="border border-gray-300 rounded-xl px-4 py-2 drop-shadow">
            <h3 className={`font-semibold ${textColor}`}>
              Order ID: {order.id}
            </h3>
          </div>
          <div className="w-1"></div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <h3 className={`font-semibold text-xl ${textColor}`}>
              Atas Nama: {order.customer}
            </h3>
            <span
              className={`px-3 py-1 rounded-lg drop-shadow font-poppins ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>

          {/* Daftar Item */}
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <ul className="text-lg">
                {order.items.map((item, i) => (
                  <li key={i}>• {item.name}</li>
                ))}
              </ul>
            </div>
            <div className="w-auto text-center">
              <ul className="text-lg">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.quantity} x Rp. {item.price.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Waktu Pengantaran */}
          <div className="flex mt-4">
            <div className="flex-1">
              <span className="text-lg">Waktu Pengantaran:</span>
              <span className="text-lg font-bold"> {waktuPengantaranTertata}</span>
            </div>
          </div>

          {/* Alamat */}
          <div className="border border-gray-300 rounded-xl py-2 px-4 mt-4 drop-shadow">
            <p className="">Alamat: {order.address}</p>
          </div>
        </div>

        {/* Foto Customer */}
        <div className="ml-4 mt-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden drop-shadow">
            <img
              src="https://gevannoyoh.com/thumb-malika/customer.webp"
              alt="Customer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

OrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    customer: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        note: PropTypes.string,
      })
    ).isRequired,
    deliveryInfo: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
      notes: PropTypes.string,
    }),
    address: PropTypes.string.isRequired,
    orderBorder: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  statusLabels: PropTypes.object.isRequired,
  statusColors: PropTypes.object.isRequired,
};

OrderCard.defaultProps = {
  isSelected: false,
};