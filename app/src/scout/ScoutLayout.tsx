import { MAX_TEAM_NUMBER } from "@isa2026/api/src/utils/constants.ts";
import {
  DBEvent,
  Match,
  TeamMatchEntry,
  TeamMatchEntryNoShowInit,
} from "@isa2026/api/src/utils/dbtypes.ts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button.tsx";
import ScoutPageContainer from "../components/PageContainer/ScoutPageContainer/ScoutPageContainer.tsx";
import Tab from "../components/Tabs/Tab.tsx";
import TabBar from "../components/Tabs/TabBar.tsx";
import { DeviceSetupObj } from "../setup/DeviceSetup.tsx";
import { putDBEntry } from "../utils/idb.ts";
import { trpc } from "../utils/trpc.ts";
import Auto from "./robot/Auto.tsx";
import Postmatch from "./robot/Postmatch.tsx";
import Prematch from "./robot/Prematch.tsx";
import { Teleop } from "./robot/Teleop.tsx";
import { ExportMatchEntry } from "./savedmatches/SavedMatches.tsx";
import styles from "./ScoutLayout.module.css";

export type MatchStage = "prematch" | "auto" | "teleop" | "postmatch";

type ScoutLayoutProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  events: (DBEvent & { matches: Match[] })[];
  deviceSetup: DeviceSetupObj;
  putEntriesPending: boolean;
  setPutEntriesPending: (value: boolean) => void;
};

