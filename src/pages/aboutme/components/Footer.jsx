const Footer = () => (
  <footer className="py-12 bg-gray-200 mt-auto">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div className="border border-gray-300 p-6 w-full md:w-48 h-32 flex items-center justify-center mb-4">
          <img src="/api/placeholder/120/80" alt="Kedai Malika Logo" />
        </div>
        <p className="text-sm text-gray-600">
          Usaha Mikro, Kecil, dan Menengah (UMKM) di Kota Surabaya
        </p>
      </div>
      <div>
        <h3 className="font-bold mb-4">Sampaikan tawaran Anda kepada kami</h3>
        <button className="bg-orange-400 text-white px-4 py-2 rounded-full flex items-center gap-2 mb-6">
          <span>📞</span> 0822-5737-4357
        </button>
        <p className="mb-2">Lihat juga</p>
        <div className="flex gap-2">
          <a href="#" className="bg-gray-800 text-white p-2 rounded-md"></a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold mb-4">Tawaran Kami</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-orange-500">
                Rekomendasi
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500">
                Paket Porsian
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500">
                Paket Family
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500">
                Paket Hampers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500">
                Frozen Food & Sambal
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Lainnya</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-orange-500">
                Keranjang Saya
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500">
                Pembayaran
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
