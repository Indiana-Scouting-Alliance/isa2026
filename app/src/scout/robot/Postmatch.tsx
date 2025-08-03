import { TeamMatchEntry } from "@isa2026/api/src/utils/dbtypes.ts";
import ToggleButton from "../../components/Button/ToggleButton/ToggleButton.tsx";
import ToggleButtonGroup from "../../components/Button/ToggleButton/ToggleButtonGroup.tsx";
import Divider from "../../components/Divider/Divider.tsx";
import Checkbox from "../../components/Input/Checkbox/Checkbox.tsx";
import TextArea from "../../components/Input/TextArea.tsx";
import changeFlexDirection from "../../components/styles/ChangeFlexDirection.module.css";
import scoutStyles from "../../components/styles/ScoutStyles.module.css";
import styles from "./Postmatch.module.css";

type PostmatchProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  dataConfidenceError: string;
};
export default function Postmatch({
  match,
  setMatch,
  dataConfidenceError,
}: PostmatchProps) {
  return (
    <div
      className={
        scoutStyles.contentContainer +
        " " +
        changeFlexDirection.changeFlexDirection
      }>
      <div className={scoutStyles.half}>
        <label className={styles.goodAtLabel}>
          Did they do any of the following exceptionally well?
          <div className={styles.goodAtCheckboxes}>
            <Checkbox
              id="good-at-coral-l1"
              label="Coral L1"
              value={match.goodAtCoralL1!}
              onChange={(value) => {
                setMatch({
                  ...match,
                  goodAtCoralL1: value,
                });
              }}
            />
            <Checkbox
              id="good-at-coral-l2"
              label="Coral L2"
              value={match.goodAtCoralL2!}
              onChange={(value) => {
                setMatch({
                  ...match,
                  goodAtCoralL2: value,
                });
              }}
            />
            <Checkbox
              id="good-at-coral-l3"
              label="Coral L3"
              value={match.goodAtCoralL3!}
              onChange={(value) => {
                setMatch({
                  ...match,
                  goodAtCoralL3: value,
                });
              }}
            />
            <Checkbox
              id="good-at-coral-l4"
              label="Coral L4"
              value={match.goodAtCoralL4!}
              onChange={(value) => {
                setMatch({
                  ...match,
                  goodAtCoralL4: value,
                });
              }}
            />
            <Checkbox
              id="good-at-algae-net"
              label="Algae in Net"
              value={match.goodAtAlgaeNet!}
              onChange={(value) => {
                setMatch({
                  ...match,
                  goodAtAlgaeNet: value,
                });
              }}
            />
            <Checkbox
              id="good-at-algae-processor"
              label="Algae in Processor"
              value={match.goodAtAlgaeProcessor!}
              onChange={(value) => {
                setMatch({
                  ...match,
                  goodAtAlgaeProcessor: value,
                });
              }}
            />
            <Checkbox
              id="good-at-climb"
              label="Climb"
              value={match.goodAtClimb!}
              onChange={(value) => {
                setMatch({
                  ...match,
                  goodAtClimb: value,
                });
              }}
            />
            <Checkbox
              id="good-at-defense"
              label="Defense"
              value={match.goodAtDefense!}
              onChange={(value) => {
                setMatch({
                  ...match,
                  goodAtDefense: value,
                });
              }}
            />
            <Checkbox
              id="good-at-working-with-alliance"
              label="Working with Alliance"
              value={match.goodAtWorkingWithAlliance!}
              onChange={(value) => {
                setMatch({
                  ...match,
                  goodAtWorkingWithAlliance: value,
                });
              }}
            />
            <Checkbox
              id="good-at-driving"
              label="Driving"
              value={match.goodAtDriving!}
              onChange={(value) => {
                setMatch({
                  ...match,
                  goodAtDriving: value,
                });
              }}
            />
            <Checkbox
              id="good-at-auto"
              label="Auto"
              value={match.goodAtAuto!}
              onChange={(value) => {
                setMatch({
                  ...match,
                  goodAtAuto: value,
                });
              }}
            />
          </div>
        </label>
      </div>
      <Divider orientation="vertical" />
      <div className={scoutStyles.half}>
        <ToggleButtonGroup
          value={match.dataConfidence || ""}
          onChange={(value) => {
            setMatch({
              ...match,
              dataConfidence: (value === "" ? null : value) as
                | "low"
                | "neutral"
                | "high"
                | null,
            });
          }}
          label="Data Confidence"
          error={dataConfidenceError !== ""}
          helperText={dataConfidenceError}>
          <ToggleButton
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.normalToggleButtonFalse}
            className={styles.dataConfidenceToggle}
            value="low">
            Low
          </ToggleButton>
          <ToggleButton
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.normalToggleButtonFalse}
            className={styles.dataConfidenceToggle}
            value="neutral">
            Neutral
          </ToggleButton>
          <ToggleButton
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.normalToggleButtonFalse}
            className={styles.dataConfidenceToggle}
            value="high">
            High
          </ToggleButton>
        </ToggleButtonGroup>
        <TextArea
          id="postmatch-comments"
          label="Comments"
          rows={5}
          inputClassName={styles.commentsInput}
          value={match.comments!}
          onChange={(value) => {
            setMatch({
              ...match,
              comments: value.replace(/"/g, "'"),
            });
          }}
        />
      </div>
    </div>
  );
}
