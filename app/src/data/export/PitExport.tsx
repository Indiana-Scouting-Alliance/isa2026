import { PitScoutEntryColumns } from "@isa2026/api/src/utils/dbtypes.ts";
import { useState } from "react";
import { trpc } from "../../utils/trpc.ts";
import styles from "./Export.module.css";
import PitExportLayout from "./PitExportLayout";

export default function PitExport() {
  const [showPublicApiToken, setShowPublicApiToken] = useState(false);
  const [linkIncludesToken, setLinkIncludesToken] = useState(false);
  const [showAuthorization, setShowAuthorization] = useState(false);

  const [events, setEvents] = useState("");
  const [teams, setTeams] = useState("");

  const publicApiToken = trpc.users.publicApiToken.useQuery();

  const [robotColumns, setRobotColumns] = useState<boolean[]>(
    new Array(PitScoutEntryColumns.length)
      .fill(false)
      .map(
        (_, i) =>
          ![
            "deviceTeamNumber",
            "deviceId",
            "scoutName",
            "scoutTeamNumber",
            "eventKey",
          ].includes(PitScoutEntryColumns[i])
      )
  );
  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <PitExportLayout
          showPublicApiToken={showPublicApiToken}
          setShowPublicApiToken={setShowPublicApiToken}
          linkIncludesToken={linkIncludesToken}
          setLinkIncludesToken={setLinkIncludesToken}
          showAuthorization={showAuthorization}
          setShowAuthorization={setShowAuthorization}
          publicApiToken={publicApiToken.data}
          robotColumnsState={robotColumns}
          setRobotColumnsState={setRobotColumns}
          linkBase="/public/pitRobots/"
          events={events}
          setEvents={setEvents}
          teams={teams}
          setTeams={setTeams}
        />
      </div>
    </div>
  );
}
