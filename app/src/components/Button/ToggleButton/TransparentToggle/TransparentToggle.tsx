import React from "react";
import ToggleButton from "../ToggleButton.tsx";
import styles from "./TransparentToggle.module.css";

type TransparentToggleProps = {
  value: boolean;
  setValue: (value: boolean) => void;
  children?: React.ReactNode;
  error: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
};
export default function TransparentToggle({
  value,
  setValue,
  children,
  label,
  error,
  disabled,
  className,
}: TransparentToggleProps) {
  return (
    <ToggleButton
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      disabled={disabled}
      className={
        styles.toggle +
        " " +
        (error ? styles.toggleError : "") +
        " " +
        (className || "")
      }
      classNameFalse={styles.toggleFalse}
      classNameTrue={styles.toggleTrue}
      label={label}>      
      {children}
    </ToggleButton>
  );
}
