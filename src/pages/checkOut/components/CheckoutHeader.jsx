export default function CheckoutHeader({ onCancel }) {
  return (
    <header className="bg-green-700 py-6 px-8 rounded-b-2xl border-2 border-t-0 border-zinc-300">
      <div className="flex items-center justify-between">
        <div className="w-48 h-16 border border-black/20"></div>

        <h1 className="text-white text-4xl font-semibold font-poppins">
          Checkout
        </h1>

        <button
          onClick={onCancel}
          className="bg-white px-6 py-2 rounded-xl flex items-center"
        >
          <span className="text-stone-950 text-xl font-semibold font-poppins">
            Batalkan
          </span>
        </button>
      </div>
    </header>
  );
}
