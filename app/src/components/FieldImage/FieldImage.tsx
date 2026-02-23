import fieldStyles from "./FieldImage.module.css";
import { DeviceSetupObj } from "../../setup/DeviceSetup.tsx";
import type { ReactNode } from "react";

type FieldImageProps = {
  deviceSetup: DeviceSetupObj;
  className?: string;
  children?: ReactNode;
  isZoomed?: boolean;
};

export default function FieldImage({
  deviceSetup,
  className,
  children,
  isZoomed = false,
}: FieldImageProps) {
  const allianceClass = deviceSetup.alliance === "Red" ? fieldStyles.fieldRed : fieldStyles.fieldBlue;
  const mirror = deviceSetup.fieldOrientation === "right" ? fieldStyles.mirror : "";
  const imgZoomClass = isZoomed ? fieldStyles.imgZoomed : "";

  return (
    <div className={fieldStyles.fieldImageContainer}>
      <div className={fieldStyles.fieldImage + " " + mirror}>
        <img
          src={import.meta.env.BASE_URL + "assets/2026Field.png"}
          className={
            (className ?? fieldStyles.fieldImageImg) +
            " " +
            allianceClass +
            " " +
            imgZoomClass
          }
          alt="Field Background"
        />
        <div className={fieldStyles.childrenOverlay}>{children}</div>
      </div>
    </div>
  );
}