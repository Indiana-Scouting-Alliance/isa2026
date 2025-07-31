import { Button } from "@mui/material";

type AutoReefButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  sx: {
    position: string;
    left?: string;
    top?: string;
    right?: string;
    bottom?: string;
    transform: string;
  };
  coralStates: {
    L4: boolean;
    L3: boolean;
    L2: boolean;
    L1: number;
  };
  selected?: boolean;
};
export default function AutoReefButton({
  onClick,
  sx,
  coralStates,
  selected = false,
}: AutoReefButtonProps) {
  return (
    <Button
      onClick={onClick}
      sx={(theme) => ({
        ...sx,
        color: selected ? "white" : "primary.main",
        background: `linear-gradient(
                      to bottom,
                      ${coralStates.L4 ? theme.palette.primary.main : theme.palette.secondary.main} 25%,
                      ${coralStates.L3 ? theme.palette.primary.main : theme.palette.secondary.main} 25% 50%,
                      ${coralStates.L2 ? theme.palette.primary.main : theme.palette.secondary.main} 50% 75%,
                      #00000000 75%
                    ),
                    linear-gradient(
                      to right,
                      ${coralStates.L1 >= 1 ? theme.palette.primary.main : theme.palette.secondary.main} 16.7%,
                      ${coralStates.L1 >= 2 ? theme.palette.primary.main : theme.palette.secondary.main} 16.7% 33.3%,
                      ${coralStates.L1 >= 3 ? theme.palette.primary.main : theme.palette.secondary.main} 33.3% 50%,
                      ${coralStates.L1 >= 4 ? theme.palette.primary.main : theme.palette.secondary.main} 50% 66.7%,
                      ${coralStates.L1 >= 5 ? theme.palette.primary.main : theme.palette.secondary.main} 66.7% 83.3%,
                      ${coralStates.L1 >= 6 ? theme.palette.primary.main : theme.palette.secondary.main} 83.3%
                    )`,
        border: selected ? "8px solid " + theme.palette.primary.main : "none",
        width: "2em",
        height: "4em",
        [theme.breakpoints.down("md")]: {
          width: "1em",
          height: "2em",
        },
      })}></Button>
  );
}
