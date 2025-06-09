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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-amber-500 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
          <rect x="9" y="3" width="6" height="4" rx="2"></rect>
          <path d="M9 14h6"></path>
          <path d="M9 18h6"></path>
          <path d="M9 10h.01"></path>
        </svg>
        <h2 className="text-gray-800 text-xl font-semibold font-poppins">
          Ringkasan Pesanan
        </h2>
        <span className="ml-auto bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
          {items.length} item
        </span>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="relative">
              <img
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                src={item.imageUrl || "https://placehold.co/140x140"}
                alt={item.name}
              />
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {item.quantity}
              </div>
            </div>

            <div className="ml-4 flex-grow">
              <h3 className="text-gray-800 text-base font-semibold font-poppins">
                {item.name}
              </h3>
              <div className="flex items-center mt-1">
                {/* Package icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                  <path d="M12 3v6"></path>
                </svg>
                <p className="text-gray-600 text-sm">
                  {item.kemasan || "Styrofoam"}
                </p>
              </div>
            </div>

            <div className="ml-2 text-right">
              <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5">
                <span className="text-amber-800 text-sm font-bold font-poppins">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {item.quantity} × {formatCurrency(item.price)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="p-4 border-t border-gray-200 bg-amber-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-amber-600 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M7 15h0"></path>
              <path d="M11 15h0"></path>
              <path d="M7 8h0"></path>
              <path d="M11 8h0"></path>
              <path d="M15 8h0"></path>
              <path d="M15 15h0"></path>
              <path d="M15 11.5h0"></path>
              <path d="M7 11.5h0"></path>
              <path d="M11 11.5h0"></path>
            </svg>
            <span className="text-gray-800 font-semibold text-base">
              Total Pesanan:
            </span>
          </div>
          <span className="text-amber-800 font-bold text-xl">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
