import { useState } from 'react';
import PropTypes from "prop-types";
import Swal from 'sweetalert2';

export default function OrderSummary({ order, onStatusChange }) {
  const [tempShippingCost, setTempShippingCost] = useState(''); // Untuk input sementara
  const [isUpdatingShipping, setIsUpdatingShipping] = useState(false);

  if (!order) return null;

  // Calculate total price
  const calculateTotal = () => {
    return order.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  // Fungsi untuk menyimpan ongkos kirim
  const saveShippingCost = async () => {
    if (!tempShippingCost || isNaN(tempShippingCost)) {
      Swal.fire('Error!', 'Masukkan nominal ongkos kirim yang valid', 'error');
      return;
    }

    try {
      setIsUpdatingShipping(true);
      await onStatusChange(order.id, 'update_shipping', { 
        shipingCost: Number(tempShippingCost) 
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
        Swal.fire(
          'Berhasil!',
          'Pembayaran DP telah dikonfirmasi.',
          'success'
        );
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
        Swal.fire(
          'Berhasil!',
          'Status pesanan telah diubah menjadi "Dalam Pengiriman".',
          'success'
        );
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
        Swal.fire(
          'Berhasil!',
          'Status pesanan telah diubah menjadi "Sudah Sampai".',
          'success'
        );
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
        Swal.fire(
          'Berhasil!',
          'Pelunasan telah dikonfirmasi dan status pesanan diubah menjadi "Lunas".',
          'success'
        );
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
        Swal.fire(
          'Berhasil!',
          'Pesanan telah diselesaikan.',
          'success'
        );
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
        Swal.fire(
          'Dibatalkan!',
          'Pesanan telah berhasil dibatalkan.',
          'success'
        );
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
    <div className="w-96 bg-white rounded-xl border border-gray-200 shadow-md h-fit">
      {/* Customer Header */}
      <div className="bg-green-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center">
          <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          <h3 className="font-bold text-xl">{order.customer}</h3>
        </div>
      </div>

      {/* Order Items List */}
      <div className="divide-y divide-gray-200">
        {order.items.map((item, index) => (
          <div key={index} className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="bg-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2">
                  {item.quantity}x
                </span>
                <div>
                  <p className="font-medium text-green-700">{`Rp. ${item.price.toLocaleString()}`}</p>
                  <p>{item.name}</p>
                  {item.note && (
                    <p className="text-gray-500 text-sm">{item.note}</p>
                  )}
                </div>
              </div>
              {/* <button className="text-gray-500 hover:text-gray-700">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button> */}
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="p-4 bg-gray-50">
        <div className="flex justify-between mb-2">
          <p className="font-medium">Sub Total:</p>
          <p className="font-bold">{`Rp. ${calculateTotal().toLocaleString()}`}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Ongkos Kirim:</p>
          <p className="font-bold text-red-500">
            {order.paymentInfo?.shipingCost 
              ? `Rp. ${order.paymentInfo.shipingCost.toLocaleString()}` 
              : 'Belum diatur'}
          </p>
        </div>
      </div>

      {/* Shipping Cost Input */}
      <div className="p-4 bg-gray-100 border-t border-gray-200">
        <div className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2">
          <svg
            className="h-5 w-5 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <input
            type="number"
            value={tempShippingCost}
            onChange={(e) => setTempShippingCost(e.target.value)}
            placeholder="Masukkan Nominal Ongkir..."
            className="w-full outline-none text-sm"
          />
          <button
            onClick={saveShippingCost}
            disabled={isUpdatingShipping || !tempShippingCost}
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
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
              disabled={order.status !== 'pending'} // Hanya aktif jika status pending
              className={`w-full ${
                order.status === 'pending' 
                  ? 'bg-orange-400 hover:bg-orange-500' 
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white py-3 px-4 rounded-md transition duration-200`}
            >
              <div className="text-center">
                <div className="font-bold">Sudah DP</div>
                <div className="text-sm">50%</div>
                <div className="text-sm">{`Rp. ${Math.floor(calculateTotal() * 0.5).toLocaleString()}`}</div>
              </div>
            </button>
            <button
              onClick={openDPProof}
              className="w-full bg-orange-100 hover:bg-orange-200 text-orange-600 py-2 px-4 rounded-md transition duration-200 text-sm mt-1"
            >
              Lihat Bukti DP
            </button>
          </div>
          <div>
            <button
              onClick={confirmFullPayment}
              disabled={order.status === 'pending' || order.status === 'completed'}
              className={`w-full ${
                (order.status !== 'pending' && order.status !== 'completed')
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white py-3 px-4 rounded-md transition duration-200`}
            >
              <div className="text-center">
                <div className="font-bold">Lunas</div>
                <div className="text-sm">50%+Ongkir</div>
                <div className="text-sm">
                  {order.paymentInfo?.statusRemainingPayment === 'verified' 
                    ? 'Terverifikasi' 
                    : 'Konfirmasi Pelunasan'}
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
              } text-gray-600 py-2 px-4 rounded-md transition duration-200 text-sm mt-1`}
            >
              Lihat Bukti Pelunasan
            </button>
          </div>
        </div>

        {order.status === 'completed' ? (
          <div className="w-full bg-green-400 text-white py-3 px-4 rounded-md text-center cursor-not-allowed">
            Pesanan Selesai
          </div>
        ) : order.status === 'arrived' || order.status === 'paid' ? (
          <button
            onClick={confirmCompletion}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md transition duration-200"
          >
            Konfirmasi Pesanan Selesai
          </button>
        ) : order.status === 'delivery' ? (
          <button
            onClick={confirmArrival}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition duration-200"
          >
            Konfirmasi Pesanan Sampai
          </button>
        ) : (
          <button
            onClick={confirmDelivery}
            disabled={order.status !== 'processed'}
            className={`w-full ${
              order.status === 'processed' 
                ? 'bg-gray-200 hover:bg-gray-300' 
                : 'bg-gray-100 cursor-not-allowed'
            } text-gray-800 py-3 px-4 rounded-md transition duration-200`}
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
          } text-white py-3 px-4 rounded-md transition duration-200 font-bold`}
        >
          Batalkan Pesanan
        </button>
      </div>
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