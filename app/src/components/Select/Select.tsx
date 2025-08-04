import React from "react";
import styles from "./Select.module.css";

type SelectProps = {
  id: string;
  value: string;
  children?: React.ReactNode;
  className?: string;
  label?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  helperText?: string;
  error?: boolean;
};
export default function Select({
  id,
  value,
  children,
  className,
  label,
  onChange,
  disabled,
  helperText,
  error,
}: SelectProps) {
  return (
    <div className={styles.container + " " + (className || "")}>
      {label && (
        <label
          htmlFor={id}
          className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={styles.outline + " " + (error ? styles.errorOutline : "")}>
        <select
          id={id}
          className={
            styles.select + " " + (disabled ? styles.selectDisabled : "")
          }
          value={value}
          onChange={(event) => {
            if (onChange) {
              onChange(event.target.value);
            }
          }}
          disabled={disabled}>
          {children}
        </select>
      </div>
      {helperText && (
        <p
          className={
            styles.helperText + " " + (error ? styles.helperTextError : "")
          }>
          {helperText}
        </p>
      )}
    </div>
  );
}
