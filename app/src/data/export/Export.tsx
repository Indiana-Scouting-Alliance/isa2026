import {
  HumanPlayerEntryColumns,
  TeamMatchEntryColumns,
} from "@isa2026/api/src/utils/dbtypes.ts";
import { useState } from "react";
import { Route, Routes, useNavigate, useResolvedPath } from "react-router-dom";
import Tab from "../../components/Tabs/Tab.tsx";
import TabBar from "../../components/Tabs/TabBar.tsx";
import { trpc } from "../../utils/trpc.ts";
import styles from "./Export.module.css";
import ExportLayout from "./ExportLayout.tsx";

export default function Export() {
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath("");
  const pathend = resolvedPath.pathname.split("/").pop()!;

  const [showPublicApiToken, setShowPublicApiToken] = useState(false);
  const [linkIncludesToken, setLinkIncludesToken] = useState(false);
  const [showAuthorization, setShowAuthorization] = useState(false);

  const [events, setEvents] = useState("");
  const [teams, setTeams] = useState("");

  const publicApiToken = trpc.users.publicApiToken.useQuery();

  const [robotColumns, setRobotColumns] = useState<boolean[]>(
    new Array(TeamMatchEntryColumns.length)
      .fill(false)
      .map(
        (_, i) =>
          ![
            "deviceTeamNumber",
            "deviceId",
            "scoutName",
            "scoutTeamNumber",
            "eventKey",
            "matchLevel",
            "alliance",
            "robotNumber",
            "dataConfidence",
          ].includes(TeamMatchEntryColumns[i])
      )
  );
  const [humanColumns, setHumanColumns] = useState<boolean[]>(
    new Array(HumanPlayerEntryColumns.length)
      .fill(false)
      .map(
        (_, i) =>
          ![
            "deviceTeamNumber",
            "deviceId",
            "scoutName",
            "scoutTeamNumber",
            "eventKey",
            "matchLevel",
            "alliance",
            "robotNumber",
          ].includes(HumanPlayerEntryColumns[i])
      )
  );

  return (
    <div className={styles.container}>
      <TabBar
        value={pathend === "" ? "/" : pathend}
        onChange={(value) => {
          navigate(
            resolvedPath.pathname.split("/").slice(0, -1).join("/") +
              "/" +
              value
          );
        }}>
        <Tab value="robots">Robot Data</Tab>
        <Tab value="humans">Human Data</Tab>
      </TabBar>
      <div className={styles.contentContainer}>
        <Routes>
          <Route
            path="/"
            element={<div>Please select robot or human data.</div>}
          />
          <Route
            path="robots"
            element={
              <ExportLayout
                showPublicApiToken={showPublicApiToken}
                setShowPublicApiToken={setShowPublicApiToken}
                linkIncludesToken={linkIncludesToken}
                setLinkIncludesToken={setLinkIncludesToken}
                showAuthorization={showAuthorization}
                setShowAuthorization={setShowAuthorization}
                publicApiToken={publicApiToken.data}
                robotColumnsState={robotColumns}
                setRobotColumnsState={setRobotColumns}
                humanColumnsState={[]}
                setHumanColumnsState={setHumanColumns}
                linkBase="/public/robots/"
                events={events}
                setEvents={setEvents}
                teams={teams}
                setTeams={setTeams}
              />
            }
          />
          <Route
            path="humans"
            element={
              <ExportLayout
                showPublicApiToken={showPublicApiToken}
                setShowPublicApiToken={setShowPublicApiToken}
                linkIncludesToken={linkIncludesToken}
                setLinkIncludesToken={setLinkIncludesToken}
                showAuthorization={showAuthorization}
                setShowAuthorization={setShowAuthorization}
                publicApiToken={publicApiToken.data}
                robotColumnsState={[]}
                setRobotColumnsState={setRobotColumns}
                humanColumnsState={humanColumns}
                setHumanColumnsState={setHumanColumns}
                linkBase="/public/humans/"
                events={events}
                setEvents={setEvents}
                teams={teams}
                setTeams={setTeams}
              />
            }
          />
        </Routes>
      </div>
      {/* <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}>
        <Tabs value={pathend === "" ? "/" : pathend}>
          <Tab
            label="Robot Data"
            value="robots"
            component={Link}
            to={
              resolvedPath.pathname.split("/").slice(0, -1).join("/") +
              "/robots"
            }
          />
          <Tab
            label="Human Data"
            value="humans"
            component={Link}
            to={
              resolvedPath.pathname.split("/").slice(0, -1).join("/") +
              "/humans"
            }
          />
        </Tabs>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: "scroll",
        }}>
        
      </Box> */}
    </div>
  );
}
