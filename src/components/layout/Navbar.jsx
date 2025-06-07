function Navbar() {
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
            <div className="absolute right-4 w-[1.5rem] h-[1.5rem] overflow-hidden">
              <div className="w-[1.125rem] h-[1.125rem] m-[0.1875rem] outline outline-[2.5px] outline-[#666666] -outline-offset-[1.25px]"></div>
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
              <NavItem icon={<CartIcon />} label="Keranjang" hasBorder />
              <NavItem
                icon={<PaymentIcon />}
                label="Pembayaran"
                hasBorder
                notification
              />
              <NavItem icon={<MenuIcon />} label="Menu" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({ icon, label, hasBorder, notification }) {
  return (
    <div
      className={`flex-1 md:w-[7.8125rem] py-3 md:py-0 md:h-[6rem] flex items-center justify-center ${hasBorder ? "border-r-2 border-[#D9D9D9]" : ""} relative`}
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
    <>
      <div className="w-[0.3125rem] h-[0.3125rem] absolute left-[0.703rem] top-[1.875rem] bg-[#F0F0F0]"></div>
      <div className="w-[0.3125rem] h-[0.3125rem] absolute left-[1.797rem] top-[1.875rem] bg-[#F0F0F0]"></div>
      <div className="w-[2.1rem] h-[1.484rem] absolute left-[0.156rem] top-[0.3125rem] bg-[#F0F0F0]"></div>
    </>
  );
}

function PaymentIcon() {
  return (
    <div className="w-full h-[2.344rem] absolute top-[0.156rem] bg-[#F0F0F0]"></div>
  );
}

function MenuIcon() {
  return (
    <div className="w-[1.75rem] h-[1.25rem] absolute left-[0.688rem] top-[0.938rem] outline outline-4 outline-[#F0F0F0] -outline-offset-2"></div>
  );
}

export default Navbar;