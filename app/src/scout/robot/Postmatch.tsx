import { TeamMatchEntry } from "@isa2026/api/src/utils/dbtypes.ts";
import TextArea from "../../components/Input/TextArea.tsx";
import Divider from "../../components/Divider/Divider.tsx";
import changeFlexDirection from "../../components/styles/ChangeFlexDirection.module.css";
import scoutStyles from "../../components/styles/ScoutStyles.module.css";
import styles from "./Postmatch.module.css";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer.tsx";
import RangeInput from "../../components/Input/RangeInput/RangeInput.tsx";
import MatchSummary from "./MatchSummary.tsx";

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
        <MatchSummary match={match} />
      </div>

      <Divider orientation="vertical" />

      <div className={scoutStyles.half}>
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
