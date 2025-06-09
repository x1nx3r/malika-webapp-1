import { useState } from "react";

export default function PaymentDetails({
  subtotal,
  downPaymentPercent,
  setDownPaymentPercent,
  downPaymentAmount,
  remainingPayment,
}) {
  const [isCustom, setIsCustom] = useState(false);

  // Quick select percentages
  const percentOptions = [25, 50, 75, 100];

  // Format currency helper
  const formatCurrency = (amount) => {
    return `Rp${amount.toLocaleString("id-ID")},-`;
  };

  // Handle quick select
  const handleQuickSelect = (percent) => {
    setDownPaymentPercent(percent);
    setIsCustom(false);
  };

  // Handle custom slider change
  const handleSliderChange = (e) => {
    setDownPaymentPercent(parseInt(e.target.value));
    setIsCustom(true);
  };

  return (
    <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-200">
      <div className="flex items-center mb-3">
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
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
        <h2 className="text-gray-800 text-lg font-semibold font-poppins">
          Pembayaran Uang Muka
        </h2>
      </div>

      <div className="bg-amber-50 rounded-lg p-3 mb-4 border border-amber-100">
        <p className="text-gray-700 text-sm font-poppins mb-3 flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-amber-500 mr-1 mt-0.5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </p>

        {/* Quick select buttons */}
        <div className="flex justify-between mb-4">
          {percentOptions.map((percent) => (
            <button
              key={percent}
              type="button"
              onClick={() => handleQuickSelect(percent)}
              className={`w-16 py-1.5 rounded-lg text-sm font-medium transition-all
                ${
                  downPaymentPercent === percent && !isCustom
                    ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
            >
              {percent}%
            </button>
          ))}
        </div>

        {/* Custom slider */}
        <div className="mb-2">
          <div className="flex justify-between items-center text-xs text-gray-500 px-1 mb-1">
            <span>10%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <div className="flex items-center">
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={downPaymentPercent}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              aria-label="Persentase uang muka"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${downPaymentPercent}%, #e5e7eb ${downPaymentPercent}%, #e5e7eb 100%)`,
              }}
            />
          </div>
        </div>

        {/* Selected percentage display */}
        <div className="flex justify-center">
          <div className="bg-white border border-amber-300 rounded-full px-4 py-1 shadow-sm">
            <span className="text-amber-800 font-bold text-lg">
              {downPaymentPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
              <path d="M12 13V7"></path>
              <path d="M9 10h6"></path>
            </svg>
            <span className="text-gray-700 font-medium">Total Pesanan:</span>
          </div>
          <span className="text-gray-900 font-semibold font-poppins">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Down Payment */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            <div>
              <span className="text-green-800 font-medium block">
                Uang Muka:
              </span>
              <span className="text-green-700 text-xs">Dibayar sekarang</span>
            </div>
          </div>
          <span className="text-green-800 font-bold font-poppins text-lg">
            {formatCurrency(downPaymentAmount)}
          </span>
        </div>

        {/* Remaining Payment */}
        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
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
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
            <div>
              <span className="text-amber-800 font-medium block">
                Sisa Pembayaran:
              </span>
              <span className="text-amber-700 text-xs">
                Dibayar saat pesanan tiba
              </span>
            </div>
          </div>
          <span className="text-amber-800 font-bold font-poppins text-lg">
            {formatCurrency(remainingPayment)}
          </span>
        </div>

        {/* Shipping Cost */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span className="text-blue-800 font-medium">Ongkos Kirim:</span>
          </div>
          <div className="bg-white px-3 py-1 rounded-full border border-blue-200">
            <span className="text-blue-700 font-medium text-sm">
              Ditentukan nanti
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
