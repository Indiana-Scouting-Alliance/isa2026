/* eslint-disable no-unexpected-multiline */
import {
  DBEvent,
  HumanPlayerEntry,
  Match,
  MatchLevel,
} from "@isa2026/api/src/utils/dbtypes.ts";
import { Add, Remove } from "@mui/icons-material";
import Button from "../components/Button/Button.tsx";
import ToggleButton from "../components/Button/ToggleButton/ToggleButton.tsx";
import ToggleButtonGroup from "../components/Button/ToggleButton/ToggleButtonGroup.tsx";
import BigCounter from "../components/Counter/BigCounter.tsx";
import Divider from "../components/Divider/Divider.tsx";
import Input from "../components/Input/Input.tsx";
import Select from "../components/Select/Select.tsx";
import changeFlexDirection from "../components/styles/ChangeFlexDirection.module.css";
import scoutStyles from "../components/styles/ScoutStyles.module.css";
import styles from "./Human.module.css";

type HumanProps = {
  match: HumanPlayerEntry;
  setMatch: (value: HumanPlayerEntry) => void;
  events: (DBEvent & { matches: Match[] })[];
  scoutNameError: string;
  scoutTeamNumberError: string;
  teamNumberError: string;
  matchNumberError?: string;
};
export default function Human({
  match,
  setMatch,
  events,
  scoutNameError,
  scoutTeamNumberError,
  teamNumberError,
  matchNumberError,
}: HumanProps) {
  const eventMatches = events.find(
    (event) => event.eventKey === match.eventKey
  )?.matches;

  return (
    <div
      className={
        scoutStyles.contentContainer +
        " " +
        changeFlexDirection.changeFlexDirection
      }>
      <div className={scoutStyles.half}>
        <Input
          id="scout-name"
          value={match.scoutName}
          onChange={(value) => {
            setMatch({
              ...match,
              scoutName: value,
            });
          }}
          type="text"
          label="Scout Name & Last Initial"
          error={scoutNameError !== ""}
          helperText={scoutNameError}
        />
        <Input
          id="scout-team-number"
          value={isNaN(match.scoutTeamNumber) ? "" : match.scoutTeamNumber}
          onChange={(value) => {
            setMatch({
              ...match,
              scoutTeamNumber: parseInt(value),
            });
          }}
          label="Scout Team Number"
          error={scoutTeamNumberError !== ""}
          helperText={scoutTeamNumberError}
        />
        <div className={scoutStyles.matchInfoContainer}>
          <Select
            id="match-level"
            value={match.matchLevel}
            label="Level"
            onChange={(value) => {
              setMatch({
                ...match,
                matchLevel: value as (typeof MatchLevel)[number],
              });
            }}
            className={scoutStyles.matchLevel}>
            <option value="None">n</option>
            <option value="Practice">p</option>
            <option value="Qualification">q</option>
            <option value="Playoff">t</option>
          </Select>
          <div className={scoutStyles.matchNumber}>
            <div className={scoutStyles.matchNumberButtonContainer}>
              <p className={scoutStyles.matchNumberButtonSpacer}>X</p>
              <Button
                className={scoutStyles.matchNumberButton}
                onClick={() => {
                  if (match.matchNumber > 1) {
                    setMatch({
                      ...match,
                      matchNumber: match.matchNumber - 1,
                      teamNumber: 0,
                    });
                  }
                }}>
                <Remove />
              </Button>
            </div>
            <Input
              id="match-number"
              className={scoutStyles.matchNumberInput}
              type="number"
              value={isNaN(match.matchNumber) ? "" : match.matchNumber}
              onChange={(value) => {
                setMatch({
                  ...match,
                  matchNumber: parseInt(value),
                  teamNumber: 0,
                });
              }}
              label="Match Number"
              error={matchNumberError !== ""}
              helperText={matchNumberError}
            />
            <div className={scoutStyles.matchNumberButtonContainer}>
              <p className={scoutStyles.matchNumberButtonSpacer}>X</p>
              <Button
                className={scoutStyles.matchNumberButton}
                onClick={() => {
                  setMatch({
                    ...match,
                    matchNumber: match.matchNumber + 1,
                    teamNumber: 0,
                  });
                }}>
                <Add />
              </Button>
            </div>
          </div>
        </div>
        {(
          eventMatches?.some(
            (x) =>
              x.matchNumber === match.matchNumber &&
              x.matchLevel === match.matchLevel
          )
        ) ?
          <div className={styles.teamNumberContainer}>
            <label
              htmlFor="human-player-team-number"
              className={styles.teamNumberLabel}>
              Human Player Team Number
            </label>
            <ToggleButtonGroup
              value={match.teamNumber?.toString() || ""}
              onChange={(value) => {
                if (value) {
                  setMatch({
                    ...match,
                    teamNumber: parseInt(value),
                  });
                }
              }}>
              <ToggleButton
                className={
                  styles.teamNumberToggleButton +
                  " " +
                  (teamNumberError ? styles.teamNumberToggleButtonError : "")
                }
                value={eventMatches
                  .find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )!
                  [
                    (match.alliance.toLowerCase() + "1") as "red1" | "blue1"
                  ].toString()}>
                {
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )![(match.alliance.toLowerCase() + "1") as "red1" | "blue1"]
                }
              </ToggleButton>
              <ToggleButton
                className={
                  styles.teamNumberToggleButton +
                  " " +
                  (teamNumberError ? styles.teamNumberToggleButtonError : "")
                }
                value={eventMatches
                  .find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )!
                  [
                    (match.alliance.toLowerCase() + "2") as "red2" | "blue2"
                  ].toString()}>
                {
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )![(match.alliance.toLowerCase() + "2") as "red2" | "blue2"]
                }
              </ToggleButton>
              <ToggleButton
                className={
                  styles.teamNumberToggleButton +
                  " " +
                  (teamNumberError ? styles.teamNumberToggleButtonError : "")
                }
                value={eventMatches
                  .find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )!
                  [
                    (match.alliance.toLowerCase() + "3") as "red3" | "blue3"
                  ].toString()}>
                {
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )![(match.alliance.toLowerCase() + "3") as "red3" | "blue3"]
                }
              </ToggleButton>
            </ToggleButtonGroup>
            <Input
              id="human-player-team-number"
              type="number"
              value={isNaN(match.teamNumber!) ? "" : match.teamNumber || ""}
              onChange={(value) => {
                setMatch({
                  ...match,
                  teamNumber: parseInt(value),
                });
              }}
              error={teamNumberError !== ""}
              helperText={teamNumberError}
            />
          </div>
        : <Input
            id="human-player-team-number"
            type="number"
            label="Human Player Team Number"
            value={isNaN(match.teamNumber!) ? "" : match.teamNumber || ""}
            onChange={(value) => {
              setMatch({
                ...match,
                teamNumber: parseInt(value),
              });
            }}
            error={teamNumberError !== ""}
            helperText={teamNumberError}
          />
        }
      </div>
      <Divider orientation="vertical" />
      <div className={scoutStyles.half}>
        <BigCounter
          id="human-attempted-net"
          value={match.humanAttemptedNet!}
          increment={() => {
            setMatch({
              ...match,
              humanAttemptedNet: match.humanAttemptedNet! + 1,
            });
          }}
          decrement={() => {
            setMatch({
              ...match,
              humanAttemptedNet: match.humanAttemptedNet! - 1,
            });
          }}
          label="Attempted Algae in Net"
          max={18}
          disabled={!match.teamNumber}
        />
        <BigCounter
          id="human-successful-net"
          value={match.humanSuccessfulNet!}
          increment={() => {
            if (match.humanAttemptedNet! < 18) {
              setMatch({
                ...match,
                humanSuccessfulNet: match.humanSuccessfulNet! + 1,
                humanAttemptedNet: match.humanAttemptedNet! + 1,
              });
            } else {
              setMatch({
                ...match,
                humanSuccessfulNet: match.humanSuccessfulNet! + 1,
              });
            }
          }}
          decrement={() => {
            setMatch({
              ...match,
              humanSuccessfulNet: match.humanSuccessfulNet! - 1,
            });
          }}
          label="Successful Algae in Net"
          max={18}
          disabled={!match.teamNumber}
        />
        {
          //TODO: if adding comments for human players: .replace(/"/g, "'")
        }
      </div>
    </div>
  );
}
