import PropTypes from "prop-types";

export default function PaymentStatus({ downPaymentAmount }) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1 bg-orange-300 rounded-lg p-2">
        <p className="text-center font-semibold">Sudah DP</p>
        <p className="text-center font-semibold">50%</p>
        <p className="text-center font-semibold text-white">
          Rp. {downPaymentAmount.toLocaleString()}
        </p>
      </div>
      <div className="flex-1 bg-gray-200 rounded-lg p-2">
        <p className="text-center font-semibold">Lunas</p>
        <p className="text-center font-semibold">50%+Ongkir</p>
        <p className="text-center font-semibold text-gray-500">Belum Dibayar</p>
      </div>
    </div>
  );
}

PaymentStatus.propTypes = {
  downPaymentAmount: PropTypes.number.isRequired,
};
