function ProductCard({ product, onAddToCart, isLoading }) {
  return (
    <div className="w-full sm:w-[20rem] md:w-[32.94rem] h-auto md:h-[15.625rem] bg-white shadow-xl rounded-[0.75rem] sm:rounded-[1rem] flex flex-col md:flex-row overflow-hidden">
      <div className="p-4 sm:py-6 sm:pl-6 sm:pr-0 flex flex-col justify-between flex-1">
        <div>
          <div className="mb-4">
            <span className="text-[#0E0E0E] text-lg sm:text-[1.3rem] font-semibold font-['Poppins'] block leading-tight sm:leading-[1.44rem] sm:mb-2">
              {product.name}
            </span>
            <span className="text-[#0E0E0E] text-sm sm:text-lg font-semibold font-['Poppins'] block leading-tight sm:leading-[1.25rem]">
              Kemasan: {product.kemasan}
            </span>
          </div>
          <div className="text-[#0E0E0E] text-sm sm:text-lg font-normal font-['Poppins'] leading-tight sm:leading-[1.563rem]">
            {product.description}
          </div>
        </div>
        <div className="text-[#0E0E0E] text-lg sm:text-2xl font-bold font-['Poppins'] mt-4 md:mt-0">
          Rp{product.price.toLocaleString('id-ID')},-
        </div>
      </div>

      <div className="relative order-first md:order-last">
        <img
          className="w-full h-[10rem] md:w-[12.625rem] md:h-[12.625rem] object-cover md:m-6 rounded-none md:rounded-[0.75rem]"
          src={product.imageUrl}
          alt={product.name}
        />
        <button
          onClick={() => onAddToCart(product)}
          disabled={isLoading}
          className={`w-[3rem] h-[3rem] sm:w-[3.75rem] sm:h-[3.75rem] absolute bottom-3 right-3 md:bottom-6 md:right-6
            ${
              isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-white/80 hover:bg-white/90 active:bg-white/100'
            }
            transition-all rounded-tl-[1.25rem] sm:rounded-tl-[1.625rem] rounded-br-[0.5rem] sm:rounded-br-[0.75rem]
            flex items-center justify-center`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className="mt-1"
              xmlns="http://www.w3.org/2000/svg"
              width="29"
              height="27"
              viewBox="0 0 576 512"
            >
              <path
                fill="#FC8A06"
                d="M0 24C0 10.7 10.7 0 24 0h45.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5l-51.6-271c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24m128 440a48 48 0 1 1 96 0a48 48 0 1 1-96 0m336-48a48 48 0 1 1 0 96a48 48 0 1 1 0-96M252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20v-44h44c11 0 20-9 20-20s-9-20-20-20h-44V96c0-11-9-20-20-20s-20 9-20 20v44h-44c-11 0-20 9-20 20"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
