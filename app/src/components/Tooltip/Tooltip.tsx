import React from "react";
import styles from "./Tooltip.module.css";

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
};
export default function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const [tooltipStyle, setTooltipStyle] = React.useState<React.CSSProperties>(
    {}
  );

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipStyle({
      position: "fixed",
      top: rect.bottom,
      left: rect.left,
      transform: "translateX(-50%)",
    });
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  return (
    <div
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {children}
      {visible && (
        <div
          className={styles.tooltipContainer}
          style={tooltipStyle}>
          <div className={styles.tooltip}>{content}</div>
        </div>
      )}
    </div>
  );
}
