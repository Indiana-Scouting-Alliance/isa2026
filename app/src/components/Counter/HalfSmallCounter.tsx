import { Remove } from "@mui/icons-material";
import Button from "../Button/Button.tsx";
import Input from "../Input/Input.tsx";
import styles from "./SmallCounter.module.css";

type HalfSmallCounterProps = {
  value: number;
  setValue: (value: number) => void;
  className?: string;
  id: string;
};
export default function HalfSmallCounter({
  value,
  setValue,
  className,
  id,
}: HalfSmallCounterProps) {
  return (
    <div
      className={styles.container + " " + (className || "")}
      onClick={(event) => {
        event.stopPropagation();
      }}>
      <Button
        className={styles.button}
        onClick={(event) => {
          event.stopPropagation();
          if (value > 0) {
            setValue(value - 1);
          }
        }}>
        <Remove />
      </Button>
      <Input
        id={id}
        value={value}
        className={styles.input}
        outlineClassName={styles.inputOutline}
        disabled
      />
    </div>
  );
}
