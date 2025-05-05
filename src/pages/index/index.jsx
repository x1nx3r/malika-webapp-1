import { useEffect, useState } from "react";
import ScaleWrapper from "./components/ui/ScaleWrapper";
import Navbar from "./components/layout/Navbar";
import CategoryNav from "./components/layout/CategoryNav";
import HeroBanner from "./components/home/HeroBanner";
import ProductSection from "./components/product/ProductSection";
import Footer from "./components/layout/Footer";
import { getMenuData } from "../../services/menuService";
import { auth } from "../../firebase";

function Index() {
  const [menuData, setMenuData] = useState({
    bestSellers: [],
    porsian: [],
    family: [],
    hampers: [],
    frozenFood: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const user = auth.currentUser; // Sekarang auth terdefinisi
        if (!user) {
          console.log("No user logged in");
          return;
        }
        
        const token = await user.getIdToken();
        const data = await getMenuData(token);
        
        const categorizedData = {
          bestSellers: data.slice(0, 4),
          porsian: data.filter(item => item.category === "Paket Porsian"),
          family: data.filter(item => item.category === "Paket Family"),
          hampers: data.filter(item => item.category === "Paket Hampers"),
          frozenFood: data.filter(item => item.category === "Frozen Food & Sambal")
        };
        
        setMenuData(categorizedData);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  if (loading) {
    return <div>Loading menu...</div>;
  }

  return (
    <ScaleWrapper scale={0.7}>
      <div className="w-full min-h-screen flex flex-col bg-white shadow-md overflow-x-hidden">
        <div className="flex-grow">
          <Navbar />
          <CategoryNav />
          <HeroBanner />

          <ProductSection title="Menu Terlaris" products={menuData.bestSellers} />

          <ProductSection title="Paket Porsian" products={menuData.porsian} />

          <ProductSection title="Paket Family" products={menuData.family} />

          <ProductSection title="Paket Hampers" products={menuData.hampers} />

          <ProductSection
            title="Frozen Food & Sambal"
            isFrozenFood={true}
            products={menuData.frozenFood}
          />
        </div>

        <Footer />
      </div>
    </ScaleWrapper>
  );
}

export default Index;