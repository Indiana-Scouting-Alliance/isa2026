import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import BackdropComponent from "../../BackdropComponent.tsx";
import HelpDialog from "../../HelpDialog.tsx";
import { GridBorder } from "../GridBorder/GridBorder.tsx";

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
export function ScoutPageContainer({
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
      <Stack
        sx={{
          width: 1,
          height: 1,
        }}>
        <Stack
          sx={{
            width: 1,
            padding: 2,
            overflowX: "scroll",
          }}
          direction="row">
          {typeof title === "string" ?
            <Typography
              variant="h2"
              fontWeight="bold">
              {title.toUpperCase()}
            </Typography>
          : title}
          {nowScouting && (
            <Button
              sx={{
                backgroundColor:
                  nowScouting.alliance === "Blue" ? "#0000ff" : "#ff0000",
                color: "white",
                ml: "auto",
                fontSize: "large",
                height: 1,
                width: "max-content",
              }}
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
        </Stack>
        <Box
          sx={{
            width: 1,
            flex: 1,
            overflowY: "scroll",
            position: "relative",
          }}>
          {children}
          <BackdropComponent
            open={backdrop}
            onClose={onCloseBackdrop}
          />
        </Box>
        {navButtons && (
          <Stack
            sx={{
              padding: 4,
              justifyContent: "right",
              position: "relative",
            }}
            direction="row"
            gap={3}>
            {navButtons}
            <BackdropComponent
              open={backdrop}
              onClose={onCloseBackdrop}
            />
          </Stack>
        )}
      </Stack>
      <HelpDialog
        open={helpOpen}
        onClose={() => {
          setHelpOpen(false);
        }}
      />
    </GridBorder>
  );
}
