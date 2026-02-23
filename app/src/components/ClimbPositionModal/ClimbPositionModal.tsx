import { TeamMatchEntry } from "@isa2026/api/src/utils/dbtypes.ts";
import TransparentToggle from "../Button/ToggleButton/TransparentToggle/TransparentToggle.tsx";
import Dialog, { DialogTitle } from "../Dialog/Dialog.tsx";
import { DeviceSetupObj } from "../../setup/DeviceSetup.tsx";
import styles from "./ClimbPositionModal.module.css";
import FieldImage from "../FieldImage/FieldImage.tsx";

type ClimbPositionModalProps = {
  open: boolean;
  onClose: () => void;
  value: TeamMatchEntry["autoClimbPosition"];
  onChange: (value: TeamMatchEntry["autoClimbPosition"]) => void;
  deviceSetup: DeviceSetupObj;
};

export default function ClimbPositionModal({
  open,
  onClose,
  value,
  onChange,
  deviceSetup,
}: ClimbPositionModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className={styles.modal}>
      <DialogTitle>CLIMB POSITION:</DialogTitle>
      <FieldImage deviceSetup={deviceSetup} isZoomed={true}>
        {([
          { key: "depot", className: "climbPosDepot", label: "Depot" },
          { key: "other", className: "climbPosOther", label: "Other" },
          { key: "center", className: "climbPosCenter", label: "Center" },
          { key: "outpost", className: "climbPosOutpost", label: "Outpost" },
        ] as const).map(({ key, className, label }) => (
          <TransparentToggle
            key={key}
            value={value === key}
            setValue={() => { onChange(value === key ? null : key); onClose(); }}
            error={false}
            className={styles[className]}
            label={label}
          />
        ))}
      </FieldImage>
    </Dialog>
  );
}
