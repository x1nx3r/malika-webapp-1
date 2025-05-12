function QuantityControl({ quantity, onIncrease, onDecrease }) {
  return (
    <div className="w-10 h-24 ml-4 bg-zinc-100 rounded-md shadow-md flex flex-col">
      <button
        className="w-10 h-8 bg-green-700 flex items-center justify-center hover:bg-green-800 transition-colors"
        onClick={onIncrease}
      >
        <span className="text-zinc-100 text-lg font-semibold">+</span>
      </button>
      <div className="border-t border-zinc-800"></div>
      <div className="flex-grow flex items-center justify-center">
        <span className="text-black text-base font-semibold">{quantity}</span>
      </div>
      <div className="border-t border-zinc-800"></div>
      <button
        className="w-10 h-8 bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
        onClick={onDecrease}
      >
        <span className="text-zinc-100 text-lg font-semibold">-</span>
      </button>
    </div>
  );
}

export default QuantityControl;
