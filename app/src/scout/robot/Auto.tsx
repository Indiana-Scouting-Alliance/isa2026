import { useState } from "react";
import {
  TeamMatchEntry,
} from "@isa2026/api/src/utils/dbtypes.ts";
import ToggleButton from "../../components/Button/ToggleButton/ToggleButton.tsx";
import TransparentToggle from "../../components/Button/ToggleButton/TransparentToggle/TransparentToggle.tsx";
import FuelCounter from "../../components/Counter/FuelCounter.tsx";
import Divider from "../../components/Divider/Divider.tsx";
import changeFlexDirection from "../../components/styles/ChangeFlexDirection.module.css";
import scoutStyles from "../../components/styles/ScoutStyles.module.css";
import { DeviceSetupObj } from "../../setup/DeviceSetup.tsx";
import FieldImage from "../../components/FieldImage/FieldImage.tsx";
import scoreLocationStyles from "../../components/styles/ScoreLocationStyles.module.css";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer.tsx";
import ClimbPositionModal from "../../components/ClimbPositionModal/ClimbPositionModal.tsx";

type AutoProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  deviceSetup: DeviceSetupObj;
};
export default function Auto({
  match,
  setMatch,
  deviceSetup,
}: AutoProps) {
  const [climbModalOpen, setClimbModalOpen] = useState(false);

  const handleValueChange = (key: keyof TeamMatchEntry, value: boolean|number) => {
    setMatch({
      ...match,
      [key]: value,
    });
  };
  
  return (
    <div
      className={
        scoutStyles.contentContainer +
        " " +
        changeFlexDirection.changeFlexDirection
      }>
      <div className={scoutStyles.half}>
        <label className={scoutStyles.label}>Scoring Locations</label>
        <FieldImage deviceSetup={deviceSetup}>
          {([
            { key: "autoFuelScoredFromOutpost", className: "fuelScoreSpotOutpost", label: "Outpost" },
            { key: "autoFuelScoredFromTrenchOutpost", className: "fuelScoreSpotTrenchLower", label: "Trench Outpost" },
            { key: "autoFuelScoredFromTrenchDepot", className: "fuelScoreSpotTrenchUpper", label: "Trench Depot" },
            { key: "autoFuelScoredFromTower", className: "fuelScoreSpotTower", label: "Tower" },
            { key: "autoFuelScoredFromHub", className: "fuelScoreSpotHub", label: "Hub" },
            { key: "autoFuelScoredFromBumpOutpost", className: "fuelScoreSpotBumpLower", label: "Bump Outpost" },
            { key: "autoFuelScoredFromBumpDepot", className: "fuelScoreSpotBumpUpper", label: "Bump Depot" },
            { key: "autoFuelScoredFromDepot", className: "fuelScoreSpotDepot", label: "Depot" },
            { key: "autoFuelScoredFromOther", className: "fuelScoreSpotOther", label: "Other" },
          ] as const).map(({ key, className, label }) => (
            <TransparentToggle
              key={key}
              value={match[key] ?? false}
              setValue={(value) => handleValueChange(key, value)}
              error={false}
              className={scoreLocationStyles[className]}
              label={label}
            />
          ))}
        </FieldImage>
      </div>

      <Divider orientation="vertical" />

      <div className={scoutStyles.half}>
        <FuelCounter
          label="AUTO Fuel Scoring"
          value={match.autoFuelScored ?? 0}
          setValue={(value) => handleValueChange("autoFuelScored", value)}
        />

        <div className={scoutStyles.traverseRow}>
          <LabeledContainer label="Traverse?" className={scoutStyles.traverseContainer} bodyClass={scoutStyles.toggleButtonGroupSpaced}>
              {([
                { key: "autoRobotTraverseTrench", label: "Trench" },
                { key: "autoRobotTraverseBump", label: "Bump" },
              ] as const).map(({ key, label }) => (
                <ToggleButton
                  key={key}
                  label={label}
                  value={match[key] ?? false}
                  onChange={(value) => handleValueChange(key, value)}
                />
              ))}
          </LabeledContainer>
          <ToggleButton
            label="Fuel Passed"
            className={scoutStyles.fuelPassedButton}
            value={match.autoFuelPassed ?? false}
            onChange={(value) => handleValueChange("autoFuelPassed", value)}
          />
        </div>

        <LabeledContainer label="Stuck?">
          <div className={scoutStyles.toggleButtonGroupSpaced}>
            {([
              { key: "autoRobotStuckTrench", label: "Trench" },
              { key: "autoRobotStuckBump", label: "Bump" },
              { key: "autoRobotStuckFuel", label: "Fuel" },
              { key: "autoRobotTipped", label: "Tipped" },
            ] as const).map(({ key, label }) => (
              <ToggleButton
                key={key}
                label={label}
                value={match[key] ?? false}
                onChange={(value) => handleValueChange(key, value)}
              />
            ))}
          </div>
        </LabeledContainer>

        <ToggleButton
          value="climb"
          selected={!!match.autoClimbPosition}
          onClick={() => setClimbModalOpen(true)}
          label={match.autoClimbPosition ? `Climb: ${match.autoClimbPosition}` : "Climb: None"}
        />
        <ClimbPositionModal
          open={climbModalOpen}
          onClose={() => setClimbModalOpen(false)}
          value={match.autoClimbPosition}
          onChange={(value) => setMatch({ ...match, autoClimbPosition: value, autoClimbAttempted: !!value })}
          deviceSetup={deviceSetup}
        />

        <ToggleButton
          label="Robot Died"
          className={scoutStyles.diedButton}
          value={match.died ?? false}
          onChange={(value) => handleValueChange("died", value)}
          classNameTrue={scoutStyles.redToggleButtonTrue}
          classNameFalse={scoutStyles.redToggleButtonFalse}
        />
      </div>
    </div>
  );
}
