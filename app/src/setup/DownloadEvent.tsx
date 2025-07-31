import { DBEvent, Match } from "@isa2026/api/src/utils/dbtypes.ts";
import { omit } from "@isa2026/api/src/utils/utils.ts";
import { useState } from "react";
import Button from "../components/Button/Button.tsx";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../components/Dialog/Dialog.tsx";
import Input from "../components/Input/Input.tsx";
import { putDBEvent, putDBMatches } from "../utils/idb.ts";
import { trpc } from "../utils/trpc.ts";
import styles from "./EventDialogs.module.css";

type DownloadEventProps = {
  downloadEvent: boolean;
  setDownloadEvent: (value: boolean) => void;
  events: (DBEvent & { matches: Match[] })[];
  setEvents: (value: (DBEvent & { matches: Match[] })[]) => void;
  setCurrentEvent: (value: string) => void;
};
export default function DownloadEvent({
  downloadEvent,
  setDownloadEvent,
  events,
  setEvents,
  setCurrentEvent,
}: DownloadEventProps) {
  const [eventKey, setEventKey] = useState("");
  const [eventKeyError, setEventKeyError] = useState("");

  const [frcStatus, setFrcStatus] = useState("");
  const [isaStatus, setIsaStatus] = useState("");
  const [tbaStatus, setTbaStatus] = useState("");

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
      setIsaStatus("Success");

      setEvents([...events.filter((x) => x.eventKey !== data.eventKey), data]);

      putDBEvent(omit(["matches"], data) as DBEvent);
      putDBMatches(data.matches);

      setCurrentEvent(data.eventKey);
    },
    onError(err) {
      setIsaStatus(err.message);
    },
  });
  const getFrcEvent = trpc.events.getFrcEvent.useMutation({
    onSuccess(data) {
      setFrcStatus("Success");

      setEvents([...events.filter((x) => x.eventKey !== data.eventKey), data]);

      putDBEvent(omit(["matches"], data) as DBEvent);
      putDBMatches(data.matches);

      setCurrentEvent(data.eventKey);
    },
    onError(err) {
      setFrcStatus(err.message);
    },
  });
  const getTbaEvent = trpc.events.getTbaEvent.useMutation({
    onSuccess(data) {
      setTbaStatus("Success");

      setEvents([...events.filter((x) => x.eventKey !== data.eventKey), data]);

      putDBEvent(omit(["matches"], data) as DBEvent);
      putDBMatches(data.matches);

      setCurrentEvent(data.eventKey);
    },
    onError(err) {
      setTbaStatus(err.message);
    },
  });

  return (
    <Dialog
      open={downloadEvent}
      onClose={() => {
        setDownloadEvent(false);
      }}>
      <DialogTitle>Download Event</DialogTitle>
      <DialogContent>
        <div className={styles.contentContainer}>
          <Input
            id="download-event-event-key"
            value={eventKey}
            onChange={(value) => {
              setEventKey(value);
            }}
            label="Event Key"
            error={eventKeyError !== ""}
            helperText={eventKeyError}
          />
          <div className={styles.buttonContainer}>
            <Button
              className={styles.button}
              onClick={() => {
                if (!checkEventKey()) {
                  setFrcStatus("Loading...");
                  getFrcEvent.mutate(eventKey);
                }
              }}>
              FRC
            </Button>
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
                if (!checkEventKey()) {
                  setTbaStatus("Loading...");
                  getTbaEvent.mutate(eventKey);
                }
              }}>
              TBA
            </Button>
          </div>
          <div className={styles.statusContainer}>
            {frcStatus ? "FRC Events API: " + frcStatus : ""}
            <br />
            {isaStatus ? "ISA Server: " + isaStatus : ""}
            <br />
            {tbaStatus ? "TBA API: " + tbaStatus : ""}
            <br />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          className={styles.actionButton}
          onClick={() => {
            setDownloadEvent(false);
          }}>
          Cancel
        </Button>
        <Button
          className={styles.actionButton}
          onClick={() => {
            if (!checkEventKey()) {
              setDownloadEvent(false);
            }
          }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
