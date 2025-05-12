function CartHeader({ onBack }) {
  return (
    <div className="w-full h-16 bg-green-700 rounded-bl-lg rounded-br-lg outline outline-1 outline-offset-[-1px] outline-zinc-300">
      <div className="w-32 h-10 left-4 top-3 absolute border border-black/20" />
      <div className="absolute right-4 top-3">
        <button
          onClick={onBack}
          className="w-28 h-10 bg-white rounded-lg overflow-hidden flex items-center hover:bg-gray-50 transition-colors"
        >
          <div className="w-6 h-6 ml-2 rotate-90">
            <div className="w-4 h-3 mx-auto my-1.5 bg-stone-950" />
          </div>
          <span className="ml-2 text-stone-950 text-sm font-semibold font-['Poppins']">
            Kembali
          </span>
        </button>
      </div>
      <div className="absolute left-1/2 top-4 transform -translate-x-1/2 flex items-center">
        <div className="w-8 h-8 mr-2 overflow-hidden">
          <div className="w-1 h-1 left-2 top-6 absolute bg-zinc-100" />
          <div className="w-1 h-1 right-2 top-6 absolute bg-zinc-100" />
          <div className="w-7 h-5 left-0.5 top-1 absolute bg-zinc-100" />
        </div>
        <h1 className="text-white text-xl font-semibold font-['Poppins']">
          Keranjangku
        </h1>
      </div>
    </div>
  );
}

export default CartHeader;
