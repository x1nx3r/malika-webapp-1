import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../../firebase";
import Swal from 'sweetalert2';

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Monitor auth state
  useState(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleCartClick = () => {
    if (!auth.currentUser) {
      navigate('/auth');
      return;
    }
    navigate('/cart');
  };

  const handlePaymentClick = () => {
    if (!auth.currentUser) {
      navigate('/auth');
      return;
    }
    navigate('/payment');
  };

  const handleLogout = async () => {
    // Tutup dropdown menu terlebih dahulu
    setIsMenuDropdownOpen(false);

    // Tampilkan popup konfirmasi dengan SweetAlert2
    const result = await Swal.fire({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin keluar dari akun ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      customClass: {
        container: 'swal2-container',
        popup: 'swal2-popup',
        title: 'swal2-title',
        content: 'swal2-content',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel'
      }
    });

    // Jika user mengkonfirmasi logout
    if (result.isConfirmed) {
      try {
        console.log("Logging out...");

        // Tampilkan loading saat proses logout
        Swal.fire({
          title: 'Sedang Logout...',
          text: 'Mohon tunggu sebentar',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // First sign out from Firebase Auth
        await auth.signOut();

        // Then call the server logout endpoint to clear cookies
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "logout" }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Server logout failed");
        }

        // Tutup loading dan tampilkan pesan sukses
        await Swal.fire({
          title: 'Logout Berhasil!',
          text: 'Anda telah berhasil keluar dari akun.',
          icon: 'success',
          confirmButtonColor: '#28a745',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true
        });

        // Redirect to home page after successful logout
        navigate("/");
      } catch (error) {
        console.error("Error signing out:", error);
        
        // Tampilkan pesan error jika logout gagal
        await Swal.fire({
          title: 'Logout Gagal',
          text: 'Terjadi kesalahan saat logout. Silakan coba lagi.',
          icon: 'error',
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'OK'
        });

        // Even if there was an error, try to navigate away
        navigate("/");
      }
    }
  };

  const handleProfile = () => {
    setIsMenuDropdownOpen(false);
    navigate("/profile");
  };

  const handleHistory = () => {
    setIsMenuDropdownOpen(false);
    navigate("/history");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <header className="flex justify-center">
      {/* Added container with max width */}
      <div className="w-full">
        <div className="bg-[#FAFAFA] rounded-b-xl border-2 border-[#D9D9D9]">
          <div className="flex flex-col md:flex-row items-center justify-between pl-2">
            {/* Logo */}
            <div
              className="w-1/4 h-12 border border-black/20 mb-3 md:mb-0 cursor-pointer"
              onClick={() => navigate("/")}
            ></div>

            {/* Desktop Search Bar */}
            <div className="hidden md:block w-full max-w-md mx-4">
              <div className="relative h-10">
                <input
                  type="text"
                  placeholder="Search Menu"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onSearch(e.target.value);
                  }}
                  className="w-full h-10 px-4 rounded-full border border-gray-400 font-poppins text-center placeholder:font-semibold placeholder:text-gray-600"
                />
                {/* Ganti icon search dengan X ketika ada input */}
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    aria-label="Clear search"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500 hover:text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g fill="none" fillRule="evenodd">
                        <path
                          fill="#666666"
                          d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"
                        />
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden w-full mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Menu"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onSearch(e.target.value);
                  }}
                  className="w-full h-10 px-3 py-2 rounded-full border border-[#03081F] text-sm"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 w-7 h-7 flex items-center justify-center rounded-full"
                    aria-label="Clear search"
                  >
                    <svg
                      className="w-4 h-4 text-gray-500 hover:text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 w-7 h-7 flex items-center justify-center rounded-full">
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g fill="none" fillRule="evenodd">
                        <path
                          fill="#666666"
                          d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"
                        />
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Section */}
            <div className="w-1/4 bg-[#028643] rounded-b-xl">
              <div className="flex justify-between">
                <NavItem
                  icon={<CartIcon />}
                  label="Keranjang"
                  hasBorder
                  left
                  onClick={handleCartClick}
                />
                <NavItem
                  icon={<PaymentIcon />}
                  label="Pembayaran"
                  hasBorder
                  notification
                  onClick={handlePaymentClick}
                />
                {user ? (
                  <MenuNavItem
                    isDropdownOpen={isMenuDropdownOpen}
                    setIsDropdownOpen={setIsMenuDropdownOpen}
                    onProfile={handleProfile}
                    onHistory={handleHistory}
                    onLogout={handleLogout}
                  />
                ) : (
                  <LoginNavItem onClick={handleLogin} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Komponen LoginNavItem yang baru
function LoginNavItem({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex-1 md:w-24 py-2 md:h-16 flex items-center justify-center relative cursor-pointer hover:bg-green-800 hover:rounded-br-xl transition-all duration-200 ease-in"
    >
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 relative mb-1">
          <LoginIcon />
        </div>
        <div className="text-center text-white text-xs font-poppins font-medium">Login</div>
      </div>
    </div>
  );
}

// Komponen LoginIcon yang baru
function LoginIcon() {
  return (
    <svg className="w-full h-full text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6m0 14c-2.03 0-4.43-.82-6.14-2.88a9.95 9.95 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20" stroke-width="0.5" stroke="currentColor" />
    </svg>
  );
}

function NavItem({ icon, label, left, hasBorder, notification, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex-1 md:w-24 py-2 md:h-16 flex items-center justify-center
        ${hasBorder ? "border-r-2 border-[#D9D9D9]" : ""}
        ${left ? "hover:rounded-bl-xl" : ""}
        relative cursor-pointer hover:bg-green-800 transition-all duration-200 ease-in`}
    >
      <div className="flex flex-col items-center">
        <div className="w-6 h-6 sm:w-7 sm:h-7 relative mb-1">{icon}</div>
        <div className="text-center text-white text-xs font-poppins font-medium">
          {label}
        </div>
      </div>
      {notification && (
        <div className="w-3 h-3 absolute top-0 right-2 bg-[#FC8A06] rounded-full"></div>
      )}
    </div>
  );
}

function MenuNavItem({
  isDropdownOpen,
  setIsDropdownOpen,
  onProfile,
  onHistory,
  onLogout,
}) {
  return (
    <div className="relative flex-1 md:w-24">
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="py-2 md:h-16 flex items-center justify-center cursor-pointer hover:bg-green-800 hover:rounded-br-xl transition-all duration-200 ease-in"
      >
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 relative mb-1">
            <MenuIcon />
          </div>
          <div className="text-center text-white text-xs font-medium">Menu</div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />

          <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-md py-1 border border-gray-200 z-50">
            <button
              className="flex items-center w-full px-5 py-3 font-poppins font-medium text-gray-800 hover:bg-gray-100 hover:rounded-t-xl"
              onClick={onProfile}
            >
              <svg className="mr-3 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
                <path fill="currentColor" d="M16 2a7 7 0 1 0 0 14a7 7 0 0 0 0-14m-6 7a6 6 0 1 1 12 0a6 6 0 0 1-12 0m-2.5 9A3.5 3.5 0 0 0 4 21.5v.667C4 24.317 6.766 30 16 30s12-5.684 12-7.833V21.5a3.5 3.5 0 0 0-3.5-3.5zM5 21.5A2.5 2.5 0 0 1 7.5 19h17a2.5 2.5 0 0 1 2.5 2.5v.667C27 23.684 24.765 29 16 29S5 23.684 5 22.167z" stroke-width="2" stroke="currentColor" />
              </svg>
              Profil Saya
            </button>

            <hr className="border-gray-200" />

            <button
              className="flex items-center w-full px-5 py-3 font-poppins font-medium text-gray-800 hover:bg-gray-100"
              onClick={onHistory}
            >
              <svg className="mr-3 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21 11.11V5a2 2 0 0 0-2-2h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h6.11c1.26 1.24 2.98 2 4.89 2c3.87 0 7-3.13 7-7c0-1.91-.76-3.63-2-4.89M12 3c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M5 19V5h2v2h10V5h2v4.68c-.91-.43-1.92-.68-3-.68H7v2h4.1c-.6.57-1.06 1.25-1.42 2H7v2h2.08c-.05.33-.08.66-.08 1c0 1.08.25 2.09.68 3zm11 2c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m.5-4.75l2.86 1.69l-.75 1.22L15 17v-5h1.5z" />
              </svg>
              Riwayat Pesanan
            </button>

            <hr className="border-gray-200" />

            <button
              className="flex items-center w-full px-5 py-3 font-poppins font-medium text-red-600 hover:bg-red-100 hover:rounded-b-xl"
              onClick={onLogout}
            >
              <svg className="ml-0.25 mr-2.75 text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="40" d="M304 336v40a40 40 0 0 1-40 40H104a40 40 0 0 1-40-40V136a40 40 0 0 1 40-40h152c22.09 0 48 17.91 48 40v40m64 160l80-80l-80-80m-192 80h256" />
              </svg>
              Keluar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Icon components simplified
function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="w-full h-full text-white"
      fill="currentColor"
    >
      <circle cx="176" cy="416" r="32" />
      <circle cx="400" cy="416" r="32" />
      <path d="M456.8 120.78a23.92 23.92 0 0 0-18.56-8.78H133.89l-6.13-34.78A16 16 0 0 0 112 64H48a16 16 0 0 0 0 32h50.58l45.66 258.78A16 16 0 0 0 160 368h256a16 16 0 0 0 0-32H173.42l-5.64-32h241.66A24.07 24.07 0 0 0 433 284.71l28.8-144a24 24 0 0 0-5-19.93" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="w-full h-full text-white"
      fill="currentColor"
    >
      <path d="M0 64c0-17.7 14.3-32 32-32h80c79.5 0 144 64.5 144 144c0 58.8-35.2 109.3-85.7 131.7l51.4 128.4c6.6 16.4-1.4 35-17.8 41.6s-35-1.4-41.6-17.8l-56-139.9H64v128c0 17.7-14.3 32-32 32S0 465.7 0 448zm64 192h48c44.2 0 80-35.8 80-80s-35.8-80-80-80H64zm256-96h80c61.9 0 112 50.1 112 112s-50.1 112-112 112h-48v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32m80 160c26.5 0 48-21.5 48-48s-21.5-48-48-48h-48v96z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-full h-full text-white"
      fill="currentColor"
    >
      <path d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z" />
    </svg>
  );
}

export default Navbar;