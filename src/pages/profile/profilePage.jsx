import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import ProfileHeader from "./components/ProfileHeader";
import UserIdentity from "./components/UserIdentity";
import AddAddress from "./components/AddAddress";
import AddressList from "./components/AddressList";
import Swal from "sweetalert2";

function ProfilePage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          setAddresses(docSnap.data().address || []);
        }
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const updateAddressesInFirestore = async (updatedAddresses) => {
    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          address: updatedAddresses
        });
      } catch (error) {
        await Swal.fire({
          title: 'Error!',
          text: 'Gagal menyimpan alamat: ' + error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        throw error;
      }
    }
  };

  const handleAddAddress = async (newAddress) => {
  try {
    const updatedAddresses = [...addresses, { id: Date.now(), address: newAddress }];
    setAddresses(updatedAddresses);
    await updateAddressesInFirestore(updatedAddresses);
    await Swal.fire({
      title: 'Berhasil!',
      text: 'Alamat baru berhasil ditambahkan!',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  } catch (error) {
    // Error sudah dihandle di updateAddressesInFirestore
  }
};

  const handleEditAddress = async (id, updatedAddress) => {
    const updatedAddresses = addresses.map(addr => 
      addr.id === id ? { ...addr, address: updatedAddress } : addr
    );
    setAddresses(updatedAddresses);
    await updateAddressesInFirestore(updatedAddresses);
  };

  const handleDeleteAddress = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak dapat mengembalikan alamat yang sudah dihapus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const updatedAddresses = addresses.filter(addr => addr.id !== id);
        setAddresses(updatedAddresses);
        await updateAddressesInFirestore(updatedAddresses);
        await Swal.fire(
          'Terhapus!',
          'Alamat telah berhasil dihapus.',
          'success'
        );
      } catch (error) {
        // Error sudah dihandle di updateAddressesInFirestore
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen pb-20">
      <ProfileHeader />
      <div className="max-w-3xl mx-auto pt-20 pb-4 py-6">
        <UserIdentity />
        <AddAddress onAddAddress={handleAddAddress} />
        <AddressList 
          addresses={addresses} 
          onEditAddress={handleEditAddress}
          onDeleteAddress={handleDeleteAddress}
        />
      </div>
    </div>
  );
}

export default ProfilePage;