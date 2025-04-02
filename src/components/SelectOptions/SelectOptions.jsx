import React from "react";
import { FaChevronDown } from "react-icons/fa";

const SelectOptions = ({
  id,
  label,
  onChange,
  options,
  containerClassName = "",
  fieldClassName = "",
  note,
  placeholder,
  required,
  name,
  value,
  hideRequired,
}) => {
  return (
    <div className={`relative w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className="absolute top-3 left-4 text-gray-400 text-sm transition-all"
        >
          {label}
        </label>
      )}
      <div className="relative w-full mt-3 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`bg-transparent w-full ${fieldClassName}`}
        >
          {placeholder && (
            <option disabled value="">
              {placeholder}
            </option>
          )}
          {options.map((option, key) => (
            <option key={key} value={option} className="bg-gray-700 text-white">
              {option}
            </option>
          ))}
        </select>
        {/* <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <FaChevronDown className="text-white" />
        </div> */}
      </div>

      {note && <p className="text-gray-400 text-sm mt-1">{note}</p>}
    </div>
  );
};

export default SelectOptions;
