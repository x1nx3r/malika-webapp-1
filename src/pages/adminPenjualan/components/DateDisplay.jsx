import PropTypes from "prop-types";

export default function DateDisplay({ day, date }) {
  return (
    <div className="flex-1 text-center py-6 text-orange-500 bg-white">
      <div className="text-4xl font-light">{day}</div>
      <div className="font-bold">{date}</div>
    </div>
  );
}

DateDisplay.propTypes = {
  day: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
