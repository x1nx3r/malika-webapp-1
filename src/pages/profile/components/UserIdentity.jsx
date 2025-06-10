import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function UserIdentity({ userData }) { // Terima data user sebagai prop
  const [currentData, setCurrentData] = useState({
    name: userData.name,
    phone: userData.phone,
  });
  const [originalData] = useState({
    name: userData.name,
    phone: userData.phone,
  });
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSaveName = async () => {
    const user = auth.currentUser;
    if (!user) {
      await Swal.fire({
        title: 'Error!',
        text: 'Anda harus login untuk menyimpan perubahan',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      navigate('/login');
      return;
    }

    try {
      await updateProfile(user, {
        displayName: currentData.name
      });

      await updateDoc(doc(db, "users", user.uid), {
        name: currentData.name
      });
      
      await Swal.fire({
        title: 'Berhasil!',
        text: 'Nama berhasil diperbarui!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error updating name:", error);
      await Swal.fire({
        title: 'Error!',
        text: 'Gagal memperbarui nama: ' + error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleSavePhone = async () => {
    const user = auth.currentUser;
    if (!user) {
      await Swal.fire({
        title: 'Error!',
        text: 'Anda harus login untuk menyimpan perubahan',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      navigate('/login');
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        phone: currentData.phone
      });
      
      await Swal.fire({
        title: 'Berhasil!',
        text: 'Nomor HP berhasil diperbarui!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error updating phone:", error);
      await Swal.fire({
        title: 'Error!',
        text: 'Gagal memperbarui nomor HP: ' + error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const isNameChanged = currentData.name !== originalData.name;
  const isPhoneChanged = currentData.phone !== originalData.phone;

  return (
    <div className="p-6 mb-8 flex flex-col justify-center items-center border-b border-gray-300">
      {/* Tampilan tetap sama, hanya ganti `userData` dengan `currentData` */}
      <div className="flex items-center mb-10">
        <img
          src={"https://gevannoyoh.com/thumb-malika/customer.webp"}
          alt="Foto Profil"
          className="w-[140px] h-[140px] rounded-full object-cover mr-4"
        />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2">
        Identitas Saya
      </h2>

      <div className="w-2/3 mb-4">
        <label className="block text-gray-800 font-medium ml-4 mb-1">Email:</label>
        <div className="flex">
          <input
            type="email"
            value={userData.email}
            readOnly
            className="flex-1 border border-gray-400 rounded-xl px-4 py-2 bg-gray-100 cursor-not-allowed focus:outline-0 focus:border-red-500 transition-all duration-150 ease-in"
          />
        </div>
      </div>

      <div className="w-2/3 mb-4">
        <label className="block text-gray-800 font-medium ml-4 mb-1">Nomor HP:</label>
        <div className="flex gap-4">
          <input
            type="tel"
            value={currentData.phone}
            onChange={(e) => setCurrentData({...currentData, phone: e.target.value})}
            className="flex-1 border border-gray-400 rounded-xl px-4 py-2 focus:outline-0 focus:border-gray-600 transition-all duration-150 ease-in"
          />
          <button 
            onClick={handleSavePhone}
            disabled={!isPhoneChanged}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ease-in ${
              isPhoneChanged 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Simpan
          </button>
        </div>
      </div>

      <div className="w-2/3 mb-4">
        <label className="block text-gray-800 font-medium ml-4 mb-1">Nama:</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={currentData.name}
            onChange={(e) => setCurrentData({...currentData, name: e.target.value})}
            className="flex-1 border border-gray-400 rounded-xl px-4 py-2 focus:outline-0 focus:border-gray-600 transition-all duration-150 ease-in"
          />
          <button 
            onClick={handleSaveName}
            disabled={!isNameChanged}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ease-in ${
              isNameChanged 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserIdentity;