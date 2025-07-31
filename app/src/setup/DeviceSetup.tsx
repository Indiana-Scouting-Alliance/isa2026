import { MAX_TEAM_NUMBER } from "@isa2026/api/src/utils/constants.ts";
import {
  Alliance,
  DBEvent,
  Match,
  MatchLevel,
  TeamMatchEntry,
} from "@isa2026/api/src/utils/dbtypes.ts";
import { omit } from "@isa2026/api/src/utils/utils.ts";
import { Close, OpenInNew } from "@mui/icons-material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button.tsx";
import IconButton from "../components/Button/IconButton/IconButton.tsx";
import ToggleButton from "../components/Button/ToggleButton/ToggleButton.tsx";
import ToggleButtonGroup from "../components/Button/ToggleButton/ToggleButtonGroup.tsx";
import changeFlexDirection from "../components/ChangeFlexDirection.module.css";
import Divider from "../components/Divider/Divider.tsx";
import Input from "../components/Input/Input.tsx";
import Radio from "../components/Input/Radio/Radio.tsx";
import RadioGroup from "../components/Input/Radio/RadioGroup.tsx";
import ScoutPageContainer from "../components/PageContainer/ScoutPageContainer/ScoutPageContainer.tsx";
import Snackbar from "../components/Snackbar/Snackbar.tsx";
import { putDBEvent, putDBMatches } from "../utils/idb.ts";
import { trpc } from "../utils/trpc.ts";
import styles from "./DeviceSetup.module.css";
import DownloadEvent from "./DownloadEvent.tsx";
import ExportEvent from "./ExportEvent.tsx";

