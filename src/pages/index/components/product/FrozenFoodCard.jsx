function FrozenFoodCard({ product }) {
  return (
    <div className="w-full sm:w-[20rem] lg:w-[24.25rem] h-auto bg-white shadow-xl rounded-[0.75rem] sm:rounded-[1rem] overflow-hidden flex flex-col">
      <div className="relative">
        <img
          className="w-full h-[12rem] sm:h-[14.125rem] object-cover"
          src={product.image}
          alt={product.title}
        />
        <div className="w-[3rem] h-[3rem] sm:w-[3.75rem] sm:h-[3.75rem] absolute top-0 right-0 bg-[#028643] shadow-md rounded-bl-[0.375rem] sm:rounded-bl-[0.5rem] flex items-center justify-center">
          <div className="text-center text-white text-lg sm:text-2xl font-semibold font-['Poppins'] leading-[1.25rem] sm:leading-[1.5rem]">
            isi
            <br />
            {product.quantity}
          </div>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between">
        <div className="text-black text-lg sm:text-xl font-semibold font-['Poppins'] leading-tight sm:leading-[1.25rem]">
          {product.title}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-4">
          <div className="w-full sm:w-[9.938rem] h-[2.25rem] bg-[#03081F] rounded-[0.375rem] flex items-center justify-center">
            <div className="text-center text-[#F0F0F0] text-base sm:text-lg font-bold font-['Poppins']">
              {product.price}
            </div>
          </div>

          <div className="w-full sm:w-[9.938rem] h-[2.25rem] bg-[#FC8A06] rounded-[0.375rem] flex items-center justify-center sm:justify-start">
            <div className="w-[1.25rem] h-[1.125rem] mx-0 sm:mx-3 mr-2 sm:mr-0 bg-[#F0F0F0]"></div>
            <div className="text-[#F0F0F0] text-sm sm:text-base font-semibold font-['Poppins']">
              Tambahkan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrozenFoodCard;
