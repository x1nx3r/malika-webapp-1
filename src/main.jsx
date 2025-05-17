import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import Index from "./pages/index/index";
import AuthIndex from "./pages/auth/auth";
import TestPage from "./pages/testpage/index";
import AboutMe from "./pages/aboutme/aboutme";
import AdminPenjualan from "./pages/adminPenjualan/adminPenjualan";
import AdminKeuangan from "./pages/adminKeuangan/adminKeuangan";
import "./index.css";
import ShoppingCart from "./pages/shoppingCart/shoppingCart";
import Checkout from "./pages/checkOut/checkOut";

const AppWrapper = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Set token in cookie after successful auth
        const token = await user.getIdToken();
        document.cookie = `firebaseToken=${token}; path=/; max-age=3600`; // 1 hour
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
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
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(<AppWrapper />);