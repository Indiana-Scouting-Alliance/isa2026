import { TeamMatchEntry } from "@isa2026/api/src/utils/dbtypes.ts";
import ToggleButton from "../../components/Button/ToggleButton/ToggleButton.tsx";
import HalfSmallCounter from "../../components/Counter/HalfSmallCounter.tsx";
import Divider from "../../components/Divider/Divider.tsx";
import changeFlexDirection from "../../components/styles/ChangeFlexDirection.module.css";
import scoutStyles from "../../components/styles/ScoutStyles.module.css";
import styles from "./Teleop.module.css";

type TeleopProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
};
export function Teleop({ match, setMatch }: TeleopProps) {
  return (
    <div
      className={
        scoutStyles.contentContainer +
        " " +
        changeFlexDirection.changeFlexDirection
      }>
      <div className={scoutStyles.half + " " + styles.imagesContainer}>
        <div
          className={
            scoutStyles.imageContainerContainer +
            " " +
            styles.branchContainerContainer
          }>
          <div
            className={
              scoutStyles.imageContainer + " " + styles.branchContainer
            }>
            <img
              src={import.meta.env.BASE_URL + "assets/Branch.png"}
              className={scoutStyles.image}
            />
            <div
              className={
                styles.branchIncrementRect + " " + styles.L4IncrementRect
              }
              onClick={() => {
                if (match.teleopL4! < 12) {
                  setMatch({
                    ...match,
                    teleopL4: match.teleopL4! + 1,
                  });
                }
              }}></div>
            <HalfSmallCounter
              id="teleop-L4-counter"
              className={styles.L4Counter}
              value={match.teleopL4!}
              setValue={(value) => {
                setMatch({
                  ...match,
                  teleopL4: value,
                });
              }}
            />
            <div
              className={
                styles.branchIncrementRect + " " + styles.L3IncrementRect
              }
              onClick={() => {
                if (match.teleopL3! < 12) {
                  setMatch({
                    ...match,
                    teleopL3: match.teleopL3! + 1,
                  });
                }
              }}></div>
            <HalfSmallCounter
              value={match.teleopL3!}
              setValue={(value) => {
                setMatch({
                  ...match,
                  teleopL3: value,
                });
              }}
              className={styles.L3Counter}
              id="teleop-L3-counter"
            />
            <div
              className={
                styles.branchIncrementRect + " " + styles.L2IncrementRect
              }
              onClick={() => {
                if (match.teleopL2! < 12) {
                  setMatch({
                    ...match,
                    teleopL2: match.teleopL2! + 1,
                  });
                }
              }}></div>
            <HalfSmallCounter
              value={match.teleopL2!}
              setValue={(value) => {
                setMatch({
                  ...match,
                  teleopL2: value,
                });
              }}
              className={styles.L2Counter}
              id="teleop-L2-counter"
            />
            <div
              className={
                styles.branchIncrementRect + " " + styles.L1IncrementRect
              }
              onClick={() => {
                if (match.teleopL1! < 12) {
                  setMatch({
                    ...match,
                    teleopL1: match.teleopL1! + 1,
                  });
                }
              }}></div>
            <HalfSmallCounter
              value={match.teleopL1!}
              setValue={(value) => {
                setMatch({
                  ...match,
                  teleopL1: value,
                });
              }}
              className={styles.L1Counter}
              id="teleop-L1-counter"
            />
          </div>
        </div>
        <div className={styles.bargeAndProcessorContainer}>
          <div
            className={
              scoutStyles.imageContainerContainer +
              " " +
              styles.bargeContainerContainer
            }>
            <div
              className={
                scoutStyles.imageContainer + " " + styles.bargeContainer
              }
              onClick={() => {
                if (match.teleopNet! < 18) {
                  setMatch({
                    ...match,
                    teleopNet: match.teleopNet! + 1,
                  });
                }
              }}>
              <img
                src={import.meta.env.BASE_URL + "assets/Net.png"}
                className={scoutStyles.image}
              />
              <HalfSmallCounter
                value={match.teleopNet!}
                setValue={(value) => {
                  setMatch({
                    ...match,
                    teleopNet: value,
                  });
                }}
                className={scoutStyles.imageCounter}
                id="teleop-net-counter"
              />
            </div>
          </div>
          <div
            className={
              scoutStyles.imageContainerContainer +
              " " +
              styles.processorContainerContainer
            }>
            <div
              className={
                scoutStyles.imageContainer + " " + styles.processorContainer
              }
              onClick={() => {
                if (match.teleopProcessor! < 18) {
                  setMatch({
                    ...match,
                    teleopProcessor: match.teleopProcessor! + 1,
                  });
                }
              }}>
              <img
                src={import.meta.env.BASE_URL + "assets/Processor.png"}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              />
              <HalfSmallCounter
                value={match.teleopProcessor!}
                setValue={(value) => {
                  setMatch({
                    ...match,
                    teleopProcessor: value,
                  });
                }}
                className={scoutStyles.imageCounter}
                id="teleop-processor-counter"
              />
            </div>
          </div>
        </div>
      </div>
      <Divider orientation="vertical" />
      <div className={scoutStyles.half}>
        <ToggleButton
          classNameTrue={scoutStyles.redToggleButtonTrue}
          classNameFalse={scoutStyles.redToggleButtonFalse}
          value={match.died!}
          onChange={(value) =>
            setMatch({
              ...match,
              died: value,
            })
          }>
          Robot Died
        </ToggleButton>
        <ToggleButton
          classNameTrue={scoutStyles.normalToggleButtonTrue}
          classNameFalse={scoutStyles.normalToggleButtonFalse}
          value={match.removedAlgaeFromReef!}
          onChange={(value) =>
            setMatch({
              ...match,
              removedAlgaeFromReef: value,
            })
          }>
          Removed Algae from Reef
        </ToggleButton>
        <ToggleButton
          classNameTrue={scoutStyles.normalToggleButtonTrue}
          classNameFalse={scoutStyles.normalToggleButtonFalse}
          value={match.playedDefense!}
          onChange={(value) =>
            setMatch({
              ...match,
              playedDefense: value,
            })
          }>
          Played Defense
        </ToggleButton>
        <div className={styles.climbToggleButtons}>
          <div className={styles.climbToggleButtonRow}>
            <ToggleButton
              classNameTrue={scoutStyles.normalToggleButtonTrue}
              classNameFalse={scoutStyles.normalToggleButtonFalse}
              className={styles.climbToggle}
              value={match.teleopAttemptedShallow!}
              onChange={(value) => {
                if (value) {
                  setMatch({
                    ...match,
                    teleopAttemptedShallow: value,
                    teleopAttemptedDeep: false,
                    teleopSuccessfulShallow: false,
                    teleopSuccessfulDeep: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    teleopAttemptedShallow: value,
                    teleopSuccessfulShallow: false,
                  });
                }
              }}>
              Attempted Shallow Climb
            </ToggleButton>
            <ToggleButton
              classNameTrue={scoutStyles.normalToggleButtonTrue}
              classNameFalse={scoutStyles.normalToggleButtonFalse}
              className={styles.climbToggle}
              value={match.teleopAttemptedDeep!}
              onChange={(value) => {
                if (value) {
                  setMatch({
                    ...match,
                    teleopAttemptedShallow: false,
                    teleopAttemptedDeep: value,
                    teleopSuccessfulShallow: false,
                    teleopSuccessfulDeep: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    teleopAttemptedDeep: value,
                    teleopSuccessfulDeep: false,
                  });
                }
              }}>
              Attempted Deep Climb
            </ToggleButton>
          </div>
          <div className={styles.climbToggleButtonRow}>
            <ToggleButton
              classNameTrue={scoutStyles.normalToggleButtonTrue}
              classNameFalse={scoutStyles.normalToggleButtonFalse}
              className={styles.climbToggle}
              value={match.teleopSuccessfulShallow!}
              onChange={(value) => {
                if (!match.teleopSuccessfulShallow) {
                  setMatch({
                    ...match,
                    teleopAttemptedShallow: true,
                    teleopAttemptedDeep: false,
                    teleopSuccessfulShallow: value,
                    teleopSuccessfulDeep: false,
                    teleopPark: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    teleopSuccessfulShallow: value,
                  });
                }
              }}>
              Successful Shallow Climb
            </ToggleButton>
            <ToggleButton
              classNameTrue={scoutStyles.normalToggleButtonTrue}
              classNameFalse={scoutStyles.normalToggleButtonFalse}
              className={styles.climbToggle}
              value={match.teleopSuccessfulDeep!}
              onChange={(value) => {
                if (value) {
                  setMatch({
                    ...match,
                    teleopAttemptedShallow: false,
                    teleopAttemptedDeep: true,
                    teleopSuccessfulShallow: false,
                    teleopSuccessfulDeep: value,
                    teleopPark: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    teleopSuccessfulDeep: value,
                  });
                }
              }}>
              Successful Deep Climb
            </ToggleButton>
          </div>
        </div>
        <ToggleButton
          classNameTrue={scoutStyles.normalToggleButtonTrue}
          classNameFalse={scoutStyles.normalToggleButtonFalse}
          value={match.teleopPark!}
          onChange={(value) => {
            if (value) {
              setMatch({
                ...match,
                teleopPark: value,
                teleopSuccessfulShallow: false,
                teleopSuccessfulDeep: false,
              });
            } else {
              setMatch({
                ...match,
                teleopPark: value,
              });
            }
          }}>
          Parked
        </ToggleButton>
      </div>
    </div>
  );
}
