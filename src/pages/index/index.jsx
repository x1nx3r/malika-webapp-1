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
    frozenFood: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log("No user logged in");
          return;
        }

        const token = await user.getIdToken();
        const data = await getMenuData(token);

        // Debug logs
        console.log("Raw data from API:", data);
        console.log(
          "All categories:",
          data.map((item) => item.category),
        );
        console.log("Sample item structure:", data[0]);

        // Log items that should be frozen food
        const frozenItems = data.filter(
          (item) => item.category === "Frozen Food & Sambal",
        );
        console.log("Found frozen items:", frozenItems);

        // Check for items containing "Frozen" in their category
        const anyFrozenItems = data.filter(
          (item) => item.category && item.category.includes("Frozen"),
        );
        console.log("Items with 'Frozen' in category:", anyFrozenItems);

        const categorizedData = {
          bestSellers: data.slice(0, 4),
          porsian: data.filter((item) => item.category === "Paket Porsian"),
          family: data.filter((item) => item.category === "Paket Family"),
          hampers: data.filter((item) => item.category === "Paket Hampers"),
          frozenFood: data.filter(
            (item) => item.category === "Frozen Food & Sambal",
          ),
        };

        // Log the categorized results
        console.log("Categorized data:", {
          bestSellers: categorizedData.bestSellers.length,
          porsian: categorizedData.porsian.length,
          family: categorizedData.family.length,
          hampers: categorizedData.hampers.length,
          frozenFood: categorizedData.frozenFood.length,
        });

        console.log(
          "Items in frozen food category:",
          categorizedData.frozenFood,
        );

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">
          Loading menu...
        </div>
      </div>
    );
  }

  return (
    <ScaleWrapper scale={0.7}>
      <div className="w-full min-h-screen flex flex-col bg-white shadow-md overflow-x-hidden">
        <div className="flex-grow">
          <Navbar />
          <CategoryNav />
          <HeroBanner />

          <ProductSection
            title="Menu Terlaris"
            products={menuData.bestSellers}
          />

          <ProductSection title="Paket Porsian" products={menuData.porsian} />

          <ProductSection title="Paket Family" products={menuData.family} />

          <ProductSection title="Paket Hampers" products={menuData.hampers} />

          <ProductSection
            title="Frozen Food & Sambal"
            products={menuData.frozenFood}
          />
        </div>

        <Footer />
      </div>
    </ScaleWrapper>
  );
}

export default Index;
