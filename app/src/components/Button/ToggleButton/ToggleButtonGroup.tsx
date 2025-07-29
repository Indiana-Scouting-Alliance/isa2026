import React from "react";
import { ToggleButtonPropsAsChild } from "./ToggleButton.tsx";
import styles from "./ToggleButtonGroup.module.css";

type ToggleButtonGroupProps = {
  value: string;
  onChange: (value: string) => void;
  children?: React.ReactNode;
};
export default function ToggleButtonGroup({
  value,
  onChange,
  children,
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
      });
    } else {
      return child;
    }
  });

  return <div className={styles.container}>{childrenWithProps}</div>;
}
