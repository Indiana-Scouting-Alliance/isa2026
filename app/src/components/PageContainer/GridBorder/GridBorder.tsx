import Backdrop from "../../Backdrop/Backdrop.tsx";
import styles from "./GridBorder.module.css";

type GridBorderProps = {
  backdrop?: boolean;
  onCloseBackdrop?: () => void;
  children?: React.ReactNode;
};
export default function GridBorder({
  backdrop = false,
  onCloseBackdrop,
  children,
}: GridBorderProps) {
  return (
    <div className={styles.grid}>
      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
        }}
        className={styles.gridCell}
        onClick={() => {
          if (backdrop && onCloseBackdrop) {
            onCloseBackdrop();
          }
        }}>
        <Backdrop
          open={backdrop}
          onClose={onCloseBackdrop}
        />
      </div>
      <div
        style={{
          gridColumn: 2,
          gridRow: 1,
        }}
        className={styles.gridCell}
        onClick={() => {
          if (backdrop && onCloseBackdrop) {
            onCloseBackdrop();
          }
        }}>
        <Backdrop
          open={backdrop}
          onClose={onCloseBackdrop}
        />
      </div>
      <div
        style={{
          gridColumn: 3,
          gridRow: 1,
        }}
        className={styles.gridCell}
        onClick={() => {
          if (backdrop && onCloseBackdrop) {
            onCloseBackdrop();
          }
        }}>
        <Backdrop
          open={backdrop}
          onClose={onCloseBackdrop}
        />
      </div>
      <div
        style={{
          gridColumn: 1,
          gridRow: 2,
        }}
        className={styles.gridCell}
        onClick={() => {
          if (backdrop && onCloseBackdrop) {
            onCloseBackdrop();
          }
        }}>
        <Backdrop
          open={backdrop}
          onClose={onCloseBackdrop}
        />
      </div>
      <div
        style={{
          gridColumn: 3,
          gridRow: 2,
        }}
        className={styles.gridCell}
        onClick={() => {
          if (backdrop && onCloseBackdrop) {
            onCloseBackdrop();
          }
        }}>
        <Backdrop
          open={backdrop}
          onClose={onCloseBackdrop}
        />
      </div>
      <div
        style={{
          gridColumn: 1,
          gridRow: 3,
        }}
        className={styles.gridCell}
        onClick={() => {
          if (backdrop && onCloseBackdrop) {
            onCloseBackdrop();
          }
        }}>
        <Backdrop
          open={backdrop}
          onClose={onCloseBackdrop}
        />
      </div>
      <div
        style={{
          gridColumn: 2,
          gridRow: 3,
        }}
        className={styles.gridCell}
        onClick={() => {
          if (backdrop && onCloseBackdrop) {
            onCloseBackdrop();
          }
        }}>
        <Backdrop
          open={backdrop}
          onClose={onCloseBackdrop}
        />
      </div>
      <div
        style={{
          gridColumn: 3,
          gridRow: 3,
        }}
        className={styles.gridCell}
        onClick={() => {
          if (backdrop && onCloseBackdrop) {
            onCloseBackdrop();
          }
        }}>
        <Backdrop
          open={backdrop}
          onClose={onCloseBackdrop}
        />
      </div>
      <div className={styles.contentGridCell}>{children}</div>
    </div>
  );
}
