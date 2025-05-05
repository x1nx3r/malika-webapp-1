function ProductCard({ product }) {
  return (
    <div className="w-full sm:w-[20rem] md:w-[32.94rem] h-auto md:h-[15.625rem] bg-white shadow-xl rounded-[0.75rem] sm:rounded-[1rem] flex flex-col md:flex-row overflow-hidden">
      <div className="p-4 sm:p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="mb-2">
            <span className="text-[#0E0E0E] text-lg sm:text-xl font-semibold font-['Poppins'] block leading-tight sm:leading-[1.44rem]">
              {product.title}
            </span>
            <span className="text-[#0E0E0E] text-sm sm:text-base font-semibold font-['Poppins'] block leading-tight sm:leading-[1.25rem]">
              {product.packaging}
            </span>
          </div>
          <div className="text-[#0E0E0E] text-sm sm:text-base font-normal font-['Poppins'] leading-tight sm:leading-[1.563rem]">
            {product.description}
          </div>
        </div>
        <div className="text-[#0E0E0E] text-lg sm:text-xl font-bold font-['Poppins'] mt-4 md:mt-0">
          {product.price}
        </div>
      </div>

      <div className="relative order-first md:order-last">
        <img
          className="w-full h-[10rem] md:w-[12.625rem] md:h-[12.625rem] object-cover md:m-6 rounded-none md:rounded-[0.75rem]"
          src={product.image}
          alt={product.title}
        />
        <div className="w-[3rem] h-[3rem] sm:w-[3.75rem] sm:h-[3.75rem] absolute bottom-3 right-3 md:bottom-6 md:right-0 bg-white/80 rounded-tl-[1.25rem] sm:rounded-tl-[1.625rem] rounded-br-[0.5rem] sm:rounded-br-[0.75rem] flex items-center justify-center">
          <div className="w-[1.5rem] sm:w-[1.883rem] h-[1.35rem] sm:h-[1.688rem] bg-[#FC8A06]"></div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
