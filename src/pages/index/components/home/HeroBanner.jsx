function HeroBanner() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 my-3 sm:my-6">
      <div className="container mx-auto relative rounded-lg sm:rounded-[1.25rem] overflow-hidden">
        <img
          className="w-full h-[12rem] sm:h-[18rem] md:h-[24rem] lg:h-[28.125rem] object-cover rounded-lg sm:rounded-[1.25rem]"
          src="https://placehold.co/1640x450"
          alt="Banner"
        />
        <div className="absolute inset-0 bg-[rgba(3,8,31,0.86)] rounded-lg sm:rounded-[1.25rem] flex flex-col md:flex-row justify-between p-4 sm:p-8 lg:p-14">
          {/* Left Content */}
          <div className="flex flex-col justify-between mb-6 md:mb-0">
            {/* Upper Content */}
            <div>
              <div className="w-auto sm:w-[8.69rem] h-auto sm:h-[2.125rem] mb-2 sm:mb-4 flex justify-center items-center text-white text-sm sm:text-base md:text-xl font-medium font-['Poppins'] px-3 py-1 border border-white/50 rounded-full">
                100% Otentik
              </div>
              <div className="max-w-lg">
                <span className="text-white text-2xl sm:text-4xl md:text-[3.375rem] font-semibold font-['Poppins'] leading-tight sm:leading-[3.5rem] block mb-1 md:mb-0">
                  Lodho Ayam Kampung
                  <br className="hidden sm:block" />
                  Kedai Malika
                </span>
                <span className="text-white text-lg sm:text-xl md:text-[1.75rem] font-semibold font-['Poppins'] leading-tight sm:leading-[2.25rem]">
                  khas Trenggalek
                </span>
              </div>
            </div>

            {/* Contact Buttons - Stack on mobile, side by side on larger screens */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-6 md:mt-0">
              <ContactButton icon={<PhoneIcon />} text="082257374357" />
              <ContactButton icon={<MapIcon />} text="Google Maps" />
            </div>
          </div>

          {/* Right Content - Hidden on small mobile, visible from sm up */}
          <div className="hidden sm:block relative">
            <img
              className="w-[18rem] h-[12rem] md:w-[30rem] md:h-[17rem] lg:w-[37.8125rem] lg:h-[21.25rem] rounded-[0.5rem] md:rounded-[0.75rem] object-cover"
              src="https://placehold.co/605x340"
              alt="Product"
            />

            {/* Rating Box */}
            <RatingBox rating={5.0} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactButton({ icon, text }) {
  return (
    <div className="w-full sm:w-[18.5rem] h-[3rem] sm:h-[3.75rem] flex items-center rounded-full outline outline-1 outline-[#F0F0F0] -outline-offset-1 px-4">
      <div className="w-[1.75rem] sm:w-[2.25rem] h-[1.75rem] sm:h-[2.25rem] mr-2 sm:mr-4 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-white text-base sm:text-xl md:text-2xl font-semibold font-['Poppins']">
        {text}
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <div className="w-[1.4rem] sm:w-[1.805rem] h-[1.4rem] sm:h-[1.8rem] bg-[#F0F0F0]"></div>
  );
}

function MapIcon() {
  return (
    <div className="w-[1.4rem] sm:w-[1.584rem] h-[1.4rem] sm:h-[1.584rem] bg-[#F0F0F0]"></div>
  );
}

function RatingBox({ rating }) {
  return (
    <div className="w-[5rem] h-[5rem] sm:w-[7rem] sm:h-[7rem] md:w-[9.375rem] md:h-[9.375rem] absolute bottom-[-1rem] sm:bottom-[-1.563rem] left-[-0.75rem] sm:left-[-1.25rem] bg-white rounded-[0.75rem] md:rounded-[1rem] flex flex-col items-center justify-center shadow-lg">
      <div className="text-[#0E0E0E] text-3xl sm:text-5xl md:text-[4.5rem] font-medium font-['Poppins']">
        {rating.toFixed(1)}
      </div>
      <div className="flex mt-1 sm:mt-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="w-[1rem] h-[1rem] sm:w-[1.5rem] sm:h-[1.5rem] relative"
          >
            <div className="w-[0.75rem] sm:w-[1.07rem] h-[0.75rem] sm:h-[1.02rem] absolute left-[0.125rem] sm:left-[0.215rem] top-[0.125rem] sm:top-[0.188rem] bg-[#FBBC04]"></div>
            <div className="w-[0.75rem] sm:w-[1.07rem] h-[0.75rem] sm:h-[1.02rem] absolute left-[0.125rem] sm:left-[0.215rem] top-[0.125rem] sm:top-[0.188rem] outline outline-2 outline-[#FBBC04] -outline-offset-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;
