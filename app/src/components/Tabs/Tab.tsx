import styles from "./Tab.module.css";

export type TabProps = {
  value: string;
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
};
export default function Tab({
  children,
  selected,
  onClick,
  className,
  style,
}: TabProps) {
  return (
    <div
      className={
        styles.tab +
        " " +
        (className || "") +
        " " +
        (selected ? styles.activeTab : "")
      }
      onClick={onClick}
      style={style}>
      {children}
    </div>
  );
}
