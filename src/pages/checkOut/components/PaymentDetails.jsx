export default function PaymentDetails({
  subtotal,
  downPaymentPercent,
  setDownPaymentPercent,
  downPaymentAmount,
  remainingPayment,
}) {
  // Dropdown percentage options
  const percentOptions = [50, 60, 70, 80, 90, 100];

  // Format currency helper
  const formatCurrency = (amount) => {
    return `Rp${amount.toLocaleString("id-ID")},-`;
  };

  // Handle dropdown change
  const handleDropdownChange = (e) => {
    setDownPaymentPercent(parseInt(e.target.value));
  };

  return (
    <div className="px-6 py-4">
      <div className="flex items-center mb-3">
        <h2 className="text-gray-800 text-xl font-poppins font-semibold">
          Pembayaran Uang Muka:
        </h2>
      </div>

      <div className="flex justify-between items-center mb-10">
        <p className="font-poppins text-sm text-gray-800 mb-2">
          Pilih berapa persen yang Anda bayarkan untuk uang muka?
        </p>
        {/* Dropdown selector */}
        <div className="relative">
            <select
              value={downPaymentPercent}
              onChange={handleDropdownChange}
              className="appearance-none border border-gray-400 rounded-lg px-4 py-1 pr-8 text-gray-800 font-poppins font-semibold text-lg cursor-pointer focus:outline-none focus:border-gray-600 transition-all duration-150 ease-in"
            >
              {percentOptions.map((percent) => (
                <option key={percent} value={percent}>
                  {percent}%
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0.5 flex items-center px-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="64" d="m112 184l144 144l144-144" />
              </svg>
            </div>
          </div>
      </div>

      {/* Payment Summary */}
      <div className="space-y-2">
        {/* Down Payment */}
        <div className="flex items-center justify-between px-3 py-4 bg-yellow-50 rounded-xl border border-yellow-400">
          <div className="flex items-center">
            <div className="flex flex-col">
              <span className="text-gray-800 text-md font-poppins font-medium">
                Uang Muka:
              </span>
              <span className="text-gray-600 text-xs font-poppins">Dibayar sekarang</span>
            </div>
          </div>
          <span className="text-gray-800 font-bold font-poppins text-lg">
            {formatCurrency(downPaymentAmount)}
          </span>
        </div>

        {/* Remaining Payment */}
        <div className="flex items-center justify-between px-3 py-4 bg-yellow-50 rounded-xl border border-yellow-400">
          <div className="flex items-center">
            <div className="flex flex-col">
              <span className="text-gray-800 text-md font-poppins font-medium">
                Sisa Pembayaran:
              </span>
              <span className="text-gray-600 text-xs font-poppins">
                Dibayar saat pesanan tiba
              </span>
            </div>
          </div>
          <span className="text-gray-800 font-bold font-poppins text-lg">
            {formatCurrency(remainingPayment)}
          </span>
        </div>

        {/* Shipping Cost */}
        <div className="flex items-center justify-between px-3 py-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <span className="text-gray-800 font-poppins text-sm font-medium">Ongkos Kirim:</span>
          </div>
          <span className="text-orange-500 font-poppins font-medium text-sm">
            Ditentukan nanti
          </span>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between px-3 py-4 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex items-center">
            <span className="text-gray-800 font-poppins text-sm font-medium">Subtotal:</span>
          </div>
          <span className="text-gray-800 font-bold font-poppins">
            {formatCurrency(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}