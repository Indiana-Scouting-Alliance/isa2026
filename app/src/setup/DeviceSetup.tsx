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
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyledToggleButton } from "../components/StyledToggleButton.tsx";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput.tsx";
import { ScoutPageContainer } from "../scout/ScoutPageContainer.tsx";
import { putDBEvent, putDBMatches } from "../utils/idb.ts";
import { trpc } from "../utils/trpc.ts";
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
            onClick={() => {
              navigate("/");
            }}
            variant="outlined"
            sx={{
              mr: "auto",
            }}>
            Exit
          </Button>
          <Button
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
            }}
            variant="contained">
            Done
          </Button>
        </>
      }>
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          height: "auto",
          width: "100%",
          overflow: "auto",
        }}>
        <Snackbar
          open={status !== ""}
          autoHideDuration={3000}
          onClose={() => {
            setStatus("");
          }}
          message={status}
          action={
            <IconButton
              onClick={() => {
                setStatus("");
              }}>
              <Close
                sx={{
                  color: "#ffffff",
                }}
              />
            </IconButton>
          }
        />
        <Stack
          sx={{
            flex: 1,
            padding: 2,
            overflowY: "scroll",
          }}
          gap={2}>
          <TextField
            value={
              isNaN(deviceSetup.deviceTeamNumber) ? "" : (
                deviceSetup.deviceTeamNumber
              )
            }
            onChange={(event) => {
              setDeviceSetup({
                ...deviceSetup,
                deviceTeamNumber: parseInt(event.currentTarget.value),
              });
            }}
            label="Device Team Number"
            helperText={deviceTeamNumberError || "What team owns this device?"}
            error={deviceTeamNumberError !== ""}
          />
          <TextField
            value={deviceSetup.deviceId}
            onChange={(event) => {
              setDeviceSetup({
                ...deviceSetup,
                deviceId: event.currentTarget.value,
              });
            }}
            type="text"
            label="Device ID"
            helperText={deviceIdError || "Must be unique within each team"}
            error={deviceIdError !== ""}
          />
          <Divider flexItem />
          <Stack
            sx={{
              width: 1,
            }}>
            <FormLabel>Alliance</FormLabel>
            <ToggleButtonGroup
              value={deviceSetup.alliance}
              exclusive
              onChange={(_event, value) => {
                if (value) {
                  setDeviceSetup({
                    ...deviceSetup,
                    alliance: value,
                  });
                }
              }}
              color="primary"
              sx={{
                width: 1,
                borderWidth: allianceError !== "" ? 2 : 0,
                borderColor: "error.main",
                borderStyle: "solid",
              }}>
              <ToggleButton
                value="Red"
                sx={{
                  flex: 1,
                  "&.Mui-selected, &.Mui-selected:hover": {
                    color: "white",
                    backgroundColor: "#ff0000",
                  },
                  "&:hover": {
                    backgroundColor: "#dddddd",
                  },
                  color: "#ff0000",
                  borderColor: "#ff0000",
                  backgroundColor: "white",
                }}>
                Red
              </ToggleButton>
              <ToggleButton
                value="Blue"
                sx={{
                  flex: 1,
                  "&.Mui-selected, &.Mui-selected:hover": {
                    color: "white",
                    backgroundColor: "#0000ff",
                  },
                  "&:hover": {
                    backgroundColor: "#dddddd",
                  },
                  color: "#0000ff",
                  borderColor: "#0000ff",
                  backgroundColor: "white",
                }}>
                Blue
              </ToggleButton>
            </ToggleButtonGroup>
            <FormHelperText
              color="error"
              sx={{
                pl: 2,
                color: "error.main",
              }}>
              {allianceError}
            </FormHelperText>
          </Stack>
          <Stack
            sx={{
              width: 1,
            }}>
            <FormLabel>Robot Number</FormLabel>
            <ToggleButtonGroup
              value={deviceSetup.robotNumber}
              exclusive
              onChange={(_event, value) => {
                if (value) {
                  setDeviceSetup({
                    ...deviceSetup,
                    robotNumber: value,
                  });
                }
              }}
              color="primary"
              sx={{
                width: 1,
                borderWidth: robotNumberError !== "" ? 2 : 0,
                borderColor: "error.main",
                borderStyle: "solid",
              }}>
              <StyledToggleButton
                value={1}
                sx={{
                  flex: 1,
                  padding: 2,
                }}>
                1
              </StyledToggleButton>
              <StyledToggleButton
                value={2}
                sx={{
                  flex: 1,
                  padding: 2,
                }}>
                2
              </StyledToggleButton>
              <StyledToggleButton
                value={3}
                sx={{
                  flex: 1,
                  padding: 2,
                }}>
                3
              </StyledToggleButton>
              <StyledToggleButton
                value={4}
                sx={{
                  flex: 1,
                  padding: 2,
                }}>
                Human
              </StyledToggleButton>
            </ToggleButtonGroup>
            <FormHelperText
              color="error"
              sx={{
                pl: 2,
                color: robotNumberError ? "error.main" : "text.secondary",
              }}>
              {robotNumberError}
            </FormHelperText>
          </Stack>
          <Stack
            sx={{
              width: 1,
            }}>
            <FormLabel>Field Orientation</FormLabel>
            <ToggleButtonGroup
              value={deviceSetup.fieldOrientation}
              exclusive
              onChange={(_event, value) => {
                if (value) {
                  setDeviceSetup({
                    ...deviceSetup,
                    fieldOrientation: value,
                  });
                }
              }}
              color="primary"
              sx={{
                width: 1,
                borderWidth: fieldOrientationError !== "" ? 2 : 0,
                borderColor: "error.main",
                borderStyle: "solid",
              }}>
              <StyledToggleButton
                value="processor"
                sx={{
                  flex: 1,
                }}>
                {deviceSetup.alliance === "Red" ?
                  "Red on Left"
                : "Blue on Left"}
              </StyledToggleButton>
              <StyledToggleButton
                value="barge"
                sx={{
                  flex: 1,
                }}>
                {deviceSetup.alliance === "Red" ?
                  "Red on Right"
                : "Blue on Right"}
              </StyledToggleButton>
            </ToggleButtonGroup>
            <FormHelperText
              color="error"
              sx={{
                pl: 2,
                color: "error.main",
              }}>
              {fieldOrientationError}
            </FormHelperText>
          </Stack>
        </Stack>
        <Divider
          orientation="vertical"
          flexItem
        />
        <Stack
          sx={{
            flex: 1,
            padding: 2,
          }}
          gap={2}>
          <Stack
            direction="row"
            gap={2}>
            <Button
              component="label"
              variant="outlined"
              sx={{
                textAlign: "center",
                flex: 1,
              }}>
              Upload Schedule
              <VisuallyHiddenInput
                type="file"
                accept="text/csv"
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
                multiple
              />
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setDownloadEvent(true);
              }}
              sx={{
                textAlign: "center",
                flex: 1,
              }}>
              Download Schedule
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setExportEvent(true);
              }}>
              <OpenInNew />
            </Button>
          </Stack>
          {
            //TODO: Create/edit event GUI
          }
          <Box
            sx={{
              flex: 1,
              padding: 2,
              borderColor: "error.main",
              borderStyle: "solid",
              borderWidth: currentEventError !== "" ? 2 : 0,
            }}>
            <FormControl error={currentEventError !== ""}>
              <RadioGroup
                value={deviceSetup.currentEvent}
                onChange={(event) => {
                  setDeviceSetup({
                    ...deviceSetup,
                    currentEvent: event.currentTarget.value,
                  });
                }}>
                {events
                  .sort((a, b) => (a.eventKey < b.eventKey ? -1 : 1))
                  .map((event) => (
                    <FormControlLabel
                      key={event.eventKey}
                      value={event.eventKey}
                      control={<Radio />}
                      label={event.eventKey}
                    />
                  ))}
              </RadioGroup>
              <FormHelperText component="div">
                <Typography fontSize="body2">{currentEventError}</Typography>
              </FormHelperText>
            </FormControl>
          </Box>
          <DownloadEvent
            downloadEvent={downloadEvent}
            setDownloadEvent={setDownloadEvent}
            events={events}
            setEvents={setEvents}
          />
          <ExportEvent
            exportEvent={exportEvent}
            setExportEvent={setExportEvent}
            events={events}
          />
          {/* <CreateEvent
            createEvent={createEvent}
            setCreateEvent={setCreateEvent}
            events={events}
            setEvents={setEvents}
          /> */}
        </Stack>
      </Stack>
    </ScoutPageContainer>
  );
}
