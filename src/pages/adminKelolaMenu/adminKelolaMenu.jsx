import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import MenuTable from "./components/MenuTable";
import CreateMenuModal from "./components/CreateMenuModal";
import Swal from "sweetalert2";

export default function AdminKelolaMenu() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("kelolamenu");
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Today's date
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("id-ID", options);
  const [day, date] = formattedDate.split(", ");

  // Fetch menus from Firestore
  const fetchMenus = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      const response = await fetch("/api/menu?showAll=true", {
        headers: {
          Cookie: `firebaseToken=${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMenus(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching menus:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [refreshKey]);

  // Fungsi untuk create Menu
  const handleCreateMenu = async (menuData) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `firebaseToken=${token}`,
        },
        body: JSON.stringify(menuData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newMenu = await response.json();
      
      // Trigger refresh data
      setRefreshKey(prev => prev + 1);
      
      // Tampilkan SweetAlert2 setelah berhasil
      Swal.fire({
        title: "Berhasil!",
        text: "Menu baru berhasil ditambahkan",
        icon: "success",
        confirmButtonColor: "#f97316", // Warna orange Tailwind
        confirmButtonText: "OK",
        timer: 3000,
        timerProgressBar: true,
      });

      return newMenu;
    } catch (err) {
      console.error("Error creating menu:", err);
      
      // Tampilkan SweetAlert2 jika error
      Swal.fire({
        title: "Gagal!",
        text: err.message || "Gagal menambahkan menu baru",
        icon: "error",
        confirmButtonColor: "#f97316",
        confirmButtonText: "OK",
      });
      
      throw err;
    }
  };

  // Fungsi untuk update menu
  const handleUpdateMenu = async (id, updatedData) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`/api/menu`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `firebaseToken=${token}`,
        },
        body: JSON.stringify({ id, ...updatedData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Trigger refresh data
      setRefreshKey(prev => prev + 1);
      
      Swal.fire({
        title: "Berhasil!",
        text: "Menu berhasil diperbarui",
        icon: "success",
        confirmButtonColor: "#f97316",
        confirmButtonText: "OK",
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error("Error updating menu:", err);
      
      Swal.fire({
        title: "Gagal!",
        text: err.message || "Gagal memperbarui menu",
        icon: "error",
        confirmButtonColor: "#f97316",
        confirmButtonText: "OK",
      });
      
      throw err;
    }
  };

  // Fungsi untuk archive menu
  const handleArchive = async (id) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch("/api/menu", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `firebaseToken=${token}`,
        },
        body: JSON.stringify({ 
          id, 
          isArchived: true // Pastikan mengirim true untuk archive
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setRefreshKey(prev => prev + 1);
      
      Swal.fire({
        title: "Berhasil!",
        text: "Menu berhasil diarsipkan",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 3000,
      });
    } catch (err) {
      console.error("Error archiving menu:", err);
      Swal.fire({
        title: "Gagal!",
        text: err.message || "Gagal mengarsipkan menu",
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    }
  };

  // Fungsi untuk unarchive menu
  const handleUnarchive = async (id) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch("/api/menu", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `firebaseToken=${token}`,
        },
        body: JSON.stringify({ 
          id, 
          isArchived: false // Pastikan mengirim false untuk unarchive
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setRefreshKey(prev => prev + 1);
      
      Swal.fire({
        title: "Berhasil!",
        text: "Menu berhasil ditampilkan kembali",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 3000,
      });
    } catch (err) {
      console.error("Error unarchiving menu:", err);
      Swal.fire({
        title: "Gagal!",
        text: err.message || "Gagal menampilkan menu",
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <AdminHeader activeTab={activeTab} onTabChange={handleTabChange} />
      <section className="px-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">Kelola Menu Kedai Malika:</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            Tambah Menu
          </button>
        </div>

        <MenuTable 
          menus={menus} 
          loading={loading} 
          error={error}
          onUpdate={handleUpdateMenu}
          onArchive={handleArchive}
          onUnarchive={handleUnarchive}
        />

        <CreateMenuModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateMenu}
        />
      </section>
    </div>
  );
}