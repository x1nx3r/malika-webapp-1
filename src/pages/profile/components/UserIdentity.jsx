import { useState } from "react";

function UserIdentity() {
  // Data dummy untuk profil pengguna
  const [userData, setUserData] = useState({
    name: "Muhammad Soemboel",
    email: "soemboel@example.com",
    phone: "08889990000",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    console.log("Data disimpan:", userData);
    alert("Profil berhasil diperbarui!");
  };

  return (
    <div className="p-6 mb-8 flex flex-col justify-center items-center border-b border-gray-300">
        <div className="flex items-center mb-10">
            <img
            src="https://gevannoyoh.com/thumb-malika/customer.webp"
            alt="Foto Profil"
            className="w-[140px] h-[140px] rounded-full object-cover mr-4"
            />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2">
            Identitas Saya
        </h2>

        <div className="w-2/3 mb-4">
            <label className="block text-gray-800 font-medium ml-4 mb-1">Nama:</label>
            <div className="flex gap-3">
                <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="flex-1 border border-gray-400 rounded-xl px-4 py-2 focus:outline-0 focus:border-gray-600 transition-all duration-150 ease-in"
                />
                <button className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-all duration-200 ease-in">
                    Simpan
                </button>
            </div>
        </div>

        <div className="w-2/3 mb-4">
            <label className="block text-gray-800 font-medium ml-4 mb-1">Email:</label>
            <div className="flex gap-3">
                <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="flex-1 border border-gray-400 rounded-xl px-4 py-2 focus:outline-0 focus:border-gray-600 transition-all duration-150 ease-in"
                />
                <button className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-all duration-200 ease-in">
                    Simpan
                </button>
            </div>
        </div>

        <div className="w-2/3 mb-4">
            <label className="block text-gray-800 font-medium ml-4 mb-1">Nomor HP:</label>
            <div className="flex gap-4">
                <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    className="flex-1 border border-gray-400 rounded-xl px-4 py-2 focus:outline-0 focus:border-gray-600 transition-all duration-150 ease-in"
                />
                <button className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-all duration-200 ease-in">
                    Simpan
                </button>
            </div>
        </div>
    </div>
  );
}

export default UserIdentity;