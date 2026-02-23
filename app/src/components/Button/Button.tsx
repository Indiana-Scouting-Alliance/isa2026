import styles from "./Button.module.css";

type ButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  htmlRef?: React.Ref<HTMLButtonElement>;
  disabled?: boolean;
  label?: string;
};
export default function Button({
  onClick,
  children,
  className,
  style,
  htmlRef,
  disabled,
  label,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={styles.button + " " + (className || "")}
      style={style}
      ref={htmlRef}
      disabled={disabled}>
      {children || label} {/* Use label if children is not provided */}
    </button>
  );
}
