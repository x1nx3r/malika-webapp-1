import PropTypes from 'prop-types';
import { useState } from 'react';
import EditMenuModal from './EditMenuModal';
import {
  FaEye,
  FaEyeSlash,
  FaPencilAlt,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaMinus,
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const MenuTable = ({
  menus,
  loading,
  error,
  onUpdate,
  onArchive,
  onUnarchive,
}) => {
  const [editingMenu, setEditingMenu] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({
    'Paket Porsian': true, // Default expanded
    'Paket Family': false,
    'Paket Hampers': false,
    'Frozen Food & Sambal': false,
  });

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
    'Paket Porsian',
    'Paket Family',
    'Paket Hampers',
    'Frozen Food & Sambal',
  ];

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleAllCategories = () => {
    const allExpanded = Object.values(expandedCategories).every(
      (expanded) => expanded
    );
    const newState = {};
    orderedCategories.forEach((category) => {
      newState[category] = !allExpanded;
    });
    setExpandedCategories(newState);
  };

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
        title: 'Tampilkan Menu?',
        text: 'Anda yakin ingin menampilkan menu ini kembali?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#f97316',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, Tampilkan',
        cancelButtonText: 'Batal',
      });

      if (result.isConfirmed) {
        await onUnarchive(menu.id);
      }
    } else {
      // Archive action
      const result = await Swal.fire({
        title: 'Arsipkan Menu?',
        text: 'Anda yakin ingin mengarsipkan menu ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f97316',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, Arsipkan',
        cancelButtonText: 'Batal',
      });

      if (result.isConfirmed) {
        await onArchive(menu.id);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">Memuat menu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-center">❌ Error: {error}</p>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-2">📝</div>
        <p className="text-gray-600">Tidak ada menu tersedia</p>
      </div>
    );
  }

  // Fungsi untuk memotong teks deskripsi
  const truncateDescription = (text, maxLength = 50) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text || '';
  };

  // Get category stats
  const getCategoryStats = (category) => {
    const categoryMenus = groupedMenus[category] || [];
    const total = categoryMenus.length;
    const active = categoryMenus.filter((menu) => !menu.isArchived).length;
    const archived = total - active;
    return { total, active, archived };
  };

  const renderActionButtons = (menu) => (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => handleEdit(menu)}
        className="group relative p-2 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all duration-200 transform hover:scale-110"
        title="Edit Menu"
      >
        <FaPencilAlt className="h-4 w-4" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Edit Menu
        </span>
      </button>
      <button
        onClick={() => handleArchiveAction(menu)}
        className="group relative p-2 hover:bg-gray-50 rounded-lg transition-all duration-200 transform hover:scale-110"
        title={menu.isArchived ? 'Tampilkan Menu' : 'Arsipkan Menu'}
      >
        {menu.isArchived ? (
          <FaEyeSlash className="h-4 w-4 text-red-500 hover:text-red-700" />
        ) : (
          <FaEye className="h-4 w-4 text-green-500 hover:text-green-700" />
        )}
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {menu.isArchived ? 'Tampilkan' : 'Arsipkan'}
        </span>
      </button>
    </div>
  );

  const renderTable = (category, menuList) => {
    if (category === 'Paket Porsian') {
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Kemasan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Harga
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {menuList.map((menu, index) => (
              <tr
                key={menu.id}
                className={`${
                  menu.isArchived
                    ? 'bg-gray-50 opacity-70'
                    : index % 2 === 0
                    ? 'bg-white'
                    : 'bg-gray-25'
                } hover:bg-orange-25 transition-colors duration-150`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {menu.imageUrl && (
                      <div className="flex-shrink-0 h-12 w-12 mr-4">
                        <img
                          className="h-12 w-12 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                          src={menu.imageUrl}
                          alt={menu.name}
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-sm font-semibold ${
                          menu.isArchived
                            ? 'text-gray-500 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {menu.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {truncateDescription(menu.description)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {menu.kemasan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-green-600">
                    Rp{menu.price.toLocaleString('id-ID')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderActionButtons(menu)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (category === 'Paket Family' || category === 'Paket Hampers') {
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Harga
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {menuList.map((menu, index) => (
              <tr
                key={menu.id}
                className={`${
                  menu.isArchived
                    ? 'bg-gray-50 opacity-70'
                    : index % 2 === 0
                    ? 'bg-white'
                    : 'bg-gray-25'
                } hover:bg-orange-25 transition-colors duration-150`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {menu.imageUrl && (
                      <div className="flex-shrink-0 h-12 w-12 mr-4">
                        <img
                          className="h-12 w-12 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                          src={menu.imageUrl}
                          alt={menu.name}
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-sm font-semibold ${
                          menu.isArchived
                            ? 'text-gray-500 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {menu.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {truncateDescription(menu.description)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-green-600">
                    Rp{menu.price.toLocaleString('id-ID')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderActionButtons(menu)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (category === 'Frozen Food & Sambal') {
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Isi
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Harga
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {menuList.map((menu, index) => (
              <tr
                key={menu.id}
                className={`${
                  menu.isArchived
                    ? 'bg-gray-50 opacity-70'
                    : index % 2 === 0
                    ? 'bg-white'
                    : 'bg-gray-25'
                } hover:bg-orange-25 transition-colors duration-150`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {menu.imageUrl && (
                      <div className="flex-shrink-0 h-12 w-12 mr-4">
                        <img
                          className="h-12 w-12 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                          src={menu.imageUrl}
                          alt={menu.name}
                        />
                      </div>
                    )}
                    <div
                      className={`text-sm font-semibold ${
                        menu.isArchived
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {menu.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {menu.amount}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-green-600">
                    Rp{menu.price.toLocaleString('id-ID')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderActionButtons(menu)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Control Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 shadow-sm">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-gray-700">
              Total: {menus.length} menu
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium text-gray-700">
              Aktif: {menus.filter((m) => !m.isArchived).length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="font-medium text-gray-700">
              Diarsipkan: {menus.filter((m) => m.isArchived).length}
            </span>
          </div>
        </div>
        <button
          onClick={toggleAllCategories}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-orange-300 bg-white rounded-lg hover:bg-orange-50 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {Object.values(expandedCategories).every((expanded) => expanded) ? (
            <>
              <FaMinus className="h-3 w-3" />
              Tutup Semua
            </>
          ) : (
            <>
              <FaPlus className="h-3 w-3" />
              Buka Semua
            </>
          )}
        </button>
      </div>

      {/* Enhanced Accordion Categories */}
      {orderedCategories.map((category) => {
        if (!groupedMenus[category]) return null;

        const stats = getCategoryStats(category);
        const isExpanded = expandedCategories[category];

        return (
          <div
            key={category}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Enhanced Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-6 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-between hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-lg">{category}</h3>
                <div className="flex gap-3 text-sm">
                  <span className="bg-orange-700 bg-opacity-50 px-3 py-1 rounded-full font-medium">
                    {stats.total}
                  </span>
                  <span className="bg-green-500 bg-opacity-80 px-3 py-1 rounded-full font-medium">
                    {stats.active}
                  </span>
                  {stats.archived > 0 && (
                    <span className="bg-gray-500 bg-opacity-80 px-3 py-1 rounded-full font-medium">
                      {stats.archived}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <FaChevronUp className="h-5 w-5 transform transition-transform duration-200" />
                ) : (
                  <FaChevronDown className="h-5 w-5 transform transition-transform duration-200" />
                )}
              </div>
            </button>

            {/* Enhanced Category Content */}
            {isExpanded && (
              <div className="overflow-x-auto border-t border-gray-100">
                {renderTable(category, groupedMenus[category])}
              </div>
            )}
          </div>
        );
      })}

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