import { MAX_TEAM_NUMBER } from "@isa2026/api/src/utils/constants.ts";
import {
  PitScoutEntry,
} from "@isa2026/api/src/utils/dbtypes.ts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button.tsx";
import ToggleButton from "../components/Button/ToggleButton/ToggleButton.tsx";
import TransparentToggle from "../components/Button/ToggleButton/TransparentToggle/TransparentToggle.tsx";
import ClimbPositionModal from "../components/ClimbPositionModal/ClimbPositionModal.tsx";
import Divider from "../components/Divider/Divider.tsx";
import FieldImage from "../components/FieldImage/FieldImage.tsx";
import Input from "../components/Input/Input.tsx";
import LabeledContainer from "../components/LabeledContainer/LabeledContainer.tsx";
import ScoutPageContainer from "../components/PageContainer/ScoutPageContainer/ScoutPageContainer.tsx";
import Tab from "../components/Tabs/Tab.tsx";
import TabBar from "../components/Tabs/TabBar.tsx";
import changeFlexDirection from "../components/styles/ChangeFlexDirection.module.css";
import scoreLocationStyles from "../components/styles/ScoreLocationStyles.module.css";
import scoutStyles from "../components/styles/ScoutStyles.module.css";
import { DeviceSetupObj } from "../setup/DeviceSetup.tsx";
import { putDBPitEntry } from "../utils/idb.ts";
import { trpc } from "../utils/trpc.ts";
import styles from "./PitScoutLayout.module.css";
import { ExportPitEntry } from "./SavedPitEntries.tsx";

type PitStage = "info" | "auto" | "teleop";

type PitScoutLayoutProps = {
  entry: PitScoutEntry;
  setEntry: (value: PitScoutEntry) => void;
  deviceSetup: DeviceSetupObj;
};

export default function PitScoutLayout({
  entry,
  setEntry,
  deviceSetup,
}: PitScoutLayoutProps) {
  const navigate = useNavigate();
  const [stage, setStage] = useState<PitStage>("info");

  const [teamNumberError, setTeamNumberError] = useState("");
  const [scoutNameError, setScoutNameError] = useState("");
  const [scoutTeamNumberError, setScoutTeamNumberError] = useState("");

  const handleBoolChange = (key: keyof PitScoutEntry, value: boolean) => {
    setEntry({ ...entry, [key]: value });
  };

  const [climbModalOpen, setClimbModalOpen] = useState(false);

  let putPitEntriesTimeout: NodeJS.Timeout;
  const putPitEntries = trpc.pitData.putPitEntries.useMutation({
    onMutate() {
      clearTimeout(putPitEntriesTimeout);
      putPitEntriesTimeout = setTimeout(async () => {
        await putDBPitEntry({
          ...entry,
          autoUpload: false,
          quickshare: false,
          clipboard: false,
          qr: false,
          download: false,
          upload: false,
        } as ExportPitEntry);
        navigate("/pit/saved");
      }, 3000);
    },
    async onSuccess() {
      clearTimeout(putPitEntriesTimeout);
      await putDBPitEntry({
        ...entry,
        autoUpload: true,
        quickshare: false,
        clipboard: false,
        qr: false,
        download: false,
        upload: false,
      } as ExportPitEntry);
      navigate("/pit/saved");
    },
    async onError(error) {
      clearTimeout(putPitEntriesTimeout);
      console.error(error);
      await putDBPitEntry({
        ...entry,
        autoUpload: false,
        quickshare: false,
        clipboard: false,
        qr: false,
        download: false,
        upload: false,
      } as ExportPitEntry);
      navigate("/pit/saved");
    },
  });

  const infoCheck = () => {
    let error = false;
    if (
      !Number.isInteger(entry.teamNumber) ||
      entry.teamNumber < 1 ||
      entry.teamNumber > MAX_TEAM_NUMBER
    ) {
      error = true;
      setTeamNumberError("Invalid team number.");
    } else {
      setTeamNumberError("");
    }
    if (!entry.scoutName) {
      error = true;
      setScoutNameError("Cannot be empty.");
    } else {
      setScoutNameError("");
    }
    if (
      !Number.isInteger(entry.scoutTeamNumber) ||
      entry.scoutTeamNumber < 1 ||
      entry.scoutTeamNumber > MAX_TEAM_NUMBER
    ) {
      error = true;
      setScoutTeamNumberError("Invalid team number.");
    } else {
      setScoutTeamNumberError("");
    }
    return error;
  };

  const handleSubmit = () => {
    if (infoCheck()) {
      setStage("info");
      return;
    }
    const finalEntry: PitScoutEntry = {
      ...entry,
      uploadedAt: Date.now().toString(),
    };
    setEntry(finalEntry);
    putPitEntries.mutate([finalEntry]);
  };

  return (
    <ScoutPageContainer
      title={
        <TabBar
          value={stage}
          onChange={(value) => {
            if (stage === "info") {
              if (!infoCheck()) {
                setStage(value as PitStage);
              }
            } else {
              setStage(value as PitStage);
            }
          }}>
          <Tab value="info">Info</Tab>
          <Tab value="auto">Auto</Tab>
          <Tab value="teleop">Teleop</Tab>
        </TabBar>
      }
      navButtons={
        stage === "info" ? (
          <>
            <Button className={styles.navButtonBack} onClick={() => navigate("/")}>
              Exit
            </Button>
          </>
        ) : stage === "teleop" ? (
          <Button className={styles.navButtonForward} onClick={handleSubmit}>
            Submit
          </Button>
        ) : undefined
      }>
      <div className={styles.contentContainer}>
        {stage === "info" && (
          <InfoSection
            entry={entry}
            setEntry={setEntry}
            deviceSetup={deviceSetup}
            teamNumberError={teamNumberError}
            scoutNameError={scoutNameError}
            scoutTeamNumberError={scoutTeamNumberError}
          />
        )}
        {stage === "auto" && (
          <AutoSection
            entry={entry}
            setEntry={setEntry}
            deviceSetup={deviceSetup}
            handleBoolChange={handleBoolChange}
          />
        )}
        {stage === "teleop" && (
          <TeleopSection
            entry={entry}
            setEntry={setEntry}
            deviceSetup={deviceSetup}
            handleBoolChange={handleBoolChange}
            climbModalOpen={climbModalOpen}
            setClimbModalOpen={setClimbModalOpen}
          />
        )}
      </div>
    </ScoutPageContainer>
  );
}

