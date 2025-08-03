import {
  TeamMatchEntry,
  TeamMatchEntryColumn,
} from "@isa2026/api/src/utils/dbtypes.ts";
import EventEmitter from "events";
import { useEffect, useRef, useState } from "react";
import AutoReefButton from "../../components/Button/ToggleButton/AutoReefButton/AutoReefButton.tsx";
import ToggleButton from "../../components/Button/ToggleButton/ToggleButton.tsx";
import HalfSmallCounter from "../../components/Counter/HalfSmallCounter.tsx";
import SmallCounter from "../../components/Counter/SmallCounter.tsx";
import Divider from "../../components/Divider/Divider.tsx";
import changeFlexDirection from "../../components/styles/ChangeFlexDirection.module.css";
import scoutStyles from "../../components/styles/ScoutStyles.module.css";
import { DeviceSetupObj } from "../../setup/DeviceSetup.tsx";
import useClickAwayListener from "../../utils/clickAwayListener.ts";
import styles from "./Auto.module.css";

type AutoProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  deviceSetup: DeviceSetupObj;
  eventEmitter: EventEmitter;
};
export default function Auto({
  match,
  setMatch,
  deviceSetup,
  eventEmitter,
}: AutoProps) {
  const [popperReef, setPopperReef] = useState<
    "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | ""
  >("");
  const popperRef = useRef<HTMLDivElement>(null);
  useClickAwayListener(popperRef, () => {
    setPopperReef("");
  });

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
      <div
        className={
          scoutStyles.half +
          " " +
          styles.reefContainerContainer +
          " " +
          scoutStyles.imageContainerContainer
        }>
        <div
          className={styles.reefContainer + " " + scoutStyles.imageContainer}>
          <img
            src={import.meta.env.BASE_URL + "assets/Reef.png"}
            className={scoutStyles.image}
          />
          <AutoReefButton
            selected={popperReef === "A"}
            coralStates={{
              L4: match.autoCoralAL4!,
              L3: match.autoCoralAL3!,
              L2: match.autoCoralAL2!,
              L1: match.autoCoralABL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "A" ? "" : "A");
            }}
            className={
              styles.reefButton +
              " " +
              (deviceSetup.fieldOrientation === "processor" ?
                styles.reefButtonA
              : styles.reefButtonG)
            }
          />
          <AutoReefButton
            selected={popperReef === "B"}
            coralStates={{
              L4: match.autoCoralBL4!,
              L3: match.autoCoralBL3!,
              L2: match.autoCoralBL2!,
              L1: match.autoCoralABL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "B" ? "" : "B");
            }}
            className={
              styles.reefButton +
              " " +
              (deviceSetup.fieldOrientation === "processor" ?
                styles.reefButtonB
              : styles.reefButtonH)
            }
          />
          <AutoReefButton
            selected={popperReef === "C"}
            coralStates={{
              L4: match.autoCoralCL4!,
              L3: match.autoCoralCL3!,
              L2: match.autoCoralCL2!,
              L1: match.autoCoralCDL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "C" ? "" : "C");
            }}
            className={
              styles.reefButton +
              " " +
              (deviceSetup.fieldOrientation === "processor" ?
                styles.reefButtonC
              : styles.reefButtonI)
            }
          />
          <AutoReefButton
            selected={popperReef === "D"}
            coralStates={{
              L4: match.autoCoralDL4!,
              L3: match.autoCoralDL3!,
              L2: match.autoCoralDL2!,
              L1: match.autoCoralCDL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "D" ? "" : "D");
            }}
            className={
              styles.reefButton +
              " " +
              (deviceSetup.fieldOrientation === "processor" ?
                styles.reefButtonD
              : styles.reefButtonJ)
            }
          />
          <AutoReefButton
            selected={popperReef === "E"}
            coralStates={{
              L4: match.autoCoralEL4!,
              L3: match.autoCoralEL3!,
              L2: match.autoCoralEL2!,
              L1: match.autoCoralEFL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "E" ? "" : "E");
            }}
            className={
              styles.reefButton +
              " " +
              (deviceSetup.fieldOrientation === "processor" ?
                styles.reefButtonE
              : styles.reefButtonK)
            }
          />
          <AutoReefButton
            selected={popperReef === "F"}
            coralStates={{
              L4: match.autoCoralFL4!,
              L3: match.autoCoralFL3!,
              L2: match.autoCoralFL2!,
              L1: match.autoCoralEFL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "F" ? "" : "F");
            }}
            className={
              styles.reefButton +
              " " +
              (deviceSetup.fieldOrientation === "processor" ?
                styles.reefButtonF
              : styles.reefButtonL)
            }
          />
          <AutoReefButton
            selected={popperReef === "G"}
            coralStates={{
              L4: match.autoCoralGL4!,
              L3: match.autoCoralGL3!,
              L2: match.autoCoralGL2!,
              L1: match.autoCoralGHL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "G" ? "" : "G");
            }}
            className={
              styles.reefButton +
              " " +
              (deviceSetup.fieldOrientation === "processor" ?
                styles.reefButtonG
              : styles.reefButtonA)
            }
          />
          <AutoReefButton
            selected={popperReef === "H"}
            coralStates={{
              L4: match.autoCoralHL4!,
              L3: match.autoCoralHL3!,
              L2: match.autoCoralHL2!,
              L1: match.autoCoralGHL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "H" ? "" : "H");
            }}
            className={
              styles.reefButton +
              " " +
              (deviceSetup.fieldOrientation === "processor" ?
                styles.reefButtonH
              : styles.reefButtonB)
            }
          />
          <AutoReefButton
            selected={popperReef === "I"}
            coralStates={{
              L4: match.autoCoralIL4!,
              L3: match.autoCoralIL3!,
              L2: match.autoCoralIL2!,
              L1: match.autoCoralIJL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "I" ? "" : "I");
            }}
            className={
              styles.reefButton +
              " " +
              (deviceSetup.fieldOrientation === "processor" ?
                styles.reefButtonI
              : styles.reefButtonC)
            }
          />
          <AutoReefButton
            selected={popperReef === "J"}
            coralStates={{
              L4: match.autoCoralJL4!,
              L3: match.autoCoralJL3!,
              L2: match.autoCoralJL2!,
              L1: match.autoCoralIJL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "J" ? "" : "J");
            }}
            className={
              styles.reefButton +
              " " +
              (deviceSetup.fieldOrientation === "processor" ?
                styles.reefButtonJ
              : styles.reefButtonD)
            }
          />
          <AutoReefButton
            selected={popperReef === "K"}
            coralStates={{
              L4: match.autoCoralKL4!,
              L3: match.autoCoralKL3!,
              L2: match.autoCoralKL2!,
              L1: match.autoCoralKLL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "K" ? "" : "K");
            }}
            className={
              styles.reefButton +
              " " +
              (deviceSetup.fieldOrientation === "processor" ?
                styles.reefButtonK
              : styles.reefButtonE)
            }
          />
          <AutoReefButton
            selected={popperReef === "L"}
            coralStates={{
              L4: match.autoCoralLL4!,
              L3: match.autoCoralLL3!,
              L2: match.autoCoralLL2!,
              L1: match.autoCoralKLL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "L" ? "" : "L");
            }}
            className={
              styles.reefButton +
              " " +
              (deviceSetup.fieldOrientation === "processor" ?
                styles.reefButtonL
              : styles.reefButtonF)
            }
          />
          {popperReef !== "" && (
            <div
              className={styles.popper}
              ref={popperRef}>
              <ToggleButton
                className={styles.popperButton}
                value={
                  match[
                    ("autoCoral" + popperReef + "L4") as TeamMatchEntryColumn
                  ] as boolean
                }
                onChange={(value) => {
                  if (popperReef) {
                    setMatch({
                      ...match,
                      ["autoCoral" + popperReef + "L4"]: value,
                    });
                    setPopperReef("");
                  }
                }}>
                L4
              </ToggleButton>
              <ToggleButton
                className={styles.popperButton}
                value={
                  match[
                    ("autoCoral" + popperReef + "L3") as TeamMatchEntryColumn
                  ] as boolean
                }
                onChange={(value) => {
                  if (popperReef) {
                    setMatch({
                      ...match,
                      ["autoCoral" + popperReef + "L3"]: value,
                    });
                    setPopperReef("");
                  }
                }}>
                L3
              </ToggleButton>
              <ToggleButton
                className={styles.popperButton}
                value={
                  match[
                    ("autoCoral" + popperReef + "L2") as TeamMatchEntryColumn
                  ] as boolean
                }
                onChange={(value) => {
                  if (popperReef) {
                    setMatch({
                      ...match,
                      ["autoCoral" + popperReef + "L2"]: value,
                    });
                    setPopperReef("");
                  }
                }}>
                L2
              </ToggleButton>
              <SmallCounter id='auto-L1-counter' insideLabel='L1 - '
                value={
                  match[
                    ("autoCoral" +
                      {
                        A: "AB",
                        B: "AB",
                        C: "CD",
                        D: "CD",
                        E: "EF",
                        F: "EF",
                        G: "GH",
                        H: "GH",
                        I: "IJ",
                        J: "IJ",
                        K: "KL",
                        L: "KL",
                      }[popperReef] +
                      "L1") as TeamMatchEntryColumn
                  ] as number
                }
                setValue={(value) => {
                  if (popperReef) {
                    setMatch({
                      ...match,
                      ["autoCoral" +
                      {
                        A: "AB",
                        B: "AB",
                        C: "CD",
                        D: "CD",
                        E: "EF",
                        F: "EF",
                        G: "GH",
                        H: "GH",
                        I: "IJ",
                        J: "IJ",
                        K: "KL",
                        L: "KL",
                      }[popperReef] +
                      "L1"]: value,
                    });
                    setPopperReef("");
                  }
                }}
                max={6}
              />
            </div>
          )}
        </div>
      </div>
      <Divider orientation="vertical" />
      <div className={scoutStyles.half}>
        <ToggleButton
          value={match.died!}
          onChange={(value) => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              died: value,
            });
          }}
          classNameTrue={scoutStyles.redToggleButtonTrue}
          classNameFalse={scoutStyles.redToggleButtonFalse}
        >
          Robot Died
        </ToggleButton>
        <ToggleButton
          value={match.removedAlgaeFromReef!}
          onChange={(value) => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              removedAlgaeFromReef: value,
            });
          }}
          classNameTrue={scoutStyles.normalToggleButtonTrue}
          classNameFalse={scoutStyles.normalToggleButtonFalse}
      >
          Removed Algae from Reef
        </ToggleButton>
        <ToggleButton
          value={match.autoCrossedRSL!}
          onChange={(value) => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoCrossedRSL: value,
            });
          }}
          classNameTrue={scoutStyles.normalToggleButtonTrue}
          classNameFalse={scoutStyles.normalToggleButtonFalse}
       >
          Crossed Robot Starting Line
        </ToggleButton>
        <div className={styles.bargeAndProcessorContainer}>
          {/* height: `calc(100% - ${height}px)`, */}
          <div
            className={
              styles.processorContainerContainer +
              " " +
              scoutStyles.imageContainerContainer
            }>
            <div
              className={
                styles.processorContainer + " " + scoutStyles.imageContainer
              }
              onClick={() => {
                teleopTimeoutButtonClick();
                if (match.autoProcessor! < 10) {
                  setMatch({
                    ...match,
                    autoProcessor: match.autoProcessor! + 1,
                  });
                }
              }}>
              <img
                src={import.meta.env.BASE_URL + "assets/Processor.png"}
                className={scoutStyles.image}
              />
              <HalfSmallCounter
                value={match.autoProcessor!}
                setValue={(value) => {
                  teleopTimeoutButtonClick();
                  setMatch({
                    ...match,
                    autoProcessor: value,
                  });
                }}
                className={scoutStyles.imageCounter}
              />
            </div>
          </div>
          <div
            className={
              styles.bargeContainerContainer +
              " " +
              scoutStyles.imageContainerContainer
            }>
            <div
              className={
                styles.bargeContainer + " " + scoutStyles.imageContainer
              }
              onClick={() => {
                teleopTimeoutButtonClick();
                if (match.autoNet! < 10) {
                  setMatch({
                    ...match,
                    autoNet: match.autoNet! + 1,
                  });
                }
              }}>
              <img
                src={import.meta.env.BASE_URL + "assets/Net.png"}
                className={scoutStyles.image}
              />
              <HalfSmallCounter
                value={match.autoNet!}
                setValue={(value) => {
                  teleopTimeoutButtonClick();
                  setMatch({
                    ...match,
                    autoNet: value,
                  });
                }}
                className={scoutStyles.imageCounter}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
