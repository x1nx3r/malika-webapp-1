import PropTypes from "prop-types";
import { useState, useEffect } from "react";

export default function OrderDetails({ order }) {
  // Add a state to trigger animation when order changes
  const [animate, setAnimate] = useState(false);

  // Reset animation state when order changes
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [order.id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );
  const shippingFee = 54000;
  const total = subtotal + shippingFee;

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`lg:col-span-4 bg-white rounded-xl border border-gray-300 shadow-md h-fit transition-all duration-300 ${
        animate ? "transform scale-[1.03] shadow-lg" : ""
      }`}
    >
      <div className="h-20 bg-green-600 rounded-t-xl flex items-center px-4">
        <div className="w-10 h-10 bg-white rounded-full mr-3 flex items-center justify-center">
          <img
            src="/api/placeholder/40/40"
            alt="Icon"
            className="w-8 h-8 object-cover"
          />
        </div>
        <h3 className="text-2xl font-semibold text-white">Rincian</h3>

        {/* Order ID */}
        <div className="ml-auto bg-white/20 text-white px-3 py-1 rounded-full text-sm">
          Order #{order.id}
        </div>
      </div>

      {/* Customer and Date Info */}
      {order.orderDate && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-base font-semibold text-gray-700">
              Pelanggan:
            </div>
            <div className="text-base font-bold text-gray-900">
              {order.name}
            </div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-base font-semibold text-gray-700">
              Tanggal Order:
            </div>
            <div className="text-base text-gray-800">
              {formatDate(order.orderDate)}
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="max-h-[300px] overflow-y-auto">
        {order.items.map((item, index) => (
          <div key={index} className="border-b border-gray-200">
            <div className="p-4">
              <div className="text-lg text-green-600 font-semibold">
                Rp. {formatCurrency(item.qty * item.price)}
              </div>
              <div className="mt-3 flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.qty}x
                </div>
                <div className="ml-3">
                  <div className="text-base font-semibold text-gray-900">
                    {item.name}
                  </div>
                  {item.notes && <div className="text-sm">{item.notes}</div>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between mb-2">
          <div className="text-base font-semibold text-gray-900">
            Sub Total:
          </div>
          <div className="text-base">Rp. {formatCurrency(subtotal)}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-base font-semibold text-gray-900">
            Ongkos Kirim:
          </div>
          <div className="text-base">Rp. {formatCurrency(shippingFee)}</div>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
          <div className="text-lg font-semibold text-gray-900">Total:</div>
          <div className="text-lg font-bold text-green-600">
            Rp. {formatCurrency(total)}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 text-lg font-semibold text-gray-900">
          Status Pesanan:
        </div>
        <button
          className={`w-full py-3 rounded-lg text-white text-lg font-semibold ${
            order.status === "LUNAS" ? "bg-green-500" : "bg-orange-500"
          }`}
        >
          {order.status}
        </button>

        {/* Delivery info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Pengantaran:</p>
          <p className="text-sm font-semibold">{order.deliveryTime}</p>
          <p className="text-sm text-gray-600 mt-2 mb-1">Alamat:</p>
          <p className="text-sm">{order.address}</p>
        </div>
      </div>
    </div>
  );
}

OrderDetails.propTypes = {
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
    orderDate: PropTypes.string,
  }).isRequired,
};
