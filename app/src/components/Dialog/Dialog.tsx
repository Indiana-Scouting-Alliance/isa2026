import styles from "./Dialog.module.css";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};
export default function Dialog({ open, onClose, children }: DialogProps) {
  return open ?
      <div
        className={styles.screenDarken}
        onClick={() => {
          onClose();
        }}>
        <div
          className={styles.dialog}
          onClick={(event) => {
            event.stopPropagation();
          }}>
          {children}
        </div>
      </div>
    : <></>;
}

type DialogTitleProps = {
  children: React.ReactNode;
};
export function DialogTitle({ children }: DialogTitleProps) {
  return <h2 className={styles.dialogTitle}>{children}</h2>;
}

type DialogContentProps = {
  children: React.ReactNode;
};
export function DialogContent({ children }: DialogContentProps) {
  return <div className={styles.dialogContent}>{children}</div>;
}

type DialogActionsProps = {
  children: React.ReactNode;
};
export function DialogActions({ children }: DialogActionsProps) {
  return <div className={styles.dialogActions}>{children}</div>;
}
