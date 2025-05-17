export default function PaymentDetails({
  subtotal,
  downPaymentPercent,
  setDownPaymentPercent,
  downPaymentAmount,
  remainingPayment,
}) {
  // Format currency helper
  const formatCurrency = (amount) => {
    return `Rp${amount.toLocaleString("id-ID")},-`;
  };

  return (
    <div className="p-3">
      <h2 className="text-stone-950 text-lg font-semibold font-poppins mb-2">
        Pembayaran Uang Muka
      </h2>
      <p className="text-black text-xs font-poppins mb-2">
        Berapa persen yang Anda bayarkan untuk uang muka?
      </p>

      <div className="flex items-center mb-3">
        <input
          type="range"
          min="10"
          max="100"
          step="10"
          value={downPaymentPercent}
          onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
          className="mr-2 flex-grow"
        />
        <div className="w-16 h-7 rounded border border-slate-500 flex items-center justify-center px-2">
          <span className="text-stone-950 text-sm font-poppins">
            {downPaymentPercent}%
          </span>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-amber-500 rounded p-2 mb-2 flex justify-between items-center">
        <span className="text-zinc-100 text-sm font-semibold font-poppins">
          Subtotal:
        </span>
        <span className="text-zinc-100 text-sm font-poppins">
          {formatCurrency(subtotal)}
        </span>
      </div>

      <div className="bg-green-700 rounded p-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-zinc-100 text-sm font-semibold font-poppins">
            Uang Muka:
          </span>
          <span className="text-zinc-100 text-sm font-poppins">
            {formatCurrency(downPaymentAmount)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-1 text-sm">
        <span className="font-semibold font-poppins">Sisa pembayaran:</span>
        <span className="text-amber-500 font-poppins">
          {formatCurrency(remainingPayment)}
        </span>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold font-poppins">Ongkos Kirim:</span>
        <span className="text-amber-500 font-poppins">Nanti</span>
      </div>
    </div>
  );
}
