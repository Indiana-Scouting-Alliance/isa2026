import {
  TeamMatchEntry,
} from "@isa2026/api/src/utils/dbtypes.ts";
import EventEmitter from "events";
import { useEffect, useRef, useState } from "react";
import ToggleButton from "../../components/Button/ToggleButton/ToggleButton.tsx";
import Divider from "../../components/Divider/Divider.tsx";
import changeFlexDirection from "../../components/styles/ChangeFlexDirection.module.css";
import scoutStyles from "../../components/styles/ScoutStyles.module.css";
import { DeviceSetupObj } from "../../setup/DeviceSetup.tsx";

type AutoProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  deviceSetup: DeviceSetupObj;
  eventEmitter: EventEmitter;
};
export default function Auto({
  match,
  setMatch,
  eventEmitter,
}: AutoProps) {
  const teleopTimeoutHasRun = useRef(false);
  const teleopTimeout = useRef<NodeJS.Timeout | null>(null);
  console.log("---", teleopTimeout.current);
  useEffect(() => {
    teleopTimeout.current = setTimeout(() => {
      if (!teleopTimeoutHasRun.current) {
        teleopTimeoutHasRun.current = true;
        console.log("-------------------------------------");
        eventEmitter.emit("teleop-animation");
      }
    }, 30000);
    return () => {
      if (teleopTimeout.current) {
        clearTimeout(teleopTimeout.current);
      }
    };
  }, [eventEmitter]);
  const [teleopTimeoutButtonClicked, setTeleopTimeoutButtonClicked] =
    useState(false);
  const teleopTimeoutButtonClick = () => {
    if (teleopTimeoutButtonClicked) {
      return;
    }

    console.log("teleopTimeoutButtonClick");
    setTeleopTimeoutButtonClicked(true);
    if (teleopTimeout.current) {
      clearTimeout(teleopTimeout.current);
      teleopTimeout.current = null;
    }
    teleopTimeout.current = setTimeout(() => {
      if (!teleopTimeoutHasRun.current) {
        teleopTimeoutHasRun.current = true;
        console.log("_-_-_-_-_-_-_-_-_-_-_-_-_-_-");
        eventEmitter.emit("teleop-animation");
      }
    }, 15000);
  };
  eventEmitter.on("teleop-animation", () => {
    if (teleopTimeout.current) {
      clearTimeout(teleopTimeout.current);
      teleopTimeout.current = null;
    }
  });

  return (
    <div
      className={
        scoutStyles.contentContainer +
        " " +
        changeFlexDirection.changeFlexDirection
      }>
      <div className={scoutStyles.half}>
        <h3>Auto Fuel Scoring</h3>
        <ToggleButton
          value={match.autoFuelHubScoring ?? false}
          onChange={(value) => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoFuelHubScoring: value,
            });
          }}
          classNameTrue={scoutStyles.normalToggleButtonTrue}
          classNameFalse={scoutStyles.normalToggleButtonFalse}>
          Fuel Hub Scoring
        </ToggleButton>

        {match.autoFuelHubScoring && (
          <div className={scoutStyles.toggleButtonGroupSpaced}>
            <ToggleButton
              value={match.autoFuelHubScoringLocation === "hub"}
              onChange={(value) => {
                teleopTimeoutButtonClick();
                setMatch({
                  ...match,
                  autoFuelHubScoringLocation: value ? "hub" : null,
                });
              }}
              classNameTrue={scoutStyles.normalToggleButtonTrue}
              classNameFalse={scoutStyles.normalToggleButtonFalse}>
              Hub
            </ToggleButton>
            <ToggleButton
              value={match.autoFuelHubScoringLocation === "tower"}
              onChange={(value) => {
                teleopTimeoutButtonClick();
                setMatch({
                  ...match,
                  autoFuelHubScoringLocation: value ? "tower" : null,
                });
              }}
              classNameTrue={scoutStyles.normalToggleButtonTrue}
              classNameFalse={scoutStyles.normalToggleButtonFalse}>
              Tower
            </ToggleButton>
            <ToggleButton
              value={match.autoFuelHubScoringLocation === "depot"}
              onChange={(value) => {
                teleopTimeoutButtonClick();
                setMatch({
                  ...match,
                  autoFuelHubScoringLocation: value ? "depot" : null,
                });
              }}
              classNameTrue={scoutStyles.normalToggleButtonTrue}
              classNameFalse={scoutStyles.normalToggleButtonFalse}>
              Depot
            </ToggleButton>
            <ToggleButton
              value={match.autoFuelHubScoringLocation === "outpost"}
              onChange={(value) => {
                teleopTimeoutButtonClick();
                setMatch({
                  ...match,
                  autoFuelHubScoringLocation: value ? "outpost" : null,
                });
              }}
              classNameTrue={scoutStyles.normalToggleButtonTrue}
              classNameFalse={scoutStyles.normalToggleButtonFalse}>
              Outpost
            </ToggleButton>
            <ToggleButton
              value={match.autoFuelHubScoringLocation === "trench"}
              onChange={(value) => {
                teleopTimeoutButtonClick();
                setMatch({
                  ...match,
                  autoFuelHubScoringLocation: value ? "trench" : null,
                });
              }}
              classNameTrue={scoutStyles.normalToggleButtonTrue}
              classNameFalse={scoutStyles.normalToggleButtonFalse}>
              Trench
            </ToggleButton>
            <ToggleButton
              value={match.autoFuelHubScoringLocation === "bump"}
              onChange={(value) => {
                teleopTimeoutButtonClick();
                setMatch({
                  ...match,
                  autoFuelHubScoringLocation: value ? "bump" : null,
                });
              }}
              classNameTrue={scoutStyles.normalToggleButtonTrue}
              classNameFalse={scoutStyles.normalToggleButtonFalse}>
              Bump
            </ToggleButton>
            <ToggleButton
              value={match.autoFuelHubScoringLocation === "other"}
              onChange={(value) => {
                teleopTimeoutButtonClick();
                setMatch({
                  ...match,
                  autoFuelHubScoringLocation: value ? "other" : null,
                });
              }}
              classNameTrue={scoutStyles.normalToggleButtonTrue}
              classNameFalse={scoutStyles.normalToggleButtonFalse}>
              Other
            </ToggleButton>
          </div>
        )}

        <ToggleButton
          value={match.autoFuelPassed ?? false}
          onChange={(value) => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoFuelPassed: value,
            });
          }}
          classNameTrue={scoutStyles.normalToggleButtonTrue}
          classNameFalse={scoutStyles.normalToggleButtonFalse}>
          Fuel Passed
        </ToggleButton>

        <div className={scoutStyles.fieldSpacing}>
          <label className={scoutStyles.formLabel}>
            Fuel Scored: {match.autoFuelScored ?? 0}
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={match.autoFuelScored ?? 0}
            onChange={(e) => {
              teleopTimeoutButtonClick();
              setMatch({
                ...match,
                autoFuelScored: parseInt(e.target.value),
              });
            }}
            className={scoutStyles.numberInput}
          />
        </div>
      </div>

      <Divider orientation="vertical" />

      <div className={scoutStyles.half}>
        <h3>Auto Climb</h3>
        <ToggleButton
          value={match.autoClimbAttempted ?? false}
          onChange={(value) => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoClimbAttempted: value,
            });
          }}
          classNameTrue={scoutStyles.normalToggleButtonTrue}
          classNameFalse={scoutStyles.normalToggleButtonFalse}>
          Climb Attempted
        </ToggleButton>

        {match.autoClimbAttempted && (
          <>
            <div className={scoutStyles.toggleButtonGroupSpaced}>
              <ToggleButton
                value={match.autoClimbPosition === "outpost"}
                onChange={(value) => {
                  teleopTimeoutButtonClick();
                  setMatch({
                    ...match,
                    autoClimbPosition: value ? "outpost" : null,
                  });
                }}
                classNameTrue={scoutStyles.normalToggleButtonTrue}
                classNameFalse={scoutStyles.normalToggleButtonFalse}>
                Outpost
              </ToggleButton>
              <ToggleButton
                value={match.autoClimbPosition === "center"}
                onChange={(value) => {
                  teleopTimeoutButtonClick();
                  setMatch({
                    ...match,
                    autoClimbPosition: value ? "center" : null,
                  });
                }}
                classNameTrue={scoutStyles.normalToggleButtonTrue}
                classNameFalse={scoutStyles.normalToggleButtonFalse}>
                Center
              </ToggleButton>
              <ToggleButton
                value={match.autoClimbPosition === "depot"}
                onChange={(value) => {
                  teleopTimeoutButtonClick();
                  setMatch({
                    ...match,
                    autoClimbPosition: value ? "depot" : null,
                  });
                }}
                classNameTrue={scoutStyles.normalToggleButtonTrue}
                classNameFalse={scoutStyles.normalToggleButtonFalse}>
                Depot
              </ToggleButton>
              <ToggleButton
                value={match.autoClimbPosition === "other"}
                onChange={(value) => {
                  teleopTimeoutButtonClick();
                  setMatch({
                    ...match,
                    autoClimbPosition: value ? "other" : null,
                  });
                }}
                classNameTrue={scoutStyles.normalToggleButtonTrue}
                classNameFalse={scoutStyles.normalToggleButtonFalse}>
                Other
              </ToggleButton>
            </div>

            <div className={scoutStyles.toggleButtonGroupSpaced}>
              <ToggleButton
                value={match.autoClimbLevel === 1}
                onChange={(value) => {
                  teleopTimeoutButtonClick();
                  setMatch({
                    ...match,
                    autoClimbLevel: value ? 1 : null,
                  });
                }}
                classNameTrue={scoutStyles.normalToggleButtonTrue}
                classNameFalse={scoutStyles.normalToggleButtonFalse}>
                Level 1
              </ToggleButton>
              <ToggleButton
                value={match.autoClimbLevel === 2}
                onChange={(value) => {
                  teleopTimeoutButtonClick();
                  setMatch({
                    ...match,
                    autoClimbLevel: value ? 2 : null,
                  });
                }}
                classNameTrue={scoutStyles.normalToggleButtonTrue}
                classNameFalse={scoutStyles.normalToggleButtonFalse}>
                Level 2
              </ToggleButton>
              <ToggleButton
                value={match.autoClimbLevel === 3}
                onChange={(value) => {
                  teleopTimeoutButtonClick();
                  setMatch({
                    ...match,
                    autoClimbLevel: value ? 3 : null,
                  });
                }}
                classNameTrue={scoutStyles.normalToggleButtonTrue}
                classNameFalse={scoutStyles.normalToggleButtonFalse}>
                Level 3
              </ToggleButton>
            </div>
          </>
        )}

        <Divider orientation="horizontal" />

        <h3>Other</h3>
        <ToggleButton
          value={match.died ?? false}
          onChange={(value) => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              died: value,
            });
          }}
          classNameTrue={scoutStyles.redToggleButtonTrue}
          classNameFalse={scoutStyles.redToggleButtonFalse}>
          Robot Died
        </ToggleButton>
      </div>
    </div>
  );
}
