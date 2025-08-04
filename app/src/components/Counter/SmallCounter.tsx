import { Add, Remove } from "@mui/icons-material";
import Button from "../Button/Button.tsx";
import Input from "../Input/Input.tsx";
import styles from "./SmallCounter.module.css";

type SmallCounterProps = {
  id: string;
  value: number;
  setValue: (value: number) => void;
  max?: number;
  className?: string;
  insideLabel?: string;
};
export default function SmallCounter({
  id,
  value,
  setValue,
  max,
  className,
  insideLabel,
}: SmallCounterProps) {
  return (
    <div
      className={styles.container + " " + (className || "")}
      onClick={(event) => {
        event.stopPropagation();
      }}>
      <Button
        onClick={(event) => {
          event.stopPropagation();
          if (value > 0) {
            setValue(value - 1);
          }
        }}
        className={styles.button}>
        <Remove />
      </Button>
      <Input
        id={id}
        value={(insideLabel || "") + value}
        className={styles.input}
        outlineClassName={styles.inputOutline}
        disabled
      />
      <Button
        onClick={(event) => {
          event.stopPropagation();
          if (max === undefined || value < max) {
            console.log(max);
            setValue(value + 1);
          }
        }}
        className={styles.button}>
        <Add />
      </Button>
    </div>
  );
}
