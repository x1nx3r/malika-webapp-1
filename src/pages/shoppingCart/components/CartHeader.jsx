function CartHeader({ onBack }) {
  return (
    <div className="w-full h-16 bg-green-700 rounded-bl-lg rounded-br-lg outline outline-1 outline-offset-[-1px] outline-zinc-300">
      {/* Logo placeholder */}
      <div className="w-32 h-10 left-4 top-3 absolute border border-black/20 flex items-center justify-center text-white font-semibold">
        LOGO
      </div>

      {/* Back button with proper arrow icon */}
      <div className="absolute right-4 top-3">
        <button
          onClick={onBack}
          className="w-28 h-10 bg-white rounded-lg overflow-hidden flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className="rotate-90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <span className="ml-1 text-stone-950 text-sm font-semibold font-['Poppins']">
            Kembali
          </span>
        </button>
      </div>

      {/* Title with shopping cart icon */}
      <div className="absolute left-1/2 top-4 transform -translate-x-1/2 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <h1 className="text-white text-xl font-semibold font-['Poppins']">
          Keranjangku
        </h1>
      </div>
    </div>
  );
}

export default CartHeader;
