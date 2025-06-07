import QuantityControl from "./QuantityControl";

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center px-4 mb-4 py-3 hover:bg-gray-50 transition-colors rounded-lg">
      <img
        className="w-24 h-24 rounded-lg object-cover border border-gray-200"
        src={item.imageUrl}
        alt={item.name}
      />
      <div className="ml-4 flex-grow">
        <h2 className="text-black text-xl font-semibold font-['Poppins']">
          {item.name}
        </h2>
        <div className="mt-2">
          <div className="w-auto inline-flex h-8 bg-zinc-300 rounded-md items-center justify-center px-3">
            {/* Price tag icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
              <path d="M7 7h.01"></path>
            </svg>
            <span className="text-stone-950 text-base font-bold font-['Poppins']">
              Rp{item.price.toLocaleString("id-ID")},-
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end ml-4">
        <span className="text-stone-950 text-sm font-semibold font-['Poppins'] mb-1 flex items-center">
          {/* Package icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
            <path d="M12 3v6"></path>
          </svg>
          Kemasan:
        </span>
        <div className="w-32 h-8 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-950 flex items-center justify-between px-2">
          <span className="text-stone-950 text-sm font-medium font-['Poppins']">
            {item.kemasan}
          </span>
          {/* Dropdown icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      <div className="ml-4">
        <span className="text-stone-950 text-sm font-semibold font-['Poppins'] mb-1 block text-center">
          Jumlah
        </span>
        <QuantityControl
          quantity={item.quantity}
          onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
          onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
        />
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
        aria-label="Remove item"
        title="Remove item"
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
