function TestPage() {
  // You can make this dynamic based on screen size if needed
  const scale = 0.7;
  const width = `${(1 / scale) * 100}%`;
  const marginLeft = `${((1 / scale - 1) / 2) * -100}%`;

  const scaleWrapperStyle = {
    transform: `scale(${scale})`,
    transformOrigin: "top center",
    width,
    marginLeft,
  };

  return (
    <div className="overflow-x-hidden" style={scaleWrapperStyle}>
      <div className="w-full min-h-screen flex flex-col bg-white shadow-md overflow-x-hidden">
        <div className="w-full min-h-screen flex flex-col bg-white shadow-md overflow-x-hidden">
          {/* Top Navigation Bar */}
          <header className="w-full px-4 sm:px-6 lg:px-8 my-2 sm:my-4">
            <div className="container mx-auto bg-[#FAFAFA] rounded-bl-8 sm:rounded-bl-16 rounded-br-8 sm:rounded-br-16 outline outline-2 outline-[#D9D9D9] -outline-offset-2">
              <div className="flex flex-col md:flex-row items-center justify-between p-4">
                {/* Logo */}
                <div className="w-[8rem] sm:w-[10rem] md:w-[12.5rem] h-[3rem] sm:h-[4.375rem] border border-black/22 mb-4 md:mb-0"></div>

                {/* Search Bar - Hidden on mobile */}
                <div className="hidden md:flex w-full max-w-[37.5rem] h-[3.75rem] overflow-hidden rounded-full outline outline-1 outline-[#03081F] -outline-offset-[0.5px] items-center justify-center relative mx-4">
                  <div className="text-center text-[#666666] text-lg sm:text-xl font-semibold font-['Poppins']">
                    Search Menu
                  </div>
                  <div className="absolute right-4 w-[1.5rem] h-[1.5rem] overflow-hidden">
                    <div className="w-[1.125rem] h-[1.125rem] m-[0.1875rem] outline outline-[2.5px] outline-[#666666] -outline-offset-[1.25px]"></div>
                  </div>
                </div>

                {/* Mobile Search Icon - Visible only on mobile */}
                <div className="md:hidden w-[2.5rem] h-[2.5rem] rounded-full flex items-center justify-center bg-gray-100 mb-4">
                  <div className="w-[1.5rem] h-[1.5rem] relative">
                    <div className="w-[1.125rem] h-[1.125rem] m-[0.1875rem] outline outline-[2.5px] outline-[#666666] -outline-offset-[1.25px]"></div>
                  </div>
                </div>

                {/* Green Navigation Section */}
                <div className="w-full md:w-auto bg-[#028643] rounded-lg md:rounded-bl-14 md:rounded-br-14 outline outline-2 outline-[#D9D9D9]">
                  <div className="flex justify-between md:justify-start">
                    {/* Cart Section */}
                    <div className="flex-1 md:w-[7.8125rem] py-3 md:py-0 md:h-[6rem] flex items-center justify-center border-r-2 border-[#D9D9D9]">
                      <div className="flex flex-col items-center">
                        <div className="w-[2rem] sm:w-[2.5rem] h-[2rem] sm:h-[2.5rem] relative overflow-hidden mb-1 sm:mb-2">
                          <div className="w-[0.3125rem] h-[0.3125rem] absolute left-[0.703rem] top-[1.875rem] bg-[#F0F0F0]"></div>
                          <div className="w-[0.3125rem] h-[0.3125rem] absolute left-[1.797rem] top-[1.875rem] bg-[#F0F0F0]"></div>
                          <div className="w-[2.1rem] h-[1.484rem] absolute left-[0.156rem] top-[0.3125rem] bg-[#F0F0F0]"></div>
                        </div>
                        <div className="text-center text-white text-xs sm:text-sm font-medium font-['Poppins']">
                          Keranjang
                        </div>
                      </div>
                    </div>

                    {/* Payment Section */}
                    <div className="flex-1 md:w-[7.8125rem] py-3 md:py-0 md:h-[6rem] flex items-center justify-center border-r-2 border-[#D9D9D9] relative">
                      <div className="flex flex-col items-center">
                        <div className="w-[2rem] sm:w-[2.5rem] h-[2rem] sm:h-[2.5rem] relative overflow-hidden mb-1 sm:mb-2">
                          <div className="w-full h-[2.344rem] absolute top-[0.156rem] bg-[#F0F0F0]"></div>
                        </div>
                        <div className="text-center text-white text-xs sm:text-sm font-medium font-['Poppins']">
                          Pembayaran
                        </div>
                      </div>
                      <div className="w-[1rem] h-[1rem] sm:w-[1.25rem] sm:h-[1.25rem] absolute top-[-0.5rem] right-2 sm:right-4 bg-[#FC8A06] rounded-full"></div>
                    </div>

                    {/* Menu Section */}
                    <div className="flex-1 md:w-[7.8125rem] py-3 md:py-0 md:h-[6rem] flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-[2.5rem] sm:w-[3.125rem] h-[2.5rem] sm:h-[3.125rem] relative overflow-hidden mb-1 sm:mb-2">
                          <div className="w-[1.75rem] h-[1.25rem] absolute left-[0.688rem] top-[0.938rem] outline outline-4 outline-[#F0F0F0] -outline-offset-2"></div>
                        </div>
                        <div className="text-center text-white text-xs sm:text-sm font-medium font-['Poppins']">
                          Menu
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Category Navigation - Scrollable on mobile */}
          <div className="w-full px-4 sm:px-6 lg:px-8 my-2 sm:my-4 overflow-x-auto">
            <div className="container mx-auto flex justify-center">
              {" "}
              {/* Added flex and justify-center */}
              <div className="min-w-max bg-[#FC8A06] rounded-[2rem] sm:rounded-[3.69rem] flex items-center px-4 py-3 sm:px-8 sm:h-[5rem] space-x-3 sm:space-x-4 md:space-x-6 lg:justify-between">
                {/* Recommendation Category */}
                <div className="flex-shrink-0 bg-[#03081F] rounded-full px-4 sm:px-6 py-2 sm:py-3 sm:w-auto md:w-[18.5rem] sm:h-[2.5rem] flex items-center justify-center">
                  <div className="text-center text-[#F0F0F0] text-sm sm:text-base md:text-[1.375rem] font-bold font-['Poppins'] whitespace-nowrap">
                    Rekomendasi
                  </div>
                </div>

                {/* Portion Pack Category */}
                <div className="flex-shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-3 sm:w-auto md:w-[18.5rem] sm:h-[2.5rem] flex items-center justify-center">
                  <div className="text-center text-[#F0F0F0] text-sm sm:text-base md:text-[1.375rem] font-bold font-['Poppins'] whitespace-nowrap">
                    Paket Porsian
                  </div>
                </div>

                {/* Family Pack Category */}
                <div className="flex-shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-3 sm:w-auto md:w-[18.5rem] sm:h-[2.5rem] flex items-center justify-center">
                  <div className="text-center text-[#F0F0F0] text-sm sm:text-base md:text-[1.375rem] font-bold font-['Poppins'] whitespace-nowrap">
                    Paket Family
                  </div>
                </div>

                {/* Hampers Pack Category */}
                <div className="flex-shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-3 sm:w-auto md:w-[18.5rem] sm:h-[2.5rem] flex items-center justify-center">
                  <div className="text-center text-[#F0F0F0] text-sm sm:text-base md:text-[1.375rem] font-bold font-['Poppins'] whitespace-nowrap">
                    Paket Hampers
                  </div>
                </div>

                {/* Frozen Food Category */}
                <div className="flex-shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-3 sm:w-auto md:w-[18.5rem] sm:h-[2.5rem] flex items-center justify-center">
                  <div className="text-center text-[#F0F0F0] text-sm sm:text-base md:text-[1.375rem] font-bold font-['Poppins'] whitespace-nowrap">
                    Frozen Food & Sambal
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Banner */}
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
                    <div className="w-full sm:w-[18.5rem] h-[3rem] sm:h-[3.75rem] flex items-center rounded-full outline outline-1 outline-[#F0F0F0] -outline-offset-1 px-4">
                      <div className="w-[1.75rem] sm:w-[2.25rem] h-[1.75rem] sm:h-[2.25rem] mr-2 sm:mr-4 flex items-center justify-center">
                        <div className="w-[1.4rem] sm:w-[1.805rem] h-[1.4rem] sm:h-[1.8rem] bg-[#F0F0F0]"></div>
                      </div>
                      <div className="text-white text-base sm:text-xl md:text-2xl font-semibold font-['Poppins']">
                        082257374357
                      </div>
                    </div>

                    <div className="w-full sm:w-[18.5rem] h-[3rem] sm:h-[3.75rem] flex items-center rounded-full outline outline-1 outline-[#F0F0F0] -outline-offset-1 px-4">
                      <div className="w-[1.75rem] sm:w-[1.875rem] h-[1.75rem] sm:h-[1.875rem] mr-2 sm:mr-4 flex items-center justify-center">
                        <div className="w-[1.4rem] sm:w-[1.584rem] h-[1.4rem] sm:h-[1.584rem] bg-[#F0F0F0]"></div>
                      </div>
                      <div className="text-white text-base sm:text-xl md:text-2xl font-semibold font-['Poppins']">
                        Google Maps
                      </div>
                    </div>
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
                  <div className="w-[5rem] h-[5rem] sm:w-[7rem] sm:h-[7rem] md:w-[9.375rem] md:h-[9.375rem] absolute bottom-[-1rem] sm:bottom-[-1.563rem] left-[-0.75rem] sm:left-[-1.25rem] bg-white rounded-[0.75rem] md:rounded-[1rem] flex flex-col items-center justify-center shadow-lg">
                    <div className="text-[#0E0E0E] text-3xl sm:text-5xl md:text-[4.5rem] font-medium font-['Poppins']">
                      5.0
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
                </div>
              </div>
            </div>
          </section>

          {/* Product Sections - Reusable Pattern */}
          {[
            "Menu Terlaris",
            "Paket Porsian",
            "Paket Family",
            "Paket Hampers",
            "Frozen Food & Sambal",
          ].map((sectionTitle, sectionIndex) => (
            <section
              key={sectionTitle}
              className="w-full px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 md:mt-16"
            >
              <div className="container mx-auto">
                <h2 className="text-[#0E0E0E] text-xl sm:text-3xl md:text-[2.75rem] font-bold font-['Poppins'] mb-4 sm:mb-6 md:mb-8">
                  {sectionTitle}
                </h2>

                <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 justify-center sm:justify-start">
                  {/* Show different product cards based on section */}
                  {sectionIndex === 0 ||
                  sectionIndex === 1 ||
                  sectionIndex === 2 ||
                  sectionIndex === 3 ? (
                    // Regular product card
                    <div className="w-full sm:w-[20rem] md:w-[32.94rem] h-auto md:h-[15.625rem] bg-white shadow-xl rounded-[0.75rem] sm:rounded-[1rem] flex flex-col md:flex-row overflow-hidden">
                      <div className="p-4 sm:p-6 flex flex-col justify-between flex-1">
                        <div>
                          <div className="mb-2">
                            <span className="text-[#0E0E0E] text-lg sm:text-xl font-semibold font-['Poppins'] block leading-tight sm:leading-[1.44rem]">
                              Lodho Ayam Kampung
                            </span>
                            <span className="text-[#0E0E0E] text-sm sm:text-base font-semibold font-['Poppins'] block leading-tight sm:leading-[1.25rem]">
                              Kemasan: Styroform
                            </span>
                          </div>
                          <div className="text-[#0E0E0E] text-sm sm:text-base font-normal font-['Poppins'] leading-tight sm:leading-[1.563rem]">
                            Ayam Lodho 1 potong, Nasi Gurih, dan Urap.
                          </div>
                        </div>
                        <div className="text-[#0E0E0E] text-lg sm:text-xl font-bold font-['Poppins'] mt-4 md:mt-0">
                          Rp33.000,-
                        </div>
                      </div>

                      <div className="relative order-first md:order-last">
                        <img
                          className="w-full h-[10rem] md:w-[12.625rem] md:h-[12.625rem] object-cover md:m-6 rounded-none md:rounded-[0.75rem]"
                          src="https://placehold.co/202x202"
                          alt="Product"
                        />
                        <div className="w-[3rem] h-[3rem] sm:w-[3.75rem] sm:h-[3.75rem] absolute bottom-3 right-3 md:bottom-6 md:right-0 bg-white/80 rounded-tl-[1.25rem] sm:rounded-tl-[1.625rem] rounded-br-[0.5rem] sm:rounded-br-[0.75rem] flex items-center justify-center">
                          <div className="w-[1.5rem] sm:w-[1.883rem] h-[1.35rem] sm:h-[1.688rem] bg-[#FC8A06]"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Special card for Frozen Food
                    <div className="w-full sm:w-[20rem] lg:w-[24.25rem] h-auto bg-white shadow-xl rounded-[0.75rem] sm:rounded-[1rem] overflow-hidden flex flex-col">
                      <div className="relative">
                        <img
                          className="w-full h-[12rem] sm:h-[14.125rem] object-cover"
                          src="https://placehold.co/388x226"
                          alt="Product"
                        />
                        <div className="w-[3rem] h-[3rem] sm:w-[3.75rem] sm:h-[3.75rem] absolute top-0 right-0 bg-[#028643] shadow-md rounded-bl-[0.375rem] sm:rounded-bl-[0.5rem] flex items-center justify-center">
                          <div className="text-center text-white text-lg sm:text-2xl font-semibold font-['Poppins'] leading-[1.25rem] sm:leading-[1.5rem]">
                            isi
                            <br />6
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div className="text-black text-lg sm:text-xl font-semibold font-['Poppins'] leading-tight sm:leading-[1.25rem]">
                          Kebab Beef
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-4">
                          <div className="w-full sm:w-[9.938rem] h-[2.25rem] bg-[#03081F] rounded-[0.375rem] flex items-center justify-center">
                            <div className="text-center text-[#F0F0F0] text-base sm:text-lg font-bold font-['Poppins']">
                              Rp48.000/pax
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
                  )}

                  {/* Duplicate cards as needed - just showing one per section for example */}
                </div>
              </div>
            </section>
          ))}

          {/* Footer */}
          <footer className="w-full mt-12 sm:mt-16 bg-[#D9D9D9]">
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
                    {[
                      "Rekomendasi",
                      "Paket Porsian",
                      "Paket Family",
                      "Paket Hampers",
                      "Frozen Food & Sambal",
                    ].map((link) => (
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
                    {[
                      "Keranjang Saya",
                      "Pembayaran",
                      "Alamat Saya",
                      "Riwayat Pesanan",
                      "Tentang Kami",
                    ].map((link) => (
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
        </div>
      </div>
    </div>
  );
}

export default TestPage;
