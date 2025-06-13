import React from "react"; // Add this import
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
import ErrorPage from "./pages/errorpage/error";
import "./index.css";
import ShoppingCart from "./pages/shoppingCart/shoppingCart";
import Checkout from "./pages/checkOut/checkOut";
import PaymentRedirect from "./pages/payment/components/paymentRedirect";
import PaymentPage from "./pages/payment/paymentPage";
import ProfilePage from "./pages/profile/profilePage";
import HistoryPage from "./pages/history/historyPage";
import HistoryDetailPage from "./pages/history/historyDetailPage";

// Error Boundary Component (Fixed)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          errorCode={500}
          errorMessage="Kesalahan Aplikasi"
          errorDescription="Terjadi kesalahan pada aplikasi. Silakan refresh halaman atau coba lagi nanti."
        />
      );
    }

    return this.props.children;
  }
}

const AppWrapper = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [roleError, setRoleError] = useState(null);
  const tokenRefreshTimer = useRef(null);
  const maxRetries = 3;
  const retryCount = useRef(0);

  // Enhanced error logging
  const logError = (context, error, additionalInfo = {}) => {
    console.error(`[${context}] Error:`, {
      message: error?.message || "Unknown error",
      code: error?.code || "unknown",
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      ...additionalInfo,
    });
  };

  // Component to protect routes that require authentication
  const ProtectedRoute = ({ children, requireAuth = true }) => {
    if (authError) {
      return (
        <ErrorPage
          errorCode={500}
          errorMessage="Kesalahan Layanan Autentikasi"
          errorDescription="Tidak dapat memverifikasi status autentikasi Anda. Silakan coba refresh halaman."
        />
      );
    }

    if (requireAuth && !user) {
      return (
        <ErrorPage
          errorCode={401}
          errorMessage="Diperlukan Autentikasi"
          errorDescription="Anda perlu masuk untuk mengakses halaman ini."
        />
      );
    }

    return children;
  };

  // Component to protect admin routes with enhanced error handling
  const AdminRoute = ({ children }) => {
    if (authError) {
      return (
        <ErrorPage
          errorCode={500}
          errorMessage="Kesalahan Layanan Autentikasi"
          errorDescription="Tidak dapat memverifikasi status autentikasi Anda. Silakan coba refresh halaman."
        />
      );
    }

    if (!user) {
      return (
        <ErrorPage
          errorCode={401}
          errorMessage="Diperlukan Autentikasi"
          errorDescription="Anda perlu masuk untuk mengakses fitur admin."
        />
      );
    }

    if (roleError) {
      return (
        <ErrorPage
          errorCode={500}
          errorMessage="Kesalahan Verifikasi Peran"
          errorDescription="Tidak dapat memverifikasi izin Anda. Silakan coba refresh halaman atau hubungi dukungan."
        />
      );
    }

    if (userRole === null) {
      // Still loading role
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Memverifikasi izin...</span>
        </div>
      );
    }

    if (userRole !== "admin") {
      return (
        <ErrorPage
          errorCode={403}
          errorMessage="Diperlukan Akses Admin"
          errorDescription="Bagian ini hanya untuk administrator. Hubungi administrator sistem jika Anda yakin ini adalah kesalahan."
        />
      );
    }

    return children;
  };

  // Simplified SafeComponent wrapper
  const SafeComponent = ({ component: Component, ...props }) => {
    if (!Component) {
      return (
        <ErrorPage
          errorCode={500}
          errorMessage="Kesalahan Komponen"
          errorDescription="Komponen tidak dapat dimuat. Silakan coba refresh halaman."
        />
      );
    }
    return <Component {...props} />;
  };

  // Enhanced token refresh with retry logic
  const refreshToken = async () => {
    try {
      if (!auth.currentUser) {
        console.log("Tidak ada pengguna saat ini, melewati refresh token");
        return;
      }

      console.log("Memperbarui token autentikasi...");
      const token = await auth.currentUser.getIdToken(true);
      document.cookie = `firebaseToken=${token}; path=/; max-age=3600`;

      // Reset retry count on success
      retryCount.current = 0;
      scheduleTokenRefresh(55 * 60 * 1000); // 55 minutes
    } catch (error) {
      logError("Token Refresh", error, {
        retryAttempt: retryCount.current,
        userId: auth.currentUser?.uid,
      });

      retryCount.current += 1;

      if (retryCount.current >= maxRetries) {
        console.error(
          "Maksimal percobaan refresh token tercapai, memaksa logout",
        );
        setAuthError({
          code: "token-refresh-failed",
          message: "Tidak dapat memperbarui token autentikasi",
        });
        try {
          await auth.signOut();
        } catch (signOutError) {
          console.error("Error signing out:", signOutError);
        }
        return;
      }

      // Exponential backoff: 1min, 2min, 4min
      const retryDelay = Math.min(
        60 * 1000 * Math.pow(2, retryCount.current - 1),
        4 * 60 * 1000,
      );
      scheduleTokenRefresh(retryDelay);
    }
  };

  // Function to schedule token refresh
  const scheduleTokenRefresh = (delay) => {
    if (tokenRefreshTimer.current) {
      clearTimeout(tokenRefreshTimer.current);
    }

    tokenRefreshTimer.current = setTimeout(refreshToken, delay);
    console.log(
      `Refresh token dijadwalkan dalam ${Math.round(delay / 60000)} menit`,
    );
  };

  // Enhanced role fetching with error handling
  const fetchUserRole = async (userId) => {
    try {
      setRoleError(null);
      const role = await getUserRole(userId);
      setUserRole(role);
      return role;
    } catch (error) {
      logError("Role Fetch", error, { userId });
      setRoleError({
        code: "role-fetch-failed",
        message: "Tidak dapat mengambil peran pengguna",
      });
      // Default to 'user' role on error to prevent complete lockout
      setUserRole("user");
      return "user";
    }
  };

  useEffect(() => {
    let mounted = true;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!mounted) return;

      try {
        setAuthError(null);

        if (user) {
          // Fetch user role with error handling
          try {
            await fetchUserRole(user.uid);
          } catch (roleError) {
            // Role error is already handled in fetchUserRole
            console.warn("Role fetch failed, continuing with default role");
          }

          // Token management with enhanced error handling
          try {
            const tokenResult = await user.getIdTokenResult();
            const token = tokenResult.token;

            document.cookie = `firebaseToken=${token}; path=/; max-age=3600`;

            const expiresAt = new Date(tokenResult.expirationTime).getTime();
            const now = Date.now();
            const timeToRefresh = Math.max(0, expiresAt - now - 5 * 60 * 1000);

            scheduleTokenRefresh(timeToRefresh);
          } catch (tokenError) {
            logError("Token Setup", tokenError, { userId: user.uid });
            // Don't block user experience for token issues
          }
        } else {
          // Clear state when user logs out
          setUserRole(null);
          setRoleError(null);
          if (tokenRefreshTimer.current) {
            clearTimeout(tokenRefreshTimer.current);
            tokenRefreshTimer.current = null;
          }
        }

        if (mounted) {
          setUser(user);
        }
      } catch (error) {
        logError("Auth State Change", error);
        if (mounted) {
          setAuthError({
            code: "auth-state-error",
            message: "Kesalahan status autentikasi",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
      if (tokenRefreshTimer.current) {
        clearTimeout(tokenRefreshTimer.current);
      }
    };
  }, []);

  // Loading state with timeout
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn("Timeout loading tercapai");
        setLoading(false);
        setAuthError({
          code: "loading-timeout",
          message: "Timeout layanan autentikasi",
        });
      }
    }, 15000); // Increased to 15 seconds

    return () => clearTimeout(loadingTimeout);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <ErrorPage
        errorCode={500}
        errorMessage="Kesalahan Layanan Autentikasi"
        errorDescription="Kami mengalami masalah dengan layanan autentikasi. Silakan coba refresh halaman."
      />
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<SafeComponent component={Index} />} />
          <Route
            path="/aboutme"
            element={<SafeComponent component={AboutMe} />}
          />
          <Route
            path="/auth"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <SafeComponent component={AuthIndex} />
              )
            }
          />

          {/* Protected user routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <SafeComponent component={ShoppingCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <SafeComponent component={Checkout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <SafeComponent component={PaymentRedirect} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:orderId"
            element={
              <ProtectedRoute>
                <SafeComponent component={PaymentPage} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <SafeComponent component={ProfilePage} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <SafeComponent component={HistoryPage} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history/:orderId"
            element={
              <ProtectedRoute>
                <SafeComponent component={HistoryDetailPage} />
              </ProtectedRoute>
            }
          />

          {/* Admin routes with enhanced protection */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <SafeComponent component={AdminPenjualan} />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/keuangan"
            element={
              <AdminRoute>
                <SafeComponent component={AdminKeuangan} />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/kelolamenu"
            element={
              <AdminRoute>
                <SafeComponent component={AdminKelolaMenu} />
              </AdminRoute>
            }
          />

          {/* Error page route */}
          <Route path="/error" element={<ErrorPage />} />

          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

// Enhanced root rendering with error handling
const root = document.getElementById("root");
if (!root) {
  console.error("Elemen root tidak ditemukan");
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <h1 style="color: #dc2626;">Kesalahan Aplikasi</h1>
        <p>Tidak dapat menemukan elemen root. Silakan refresh halaman.</p>
      </div>
    </div>
  `;
} else {
  try {
    ReactDOM.createRoot(root).render(<AppWrapper />);
  } catch (error) {
    console.error("Gagal merender aplikasi:", error);
    root.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
          <h1 style="color: #dc2626;">Aplikasi Gagal Dimuat</h1>
          <p>Terjadi kesalahan saat memulai aplikasi. Silakan refresh halaman.</p>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #f97316; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Refresh Halaman
          </button>
        </div>
      </div>
    `;
  }
}
