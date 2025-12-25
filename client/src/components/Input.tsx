/**
 * Reusable Input component with React Hook Form integration
 * Displays label, input field, and error messages
 */
import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  errors?: FieldErrors;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  register,
  errors,
  required = false,
  ...rest
}) => {
  const errorMessage = errors?.[name]?.message as string | undefined;

  return (
    <div className="input-group">
      <label htmlFor={name} className="input-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        id={name}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        className={`input-field ${errorMessage ? "input-error" : ""}`}
        {...rest}
      />
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default Input;
