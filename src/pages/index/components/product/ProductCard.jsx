function ProductCard({ product, onAddToCart, isLoading }) {
  return (
    <div className="w-full sm:w-80 md:w-full max-w-2xl h-auto md:h-60 p-6 bg-white rounded-2xl flex flex-col md:flex-row drop-shadow hover:drop-shadow-lg overflow-hidden gap-4 transition-all duration-200 ease-in">
      {/* Product Details Section */}
      <div className="flex flex-col justify-between flex-1 cursor-default">
        <div>
          <div className="mb-2">
            <h3 className="text-gray-800 text-lg font-poppins font-semibold mb-0.5 line-clamp-3 text-ellipsis leading-5">
              {product.name}
            </h3>
            <p className="text-gray-800 text-xs md:text-sm font-poppins font-medium">
              Kemasan: {product.kemasan}
            </p>
          </div>
          {/* Description with truncation */}
          <p className="text-gray-800 text-[8px] font-poppins font-light leading-snug line-clamp">
            {product.description}
          </p>
        </div>
        <div className="text-gray-900 text-base md:text-lg font-poppins font-bold mt-2 md:mt-0">
          Rp{product.price.toLocaleString("id-ID")},-
        </div>
      </div>

      {/* Image Section with Add Button */}
      <div className="relative order-first md:order-last">
        <img
          className="w-full h-36 md:w-48 md:h-48 object-cover md:rounded-xl"
          src={product.imageUrl}
          alt={product.name}
        />

        <button
          onClick={() => onAddToCart(product)}
          disabled={isLoading}
          className={`
            absolute bottom-2 right-2 md:bottom-0 md:right-0
            w-10 h-10 md:w-12 md:h-12
            flex items-center justify-center
            rounded-tl-2xl rounded-br-xl
            cursor-pointer
            ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-white/80 hover:bg-white hover:drop-shadow"
            }
            transition-all
          `}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-[#FC8A06]"
              viewBox="0 0 576 512"
              fill="currentColor"
            >
              <path d="M0 24C0 10.7 10.7 0 24 0h45.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5l-51.6-271c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24m128 440a48 48 0 1 1 96 0a48 48 0 1 1-96 0m336-48a48 48 0 1 1 0 96a48 48 0 1 1 0-96M252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20v-44h44c11 0 20-9 20-20s-9-20-20-20h-44V96c0-11-9-20-20-20s-20 9-20 20v44h-44c-11 0-20 9-20 20" />
            </svg>
          )}
        </button>
      </div>

      {/* CSS for line clamping and smaller font sizes */}
      <style jsx>{`
        .line-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          max-height: 4.2em; /* Slightly reduced for smaller font */
          font-size: 0.8125rem; /* 13px */
          line-height: 1.4;
        }

        /* Adjust for mobile view with smaller description space */
        @media (max-width: 768px) {
          .line-clamp {
            -webkit-line-clamp: 2;
            max-height: 2.8em;
            font-size: 0.75rem; /* 12px on mobile */
          }
        }
      `}</style>
    </div>
  );
}

export default ProductCard;
