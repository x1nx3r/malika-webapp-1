export default function OrderSummary({ items }) {
  // Format currency helper
  const formatCurrency = (amount) => {
    return `Rp${amount.toLocaleString("id-ID")},-`;
  };

  return (
    <div>
      <h2 className="text-stone-950 text-3xl font-semibold font-poppins mb-6">
        Menu yang dipesan:
      </h2>

      <div className="border-t border-b py-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center mb-4">
            <img
              className="w-36 h-36 rounded-xl object-cover"
              src={item.imageUrl || "https://placehold.co/140x140"}
              alt={item.name}
            />
            <div className="ml-6 flex-grow">
              <h3 className="text-stone-950 text-2xl font-semibold font-poppins">
                {item.name}
              </h3>
              <p className="text-stone-950 text-xl font-semibold font-poppins mt-2">
                Kemasan: {item.kemasan || "Styrofoam"}
              </p>
              <p className="text-stone-950 text-lg font-medium mt-1">
                Jumlah: {item.quantity}
              </p>
            </div>
            <div className="bg-zinc-300 rounded-md px-4 py-2">
              <span className="text-stone-950 text-xl font-bold font-poppins">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
