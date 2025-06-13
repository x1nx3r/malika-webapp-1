// src/pages/errorpage/error.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../index/components/layout/Navbar";
import Footer from "../index/components/layout/Footer";

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Get error info from location state or use defaults
  const errorCode = location.state?.errorCode || 404;
  const errorMessage = location.state?.errorMessage || "Page not found";
  const errorDescription = location.state?.errorDescription || "";

  // Error configurations for different status codes
  const errorConfigs = {
    401: {
      title: "Tidak Diizinkan",
      message: "Anda perlu masuk untuk mengakses halaman ini",
      description: "Silakan masuk dengan akun Anda untuk melanjutkan.",
      icon: "🔒",
      buttonText: "Masuk",
      buttonAction: () => navigate("/auth"),
      showSecondaryButton: true,
      secondaryButtonText: "Ke Beranda",
      secondaryButtonAction: () => navigate("/"),
    },
    403: {
      title: "Akses Ditolak",
      message: "Anda tidak memiliki izin untuk mengakses halaman ini",
      description: "Halaman ini hanya untuk pengguna yang berwenang.",
      icon: "🚫",
      buttonText: "Ke Beranda",
      buttonAction: () => navigate("/"),
      showSecondaryButton: false,
    },
    404: {
      title: "Halaman Tidak Ditemukan",
      message: "Halaman yang Anda cari tidak ada",
      description:
        "Tautan yang Anda ikuti mungkin rusak, atau halaman telah dipindahkan.",
      icon: "🔍",
      buttonText: "Ke Beranda",
      buttonAction: () => navigate("/"),
      showSecondaryButton: true,
      secondaryButtonText: "Kembali",
      secondaryButtonAction: () => navigate(-1),
    },
    500: {
      title: "Kesalahan Server",
      message: "Terjadi kesalahan di sisi kami",
      description: "Kami mengalami kesulitan teknis. Silakan coba lagi nanti.",
      icon: "⚠️",
      buttonText: "Coba Lagi",
      buttonAction: () => window.location.reload(),
      showSecondaryButton: true,
      secondaryButtonText: "Ke Beranda",
      secondaryButtonAction: () => navigate("/"),
    },
  };

  // Get current error config or use 404 as default
  const currentError = errorConfigs[errorCode] || errorConfigs[404];

  // Use custom message/description if provided, otherwise use config
  const displayMessage =
    errorMessage !== "Page not found" ? errorMessage : currentError.message;
  const displayDescription = errorDescription || currentError.description;

  // Monitor auth state (similar to index page)
  useEffect(() => {
    import("../../firebase").then(({ auth }) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
      });
      return () => unsubscribe();
    });
  }, []);

  // Empty search handler for navbar
  const handleSearch = (query) => {
    // Redirect to home with search query
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <div className="min-h-screen flex justify-center px-30">
        {/* Main container with constrained width */}
        <div className="relative w-full">
          {/* Sticky header wrapper */}
          <div className="sticky top-0 z-50">
            <Navbar onSearch={handleSearch} />
          </div>

          {/* Main content */}
          <div className="w-full">
            {/* Error Content */}
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16">
              {/* Error Icon */}
              <div className="text-8xl mb-8 animate-bounce">
                {currentError.icon}
              </div>

              {/* Error Code */}
              <div className="text-6xl font-bold text-orange-500 mb-4">
                {errorCode}
              </div>

              {/* Error Title */}
              <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                {currentError.title}
              </h1>

              {/* Error Message */}
              <p className="text-xl text-gray-600 mb-4 text-center max-w-md">
                {displayMessage}
              </p>

              {/* Error Description */}
              {displayDescription && (
                <p className="text-gray-500 mb-8 text-center max-w-lg">
                  {displayDescription}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Primary Button */}
                <button
                  onClick={currentError.buttonAction}
                  className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {currentError.buttonText}
                </button>

                {/* Secondary Button */}
                {currentError.showSecondaryButton && (
                  <button
                    onClick={currentError.secondaryButtonAction}
                    className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    {currentError.secondaryButtonText}
                  </button>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-20 left-10 w-20 h-20 bg-orange-100 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-50 rounded-full opacity-30 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-5 w-16 h-16 bg-orange-200 rounded-full opacity-40 animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ErrorPage;
