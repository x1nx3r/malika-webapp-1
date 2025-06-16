import malikaLogo from "../../../assets/malika.svg";

export default function CheckoutHeader({ onCancel }) {
  return (
    <div className="px-30 fixed top-0 left-0 right-0 z-50">
      <div className="w-full h-16 bg-green-700 py-3 px-4 rounded-b-2xl">
        <div className="flex items-center justify-between">
          {/* Logo - Using actual logo instead of placeholder */}
          <div className="w-28 h-10 flex items-center">
            <img
              src={malikaLogo}
              alt="Malika Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
          
          <h1 className="text-white text-2xl font-semibold font-poppins">
            Checkout
          </h1>
          
          <button
            onClick={onCancel}
            className="w-[130px] h-10 bg-white rounded-lg overflow-hidden flex justify-center items-center hover:bg-gray-100 transition-all duration-200 ease-in"
          >
            <div className="mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                <g fill="none">
                  <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path fill="currentColor" d="M3.283 10.94a1.5 1.5 0 0 0 0 2.12l5.656 5.658a1.5 1.5 0 1 0 2.122-2.122L7.965 13.5H19.5a1.5 1.5 0 0 0 0-3H7.965l3.096-3.096a1.5 1.5 0 1 0-2.122-2.121z" />
                </g>
              </svg>
            </div>
            <span className="ml-2 mr-1 text-stone-950 text-sm font-semibold font-poppins cursor-pointer">
              Batalkan
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}