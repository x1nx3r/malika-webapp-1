import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { auth } from "./firebase";
import Index from "./pages/index/index";
import AuthIndex from "./pages/auth/auth";
import TestPage from "./pages/testpage/index";
import AboutMe from "./pages/aboutme/aboutme";
import AdminPenjualan from "./pages/adminPenjualan/adminPenjualan";
import AdminKeuangan from "./pages/adminKeuangan/adminKeuangan";
import AdminKelolaMenu from "./pages/adminKelolaMenu/adminKelolaMenu";
import "./index.css";
import ShoppingCart from "./pages/shoppingCart/shoppingCart";
import Checkout from "./pages/checkOut/checkOut";
import PaymentPage from "./pages/payment/paymentPage";

const AppWrapper = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Use a ref for the timer to prevent memory leaks
  const tokenRefreshTimer = useRef(null);

  // Function to refresh the token and update cookie
  const refreshToken = async () => {
    try {
      if (auth.currentUser) {
        console.log("Refreshing auth token...");
        const token = await auth.currentUser.getIdToken(true); // Force refresh
        document.cookie = `firebaseToken=${token}; path=/; max-age=3600`; // 1 hour

        // Schedule the next refresh (5 minutes before expiry)
        scheduleTokenRefresh(55 * 60 * 1000); // 55 minutes
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      // If refresh fails, try again in 1 minute
      scheduleTokenRefresh(60 * 1000);
    }
  };

  // Function to schedule token refresh
  const scheduleTokenRefresh = (delay) => {
    // Clear any existing timer
    if (tokenRefreshTimer.current) {
      clearTimeout(tokenRefreshTimer.current);
    }

    // Set new timer
    tokenRefreshTimer.current = setTimeout(refreshToken, delay);
    console.log(
      `Token refresh scheduled in ${Math.round(delay / 60000)} minutes`,
    );
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Get token result which includes expiration time
          const tokenResult = await user.getIdTokenResult();
          const token = tokenResult.token;

          // Set token in cookie
          document.cookie = `firebaseToken=${token}; path=/; max-age=3600`; // 1 hour

          // Calculate when to refresh the token (5 minutes before expiry)
          const expiresAt = new Date(tokenResult.expirationTime).getTime();
          const now = Date.now();
          const timeToRefresh = Math.max(0, expiresAt - now - 5 * 60 * 1000);

          // Schedule refresh
          scheduleTokenRefresh(timeToRefresh);
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else {
        // Clear the refresh timer if user is logged out
        if (tokenRefreshTimer.current) {
          clearTimeout(tokenRefreshTimer.current);
          tokenRefreshTimer.current = null;
        }
      }

      setUser(user);
      setLoading(false);
    });

    // Clean up on unmount
    return () => {
      unsubscribe();
      if (tokenRefreshTimer.current) {
        clearTimeout(tokenRefreshTimer.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Index /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace /> : <AuthIndex />}
        />
        <Route path="/dev" element={<TestPage />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/admin" element={<AdminPenjualan />} />
        <Route path="/admin/keuangan" element={<AdminKeuangan />} />
        <Route path="/admin/kelolamenu" element={<AdminKelolaMenu />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(<AppWrapper />);
