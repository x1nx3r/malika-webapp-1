import PropTypes from "prop-types";

export default function OrderSummary({ order, onStatusChange }) {
  if (!order) return null;

  // Calculate total price
  const calculateTotal = () => {
    return order.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  // Shipping cost (in this example it's 0)
  const shippingCost = 0;

  // Calculate DP amount (50% of total)
  const dpAmount = Math.floor(calculateTotal() * 0.5);

  return (
    <div className="w-96 bg-white rounded-xl border border-gray-200 shadow-md h-fit">
      {/* Customer Header */}
      <div className="bg-green-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center">
          <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          <h3 className="font-bold text-xl">{order.customer}</h3>
        </div>
      </div>

      {/* Order Items List */}
      <div className="divide-y divide-gray-200">
        {order.items.map((item, index) => (
          <div key={index} className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="bg-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2">
                  {item.quantity}x
                </span>
                <div>
                  <p className="font-medium text-green-700">{`Rp. ${item.price.toLocaleString()}`}</p>
                  <p>{item.name}</p>
                  {item.note && (
                    <p className="text-gray-500 text-sm">{item.note}</p>
                  )}
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="p-4 bg-gray-50">
        <div className="flex justify-between mb-2">
          <p className="font-medium">Sub Total:</p>
          <p className="font-bold">{`Rp. ${calculateTotal().toLocaleString()}`}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Ongkos Kirim:</p>
          <p className="font-bold text-red-500">{`Rp. ${shippingCost.toLocaleString()}`}</p>
        </div>
      </div>

      {/* Shipping Cost Input */}
      <div className="p-4 bg-gray-100 border-t border-gray-200">
        <div className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2">
          <svg
            className="h-5 w-5 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <input
            type="text"
            placeholder="Masukkan Nominal Ongkir..."
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onStatusChange(order.id, "dp")}
            className="bg-orange-400 hover:bg-orange-500 text-white py-3 px-4 rounded-md transition duration-200"
          >
            <div className="text-center">
              <div className="font-bold">Sudah DP</div>
              <div className="text-sm">50%</div>
              <div className="text-sm">{`Rp. ${dpAmount.toLocaleString()}`}</div>
            </div>
          </button>
          <button
            onClick={() => onStatusChange(order.id, "lunas")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md transition duration-200"
          >
            <div className="text-center">
              <div className="font-bold">Lunas</div>
              <div className="text-sm">50%+Ongkir</div>
              <div className="text-sm">Belum Dibayar</div>
            </div>
          </button>
        </div>

        <button
          onClick={() => onStatusChange(order.id, "invoice")}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 px-4 rounded-md transition duration-200 font-bold"
        >
          Kirim Invoice
        </button>

        <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md transition duration-200">
          Konfirmasi Pesanan Dikirim
        </button>
      </div>
    </div>
  );
}

OrderSummary.propTypes = {
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
  }),
  statusLabel: PropTypes.string.isRequired,
  statusColor: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func,
};

OrderSummary.defaultProps = {
  onStatusChange: () => {},
};
