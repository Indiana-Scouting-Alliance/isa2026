import Button from "../Button.tsx";
import styles from "./ToggleButton.module.css";

type ToggleButtonProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};
export type ToggleButtonPropsAsChild = {
  value: string;
  selected?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
};
export default function ToggleButton({
  value,
  onClick,
  children,
}: ToggleButtonPropsAsChild): React.ReactNode;
export default function ToggleButton({
  value,
  onChange,
  children,
}: ToggleButtonProps): React.ReactNode;
export default function ToggleButton({
  value,
  children,
  className,
  ...props
}: ToggleButtonProps | ToggleButtonPropsAsChild): React.ReactNode {
  return (
    <Button
      className={
        ((
          "selected" in props ? props.selected : value
        ) ?
          styles.buttonTrue
        : styles.buttonFalse) +
        " " +
        (className || "")
      }
      onClick={() => {
        if ("onChange" in props && props.onChange !== undefined) {
          props.onChange(!value);
        } else if ("onClick" in props && props.onClick !== undefined) {
          props.onClick();
        }
      }}>
      {children}
    </Button>
  );
}
