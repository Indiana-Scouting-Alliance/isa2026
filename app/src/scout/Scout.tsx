import { MAX_TEAM_NUMBER } from "@isa2026/api/src/utils/constants.ts";
import {
  Alliance,
  DBEvent,
  Match,
  TeamMatchEntry,
  TeamMatchEntryInit,
} from "@isa2026/api/src/utils/dbtypes.ts";
import EventEmitter from "events";
import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { DeviceSetupObj } from "../setup/DeviceSetup.tsx";

const ScoutLayout = React.lazy(() => import("./ScoutLayout.tsx"));
const SavedMatches = React.lazy(
  () => import("./savedmatches/SavedMatches.tsx")
);

type ScoutProps = {
  deviceSetup: DeviceSetupObj;
  events: (DBEvent & { matches: Match[] })[];
  eventEmitter: EventEmitter;
};
export default function Scout({
  deviceSetup,
  events,
  eventEmitter,
}: ScoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [validDeviceSetup, setValidDeviceSetup] = useState(true);
  useEffect(() => {
    if (
      (deviceSetup.fieldOrientation !== "processor" &&
        deviceSetup.fieldOrientation !== "barge") ||
      !deviceSetup.currentEvent ||
      !Number.isInteger(deviceSetup.deviceTeamNumber) ||
      !deviceSetup.deviceTeamNumber ||
      deviceSetup.deviceTeamNumber < 1 ||
      deviceSetup.deviceTeamNumber > MAX_TEAM_NUMBER ||
      !deviceSetup.deviceId ||
      !Alliance.includes(deviceSetup.alliance) ||
      (deviceSetup.robotNumber !== 1 &&
        deviceSetup.robotNumber !== 2 &&
        deviceSetup.robotNumber !== 3 &&
        deviceSetup.robotNumber !== 4)
    ) {
      setValidDeviceSetup(false);
      if (location.pathname !== "/scout/savedmatches") {
        navigate("/setup");
      }
    }
  }, [deviceSetup, location.pathname, navigate]);

  const [match, setMatch] = useState<TeamMatchEntry>(() => {
      const newMatch: TeamMatchEntry = {
        ...TeamMatchEntryInit,
        eventKey: deviceSetup.currentEvent,
        alliance: deviceSetup.alliance,
        robotNumber: deviceSetup.robotNumber as 1 | 2 | 3,
        deviceTeamNumber: deviceSetup.deviceTeamNumber,
        deviceId: deviceSetup.deviceId,
      };

      const eventMatches = events.find(
        (event) => event.eventKey === deviceSetup.currentEvent
      )?.matches;
      if (
        eventMatches?.some(
          (x) =>
            x.matchLevel === TeamMatchEntryInit.matchLevel &&
            x.matchNumber === TeamMatchEntryInit.matchNumber
        )
      ) {
        return {
          ...newMatch,
          teamNumber: eventMatches.find(
            (x) =>
              x.matchLevel === TeamMatchEntryInit.matchLevel &&
              x.matchNumber === TeamMatchEntryInit.matchNumber
          )![
            (deviceSetup.alliance.toLowerCase() + deviceSetup.robotNumber) as
              | "red1"
              | "red2"
              | "red3"
              | "blue1"
              | "blue2"
              | "blue3"
          ],
        };
      } else {
        return newMatch;
      }
  });
  useEffect(() => {
    if (eventEmitter.listenerCount("idb-finished") === 0) {
      eventEmitter.on(
        "idb-finished",
        (eventsFromIdb: (DBEvent & { matches: Match[] })[]) => {
          const eventMatches = eventsFromIdb.find(
            (event) => event.eventKey === match.eventKey
          )?.matches;
          if (
            eventMatches?.some(
              (x) =>
                x.matchLevel === match.matchLevel &&
                x.matchNumber === match.matchNumber
            )
          ) {
            setMatch({
              ...match,
              teamNumber: eventMatches.find(
                (x) =>
                  x.matchLevel === match.matchLevel &&
                  x.matchNumber === match.matchNumber
              )![
                (match.alliance.toLowerCase() + match.robotNumber) as
                  | "red1"
                  | "red2"
                  | "red3"
                  | "blue1"
                  | "blue2"
                  | "blue3"
              ],
            });
          }
        }
      );
    }
  }, [eventEmitter, match]);

  const [putEntriesPending, setPutEntriesPending] = useState(false);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={
            <ScoutLayout
              match={match}
              setMatch={setMatch}
              events={events}
              deviceSetup={deviceSetup}
              putEntriesPending={putEntriesPending}
              setPutEntriesPending={setPutEntriesPending}
              eventEmitter={eventEmitter}
            />
          }
        />
        <Route
          path="savedmatches"
          element={
            <SavedMatches
              match={match}
              setMatch={setMatch}
              events={events}
              validDeviceSetup={validDeviceSetup}
            />
          }
        />
      </Routes>
    </Suspense>
  );
}
