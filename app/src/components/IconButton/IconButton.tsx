import styles from "./IconButton.module.css";

type IconButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};
export default function IconButton({ onClick, children }: IconButtonProps) {
  return (
    <button
      className={styles.button}
      onClick={onClick}>
      {children}
    </button>
  );
}
