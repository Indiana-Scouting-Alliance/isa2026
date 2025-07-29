import styles from "./Button.module.css";

type ButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  htmlRef?: React.Ref<HTMLButtonElement>;
};
export default function Button({
  onClick,
  children,
  className,
  style,
  htmlRef,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={styles.button + " " + (className || "")}
      style={style}
      ref={htmlRef}>
      {children}
    </button>
  );
}
