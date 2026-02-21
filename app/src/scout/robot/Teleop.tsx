import { TeamMatchEntry } from "@isa2026/api/src/utils/dbtypes.ts";
import ToggleButton from "../../components/Button/ToggleButton/ToggleButton.tsx";
import Divider from "../../components/Divider/Divider.tsx";
import changeFlexDirection from "../../components/styles/ChangeFlexDirection.module.css";
import scoutStyles from "../../components/styles/ScoutStyles.module.css";

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
      <div className={scoutStyles.half}>
        <h3>Fuel Scoring Locations</h3>
        <div className={scoutStyles.toggleButtonGroup}>
          <ToggleButton
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.normalToggleButtonFalse}
            value={match.teleFuelScoredFromHub ?? false}
            onChange={(value) =>
              setMatch({
                ...match,
                teleFuelScoredFromHub: value,
              })
            }>
            Hub
          </ToggleButton>
          <ToggleButton
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.normalToggleButtonFalse}
            value={match.teleFuelScoredFromTower ?? false}
            onChange={(value) =>
              setMatch({
                ...match,
                teleFuelScoredFromTower: value,
              })
            }>
            Tower
          </ToggleButton>
          <ToggleButton
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.normalToggleButtonFalse}
            value={match.teleFuelScoredFromDepot ?? false}
            onChange={(value) =>
              setMatch({
                ...match,
                teleFuelScoredFromDepot: value,
              })
            }>
            Depot
          </ToggleButton>
          <ToggleButton
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.normalToggleButtonFalse}
            value={match.teleFuelScoredFromOutpost ?? false}
            onChange={(value) =>
              setMatch({
                ...match,
                teleFuelScoredFromOutpost: value,
              })
            }>
            Outpost
          </ToggleButton>
          <ToggleButton
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.normalToggleButtonFalse}
            value={match.teleFuelScoredFromTrench ?? false}
            onChange={(value) =>
              setMatch({
                ...match,
                teleFuelScoredFromTrench: value,
              })
            }>
            Trench
          </ToggleButton>
          <ToggleButton
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.normalToggleButtonFalse}
            value={match.teleFuelScoredFromBump ?? false}
            onChange={(value) =>
              setMatch({
                ...match,
                teleFuelScoredFromBump: value,
              })
            }>
            Bump
          </ToggleButton>
          <ToggleButton
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.normalToggleButtonFalse}
            value={match.teleFuelScoredFromOther ?? false}
            onChange={(value) =>
              setMatch({
                ...match,
                teleFuelScoredFromOther: value,
              })
            }>
            Other
          </ToggleButton>
        </div>

        <div className={scoutStyles.fieldSpacing}>
          <label className={scoutStyles.formLabel}>
            Fuel Scored: {match.teleFuelScored ?? 0}
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={match.teleFuelScored ?? 0}
            onChange={(e) => {
              setMatch({
                ...match,
                teleFuelScored: parseInt(e.target.value),
              });
            }}
            className={scoutStyles.numberInput}
          />
        </div>

        <div className={scoutStyles.fieldSpacing}>
          <label className={scoutStyles.formLabel}>
            Cycles: {match.teleCycles ?? 0}
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={match.teleCycles ?? 0}
            onChange={(e) => {
              setMatch({
                ...match,
                teleCycles: parseInt(e.target.value),
              });
            }}
            className={scoutStyles.numberInput}
          />
        </div>

        <Divider orientation="horizontal" />

        <h3>Inactive Roles</h3>
        <div className={scoutStyles.fieldSpacing}>
          <label className={scoutStyles.formLabel}>
            Defense Effectiveness: {match.teleInactiveDefenseRoleEffectiveness ?? 0}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={match.teleInactiveDefenseRoleEffectiveness ?? 0}
            onChange={(e) => {
              setMatch({
                ...match,
                teleInactiveDefenseRoleEffectiveness: parseInt(e.target.value),
              });
            }}
            className={scoutStyles.rangeInput}
          />
        </div>
        <div className={scoutStyles.fieldSpacing}>
          <label className={scoutStyles.formLabel}>
            Intaking Effectiveness: {match.teleInactiveIntakingRoleEffectiveness ?? 0}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={match.teleInactiveIntakingRoleEffectiveness ?? 0}
            onChange={(e) => {
              setMatch({
                ...match,
                teleInactiveIntakingRoleEffectiveness: parseInt(e.target.value),
              });
            }}
            className={scoutStyles.rangeInput}
          />
        </div>
        <div className={scoutStyles.fieldSpacing}>
          <label className={scoutStyles.formLabel}>
            Feeding Effectiveness: {match.teleInactiveFeedingRoleEffectiveness ?? 0}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={match.teleInactiveFeedingRoleEffectiveness ?? 0}
            onChange={(e) => {
              setMatch({
                ...match,
                teleInactiveFeedingRoleEffectiveness: parseInt(e.target.value),
              });
            }}
            className={scoutStyles.rangeInput}
          />
        </div>
        <div className={scoutStyles.fieldSpacing}>
          <label className={scoutStyles.formLabel}>
            Fuel Passed: {match.teleInactiveFuelPassed ?? 0}
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={match.teleInactiveFuelPassed ?? 0}
            onChange={(e) => {
              setMatch({
                ...match,
                teleInactiveFuelPassed: parseInt(e.target.value),
              });
            }}
            className={scoutStyles.numberInput}
          />
        </div>
      </div>
      <Divider orientation="vertical" />
      <div className={scoutStyles.half}>
        <h3>Robot Traverse</h3>
        <div className={scoutStyles.toggleButtonGroup}>
          <ToggleButton
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.normalToggleButtonFalse}
            value={match.robotTraverseTrench ?? false}
            onChange={(value) =>
              setMatch({
                ...match,
                robotTraverseTrench: value,
              })
            }>
            Trench
          </ToggleButton>
          <ToggleButton
            classNameTrue={scoutStyles.normalToggleButtonTrue}
            classNameFalse={scoutStyles.normalToggleButtonFalse}
            value={match.robotTraverseBump ?? false}
            onChange={(value) =>
              setMatch({
                ...match,
                robotTraverseBump: value,
              })
            }>
            Bump
          </ToggleButton>
        </div>

        <Divider orientation="horizontal" />

        <h3>Endgame</h3>
        <ToggleButton
          classNameTrue={scoutStyles.normalToggleButtonTrue}
          classNameFalse={scoutStyles.normalToggleButtonFalse}
          value={match.endClimbAttempted ?? false}
          onChange={(value) =>
            setMatch({
              ...match,
              endClimbAttempted: value,
            })
          }>
          Climb Attempted
        </ToggleButton>

        <Divider orientation="horizontal" />

        <h3>Other</h3>
        <ToggleButton
          classNameTrue={scoutStyles.redToggleButtonTrue}
          classNameFalse={scoutStyles.redToggleButtonFalse}
          value={match.died ?? false}
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
          value={match.robotGotStuck ?? false}
          onChange={(value) =>
            setMatch({
              ...match,
              robotGotStuck: value,
            })
          }>
          Robot Got Stuck
        </ToggleButton>
      </div>
    </div>
  );
}
