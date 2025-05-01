function Footer() {
  const offerLinks = [
    "Rekomendasi",
    "Paket Porsian",
    "Paket Family",
    "Paket Hampers",
    "Frozen Food & Sambal",
  ];

  const otherLinks = [
    "Keranjang Saya",
    "Pembayaran",
    "Alamat Saya",
    "Riwayat Pesanan",
    "Tentang Kami",
  ];

  return (
    <footer className="w-full bg-[#D9D9D9]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="flex flex-wrap justify-between gap-8">
          {/* Company Info */}
          <div className="flex flex-col w-full sm:w-auto">
            <div className="w-full sm:w-[21.188rem] h-[5rem] sm:h-[7.438rem] border border-black/22 mb-4"></div>
            <div className="text-[#0E0E0E] text-sm sm:text-base font-normal font-['Poppins'] leading-relaxed sm:leading-[1.5rem]">
              Usaha Mikro, Kecil, dan Menengah (UMKM)
              <br />
              di Kota Surabaya
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col w-full sm:w-auto">
            <div className="text-black text-lg sm:text-xl font-semibold font-['Poppins'] mb-4 sm:mb-6">
              Sampaikan tawaran Anda kepada kami
            </div>
            <div className="w-full sm:w-[18.75rem] h-[3rem] sm:h-[3.75rem] bg-[#FC8A06] rounded-full flex items-center px-4">
              <div className="w-[2rem] sm:w-[2.25rem] h-[2rem] sm:h-[2.25rem] mr-2 sm:mr-4 flex items-center justify-center">
                <div className="w-[1.6rem] sm:w-[1.805rem] h-[1.6rem] sm:h-[1.8rem] bg-[#F0F0F0]"></div>
              </div>
              <div className="text-white text-lg sm:text-xl md:text-2xl font-semibold font-['Poppins']">
                082257374357
              </div>
            </div>
            <div className="mt-6 sm:mt-8 text-black text-lg sm:text-xl font-normal">
              Lihat juga
            </div>
            {/* Social media icons would go here */}
          </div>

          {/* Links - Collapsed on mobile, visible on tablet+ */}
          <div className="hidden sm:flex flex-wrap w-full sm:w-auto gap-8 md:gap-16">
            {/* Our Offers Section */}
            <div className="flex flex-col">
              <div className="text-black text-xl sm:text-2xl font-semibold font-['Poppins'] mb-2 sm:mb-4">
                Tawaran Kami
              </div>
              {offerLinks.map((link) => (
                <div
                  key={link}
                  className="text-black text-lg sm:text-xl font-normal underline font-['Poppins'] mb-2"
                >
                  {link}
                </div>
              ))}
            </div>

            {/* Other Links */}
            <div className="flex flex-col">
              <div className="text-black text-xl sm:text-2xl font-semibold font-['Poppins'] mb-2 sm:mb-4">
                Lainnya
              </div>
              {otherLinks.map((link) => (
                <div
                  key={link}
                  className="text-black text-lg sm:text-xl font-normal underline font-['Poppins'] mb-2"
                >
                  {link}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="w-full h-[3rem] sm:h-[4.125rem] bg-[#03081F] flex items-center justify-center">
        <div className="text-[#F0F0F0] text-sm sm:text-base font-normal font-['Poppins'] px-4 text-center">
          Kedai Malika Copyright 2025, All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
