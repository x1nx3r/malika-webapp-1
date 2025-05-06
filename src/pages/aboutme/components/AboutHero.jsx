import AboutHeroImage from "../assets/images/about-hero.png";

const AboutHero = () => (
  <section className="py-16 bg-gray-100">
    <div className="container mx-auto px-4">
      <h1 className="text-6xl font-bold text-center mb-16 font-playfair">
        Tentang Kami
      </h1>
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {" "}
        {/* Gap ditambah di sini */}
        <div className="md:w-1/2">
          <img
            src={AboutHeroImage}
            alt="Kedai Malika Food Presentation"
            className="rounded-lg object-cover"
            style={{ width: "750px", height: "410px" }}
          />
        </div>
        <div className="md:w-1/2 max-h-[613px] overflow-y-auto pr-2">
          <h2 className="text-5xl font-bold mb-4 leading-tight font-playfair">
            <span className="block">Selamat Datang di</span>
            <span className="block">Kedai Malika</span>
          </h2>
          <p className="text-gray-700 mb-4 font-playfair">
            Selamat datang di Kedai Malika, tempat di mana cita rasa khas Jawa
            Timur berpadu dengan kemudahan pemesanan modern. Kami adalah usaha
            kuliner yang berfokus pada penyajian makanan tradisional khas
            Trenggalek dengan sentuhan kehangatan rumah, terutama Lodho Ayam
            Kampung, yang telah menjadi favorit banyak pelanggan. Selain itu,
            kami juga menawarkan berbagai pilihan frozen food dan sambal khas
            yang memudahkan pelanggan menikmati makanan berkualitas tanpa harus
            repot memasak.
          </p>
          <p className="text-gray-700 font-playfair">
            Dengan menggabungkan rasa autentik dan teknologi, kami hadir untuk
            memenuhi kebutuhan Anda dalam menikmati makanan enak, cepat, dan
            praktis di rumah. Terima kasih telah mempercayakan selera Anda
            kepada kami.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutHero;
