import PropTypes from "prop-types";

export default function MonthSelector({
  months,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
}) {
  const decrementYear = () => {
    setSelectedYear((prev) => prev - 1);
  };

  const incrementYear = () => {
    setSelectedYear((prev) => prev + 1);
  };

  return (
    <div className="lg:col-span-3 bg-white rounded-xl border border-gray-300 shadow-md h-fit">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={decrementYear}
          className="w-12 h-12 rounded-full border border-gray-900 flex items-center justify-center text-xl font-semibold"
        >
          ←
        </button>
        <span className="text-2xl font-semibold">{selectedYear}</span>
        <button
          onClick={incrementYear}
          className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-xl font-semibold text-white"
        >
          →
        </button>
      </div>

      <div className="border-t border-gray-300"></div>

      <div className="max-h-96 overflow-y-auto">
        {months.map((month) => (
          <div
            key={month}
            className={`py-3 px-6 cursor-pointer ${
              selectedMonth === month
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedMonth(month)}
          >
            <span className="text-lg font-medium">{month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

MonthSelector.propTypes = {
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedMonth: PropTypes.string.isRequired,
  selectedYear: PropTypes.number.isRequired,
  setSelectedMonth: PropTypes.func.isRequired,
  setSelectedYear: PropTypes.func.isRequired,
};
