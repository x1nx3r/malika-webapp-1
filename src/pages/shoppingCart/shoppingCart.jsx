import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import CartHeader from "./components/CartHeader";
import CartItem from "./components/CartItem";
import CartFooter from "./components/CartFooter";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("No user logged in");
        navigate("/auth");
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      console.log("Cart data:", data);
      setCartItems(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ id: itemId, quantity: newQuantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");
      const updatedCart = await response.json();
      setCartItems(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Failed to update item quantity");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to remove item");
      const updatedCart = await response.json();
      setCartItems(updatedCart);
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleBack = () => {
    navigate("/");
  }

  useEffect(() => {
    fetchCartItems();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CartHeader onBack={() => navigate("/")} />
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <div className="text-base font-medium text-gray-700">
            Sedang memuat...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-hidden px-20">
      <CartHeader onBack={() => navigate("/")} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto max-w-3xl mt-4">
          {error}
        </div>
      )}

      <div className="max-w-5xl mx-auto mt-16">
        {cartItems.length === 0 ? (
          <div className="h-160 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center py-8">
              <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M68.75 175C75.6536 175 81.25 169.404 81.25 162.5C81.25 155.596 75.6536 150 68.75 150C61.8464 150 56.25 155.596 56.25 162.5C56.25 169.404 61.8464 175 68.75 175Z" fill="#666666"/>
                <path d="M156.25 175C163.154 175 168.75 169.404 168.75 162.5C168.75 155.596 163.154 150 156.25 150C149.346 150 143.75 155.596 143.75 162.5C143.75 169.404 149.346 175 156.25 175Z" fill="#666666"/>
                <path d="M178.438 47.1797C177.559 46.1057 176.453 45.2406 175.199 44.6474C173.945 44.0542 172.575 43.7476 171.188 43.75H52.3008L49.9062 30.1641C49.6509 28.7169 48.8938 27.406 47.768 26.4616C46.6421 25.5172 45.2195 24.9997 43.75 25H18.75C17.0924 25 15.5027 25.6585 14.3306 26.8306C13.1585 28.0027 12.5 29.5924 12.5 31.25C12.5 32.9076 13.1585 34.4973 14.3306 35.6694C15.5027 36.8415 17.0924 37.5 18.75 37.5H38.5078L56.3438 138.586C56.5991 140.033 57.3562 141.344 58.482 142.288C59.6079 143.233 61.0305 143.75 62.5 143.75H162.5C164.158 143.75 165.747 143.092 166.919 141.919C168.092 140.747 168.75 139.158 168.75 137.5C168.75 135.842 168.092 134.253 166.919 133.081C165.747 131.908 164.158 131.25 162.5 131.25H67.7422L65.5391 118.75H159.938C162.105 118.747 164.205 117.996 165.882 116.623C167.559 115.25 168.71 113.339 169.141 111.215L180.391 54.9648C180.662 53.6035 180.627 52.199 180.289 50.8527C179.952 49.5064 179.319 48.2518 178.438 47.1797Z" fill="#666666"/>
                <path d="M98.9641 62.9817L113 77.0171L126.963 63.0545C127.272 62.7262 127.643 62.4636 128.056 62.2824C128.468 62.1012 128.913 62.0051 129.363 62C130.328 62 131.252 62.3831 131.934 63.065C132.616 63.7469 132.999 64.6717 132.999 65.6361C133.008 66.0819 132.925 66.5247 132.756 66.9374C132.588 67.3501 132.336 67.7239 132.018 68.0359L117.873 81.9986L132.018 96.143C132.617 96.7293 132.968 97.5232 132.999 98.361C132.999 99.3254 132.616 100.25 131.934 100.932C131.252 101.614 130.328 101.997 129.363 101.997C128.9 102.016 128.437 101.939 128.005 101.77C127.574 101.601 127.181 101.344 126.854 101.015L113 86.98L99.0004 100.979C98.6932 101.296 98.3261 101.55 97.9205 101.724C97.5148 101.899 97.0785 101.992 96.6368 101.997C95.6725 101.997 94.7476 101.614 94.0656 100.932C93.3837 100.25 93.0006 99.3254 93.0006 98.361C92.9921 97.9152 93.0748 97.4724 93.2437 97.0597C93.4125 96.6471 93.6639 96.2732 93.9824 95.9612L108.127 81.9986L93.9824 67.8541C93.3831 67.2678 93.0316 66.4739 93.0006 65.6361C93.0006 64.6717 93.3837 63.7469 94.0656 63.065C94.7476 62.3831 95.6725 62 96.6368 62C97.5095 62.0109 98.3459 62.3636 98.9641 62.9817Z" fill="white"/>
              </svg>
              <div className="font-poppins font-semibold text-xl text-gray-500 mb-4">Keranjangmu kosong</div>
            </div>
          </div>
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={() => handleRemoveItem(item.id)}
            />
          ))
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="flex justify-center px-4 max-w-full -mt-4">
          <button
            onClick={handleBack}
            className="w-1/2 h-16 flex items-center justify-center rounded-xl bg-orange-400 hover:bg-orange-500 transition-all duration-200 ease-in"
          >
            <span className="text-white text-xl font-poppins font-bold">
              Kembali Lihat Menu
            </span>
          </button>
        </div>
      ) : (
        <CartFooter
          totalItems={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          totalPrice={cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          )}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}

export default ShoppingCart;
