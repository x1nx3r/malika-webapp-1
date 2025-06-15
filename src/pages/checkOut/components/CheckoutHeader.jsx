import malikaLogo from "../../../assets/malika.svg"; // Add this import

export default function CheckoutHeader({ onCancel }) {
  return (
    <header className="bg-green-700 py-4 px-5 rounded-b-lg shadow-md relative">
      <div className="flex items-center justify-between">
        {/* Logo - Updated to use actual logo */}
        <div className="w-auto h-10 flex items-center">
          <img
            src={malikaLogo}
            alt="Malika Logo"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Title with shopping bag icon */}
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white mr-2"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h1 className="text-white text-2xl font-semibold font-poppins">
            Checkout
          </h1>
        </div>

        {/* Cancel button with X icon */}
        <button
          onClick={onCancel}
          className="bg-white px-4 py-2 rounded-lg flex items-center transition-all hover:bg-gray-100 focus:ring-2 focus:ring-white/50 focus:outline-none active:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500 mr-1.5"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span className="text-stone-950 text-base font-semibold font-poppins">
            Batalkan
          </span>
        </button>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-white/20 rounded-t-md"></div>
    </header>
  );
}
