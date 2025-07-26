import Button from "../Button/Button.tsx";
import styles from "./ToggleButton.module.css";

type ToggleButtonProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  children?: React.ReactNode;
};
export default function ToggleButton({
  value,
  onChange,
  children,
}: ToggleButtonProps) {
  return (
    <Button
      className={value ? styles.buttonTrue : styles.buttonFalse}
      onClick={() => {
        onChange(!value);
      }}>
      {children}
    </Button>
  );
}
