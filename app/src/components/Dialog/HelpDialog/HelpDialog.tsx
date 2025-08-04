import { Close } from "@mui/icons-material";
import IconButton from "../../Button/IconButton/IconButton.tsx";
import Dialog, { DialogContent, DialogTitle } from "../Dialog.tsx";
import styles from "./HelpDialog.module.css";

type HelpDialogProps = {
  open: boolean;
  onClose: () => void;
};
export default function HelpDialog({ open, onClose }: HelpDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={styles.dialog}>
      <DialogTitle className={styles.dialogTitle}>
        Help
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className={styles.contentContainer}>
          <div className={styles.climbs}>
            <p className={styles.label}>SHALLOW VS DEEP CLIMB</p>
            <div className={styles.cagesContainer}>
              <img
                src={import.meta.env.BASE_URL + "assets/cageshelp.png"}
                alt="Cages Example"
                className={styles.image}
              />
            </div>
          </div>
          <div className={styles.startingLine}>
            <p className={styles.label}>CROSSED ROBOT STARTING LINE?</p>
            <div className={styles.lineCrossContainer}>
              <img
                src={import.meta.env.BASE_URL + "assets/linecrosshelp.png"}
                alt="Line Cross Example"
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
