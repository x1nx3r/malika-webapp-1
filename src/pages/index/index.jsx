import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import CategoryNav from './components/layout/CategoryNav';
import HeroBanner from './components/home/HeroBanner';
import ProductSection from './components/product/ProductSection';
import Footer from './components/layout/Footer';
import { getMenuData } from '../../services/menuService';
import { auth } from '../../firebase';

function Index() {
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

  // Add to cart handler
  const handleAddToCart = async (product) => {
    if (addingItems.has(product.id)) return; // Prevent double-clicks

    try {
      // Add item to loading state
      setAddingItems((prev) => new Set([...prev, product.id]));

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Don't set Cookie header manually, browser will handle it
        },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          kemasan: product.kemasan || 'Styrofoam',
          category: product.category,
          imageUrl: product.imageUrl,
          quantity: 1,
        }),
        credentials: 'include', // This tells fetch to include cookies
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      setNotification({
        type: 'success',
        message: `${product.name} added to cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setNotification({
        type: 'error',
        message: 'Failed to add item to cart',
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
          console.log('No user logged in');
          return;
        }

        const token = await user.getIdToken();
        const data = await getMenuData(token);

        // Store all products in a single array for search
        setAllProducts(data);

        const categorizedData = {
          bestSellers: data.slice(0, 4),
          porsian: data.filter((item) => item.category === 'Paket Porsian'),
          family: data.filter((item) => item.category === 'Paket Family'),
          hampers: data.filter((item) => item.category === 'Paket Hampers'),
          frozenFood: data.filter(
            (item) => item.category === 'Frozen Food & Sambal'
          ),
        };

        setMenuData(categorizedData);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Handle category selection
  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    setIsSearching(false); // Clear search when selecting a category
    setSearchQuery('');

    // Map category names to section IDs
    const categoryToId = {
      Rekomendasi: 'rekomendasi',
      'Paket Porsian': 'paket-porsian',
      'Paket Family': 'paket-family',
      'Paket Hampers': 'paket-hampers',
      'Frozen Food & Sambal': 'frozen-food',
    };

    const sectionId = categoryToId[categoryName];
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        // Get position with offset for fixed header
        const yOffset = -180; // Increased offset for better positioning
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        // Scroll with smooth behavior
        window.scrollTo({
          top: y,
          behavior: 'smooth',
        });
      }
    }

    console.log(`Category changed to: ${categoryName}`);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const lowerCaseQuery = query.toLowerCase();
    const results = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        (product.description &&
          product.description.toLowerCase().includes(lowerCaseQuery))
    );

    setSearchResults(results);
  };

  // Add the missing getProductsToShow function
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

    // Return ALL categories with their products and unique IDs for scrolling
    return [
      {
        title: 'Rekomendasi',
        products: menuData.bestSellers || [],
        id: 'rekomendasi',
      },
      {
        title: 'Paket Porsian',
        products: menuData.porsian || [],
        id: 'paket-porsian',
      },
      {
        title: 'Paket Family',
        products: menuData.family || [],
        id: 'paket-family',
      },
      {
        title: 'Paket Hampers',
        products: menuData.hampers || [],
        id: 'paket-hampers',
      },
      {
        title: 'Frozen Food & Sambal',
        products: menuData.frozenFood || [],
        id: 'frozen-food',
      },
    ];
  };

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
      {/* Fixed Navigation Container at normal scale */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md w-full">
        <Navbar onSearch={handleSearch} />
        <CategoryNav
          onCategoryClick={handleCategoryClick}
          activeCategory={activeCategory}
        />
      </div>

      {/* Spacer div to push content below the fixed header */}
      <div className="h-[130px]"></div>

      {/* Apply the 80% scale to the content only */}
      <div
        className="flex-grow origin-top"
        style={{
          transform: 'scale(0.8)',
          width: '125%', // 1/0.8 = 1.25 = 125%
          marginLeft: '-12.5%', // ((1/0.8) - 1)/2 * -100% = -12.5%
          marginBottom: '-20%', // This helps prevent extra space at the bottom
        }}
      >
        {!isSearching && <HeroBanner />}

        {/* Product sections remain the same */}
        <div className="w-full px-4 md:px-8 py-4">
          {/* Render product sections based on active category or search */}
          {productsToShow.map((section, index) => (
            <div
              key={index}
              id={section.id}
              className="scroll-mt-40" // Increased to account for fixed navbar height
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

        {/* Show message when no search results found */}
        {isSearching && searchResults.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">
              No products found matching "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        <Footer />
      </div>

      {/* Notification remains outside scaled content */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </div>
      )}

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
