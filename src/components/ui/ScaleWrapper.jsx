function ScaleWrapper({ children, scale = 0.7 }) {
  const width = `${(1 / scale) * 100}%`;
  const marginLeft = `${((1 / scale - 1) / 2) * -100}%`;

  const scaleWrapperStyle = {
    transform: `scale(${scale})`,
    transformOrigin: "top center",
    width,
    marginLeft,
  };

  return (
    <div className="overflow-x-hidden" style={scaleWrapperStyle}>
      {children}
    </div>
  );
}

export default ScaleWrapper;
