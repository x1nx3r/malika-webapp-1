function CartFooter({ totalPrice, onCheckout }) {
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-between gap-10 px-4 max-w-3xl mx-auto">
      <div className="w-1/2 h-16 flex items-center justify-center rounded-xl border-2 border-orange-400 hover:border-orange-700 transition-all duration-200 ease-in">
        <div className="cursor-default">
          <span className="text-gray-800 text-lg font-poppins font-semibold">
            Total:
          </span>
          <span className="ml-2 text-gray-800 text-xl font-poppins font-bold">
            Rp{totalPrice.toLocaleString("id-ID")},-
          </span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        className="w-1/2 h-16 flex items-center justify-center rounded-xl bg-orange-400 hover:bg-orange-500 transition-all duration-200 ease-in"
      >
        <span className="text-white text-xl font-poppins font-bold">
          Checkout
        </span>
      </button>
    </div>
  );
}

export default CartFooter;
