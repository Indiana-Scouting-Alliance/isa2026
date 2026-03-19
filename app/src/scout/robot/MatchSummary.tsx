import { TeamMatchEntry } from "@isa2026/api/src/utils/dbtypes.ts";
import styles from "./Postmatch.module.css";

function boolDisplay(value: boolean | null | undefined): string {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "—";
}

function numDisplay(value: number | null | undefined): string {
  if (value == null) return "—";
  return String(value);
}

function estimateFuelScored(
  allianceTotal: number | null | undefined,
  percentage: number | null | undefined
): number | null {
  if (allianceTotal == null || percentage == null) return null;
  return Math.round((allianceTotal * percentage) / 100);
}

function climbDisplay(
  attempted: boolean | null | undefined,
  level: number | null | undefined,
  position: string | null | undefined
): string {
  if (!attempted) return "Not attempted";
  const parts: string[] = [];
  if (level != null) parts.push(`L${level}`);
  if (position) parts.push(position);
  return parts.length > 0 ? parts.join(" @ ") : "Attempted";
}

function getScoringLocations(
  match: TeamMatchEntry,
  prefix: "auto" | "tele"
): string[] {
  const locations: [string, boolean | null | undefined][] = [
    ["Hub", match[`${prefix}FuelScoredFromHub`]],
    ["Tower", match[`${prefix}FuelScoredFromTower`]],
    ["Depot", match[`${prefix}FuelScoredFromDepot`]],
    ["Outpost", match[`${prefix}FuelScoredFromOutpost`]],
    ["Trench (Outpost)", match[`${prefix}FuelScoredFromTrenchOutpost`]],
    ["Trench (Depot)", match[`${prefix}FuelScoredFromTrenchDepot`]],
    ["Bump (Outpost)", match[`${prefix}FuelScoredFromBumpOutpost`]],
    ["Bump (Depot)", match[`${prefix}FuelScoredFromBumpDepot`]],
    ["Other", match[`${prefix}FuelScoredFromOther`]],
  ];
  return locations.filter(([, v]) => v === true).map(([name]) => name);
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className={styles.summaryRow}>
      <span className={styles.summaryLabel}>{label}</span>
      <span className={styles.summaryValue}>{value}</span>
    </div>
  );
}

type MatchSummaryProps = {
  match: TeamMatchEntry;
};

export default function MatchSummary({ match }: MatchSummaryProps) {
  const autoLocations = getScoringLocations(match, "auto");
  const teleLocations = getScoringLocations(match, "tele");
  const estimatedAutoFuelScored =
    match.autoFuelScored ??
    estimateFuelScored(
      match.totalAllianceFuelScoredScoutAuto,
      match.autoFuelScoredPercentage
    );
  const estimatedTeleFuelScored =
    match.teleFuelScored ??
    estimateFuelScored(
      match.totalAllianceFuelScoredScoutTele,
      match.teleFuelScoredPercentage
    );
  const totalEstimatedFuelScored =
    estimatedAutoFuelScored != null && estimatedTeleFuelScored != null ?
      estimatedAutoFuelScored + estimatedTeleFuelScored
    : null;

  return (
    <div className={styles.summaryContainer}>
      {/* Total summary */}
      <div className={styles.summaryHighlight}>
        <span>Estimated Robot Fuel Scored</span>
        <span>{numDisplay(totalEstimatedFuelScored)}</span>
      </div>

      {/* Auto section */}
      <div className={styles.summarySection}>
        <div className={styles.sectionTitle}>Auto</div>
        <SummaryRow
          label="Start Zone"
          value={match.startZone ?? "—"}
        />
        <SummaryRow
          label="Alliance Fuel (Scout)"
          value={numDisplay(match.totalAllianceFuelScoredScoutAuto)}
        />
        <SummaryRow
          label="Robot Fuel %"
          value={
            match.autoFuelScoredPercentage == null ?
              "—"
            : `${match.autoFuelScoredPercentage}%`
          }
        />
        <SummaryRow
          label="Estimated Robot Fuel"
          value={numDisplay(estimatedAutoFuelScored)}
        />
        <SummaryRow
          label="Scoring Locations"
          value={autoLocations.length > 0 ? autoLocations.join(", ") : "—"}
        />
        <SummaryRow
          label="Fuel Passed"
          value={boolDisplay(match.autoFuelPassed)}
        />
        <SummaryRow
          label="Climb"
          value={climbDisplay(
            match.autoClimbAttempted,
            match.autoClimbLevel,
            match.autoClimbPosition
          )}
        />
        <SummaryRow
          label="Traverse Trench"
          value={boolDisplay(match.autoRobotTraverseTrench)}
        />
        <SummaryRow
          label="Traverse Bump"
          value={boolDisplay(match.autoRobotTraverseBump)}
        />
        <SummaryRow
          label="Got Stuck"
          value={boolDisplay(match.autoRobotGotStuck)}
        />
        <SummaryRow
          label="Tipped"
          value={boolDisplay(match.autoRobotTipped)}
        />
      </div>

      {/* Teleop section */}
      <div className={styles.summarySection}>
        <div className={styles.sectionTitle}>Teleop</div>
        <SummaryRow
          label="Alliance Fuel (Scout)"
          value={numDisplay(match.totalAllianceFuelScoredScoutTele)}
        />
        <SummaryRow
          label="Robot Fuel %"
          value={
            match.teleFuelScoredPercentage == null ?
              "—"
            : `${match.teleFuelScoredPercentage}%`
          }
        />
        <SummaryRow
          label="Estimated Robot Fuel"
          value={numDisplay(estimatedTeleFuelScored)}
        />
        <SummaryRow
          label="Cycles"
          value={numDisplay(match.teleCycles)}
        />
        <SummaryRow
          label="Scoring Locations"
          value={teleLocations.length > 0 ? teleLocations.join(", ") : "—"}
        />
        <SummaryRow
          label="Fuel Passed"
          value={boolDisplay(match.teleFuelPassed)}
        />
        <SummaryRow
          label="Traverse Trench"
          value={boolDisplay(match.teleRobotTraverseTrench)}
        />
        <SummaryRow
          label="Traverse Bump"
          value={boolDisplay(match.teleRobotTraverseBump)}
        />
        <SummaryRow
          label="Tipped"
          value={boolDisplay(match.teleRobotTipped)}
        />
        <SummaryRow
          label="Defense Effectiveness"
          value={numDisplay(match.teleInactiveDefenseRoleEffectiveness)}
        />
        <SummaryRow
          label="Intaking Effectiveness"
          value={numDisplay(match.teleInactiveIntakingRoleEffectiveness)}
        />
      </div>

      {/* End Game */}
      <div className={styles.summarySection}>
        <div className={styles.sectionTitle}>End Game</div>
        <SummaryRow
          label="Climb"
          value={climbDisplay(
            match.endClimbAttempted,
            null,
            match.endClimbPosition
          )}
        />
        <SummaryRow
          label="Robot Died"
          value={boolDisplay(match.died)}
        />
        <SummaryRow
          label="No Show"
          value={boolDisplay(match.noShow)}
        />
      </div>
    </div>
  );
}
