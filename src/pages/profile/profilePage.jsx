import { useState } from "react";
import ProfileNavbar from "./components/ProfileNavbar";
import UserIdentity from "./components/UserIdentity";
import AddAddress from "./components/AddAddress";
import AddressList from "./components/AddressList";

function ProfilePage() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "Alamat Rumah",
      address: "Jl. Pakis Gunung IIIA nomor 24, Kelurahan Pakis, Kecamatan Sawahan, Surabaya"
    },
    {
      id: 2,
      label: "Alamat Kantor",
      address: "Jl. Rungkut Madya nomor 1, Kelurahan Gunung Anyar, Kecamatan Gunung Anyar, Surabaya"
    }
  ]);

  const handleAddAddress = (newAddress) => {
    setAddresses([...addresses, newAddress]);
  };

  return (
    <div className="min-h-screen pb-20">
      <ProfileNavbar />
      <div className="max-w-3xl mx-auto pt-20 pb-4 py-6">
        <UserIdentity />
        <AddAddress onAddAddress={handleAddAddress} />
        <AddressList addresses={addresses} setAddresses={setAddresses} />
      </div>
    </div>
  );
}

export default ProfilePage;