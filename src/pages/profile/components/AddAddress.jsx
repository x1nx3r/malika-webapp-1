import { useState } from "react";
import Swal from "sweetalert2";

function AddAddress({ onAddAddress }) {
  const [address, setAddress] = useState("");

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  };

  const handleAddAddress = async () => {
    if (!address.trim()) {
      await Swal.fire({
        title: 'Error!',
        text: 'Alamat harus diisi!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      await onAddAddress(address);
      setAddress("");
    } catch (error) {
      // Error sudah dihandle di parent component
    }
  };

  return (
    <div className="p-6 mb-10 border-b border-gray-300 flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 pb-2">
        Tambah Alamat
      </h2>
      <p className="text-sm italic text-center text-gray-800 mb-10">
        Alamat ini dapat digunakan untuk Checkout dan akan muncul di halaman <br /> Checkout jika menekan tombol "Pilih Alamat"
      </p>

      <div className="w-2/3 mb-4">
        <textarea
          value={address}
          onChange={handleInputChange}
          placeholder="Masukkan alamat lengkap, sertakan Keluarahan, Kecamatan dan Nama Kota"
          className="w-full h-[110px] border border-gray-400 text-gray-800 rounded-xl px-3 py-2 focus:outline-0 focus:border-gray-600 transition-all duration-150 ease-in"
        />
      </div>

      <button
        onClick={handleAddAddress}
        className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-all duration-200 ease-in"
      >
        Tambah Alamat
      </button>
    </div>
  );
}

export default AddAddress;