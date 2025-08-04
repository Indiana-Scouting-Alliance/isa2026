import Button from "../../Button.tsx";
import styles from "./AutoReefButton.module.css";

type AutoReefButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  coralStates: {
    L4: boolean;
    L3: boolean;
    L2: boolean;
    L1: number;
  };
  selected?: boolean;
  className?: string;
};
export default function AutoReefButton({
  onClick,
  coralStates,
  selected = false,
  className,
}: AutoReefButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={
        styles.button +
        " " +
        (className || "") +
        " " +
        (selected ? styles.buttonSelected : "")
      }
      style={{
        background: `linear-gradient(
          to bottom,
          var(${coralStates.L4 ? "--color-primary" : "--color-secondary"}) 25%,
          var(${coralStates.L3 ? "--color-primary" : "--color-secondary"}) 25% 50%,
          var(${coralStates.L2 ? "--color-primary" : "--color-secondary"}) 50% 75%,
          #00000000 75%
        ),
        linear-gradient(
          to right,
          var(${coralStates.L1 >= 1 ? "--color-primary" : "--color-secondary"}) 16.7%,
          var(${coralStates.L1 >= 2 ? "--color-primary" : "--color-secondary"}) 16.7% 33.3%,
          var(${coralStates.L1 >= 3 ? "--color-primary" : "--color-secondary"}) 33.3% 50%,
          var(${coralStates.L1 >= 4 ? "--color-primary" : "--color-secondary"}) 50% 66.7%,
          var(${coralStates.L1 >= 5 ? "--color-primary" : "--color-secondary"}) 66.7% 83.3%,
          var(${coralStates.L1 >= 6 ? "--color-primary" : "--color-secondary"}) 83.3%
        )`,
      }}></Button>
  );
}
