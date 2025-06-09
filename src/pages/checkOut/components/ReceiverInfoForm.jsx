import { useState } from "react";
import { auth } from "../../../firebase";

export default function ReceiverInfoForm({ receiverInfo, setReceiverInfo }) {
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    address: false,
  });

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceiverInfo((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Handle field blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Get current user info
  const useAccountName = async () => {
    try {
      const user = auth.currentUser;
      if (user && user.displayName) {
        setReceiverInfo((prev) => ({ ...prev, name: user.displayName }));
        setTouched((prev) => ({ ...prev, name: true }));
      }
    } catch (error) {
      console.error("Error getting user name:", error);
    }
  };

  const useAccountPhone = async () => {
    try {
      const user = auth.currentUser;
      if (user && user.phoneNumber) {
        setReceiverInfo((prev) => ({ ...prev, phone: user.phoneNumber }));
        setTouched((prev) => ({ ...prev, phone: true }));
      }
    } catch (error) {
      console.error("Error getting user phone:", error);
    }
  };

  // Check if fields are valid
  const isFieldEmpty = (field) => touched[field] && !receiverInfo[field];

  // Phone number validation
  const isPhoneValid = () => {
    if (!touched.phone || !receiverInfo.phone) return true;
    const phoneRegex = /^(\+62|62|0)[0-9]{8,15}$/;
    return phoneRegex.test(receiverInfo.phone);
  };

  return (
    <div className="mb-5 pb-5 border-b border-gray-200 bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-amber-500 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <h2 className="text-gray-800 text-xl font-semibold font-poppins">
          Informasi Penerima
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name field */}
        <div>
          <label
            className="block text-gray-700 text-sm font-medium font-poppins mb-1"
            htmlFor="name"
          >
            Nama Penerima <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 pb-2 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={receiverInfo.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full h-10 rounded-lg pl-10 pr-3 py-2 text-sm font-poppins transition-colors
                  ${
                    isFieldEmpty("name")
                      ? "border-red-500 bg-red-50 focus:ring-red-500"
                      : "border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                  }`}
                placeholder="Masukkan nama penerima"
                aria-required="true"
              />
            </div>
            <button
              type="button"
              onClick={useAccountName}
              className="ml-2 bg-gray-100 border border-gray-300 hover:bg-gray-200 px-3 py-2 rounded-lg text-center text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Gunakan Akun
            </button>
          </div>
          {isFieldEmpty("name") && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Nama penerima harus diisi
            </p>
          )}
        </div>

        {/* Phone field */}
        <div>
          <label
            className="block text-gray-700 text-sm font-medium font-poppins mb-1"
            htmlFor="phone"
          >
            No HP Penerima <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 pb-2 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={receiverInfo.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full h-10 rounded-lg pl-10 pr-3 py-2 text-sm font-poppins transition-colors
                  ${
                    isFieldEmpty("phone") || !isPhoneValid()
                      ? "border-red-500 bg-red-50 focus:ring-red-500"
                      : "border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                  }`}
                placeholder="contoh: 0812345xxxx"
                aria-required="true"
              />
            </div>
            <button
              type="button"
              onClick={useAccountPhone}
              className="ml-2 bg-gray-100 border border-gray-300 hover:bg-gray-200 px-3 py-2 rounded-lg text-center text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              No. HP Akun
            </button>
          </div>
          {isFieldEmpty("phone") && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Nomor telepon harus diisi
            </p>
          )}
          {!isFieldEmpty("phone") && !isPhoneValid() && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Format nomor telepon tidak valid
            </p>
          )}
        </div>
      </div>

      {/* Address field */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <label
            className="text-gray-700 text-sm font-medium font-poppins"
            htmlFor="address"
          >
            Alamat Penerima <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            className="bg-gray-100 border border-gray-300 hover:bg-gray-200 px-3 py-1 rounded-lg text-center text-xs font-medium transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Pilih Alamat Tersimpan
          </button>
        </div>
        <div className="relative">
          <div className="absolute top-3 left-3 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <textarea
            id="address"
            name="address"
            value={receiverInfo.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full min-h-[5rem] rounded-lg pl-10 pr-3 py-2 text-sm font-poppins resize-y transition-colors
              ${
                isFieldEmpty("address")
                  ? "border-red-500 bg-red-50 focus:ring-red-500"
                  : "border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              }`}
            placeholder="Masukkan alamat lengkap penerima (jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota/kabupaten, kode pos)"
            aria-required="true"
          ></textarea>
          {isFieldEmpty("address") && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Alamat penerima harus diisi
            </p>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1.5 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
            <line x1="12" y1="8" x2="12" y2="12"></line>
          </svg>
          Pastikan alamat pengiriman sudah lengkap dan akurat untuk memastikan
          pesanan sampai tepat waktu
        </p>
      </div>
    </div>
  );
}
