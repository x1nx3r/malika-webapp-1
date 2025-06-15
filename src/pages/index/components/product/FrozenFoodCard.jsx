function FrozenFoodCard({ product, onAddToCart, isLoading }) {
  return (
    <div className="w-full sm:w-64 lg:w-75.5 bg-white drop-shadow rounded-2xl overflow-hidden flex flex-col cursor-default">
      {/* Product Image with Badge */}
      <div className="relative">
        <img
          className="w-full h-44 sm:h-48 object-cover"
          src={product.imageUrl}
          alt={product.name}
        />
        {/* Amount Badge */}
        <div className="absolute top-0 right-4 bg-[#028643] drop-shadow rounded-b-lg text-center px-2 py-1 flex flex-col">
          <span className="text-white text-sm sm:text-base font-poppins font-medium leading-tight">
            isi
          </span>
          <span className="text-white text-sm sm:text-base font-poppins font-medium leading-tight -mt-0.5">
            {product.amount}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        {/* Product Title */}
        <h3 className="text-black text-lg font-poppins font-semibold leading-5">
          {product.name}
        </h3>

        {/* Price and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
          <div className="flex items-center bg-[#03081F] rounded-lg px-3 py-1.5 text-center">
            <span className="text-white text-sm font-poppins font-semibold">
              Rp{product.price.toLocaleString("id-ID")}/pax
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isLoading}
            className={`
              px-3 py-1.5 rounded-lg flex items-center justify-center cursor-default
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FC8A06] hover:bg-[#e07c05] active:bg-[#d07000]"
              }
              transition-all duration-200 ease-in
            `}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="flex items-center space-x-1.5 cursor-pointer">
                {/* Cart Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                >
                  <circle cx="176" cy="416" r="32" />
                  <circle cx="400" cy="416" r="32" />
                  <path d="M456.8 120.78a23.92 23.92 0 0 0-18.56-8.78H133.89l-6.13-34.78A16 16 0 0 0 112 64H48a16 16 0 0 0 0 32h50.58l45.66 258.78A16 16 0 0 0 160 368h256a16 16 0 0 0 0-32H173.42l-5.64-32h241.66A24.07 24.07 0 0 0 433 284.71l28.8-144a24 24 0 0 0-5-19.93" />
                </svg>
                <span className="text-white text-sm font-poppins font-medium">
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
