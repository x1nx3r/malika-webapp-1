import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index/index";
import AuthIndex from "./pages/auth/index";
import TestPage from "./pages/testpage/index";
import AboutMe from "./pages/aboutme/aboutme";
import "./index.css";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthIndex />} />
      <Route path="/dev" element={<TestPage />} />
      <Route path="/about" element={<AboutMe />} />
    </Routes>
  </BrowserRouter>
);
