import { useState, useEffect } from 'react';
import ScaleWrapper from './components/ui/ScaleWrapper';
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
    // You could add analytics tracking here if needed
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">
          Loading menu...
        </div>
      </div>
    );
  }

  // Determine which products to show based on active category or search
  const getProductsToShow = () => {
    if (isSearching) {
      return [
        { title: `Search Results: "${searchQuery}"`, products: searchResults },
      ];
    }

    switch (activeCategory) {
      case 'Paket Porsian':
        return [{ title: 'Paket Porsian', products: menuData.porsian }];
      case 'Paket Family':
        return [{ title: 'Paket Family', products: menuData.family }];
      case 'Paket Hampers':
        return [{ title: 'Paket Hampers', products: menuData.hampers }];
      case 'Frozen Food & Sambal':
        return [
          { title: 'Frozen Food & Sambal', products: menuData.frozenFood },
        ];
      case 'Rekomendasi':
      default:
        // On Rekomendasi, show all categories starting with Best Sellers
        return [
          { title: 'Menu Terlaris', products: menuData.bestSellers },
          { title: 'Paket Porsian', products: menuData.porsian },
          { title: 'Paket Family', products: menuData.family },
          { title: 'Paket Hampers', products: menuData.hampers },
          { title: 'Frozen Food & Sambal', products: menuData.frozenFood },
        ].filter((section) => section.products && section.products.length > 0);
    }
  };

  // Get the filtered products
  const productsToShow = getProductsToShow();

  return (
    <ScaleWrapper scale={0.7}>
      <div className="w-full min-h-screen flex flex-col bg-white shadow-md overflow-x-hidden">
        <div className="flex-grow">
          <Navbar onSearch={handleSearch} />
          <CategoryNav
            onCategoryClick={handleCategoryClick}
            activeCategory={activeCategory}
          />
          {!isSearching && <HeroBanner />}

          {/* Add a parent container with minimal/no padding */}
          <div className="w-full px-0 py-0 space-y-0">
            {/* Render product sections based on active category or search */}
            {productsToShow.map((section, index) => (
              <ProductSection
                key={index}
                title={section.title}
                products={section.products}
                onAddToCart={handleAddToCart}
                addingItems={addingItems}
                showEmptyMessage={isSearching && searchResults.length === 0}
              />
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
        </div>

        <Footer />

        {/* Notification */}
        {notification && (
          <div
            className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {notification.message}
          </div>
        )}
      </div>
    </ScaleWrapper>
  );
}

export default Index;