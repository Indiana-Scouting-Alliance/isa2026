import { ToggleButton } from "@mui/material";

type TransparentToggleProps = {
  value: boolean;
  setValue: (value: boolean) => void;
  label: string;
  disabled?: boolean;
  error: boolean;
  sx: {
    width?: string;
    height?: string;
    transform?: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
};
export default function TransparentToggle({
  value,
  setValue,
  label,
  disabled,
  error,
  sx,
}: TransparentToggleProps) {
  return (
    <ToggleButton
      value="toggle"
      selected={value}
      onChange={() => {
        setValue(!value);
      }}
      disabled={disabled}
      sx={(theme) => ({
        ...sx,
        position: "absolute",
        color: !error ? theme.palette.secondary.main : theme.palette.error.main,
        backgroundColor: theme.palette.primary.main + "40",
        borderColor:
          !error ? theme.palette.secondary.main : theme.palette.error.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.main + "40",
        },
        padding: 1,
        borderWidth: 2,
        "&.Mui-selected, &.Mui-selected:hover": {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.secondary.main,
        },
      })}>
      {label}
    </ToggleButton>
  );
}
