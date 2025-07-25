import {
  HumanPlayerEntryColumns,
  HumanPlayerEntryInit,
  TeamMatchEntryColumns,
  TeamMatchEntryInit,
} from "@isa2026/api/src/utils/dbtypes.ts";
import { dateFileName } from "@isa2026/api/src/utils/utils.ts";
import {
  ContentCopy,
  Contrast,
  Error,
  FormatQuote,
  Numbers,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  lighten,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Button from "../../components/Button/Button.tsx";
import { default as Checkbox2 } from "../../components/Checkbox/Checkbox.tsx";
import Divider from "../../components/Divider/Divider.tsx";
import IconButton from "../../components/IconButton/IconButton.tsx";
import Input from "../../components/Input/Input.tsx";
import styles from "./ExportLayout.module.css";

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  borderWidth: 3,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.5),
    "&:hover": {
      backgroundColor: lighten(theme.palette.primary.light, 0.5),
    },
  },
}));

type ExportLayoutProps = {
  showPublicApiToken: boolean;
  setShowPublicApiToken: (value: boolean) => void;
  linkIncludesToken: boolean;
  setLinkIncludesToken: (value: boolean) => void;
  showAuthorization: boolean;
  setShowAuthorization: (value: boolean) => void;
  publicApiToken: string | undefined;
  robotColumnsState: boolean[];
  setRobotColumnsState: (value: boolean[]) => void;
  humanColumnsState: boolean[];
  setHumanColumnsState: (value: boolean[]) => void;
  linkBase: string;
  events: string;
  setEvents: (value: string) => void;
  teams: string;
  setTeams: (value: string) => void;
};
export default function ExportLayout({
  showPublicApiToken,
  setShowPublicApiToken,
  linkIncludesToken,
  setLinkIncludesToken,
  showAuthorization,
  setShowAuthorization,
  publicApiToken,
  robotColumnsState,
  setRobotColumnsState,
  humanColumnsState,
  setHumanColumnsState,
  linkBase,
  events,
  setEvents,
  teams,
  setTeams,
}: ExportLayoutProps) {
  const [fileType, setFileType] = useState<"json" | "csv" | "xlsx">("json");

  const getApiLink = () => {
    return (
      import.meta.env.VITE_SERVER_URL +
      linkBase +
      fileType +
      "?include=" +
      (robotColumnsState.length > 0 ?
        robotColumnsState.map((value) => (value ? "1" : "0")).join("")
      : "") +
      (humanColumnsState.length > 0 ?
        humanColumnsState.map((value) => (value ? "1" : "0")).join("")
      : "") +
      (events ?
        events
          .split(",")
          .map((event) => "&event=" + event.trim())
          .join("")
      : "") +
      (teams ?
        teams
          .split(",")
          .filter((team) => !isNaN(parseInt(team.trim())))
          .map((team) => "&team=" + team.trim())
          .join("")
      : "") +
      (linkIncludesToken ? "&token=" + publicApiToken : "")
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.half}>
        {robotColumnsState.length > 0 && (
          <>
            <p className={styles.columnsHeader}>
              Select columns to include in robot data
            </p>
            <div className={styles.columnsContainer}>
              {TeamMatchEntryColumns.map((column, columnIndex) => {
                return (
                  <Checkbox2
                    value={robotColumnsState[columnIndex]}
                    key={column}
                    id={column + "-checkbox"}
                    onChange={(checked) => {
                      setRobotColumnsState(
                        robotColumnsState.map((value, valueIndex) =>
                          valueIndex === columnIndex ? checked : value
                        )
                      );
                    }}
                    label={
                      <div className={styles.columnLabelContainer}>
                        <Typography>{column}</Typography>
                        {
                          {
                            boolean: <DataTypeIcon dataType="boolean" />,
                            string:
                              column === "alliance" ?
                                <DataTypeIcon dataType='"Red" | "Blue"' />
                              : column === "matchLevel" ?
                                <DataTypeIcon dataType='"None" | "Practice" | "Qualification" | "Playoff"' />
                              : <DataTypeIcon dataType="string" />,
                            number:
                              column === "robotNumber" ?
                                <DataTypeIcon dataType="1 | 2 | 3" />
                              : <DataTypeIcon dataType="integer" />,
                            bigint: <DataTypeIcon dataType="error" />,
                            symbol: <DataTypeIcon dataType="error" />,
                            function: <DataTypeIcon dataType="error" />,
                            object:
                              (
                                [
                                  "tbaAutoLine",
                                  "tbaEndgamePark",
                                  "tbaEndgameShallow",
                                  "tbaEndgameDeep",
                                ].includes(column)
                              ) ?
                                <DataTypeIcon dataType="boolean" />
                              : <DataTypeIcon dataType="error" />,
                            undefined: <DataTypeIcon dataType="error" />,
                          }[typeof TeamMatchEntryInit[column]]
                        }
                      </div>
                    }
                  />
                );
              })}
            </div>
          </>
        )}
        {humanColumnsState.length > 0 && (
          <>
            <p className={styles.columnsHeader}>
              Select columns to include in human data
            </p>
            <div className={styles.columnsContainer}>
              {HumanPlayerEntryColumns.map((column, columnIndex) => (
                <Checkbox2
                  key={column}
                  id={column + "-checkbox"}
                  value={humanColumnsState[columnIndex]}
                  onChange={(checked) => {
                    setHumanColumnsState(
                      humanColumnsState.map((value, valueIndex) =>
                        valueIndex === columnIndex ? checked : value
                      )
                    );
                  }}
                  label={
                    <div className={styles.columnLabelContainer}>
                      <p className={styles.columnLabel}>{column}</p>
                      {
                        {
                          boolean: <DataTypeIcon dataType="boolean" />,
                          string:
                            column === "alliance" ?
                              <DataTypeIcon dataType='"Red" | "Blue"' />
                            : column === "matchLevel" ?
                              <DataTypeIcon dataType='"None" | "Practice" | "Qualification" | "Playoff"' />
                            : <DataTypeIcon dataType="string" />,
                          number:
                            column === "robotNumber" ?
                              <DataTypeIcon dataType="4" />
                            : <DataTypeIcon dataType="integer" />,
                          bigint: <DataTypeIcon dataType="error" />,
                          symbol: <DataTypeIcon dataType="error" />,
                          function: <DataTypeIcon dataType="error" />,
                          object:
                            ["tbaMaxAlgaeAttempts"].includes(column) ?
                              <DataTypeIcon dataType="integer" />
                            : <DataTypeIcon dataType="error" />,
                          undefined: <DataTypeIcon dataType="error" />,
                        }[typeof HumanPlayerEntryInit[column]]
                      }
                    </div>
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
      <Divider orientation="vertical" />
      <div className={styles.half}>
        <Input
          id="events-filter"
          value={events}
          onChange={(event) => {
            setEvents(event.currentTarget.value);
          }}
          label="Events (comma-separated)"
        />
        <Input
          id="teams-filter"
          value={teams}
          onChange={(event) => {
            setTeams(event.currentTarget.value);
          }}
          label="Teams (comma-separated)"
        />
        <Divider orientation="horizontal" />
        <ToggleButtonGroup
          value={fileType}
          exclusive
          onChange={(_event, value) => {
            if (value) {
              setFileType(value);
            }
          }}
          color="primary"
          sx={{
            width: 1,
          }}>
          <StyledToggleButton value="json">JSON</StyledToggleButton>
          <StyledToggleButton value="csv">CSV</StyledToggleButton>
          {/* <StyledToggleButton value="xlsx">XLSX</StyledToggleButton> */}
        </ToggleButtonGroup>
        <Divider orientation="horizontal" />
        <Input
          id="public-api-token"
          value={publicApiToken ?? ""}
          endIcon={
            <>
              <IconButton
                onClick={() => {
                  setShowPublicApiToken(!showPublicApiToken);
                }}>
                {showPublicApiToken ?
                  <VisibilityOff />
                : <Visibility />}
              </IconButton>
              <IconButton
                onClick={() => {
                  if (publicApiToken) {
                    navigator.clipboard.writeText(publicApiToken);
                  }
                }}>
                <ContentCopy />
              </IconButton>
            </>
          }
          type={showPublicApiToken ? "text" : "password"}
          disabled
          label="publicApiToken"
        />
        <Divider orientation="horizontal" />
        <Checkbox2
          id="include-token-in-link"
          label="Include token in link"
          value={linkIncludesToken}
          onChange={(value) => {
            setLinkIncludesToken(value);
          }}
        />
        <Input
          value={getApiLink()}
          endIcon={
            <IconButton
              onClick={() => {
                if (publicApiToken) {
                  navigator.clipboard.writeText(getApiLink());
                }
              }}>
              <ContentCopy />
            </IconButton>
          }
          label="API Link"
          id="api-link"
        />
        {!linkIncludesToken && (
          <Input
            value={"Bearer " + publicApiToken}
            endIcon={
              <>
                <IconButton
                  onClick={() => {
                    setShowAuthorization(!showAuthorization);
                  }}>
                  {showAuthorization ?
                    <VisibilityOff />
                  : <Visibility />}
                </IconButton>
                <IconButton
                  onClick={() => {
                    if (publicApiToken) {
                      navigator.clipboard.writeText("Bearer " + publicApiToken);
                    }
                  }}>
                  <ContentCopy />
                </IconButton>
              </>
            }
            type={showAuthorization ? "text" : "password"}
            label='"Authorization" Header'
            id="authorization-header"
          />
        )}
        <Divider orientation="horizontal" />
        <Button
          className={styles.downloadButton}
          onClick={async () => {
            const res = await (
              await fetch(getApiLink(), {
                headers: {
                  Authorization: "Bearer " + publicApiToken,
                },
              })
            ).text();
            console.log(res);

            const a = document.createElement("a");
            a.setAttribute(
              "href",
              URL.createObjectURL(
                new Blob([res], {
                  type: "text/plain",
                })
              )
            );
            a.setAttribute("download", dateFileName() + "." + fileType);
            a.setAttribute("target", "_blank");
            a.click();
          }}>
          Download File
        </Button>
        <Button
          className={styles.downloadButton}
          onClick={async () => {
            const res = await (
              await fetch(getApiLink(), {
                headers: {
                  Authorization: "Bearer " + publicApiToken,
                },
              })
            ).text();
            console.log(res);

            const a = document.createElement("a");
            a.setAttribute(
              "href",
              URL.createObjectURL(
                new Blob([res], {
                  type: "text/plain",
                })
              )
            );
            a.setAttribute("download", dateFileName() + ".txt");
            a.setAttribute("target", "_blank");
            a.click();
          }}>
          Download as TXT
        </Button>
      </div>
    </div>
  );
}

// TODO: move to /components
type DataTypeIconProps = {
  dataType: string;
};
function DataTypeIcon({ dataType }: DataTypeIconProps) {
  switch (dataType) {
    case "string": {
      return (
        <Tooltip
          title={<Typography>string</Typography>}
          arrow>
          <FormatQuote />
        </Tooltip>
      );
    }
    case "integer": {
      return (
        <Tooltip
          title={<Typography>integer</Typography>}
          arrow>
          <Numbers />
        </Tooltip>
      );
    }
    case "boolean": {
      return (
        <Tooltip
          title={<Typography>boolean (0 | 1)</Typography>}
          arrow>
          <Contrast />
        </Tooltip>
      );
    }
    case "error": {
      return (
        <Tooltip
          title={<Typography>invalid type (contact dev)</Typography>}
          arrow>
          <Error />
        </Tooltip>
      );
    }
    case "1 | 2 | 3":
    case "4": {
      return (
        <Tooltip
          title={<Typography>{dataType}</Typography>}
          arrow>
          <Numbers />
        </Tooltip>
      );
    }
    default: {
      return (
        <Tooltip
          title={<Typography>{dataType}</Typography>}
          arrow>
          <FormatQuote />
        </Tooltip>
      );
    }
  }
}
