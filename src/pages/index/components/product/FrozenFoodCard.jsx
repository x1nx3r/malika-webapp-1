function FrozenFoodCard({ product, onAddToCart, isLoading }) {
  return (
    <div className="w-full sm:w-64 lg:w-80 bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
      {/* Product Image with Badge */}
      <div className="relative">
        <img
          className="w-full h-44 sm:h-48 object-cover"
          src={product.imageUrl}
          alt={product.name}
        />
        {/* Amount Badge */}
        <div className="absolute top-0 right-0 bg-[#028643] shadow-sm rounded-bl-md text-center px-2 py-1">
          <span className="text-white text-sm sm:text-base font-medium leading-tight">
            isi
            <br />
            {product.amount}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        {/* Product Title */}
        <h3 className="text-black text-lg font-semibold leading-tight">
          {product.name}
        </h3>

        {/* Price and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
          <div className="bg-[#03081F] rounded px-3 py-1.5 text-center">
            <span className="text-white text-sm font-semibold">
              Rp{product.price.toLocaleString("id-ID")}/pax
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isLoading}
            className={`
              px-3 py-1.5 rounded flex items-center justify-center
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FC8A06] hover:bg-[#e07c05] active:bg-[#d07000]"
              }
              transition-colors
            `}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="flex items-center space-x-1.5">
                {/* Cart Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-white text-sm font-medium">
                  Tambahkan
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FrozenFoodCard;
