export default function ActionButtons() {
  return (
    <>
      <button className="w-full bg-orange-400 text-white py-3 rounded-lg font-semibold mb-4">
        Kirim Invoice
      </button>
      <button
        onClick={confirmDelivery}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md transition duration-200"
      >
        Konfirmasi Pesanan Dikirim
      </button>
    </>
  );
}
