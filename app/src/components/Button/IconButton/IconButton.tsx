import styles from "./IconButton.module.css";

type IconButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
};
export default function IconButton({
  onClick,
  children,
  className,
}: IconButtonProps) {
  return (
    <button
      className={styles.button + " " + (className || "")}
      onClick={onClick}>
      {children}
    </button>
  );
}
