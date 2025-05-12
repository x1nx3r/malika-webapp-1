import WhyChooseUsImage from "../assets/images/whychooseus.png";

const WhyChooseUs = () => (
  <section
    className="py-20 bg-center bg-cover bg-no-repeat relative"
    style={{
      backgroundImage: `url(${WhyChooseUsImage})`,
      height: "400px", // Sesuaikan tinggi gambar sesuai kebutuhan
    }}
  >
    <div className="absolute inset-0 flex justify-center items-center">
      <h2 className="text-6xl font-bold text-white text-center">
        <span className="block">Mengapa Memilih</span>
        <span className="block">Kami?</span>
      </h2>
    </div>
  </section>
);

export default WhyChooseUs;
