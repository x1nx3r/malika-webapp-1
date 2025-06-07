function HeroBanner() {
  return (
    // Add top margin/padding to account for fixed navbar and category nav
    <section className="w-full px-4 sm:px-6 lg:px-8 my-3 sm:my-6 mt-32 sm:mt-36 md:mt-40">
      <div className="container mx-auto relative rounded-lg sm:rounded-[1.25rem] overflow-hidden">
        <img
          className="w-full h-[12rem] sm:h-[18rem] md:h-[24rem] lg:h-[28.125rem] object-cover rounded-lg sm:rounded-[1.25rem]"
          src="https://gevannoyoh.com/thumb-malika/thumb-hero.webp"
          alt="Banner"
        />
        <div className="absolute inset-0 bg-[rgba(3,8,31,0.86)] rounded-lg sm:rounded-[1.25rem] flex flex-col md:flex-row justify-between p-4 sm:p-8 lg:p-14">
          {/* Left Content */}
          <div className="flex flex-col justify-between mb-6 md:mb-0">
            {/* Upper Content */}
            <div>
              <div className="w-auto sm:w-[9.5rem] h-auto sm:h-[2.125rem] mb-2 sm:mb-4 flex justify-center items-center text-white text-sm sm:text-base md:text-xl font-medium font-['Poppins'] -ml-3 rounded-full">
                100% Otentik
              </div>
              <div className="max-w-lg">
                <span className="text-white text-2xl sm:text-4xl md:text-[2.79rem] font-semibold font-['Poppins'] leading-tight sm:leading-[3rem] block mb-1 md:mb-0">
                  Lodho Ayam Kampung
                  <br className="hidden sm:block" />
                  Kedai Malika
                </span>
                <span className="text-white text-lg sm:text-xl md:text-[1.5rem] font-semibold font-['Poppins'] leading-tight sm:leading-[2.25rem]">
                  khas Trenggalek
                </span>
              </div>
            </div>

            {/* Contact Buttons - Stack on mobile, side by side on larger screens */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-6 md:mt-0 md:p-0">
              <ContactButton
                icon={<PhoneIcon />}
                text="082257374357"
                link="https://wa.me/6282257374357"
              />
              <ContactButton
                icon={<MapIcon />}
                text="Google Maps"
                link="https://maps.app.goo.gl/txMSUQ1NK7qJc5Tm7"
              />
            </div>
          </div>

          {/* Right Content - Hidden on small mobile, visible from sm up */}
          <div className="hidden sm:block relative">
            <img
              className="w-[18rem] h-[12rem] md:w-[30rem] md:h-[17rem] lg:w-[37.8125rem] lg:h-[21.25rem] rounded-[0.5rem] md:rounded-[0.75rem] object-cover"
              src="https://gevannoyoh.com/thumb-malika/thumb-hero.webp"
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

function ContactButton({ icon, text, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-[3rem] sm:h-[3.4rem] flex items-center justify-center rounded-full outline outline-1 outline-[#F0F0F0] -outline-offset-1 px-6 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
    >
      <div className="w-[1.75rem] sm:w-[2.25rem] h-[1.75rem] sm:h-[2.25rem] mr-2 sm:mr-4 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-white text-base sm:text-xl md:text-2xl font-semibold font-['Poppins']">
        {text}
      </div>
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 20 20"
    >
      <path
        fill="#F0F0F0"
        d="M16.8 5.7C14.4 2 9.5.9 5.7 3.2C2 5.5.8 10.5 3.2 14.2l.2.3l-.8 3l3-.8l.3.2c1.3.7 2.7 1.1 4.1 1.1c1.5 0 3-.4 4.3-1.2c3.7-2.4 4.8-7.3 2.5-11.1m-2.1 7.7c-.4.6-.9 1-1.6 1.1c-.4 0-.9.2-2.9-.6c-1.7-.8-3.1-2.1-4.1-3.6c-.6-.7-.9-1.6-1-2.5c0-.8.3-1.5.8-2q.3-.3.6-.3H7c.2 0 .4 0 .5.4c.2.5.7 1.7.7 1.8c.1.1.1.3 0 .4c.1.2 0 .4-.1.5s-.2.3-.3.4c-.2.1-.3.3-.2.5c.4.6.9 1.2 1.4 1.7c.6.5 1.2.9 1.9 1.2c.2.1.4.1.5-.1s.6-.7.8-.9s.3-.2.5-.1l1.6.8c.2.1.4.2.5.3c.1.3.1.7-.1 1"
      />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 56 56"
    >
      <path
        fill="#F0F0F0"
        d="M5.137 28.223c.82.82 1.64 1.078 3.258 1.078l17.742.094c.164 0 .304 0 .375.093c.07.07.093.211.093.352l.07 17.766c.024 1.617.282 2.437 1.102 3.257c1.102 1.125 2.649.938 3.797-.187c.61-.61 1.102-1.617 1.547-2.555L51.051 9.45c.937-1.968.82-3.422-.14-4.383c-.939-.937-2.392-1.054-4.36-.117L7.879 22.88c-.938.445-1.945.937-2.555 1.547c-1.125 1.148-1.312 2.672-.187 3.797"
      />
    </svg>
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
            <svg
              className="w-[0.75rem] sm:w-[1.5rem] h-[0.75rem] sm:h-[1.5rem] absolute left-[0.125rem] sm:left-[0.1rem] top-[0.125rem] sm:top-[0.188rem] text-[#FBBC04]"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fill-opacity="0"
                d="M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28l-5.29 3.28l1.49 -6.04l-4.76 -4.02l6.21 -0.46Z"
              >
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="0.5s"
                  dur="0.5s"
                  values="0;1"
                />
              </path>
              <path
                fill="none"
                stroke="currentColor"
                stroke-dasharray="36"
                stroke-dashoffset="36"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3l-2.35 5.76l-6.21 0.46l4.76 4.02l-1.49 6.04l5.29 -3.28M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.5s"
                  values="36;0"
                />
              </path>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;
