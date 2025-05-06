import iconcitarasa from "../assets/images/icon-cita-rasa.png";
import iconmudahdipesan from "../assets/images/icon-mudah-dipesan.png";
import iconlayanan from "../assets/images/icon-layanan-cepat.png";

const features = [
  {
    title: "Cita Rasa Autentik",
    description: "Menggunakan resep tradisional yang terjaga keasliannya.",
    icon: iconcitarasa,
  },
  {
    title: "Mudah Dipesan",
    description:
      "Bisa langsung dipesan melalui website tanpa perlu chat manual.",
    icon: iconmudahdipesan,
  },
  {
    title: "Layanan Cepat & Ramah",
    description: "Pesanan cepat sampai dan dikemas dengan aman.",
    icon: iconlayanan,
  },
];

const Features = () => (
  <section className="bg-orange-500 py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-4 justify-center">
            <div className="p-2 rounded-lg">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={feature.icon} alt={`${feature.title} icon`} />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-black mb-2">{feature.title}</h3>
              <p className="text-black text-sm mb-2 line-clamp-2">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
