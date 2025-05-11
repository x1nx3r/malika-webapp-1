import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index/index";
import AuthIndex from "./pages/auth/index";
import TestPage from "./pages/testpage/index";
import AboutMe from "./pages/aboutme/aboutme";
import AdminPenjualan from "./pages/adminPenjualan/adminPenjualan";
import AdminKeuangan from "./pages/adminKeuangan/adminKeuangan";
import "./index.css";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthIndex />} />
      <Route path="/dev" element={<TestPage />} />
      <Route path="/about" element={<AboutMe />} />
      <Route path="/admin" element={<AdminPenjualan />} />
      <Route path="/admin/keuangan" element={<AdminKeuangan />} />
      {/* Add more routes as needed */}
    </Routes>
  </BrowserRouter>
);
