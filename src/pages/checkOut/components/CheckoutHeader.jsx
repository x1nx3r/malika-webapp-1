export default function CheckoutHeader({ onCancel }) {
  return (
    <header className="bg-green-700 py-3 px-4 rounded-b-lg border border-t-0 border-zinc-300">
      <div className="flex items-center justify-between">
        <div className="w-32 h-10 border border-black/20"></div>
        <h1 className="text-white text-2xl font-semibold font-poppins">
          Checkout
        </h1>
        <button
          onClick={onCancel}
          className="bg-white px-4 py-1 rounded-lg flex items-center"
        >
          <span className="text-stone-950 text-base font-semibold font-poppins">
            Batalkan
          </span>
        </button>
      </div>
    </header>
  );
}
