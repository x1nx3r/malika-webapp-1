import { useState } from 'react';

function Navbar() {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 py-1 bg-white fixed top-0 left-0 right-0 z-30 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 w-20 sm:w-24">
          <img
            src="https://gevannoyoh.com/thumb-malika/thumb-logo.webp"
            alt="Kedai Malika Logo"
            className="h-auto w-full"
          />
        </div>

        {/* Search Bar - Responsive design */}
        <div
          className={`flex-grow mx-4 max-w-xl ${
            isSearchActive ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search Menu"
              className="w-full py-1 px-4 bg-gray-100 rounded-full text-xs"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="#666"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search Toggle */}
          <button
            className="md:hidden p-1 bg-gray-100 rounded-full"
            onClick={() => setIsSearchActive(!isSearchActive)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="#666"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </button>

          {/* Cart Button */}
          <button className="p-1 bg-gray-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="#666"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
