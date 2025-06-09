function HeroBanner() {
  return (
    <section className="w-full px-4 py-6">
      <div className="relative rounded-lg overflow-hidden shadow-md">
        {/* Background Image with Overlay */}
        <div className="relative">
          <img
            className="w-full h-[200px] sm:h-[250px] md:h-[320px] lg:h-[400px] object-cover"
            src="https://gevannoyoh.com/thumb-malika/thumb-hero.webp"
            alt="Banner"
          />
          <div className="absolute inset-0 bg-[rgba(3,8,31,0.86)]"></div>
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col md:flex-row justify-between p-4 sm:p-6 lg:p-8">
          {/* Left Content */}
          <div className="flex flex-col justify-between mb-4 md:mb-0 md:max-w-[50%]">
            <div>
              <div className="text-white text-sm sm:text-base font-medium mb-2">
                100% Otentik
              </div>
              <h1 className="text-white text-xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-1">
                Lodho Ayam Kampung
                <br className="hidden sm:block" />
                Kedai Malika
              </h1>
              <p className="text-white text-base sm:text-xl font-semibold">
                khas Trenggalek
              </p>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
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

          {/* Right Content - Hidden on mobile */}
          <div className="hidden sm:block relative">
            <img
              className="w-[16rem] h-[10rem] md:w-[20rem] md:h-[12rem] lg:w-[24rem] lg:h-[14rem] rounded-lg object-cover"
              src="https://gevannoyoh.com/thumb-malika/thumb-hero.webp"
              alt="Product"
            />
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
      className="h-10 sm:h-12 flex items-center justify-center rounded-full border border-[#F0F0F0] px-4 hover:bg-white/10 transition-colors"
    >
      <div className="w-6 h-6 mr-2 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-white text-sm sm:text-base font-semibold">
        {text}
      </div>
    </a>
  );
}

function RatingBox({ rating }) {
  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 absolute bottom-[-10px] left-[-10px] bg-white rounded-lg flex flex-col items-center justify-center shadow-lg">
      <div className="text-[#0E0E0E] text-2xl sm:text-3xl md:text-4xl font-medium">
        {rating.toFixed(1)}
      </div>
      <div className="flex mt-1">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="text-[#FBBC04] w-3 h-3 sm:w-4 sm:h-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full"
            >
              <path d="M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29-3.28l-5.29 3.28l1.49-6.04l-4.76-4.02l6.21-0.46z" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// PhoneIcon and MapIcon components remain unchanged
function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
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
      width="24"
      height="24"
      viewBox="0 0 56 56"
    >
      <path
        fill="#F0F0F0"
        d="M5.137 28.223c.82.82 1.64 1.078 3.258 1.078l17.742.094c.164 0 .304 0 .375.093c.07.07.093.211.093.352l.07 17.766c.024 1.617.282 2.437 1.102 3.257c1.102 1.125 2.649.938 3.797-.187c.61-.61 1.102-1.617 1.547-2.555L51.051 9.45c.937-1.968.82-3.422-.14-4.383c-.939-.937-2.392-1.054-4.36-.117L7.879 22.88c-.938.445-1.945.937-2.555 1.547c-1.125 1.148-1.312 2.672-.187 3.797"
      />
    </svg>
  );
}

export default HeroBanner;
