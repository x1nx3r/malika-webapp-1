const testimonials = [
  {
    name: "Fadli Rizal",
    title: '"Paling Enak"',
    message:
      "Lodho ayam paling enak di surabaya, rasanya otentik banget, khotokan iwak pe, degan dan nasi uduk ayam kremesnya juga jadi favorit keluarga. Must try!! ",
  },
  {
    name: "Annisa Triana",
    title: '"Otentik"',
    message:
      "Ayamnya beneran gede banget dan empuk. Kuah dan nasi gurih nya super otentik. Ga ada di Surabaya yang seenak ini. Cocok utk pecinta ayam lodho.",
  },
  {
    name: "Bathara Mulya",
    title: '"Asli Khas Trenggalek"',
    message:
      "Rumah makan yang menu spesial nya adalah nasi lodho ayam kampung asli khas trenggalek. Kedai malika wenak pol pol wes",
  },
];

const Testimonials = () => (
  <section className="py-16 bg-gray-100">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-12">
        Apa Yang Konsumen Katakan
      </h2>
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-orange-400 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3">{item.title}</h3>
              <p className="mb-8 text-sm">{item.message}</p>
              <p className="font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;
