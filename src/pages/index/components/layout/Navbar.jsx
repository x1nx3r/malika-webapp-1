import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      setIsMenuDropdownOpen(false);
      // Add your logout logic here
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfile = () => {
    console.log("Navigate to profile");
    setIsMenuDropdownOpen(false);
    // Add your profile navigation logic here
  };

  return (
    <header className="px-3 w-full flex justify-center">
      {/* Added container with max width */}
      <div className="w-full max-w-3xl">
        <div className="bg-[#FAFAFA] rounded-b-lg border-2 border-[#D9D9D9]">
          <div className="flex flex-col md:flex-row items-center justify-between p-3">
            {/* Logo */}
            <div
              className="w-32 h-12 border border-black/20 mb-3 md:mb-0 cursor-pointer"
              onClick={() => navigate("/")}
            ></div>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden md:block w-full max-w-md mx-4"
            >
              <div className="relative h-12">
                <input
                  type="text"
                  placeholder="Search Menu"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full px-4 rounded-full border border-[#03081F] text-base placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  aria-label="Search"
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none" fillRule="evenodd">
                      <path
                        fill="#666666"
                        d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </form>

            {/* Mobile Search Form */}
            <form onSubmit={handleSearch} className="md:hidden w-full mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Menu"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-full border border-[#03081F] text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 w-7 h-7 flex items-center justify-center rounded-full"
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none" fillRule="evenodd">
                      <path
                        fill="#666666"
                        d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </form>

            {/* Navigation Section */}
            <div className="w-full md:w-auto bg-[#028643] rounded-lg border-2 border-[#D9D9D9]">
              <div className="flex justify-between md:justify-start">
                <NavItem
                  icon={<CartIcon />}
                  label="Keranjang"
                  hasBorder
                  onClick={() => navigate("/cart")}
                />
                <NavItem
                  icon={<PaymentIcon />}
                  label="Pembayaran"
                  hasBorder
                  notification
                  onClick={() => navigate("/payment")}
                />
                <MenuNavItem
                  isDropdownOpen={isMenuDropdownOpen}
                  setIsDropdownOpen={setIsMenuDropdownOpen}
                  onProfile={handleProfile}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({ icon, label, hasBorder, notification, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex-1 md:w-24 py-2 md:h-16 flex items-center justify-center
        ${hasBorder ? "border-r-2 border-[#D9D9D9]" : ""}
        relative cursor-pointer hover:bg-green-800 transition-colors`}
    >
      <div className="flex flex-col items-center">
        <div className="w-6 h-6 sm:w-7 sm:h-7 relative mb-1">{icon}</div>
        <div className="text-center text-white text-xs font-medium">
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
  onLogout,
}) {
  return (
    <div className="relative flex-1 md:w-24">
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="py-2 md:h-16 flex items-center justify-center cursor-pointer hover:bg-green-800 transition-colors"
      >
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 sm:w-7 sm:h-7 relative mb-1">
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

          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded shadow-md py-1 border border-gray-200 z-50">
            <button
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={onProfile}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
              </svg>
              Profile
            </button>

            <hr className="border-gray-200" />

            <button
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={onLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                />
                <path
                  fillRule="evenodd"
                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                />
              </svg>
              Logout
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
