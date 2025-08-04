import React, { useState } from "react";
import BackdropComponent from "../../BackdropComponent.tsx";
import Button from "../../Button/Button.tsx";
import HelpDialog from "../../Dialog/HelpDialog/HelpDialog.tsx";
import GridBorder from "../GridBorder/GridBorder.tsx";
import styles from "./ScoutPageContainer.module.css";

type ScoutPageContainerProps = {
  title: string | React.ReactNode;
  nowScouting?: {
    teamNumber: number;
    alliance: "Red" | "Blue";
    robotPosition: 1 | 2 | 3 | 4;
  };
  navButtons?: React.ReactNode;
  backdrop?: boolean;
  onCloseBackdrop?: () => void;
  children?: React.ReactNode;
};
export default function ScoutPageContainer({
  title,
  nowScouting,
  navButtons,
  backdrop = false,
  onCloseBackdrop,
  children,
}: ScoutPageContainerProps) {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <GridBorder
      backdrop={backdrop}
      onCloseBackdrop={onCloseBackdrop}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          {typeof title === "string" ?
            <h2 className={styles.title}>{title.toUpperCase()}</h2>
          : title}
          {nowScouting && (
            <Button
              className={
                styles.nowScouting +
                " " +
                (nowScouting.alliance === "Red" ?
                  styles.nowScoutingRed
                : styles.nowScoutingBlue)
              }
              onClick={() => {
                setHelpOpen(true);
              }}>
              {nowScouting.teamNumber +
                "\u00a0/\u00a0" +
                nowScouting.alliance.toUpperCase() +
                "\u00a0" +
                (nowScouting.robotPosition === 4 ?
                  "HUMAN"
                : nowScouting.robotPosition)}
            </Button>
          )}
        </div>
        <div className={styles.contentContainer}>
          {children}
          <BackdropComponent
            open={backdrop}
            onClose={onCloseBackdrop}
          />
        </div>
        {navButtons && (
          <div className={styles.navContainer}>
            {navButtons}
            <BackdropComponent
              open={backdrop}
              onClose={onCloseBackdrop}
            />
          </div>
        )}
      </div>
      <HelpDialog
        open={helpOpen}
        onClose={() => {
          setHelpOpen(false);
        }}
      />
    </GridBorder>
  );
}
