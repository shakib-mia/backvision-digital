import React, { useState } from "react";
import styles from "./inputfield.module.css"; // Import the CSS module

const InputField = (props) => {
  const {
    label,
    placeholder,
    id,
    type = "text", // Default to "text" if type is not provided
    onChange,
    value,
    required,
    containerClassName = "",
    fieldClassName = "",
    disabled,
    ...rest
  } = props;

  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(value?.length > 0);

  return (
    <div className="relative mb-3">
      <div className={`${styles.inputContainer} ${containerClassName}`}>
        {props.textarea ? (
          <textarea
            id={id}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`${styles.inputField} ${fieldClassName}`}
            required={required}
            {...rest}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`${styles.inputField} ${fieldClassName}`}
            required={required}
            {...rest}
          />
        )}
        {label && (
          <label
            htmlFor={id}
            className={`${styles.label} ${
              focused ||
              type === "date" ||
              type === "file" ||
              type === "checkbox" ||
              disabled ||
              value?.length
                ? styles.focused
                : ""
            } ${type === "checkbox" ? "static" : "absolute"}`}
          >
            {label}
          </label>
        )}
      </div>
      <div
        className={`${
          type !== "file" && "absolute -bottom-2"
        } text-right right-0 text-white-deactivated text-button ${
          props.noteClassName
        }`}
      >
        {props.note}
      </div>
    </div>
  );
};

export default InputField;
