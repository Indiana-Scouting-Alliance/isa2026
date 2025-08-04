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
import { useState } from "react";
import Button from "../../components/Button/Button.tsx";
import IconButton from "../../components/Button/IconButton/IconButton.tsx";
import ToggleButton from "../../components/Button/ToggleButton/ToggleButton.tsx";
import ToggleButtonGroup from "../../components/Button/ToggleButton/ToggleButtonGroup.tsx";
import Divider from "../../components/Divider/Divider.tsx";
import Checkbox from "../../components/Input/Checkbox/Checkbox.tsx";
import Input from "../../components/Input/Input.tsx";
import Tooltip from "../../components/Tooltip/Tooltip.tsx";
import styles from "./ExportLayout.module.css";

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
                  <Checkbox
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
                              : column === "dataConfidence" ?
                                <DataTypeIcon dataType='"low" | "neutral" | "high"' />
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
                <Checkbox
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
          onChange={(value) => {
            setEvents(value);
          }}
          label="Events (comma-separated)"
        />
        <Input
          id="teams-filter"
          value={teams}
          onChange={(value) => {
            setTeams(value);
          }}
          label="Teams (comma-separated)"
        />
        <Divider orientation="horizontal" />
        <ToggleButtonGroup
          label="File Type"
          value={fileType}
          onChange={(value) => {
            if (value) {
              setFileType(value as "json" | "csv" | "xlsx");
            }
          }}>
          <ToggleButton
            value="json"
            className={styles.toggleButton}>
            JSON
          </ToggleButton>
          <ToggleButton
            value="csv"
            className={styles.toggleButton}>
            CSV
          </ToggleButton>
          {/* <ToggleButton2 value="xlsx">XLSX</ToggleButton2> */}
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
        <Checkbox
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
        <Tooltip content={<p className={styles.tooltipLabel}>string</p>}>
          <FormatQuote />
        </Tooltip>
      );
    }
    case "integer": {
      return (
        <Tooltip content={<p className={styles.tooltipLabel}>integer</p>}>
          <Numbers />
        </Tooltip>
      );
    }
    case "boolean": {
      return (
        <Tooltip
          content={<p className={styles.tooltipLabel}>boolean (0 | 1)</p>}>
          <Contrast />
        </Tooltip>
      );
    }
    case "error": {
      return (
        <Tooltip
          content={
            <p className={styles.tooltipLabel}>
              invalid type (contact dev): {dataType}
            </p>
          }>
          <Error />
        </Tooltip>
      );
    }
    case "1 | 2 | 3":
    case "4": {
      return (
        <Tooltip content={<p className={styles.tooltipLabel}>{dataType}</p>}>
          <Numbers />
        </Tooltip>
      );
    }
    default: {
      return (
        <Tooltip content={<p className={styles.tooltipLabel}>{dataType}</p>}>
          <FormatQuote />
        </Tooltip>
      );
    }
  }
}