export default function ScoutLayout({
  match,
  setMatch,
  events,
  deviceSetup,
  putEntriesPending,
  setPutEntriesPending,
}: ScoutLayoutProps) {
  const navigate = useNavigate();
  const [matchStage, setMatchStage] = useState<MatchStage>("prematch");

  const endOfMatchTeamMatchEntry = (m: TeamMatchEntry): TeamMatchEntry => {
    return { ...m };
  };

  let putEntriesTimeout: NodeJS.Timeout;
  const putEntries = trpc.data.putEntries.useMutation({
    onMutate() {
      clearTimeout(putEntriesTimeout);
      setPutEntriesPending(true);
      putEntriesTimeout = setTimeout(async () => {
        if (putEntriesPending) {
          putEntries.reset();
          await putDBEntry({
            ...match,
            autoUpload: false,
            quickshare: false,
            clipboard: false,
            qr: false,
            download: false,
            upload: false,
          } as ExportMatchEntry);
          navigate("/scout/savedmatches");
        }
      }, 3000);
    },
    async onSuccess() {
      clearTimeout(putEntriesTimeout);
      await putDBEntry({
        ...match,
        autoUpload: true,
        quickshare: false,
        clipboard: false,
        qr: false,
        download: false,
        upload: false,
      } as ExportMatchEntry);
      setPutEntriesPending(false);
      navigate("/scout/savedmatches");
    },
    async onError(error) {
      clearTimeout(putEntriesTimeout);
      console.error(error);
      await putDBEntry({
        ...match,
        autoUpload: false,
        quickshare: false,
        clipboard: false,
        qr: false,
        download: false,
        upload: false,
      } as ExportMatchEntry);
      setPutEntriesPending(false);
      navigate("/scout/savedmatches");
    },
  });

  const [matchNumberError, setMatchNumberError] = useState("");
  const [scoutNameError, setScoutNameError] = useState("");
  const [scoutTeamNumberError, setScoutTeamNumberError] = useState("");
  const [teamNumberError, setTeamNumberError] = useState("");
  const [startingPositionError, setStartingPositionError] = useState("");
  const [dataConfidenceError, setDataConfidenceError] = useState("");

  const prematchCheck = () => {
    let error = false;
    if (!Number.isInteger(match.matchNumber) || match.matchNumber < 1) {
      error = true;
      setMatchNumberError("Invalid match number.");
    } else if (
      !events
        .find((x) => x.eventKey === deviceSetup.currentEvent)
        ?.matches.some(
          (y) =>
            y.matchNumber === match.matchNumber &&
            y.matchLevel === match.matchLevel
        )
    ) {
      if (matchNumberError !== "Match not in schedule. Press Next again to ignore.") {
        error = true;
      }
      setMatchNumberError("Match not in schedule. Press Next again to ignore.");
    } else {
      setMatchNumberError("");
    }

    if (!match.scoutName) {
      error = true;
      setScoutNameError("Cannot be empty.");
    } else {
      setScoutNameError("");
    }

    if (
      !Number.isInteger(match.scoutTeamNumber) ||
      match.scoutTeamNumber < 1 ||
      match.scoutTeamNumber > MAX_TEAM_NUMBER
    ) {
      error = true;
      setScoutTeamNumberError("Invalid team number.");
    } else {
      setScoutTeamNumberError("");
    }

    if (
      !Number.isInteger(match.teamNumber) ||
      match.teamNumber! < 1 ||
      match.teamNumber! > MAX_TEAM_NUMBER
    ) {
      error = true;
      setTeamNumberError("Invalid team number.");
    } else {
      setTeamNumberError("");
    }

    if (!match.noShow && !match.startZone) {
      error = true;
      setStartingPositionError("Starting position must be selected.");
    } else {
      setStartingPositionError("");
    }

    return error;
  };

  const submitCheck = () => {
    let error = false;
    if (match.dataConfidence === null) {
      error = true;
      setDataConfidenceError("Data confidence must be selected.");
    }
    return error;
  };

  const noShowTeamMatchEntry = (m: TeamMatchEntry): TeamMatchEntry => {
    return {
      ...TeamMatchEntryNoShowInit,
      eventKey: m.eventKey,
      matchLevel: m.matchLevel,
      matchNumber: m.matchNumber,
      teamNumber: m.teamNumber!,
      alliance: m.alliance,
      robotNumber: m.robotNumber as 1 | 2 | 3,
      deviceTeamNumber: m.deviceTeamNumber,
      deviceId: m.deviceId,
      scoutTeamNumber: m.scoutTeamNumber,
      scoutName: m.scoutName,
      flag: m.flag,
    };
  };

  return (
    <ScoutPageContainer
      title={
        <TabBar
          value={matchStage}
          onChange={(value) => {
            if (matchStage === "prematch") {
              if (!prematchCheck()) {
                setMatchStage(value as MatchStage);
              }
            } else {
              setMatchStage(value as MatchStage);
            }
          }}>
          <Tab value="prematch">Prematch</Tab>
          <Tab value="auto">Auto</Tab>
          <Tab value="teleop">Teleop</Tab>
          <Tab value="postmatch">Postmatch</Tab>
        </TabBar>
      }
      nowScouting={{
        teamNumber: match.teamNumber || 0,
        alliance: match.alliance,
        robotPosition: match.robotNumber,
      }}
      navButtons={
        matchStage === "prematch" ?
          <>
            <Button className={styles.navButtonBack} onClick={() => navigate("/")}>Exit</Button>
            {match.noShow && (
              <Button
                className={styles.navButtonForward}
                onClick={() => {
                  setMatch(noShowTeamMatchEntry(match));
                  putEntries.mutate([noShowTeamMatchEntry(match)]);
                }}>
                Submit
              </Button>
            )}
          </>
        : matchStage === "postmatch" ?
          <Button
            className={styles.navButtonForward}
            onClick={() => {
              if (match.noShow) {
                setMatch(noShowTeamMatchEntry(match));
                putEntries.mutate([noShowTeamMatchEntry(match)]);
              } else {
                if (!submitCheck()) {
                  putEntries.mutate([endOfMatchTeamMatchEntry(match)]);
                }
              }
            }}>
            Submit
          </Button>
        : undefined
      }>
      <div className={styles.contentContainer}>
        {
          {
            prematch: (
              <Prematch
                match={match}
                setMatch={setMatch}
                events={events}
                deviceSetup={deviceSetup}
                matchNumberError={matchNumberError}
                scoutNameError={scoutNameError}
                scoutTeamNumberError={scoutTeamNumberError}
                teamNumberError={teamNumberError}
                startingPositionError={startingPositionError}
              />
            ),
            auto: (
              <Auto
                match={match}
                setMatch={setMatch}
                deviceSetup={deviceSetup}
              />
            ),
            teleop: <Teleop match={match} setMatch={setMatch} deviceSetup={deviceSetup} />,
            postmatch: (
              <Postmatch
                match={match}
                setMatch={setMatch}
                dataConfidenceError={dataConfidenceError}
              />
            ),
          }[matchStage]
        }
      </div>
    </ScoutPageContainer>
  );
}