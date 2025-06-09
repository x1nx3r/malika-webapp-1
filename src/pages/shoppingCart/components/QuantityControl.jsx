function QuantityControl({ quantity, onIncrease, onDecrease }) {
  return (
    <div className="w-24 h-10 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-row items-center overflow-hidden">
      <button
        className="w-8 h-full bg-green-700 flex items-center justify-center hover:bg-green-800 active:bg-green-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        disabled={quantity <= 1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform hover:scale-110"
        >
          <path d="M5 12h14" />
        </svg>
      </button>

      <div className="flex-grow flex items-center justify-center bg-gray-50 h-full">
        <span className="text-black text-base font-semibold font-['Poppins'] px-2 select-none">
          {quantity}
        </span>
      </div>

      <button
        className="w-8 h-full bg-green-700 flex items-center justify-center hover:bg-green-800 active:bg-green-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        onClick={onIncrease}
        aria-label="Increase quantity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform hover:scale-110"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      </button>
    </div>
  );
}

export default QuantityControl;
