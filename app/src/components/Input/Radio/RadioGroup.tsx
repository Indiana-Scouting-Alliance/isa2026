import React from "react";
import { RadioProps } from "./Radio.tsx";
import styles from "./RadioGroup.module.css";

type RadioGroupProps = {
  children?: React.ReactNode;
  name: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
};
export default function RadioGroup({
  children,
  name,
  label,
  error,
  helperText,
  className,
  value,
  onChange,
}: RadioGroupProps) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<RadioProps>(child)) {
      return React.cloneElement(child, {
        name: name,
        selected: value === child.props.value,
        onChange: (selected) => {
          if (selected) {
            onChange(child.props.value);
          } else {
            onChange("");
          }
        },
      } as RadioProps);
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
