import PropTypes from "prop-types";
import { useState, useEffect } from "react";

export default function OrderDetails({ order }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [order?.id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  const subtotal = order?.paymentInfo?.subtotal || 0;
  const shippingFee = order?.paymentInfo?.shipingCost || 0;
  const total = order?.paymentInfo?.total || subtotal + shippingFee;

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

  if (!order) return null;

  return (
    <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-300 drop-shadow h-fit">
      <div className="h-20 bg-green-700 rounded-t-3xl flex items-center justify-center px-4">
        <div className="mr-3 mt-1 flex items-center justify-center">
          <img
            src="https:gevannoyoh.com/thumb-malika/basket.webp"
            alt="Icon"
            className="w-9 h-9 object-cover"
          />
        </div>
        <h3 className="text-2xl font-semibold text-white">Rincian</h3>
      </div>

      <div className="py-3 px-5 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-base font-semibold text-gray-700">Pelanggan:</div>
          <div className="text-lg font-bold text-gray-900">{order.name}</div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="text-base font-semibold text-gray-700">Tanggal Order:</div>
          <div className="text-lg text-gray-800">{order.orderDate}</div>
        </div>
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        {order.items.map((item, index) => (
          <div key={index} className="border-b border-gray-200">
            <div className="py-3 px-5">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.qty}x
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="text-base font-semibold text-gray-900 break-words whitespace-normal">
                    {item.name}
                  </div>
                  {item.notes && <div className="text-sm">{item.notes}</div>}
                </div>
                <div className="ml-2 text-lg text-green-600 font-semibold whitespace-nowrap">
                  Rp. {formatCurrency(item.qty * item.price)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="py-3 px-5 border-b border-gray-200">
        <div className="flex justify-between mb-2 px-2">
          <div className="text-base font-semibold text-gray-900">Sub Total:</div>
          <div className="text-base">Rp. {formatCurrency(subtotal)}</div>
        </div>
        <div className="flex justify-between px-2">
          <div className="text-base font-semibold text-gray-900">Ongkos Kirim:</div>
          <div className="text-base">Rp. {formatCurrency(shippingFee)}</div>
        </div>

        <div className="flex justify-between mt-3 pt-3 px-2 border-t border-gray-200">
          <div className="text-lg font-semibold text-gray-900">Total:</div>
          <div className="text-lg font-bold text-green-600">
            Rp. {formatCurrency(total)}
          </div>
        </div>
      </div>

      <div className="pt-3 px-5 pb-5">
        <div className="mb-3 text-lg font-semibold text-gray-900 px-2">
          Status Pesanan:
        </div>
        <button
          className={`w-full py-2 rounded-xl text-white text-lg font-semibold ${
            order.status === "Sudah Lunas" || order.status === "Pesanan Selesai" ? "bg-green-500" : 
            order.status === "Pesanan Dibatalkan" ? "bg-red-500" : "bg-orange-500"
          }`}
        >
          {order.status}
        </button>
      </div>
    </div>
  );
}

OrderDetails.propTypes = {
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
    orderDate: PropTypes.string,
  }),
};