import PropTypes from "prop-types";

export default function OrderCard({ order, isSelected, onSelect }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  return (
    <div
      className={`w-full bg-white shadow-md rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${
          isSelected
            ? "ring-2 ring-orange-500 shadow-lg transform scale-[1.02]"
            : "hover:shadow-lg"
        }
        ${order.highlighted ? "border-orange-500" : "border-gray-200"}`}
      onClick={onSelect}
    >
      <div className="p-4">
        <h3
          className={`text-xl font-semibold ${
            order.highlighted ? "text-orange-500" : "text-gray-900"
          }`}
        >
          Atas Nama: {order.name}
        </h3>
        <div className="grid grid-cols-12 gap-2 mt-3">
          <div className="col-span-5">
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
          </div>
          <div className="col-span-3 flex justify-end">
            <img
              src="/api/placeholder/80/100"
              alt="Profile"
              className="w-20 h-24 rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center">
            <div className="text-base">Waktu Pengantaran:</div>
            <div className="text-base font-bold ml-2 text-gray-900">
              {order.deliveryTime}
            </div>
          </div>
        </div>
        <div className="mt-2 border border-gray-300 rounded p-2">
          <div className="text-sm">Alamat: {order.address}</div>
        </div>

        {/* Add a status indicator */}
        <div
          className={`mt-2 text-right ${
            order.status === "LUNAS" ? "text-green-600" : "text-orange-500"
          }`}
        >
          <span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-100">
            {order.status}
          </span>
        </div>
      </div>
    </div>
  );
}

OrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
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
    highlighted: PropTypes.bool,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};
