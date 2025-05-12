import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function AdminHeader({ activeTab, onTabChange }) {
  const navigate = useNavigate();

  const handleNavigation = (tab) => {
    if (tab === "pesanan") {
      navigate("/admin"); // Navigate to AdminPenjualan
    } else if (tab === "laporan") {
      navigate("/admin/keuangan"); // Navigate to AdminKeuangan
    }

    // Also call the onTabChange function if it exists
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <header className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-16 h-8 bg-orange-500 rounded-full"></div>
        <h1 className="text-5xl font-semibold font-sans">Dashboard</h1>
      </div>
      <div className="flex gap-4">
        <button
          className={`px-8 py-3 border border-slate-900 rounded-full ${
            activeTab === "pesanan"
              ? "bg-slate-900 text-white"
              : "text-slate-900"
          } font-semibold`}
          onClick={() => handleNavigation("pesanan")}
        >
          Pesanan
        </button>
        <button
          className={`px-8 py-3 border border-slate-900 rounded-full ${
            activeTab === "laporan"
              ? "bg-slate-900 text-white"
              : "text-slate-900"
          } font-semibold`}
          onClick={() => handleNavigation("laporan")}
        >
          Laporan Penjualan
        </button>
      </div>
    </header>
  );
}

AdminHeader.propTypes = {
  activeTab: PropTypes.oneOf(["pesanan", "laporan"]),
  onTabChange: PropTypes.func,
};

AdminHeader.defaultProps = {
  activeTab: "pesanan",
};
