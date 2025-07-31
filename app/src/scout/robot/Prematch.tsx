import {
  DBEvent,
  Match,
  MatchLevel,
  TeamMatchEntry,
} from "@isa2026/api/src/utils/dbtypes.ts";
import { Add, Remove } from "@mui/icons-material";
import Button from "../../components/Button/Button.tsx";
import ToggleButton from "../../components/Button/ToggleButton/ToggleButton.tsx";
import TransparentToggle from "../../components/Button/ToggleButton/TransparentToggle/TransparentToggle.tsx";
import changeFlexDirection from "../../components/ChangeFlexDirection.module.css";
import Divider from "../../components/Divider/Divider.tsx";
import Input from "../../components/Input/Input.tsx";
import Select from "../../components/Select/Select.tsx";
import { DeviceSetupObj } from "../../setup/DeviceSetup.tsx";
import scoutStyles from "../ScoutStyles.module.css";
import styles from "./Prematch.module.css";

type PrematchProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  events: (DBEvent & { matches: Match[] })[];
  deviceSetup: DeviceSetupObj;
  matchNumberError: string;
  scoutNameError: string;
  scoutTeamNumberError: string;
  teamNumberError: string;
  startingPositionError: string;
};
export default function Prematch({
  match,
  setMatch,
  events,
  deviceSetup,
  matchNumberError,
  scoutNameError,
  scoutTeamNumberError,
  teamNumberError,
  startingPositionError,
}: PrematchProps) {
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
          type="number"
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
                    const eventMatches = events.find(
                      (event) => event.eventKey === deviceSetup.currentEvent
                    )?.matches;
                    if (
                      eventMatches?.some(
                        (x) =>
                          x.matchNumber === match.matchNumber - 1 &&
                          x.matchLevel === match.matchLevel
                      )
                    ) {
                      setMatch({
                        ...match,
                        matchNumber: match.matchNumber - 1,
                        teamNumber: eventMatches.find(
                          (x) =>
                            x.matchNumber === match.matchNumber - 1 &&
                            x.matchLevel === match.matchLevel
                        )![
                          (deviceSetup.alliance.toLowerCase() +
                            deviceSetup.robotNumber) as
                            | "red1"
                            | "red2"
                            | "red3"
                            | "blue1"
                            | "blue2"
                            | "blue3"
                        ],
                      });
                    } else {
                      setMatch({
                        ...match,
                        matchNumber: match.matchNumber - 1,
                        teamNumber: 0,
                      });
                    }
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
                const eventMatches = events.find(
                  (event) => event.eventKey === match.eventKey
                )?.matches;
                if (
                  eventMatches?.some(
                    (x) =>
                      x.matchNumber === parseInt(value) &&
                      x.matchLevel === match.matchLevel
                  )
                ) {
                  setMatch({
                    ...match,
                    matchNumber: parseInt(value),
                    teamNumber: eventMatches.find(
                      (x) =>
                        x.matchNumber === parseInt(value) &&
                        x.matchLevel === match.matchLevel
                    )![
                      (deviceSetup.alliance.toLowerCase() +
                        deviceSetup.robotNumber) as
                        | "red1"
                        | "red2"
                        | "red3"
                        | "blue1"
                        | "blue2"
                        | "blue3"
                    ],
                  });
                } else {
                  setMatch({
                    ...match,
                    matchNumber: parseInt(value),
                    teamNumber: 0,
                  });
                }
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
                  const eventMatches = events.find(
                    (event) => event.eventKey === deviceSetup.currentEvent
                  )?.matches;
                  if (
                    eventMatches?.some(
                      (x) =>
                        x.matchNumber === match.matchNumber + 1 &&
                        x.matchLevel === match.matchLevel
                    )
                  ) {
                    setMatch({
                      ...match,
                      matchNumber: match.matchNumber + 1,
                      teamNumber: eventMatches.find(
                        (x) =>
                          x.matchNumber === match.matchNumber + 1 &&
                          x.matchLevel === match.matchLevel
                      )![
                        (deviceSetup.alliance.toLowerCase() +
                          deviceSetup.robotNumber) as
                          | "red1"
                          | "red2"
                          | "red3"
                          | "blue1"
                          | "blue2"
                          | "blue3"
                      ],
                    });
                  } else {
                    setMatch({
                      ...match,
                      matchNumber: match.matchNumber + 1,
                      teamNumber: 0,
                    });
                  }
                }}>
                <Add />
              </Button>
            </div>
          </div>
        </div>
        <Input
          id="team-number"
          type="number"
          label="Robot Team Number"
          value={isNaN(match.teamNumber) ? "" : match.teamNumber}
          onChange={(value) => {
            setMatch({
              ...match,
              teamNumber: parseInt(value),
            });
          }}
          error={teamNumberError !== ""}
          helperText={teamNumberError}
        />
        <Divider orientation="horizontal" />
        <ToggleButton
          value={match.noShow}
          onChange={(value) => {
            setMatch({
              ...match,
              noShow: value,
            });
          }}
          classNameTrue={scoutStyles.redToggleButtonTrue}
          classNameFalse={scoutStyles.redToggleButtonFalse}>
          No Show
        </ToggleButton>
      </div>
      <Divider orientation="vertical" />
      <div className={scoutStyles.half}>
        <div
          className={
            startingPositionError ?
              styles.startingPositionContainerContainerError
            : styles.startingPositionContainerContainer
          }>
          <div className={styles.startingPositionContainer}>
            <img
              src={
                import.meta.env.BASE_URL +
                "assets/" +
                (match.alliance === "Red" ?
                  deviceSetup.fieldOrientation === "barge" ?
                    "RedBarge.png"
                  : "RedProcessor.png"
                : deviceSetup.fieldOrientation === "barge" ? "BlueBarge.png"
                : "BlueProcessor.png")
              }
              className={styles.startingPositionImage}
            />
            <TransparentToggle
              value={match.startingLocationA!}
              setValue={(value) => {
                if (value) {
                  setMatch({
                    ...match,
                    startingLocationA: value,
                    startingLocationB: false,
                    startingLocationC: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    startingLocationA: value,
                  });
                }
              }}
              disabled={match.noShow}
              error={startingPositionError !== ""}
              className={
                deviceSetup.fieldOrientation === "barge" ?
                  styles.startingPositionLeftA
                : styles.startingPositionRightA
              }>
              A
            </TransparentToggle>
            <TransparentToggle
              value={match.startingLocationB!}
              setValue={(value) => {
                if (value) {
                  setMatch({
                    ...match,
                    startingLocationB: value,
                    startingLocationA: false,
                    startingLocationC: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    startingLocationB: value,
                  });
                }
              }}
              disabled={match.noShow}
              error={startingPositionError !== ""}
              className={
                deviceSetup.fieldOrientation === "barge" ?
                  styles.startingPositionLeftB
                : styles.startingPositionRightB
              }>
              B
            </TransparentToggle>
            <TransparentToggle
              value={match.startingLocationC!}
              setValue={(value) => {
                if (value) {
                  setMatch({
                    ...match,
                    startingLocationC: value,
                    startingLocationA: false,
                    startingLocationB: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    startingLocationC: value,
                  });
                }
              }}
              disabled={match.noShow}
              error={startingPositionError !== ""}
              className={
                deviceSetup.fieldOrientation === "barge" ?
                  styles.startingPositionLeftC
                : styles.startingPositionRightC
              }>
              C
            </TransparentToggle>
          </div>
        </div>
        {startingPositionError && (
          <p className={styles.startingPositionError}>
            {startingPositionError}
          </p>
        )}
      </div>
    </div>
  );
}
