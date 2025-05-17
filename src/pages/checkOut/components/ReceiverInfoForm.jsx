import { auth } from "../../../firebase";

export default function ReceiverInfoForm({ receiverInfo, setReceiverInfo }) {
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceiverInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Use account info handlers
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
    <div className="mb-8 pb-8 border-b border-slate-950/30">
      <h2 className="text-black text-3xl font-semibold font-poppins mb-6">
        Informasi Penerima
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-black text-lg font-medium font-poppins mb-2">
            Nama Penerima:
          </label>
          <div className="flex">
            <input
              type="text"
              name="name"
              value={receiverInfo.name}
              onChange={handleChange}
              className="w-64 h-11 rounded-[10px] border border-slate-950 px-4 py-2 font-poppins"
              placeholder="Masukkan nama penerima"
            />
            <button
              onClick={useAccountName}
              className="ml-4 bg-zinc-300 px-2 py-1 rounded-[10px] text-center font-semibold text-sm"
            >
              Gunakan
              <br />
              Nama Akun
            </button>
          </div>
        </div>

        <div>
          <label className="block text-black text-lg font-medium font-poppins mb-2">
            No HP Penerima:
          </label>
          <div className="flex">
            <input
              type="text"
              name="phone"
              value={receiverInfo.phone}
              onChange={handleChange}
              className="w-64 h-11 rounded-[10px] border border-slate-950 px-4 py-2 font-poppins"
              placeholder="Masukkan nomor telepon"
            />
            <button
              onClick={useAccountPhone}
              className="ml-4 bg-zinc-300 px-2 py-1 rounded-[10px] text-center font-semibold text-sm"
            >
              Gunakan
              <br />
              No HP Akun
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center mb-2">
          <label className="text-stone-950 text-lg font-medium font-poppins mr-4">
            Alamat Penerima:
          </label>
          <button className="bg-zinc-300 px-4 py-1 rounded-[10px] text-center font-semibold text-sm">
            Pilih Alamat
          </button>
        </div>
        <textarea
          name="address"
          value={receiverInfo.address}
          onChange={handleChange}
          className="w-full h-28 rounded-[10px] border border-slate-950 p-4 font-poppins"
          placeholder="Masukkan alamat lengkap penerima"
        ></textarea>
      </div>
    </div>
  );
}
