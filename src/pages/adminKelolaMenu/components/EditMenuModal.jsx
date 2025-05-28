import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const validCategories = [
  "Paket Porsian",
  "Paket Family",
  "Paket Hampers",
  "Frozen Food & Sambal",
];

const EditMenuModal = ({ isOpen, onClose, menu, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    kemasan: "Styrofoam",
    description: "",
    price: "",
    category: "Paket Porsian",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && menu) {
      setFormData({
        name: menu.name || "",
        kemasan: menu.kemasan || "Styrofoam",
        description: menu.description || "",
        price: menu.price || "",
        category: menu.category || "Paket Porsian",
        imageUrl: menu.imageUrl || "",
      });
      setError("");
    }
  }, [isOpen, menu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error("Nama, harga, dan kategori harus diisi");
      }

      if (formData.price <= 0) {
        throw new Error("Harga harus lebih dari 0");
      }

      await onUpdate(menu.id, formData);
      
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Menu</h2>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kemasan
                </label>
                <input
                  type="text"
                  name="kemasan"
                  value={formData.kemasan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  min="1"
                />
              </div>

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
  menu: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
};

export default EditMenuModal;