export type DeviceSetupObj = {
  deviceTeamNumber: number;
  deviceId: string;
  alliance: TeamMatchEntry["alliance"];
  robotNumber: number;
  currentEvent: string;
  fieldOrientation: "barge" | "processor";
};
type DeviceSetupProps = {
  deviceSetup: DeviceSetupObj;
  setDeviceSetup: (value: DeviceSetupObj) => void;
  events: (DBEvent & { matches: Match[] })[];
  setEvents: (value: (DBEvent & { matches: Match[] })[]) => void;
};
export default function DeviceSetup({
  deviceSetup,
  setDeviceSetup,
  events,
  setEvents,
}: DeviceSetupProps) {
  const navigate = useNavigate();

  const scheduleUploadRef = useRef<HTMLInputElement>(null);

  const [deviceTeamNumberError, setDeviceTeamNumberError] = useState("");
  const [deviceIdError, setDeviceIdError] = useState("");
  const [allianceError, setAllianceError] = useState("");
  const [robotNumberError, setRobotNumberError] = useState("");
  const [fieldOrientationError, setFieldOrientationError] = useState("");
  const [currentEventError, setCurrentEventError] = useState("");

  // const [createEvent, setCreateEvent] = useState(false);
  // const openCreateEvent = () => {
  //   setCreateEvent(true);
  // };

  // const putEvents = trpc.events.putEvents.useMutation();

  const [downloadEvent, setDownloadEvent] = useState(false);
  const [exportEvent, setExportEvent] = useState(false);

  const [status, setStatus] = useState("");

  const putEvents = trpc.events.putEvents.useMutation({
    onSuccess() {
      setStatus("Upload success");
    },
    onError() {
      setStatus("Upload error (see console)");
    },
  });

  return (
    <ScoutPageContainer
      title="Device Setup"
      navButtons={
        <>
          <Button
            className={styles.exitButton}
            onClick={() => {
              navigate("/");
            }}>
            Exit
          </Button>
          <Button
            className={styles.doneButton}
            onClick={() => {
              let error = false;

              if (!Number.isInteger(deviceSetup.deviceTeamNumber)) {
                setDeviceTeamNumberError("Must be an integer");
                error = true;
              } else if (deviceSetup.deviceTeamNumber <= 0) {
                setDeviceTeamNumberError("Must be greater than 0");
                error = true;
              } else if (deviceSetup.deviceTeamNumber > MAX_TEAM_NUMBER) {
                setDeviceTeamNumberError("Team number too high");
                error = true;
              } else {
                setDeviceTeamNumberError("");
              }

              if (deviceSetup.deviceId === "") {
                setDeviceIdError("Cannot be empty");
                error = true;
              } else {
                setDeviceIdError("");
              }

              if (!Alliance.includes(deviceSetup.alliance)) {
                setAllianceError("Must be 'Red' or 'Blue'");
                error = true;
              } else {
                setAllianceError("");
              }

              if (
                deviceSetup.robotNumber !== 1 &&
                deviceSetup.robotNumber !== 2 &&
                deviceSetup.robotNumber !== 3 &&
                deviceSetup.robotNumber !== 4
              ) {
                setRobotNumberError("Must be 1, 2, 3, or 4");
                error = true;
              } else {
                setRobotNumberError("");
              }

              if (deviceSetup.currentEvent === "") {
                setCurrentEventError("Please select an event");
                error = true;
              } else {
                setCurrentEventError("");
              }

              if (
                deviceSetup.fieldOrientation !== "barge" &&
                deviceSetup.fieldOrientation !== "processor"
              ) {
                setFieldOrientationError("Must be 'barge' or 'processor'");
                error = true;
              } else {
                setFieldOrientationError("");
              }

              if (!error) {
                navigate("/scout");
              }
            }}>
            Done
          </Button>
        </>
      }>
      <div
        className={
          styles.contentContainer +
          " " +
          changeFlexDirection.changeFlexDirection
        }>
        <Snackbar
          open={status !== ""}
          autoHideDuration={3000}
          onClose={() => {
            setStatus("");
          }}
          message={status}
          action={
            <IconButton
              className={styles.snackbarClose}
              onClick={() => {
                setStatus("");
              }}>
              <Close />
            </IconButton>
          }
        />
        <div className={styles.deviceInfoContainer}>
          <Input
            id="device-team-number"
            type="number"
            value={
              isNaN(deviceSetup.deviceTeamNumber) ? "" : (
                deviceSetup.deviceTeamNumber
              )
            }
            onChange={(value) => {
              setDeviceSetup({
                ...deviceSetup,
                deviceTeamNumber: parseInt(value),
              });
            }}
            label="Device Team Number"
            helperText={deviceTeamNumberError || "What team owns this device?"}
            error={deviceTeamNumberError !== ""}
          />
          <Input
            id="device-id"
            value={deviceSetup.deviceId}
            onChange={(value) => {
              setDeviceSetup({
                ...deviceSetup,
                deviceId: value,
              });
            }}
            type="text"
            label="Device ID"
            helperText={deviceIdError || "Must be unique within each team"}
            error={deviceIdError !== ""}
          />
          <Divider orientation="horizontal" />
          <ToggleButtonGroup
            className={styles.toggleButtonGroup}
            value={deviceSetup.alliance}
            label="Alliance"
            onChange={(value) => {
              if (value) {
                setDeviceSetup({
                  ...deviceSetup,
                  alliance: value as TeamMatchEntry["alliance"],
                });
              }
            }}
            error={allianceError !== ""}
            helperText={allianceError}>
            <ToggleButton
              value="Red"
              className={styles.toggleButton}
              classNameTrue={styles.redToggleButtonTrue}
              classNameFalse={styles.redToggleButtonFalse}>
              Red
            </ToggleButton>
            <ToggleButton
              value="Blue"
              className={styles.toggleButton}
              classNameTrue={styles.blueToggleButtonTrue}
              classNameFalse={styles.blueToggleButtonFalse}>
              Blue
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            className={styles.toggleButtonGroup}
            value={deviceSetup.robotNumber.toString()}
            onChange={(value) => {
              if (value) {
                setDeviceSetup({
                  ...deviceSetup,
                  robotNumber: parseInt(value),
                });
              }
            }}
            label="Robot Number"
            error={robotNumberError !== ""}
            helperText={robotNumberError}>
            <ToggleButton
              value="1"
              className={styles.toggleButton}>
              1
            </ToggleButton>
            <ToggleButton
              value="2"
              className={styles.toggleButton}>
              2
            </ToggleButton>
            <ToggleButton
              value="3"
              className={styles.toggleButton}>
              3
            </ToggleButton>
            <ToggleButton
              value="4"
              className={styles.toggleButton}>
              Human
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            value={deviceSetup.fieldOrientation}
            onChange={(value) => {
              if (value) {
                setDeviceSetup({
                  ...deviceSetup,
                  fieldOrientation: value as DeviceSetupObj["fieldOrientation"],
                });
              }
            }}
            error={fieldOrientationError !== ""}
            helperText={fieldOrientationError}
            className={styles.toggleButtonGroup}
            label="Field Orientation">
            <ToggleButton
              value="processor"
              className={styles.toggleButton}>
              {deviceSetup.alliance === "Red" ? "Red on Left" : "Blue on Left"}
            </ToggleButton>
            <ToggleButton
              value="barge"
              className={styles.toggleButton}>
              {deviceSetup.alliance === "Red" ?
                "Red on Right"
              : "Blue on Right"}
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <Divider orientation="vertical" />
        <div className={styles.scheduleContainer}>
          <div className={styles.scheduleButtonsContainer}>
            <Button
              className={
                styles.scheduleButton + " " + styles.scheduleTextButton
              }
              onClick={() => {
                scheduleUploadRef.current?.click();
              }}>
              Upload Schedule
              <input
                ref={scheduleUploadRef}
                type="file"
                accept="text/csv"
                multiple
                onChange={async (event) => {
                  try {
                    if (event.currentTarget.files) {
                      for (const file of event.currentTarget.files) {
                        const schedule = (await file.text())
                          .split("\n")
                          .filter((x) => x !== "")
                          .map((x) => x.split(","));
                        console.log(schedule);

                        if (
                          schedule.length < 2 ||
                          schedule.some(
                            (x, index) =>
                              (index === 0 ? x.length < 2 : x.length < 8) ||
                              (index !== 0 &&
                                !(MatchLevel as readonly string[]).includes(
                                  x[0]
                                ))
                          )
                        ) {
                          setStatus("Error: Invalid schedule");
                          return;
                        }

                        const newEvent: DBEvent & { matches: Match[] } = {
                          eventKey: schedule[0][0],
                          eventName: schedule[0][1] ?? schedule[0][0],
                          matches: schedule.slice(1).map((x) => ({
                            eventKey: schedule[0][0],
                            eventName: schedule[0][1] ?? schedule[0][0],
                            matchLevel: x[0] as (typeof MatchLevel)[number],
                            matchNumber: parseInt(x[1]),
                            red1: parseInt(x[2]),
                            red2: parseInt(x[3]),
                            red3: parseInt(x[4]),
                            blue1: parseInt(x[5]),
                            blue2: parseInt(x[6]),
                            blue3: parseInt(x[7]),
                          })),
                        };

                        setEvents([
                          ...events.filter(
                            (event) => event.eventKey !== newEvent.eventKey
                          ),
                          newEvent,
                        ]);
                        putDBEvent(omit(["matches"], newEvent) as DBEvent);
                        putDBMatches(newEvent.matches);
                        putEvents.mutate([newEvent]);
                      }
                    }
                  } catch (error) {
                    console.log(error);
                    setStatus("Error (see console)");
                  }
                }}
                hidden
              />
            </Button>
            <Button
              className={
                styles.scheduleButton + " " + styles.scheduleTextButton
              }
              onClick={() => {
                setDownloadEvent(true);
              }}>
              Download Schedule
            </Button>
            <Button
              className={styles.scheduleButton}
              onClick={() => {
                setExportEvent(true);
              }}>
              <OpenInNew />
            </Button>
          </div>
          {
            //TODO: Create/edit event GUI
          }
          <div
            className={
              styles.eventsContainer +
              " " +
              (currentEventError !== "" ? styles.eventsContainerError : "")
            }>
            <RadioGroup
              label="Current Event"
              value={deviceSetup.currentEvent}
              onChange={(value) => {
                setDeviceSetup({
                  ...deviceSetup,
                  currentEvent: value,
                });
              }}
              name="current-event"
              error={currentEventError !== ""}
              helperText={currentEventError}>
              {events
                .sort((a, b) => (a.eventKey < b.eventKey ? -1 : 1))
                .map((event) => (
                  <Radio
                    id={"event-radio-" + event.eventKey}
                    value={event.eventKey}
                    label={event.eventKey.slice(0, 4) + " " + event.eventName}
                  />
                ))}
            </RadioGroup>
          </div>
          <DownloadEvent
            downloadEvent={downloadEvent}
            setDownloadEvent={setDownloadEvent}
            events={events}
            setEvents={setEvents}
            setCurrentEvent={(value) => {
              setDeviceSetup({
                ...deviceSetup,
                currentEvent: value,
              });
            }}
          />
          <ExportEvent
            exportEvent={exportEvent}
            setExportEvent={setExportEvent}
            events={events}
          />
        </div>
      </div>
    </ScoutPageContainer>
  );
}