/* ─── Info Section ─── */
type InfoSectionProps = {
  entry: PitScoutEntry;
  setEntry: (value: PitScoutEntry) => void;
  deviceSetup: DeviceSetupObj;
  teamNumberError: string;
  scoutNameError: string;
  scoutTeamNumberError: string;
};
function InfoSection({
  entry,
  setEntry,
  deviceSetup,
  teamNumberError,
  scoutNameError,
  scoutTeamNumberError,
}: InfoSectionProps) {
  return (
    <div
      className={
        scoutStyles.contentContainer +
        " " +
        changeFlexDirection.changeFlexDirection
      }>
      <div className={scoutStyles.half}>
        <label className={scoutStyles.label}>Starting Location</label>
        <FieldImage deviceSetup={deviceSetup}>
          {([
            { key: "trenchOutpost", className: "fuelScoreSpotTrenchLower", label: "Trench Outpost" },
            { key: "trenchDepot", className: "fuelScoreSpotTrenchUpper", label: "Trench Depot" },
            { key: "hub", className: "fuelScoreSpotHub", label: "Hub" },
            { key: "bumpOutpost", className: "fuelScoreSpotBumpLower", label: "Bump Outpost" },
            { key: "bumpDepot", className: "fuelScoreSpotBumpUpper", label: "Bump Depot" },
          ] as const).map(({ key, className, label }) => (
            <TransparentToggle
              key={key}
              value={entry.startingLocation === key}
              setValue={(value) =>
                setEntry({ ...entry, startingLocation: value ? key : null })
              }
              error={false}
              className={scoreLocationStyles[className]}
              label={label}
            />
          ))}
        </FieldImage>
      </div>

      <Divider orientation="vertical" />

      <div className={scoutStyles.half}>
        <Input
          id="pit-scout-name"
          value={entry.scoutName}
          onChange={(value) => setEntry({ ...entry, scoutName: value })}
          type="text"
          label="Scout Name & Last Initial"
          error={scoutNameError !== ""}
          helperText={scoutNameError}
        />
        <Input
          id="pit-scout-team-number"
          type="number"
          value={isNaN(entry.scoutTeamNumber) ? "" : entry.scoutTeamNumber}
          onChange={(value) =>
            setEntry({ ...entry, scoutTeamNumber: parseInt(value) })
          }
          label="Scout Team Number"
          error={scoutTeamNumberError !== ""}
          helperText={scoutTeamNumberError}
        />
        <Input
          id="pit-team-number"
          type="number"
          value={entry.teamNumber === 0 ? "" : entry.teamNumber}
          onChange={(value) =>
            setEntry({ ...entry, teamNumber: parseInt(value) || 0 })
          }
          label="Team Number"
          error={teamNumberError !== ""}
          helperText={teamNumberError}
        />

        <div className={styles.inlineRow}>
          <LabeledContainer label="Pick-up">
            <div className={scoutStyles.toggleButtonGroupSpaced}>
              {([
                { key: "pitPickupFloor", label: "Floor" },
                { key: "pitPickupOutpost", label: "Outpost" },
                { key: "pitPickupDepot", label: "Depot" },
                { key: "pitPickupNo", label: "No" },
              ] as const).map(({ key, label }) => (
                <ToggleButton
                  key={key}
                  label={label}
                  value={entry[key] ?? false}
                  onChange={(value) => setEntry({ ...entry, [key]: value })}
                />
              ))}
            </div>
          </LabeledContainer>

          <LabeledContainer label="Feed/Pass">
            <div className={scoutStyles.toggleButtonGroupSpaced}>
              {([
                { key: "pitFeedZone1", label: "Zone 1" },
                { key: "pitFeedZone2", label: "Zone 2" },
                { key: "pitFeedOutpost", label: "Outpost" },
              ] as const).map(({ key, label }) => (
                <ToggleButton
                  key={key}
                  label={label}
                  value={entry[key] ?? false}
                  onChange={(value) => setEntry({ ...entry, [key]: value })}
                />
              ))}
            </div>
          </LabeledContainer>
        </div>

        <div className={styles.inlineRow}>
          <LabeledContainer label="Traversing">
            <div className={scoutStyles.toggleButtonGroupSpaced}>
              {([
                { key: "pitTraverseTrench", label: "Trench" },
                { key: "pitTraverseBump", label: "Bump" },
              ] as const).map(({ key, label }) => (
                <ToggleButton
                  key={key}
                  label={label}
                  value={entry[key] ?? false}
                  onChange={(value) => setEntry({ ...entry, [key]: value })}
                />
              ))}
            </div>
          </LabeledContainer>

          <LabeledContainer label="Human Player">
            <div className={scoutStyles.toggleButtonGroupSpaced}>
              {([
                { key: "pitHumanScore", label: "Score" },
                { key: "pitHumanFeed", label: "Feed" },
                { key: "pitHumanOther", label: "Other" },
              ] as const).map(({ key, label }) => (
                <ToggleButton
                  key={key}
                  label={label}
                  value={entry[key] ?? false}
                  onChange={(value) => setEntry({ ...entry, [key]: value })}
                />
              ))}
            </div>
          </LabeledContainer>
        </div>

        <div className={styles.inlineRow}>
          <Input
            id="pit-hopper-size"
            type="number"
            value={entry.pitHopperSize ?? ""}
            onChange={(value) =>
              setEntry({
                ...entry,
                pitHopperSize: value === "" ? null : parseInt(value),
              })
            }
            label="Hopper Size"
          />
          <Input
            id="pit-shooter-bps"
            type="number"
            value={entry.pitShooterBps ?? ""}
            onChange={(value) =>
              setEntry({
                ...entry,
                pitShooterBps: value === "" ? null : parseFloat(value),
              })
            }
            label="Shooter BPS"
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Auto Section ─── */
type AutoSectionProps = {
  entry: PitScoutEntry;
  setEntry: (value: PitScoutEntry) => void;
  deviceSetup: DeviceSetupObj;
  handleBoolChange: (key: keyof PitScoutEntry, value: boolean) => void;
};
function AutoSection({
  entry,
  setEntry,
  deviceSetup,
  handleBoolChange,
}: AutoSectionProps) {
  return (
    <div
      className={
        scoutStyles.contentContainer +
        " " +
        changeFlexDirection.changeFlexDirection
      }>
      <div className={scoutStyles.half}>
        <label className={scoutStyles.label}>Auto Scoring Locations</label>
        <FieldImage deviceSetup={deviceSetup}>
          {([
            { key: "pitAutoShootOutpost", className: "fuelScoreSpotOutpost", label: "Outpost" },
            { key: "pitAutoShootTrenchOutpost", className: "fuelScoreSpotTrenchLower", label: "Trench Outpost" },
            { key: "pitAutoShootTrenchDepot", className: "fuelScoreSpotTrenchUpper", label: "Trench Depot" },
            { key: "pitAutoShootTower", className: "fuelScoreSpotTower", label: "Tower" },
            { key: "pitAutoShootHub", className: "fuelScoreSpotHub", label: "Hub" },
            { key: "pitAutoShootBumpOutpost", className: "fuelScoreSpotBumpLower", label: "Bump Outpost" },
            { key: "pitAutoShootBumpDepot", className: "fuelScoreSpotBumpUpper", label: "Bump Depot" },
            { key: "pitAutoShootDepot", className: "fuelScoreSpotDepot", label: "Depot" },
            { key: "pitAutoShootOther", className: "fuelScoreSpotOther", label: "Other" },
          ] as const).map(({ key, className, label }) => (
            <TransparentToggle
              key={key}
              value={entry[key] ?? false}
              setValue={(value) => handleBoolChange(key, value)}
              error={false}
              className={scoreLocationStyles[className]}
              label={label}
            />
          ))}
        </FieldImage>
      </div>

      <Divider orientation="vertical" />

      <div className={scoutStyles.half}>
        <LabeledContainer label="Auto Capabilities">
          <div className={scoutStyles.toggleButtonGroupSpaced}>
            {([
              { key: "pitAutoMove", label: "Move" },
              { key: "pitAutoScore", label: "Score" },
              { key: "pitAutoClimb", label: "Climb" },
              { key: "pitAutoPickup", label: "Pick-up" },
            ] as const).map(({ key, label }) => (
              <ToggleButton
                key={key}
                label={label}
                value={entry[key] ?? false}
                onChange={(value) => handleBoolChange(key, value)}
              />
            ))}
          </div>
        </LabeledContainer>

        <Input
          id="pit-num-autos"
          type="number"
          value={entry.pitNumberOfAutos ?? ""}
          onChange={(value) =>
            setEntry({
              ...entry,
              pitNumberOfAutos: value === "" ? null : parseInt(value),
            })
          }
          label="# of Autos"
        />
      </div>
    </div>
  );
}

/* ─── Teleop Section ─── */
type TeleopSectionProps = {
  entry: PitScoutEntry;
  setEntry: (value: PitScoutEntry) => void;
  deviceSetup: DeviceSetupObj;
  handleBoolChange: (key: keyof PitScoutEntry, value: boolean) => void;
  climbModalOpen: boolean;
  setClimbModalOpen: (value: boolean) => void;
};
function TeleopSection({
  entry,
  setEntry,
  deviceSetup,
  handleBoolChange,
  climbModalOpen,
  setClimbModalOpen,
}: TeleopSectionProps) {
  return (
    <div
      className={
        scoutStyles.contentContainer +
        " " +
        changeFlexDirection.changeFlexDirection
      }>
      <div className={scoutStyles.half}>
        <label className={scoutStyles.label}>Teleop Scoring Locations</label>
        <FieldImage deviceSetup={deviceSetup}>
          {([
            { key: "pitTeleShootOutpost", className: "fuelScoreSpotOutpost", label: "Outpost" },
            { key: "pitTeleShootTrenchOutpost", className: "fuelScoreSpotTrenchLower", label: "Trench Outpost" },
            { key: "pitTeleShootTrenchDepot", className: "fuelScoreSpotTrenchUpper", label: "Trench Depot" },
            { key: "pitTeleShootTower", className: "fuelScoreSpotTower", label: "Tower" },
            { key: "pitTeleShootHub", className: "fuelScoreSpotHub", label: "Hub" },
            { key: "pitTeleShootBumpOutpost", className: "fuelScoreSpotBumpLower", label: "Bump Outpost" },
            { key: "pitTeleShootBumpDepot", className: "fuelScoreSpotBumpUpper", label: "Bump Depot" },
            { key: "pitTeleShootDepot", className: "fuelScoreSpotDepot", label: "Depot" },
            { key: "pitTeleShootOther", className: "fuelScoreSpotOther", label: "Other" },
          ] as const).map(({ key, className, label }) => (
            <TransparentToggle
              key={key}
              value={entry[key] ?? false}
              setValue={(value) => handleBoolChange(key, value)}
              error={false}
              className={scoreLocationStyles[className]}
              label={label}
            />
          ))}
        </FieldImage>
      </div>

      <Divider orientation="vertical" />

      <div className={scoutStyles.half}>
        <ToggleButton
          label="Shoot From Any Location"
          value={entry.pitTeleShootAny ?? false}
          onChange={(value) => handleBoolChange("pitTeleShootAny", value)}
        />

        <LabeledContainer label="Teleop Primary Role">
          <div className={scoutStyles.toggleButtonGroupSpaced}>
            {([
              { key: "score", label: "Score" },
              { key: "feed", label: "Feed" },
              { key: "climb", label: "Climb" },
              { key: "defense", label: "Defense" },
              { key: "pickupHerd", label: "Pick-up/Herd" },
            ] as const).map(({ key, label }) => (
              <ToggleButton
                key={key}
                label={label}
                value={entry.pitTelePrimary === key}
                onChange={(value) =>
                  setEntry({ ...entry, pitTelePrimary: value ? key : null })
                }
              />
            ))}
          </div>
        </LabeledContainer>

        <LabeledContainer label="Teleop Roles">
          <div className={scoutStyles.toggleButtonGroupSpaced}>
            {([
              { key: "pitTeleScore", label: "Score" },
              { key: "pitTeleFeed", label: "Feed" },
              { key: "pitTeleClimb", label: "Climb" },
              { key: "pitTeleDefense", label: "Defense" },
              { key: "pitTelePickupHerd", label: "Pick-up/Herd" },
            ] as const).map(({ key, label }) => (
              <ToggleButton
                key={key}
                label={label}
                value={entry[key] ?? false}
                onChange={(value) => handleBoolChange(key, value)}
              />
            ))}
          </div>
        </LabeledContainer>

        <ToggleButton
          value="climb"
          selected={!!entry.pitClimbLocation}
          onClick={() => setClimbModalOpen(true)}
          label={
            entry.pitClimbLocation
              ? `Climb Location: ${entry.pitClimbLocation}`
              : "Climb Location: None"
          }
        />
        <ClimbPositionModal
          open={climbModalOpen}
          onClose={() => setClimbModalOpen(false)}
          value={entry.pitClimbLocation}
          onChange={(value) =>
            setEntry({ ...entry, pitClimbLocation: value })
          }
          deviceSetup={deviceSetup}
        />

        <LabeledContainer label="Climb Level">
          <div className={scoutStyles.toggleButtonGroupSpaced}>
            {([1, 2, 3] as const).map((level) => (
              <ToggleButton
                key={level}
                label={String(level)}
                value={entry.pitClimbLevel === level}
                onChange={(value) =>
                  setEntry({
                    ...entry,
                    pitClimbLevel: value ? level : null,
                  })
                }
              />
            ))}
            <ToggleButton
              label="None"
              value={entry.pitClimbLevel === null}
              onChange={() =>
                setEntry({
                  ...entry,
                  pitClimbLevel: null,
                })
              }
            />
          </div>
        </LabeledContainer>

        <Input
          id="pit-climb-time"
          type="number"
          value={entry.pitClimbTime ?? ""}
          onChange={(value) =>
            setEntry({
              ...entry,
              pitClimbTime: value === "" ? null : parseFloat(value),
            })
          }
          label="Climb Time (seconds)"
        />
      </div>
    </div>
  );
}
