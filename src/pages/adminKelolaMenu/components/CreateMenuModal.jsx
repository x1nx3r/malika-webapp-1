import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const validCategories = [
  "Paket Porsian",
  "Paket Family",
  "Paket Hampers",
  "Frozen Food & Sambal",
];

const packagingOptions = [
  "Styrofoam",
  "Kotak Nasi",
  "Besek",
];

const CreateMenuModal = ({ isOpen, onClose, onCreate }) => {
  const initialFormData = {
    name: "",
    kemasan: "",
    description: "",
    price: "",
    category: "Paket Porsian",
    imageUrl: "",
    amount: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const formatCurrency = (value) => {
    if (!value) return "";
    // Hapus semua karakter non-digit
    const num = value.toString().replace(/\D/g, "");
    // Format dengan titik sebagai pemisah ribuan
    return "Rp" + num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseCurrency = (value) => {
    // Hapus semua karakter non-digit dan konversi ke number
    return parseInt(value.replace(/\D/g, "")) || 0;
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Reset form ketika modal dibuka/ditutup
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      setFormData({
        ...initialFormData,
        // Set default kemasan hanya untuk Paket Porsian
        kemasan: formData.category === "Paket Porsian" ? "Styrofoam" : "",
      });
      setError("");
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "imageUrl") {
      setImageError(false);
      setIsImageLoading(true);
    }
    
    // Jika kategori diubah, reset beberapa field yang terkait
    if (name === "category") {
      setFormData((prev) => ({
        ...initialFormData,
        category: value,
        // Set default kemasan hanya untuk Paket Porsian
        kemasan: value === "Paket Porsian" ? "Styrofoam" : "",
      }));
    } else if (name === "price") {
      setFormData((prev) => ({
        ...prev,
        price: parseCurrency(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validasi form
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error("Nama, harga, dan kategori harus diisi");
      }

      if (formData.price <= 0) {
        throw new Error("Harga harus lebih dari 0");
      }

      // Untuk Frozen Food & Sambal, pastikan amount diisi
      if (formData.category === "Frozen Food & Sambal" && !formData.amount) {
        throw new Error("Isi harus diisi untuk kategori ini");
      }

      // Bersihkan data sebelum dikirim
      const dataToSend = {
        ...formData,
        // Hapus kemasan jika bukan Paket Porsian
        kemasan: formData.category === "Paket Porsian" ? formData.kemasan : "",
        // Hapus description jika Frozen Food & Sambal
        description: formData.category !== "Frozen Food & Sambal" ? formData.description : undefined,
      };

      await onCreate(dataToSend);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-6 overflow-y-auto flex-grow">
          <h2 className="text-2xl font-bold mb-4">Tambah Menu Baru</h2>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {validCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nama Menu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Menu
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Kemasan (hanya untuk Paket Porsian) */}
              {formData.category === "Paket Porsian" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kemasan
                  </label>
                  <select
                    name="kemasan"
                    value={formData.kemasan}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required={formData.category === "Paket Porsian"}
                  >
                    {packagingOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Deskripsi (tidak untuk Frozen Food & Sambal) */}
              {formData.category !== "Frozen Food & Sambal" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
              )}

              {/* Harga */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="text"
                  name="price"
                  value={formatCurrency(formData.price)}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Isi (khusus Frozen Food & Sambal) */}
              {formData.category === "Frozen Food & Sambal" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Isi
                  </label>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    placeholder="Contoh: 250gr, 500ml, etc"
                  />
                </div>
              )}

              {/* URL Gambar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Gambar
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && !imageError && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview Gambar:</p>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="max-h-40 rounded-md border border-gray-200"
                      onError={handleImageError}
                    />
                  </div>
                )}
                {imageError && (
                  <p className="mt-1 text-sm text-red-500">
                    Gambar tidak dapat dimuat. Pastikan URL benar.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-orange-300"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

CreateMenuModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateMenuModal;