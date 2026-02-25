import { useState } from "react";
import { TeamMatchEntry } from "@isa2026/api/src/utils/dbtypes.ts";
import ToggleButton from "../../components/Button/ToggleButton/ToggleButton.tsx";
import TransparentToggle from "../../components/Button/ToggleButton/TransparentToggle/TransparentToggle.tsx";
import FuelCounter from "../../components/Counter/FuelCounter.tsx";
import Divider from "../../components/Divider/Divider.tsx";
import RangeInput from "../../components/Input/RangeInput/RangeInput.tsx";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer.tsx";
import changeFlexDirection from "../../components/styles/ChangeFlexDirection.module.css";
import scoutStyles from "../../components/styles/ScoutStyles.module.css";
import FieldImage from "../../components/FieldImage/FieldImage.tsx";
import scoreLocationStyles from "../../components/styles/ScoreLocationStyles.module.css";
import teleopStyles from "./Teleop.module.css";
import { DeviceSetupObj } from "../../setup/DeviceSetup.tsx";
import ClimbPositionModal from "../../components/ClimbPositionModal/ClimbPositionModal.tsx";

type TeleopProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  deviceSetup: DeviceSetupObj;
};

type TeleopMode = "active" | "inactive";

export function Teleop({ match, setMatch, deviceSetup }: TeleopProps) {
  const [mode, setMode] = useState<TeleopMode>("active");

  const handleToggleChange = (key: keyof TeamMatchEntry, value: boolean | number) => {
    setMatch({
      ...match,
      [key]: value,
    });
  };

  return (
    <div className={`${scoutStyles.contentContainer} ${teleopStyles.contentColumn}`}>
      <div className={teleopStyles.modeToggleRow}>
          <ToggleButton
            label="ACTIVE"
            value="active"
            selected={mode === "active"}
            onClick={() => setMode("active")}
          />
          <ToggleButton
            label="INACTIVE"
            value="inactive"
            selected={mode === "inactive"}
            onClick={() => setMode("inactive")}
          />
      </div>

      <div
        className={`${changeFlexDirection.changeFlexDirection} ${teleopStyles.viewContainer}`}>
        {mode === "active" ? (
          <ActiveView
            match={match}
            setMatch={setMatch}
            deviceSetup={deviceSetup}
            handleToggleChange={handleToggleChange}
          />
        ) : (
          <InactiveView
            match={match}
            setMatch={setMatch}
            deviceSetup={deviceSetup}
          />
        )}
      </div>
    </div>
  );
}

type ActiveViewProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  deviceSetup: DeviceSetupObj;
  handleToggleChange: (key: keyof TeamMatchEntry, value: boolean | number) => void;
};

function ActiveView({ match, setMatch, deviceSetup, handleToggleChange }: ActiveViewProps) {
  const [climbModalOpen, setClimbModalOpen] = useState(false);
  return (
    <>
      <div className={scoutStyles.half}>
        <label className={scoutStyles.label}>Scoring Locations</label>
        <FieldImage deviceSetup={deviceSetup}>
          {([
            { key: "teleFuelScoredFromOutpost", className: "fuelScoreSpotOutpost", label: "Outpost" },
            { key: "teleFuelScoredFromTrenchOutpost", className: "fuelScoreSpotTrenchUpper", label: "Trench Outpost" },
            { key: "teleFuelScoredFromBumpOutpost", className: "fuelScoreSpotBumpUpper", label: "Bump Outpost" },
            { key: "teleFuelScoredFromTower", className: "fuelScoreSpotTower", label: "Tower" },
            { key: "teleFuelScoredFromHub", className: "fuelScoreSpotHub", label: "Hub" },
            { key: "teleFuelScoredFromBumpDepot", className: "fuelScoreSpotBumpLower", label: "Bump Depot" },
            { key: "teleFuelScoredFromDepot", className: "fuelScoreSpotDepot", label: "Depot" },
            { key: "teleFuelScoredFromTrenchDepot", className: "fuelScoreSpotTrenchLower", label: "Trench Depot" },
            { key: "teleFuelScoredFromOther", className: "fuelScoreSpotOther", label: "Other" },
          ] as const).map(({ key, className, label }) => (
            <TransparentToggle
              key={key}
              value={match[key] ?? false}
              setValue={(value) => handleToggleChange(key, value)}
              error={false}
              className={scoreLocationStyles[className]}
              label={label}
            />
          ))}
        </FieldImage>
      </div>

      <Divider orientation="vertical" />

      <div className={scoutStyles.half}>
        <div className={teleopStyles.fuelCounterRow}>
          <div className={teleopStyles.fuelCounterCycles}>
            <FuelCounter
              label="Cycles"
              value={match.teleCycles ?? 0}
              setValue={(value) => handleToggleChange("teleCycles", value)}
              incrementStep={1}
              decrementStep={1}
            />
          </div>
          <div className={teleopStyles.fuelCounterMain}>
            <FuelCounter
              label="TELEOP Fuel Scoring"
              value={match.teleFuelScored ?? 0}
              setValue={(value) => handleToggleChange("teleFuelScored", value)}
            />
          </div>
        </div>

        <div className={scoutStyles.traverseRow}>
          <LabeledContainer label="Traverse?" className={scoutStyles.traverseContainer}>
            <div className={scoutStyles.toggleButtonGroupSpaced}>
              {([
                { key: "teleRobotTraverseTrench", label: "Trench" },
                { key: "teleRobotTraverseBump", label: "Bump" },
              ] as const).map(({ key, label }) => (
                <ToggleButton
                  key={key}
                  label={label}
                  value={match[key] ?? false}
                  onChange={(value) => handleToggleChange(key, value)}
                />
              ))}
            </div>
          </LabeledContainer>
          <ToggleButton
            label="Fuel Passed"
            className={scoutStyles.fuelPassedButton}
            value={match.teleFuelPassed ?? false}
            onChange={(value) => handleToggleChange("teleFuelPassed", value)}
          />
        </div>

        <LabeledContainer label="Stuck?">
          <div className={scoutStyles.toggleButtonGroupSpaced}>
            {([
              { key: "teleRobotStuckTrench", label: "Trench" },
              { key: "teleRobotStuckBump", label: "Bump" },
              { key: "teleRobotStuckFuel", label: "Fuel" },
              { key: "teleRobotTipped", label: "Tipped" },
            ] as const).map(({ key, label }) => (
              <ToggleButton
                key={key}
                label={label}
                value={match[key] ?? false}
                onChange={(value) => handleToggleChange(key, value)}
              />
            ))}
          </div>
        </LabeledContainer>

        <ToggleButton
          value="climb"
          selected={!!match.endClimbPosition}
          onClick={() => setClimbModalOpen(true)}
          label={match.endClimbPosition ? `Climb: ${match.endClimbPosition}` : "Climb: None"}
        />
        <ClimbPositionModal
          open={climbModalOpen}
          onClose={() => setClimbModalOpen(false)}
          value={match.endClimbPosition}
          onChange={(value) => setMatch({ ...match, endClimbPosition: value, endClimbAttempted: !!value })}
          deviceSetup={deviceSetup}
        />

        <ToggleButton
          label="Robot Died"
          className={scoutStyles.diedButton}
          value={match.died ?? false}
          onChange={(value) => handleToggleChange("died", value)}
          classNameTrue={scoutStyles.redToggleButtonTrue}
          classNameFalse={scoutStyles.redToggleButtonFalse}
        />
      </div>
    </>
  );
}

type InactiveViewProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  deviceSetup: DeviceSetupObj;
};

function InactiveView({ match, setMatch, deviceSetup }: InactiveViewProps) {
  return (
    <>
      <div className={scoutStyles.half}>
        <label className={scoutStyles.label}>&nbsp;</label>
        <FieldImage deviceSetup={deviceSetup} />
      </div>

      <Divider orientation="vertical" />

      <div className={scoutStyles.half}>
        <LabeledContainer label="Defense" showOuterBorder={false}>
          <RangeInput
            min={0}
            max={10}
            value={match.teleInactiveDefenseRoleEffectiveness ?? 0}
            onChange={(value) => setMatch({...match, teleInactiveDefenseRoleEffectiveness: value})}
          />
        </LabeledContainer>

        <LabeledContainer label="Intaking" showOuterBorder={false}>
          <RangeInput
            min={0}
            max={10}
            value={match.teleInactiveIntakingRoleEffectiveness ?? 0}
            onChange={(value) => setMatch({...match, teleInactiveIntakingRoleEffectiveness: value})}
          />
        </LabeledContainer>

      <FuelCounter
        label="Passing Count"
        value={match.teleInactiveFuelPassed ?? 0}
        setValue={(value) => setMatch({ ...match, teleInactiveFuelPassed: value })}
        incrementStep={5}
        decrementStep={1}
      />

      <ToggleButton
        label="Robot Died"
        className={scoutStyles.diedButton}
        value={match.died ?? false}
        onChange={(value) => setMatch({ ...match, died: value })}
        classNameTrue={scoutStyles.redToggleButtonTrue}
        classNameFalse={scoutStyles.redToggleButtonFalse}
      />
    </div>
    </>
  );
}
