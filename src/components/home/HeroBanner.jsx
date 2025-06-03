import { useNavigate } from 'react-router-dom';

function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full">
      <div className="container mx-auto px-4 py-6">
        <div className="relative rounded-lg overflow-hidden shadow-lg">
          {/* Background image with overlay */}
          <div className="relative">
            <img
              className="w-full h-[12rem] sm:h-[18rem] md:h-[24rem] object-cover"
              src="https://gevannoyoh.com/thumb-malika/thumb-hero.webp"
              alt="Lodho Ayam Kampung"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between p-4 sm:p-8">
            {/* Text content */}
            <div className="text-white max-w-xl">
              <div className="inline-block px-4 py-1 bg-orange-500 rounded-full mb-4">
                <span className="font-medium">100% Otentik</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold mb-2">
                Lodho Ayam Kampung
                <br />
                Kedai Malika
              </h1>
              <p className="text-lg mb-6">khas Trenggalek</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:082257374357"
                  className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <PhoneIcon />
                  <span className="font-medium">082257374357</span>
                </a>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <MapIcon />
                  <span className="font-medium">Google Maps</span>
                </a>
              </div>
            </div>

            {/* Rating box */}
            <div className="bg-white rounded-lg p-4 shadow-lg mt-4 md:mt-0">
              <div className="text-4xl font-bold text-center">5.0</div>
              <div className="flex justify-center text-yellow-400 mt-2">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default HeroBanner;
