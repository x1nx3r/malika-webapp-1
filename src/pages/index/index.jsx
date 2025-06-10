import { useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import CategoryNav from "./components/layout/CategoryNav";
import HeroBanner from "./components/home/HeroBanner";
import ProductSection from "./components/product/ProductSection";
import Footer from "./components/layout/Footer";
import { getMenuData } from "../../services/menuService";
import { auth } from "../../firebase";

function Index() {
  // State management
  const [menuData, setMenuData] = useState({
    bestSellers: [],
    porsian: [],
    family: [],
    hampers: [],
    frozenFood: [],
  });
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [addingItems, setAddingItems] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState("Rekomendasi");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Category mapping for smooth scrolling
  const categoryScrollMap = {
    Rekomendasi: "rekomendasi",
    "Paket Porsian": "paket-porsian",
    "Paket Family": "paket-family",
    "Paket Hampers": "paket-hampers",
    "Frozen Food & Sambal": "frozen-food",
  };

  // Add to cart functionality
  const handleAddToCart = async (product) => {
    if (addingItems.has(product.id)) return;

    try {
      setAddingItems((prev) => new Set([...prev, product.id]));

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          kemasan: product.kemasan || "Styrofoam",
          category: product.category,
          imageUrl: product.imageUrl,
          quantity: 1,
        }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to add to cart");

      showNotification("success", `${product.name} added to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification("error", "Failed to add item to cart");
    } finally {
      setAddingItems((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }
  };

  // Notification helper
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 2000);
  };

  // Category click handler with smooth scrolling
  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    clearSearch();

    const sectionId = categoryScrollMap[categoryName];
    if (sectionId) {
      scrollToSection(sectionId);
    }
  };

  // Search functionality
  const handleSearch = (query) => {
    if (searchTimeout) clearTimeout(searchTimeout);

    setSearchTimeout(setTimeout(() => {
      setSearchQuery(query);

      if (!query.trim()) {
        clearSearch();
        return;
      }

      setIsSearching(true);
      const results = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(results);
    }, 500));
  };

  // Clear search state
  const clearSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -120; // Adjusted for sticky header height
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Get products to display based on search state
  const getProductsToShow = () => {
    if (isSearching) {
      return [
        {
          title: `Search Results for "${searchQuery}"`,
          products: searchResults,
          id: "search-results",
        },
      ];
    }

    return [
      {
        title: "Rekomendasi",
        products: menuData.bestSellers,
        id: "rekomendasi",
      },
      {
        title: "Paket Porsian",
        products: menuData.porsian,
        id: "paket-porsian",
      },
      { title: "Paket Family", products: menuData.family, id: "paket-family" },
      {
        title: "Paket Hampers",
        products: menuData.hampers,
        id: "paket-hampers",
      },
      {
        title: "Frozen Food & Sambal",
        products: menuData.frozenFood,
        id: "frozen-food",
      },
    ];
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      clearSearch();
    }
  }, [searchQuery]);

  // Fetch menu data on component mount
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

        setAllProducts(data);
        setMenuData({
          bestSellers: data.slice(0, 4),
          porsian: data.filter((item) => item.category === "Paket Porsian"),
          family: data.filter((item) => item.category === "Paket Family"),
          hampers: data.filter((item) => item.category === "Paket Hampers"),
          frozenFood: data.filter(
            (item) => item.category === "Frozen Food & Sambal",
          ),
        });
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">
          Loading menu...
        </div>
      </div>
    );
  }

  const productsToShow = getProductsToShow();

  return (
    <div>
        <div className="min-h-screen flex justify-center px-30">
        {/* Main container with constrained width */}
        <div className="relative w-full">
          {/* Sticky header wrapper */}
          <div className="sticky top-0 z-50">
            <Navbar onSearch={handleSearch} />
            <CategoryNav
              onCategoryClick={handleCategoryClick}
              activeCategory={activeCategory}
            />
          </div>

          {/* Main content */}
          <div className="w-full">
            {/* Hero Banner - only show when not searching */}
            {!isSearching && <HeroBanner />}

            {/* Product Sections */}
            <div className="w-full py-0">
              {productsToShow.map((section, index) => (
                <div
                  key={section.id || index}
                  id={section.id}
                  className="scroll-mt-36" // Adjusted for sticky header
                >
                  <ProductSection
                    title={section.title}
                    products={section.products}
                    onAddToCart={handleAddToCart}
                    addingItems={addingItems}
                    showEmptyMessage={isSearching && searchResults.length === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notification Toast */}
          {notification && (
            <div
              className={`fixed bottom-4 right-4 py-2 rounded-lg shadow-lg z-50 ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {notification.message}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Index;
