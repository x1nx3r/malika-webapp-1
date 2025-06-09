import PropTypes from "prop-types";

export default function OrderStats({ counts }) {
  return (
    <>
      <div className="flex-1 text-center text-white py-6 border-r border-white">
        <div className="text-5xl font-light">{counts.pending || 0}</div>
        <div className="font-bold text-xl">Butuh Konfirmasi</div>
      </div>
      <div className="flex-1 text-center text-white py-6 border-r border-white">
        <div className="text-5xl font-light">{counts.processed || 0}</div>
        <div className="font-bold text-xl">Pesanan Harus Dikirim</div>
      </div>
      <div className="flex-1 text-center text-white py-6 border-r border-white">
        <div className="text-5xl font-light">{counts.arrived || 0}</div>
        <div className="font-bold text-xl">Pesanan Diterima</div>
      </div>
      <div className="flex-1 text-center text-white py-6 border-r border-white">
        <div className="text-5xl font-light">{counts.paid || 0}</div>
        <div className="font-bold text-xl">Pesanan Lunas</div>
      </div>
      <div className="flex-1 text-center text-white py-6">
        <div className="text-5xl font-light">{counts.completed || 0}</div>
        <div className="font-bold text-xl">Pesanan Selesai</div>
      </div>
    </>
  );
}

OrderStats.propTypes = {
  counts: PropTypes.shape({
    pending: PropTypes.number.isRequired,
    processed: PropTypes.number.isRequired,
    arrived: PropTypes.number.isRequired,
    paid: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
  }).isRequired,
};
