import React, { useState } from "react";

const RadioGroup = ({ options, value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    onChange(event.target.value)
    setSelectedValue(event.target.value);
  };

  return (
    <>
      {options.map((option, index) => (
        <label key={option.label}>
          <input
            type="radio"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={handleChange}
          />
          {option.label}
        </label>
      ))}
    </>
  );
};

export default RadioGroup;
