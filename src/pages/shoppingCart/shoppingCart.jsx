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

  useEffect(() => {
    fetchCartItems();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">
          Loading cart...
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
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-xl text-gray-600 mb-4">Your cart is empty</div>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </button>
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

      {cartItems.length > 0 && (
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
