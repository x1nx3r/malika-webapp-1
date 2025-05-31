import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 my-2 sm:my-4">
      <div className="container mx-auto bg-[#FAFAFA] rounded-bl-8 sm:rounded-bl-16 rounded-br-8 sm:rounded-br-16 outline outline-2 outline-[#D9D9D9] -outline-offset-2">
        <div className="flex flex-col md:flex-row items-center justify-between p-4">
          {/* Logo */}
          <div
            className="w-[8rem] sm:w-[10rem] md:w-[12.5rem] h-[3rem] sm:h-[4.375rem] border border-black/22 mb-4 md:mb-0 cursor-pointer"
            onClick={() => navigate('/')}
          ></div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-[37.5rem] mb-4 md:mb-0 md:mx-4"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search Menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[3rem] md:h-[3.75rem] px-6 pr-12 rounded-full outline outline-1 outline-[#03081F] -outline-offset-[0.5px] text-lg font-semibold font-['Poppins']"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <svg
                  className="w-6 h-6"
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

          {/* Mobile Search Icon - Visible only on mobile */}
          <div className="md:hidden w-[2.5rem] h-[2.5rem] rounded-full flex items-center justify-center bg-gray-100 mb-4">
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
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
