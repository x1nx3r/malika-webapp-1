import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 my-2 sm:my-4">
      <div className="container mx-auto bg-[#FAFAFA] rounded-bl-8 sm:rounded-bl-16 rounded-br-8 sm:rounded-br-16 outline outline-2 outline-[#D9D9D9] -outline-offset-2">
        <div className="flex flex-col md:flex-row items-center justify-between p-4">
          {/* Logo */}
          <div className="w-[8rem] sm:w-[10rem] md:w-[12.5rem] h-[3rem] sm:h-[4.375rem] border border-black/22 mb-4 md:mb-0"></div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex w-full max-w-[37.5rem] h-[3.75rem] overflow-hidden rounded-full outline outline-1 outline-[#03081F] -outline-offset-[0.5px] items-center justify-center relative mx-4">
            <div className="text-center text-[#666666] text-lg sm:text-xl font-semibold font-['Poppins']">
              Search Menu
            </div>
            <div className="absolute right-8 w-[1.5rem] h-[1.5rem] overflow-hidden">
              <svg
                className="w-[1.8rem] h-[1.8rem] m-[-0.1rem]"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g fill="none" fillRule="evenodd">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="#666666"
                    d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"
                  />
                </g>
              </svg>
            </div>
          </div>

          {/* Mobile Search Icon - Visible only on mobile */}
          <div className="md:hidden w-[2.5rem] h-[2.5rem] rounded-full flex items-center justify-center bg-gray-100 mb-4">
            <div className="w-[1.5rem] h-[1.5rem] relative">
              <div className="w-[1.125rem] h-[1.125rem] m-[0.1875rem] outline outline-[2.5px] outline-[#666666] -outline-offset-[1.25px]"></div>
            </div>
          </div>

          {/* Green Navigation Section */}
          <div className="w-full md:w-auto bg-[#028643] rounded-lg md:rounded-bl-14 md:rounded-br-14 outline outline-2 outline-[#D9D9D9]">
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
                onClick={() => navigate("/checkout")}
              />
              <NavItem icon={<MenuIcon />} label="Menu" />
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
      className={`flex-1 md:w-[7.8125rem] py-3 md:py-0 md:h-[6rem] flex items-center justify-center
        ${hasBorder ? "border-r-2 border-[#D9D9D9]" : ""}
        relative cursor-pointer hover:bg-green-800 transition-colors`}
    >
      <div className="flex flex-col items-center">
        <div className="w-[2rem] sm:w-[2.5rem] h-[2rem] sm:h-[2.5rem] relative overflow-hidden mb-1 sm:mb-2">
          {icon}
        </div>
        <div className="text-center text-white text-xs sm:text-sm font-medium font-['Poppins']">
          {label}
        </div>
      </div>
      {notification && (
        <div className="w-[1rem] h-[1rem] sm:w-[1.25rem] sm:h-[1.25rem] absolute top-[-0.5rem] right-2 sm:right-4 bg-[#FC8A06] rounded-full"></div>
      )}
    </div>
  );
}

function CartIcon() {
  return (
    <svg
      className="w-[2.95rem] h-[2.95rem] m-[-0.15rem]"
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 512 512"
    >
      <circle cx="176" cy="416" r="32" fill="#F0F0F0" />
      <circle cx="400" cy="416" r="32" fill="#F0F0F0" />
      <path
        fill="#F0F0F0"
        d="M456.8 120.78a23.92 23.92 0 0 0-18.56-8.78H133.89l-6.13-34.78A16 16 0 0 0 112 64H48a16 16 0 0 0 0 32h50.58l45.66 258.78A16 16 0 0 0 160 368h256a16 16 0 0 0 0-32H173.42l-5.64-32h241.66A24.07 24.07 0 0 0 433 284.71l28.8-144a24 24 0 0 0-5-19.93"
      />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      className="w-[2.5rem] h-[2.5rem]"
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 512 512"
    >
      <path
        fill="#F0F0F0"
        d="M0 64c0-17.7 14.3-32 32-32h80c79.5 0 144 64.5 144 144c0 58.8-35.2 109.3-85.7 131.7l51.4 128.4c6.6 16.4-1.4 35-17.8 41.6s-35-1.4-41.6-17.8l-56-139.9H64v128c0 17.7-14.3 32-32 32S0 465.7 0 448zm64 192h48c44.2 0 80-35.8 80-80s-35.8-80-80-80H64zm256-96h80c61.9 0 112 50.1 112 112s-50.1 112-112 112h-48v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32m80 160c26.5 0 48-21.5 48-48s-21.5-48-48-48h-48v96z"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      className="w-[2.85rem] h-[2.85rem] m-[-0.1rem]"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#F0F0F0"
        d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"
      />
    </svg>
  );
}

export default Navbar;
