import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

type HelpDialogProps = {
  open: boolean;
  onClose: () => void;
};
export default function HelpDialog({ open, onClose }: HelpDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#89cff0",
          },
        },
      }}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        Help
        <IconButton
          onClick={onClose}
          size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack
          sx={{
            width: 1,
            height: 1,
          }}>
          <Stack
            direction="row"
            sx={{
              marginBottom: "1em",
            }}>
            <Typography
              fontWeight="bold"
              sx={{
                width: "50%",
                marginRight: "7rem",
              }}>
              SHALLOW VS DEEP CLIMB
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{
                width: "30%",
              }}>
              CROSSED ROBOT STARTING LINE?
            </Typography>
          </Stack>
          <Stack
            direction="row"
            sx={{
              width: 1,
            }}>
            <Box
              sx={{
                width: "50%",
                marginBottom: "1rem",
                marginRight: "7rem",
              }}>
              <img
                src={import.meta.env.BASE_URL + "assets/cageshelp.png"}
                alt="Cages Example"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
            <Box
              sx={{
                width: "30%",
              }}>
              <img
                src={import.meta.env.BASE_URL + "assets/linecrosshelp.png"}
                alt="Line Cross Example"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
