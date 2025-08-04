import styles from "./Dialog.module.css";

type DialogProps = {
  open: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
};
export default function Dialog({
  open,
  onClose,
  children,
  className,
}: DialogProps) {
  return open ?
      <div
        className={styles.screenDarken}
        onClick={() => {
          if (onClose) {
            onClose();
          }
        }}>
        <div
          className={styles.dialog + " " + (className || "")}
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
  className?: string;
};
export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={styles.dialogTitle + " " + (className || "")}>{children}</h2>
  );
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
