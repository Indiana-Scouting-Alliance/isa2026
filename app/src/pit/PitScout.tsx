import { MAX_TEAM_NUMBER } from "@isa2026/api/src/utils/constants.ts";
import {
    PitScoutEntry,
    PitScoutEntryInit,
} from "@isa2026/api/src/utils/dbtypes.ts";
import React, { Suspense, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { DeviceSetupObj } from "../setup/DeviceSetup.tsx";

const PitScoutLayout = React.lazy(() => import("./PitScoutLayout.tsx"));
const SavedPitEntries = React.lazy(() => import("./SavedPitEntries.tsx"));

type PitScoutProps = {
  deviceSetup: DeviceSetupObj;
};
export default function PitScout({ deviceSetup }: PitScoutProps) {
  const navigate = useNavigate();
  const [validDeviceSetup] = useState(() => {
    if (
      !deviceSetup.currentEvent ||
      !Number.isInteger(deviceSetup.deviceTeamNumber) ||
      !deviceSetup.deviceTeamNumber ||
      deviceSetup.deviceTeamNumber < 1 ||
      deviceSetup.deviceTeamNumber > MAX_TEAM_NUMBER ||
      !deviceSetup.deviceId
    ) {
      navigate("/setup");
      return false;
    }
    return true;
  });

  const [entry, setEntry] = useState<PitScoutEntry>(() => ({
    ...PitScoutEntryInit,
    eventKey: deviceSetup.currentEvent,
    deviceTeamNumber: deviceSetup.deviceTeamNumber,
    deviceId: deviceSetup.deviceId,
  }));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={
            <PitScoutLayout
              entry={entry}
              setEntry={setEntry}
              deviceSetup={deviceSetup}
            />
          }
        />
        <Route
          path="saved"
          element={
            <SavedPitEntries
              validDeviceSetup={validDeviceSetup}
            />
          }
        />
      </Routes>
    </Suspense>
  );
}
