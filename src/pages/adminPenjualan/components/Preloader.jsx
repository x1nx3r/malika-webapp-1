import PropTypes from "prop-types";

export default function Preloader({ size = "md" }) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-orange-500 ${sizes[size]}`}></div>
    </div>
  );
}

Preloader.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};