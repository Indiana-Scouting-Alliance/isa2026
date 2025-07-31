import { Add, Remove } from "@mui/icons-material";
import Button from "../Button/Button.tsx";
import Input from "../Input/Input.tsx";
import styles from "./BigCounter.module.css";

type BigCounterProps = {
  value: number;
  id: string;
  increment: () => void;
  decrement: () => void;
  label: string;
  max?: number;
  disabled?: boolean;
};
export default function BigCounter({
  value,
  id,
  increment,
  decrement,
  label,
  max,
  disabled = false,
}: BigCounterProps) {
  return (
    <div className={styles.container}>
      <Button
        className={
          styles.button + " " + (disabled ? styles.buttonDisabled : "")
        }
        onClick={() => {
          if (value > 0) {
            decrement();
          }
        }}
        disabled={disabled}>
        <Remove />
      </Button>
      <Input
        id={id}
        value={value}
        label={label}
        disabled={disabled}
        className={styles.input}
        type="number"
      />
      <Button
        className={
          styles.button + " " + (disabled ? styles.buttonDisabled : "")
        }
        onClick={() => {
          if (max === undefined || value < max) {
            increment();
          }
        }}
        disabled={disabled}>
        <Add />
      </Button>
    </div>
  );
}
