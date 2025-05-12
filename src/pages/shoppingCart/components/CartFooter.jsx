function CartFooter({ totalItems, totalPrice, onCheckout }) {
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-between px-4 max-w-3xl mx-auto">
      <div className="w-64 h-16 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-amber-500 flex items-center justify-center">
        <div className="text-center">
          <span className="text-stone-950 text-sm font-medium font-['Poppins']">
            Jumlah yang dipesan:{" "}
          </span>
          <span className="text-stone-950 text-lg font-bold font-['Poppins']">
            {totalItems} porsi
          </span>
          <div className="text-stone-950 text-sm font-medium">
            Total: Rp{totalPrice.toLocaleString("id-ID")},-
          </div>
        </div>
      </div>
      <button
        onClick={onCheckout}
        className="w-1/2 h-16 bg-amber-500 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
      >
        <span className="text-white text-xl font-bold font-['Poppins']">
          Checkout
        </span>
      </button>
    </div>
  );
}

export default CartFooter;
