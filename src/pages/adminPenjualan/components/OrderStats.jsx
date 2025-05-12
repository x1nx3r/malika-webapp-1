import PropTypes from "prop-types";

export default function OrderStats({ counts }) {
  return (
    <>
      <div className="flex-1 text-center text-white py-6 border-r border-white">
        <div className="text-5xl font-light">{counts.needConfirmation}</div>
        <div className="font-bold text-xl">Butuh Konfirmasi Ongkir</div>
      </div>
      <div className="flex-1 text-center text-white py-6 border-r border-white">
        <div className="text-5xl font-light">{counts.readyToShip}</div>
        <div className="font-bold text-xl">Pesanan Harus Dikirim</div>
      </div>
      <div className="flex-1 text-center text-white py-6">
        <div className="text-5xl font-light">{counts.completed}</div>
        <div className="font-bold text-xl">Pesanan Selesai</div>
      </div>
    </>
  );
}

OrderStats.propTypes = {
  counts: PropTypes.shape({
    needConfirmation: PropTypes.number.isRequired,
    readyToShip: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
  }).isRequired,
};
