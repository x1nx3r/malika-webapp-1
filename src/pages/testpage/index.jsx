import ScaleWrapper from "./components/ui/ScaleWrapper";
import Navbar from "./components/layout/Navbar";
import CategoryNav from "./components/layout/CategoryNav";
import HeroBanner from "./components/home/HeroBanner";
import ProductSection from "./components/product/ProductSection";
import Footer from "./components/layout/Footer";

function TestPage() {
  // Sample product data
  const bestSellerProducts = [
    {
      id: 1,
      title: "Lodho Ayam Kampung",
      packaging: "Kemasan: Styroform",
      description: "Ayam Lodho 1 potong, Nasi Gurih, dan Urap.",
      price: "Rp33.000,-",
      image: "https://placehold.co/202x202",
    },
  ];

  const porsianProducts = [
    {
      id: 2,
      title: "Lodho Ayam Kampung",
      packaging: "Kemasan: Styroform",
      description: "Ayam Lodho 1 potong, Nasi Gurih, dan Urap.",
      price: "Rp33.000,-",
      image: "https://placehold.co/202x202",
    },
  ];

  const familyProducts = [
    {
      id: 3,
      title: "Lodho Ayam Kampung",
      packaging: "Kemasan: Styroform",
      description: "Ayam Lodho 1 potong, Nasi Gurih, dan Urap.",
      price: "Rp33.000,-",
      image: "https://placehold.co/202x202",
    },
  ];

  const hampersProducts = [
    {
      id: 4,
      title: "Lodho Ayam Kampung",
      packaging: "Kemasan: Styroform",
      description: "Ayam Lodho 1 potong, Nasi Gurih, dan Urap.",
      price: "Rp33.000,-",
      image: "https://placehold.co/202x202",
    },
  ];

  const frozenFoodProducts = [
    {
      id: 5,
      title: "Kebab Beef",
      quantity: 6,
      price: "Rp48.000/pax",
      image: "https://placehold.co/388x226",
    },
  ];

  return (
    <ScaleWrapper scale={0.7}>
      <div className="w-full min-h-screen flex flex-col bg-white shadow-md overflow-x-hidden">
        <div className="flex-grow">
          <Navbar />
          <CategoryNav />
          <HeroBanner />

          <ProductSection title="Menu Terlaris" products={bestSellerProducts} />

          <ProductSection title="Paket Porsian" products={porsianProducts} />

          <ProductSection title="Paket Family" products={familyProducts} />

          <ProductSection title="Paket Hampers" products={hampersProducts} />

          <ProductSection
            title="Frozen Food & Sambal"
            isFrozenFood={true}
            products={frozenFoodProducts}
          />
        </div>

        <Footer />
      </div>
    </ScaleWrapper>
  );
}

export default TestPage;
