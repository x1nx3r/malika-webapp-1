import PropTypes from "prop-types";

export default function OrderLineItem({ item, isLast }) {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
          {item.quantity}x
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">{item.name}</h4>
          {item.note && <p className="text-sm">{item.note}</p>}
          <p className="text-green-600 font-semibold text-lg mt-2">
            Rp. {(item.quantity * item.price).toLocaleString()}
          </p>
        </div>
        <button className="w-6 h-6 bg-gray-100">×</button>
      </div>
      {!isLast && <div className="border-b border-gray-200 mt-4"></div>}
    </div>
  );
}

OrderLineItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    note: PropTypes.string,
  }).isRequired,
  isLast: PropTypes.bool,
};

OrderLineItem.defaultProps = {
  isLast: false,
};
