import { useEffect } from "react";
import styles from "./Snackbar.module.css";

type SnackbarProps = {
  open: boolean;
  autoHideDuration?: number;
  onClose?: () => void;
  message?: string;
  action?: React.ReactNode;
};
export default function Snackbar({
  open,
  autoHideDuration,
  onClose,
  message,
  action,
}: SnackbarProps) {
  useEffect(() => {
    if (open && autoHideDuration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  return open ?
      <div className={styles.snackbar}>
        <p className={styles.message}>{message}</p>
        <div>{action}</div>
      </div>
    : <></>;
}
