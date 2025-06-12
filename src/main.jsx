import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { auth, getUserRole } from "./firebase";
import Index from "./pages/index/index";
import AuthIndex from "./pages/auth/auth";
import AboutMe from "./pages/aboutme/aboutme";
import AdminPenjualan from "./pages/adminPenjualan/adminPenjualan";
import AdminKeuangan from "./pages/adminKeuangan/adminKeuangan";
import AdminKelolaMenu from "./pages/adminKelolaMenu/adminKelolaMenu";
import "./index.css";
import ShoppingCart from "./pages/shoppingCart/shoppingCart";
import Checkout from "./pages/checkOut/checkOut";
import PaymentRedirect from "./pages/payment/components/paymentRedirect";
import PaymentPage from "./pages/payment/paymentPage";
import ProfilePage from "./pages/profile/profilePage";
import HistoryPage from "./pages/history/historyPage";
import HistoryDetailPage from "./pages/history/historyDetailPage";

const AppWrapper = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenRefreshTimer = useRef(null);

  // Component to protect admin routes
  const AdminRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/auth" replace />;
    }

    if (userRole === null) {
      // Still loading role
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      );
    }

    if (userRole !== "admin") {
      // User is not admin, redirect to home
      return <Navigate to="/" replace />;
    }

    return children;
  };

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
          // Get user role
          const role = await getUserRole(user.uid);
          setUserRole(role);

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
          console.error("Error getting token or user role:", error);
        }
      } else {
        // Clear the refresh timer and user role if user is logged out
        setUserRole(null);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman yang bisa diakses tanpa login */}
        <Route path="/" element={<Index />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace /> : <AuthIndex />}
        />

        {/* Halaman yang memerlukan login */}
        <Route
          path="/cart"
          element={user ? <ShoppingCart /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/checkout"
          element={user ? <Checkout /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/payment"
          element={user ? <PaymentRedirect /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/payment/:orderId"
          element={user ? <PaymentPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/history"
          element={user ? <HistoryPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/history/:orderId"
          element={
            user ? <HistoryDetailPage /> : <Navigate to="/auth" replace />
          }
        />

        {/* Halaman admin dengan role checking */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPenjualan />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/keuangan"
          element={
            <AdminRoute>
              <AdminKeuangan />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/kelolamenu"
          element={
            <AdminRoute>
              <AdminKelolaMenu />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(<AppWrapper />);
