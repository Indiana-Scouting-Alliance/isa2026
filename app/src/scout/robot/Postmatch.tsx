import { TeamMatchEntry } from "@isa2026/api/src/utils/dbtypes.ts";
import TextArea from "../../components/Input/TextArea.tsx";
import Divider from "../../components/Divider/Divider.tsx";
import changeFlexDirection from "../../components/styles/ChangeFlexDirection.module.css";
import scoutStyles from "../../components/styles/ScoutStyles.module.css";
import styles from "./Postmatch.module.css";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer.tsx";
import RangeInput from "../../components/Input/RangeInput/RangeInput.tsx";
import MatchSummary from "./MatchSummary.tsx";
import ToggleButton from "../../components/Button/ToggleButton/ToggleButton.tsx";

type PostmatchProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  dataConfidenceError: string;
  fuelPercentagesDiscussedError: string;
};
export default function Postmatch({
  match,
  setMatch,
  dataConfidenceError,
  fuelPercentagesDiscussedError,
}: PostmatchProps) {
  return (
    <div
      className={
        scoutStyles.contentContainer +
        " " +
        changeFlexDirection.changeFlexDirection
      }>
      <div className={scoutStyles.half}>
        <MatchSummary match={match} />
      </div>

      <Divider orientation="vertical" />

      <div className={`${scoutStyles.half} ${styles.postmatchFormColumn}`}>
        <div className={styles.fuelFieldsGroup}>
        <LabeledContainer label="Data confidence" showOuterBorder={false}>
          <RangeInput
            min={0}
            max={10}
            value={match.dataConfidence ?? 0}
            onChange={(value) => setMatch({...match, dataConfidence: value})}
          />
          {dataConfidenceError && (
            <div className={scoutStyles.errorText}>{dataConfidenceError}</div>
          )}
        </LabeledContainer>

        
          <ToggleButton
            label="Fuel Percentages Discussed With All Scouts?"
            value={match.fuelPercentagesDiscussed ?? false}
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.redToggleButtonFalse}
            onChange={(value) =>
              setMatch({ ...match, fuelPercentagesDiscussed: value })
            }
          />
          {fuelPercentagesDiscussedError && (
            <div className={scoutStyles.errorText}>{fuelPercentagesDiscussedError}</div>
          )}
       

        <LabeledContainer
          label="Fuel Score (0-10)"
          bodyClass={styles.postmatchBody}
        >
          <RangeInput
            min={0}
            max={10}
            value={match.fuelQualitative ?? 0}
            onChange={(value) => setMatch({ ...match, fuelQualitative: value })}
          />
        </LabeledContainer>

        <LabeledContainer
          label="Total Alliance Fuel Scored Auto (On Screen)"
          bodyClass={styles.postmatchBody}
        >
          <input
            className={styles.numberInput}
            type="number"
            min={0}
            step={1}
            value={match.totalAllianceFuelScoredScoutAuto ?? ""}
            onChange={(event) => {
              const nextValue = event.currentTarget.value;
              setMatch({
                ...match,
                totalAllianceFuelScoredScoutAuto:
                  nextValue === "" ? null : Number(nextValue),
              });
            }}
          />
        </LabeledContainer>
        <LabeledContainer
          label="Total Alliance Fuel Scored Teleop (On Screen)"
          bodyClass={styles.postmatchBody}
        >
          <input
            className={styles.numberInput}
            type="number"
            min={0}
            step={1}
            value={match.totalAllianceFuelScoredScoutTele ?? ""}
            onChange={(event) => {
              const nextValue = event.currentTarget.value;
              setMatch({
                ...match,
                totalAllianceFuelScoredScoutTele:
                  nextValue === "" ? null : Number(nextValue),
              });
            }}
          />
        </LabeledContainer>
        </div>

        <TextArea
          id="postmatch-comments"
          label="Comments"
          rows={8}
          inputClassName={styles.commentsInput}
          value={match.comments ?? ""}
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
