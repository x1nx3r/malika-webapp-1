import { auth } from "../../../firebase";

export default function ReceiverInfoForm({ receiverInfo, setReceiverInfo }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceiverInfo((prev) => ({ ...prev, [name]: value }));
  };

  const useAccountName = async () => {
    try {
      const user = auth.currentUser;
      if (user && user.displayName) {
        setReceiverInfo((prev) => ({ ...prev, name: user.displayName }));
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
      }
    } catch (error) {
      console.error("Error getting user phone:", error);
    }
  };

  return (
    <div className="mb-4 pb-3 border-b border-slate-300">
      <h2 className="text-black text-xl font-semibold font-poppins mb-3">
        Informasi Penerima
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-black text-sm font-medium font-poppins mb-1">
            Nama Penerima:
          </label>
          <div className="flex">
            <input
              type="text"
              name="name"
              value={receiverInfo.name}
              onChange={handleChange}
              className="flex-grow h-8 rounded border border-slate-500 px-2 py-1 text-sm font-poppins"
              placeholder="Masukkan nama penerima"
            />
            <button
              onClick={useAccountName}
              className="ml-2 bg-zinc-200 px-2 py-0 rounded text-center text-xs"
            >
              Nama Akun
            </button>
          </div>
        </div>

        <div>
          <label className="block text-black text-sm font-medium font-poppins mb-1">
            No HP Penerima:
          </label>
          <div className="flex">
            <input
              type="text"
              name="phone"
              value={receiverInfo.phone}
              onChange={handleChange}
              className="flex-grow h-8 rounded border border-slate-500 px-2 py-1 text-sm font-poppins"
              placeholder="Masukkan nomor telepon"
            />
            <button
              onClick={useAccountPhone}
              className="ml-2 bg-zinc-200 px-2 py-0 rounded text-center text-xs"
            >
              HP Akun
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center mb-1">
          <label className="text-stone-950 text-sm font-medium font-poppins mr-2">
            Alamat Penerima:
          </label>
          <button className="bg-zinc-200 px-2 py-0 rounded text-center text-xs">
            Pilih Alamat
          </button>
        </div>
        <textarea
          name="address"
          value={receiverInfo.address}
          onChange={handleChange}
          className="w-full h-16 rounded border border-slate-500 p-2 text-sm font-poppins"
          placeholder="Masukkan alamat lengkap penerima"
        ></textarea>
      </div>
    </div>
  );
}
