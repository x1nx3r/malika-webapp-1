import PropTypes from "prop-types";

export default function OrderCard({ order, isSelected, onSelect }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "Sudah Lunas":
  //     case "Pesanan Selesai":
  //       return "text-green-600";
  //     case "Pesanan Dibatalkan":
  //       return "text-red-600";
  //     default:
  //       return "text-orange-500";
  //   }
  // };

  const getStatusColor = (status) => {
    switch (status) {
      case "Dalam Konfirmasi":
        return "bg-orange-500";
      case "Sudah DP & Diproses":
        return "bg-yellow-500";
      case "Dalam Pengiriman":
        return "bg-blue-500";
      case "Pesanan Diterima":
        return "bg-green-500";
      case "Sudah Lunas":
        return "bg-green-500";
      case "Pesanan Selesai":
        return "bg-green-500";
      case "Pesanan Dibatalkan":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={`w-full bg-white shadow-lg rounded-3xl border border-gray-300 transition-all duration-200 cursor-pointer
        ${
          isSelected
            ? "ring-2 ring-orange-500 shadow-lg transform scale-[1.01]"
            : "hover:shadow-xl"
        }
        border-gray-200`}
      onClick={onSelect}
    >
      <div className="p-6">
        <div className="flex justify-between pr-2">

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="border border-gray-300 rounded-xl px-4 py-2 drop-shadow">
                <h3 className={`font-semibold`}>
                  Order ID: {order.id}
                </h3>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 ml-2 mb-4">
              Atas Nama: {order.name}
            </h3>

            <div className="mt-3 ml-2">
              <div className="flex items-center">
                <div className="text-base">Waktu Pengantaran:</div>
                <div className="text-lg font-bold ml-2 text-orange-500">
                  {order.deliveryTime}
                </div>
              </div>
            </div>
          </div>
          
          {/* <div className="col-span-5">
            {order.items.map((item, idx) => (
              <div key={idx} className="text-base mb-1 truncate">
                {item.name}
              </div>
            ))}
          </div>
          <div className="col-span-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="text-base mb-1 text-center">
                {item.qty} x Rp. {formatCurrency(item.price)}
              </div>
            ))}
          </div> */}

          {/* Foto Customer */}
          <div className="mt-6">
            <div className="w-20 h-24 bg-gray-200 rounded-full overflow-hidden drop-shadow">
              <img
                src="https://gevannoyoh.com/thumb-malika/customer.webp"
                alt="Customer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="w-95 mt-4 border border-gray-300 rounded-xl py-2 px-4 drop-shadow">
            <div className="text-sm">Alamat: {order.address}</div>
          </div>

          <div className={`mt-4 text-white px-1 py-1 rounded-lg drop-shadow ${getStatusColor(order.status)}`}>
            <span className="text-sm font-medium px-2 py-1">
              {order.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

OrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        qty: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        notes: PropTypes.string,
      })
    ).isRequired,
    deliveryTime: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};