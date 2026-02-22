import { TeamMatchEntry } from "@isa2026/api/src/utils/dbtypes.ts";
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
      <div className={scoutStyles.fieldContainer}>
        <h3>Data Confidence</h3>
        <div style={{ marginBottom: "1rem" }}>
          <label className={scoutStyles.formLabel} style={{ marginBottom: "0.5rem" }}>
            Confidence Level: {match.dataConfidence ?? 0}/10
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={match.dataConfidence ?? 0}
            onChange={(e) => {
              setMatch({
                ...match,
                dataConfidence: parseInt(e.target.value),
              });
            }}
            className={scoutStyles.rangeInput}
          />
          {dataConfidenceError && (
            <div className={scoutStyles.errorText}>
              {dataConfidenceError}
            </div>
          )}
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
