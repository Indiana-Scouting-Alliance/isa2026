import React from "react";
import styles from "./LabeledContainer.module.css";

type LabeledContainerProps = {
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  showLabelBorder?: boolean;
  showOuterBorder?: boolean;
  className?: string;
  bodyClass?: string;
};

export default function LabeledContainer({
  label,
  children,
  style,
  showLabelBorder = false,
  showOuterBorder = true,
  className,
  bodyClass,
}: LabeledContainerProps) {
  const labelClasses = [styles.label];
  if (showLabelBorder) {
    labelClasses.push(styles.labelBorder);
  }

  const containerClasses = [styles.container];
  if (!showOuterBorder) {
    containerClasses.push(styles.noOuterBorder);
  }
  if (className) {
    containerClasses.push(className);
  }

  const bodyClasses = [styles.body];
  if (bodyClass) {
    bodyClasses.push(bodyClass);
  }

  return (
    <div className={containerClasses.join(" ")} style={style}>
      <div className={labelClasses.join(" ")}>{label}</div>
      <div className={bodyClasses.join(" ")}>{children}</div>
    </div>
  );
}
