import React from "react";

export default function Slider(props) {
  const { min = 0, max = 255, onChange, value } = props;

  const handleChange = (event) => {
    const newValue = parseInt(event.target.value);
    onChange(newValue);
  };

  return (
    <>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
    </>
  );
}
