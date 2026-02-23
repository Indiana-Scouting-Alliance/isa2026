import Button from "../Button.tsx";
import styles from "./ToggleButton.module.css";
import scoutStyles from "../../styles/ScoutStyles.module.css";

type ToggleButtonProps = {
  children?: React.ReactNode;
  className?: string;
  classNameTrue?: string;
  classNameFalse?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
  label?: string;
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
  disabled,
  ref,
  style,
  label,
  ...props
}: ToggleButtonPropsAsStandalone | ToggleButtonPropsAsChild): React.ReactNode {
  const trueClass = classNameTrue ?? scoutStyles.normalToggleButtonTrue;
  const falseClass = classNameFalse ?? scoutStyles.normalToggleButtonFalse;
  return (
    <Button
      htmlRef={ref}
      style={style}
      className={
        (disabled ?
          styles.buttonDisabled
        : (
          "selected" in props ? props.selected : value
        ) ?
          styles.buttonTrue + " " + trueClass
        : styles.buttonFalse + " " + falseClass) +
        " " +
        (className || "")
      }
      onClick={() => {
        if ("onChange" in props && props.onChange !== undefined) {
          props.onChange(!value);
        } else if ("onClick" in props && props.onClick !== undefined) {
          props.onClick();
        }
      }}
      disabled={disabled}>
      {children || label} {/* Use label as fallback if children is not provided */}
    </Button>
  );
}
