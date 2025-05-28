import PropTypes from "prop-types";
import { useState } from "react";
import EditMenuModal from "./EditMenuModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

const MenuTable = ({ menus, loading, error, onUpdate, onArchive, onUnarchive }) => {
  const [editingMenu, setEditingMenu] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Kelompokkan menu berdasarkan kategori
  const groupedMenus = menus.reduce((acc, menu) => {
    if (!acc[menu.category]) {
      acc[menu.category] = [];
    }
    acc[menu.category].push(menu);
    return acc;
  }, {});

  // Urutkan kategori sesuai urutan yang diinginkan
  const orderedCategories = [
    "Paket Porsian",
    "Paket Family",
    "Paket Hampers",
    "Frozen Food & Sambal",
  ];

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (id, updatedData) => {
    await onUpdate(id, updatedData);
    setIsEditModalOpen(false);
  };

  const handleArchiveAction = async (menu) => {
    if (menu.isArchived) {
      // Unarchive action
      const result = await Swal.fire({
        title: "Tampilkan Menu?",
        text: "Anda yakin ingin menampilkan menu ini kembali?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#f97316",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, Tampilkan",
        cancelButtonText: "Batal"
      });

      if (result.isConfirmed) {
        await onUnarchive(menu.id);
      }
    } else {
      // Archive action
      const result = await Swal.fire({
        title: "Arsipkan Menu?",
        text: "Anda yakin ingin mengarsipkan menu ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f97316",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, Arsipkan",
        cancelButtonText: "Batal"
      });

      if (result.isConfirmed) {
        await onArchive(menu.id);
      }
    }
  };

  if (loading) {
    return <p className="text-center py-4">Memuat menu...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-4">Error: {error}</p>;
  }

  if (menus.length === 0) {
    return <p className="text-center py-4">Tidak ada menu tersedia</p>;
  }

  return (
    <div className="space-y-8">
      {orderedCategories.map(
        (category) =>
          groupedMenus[category] && (
            <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
              <h3 className="bg-orange-500 text-white px-4 py-2 font-semibold">
                {category}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kemasan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Harga
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupedMenus[category].map((menu) => (
                      <tr key={menu.id} className={menu.isArchived ? "bg-gray-100 opacity-80" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {menu.imageUrl && (
                              <div className="flex-shrink-0 h-10 w-10 mr-3">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={menu.imageUrl}
                                  alt={menu.name}
                                />
                              </div>
                            )}
                            <div>
                              <div className={`text-sm font-medium ${menu.isArchived ? "text-gray-500 line-through" : "text-gray-900"}`}>
                                {menu.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {menu.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {menu.kemasan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Rp{menu.price.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                                onClick={() => handleEdit(menu)}
                                className="text-orange-600 hover:text-orange-900 mr-3"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleArchiveAction(menu)}
                                className="text-gray-600 hover:text-gray-900"
                                title={menu.isArchived ? "Tampilkan Menu" : "Arsipkan Menu"}
                            >
                                {menu.isArchived ? (
                                <FaEyeSlash className="text-red-500" />
                                ) : (
                                <FaEye className="text-green-500" />
                                )}
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
      )}

      <EditMenuModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        menu={editingMenu}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

MenuTable.propTypes = {
  menus: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  onUnarchive: PropTypes.func.isRequired,
};

export default MenuTable;