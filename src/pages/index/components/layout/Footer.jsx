import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const offerLinks = [
    { name: "Rekomendasi", scrollId: "rekomendasi" },
    {
      name: "Paket Porsian",
      path: "/paket-porsian",
      scrollId: "paket-porsian",
    },
    { name: "Paket Family", scrollId: "paket-family" },
    { name: "Paket Hampers", scrollId: "paket-hampers" },
    { name: "Frozen Food & Sambal", scrollId: "frozen-food" },
  ];

  const otherLinks = [
    { name: "Keranjang Saya", path: "/cart" },
    { name: "Pembayaran", path: "/payment" },
    { name: "Alamat Saya", path: "" },
    { name: "Riwayat Pesanan", path: "/riwayat-pesanan" },
    { name: "Tentang Kami", path: "/aboutme" },
  ];

  // Navigation handler
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -250;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Handle offer link clicks
  const handleOfferClick = (link) => {
    if (link.scrollId) {
      scrollToSection(link.scrollId);
    } else if (link.path) {
      handleNavigation(link.path);
    }
  };

  // Social media handlers
  const handleWhatsAppClick = () => {
    const phoneNumber = "6282257374357";
    const message = "Halo, saya tertarik dengan tawaran Kedai Malika";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleInstagramClick = () => {
    window.open("https://instagram.com/kedaimalika_sby", "_blank");
  };

  return (
    <footer className="bg-[#D9D9D9]">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Company Info */}
          <div>
            <div className="h-20 border border-black/20 mb-3"></div>
            <p className="text-sm text-[#0E0E0E]">
              Usaha Mikro, Kecil, dan Menengah (UMKM)
              <br />
              di Kota Surabaya
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Sampaikan tawaran Anda kepada kami
            </h3>

            <button
              onClick={handleWhatsAppClick}
              className="w-full sm:w-auto px-4 py-3 bg-[#FC8A06] rounded-full flex items-center justify-center hover:bg-[#e67a05] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 20 20"
                className="mr-2 text-white"
              >
                <path
                  fill="currentColor"
                  d="M16.8 5.7C14.4 2 9.5.9 5.7 3.2C2 5.5.8 10.5 3.2 14.2l.2.3l-.8 3l3-.8l.3.2c1.3.7 2.7 1.1 4.1 1.1c1.5 0 3-.4 4.3-1.2c3.7-2.4 4.8-7.3 2.5-11.1m-2.1 7.7c-.4.6-.9 1-1.6 1.1c-.4 0-.9.2-2.9-.6c-1.7-.8-3.1-2.1-4.1-3.6c-.6-.7-.9-1.6-1-2.5c0-.8.3-1.5.8-2q.3-.3.6-.3H7c.2 0 .4 0 .5.4c.2.5.7 1.7.7 1.8c.1.1.1.3 0 .4c.1.2 0 .4-.1.5s-.2.3-.3.4c-.2.1-.3.3-.2.5c.4.6.9 1.2 1.4 1.7c.6.5 1.2.9 1.9 1.2c.2.1.4.1.5-.1s.6-.7.8-.9s.3-.2.5-.1l1.6.8c.2.1.4.2.5.3c.1.3.1.7-.1 1"
                />
              </svg>
              <span className="text-white text-lg font-semibold">
                082257374357
              </span>
            </button>

            <div className="mt-4">
              <p className="text-base">Lihat juga</p>
              <button
                onClick={handleInstagramClick}
                className="mt-1 hover:scale-105 transition-transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M224 202.66A53.34 53.34 0 1 0 277.36 256A53.38 53.38 0 0 0 224 202.66m124.71-41a54 54 0 0 0-30.41-30.41c-21-8.29-71-6.43-94.3-6.43s-73.25-1.93-94.31 6.43a54 54 0 0 0-30.41 30.41c-8.28 21-6.43 71.05-6.43 94.33s-1.85 73.27 6.47 94.34a54 54 0 0 0 30.41 30.41c21 8.29 71 6.43 94.31 6.43s73.24 1.93 94.3-6.43a54 54 0 0 0 30.41-30.41c8.35-21 6.43-71.05 6.43-94.33s1.92-73.26-6.43-94.33ZM224 338a82 82 0 1 1 82-82a81.9 81.9 0 0 1-82 82m85.38-148.3a19.14 19.14 0 1 1 19.13-19.14a19.1 19.1 0 0 1-19.09 19.18ZM400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48m-17.12 290c-1.29 25.63-7.14 48.34-25.85 67s-41.4 24.63-67 25.85c-26.41 1.49-105.59 1.49-132 0c-25.63-1.29-48.26-7.15-67-25.85s-24.63-41.42-25.85-67c-1.49-26.42-1.49-105.61 0-132c1.29-25.63 7.07-48.34 25.85-67s41.47-24.56 67-25.78c26.41-1.49 105.59-1.49 132 0c25.63 1.29 48.33 7.15 67 25.85s24.63 41.42 25.85 67.05c1.49 26.32 1.49 105.44 0 131.88"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Links - Hidden on mobile, visible on sm+ */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-6">
            {/* Our Offers */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Tawaran Kami</h3>
              <div className="flex flex-col space-y-2">
                {offerLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleOfferClick(link)}
                    className="text-left text-base underline hover:text-[#FC8A06] transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Other Links */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Lainnya</h3>
              <div className="flex flex-col space-y-2">
                {otherLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavigation(link.path)}
                    className="text-left text-base underline hover:text-[#FC8A06] transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#03081F] py-3 text-center">
        <p className="text-sm text-[#F0F0F0]">
          Kedai Malika Copyright 2025, All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
