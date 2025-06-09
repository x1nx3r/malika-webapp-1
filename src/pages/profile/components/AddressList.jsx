import { useState } from 'react';

function AddressList({ addresses }) {

  return (
    <div className="p-6 flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 pb-2">
        Daftar Alamat Saya
      </h2>
      <p className="text-sm text-center text-gray-800 italic mb-10">
        Alamat-alamat ini dapat digunakan untuk Checkout dan akan muncul <br /> di halaman Checkout jika menekan tombol "Pilih Alamat"
      </p>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div className="flex items-center gap-2">
            <div className="w-[400px] h-[110px] border border-gray-400 text-gray-800 rounded-xl px-3 py-2 cursor-default">
              {address.address}
            </div>

            <div className="flex flex-col gap-2">
              <button className="flex justify-center items-center text-white w-[50px] h-[50px] rounded-xl bg-green-600 hover:bg-green-700 transition-all duration-200 ease-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8.707 19.707L18 10.414L13.586 6l-9.293 9.293a1 1 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263M21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586L19.414 9z" />
                </svg>
              </button>
              <button className="flex justify-center items-center text-white w-[50px] h-[50px] rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-200 ease-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" fill-rule="evenodd" d="M8.106 2.553A1 1 0 0 1 9 2h6a1 1 0 0 1 .894.553L17.618 6H20a1 1 0 1 1 0 2h-1v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8H4a1 1 0 0 1 0-2h2.382zM14.382 4l1 2H8.618l1-2zM11 11a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0zm4 0a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddressList;