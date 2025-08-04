import React from "react";
import { ToggleButtonPropsAsChild } from "./ToggleButton.tsx";
import styles from "./ToggleButtonGroup.module.css";

type ToggleButtonGroupProps = {
  value: string;
  onChange: (value: string) => void;
  children?: React.ReactNode;
  label?: string;
  error?: boolean;
  helperText?: string;
  className?: string;
};
export default function ToggleButtonGroup({
  value,
  onChange,
  children,
  label,
  error,
  helperText,
  className,
}: ToggleButtonGroupProps) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<ToggleButtonPropsAsChild>(child)) {
      return React.cloneElement(child, {
        selected: value === child.props.value,
        onClick: () => {
          if (value === child.props.value) {
            onChange("");
          } else {
            onChange(child.props.value);
          }
        },
      } as ToggleButtonPropsAsChild);
    } else {
      return child;
    }
  });

  return (
    <div className={styles.container + " " + (className || "")}>
      {label && <p className={styles.label}>{label}</p>}
      <div className={styles.outline}>{childrenWithProps}</div>
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
