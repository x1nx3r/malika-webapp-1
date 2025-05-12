function FrozenFoodCard({ product, onAddToCart, isLoading }) {
  return (
    <div className="w-full sm:w-[20rem] lg:w-[24.25rem] h-auto bg-white shadow-xl rounded-[0.75rem] sm:rounded-[1rem] overflow-hidden flex flex-col">
      <div className="relative">
        <img
          className="w-full h-[12rem] sm:h-[14.125rem] object-cover"
          src={product.imageUrl}
          alt={product.name}
        />
        <div className="w-[3rem] h-[3rem] sm:w-[3.75rem] sm:h-[3.75rem] absolute top-0 right-0 bg-[#028643] shadow-md rounded-bl-[0.375rem] sm:rounded-bl-[0.5rem] flex items-center justify-center">
          <div className="text-center text-white text-lg sm:text-2xl font-semibold font-['Poppins'] leading-[1.25rem] sm:leading-[1.5rem]">
            {product.kemasan}
          </div>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="text-black text-lg sm:text-xl font-semibold font-['Poppins'] leading-tight sm:leading-[1.25rem]">
            {product.name}
          </div>
          {product.description && (
            <div className="text-gray-600 text-sm mt-2 font-['Poppins']">
              {product.description}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-4">
          <div className="w-full sm:w-[9.938rem] h-[2.25rem] bg-[#03081F] rounded-[0.375rem] flex items-center justify-center">
            <div className="text-center text-[#F0F0F0] text-base sm:text-lg font-bold font-['Poppins']">
              Rp{product.price.toLocaleString("id-ID")},-
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isLoading}
            className={`w-full sm:w-[9.938rem] h-[2.25rem]
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FC8A06] hover:bg-[#e07c05] active:bg-[#d07000]"
              }
              transition-colors rounded-[0.375rem] flex items-center justify-center`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-[1.25rem] h-[1.125rem] bg-[#F0F0F0]"></div>
                <span className="text-[#F0F0F0] text-sm sm:text-base font-semibold font-['Poppins']">
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
