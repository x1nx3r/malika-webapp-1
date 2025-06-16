import { useState } from 'react';
import PropTypes from "prop-types";
import Swal from 'sweetalert2';

export default function OrderSummary({ order, onStatusChange }) {
  const [tempShippingCost, setTempShippingCost] = useState(''); // Untuk input sementara
  const [isUpdatingShipping, setIsUpdatingShipping] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  if (!order) return null;

  // Calculate total price
  const calculateTotal = () => {
    return order.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  // Function to calculate remainingPayment
  const calculateRemainingPayment = () => {
    // Jika sudah ada nilai remainingPaymentAmount, gunakan itu
    if (order.paymentInfo?.remainingPaymentAmount) {
      return order.paymentInfo.remainingPaymentAmount;
    }
    
    // Hitung dari subtotal dikurangi DP ditambah ongkir (jika ada)
    const subtotal = order.paymentInfo?.subtotal || 0;
    const downPayment = order.paymentInfo?.downPaymentAmount || 
      (order.paymentInfo?.downPaymentPercent 
        ? Math.floor(subtotal * (order.paymentInfo.downPaymentPercent / 100)) 
        : 0);
    const shippingCost = order.paymentInfo?.shipingCost || 0;
    
    return (subtotal - downPayment) + shippingCost;
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return `Rp${Number(value).toLocaleString('id-ID')}`;
  };

  const parseCurrency = (value) => {
    return value.replace(/[^0-9]/g, '');
  };

  // Fungsi untuk mengecek status order apakah pernah paid?
  const hasBeenPaid = () => {
    return order.statusHistory?.some(entry => entry.to === 'paid') || order.status === 'paid';
  };

  // Fungsi untuk mengecek apakah pesanan sudah dikirim (status delivery atau arrived)
  const hasBeenDelivered = () => {
    return order.statusHistory?.some(entry => entry.to === 'delivery' || entry.to === 'arrived') || 
          ['delivery', 'arrived'].includes(order.status);
  };

  const toggleNoteModal = () => {
    setIsNoteModalOpen(!isNoteModalOpen);
  };

  // Fungsi untuk menyimpan ongkos kirim
  const saveShippingCost = async () => {
    const numericValue = parseCurrency(tempShippingCost);
    if (!numericValue || isNaN(numericValue)) {
      Swal.fire('Error!', 'Masukkan nominal ongkos kirim yang valid', 'error');
      return;
    }

    try {
      setIsUpdatingShipping(true);
      await onStatusChange(order.id, 'update_shipping', { 
        shipingCost: Number(numericValue) 
      });
      Swal.fire('Berhasil!', 'Ongkos kirim berhasil diperbarui', 'success');
      setTempShippingCost(''); // Kosongkan input setelah berhasil disimpan
    } catch (error) {
      console.error('Error updating shipping cost:', error);
      Swal.fire('Gagal!', `Gagal memperbarui ongkos kirim: ${error.message}`, 'error');
    } finally {
      setIsUpdatingShipping(false);
    }
  };

  // Function to open DP proof
  const openDPProof = () => {
    if (order.paymentInfo?.proofDownPayment) {
      window.open(order.paymentInfo.proofDownPayment, '_blank');
    } else {
      Swal.fire({
        title: 'Bukti DP Tidak Tersedia',
        text: 'Belum ada bukti DP yang diunggah untuk pesanan ini.',
        icon: 'info',
        confirmButtonText: 'Mengerti'
      });
    }
  };

  // Function to open remaining payment proof
  const openRemainingProof = () => {
    if (order.paymentInfo?.proofRemainingPayment) {
      window.open(order.paymentInfo.proofRemainingPayment, '_blank');
    } else {
      Swal.fire({
        title: 'Bukti Pelunasan Tidak Tersedia',
        text: 'Belum ada bukti pelunasan yang diunggah untuk pesanan ini.',
        icon: 'info',
        confirmButtonText: 'Mengerti'
      });
    }
  };

  // Function to confirm DP payment
  const confirmDownPayment = async () => {
    const result = await Swal.fire({
      title: 'Konfirmasi Pembayaran DP',
      text: 'Apakah Anda yakin ingin mengkonfirmasi pembayaran DP ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Konfirmasi',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await onStatusChange(order.id, 'dp_verified');
      } catch (error) {
        console.error('Error confirming DP:', error);
        Swal.fire(
          'Gagal!',
          `Terjadi kesalahan: ${error.message}`,
          'error'
        );
      }
    }
  };

  // Function to confirm Delivery
  const confirmDelivery = async () => {
    const result = await Swal.fire({
      title: 'Konfirmasi Pengiriman Pesanan',
      text: 'Apakah Anda yakin pesanan ini sudah dikirim?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Konfirmasi',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await onStatusChange(order.id, 'delivery');
      } catch (error) {
        console.error('Error confirming delivery:', error);
        Swal.fire(
          'Gagal!',
          `Terjadi kesalahan: ${error.message}`,
          'error'
        );
      }
    }
  };

  // Function to confirm arrived
  const confirmArrival = async () => {
    const result = await Swal.fire({
      title: 'Konfirmasi Pesanan Sampai',
      text: 'Apakah Anda yakin pesanan ini sudah sampai ke pelanggan?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Konfirmasi',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await onStatusChange(order.id, 'arrived');
      } catch (error) {
        console.error('Error confirming arrival:', error);
        Swal.fire(
          'Gagal!',
          `Terjadi kesalahan: ${error.message}`,
          'error'
        );
      }
    }
  };

  // Function to confirm remaining payment
  const confirmFullPayment = async () => {
    const result = await Swal.fire({
      title: 'Konfirmasi Pelunasan',
      text: 'Apakah Anda yakin ingin mengkonfirmasi pelunasan pesanan ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Konfirmasi',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await onStatusChange(order.id, 'paid', {
          statusRemainingPayment: 'verified'
        });
      } catch (error) {
        console.error('Error confirming full payment:', error);
        Swal.fire(
          'Gagal!',
          `Terjadi kesalahan: ${error.message}`,
          'error'
        );
      }
    }
  };

  // Function to confirm order completed
  const confirmCompletion = async () => {
    // Cek apakah status pernah mencapai 'paid'
    if (!hasBeenPaid()) {
      await Swal.fire({
        title: 'Tidak Dapat Menyelesaikan',
        text: 'Pesanan belum lunas. Harap konfirmasi pembayaran terlebih dahulu sebelum menyelesaikan pesanan.',
        icon: 'error',
        confirmButtonText: 'Mengerti'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Konfirmasi Penyelesaian Pesanan',
      text: 'Apakah Anda yakin ingin menyelesaikan pesanan ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Selesaikan',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await onStatusChange(order.id, 'completed');
      } catch (error) {
        console.error('Error completing order:', error);
        Swal.fire(
          'Gagal!',
          `Terjadi kesalahan: ${error.message}`,
          'error'
        );
      }
    }
  };

  // Function to cancel order
  const cancelOrder = async () => {
    const result = await Swal.fire({
      title: 'Batalkan Pesanan?',
      text: 'Apakah Anda yakin ingin membatalkan pesanan ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Batalkan',
      cancelButtonText: 'Tidak'
    });

    if (result.isConfirmed) {
      try {
        await onStatusChange(order.id, 'cancelled');
        // Notifikasi sukses sudah ditangani di handleStatusChange
      } catch (error) {
        console.error('Error cancelling order:', error);
        Swal.fire(
          'Gagal!',
          `Terjadi kesalahan: ${error.message}`,
          'error'
        );
      }
    }
  };

  return (
    <div className="w-96 bg-white rounded-3xl border border-gray-200 shadow-md h-fit">
      {/* Customer Header */}
      <div className="bg-green-600 text-white py-4 px-6 rounded-t-3xl relative">
        <div className="flex items-center">
          <svg className="h-8 w-8 mr-4 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          <h3 className="font-semibold text-xl">{order.customer}</h3>
        </div>
        <button 
          onClick={toggleNoteModal}
          className="absolute top-3 right-4 p-1 mt-1.5 hover:text-gray-200 transition-all duration-200 ease-in"
          title="Lihat Catatan Pesanan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h9v-5a3 3 0 0 1 3-3h5V5a3 3 0 0 0-3-3zm12.293 19.121a3 3 0 0 1-1.293.762V17a1 1 0 0 1 1-1h4.883a3 3 0 0 1-.762 1.293zM7 6a1 1 0 0 0 0 2h10a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Order Items List */}
      <div className="divide-y divide-gray-200" style={{ maxHeight: '166px', overflowY: 'auto' }}>
        {order.items.map((item, index) => (
          <div key={index} className="px-6 py-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="bg-orange-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">
                  {item.quantity}x
                </span>
                <div>
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="font-semibold text-sm">{item.kemasan}</p>
                  <p className="font-medium text-green-700 whitespace-nowrap">{`Rp${item.price.toLocaleString('id-ID')}`}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="py-3 px-6 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between mb-2">
          <p className="font-medium">Sub Total:</p>
          <p className="font-bold">{`Rp${calculateTotal().toLocaleString('id-ID')}`}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Ongkos Kirim:</p>
          <p className="font-bold text-red-500">
            {order.paymentInfo?.shipingCost 
              ? `Rp${order.paymentInfo.shipingCost.toLocaleString('id-ID')}` 
              : 'Belum diatur'}
          </p>
        </div>
      </div>

      {/* Shipping Cost Input */}
      <div className="p-4 bg-gray-100 border-t border-b border-gray-200">
        <div className="flex items-center bg-white rounded-xl border border-gray-300 pr-2 pl-3 py-2">
          <img src="https://gevannoyoh.com/thumb-malika/delivery.webp" alt="delivery" className="h-5 w-5 mr-2 drop-shadow" />
          <input
            type="text"
            value={formatCurrency(tempShippingCost)}
            onChange={(e) => {
              const rawValue = parseCurrency(e.target.value);
              setTempShippingCost(rawValue);
            }}
            placeholder="Masukkan Nominal Ongkir..."
            className="w-full outline-none text-sm"
          />
          <button
            onClick={saveShippingCost}
            disabled={isUpdatingShipping || !tempShippingCost}
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isUpdatingShipping ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <button
              onClick={confirmDownPayment}
              disabled={order.status !== 'pending'}
              className={`w-full ${
                order.status === 'pending' 
                  ? 'bg-orange-400 hover:bg-orange-500' 
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white py-3 px-4 rounded-xl transition duration-200`}
            >
              <div className="text-center">
                <div className="font-bold">Sudah DP</div>
                <div className="text-sm">
                  {order.paymentInfo?.downPaymentAmount 
                    ? `Rp${order.paymentInfo.downPaymentAmount.toLocaleString('id-ID')}` 
                    : order.paymentInfo?.downPaymentPercent 
                      ? `Rp${Math.floor((order.paymentInfo.subtotal || 0) * (order.paymentInfo.downPaymentPercent / 100)).toLocaleString('id-ID')}` 
                      : 'Belum diatur'}
                </div>
                <div className="text-sm">
                  {order.paymentInfo?.statusDownPayment === 'verified' 
                  ? '(Terverifikasi)' 
                  : '(Butuh Konfirmasi)'}
                </div>
              </div>
            </button>
            <button
              onClick={openDPProof}
              className="w-full bg-orange-100 hover:bg-orange-200 text-orange-600 py-2 px-4 rounded-lg transition duration-200 text-sm mt-1"
            >
              Lihat Bukti DP
            </button>
          </div>
          <div>
            <button
              onClick={confirmFullPayment}
              disabled={order.status === 'pending' || order.status === 'completed' || order.status === 'paid' || hasBeenPaid()}
              className={`w-full ${
                (order.status !== 'pending' && order.status !== 'completed' && order.status !== 'paid' && !hasBeenPaid())
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white py-3 px-4 rounded-xl transition duration-200`}
            >
              <div className="text-center">
                <div className="font-bold">Lunas</div>
                <div className="text-sm">
                  {`Rp${calculateRemainingPayment().toLocaleString('id-ID')}`}
                </div>
                <div className="text-sm">
                  {order.paymentInfo?.statusRemainingPayment === 'verified' || hasBeenPaid()
                    ? ' (Terverifikasi)' 
                    : ' (Butuh Konfirmasi)'}
                </div>
              </div>
            </button>
            <button
              onClick={openRemainingProof}
              disabled={order.status === 'pending'}
              className={`w-full ${
                order.status !== 'pending'
                  ? 'bg-gray-100 hover:bg-gray-200'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-gray-600 py-2 px-4 rounded-lg transition duration-200 text-sm mt-1`}
            >
              Lihat Bukti Pelunasan
            </button>
          </div>
        </div>

        {order.status === 'completed' ? (
          <div className="w-full bg-green-400 text-white py-3 px-4 rounded-md text-center cursor-not-allowed">
            Pesanan Selesai
          </div>
        ) : order.status === 'arrived' && hasBeenPaid() ? (
          <button
            onClick={confirmCompletion}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl transition duration-200"
          >
            Konfirmasi Pesanan Selesai
          </button>
        ) : order.status === 'delivery' ? (
          <button
            onClick={confirmArrival}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl transition duration-200"
          >
            Konfirmasi Pesanan Sampai
          </button>
        ) : hasBeenPaid() && !hasBeenDelivered() ? (
          <button
            onClick={confirmDelivery}
            disabled={order.status !== 'processed' && order.status !== 'paid'}
            className={`w-full ${
              (order.status === 'processed' || order.status === 'paid')
                ? 'bg-gray-200 hover:bg-gray-300' 
                : 'bg-gray-100 cursor-not-allowed'
            } text-gray-800 py-3 px-4 rounded-xl transition duration-200`}
          >
            Konfirmasi Pesanan Dikirim
          </button>
        ) : hasBeenPaid() && hasBeenDelivered() ? (
          <button
            onClick={confirmCompletion}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl transition duration-200"
          >
            Konfirmasi Pesanan Selesai
          </button>
        ) : (
          <button
            onClick={confirmDelivery}
            disabled={order.status !== 'processed'}
            className={`w-full ${
              order.status === 'processed' 
                ? 'bg-gray-200 hover:bg-gray-300' 
                : 'bg-gray-100 cursor-not-allowed'
            } text-gray-800 py-3 px-4 rounded-xl transition duration-200`}
          >
            Konfirmasi Pesanan Dikirim
          </button>
        )}

        <button
          onClick={cancelOrder}
          disabled={order.status !== 'pending'}
          className={`w-full ${
            order.status === 'pending'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-300 cursor-not-allowed'
          } text-white py-3 px-4 rounded-xl transition duration-200 font-bold`}
        >
          Batalkan Pesanan
        </button>
      </div>

      {/* Modal Catatan Pesanan */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex justify-center items-center mb-4">
              <h3 className="text-xl font-semibold">Catatan Pesanan</h3>
            </div>
            
            {order.deliveryInfo?.notes ? (
              <div className="border border-gray-300 p-4 rounded-xl">
                <p className="whitespace-pre-wrap cursor-default">{order.deliveryInfo.notes}</p>
              </div>
            ) : (
              <div className="border border-gray-300 p-4 rounded-xl">
                <p className="text-gray-600 text-center cursor-default">Tidak ada catatan untuk pesanan ini.</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={toggleNoteModal}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl transition-all duration-200 ease-in"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

OrderSummary.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    customer: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        note: PropTypes.string,
      })
    ).isRequired,
    deliveryTime: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    paymentInfo: PropTypes.shape({
      proofDownPayment: PropTypes.string,
      proofRemainingPayment: PropTypes.string,
      shipingCost: PropTypes.number,
    }),
  }),
  statusLabel: PropTypes.string.isRequired,
  statusColor: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func,
};

OrderSummary.defaultProps = {
  onStatusChange: () => {},
};