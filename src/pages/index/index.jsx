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
  const [notification, setNotification] = useState(null);
  // Track which items are being added to cart
  const [addingItems, setAddingItems] = useState(new Set());

  // Add to cart handler
  const handleAddToCart = async (product) => {
    if (addingItems.has(product.id)) return; // Prevent double-clicks

    try {
      // Add item to loading state
      setAddingItems((prev) => new Set([...prev, product.id]));

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          kemasan: product.kemasan || "Styrofoam",
          category: product.category,
          imageUrl: product.imageUrl,
          quantity: 1,
        }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");

      setNotification({
        type: "success",
        message: `${product.name} added to cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      setNotification({
        type: "error",
        message: "Failed to add item to cart",
      });
    } finally {
      // Remove item from loading state
      setAddingItems((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
      setTimeout(() => setNotification(null), 2000);
    }
  };
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

        const categorizedData = {
          bestSellers: data.slice(0, 4),
          porsian: data.filter((item) => item.category === "Paket Porsian"),
          family: data.filter((item) => item.category === "Paket Family"),
          hampers: data.filter((item) => item.category === "Paket Hampers"),
          frozenFood: data.filter(
            (item) => item.category === "Frozen Food & Sambal",
          ),
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
            onAddToCart={handleAddToCart}
            addingItems={addingItems} // Pass loading state
          />

          <ProductSection
            title="Paket Porsian"
            products={menuData.porsian}
            onAddToCart={handleAddToCart}
            addingItems={addingItems}
          />

          <ProductSection
            title="Paket Family"
            products={menuData.family}
            onAddToCart={handleAddToCart}
            addingItems={addingItems}
          />

          <ProductSection
            title="Paket Hampers"
            products={menuData.hampers}
            onAddToCart={handleAddToCart}
            addingItems={addingItems}
          />

          <ProductSection
            title="Frozen Food & Sambal"
            products={menuData.frozenFood}
            onAddToCart={handleAddToCart}
            addingItems={addingItems}
          />
        </div>

        <Footer />

        {notification && (
          <div
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg text-white
              ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}
              transition-opacity duration-300`}
          >
            {notification.message}
          </div>
        )}
      </div>
    </ScaleWrapper>
  );
}

export default Index;
