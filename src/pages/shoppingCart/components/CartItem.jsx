import QuantityControl from "./QuantityControl";

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center px-4 mb-4">
      <img
        className="w-24 h-24 rounded-lg"
        src={item.imageUrl}
        alt={item.name}
      />
      <div className="ml-4 flex-grow">
        <h2 className="text-black text-xl font-semibold font-['Poppins']">
          {item.name}
        </h2>
        <div className="mt-2">
          <div className="w-32 h-8 bg-zinc-300 rounded-md flex items-center justify-center">
            <span className="text-stone-950 text-base font-bold font-['Poppins']">
              Rp{item.price.toLocaleString("id-ID")},-
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end ml-4">
        <span className="text-stone-950 text-sm font-semibold font-['Poppins'] mb-1">
          Kemasan:
        </span>
        <div className="w-32 h-8 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-950 flex items-center justify-between px-2">
          <span className="text-stone-950 text-sm font-medium font-['Poppins']">
            {item.kemasan}
          </span>
        </div>
      </div>
      <QuantityControl
        quantity={item.quantity}
        onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
        onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
      />
      <button
        onClick={onRemove}
        className="ml-4 p-2 text-red-500 hover:text-red-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export default CartItem;
