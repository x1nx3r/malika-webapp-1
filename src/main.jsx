import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index/index";
import AuthIndex from "./pages/auth/index";
import TestPage from "./pages/testpage/index";
import "./index.css";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthIndex />} />
      <Route path="/dev" element={<TestPage />} />
    </Routes>
  </BrowserRouter>,
);
