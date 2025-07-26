import { DBEvent, Match } from "@isa2026/api/src/utils/dbtypes.ts";
import EventEmitter from "events";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReloadPrompt from "./reloadprompt/ReloadPrompt.tsx";
import { DeviceSetupObj } from "./setup/DeviceSetup.tsx";
import { getDBEvents, getDBMatches, initDB } from "./utils/idb.ts";

const LandingPage = React.lazy(() => import("./LandingPage.tsx"));
const Data = React.lazy(() => import("./data/Data.tsx"));
const Scout = React.lazy(() => import("./scout/Scout.tsx"));
const DeviceSetup = React.lazy(() => import("./setup/DeviceSetup.tsx"));

export default function App() {
  const eventEmitter = useMemo(() => new EventEmitter(), []);
  useEffect(() => {
    eventEmitter.setMaxListeners(1);
  }, [eventEmitter]);

  const [deviceSetup, setDeviceSetupState] = useState<DeviceSetupObj>(
    (): DeviceSetupObj => {
      if (localStorage.getItem("deviceSetup") !== null) {
        return JSON.parse(localStorage.getItem("deviceSetup")!);
      }
      localStorage.setItem(
        "deviceSetup",
        JSON.stringify({
          deviceTeamNumber: 0,
          deviceId: "",
          alliance: "Red",
          robotNumber: 1,
          currentEvent: "",
          fieldOrientation: "processor",
        } as DeviceSetupObj)
      );
      return {
        deviceTeamNumber: 0,
        deviceId: "",
        alliance: "Red",
        robotNumber: 1,
        currentEvent: "",
        fieldOrientation: "processor",
      };
    }
  );
  const setDeviceSetup = async (value: DeviceSetupObj) => {
    setDeviceSetupState(value);
    localStorage.setItem("deviceSetup", JSON.stringify(value));
  };

  const [events, setEvents] = useState<(DBEvent & { matches: Match[] })[]>([]);
  useEffect(() => {
    (async () => {
      await initDB();

      const idbEvents: DBEvent[] = await getDBEvents();
      const res: (DBEvent & { matches: Match[] })[] = idbEvents.map(
        (event) => ({
          ...event,
          matches: [],
        })
      );

      const idbMatches: Match[] = await getDBMatches();
      idbMatches.forEach((match) => {
        res
          .find((event) => event.eventKey === match.eventKey)
          ?.matches.push(match);
      });

      setEvents(res);
      eventEmitter.emit("idb-finished", res);
    })();
  }, [eventEmitter]);

  return (
    <>
      <BrowserRouter basename="/">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={<LandingPage />}
            />
            <Route
              path="/data/*"
              element={<Data />}
            />
            <Route
              path="/scout/*"
              element={
                <Scout
                  deviceSetup={deviceSetup}
                  events={events}
                  eventEmitter={eventEmitter}
                />
              }
            />
            <Route
              path="/setup"
              element={
                <DeviceSetup
                  deviceSetup={deviceSetup}
                  setDeviceSetup={setDeviceSetup}
                  events={events}
                  setEvents={setEvents}
                />
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ReloadPrompt />
    </>
  );
}
