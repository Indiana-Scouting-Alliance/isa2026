import Button from "../Button.tsx";
import styles from "./ToggleButton.module.css";

type ToggleButtonProps = {
  children?: React.ReactNode;
  className?: string;
  classNameTrue?: string;
  classNameFalse?: string;
};
type ToggleButtonPropsAsStandalone = {
  value: boolean;
  onChange: (value: boolean) => void;
} & ToggleButtonProps;
export type ToggleButtonPropsAsChild = {
  value: string;
  selected?: boolean;
  onClick?: () => void;
} & ToggleButtonProps;
export default function ToggleButton({
  value,
  onClick,
  children,
}: ToggleButtonPropsAsChild): React.ReactNode;
export default function ToggleButton({
  value,
  onChange,
  children,
}: ToggleButtonPropsAsStandalone): React.ReactNode;
export default function ToggleButton({
  value,
  children,
  className,
  classNameTrue,
  classNameFalse,
  ...props
}: ToggleButtonPropsAsStandalone | ToggleButtonPropsAsChild): React.ReactNode {
  return (
    <Button
      className={
        ((
          "selected" in props ? props.selected : value
        ) ?
          styles.buttonTrue + " " + (classNameTrue || "")
        : styles.buttonFalse + " " + (classNameFalse || "")) +
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
