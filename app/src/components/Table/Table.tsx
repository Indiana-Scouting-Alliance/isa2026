import styles from "./Table.module.css";

type TableProps = {
  children?: React.ReactNode;
  className?: string;
};
export function Table({ children, className }: TableProps) {
  return (
    <table className={styles.table + " " + (className || "")}>{children}</table>
  );
}

type TableHeadProps = {
  children?: React.ReactNode;
};
export function TableHead({ children }: TableHeadProps) {
  return <thead className={styles.tableHead}>{children}</thead>;
}

type ThProps = {
  children?: React.ReactNode;
};
export function Th({ children }: ThProps) {
  return <th className={styles.th}>{children}</th>;
}

type TdProps = {
  children?: React.ReactNode;
};
export function Td({ children }: TdProps) {
  return <td className={styles.td}>{children}</td>;
}
