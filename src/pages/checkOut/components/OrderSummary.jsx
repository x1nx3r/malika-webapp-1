export default function OrderSummary({ items }) {
  // Calculate total
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Format currency helper
  const formatCurrency = (amount) => {
    return `Rp${amount.toLocaleString("id-ID")},-`;
  };

  return (
    <div className="px-2">
      <div className="flex items-center mb-4">
        <h2 className="text-gray-800 text-2xl font-poppins font-semibold px-4">
          Menu yang dipesan:
        </h2>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start p-4"
          >
            <div className="relative">
              <img
                className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                src={item.imageUrl || "https://placehold.co/140x140"}
                alt={item.name}
              />
              <div className="absolute -top-3 -right-3 bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {item.quantity}
              </div>
            </div>

            <div className="ml-4 flex-grow">
              <h3 className="text-gray-800 text-lg font-poppins font-semibold">
                {item.name}
              </h3>
              <div className="flex items-center mt-1">
                <p className="text-gray-800 text-sm font-poppins font-medium">
                  Kemasan: {item.kemasan || "-"}
                </p>
              </div>
            </div>

            <div className="ml-2 text-right">
              <div className="text-[13px] text-gray-500 font-poppins font-medium mb-2">
                {item.quantity} × {formatCurrency(item.price)}
              </div>
              <div className="bg-yellow-50 border border-orange-400 rounded-md px-3 py-1 flex items-center">
                <span className="text-orange-600 text-sm font-bold font-poppins">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="px-8 py-3 border border-gray-200 rounded-full bg-yellow-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-gray-800 font-poppins font-semibold text-base">
              Total Harga Pesanan:
            </span>
          </div>
          <span className="text-orange-600 font-poppins font-bold text-xl">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
