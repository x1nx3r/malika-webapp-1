import PropTypes from "prop-types";

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

  return (
    <div
      onClick={onClick}
      className={`mb-6 border ${
        order.orderBorder
      } rounded-lg shadow-lg p-6 bg-white ${
        isSelected ? "ring-2 ring-blue-500" : ""
      } cursor-pointer`}
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className={`font-semibold text-xl ${textColor}`}>
              Atas Nama: {order.customer}
            </h3>
            <span
              className={`px-2 py-1 text-sm rounded-md text-white ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>

          {/* Order Items */}
          <div className="flex">
            <div className="flex-1">
              <ul className="text-lg space-y-1">
                {order.items.map((item, i) => (
                  <li key={i}>• {item.name}</li>
                ))}
              </ul>
            </div>
            <div className="w-48 text-center">
              <ul className="text-lg space-y-1">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.quantity} x Rp. {item.price.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="flex mt-4">
            <div className="flex-1">
              <p className="text-lg">Waktu Pengantaran</p>
            </div>
            <div className="w-48 text-center">
              <p className={`text-lg font-bold ${textColor}`}>
                {order.deliveryTime}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="border border-gray-400 rounded p-3 mt-4">
            <p className="text-sm">Alamat: {order.address}</p>
          </div>
        </div>

        {/* Customer Image */}
        <div className="ml-4">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
            <img
              src="/api/placeholder/190/190"
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
    deliveryTime: PropTypes.string.isRequired,
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
