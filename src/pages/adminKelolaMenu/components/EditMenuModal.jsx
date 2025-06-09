import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const validCategories = [
  "Paket Porsian",
  "Paket Family",
  "Paket Hampers",
  "Frozen Food & Sambal",
];

const packagingOptions = [
  "Styrofoam",
  "Kotak Nasi", 
  "Besek"
];

const formatCurrency = (value) => {
  if (!value) return "";
  const num = value.toString().replace(/\D/g, "");
  return "Rp" + num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrency = (value) => {
  return parseInt(value.replace(/\D/g, "")) || 0;
};

const EditMenuModal = ({ isOpen, onClose, menu, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    kemasan: "",
    description: "",
    price: "",
    category: "Paket Porsian",
    imageUrl: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    if (isOpen && menu) {
      document.body.classList.add('overflow-hidden');
      setFormData({
        name: menu.name || "",
        kemasan: menu.kemasan || "Styrofoam", // Default value untuk kemasan
        description: menu.description || "",
        price: menu.price || "",
        category: menu.category || "Paket Porsian",
        imageUrl: menu.imageUrl || "",
        amount: menu.amount || "",
      });
      setError("");
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpen, menu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        // Reset fields when category changes
        kemasan: value === "Paket Porsian" ? "Styrofoam" : "",
        description: value === "Frozen Food & Sambal" ? "" : prev.description,
        imageUrl: value === "Frozen Food & Sambal" ? "" : prev.imageUrl,
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
      // Validation
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error("Nama, harga, dan kategori harus diisi");
      }

      if (formData.price <= 0) {
        throw new Error("Harga harus lebih dari 0");
      }

      // Special validation for Frozen Food & Sambal
      if (formData.category === "Frozen Food & Sambal" && !formData.amount) {
        throw new Error("Isi harus diisi untuk kategori ini");
      }

      // Prepare data to send
      const dataToSend = {
        ...formData,
        // Only include kemasan for Paket Porsian
        kemasan: formData.category === "Paket Porsian" ? formData.kemasan : undefined,
        // Exclude description and imageUrl for Frozen Food
        description: formData.category !== "Frozen Food & Sambal" ? formData.description : undefined,
        imageUrl: formData.category !== "Frozen Food & Sambal" ? formData.imageUrl : undefined,
        // Always include amount (will be undefined for non-Frozen Food)
        amount: formData.amount || undefined,
      };

      await onUpdate(menu.id, dataToSend);
      
      await Swal.fire({
        title: "Berhasil!",
        text: "Menu berhasil diperbarui",
        icon: "success",
        confirmButtonColor: "#f97316",
        confirmButtonText: "OK",
        timer: 3000,
        timerProgressBar: true,
      });

      onClose();
    } catch (err) {
      setError(err.message);
      
      Swal.fire({
        title: "Gagal!",
        text: err.message || "Gagal memperbarui menu",
        icon: "error",
        confirmButtonColor: "#f97316",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !menu) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-6 overflow-y-auto flex-grow">
          <h2 className="text-2xl font-bold mb-4">Edit Menu</h2>
          
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

              {/* Kemasan (only for Paket Porsian) */}
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
                  >
                    {packagingOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Deskripsi (not for Frozen Food & Sambal) */}
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
                  min="1"
                />
              </div>

              {/* Isi (only for Frozen Food & Sambal) */}
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

              {/* URL Gambar (not for Frozen Food & Sambal) */}
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
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

EditMenuModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  menu: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    kemasan: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    category: PropTypes.string,
    imageUrl: PropTypes.string,
    amount: PropTypes.string,
  }),
  onUpdate: PropTypes.func.isRequired,
};

export default EditMenuModal;