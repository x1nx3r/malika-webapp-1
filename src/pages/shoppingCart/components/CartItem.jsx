import QuantityControl from "./QuantityControl";

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex justify-between items-center px-4 py-4 border-b border-gray-300 cursor-default">
      <div className="flex">
        <img
          className="w-30 h-30 rounded-xl object-cover"
          src={item.imageUrl}
          alt={item.name}
        />
        <div className="ml-4 flex-grow">
          <h2 className="text-gray-800 text-xl font-poppins font-semibold">
            {item.name}
          </h2>
          <div className="mt-2">
            <div className="w-auto inline-flex h-8 bg-gray-200 border border-gray-300 rounded-lg items-center justify-center px-3">
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
                className="-ml-0.5 mr-2"
              >
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                <path d="M7 7h.01"></path>
              </svg>
              <span className="text-black text-base font-bold font-['Poppins']">
                Rp{item.price.toLocaleString("id-ID")},-
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center ml-4">
          <span className="text-gray-800 text-sm font-semibold font-['Poppins'] mb-1 flex items-center">
            Kemasan:
          </span>
          <div className="w-32 h-8 rounded-lg outline-1 outline-offset-[-1px] outline-slate-950 flex items-center justify-center px-2">
            <span className="text-gray-800 text-sm font-medium font-['Poppins']">
              {item.kemasan}
            </span>
          </div>
        </div>
        <div className="mr-4">
          <span className="text-gray-800 text-sm font-semibold font-['Poppins'] mb-1 block text-center">
            Jumlah:
          </span>
          <QuantityControl
            quantity={item.quantity}
            onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm font-poppins font-semibold mb-1 text-center">
            Hapus
          </span>
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center justify-center p-2 text-red-500 border-2 border-red-300 hover:text-red-700 hover:border-red-500 rounded-lg transition-all duration-200 ease-in"
            aria-label="Remove item"
            title="Remove item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.088 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
