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
    <div className="mb-5 pb-5 border-b border-gray-200 px-6 py-6">
      <div className="flex items-center mb-4">
        <h2 className="text-gray-800 text-2xl font-poppins font-semibold">
          Informasi Penerima
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Name field */}
        <div>
          <label
            className="block text-gray-800 text-sm font-medium font-poppins pl-4 mb-1"
            htmlFor="name"
          >
            <span className="text-red-500">*</span>Nama Penerima:
          </label>
          <div className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                id="name"
                name="name"
                value={receiverInfo.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full h-10 rounded-lg px-3 py-2 text-sm font-poppins border border-gray-300 focus:outline-none focus:border-gray-400 transition-all duration-150 ease-in
                  ${
                    isFieldEmpty("name")
                      ? "border-red-500 focus:border-orange-400"
                      : "border-gray-300"
                  }`}
                placeholder="Masukkan nama penerima"
                aria-required="true"
              />
            </div>
            <button
              type="button"
              onClick={useAccountName}
              className="ml-2 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg text-center text-sm font-poppins font-semibold cursor-pointer focus:outline-none transition-all duration-150 ease-in"
            >
              Nama Akun
            </button>
          </div>
          {isFieldEmpty("name") && (
            <p className="font-poppins text-red-500 text-xs mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path stroke-dasharray="64" stroke-dashoffset="64" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
                  </path>
                  <path stroke-dasharray="8" stroke-dashoffset="8" d="M12 7v6">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0" />
                    <animate attributeName="stroke-width" begin="1.8s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2" />
                  </path>
                  <path stroke-dasharray="2" stroke-dashoffset="2" d="M12 17v0.01">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="2;0" />
                    <animate attributeName="stroke-width" begin="2.1s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2" />
                  </path>
                </g>
              </svg>
              Nama penerima harus diisi
            </p>
          )}
        </div>

        {/* Phone field */}
        <div>
          <label
            className="block text-gray-800 text-sm font-medium font-poppins mb-1"
            htmlFor="phone"
          >
            <span className="text-red-500">*</span>No HP Penerima:
          </label>
          <div className="flex">
            <div className="relative flex-grow">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={receiverInfo.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full h-10 rounded-lg px-3 py-2 text-sm font-poppins border border-gray-300 focus:outline-none focus:border-gray-400 transition-all duration-150 ease-in
                  ${
                    isFieldEmpty("phone") || !isPhoneValid()
                      ? "border-red-500 focus:border-orange-400"
                      : "border-gray-300"
                  }`}
                placeholder="contoh: 0812345xxxx"
                aria-required="true"
              />
            </div>
            <button
              type="button"
              onClick={useAccountPhone}
              className="ml-2 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg text-center text-sm font-poppins font-semibold cursor-pointer focus:outline-none transition-all duration-150 ease-in"
            >
              No. HP Akun
            </button>
          </div>
          {isFieldEmpty("phone") && (
            <p className="font-poppins text-red-500 text-xs mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path stroke-dasharray="64" stroke-dashoffset="64" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
                  </path>
                  <path stroke-dasharray="8" stroke-dashoffset="8" d="M12 7v6">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0" />
                    <animate attributeName="stroke-width" begin="1.8s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2" />
                  </path>
                  <path stroke-dasharray="2" stroke-dashoffset="2" d="M12 17v0.01">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="2;0" />
                    <animate attributeName="stroke-width" begin="2.1s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2" />
                  </path>
                </g>
              </svg>
              Nomor telepon harus diisi
            </p>
          )}
          {!isFieldEmpty("phone") && !isPhoneValid() && (
            <p className="font-poppins text-red-500 text-xs mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path stroke-dasharray="64" stroke-dashoffset="64" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
                  </path>
                  <path stroke-dasharray="8" stroke-dashoffset="8" d="M12 7v6">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0" />
                    <animate attributeName="stroke-width" begin="1.8s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2" />
                  </path>
                  <path stroke-dasharray="2" stroke-dashoffset="2" d="M12 17v0.01">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="2;0" />
                    <animate attributeName="stroke-width" begin="2.1s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2" />
                  </path>
                </g>
              </svg>
              Format No HP tidak valid
            </p>
          )}
        </div>
      </div>

      {/* Address field */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-1">
          <label
            className="text-gray-800 text-sm font-medium font-poppins"
            htmlFor="address"
          >
            <span className="text-red-500">*</span>Alamat Penerima:
          </label>
          <button
            type="button"
            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-center text-sm font-poppins font-semibold cursor-pointer focus:outline-none transition-all duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-2"
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
        <div className="relative flex-grow mt-2">
          <textarea
            id="address"
            name="address"
            value={receiverInfo.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full min-h-[6rem] rounded-lg px-3 py-2 text-sm font-poppins resize-y border border-gray-300 focus:outline-none focus:border-gray-400 transition-all duration-150 ease-in
              ${
                isFieldEmpty("address")
                  ? "border-red-500 focus:border-orange-400"
                  : "border-gray-300"
              }`}
            placeholder="Masukkan alamat lengkap penerima (jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota/kabupaten, kode pos)"
            aria-required="true"
          ></textarea>
          {isFieldEmpty("address") && (
            <p className="font-poppins text-red-500 text-xs mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path stroke-dasharray="64" stroke-dashoffset="64" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
                  </path>
                  <path stroke-dasharray="8" stroke-dashoffset="8" d="M12 7v6">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0" />
                    <animate attributeName="stroke-width" begin="1.8s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2" />
                  </path>
                  <path stroke-dasharray="2" stroke-dashoffset="2" d="M12 17v0.01">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="2;0" />
                    <animate attributeName="stroke-width" begin="2.1s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2" />
                  </path>
                </g>
              </svg>
              Alamat penerima harus diisi
            </p>
          )}
        </div>
        <p className="font-poppins text-xs text-gray-600 mt-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path stroke-dasharray="64" stroke-dashoffset="64" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
              </path>
              <path stroke-dasharray="8" stroke-dashoffset="8" d="M12 7v6">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0" />
                <animate attributeName="stroke-width" begin="1.8s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2" />
              </path>
              <path stroke-dasharray="2" stroke-dashoffset="2" d="M12 17v0.01">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="2;0" />
                <animate attributeName="stroke-width" begin="2.1s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2" />
              </path>
            </g>
          </svg>
          Pastikan alamat pengiriman sudah lengkap dan akurat untuk memastikan
          kurir tidak kesasar
        </p>
      </div>
    </div>
  );
}
