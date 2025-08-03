import { Add, Remove } from "@mui/icons-material";
import { IconButton, Stack, SxProps, TextField } from "@mui/material";

type SmallCounterProps = {
  value: number;
  setValue: (value: number) => void;
  max?: number;
  sx?: SxProps;
};
export default function SmallCounter({
  value,
  setValue,
  max,
  sx,
}: SmallCounterProps) {
  const buttonSx: SxProps = {
    color: "primary.contrastText",
    backgroundColor: "primary.main",
    borderRadius: 2,
    pl: 0,
    pr: 0,
    "&:hover": {
      backgroundColor: "primary.main",
    },
  };

  return (
    <Stack sx={sx}>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
        }}>
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            if (value > 0) {
              setValue(value - 1);
            }
          }}
          sx={buttonSx}>
          <Remove />
        </IconButton>
        <TextField
          value={"L1 - " + value}
          size="small"
          sx={(theme) => ({
            color: "secondary.contrastText",
            backgroundColor: "secondary.main",
            width: "4em",
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: theme.palette.text.primary,
              color: theme.palette.text.primary,
            },
          })}
          slotProps={{
            htmlInput: {
              sx: {
                padding: "2px",
              },
            },
          }}
          disabled
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            if (max === undefined || value < max) {
              console.log(max);
              setValue(value + 1);
            }
          }}
          sx={buttonSx}>
          <Add />
        </IconButton>
      </Stack>
    </Stack>
  );
}
