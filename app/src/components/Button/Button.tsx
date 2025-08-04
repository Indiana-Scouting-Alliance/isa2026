import styles from "./Button.module.css";

type ButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  htmlRef?: React.Ref<HTMLButtonElement>;
  disabled?: boolean;
};
export default function Button({
  onClick,
  children,
  className,
  style,
  htmlRef,
  disabled,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={styles.button + " " + (className || "")}
      style={style}
      ref={htmlRef}
      disabled={disabled}>
      {children}
    </button>
  );
}
