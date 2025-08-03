import { TeamMatchEntry } from "@isa2026/api/src/utils/dbtypes.ts";
import { Box, Divider, Stack, ToggleButtonGroup } from "@mui/material";
import HalfSmallCounter from "../../components/Counter/HalfSmallCounter.tsx";
import {
  StyledRedToggleButton,
  StyledToggleButton,
} from "../../components/StyledToggleButton.tsx";
import scoutStyles from "../../components/styles/ScoutStyles.module.css";
import styles from "./Teleop.module.css";

type TeleopProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
};
export function Teleop({ match, setMatch }: TeleopProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      sx={{
        height: { xs: "auto", md: 1 },
        width: "100%",
        overflow: "auto",
      }}>
      <Stack
        direction="row"
        sx={{
          flex: 2,
          padding: 2,
        }}>
        <Stack
          sx={{
            width: "40%",
            height: 1,
            alignItems: "center",
          }}>
          <Box
            sx={{
              height: "100%",
              padding: 1,
            }}>
            <Box
              sx={{
                aspectRatio: "1015 / 3069",
                maxHeight: "100%",
                maxWidth: "100%",
                position: "relative",
              }}>
              <img
                src={import.meta.env.BASE_URL + "assets/Branch.png"}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              />
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  top: "0%",
                  left: "0%",
                  width: "100%",
                  height: "30%",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "primary.main",
                  backgroundColor: theme.palette.primary.main + "20",
                })}
                onClick={() => {
                  if (match.teleopL4! < 12) {
                    setMatch({
                      ...match,
                      teleopL4: match.teleopL4! + 1,
                    });
                  }
                }}
              />
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
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  top: "30%",
                  left: "0%",
                  width: "100%",
                  height: "20%",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "primary.main",
                  backgroundColor: theme.palette.primary.main + "20",
                })}
                onClick={() => {
                  if (match.teleopL3! < 12) {
                    setMatch({
                      ...match,
                      teleopL3: match.teleopL3! + 1,
                    });
                  }
                }}
              />
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
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  top: "50%",
                  left: "0%",
                  width: "100%",
                  height: "20%",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "primary.main",
                  backgroundColor: theme.palette.primary.main + "20",
                })}
                onClick={() => {
                  if (match.teleopL2! < 12) {
                    setMatch({
                      ...match,
                      teleopL2: match.teleopL2! + 1,
                    });
                  }
                }}
              />
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
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  top: "70%",
                  left: "0%",
                  width: "100%",
                  height: "30%",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "primary.main",
                  backgroundColor: theme.palette.primary.main + "20",
                })}
                onClick={() => {
                  if (match.teleopL1! < 12) {
                    setMatch({
                      ...match,
                      teleopL1: match.teleopL1! + 1,
                    });
                  }
                }}
              />
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
            </Box>
          </Box>
        </Stack>
        <Stack
          sx={{
            height: 1,
            width: "60%",
            alignItems: "center",
            padding: 1,
          }}>
          <Box
            sx={{
              aspectRatio: "1670 / 2881",
              height: "65%",
              position: "relative",
              padding: 1,
            }}
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
              style={{
                height: "100%",
                width: "100%",
              }}
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
          </Box>
          <Box
            sx={{
              height: "35%",
              padding: 1,
            }}>
            <Box
              sx={{
                aspectRatio: "2547 / 2311",
                maxHeight: "100%",
                maxWidth: "100%",
                position: "relative",
              }}
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
            </Box>
          </Box>
        </Stack>
      </Stack>
      <Divider
        orientation="vertical"
        flexItem
      />
      <Stack
        sx={{
          flex: 2,
          padding: 2,
          overflowY: "scroll",
        }}
        gap={2}>
        <StyledRedToggleButton
          value="Robot Died?"
          selected={match.died!}
          onChange={() =>
            setMatch({
              ...match,
              died: !match.died,
            })
          }>
          Robot Died
        </StyledRedToggleButton>
        <StyledToggleButton
          value="Removed Algae from Reef?"
          selected={match.removedAlgaeFromReef!}
          onChange={() =>
            setMatch({
              ...match,
              removedAlgaeFromReef: !match.removedAlgaeFromReef,
            })
          }>
          Removed Algae from Reef
        </StyledToggleButton>
        <StyledToggleButton
          value="Played Defense?"
          selected={match.playedDefense!}
          onChange={() =>
            setMatch({
              ...match,
              playedDefense: !match.playedDefense,
            })
          }>
          Played Defense
        </StyledToggleButton>
        <Stack
          sx={{
            width: 1,
          }}>
          <ToggleButtonGroup
            sx={{
              width: 1,
            }}>
            <StyledToggleButton
              value="Attempted Shallow Climb?"
              selected={match.teleopAttemptedShallow!}
              onChange={() => {
                if (!match.teleopAttemptedShallow) {
                  setMatch({
                    ...match,
                    teleopAttemptedShallow: true,
                    teleopAttemptedDeep: false,
                    teleopSuccessfulShallow: false,
                    teleopSuccessfulDeep: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    teleopAttemptedShallow: false,
                    teleopSuccessfulShallow: false,
                  });
                }
              }}
              sx={{
                borderBottomLeftRadius: 0,
                borderBottomWidth: 0,
                width: 0.5,
              }}>
              Attempted Shallow Climb
            </StyledToggleButton>
            <StyledToggleButton
              value="Attempted Deep Climb?"
              selected={match.teleopAttemptedDeep!}
              onChange={() => {
                if (!match.teleopAttemptedDeep) {
                  setMatch({
                    ...match,
                    teleopAttemptedDeep: true,
                    teleopAttemptedShallow: false,
                    teleopSuccessfulShallow: false,
                    teleopSuccessfulDeep: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    teleopAttemptedDeep: false,
                    teleopSuccessfulDeep: false,
                  });
                }
              }}
              sx={{
                borderBottomRightRadius: 0,
                borderBottomWidth: 0,
                width: 0.5,
              }}>
              Attempted Deep Climb
            </StyledToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            sx={{
              width: 1,
            }}>
            <StyledToggleButton
              value="Successful Shallow Climb?"
              selected={match.teleopSuccessfulShallow!}
              onChange={() => {
                if (!match.teleopSuccessfulShallow) {
                  setMatch({
                    ...match,
                    teleopSuccessfulShallow: true,
                    teleopAttemptedShallow: true,
                    teleopAttemptedDeep: false,
                    teleopSuccessfulDeep: false,
                    teleopPark: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    teleopSuccessfulShallow: false,
                  });
                }
              }}
              sx={{
                borderTopLeftRadius: 0,
                width: 0.5,
              }}>
              Successful Shallow Climb
            </StyledToggleButton>
            <StyledToggleButton
              value="Successful Deep Climb?"
              selected={match.teleopSuccessfulDeep!}
              onChange={() => {
                if (!match.teleopSuccessfulDeep) {
                  setMatch({
                    ...match,
                    teleopSuccessfulDeep: true,
                    teleopAttemptedShallow: false,
                    teleopAttemptedDeep: true,
                    teleopSuccessfulShallow: false,
                    teleopPark: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    teleopSuccessfulDeep: false,
                  });
                }
              }}
              sx={{
                borderTopRightRadius: 0,
                width: 0.5,
              }}>
              Successful Deep Climb
            </StyledToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <StyledToggleButton
          value="Parked?"
          selected={match.teleopPark!}
          onChange={() => {
            if (!match.teleopPark) {
              setMatch({
                ...match,
                teleopPark: !match.teleopPark,
                teleopSuccessfulShallow: false,
                teleopSuccessfulDeep: false,
              });
            } else {
              setMatch({
                ...match,
                teleopPark: !match.teleopPark,
              });
            }
          }}>
          Parked
        </StyledToggleButton>
      </Stack>
    </Stack>
  );
}
