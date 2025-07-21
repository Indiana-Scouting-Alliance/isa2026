import styles from "./Button.module.css";

type ButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};
export default function Button({
  onClick,
  children,
  className,
  style,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={styles.button + " " + className}
      style={style}>
      {children}
    </button>
  );
}
