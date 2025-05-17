export default function OrderSummary({ items }) {
  // Format currency helper
  const formatCurrency = (amount) => {
    return `Rp${amount.toLocaleString("id-ID")},-`;
  };

  return (
    <div>
      <h2 className="text-stone-950 text-xl font-semibold font-poppins mb-3">
        Menu yang dipesan:
      </h2>

      <div className="border-t border-b py-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center mb-2 py-2 border-b border-gray-100 last:border-b-0"
          >
            <img
              className="w-16 h-16 rounded-md object-cover"
              src={item.imageUrl || "https://placehold.co/140x140"}
              alt={item.name}
            />
            <div className="ml-3 flex-grow">
              <h3 className="text-stone-950 text-base font-semibold font-poppins">
                {item.name}
              </h3>
              <p className="text-stone-700 text-sm font-medium">
                {item.kemasan || "Styrofoam"} · Jumlah: {item.quantity}
              </p>
            </div>
            <div className="bg-zinc-200 rounded px-2 py-1 text-right">
              <span className="text-stone-950 text-sm font-bold font-poppins">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
