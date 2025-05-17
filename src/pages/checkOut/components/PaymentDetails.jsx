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
    <div className="p-6">
      <h2 className="text-stone-950 text-2xl font-semibold font-poppins mb-4">
        Pembayaran Uang Muka
      </h2>
      <p className="text-black text-sm font-poppins mb-4">
        Berapa persen yang Anda bayarkan
        <br />
        untuk uang muka?
      </p>

      <div className="flex items-center mb-8">
        <input
          type="range"
          min="10"
          max="100"
          step="10"
          value={downPaymentPercent}
          onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
          className="mr-4"
        />
        <div className="w-24 h-10 rounded-[10px] border border-slate-950 flex items-center justify-between px-4">
          <span className="text-stone-950 text-base font-poppins">
            {downPaymentPercent}%
          </span>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-amber-500 rounded-lg p-3 mb-4 flex justify-between items-center">
        <span className="text-zinc-100 text-xl font-semibold font-poppins">
          Subtotal:
        </span>
        <span className="text-zinc-100 text-xl font-poppins">
          {formatCurrency(subtotal)}
        </span>
      </div>

      <div className="bg-green-700 rounded-lg p-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-zinc-100 text-xl font-semibold font-poppins">
            Uang Muka yang
            <br />
            perlu dibayar:
          </span>
          <span className="text-zinc-100 text-xl font-poppins">
            {formatCurrency(downPaymentAmount)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-black text-xl font-semibold font-poppins">
          Sisa yang perlu
          <br />
          dibayar:
        </span>
        <span className="text-amber-500 text-xl font-poppins">
          {formatCurrency(remainingPayment)}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-black text-xl font-semibold font-poppins">
          Ongkos Kirim:
        </span>
        <span className="text-amber-500 text-xl font-poppins">Nanti</span>
      </div>
    </div>
  );
}
