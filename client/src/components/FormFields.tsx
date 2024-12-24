/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface FormFieldProps {
  type?: string;
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  errors?: FieldErrors;
  isVisible?: boolean;
  setIsVisible?: (isVisible: boolean) => void;
  validate?: (value: string) => string | undefined;
  defaultValue?: string;
  isRequired?: boolean;
  disabled?: boolean;
  [key: string]: unknown;
  options?: { value?: string; name?: string }[];
  min?: number;
  max?: number;
}

export const TextField = ({
  type,
  id,
  name,
  label,
  placeholder,
  register,
  errors,
  isVisible,
  setIsVisible,
  validate,
  disabled,
  isRequired,
  min,
  max,
  ...rest
}: FormFieldProps) => {
  const toggleVisibility = () => setIsVisible?.((prev) => !prev);
  return (
    <div className="form-control mb-3 flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="label-text">
          {label} {isRequired && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          className={`input input-bordered w-full border-[1.5px] p-2 text-sm ${
            errors?.[name] ? "focus:border-red-600" : ""
          } rounded-none`}
          placeholder={placeholder}
          type={isVisible ? "text" : type}
          id={id}
          {...register(name, { validate })}
          disabled={disabled}
          min={min}
          max={max}
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-2 text-sm border-0 focus:outline-none font-semibold"
            onClick={toggleVisibility}
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {errors?.[name]?.message && (
        <span className="text-xs text-red-600">
          {errors?.[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export const SelectField = ({
  id,
  name,
  label,
  register,
  errors,
  options,
  validate,
  placeholder,
  isRequired,
  ...rest
}: FormFieldProps) => {
  return (
    <div className="form-control mb-3 flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="label-text">
          {label} {isRequired && <span className="text-red-600">*</span>}
        </label>
      )}
      <select
        className="select select-bordered w-full border-[1.5px] p-2 text-sm rounded-none"
        id={id}
        {...register(name, { validate })}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value || option.name}
            className="capitalize"
          >
            {option.value || option.name}
          </option>
        ))}
      </select>
      {errors?.[name]?.message && (
        <span className="text-xs text-red-600">
          {errors?.[name]?.message as string}
        </span>
      )}
    </div>
  );
};
