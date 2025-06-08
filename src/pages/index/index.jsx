import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import CategoryNav from './components/layout/CategoryNav';
import HeroBanner from './components/home/HeroBanner';
import ProductSection from './components/product/ProductSection';
import Footer from './components/layout/Footer';
import { getMenuData } from '../../services/menuService';
import { auth } from '../../firebase';

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
  const [activeCategory, setActiveCategory] = useState('Rekomendasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Category mapping for smooth scrolling
  const categoryScrollMap = {
    Rekomendasi: 'rekomendasi',
    'Paket Porsian': 'paket-porsian',
    'Paket Family': 'paket-family',
    'Paket Hampers': 'paket-hampers',
    'Frozen Food & Sambal': 'frozen-food',
  };

  // Add to cart functionality
  const handleAddToCart = async (product) => {
    if (addingItems.has(product.id)) return;

    try {
      setAddingItems((prev) => new Set([...prev, product.id]));

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          kemasan: product.kemasan || 'Styrofoam',
          category: product.category,
          imageUrl: product.imageUrl,
          quantity: 1,
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      showNotification('success', `${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('error', 'Failed to add item to cart');
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
  };

  // Clear search state
  const clearSearch = () => {
    setIsSearching(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -250; // Reduced from -180 to -140
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Get products to display based on search state
  const getProductsToShow = () => {
    if (isSearching) {
      return [
        {
          title: `Search Results for "${searchQuery}"`,
          products: searchResults,
          id: 'search-results',
        },
      ];
    }

    return [
      {
        title: 'Rekomendasi',
        products: menuData.bestSellers,
        id: 'rekomendasi',
      },
      {
        title: 'Paket Porsian',
        products: menuData.porsian,
        id: 'paket-porsian',
      },
      { title: 'Paket Family', products: menuData.family, id: 'paket-family' },
      {
        title: 'Paket Hampers',
        products: menuData.hampers,
        id: 'paket-hampers',
      },
      {
        title: 'Frozen Food & Sambal',
        products: menuData.frozenFood,
        id: 'frozen-food',
      },
    ];
  };

  // Fetch menu data on component mount
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('No user logged in');
          return;
        }

        const token = await user.getIdToken();
        const data = await getMenuData(token);

        setAllProducts(data);
        setMenuData({
          bestSellers: data.slice(0, 4),
          porsian: data.filter((item) => item.category === 'Paket Porsian'),
          family: data.filter((item) => item.category === 'Paket Family'),
          hampers: data.filter((item) => item.category === 'Paket Hampers'),
          frozenFood: data.filter(
            (item) => item.category === 'Frozen Food & Sambal'
          ),
        });
      } catch (error) {
        console.error('Error fetching menu data:', error);
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
    <div className="min-h-screen flex flex-col bg-white shadow-md overflow-x-hidden">
      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md w-full pt-2">
        <Navbar onSearch={handleSearch} />
        <CategoryNav
          onCategoryClick={handleCategoryClick}
          activeCategory={activeCategory}
        />
      </div>

      {/* Content with proper spacing for fixed header */}
      <div className="h-[100px]"></div>

      {/* Scaled content container */}
      <div
        className="flex-grow origin-top overflow-hidden" // Added overflow-hidden
        style={{
          transform: 'scale(0.8)',
          width: '125%',
          marginLeft: '-12.5%',
          marginBottom: '-30%', // Increased to -30% for better removal of whitespace
          minHeight: 'fit-content', // Ensure it fits content properly
        }}
      >
        {/* Hero Banner - only show when not searching */}
        {!isSearching && <HeroBanner />}

        {/* Add extra spacing when searching to prevent navbar blocking */}
        {isSearching && <div className="h-[60px] sm:h-[80px]"></div>}

        {/* Product Sections */}
        <div className="w-full px-4 md:px-8 py-4">
          {productsToShow.map((section, index) => (
            <div
              key={section.id || index}
              id={section.id}
              className="scroll-mt-40"
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

        {/* No search results message */}
        {isSearching && searchResults.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">
              No products found matching "{searchQuery}"
            </p>
            <button
              onClick={clearSearch}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        <Footer />
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* Global styles */}
      <style jsx global>{`
        html,
        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}

export default Index;
