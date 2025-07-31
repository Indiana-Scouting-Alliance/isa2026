import { DBEvent, Match } from "@isa2026/api/src/utils/dbtypes.ts";
import { Box } from "@mui/material";
import { useState } from "react";
import Button from "../components/Button/Button.tsx";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../components/Dialog/Dialog.tsx";
import Input from "../components/Input/Input.tsx";
import { trpc } from "../utils/trpc.ts";
import styles from "./EventDialogs.module.css";

type ExportEventProps = {
  exportEvent: boolean;
  setExportEvent: (value: boolean) => void;
  events: (DBEvent & { matches: Match[] })[];
};
export default function ExportEvent({
  exportEvent,
  setExportEvent,
  events,
}: ExportEventProps) {
  const [eventKey, setEventKey] = useState("");
  const [eventKeyError, setEventKeyError] = useState("");

  const [isaStatus, setIsaStatus] = useState("");
  const [localStatus, setLocalStatus] = useState("");

  const checkEventKey = () => {
    let error = false;

    if (eventKey === "") {
      setEventKeyError("Cannot be empty");
      error = true;
    } else {
      setEventKeyError("");
    }

    return error;
  };

  const getEvent = trpc.events.getEvent.useMutation({
    onSuccess(data) {
      let csvContents =
        '"' + data.eventKey + '","' + data.eventName + '",,,,,,\n';
      data.matches.forEach((match) => {
        csvContents +=
          match.matchLevel +
          "," +
          match.matchNumber +
          "," +
          match.red1 +
          "," +
          match.red2 +
          "," +
          match.red3 +
          "," +
          match.blue1 +
          "," +
          match.blue2 +
          "," +
          match.blue3 +
          "\n";
      });

      const a = document.createElement("a");
      a.setAttribute(
        "href",
        URL.createObjectURL(
          new Blob([csvContents], {
            type: "text/csv",
          })
        )
      );
      a.setAttribute("download", data.eventKey + ".csv");
      a.setAttribute("target", "_blank");
      a.click();
      setIsaStatus("Success");
    },
    onError(err) {
      setIsaStatus(err.message);
    },
  });

  return (
    <Dialog
      open={exportEvent}
      onClose={() => {
        setExportEvent(false);
      }}>
      <DialogTitle>Export Event</DialogTitle>
      <DialogContent>
        <div className={styles.contentContainer}>
          <Input
            id="export-event-event-key"
            value={eventKey}
            onChange={(value) => {
              setEventKey(value);
            }}
            label="eventKey"
            error={eventKeyError !== ""}
            helperText={eventKeyError}
          />

          <div className={styles.buttonContainer}>
            <Button
              className={styles.button}
              onClick={() => {
                if (!checkEventKey()) {
                  setIsaStatus("Loading...");
                  getEvent.mutate(eventKey);
                }
              }}>
              ISA
            </Button>
            <Button
              className={styles.button}
              onClick={() => {
                const currentEvent = events.find(
                  (event) => event.eventKey === eventKey
                );

                if (currentEvent) {
                  let csvContents =
                    '"' +
                    currentEvent.eventKey +
                    '","' +
                    currentEvent.eventName +
                    '",,,,,,\n';
                  currentEvent.matches.forEach((match) => {
                    csvContents +=
                      match.matchLevel +
                      "," +
                      match.matchNumber +
                      "," +
                      match.red1 +
                      "," +
                      match.red2 +
                      "," +
                      match.red3 +
                      "," +
                      match.blue1 +
                      "," +
                      match.blue2 +
                      "," +
                      match.blue3 +
                      "\n";
                  });

                  const a = document.createElement("a");
                  a.setAttribute(
                    "href",
                    URL.createObjectURL(
                      new Blob([csvContents], {
                        type: "text/csv",
                      })
                    )
                  );
                  a.setAttribute("download", currentEvent.eventKey + ".csv");
                  a.setAttribute("target", "_blank");
                  a.click();
                  setLocalStatus("Success");
                } else {
                  setLocalStatus("Event not found");
                }
              }}>
              Local
            </Button>
          </div>
          <Box>
            {isaStatus ? "ISA Server: " + isaStatus : ""}
            <br />
            {localStatus ? "Local: " + localStatus : ""}
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          className={styles.actionButton}
          onClick={() => {
            setExportEvent(false);
          }}>
          Cancel
        </Button>
        <Button
          className={styles.actionButton}
          onClick={() => {
            if (!checkEventKey()) {
              setExportEvent(false);
            }
          }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
