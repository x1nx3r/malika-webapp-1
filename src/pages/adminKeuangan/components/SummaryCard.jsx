import PropTypes from "prop-types";

export default function SummaryCard({ data, showOrderDetails }) {
  const {
    month,
    year,
    completedOrders,
    revenue,
    cancelledOrders,
    orderDetails,
  } = data;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  return (
    <div className="w-full bg-orange-500 rounded-3xl mb-8 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white">
        {/* Month/Year or Customer Info */}
        <div className="p-6 flex flex-col items-center justify-center bg-white rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl">
          {showOrderDetails && orderDetails ? (
            <>
              <div className="text-2xl md:text-3xl font-medium text-orange-500">
                {orderDetails.customer}
              </div>
              <div className="text-lg md:text-xl font-bold text-orange-500 mt-2">
                Order #{orderDetails.id}
              </div>
              <div className="text-base font-semibold bg-green-500 text-white px-4 py-1 rounded-full mt-2">
                {orderDetails.status}
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl md:text-5xl font-light text-orange-500">
                {month}
              </div>
              <div className="text-xl md:text-2xl font-bold text-orange-500">
                {year}
              </div>
            </>
          )}
        </div>

        {/* Completed Orders */}
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="text-4xl md:text-5xl font-light text-white">
            {completedOrders}
          </div>
          <div className="text-xl md:text-2xl font-bold text-white">
            {showOrderDetails ? "Jumlah Item" : "Pesanan Selesai"}
          </div>
        </div>

        {/* Revenue */}
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="text-3xl md:text-4xl font-light text-white">
            Rp. {formatCurrency(revenue)}
          </div>
          <div className="text-lg md:text-xl font-bold text-white">
            {showOrderDetails ? "Total Pesanan" : "Total Omzet Bulan Ini"}
          </div>
        </div>

        {/* Cancelled Orders or Order Date */}
        <div className="p-6 flex flex-col items-center justify-center bg-orange-600 rounded-b-3xl md:rounded-bl-none md:rounded-r-3xl">
          {showOrderDetails && orderDetails ? (
            <>
              <div className="text-2xl md:text-3xl font-light text-white">
                {orderDetails.orderDate}
              </div>
              <div className="text-lg md:text-xl font-bold text-white">
                Tanggal Pesanan
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl md:text-5xl font-light text-white">
                {cancelledOrders}
              </div>
              <div className="text-xl md:text-2xl font-bold text-white">
                Pesanan Dibatalkan
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

SummaryCard.propTypes = {
  data: PropTypes.shape({
    month: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    completedOrders: PropTypes.number.isRequired,
    revenue: PropTypes.number.isRequired,
    cancelledOrders: PropTypes.number.isRequired,
    orderDetails: PropTypes.shape({
      id: PropTypes.number,
      customer: PropTypes.string,
      status: PropTypes.string,
      orderDate: PropTypes.string,
    }),
  }).isRequired,
  showOrderDetails: PropTypes.bool,
};

SummaryCard.defaultProps = {
  showOrderDetails: false,
};
