import { Link } from "react-router-dom";
import Button from "../Button/Button.tsx";
import styles from "./LinkButton.module.css";

type LinkButtonProps = {
  to: string;
  children?: React.ReactNode;
  className?: string;
};
export function LinkButton({ to, children, className }: LinkButtonProps) {
  return (
    <Link to={to}>
      <Button className={styles.linkButton + " " + className}>
        {children}
      </Button>
    </Link>
  );
}
