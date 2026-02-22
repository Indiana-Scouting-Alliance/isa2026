import {
  DBEvent,
  Match,
  TeamMatchEntry,
  TeamMatchEntryColumn,
  TeamMatchEntryColumns,
  TeamMatchEntryInit,
} from "@isa2026/api/src/utils/dbtypes.ts";
import {
  matchFileName,
  matchLevelAbbrev,
  omit,
} from "@isa2026/api/src/utils/utils.ts";
import {
  Close,
  CloudSync,
  ContentCopy,
  Download,
  QrCode,
  SendToMobile,
  Star,
  Upload,
} from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button.tsx";
import IconButton from "../../components/Button/IconButton/IconButton.tsx";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../../components/Dialog/Dialog.tsx";
import Divider from "../../components/Divider/Divider.tsx";
import Checkbox from "../../components/Input/Checkbox/Checkbox.tsx";
import ScoutPageContainer from "../../components/PageContainer/ScoutPageContainer/ScoutPageContainer.tsx";
import Snackbar from "../../components/Snackbar/Snackbar.tsx";
import changeFlexDirection from "../../components/styles/ChangeFlexDirection.module.css";
import {
  deleteEntry,
  getDBTeamMatchEntries,
  putDBEntry,
} from "../../utils/idb.ts";
import { trpc } from "../../utils/trpc.ts";
import styles from "./SavedMatches.module.css";
import UploadFromSavedMatches, {
  QRCODE_UPLOAD_DELIMITER,
} from "./UploadFromSavedMatches.tsx";

export type ExportMatchEntry = TeamMatchEntry & {
  autoUpload: boolean;
  quickshare: boolean;
  clipboard: boolean;
  qr: boolean;
  download: boolean;
  upload: boolean;
};

type SavedMatchesProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  events: (DBEvent & { matches: Match[] })[];
  validDeviceSetup: boolean;
};
export default function SavedMatches({
  match,
  setMatch,
  events,
  validDeviceSetup,
}: SavedMatchesProps) {
  const navigate = useNavigate();

  const [matches, setMatches] = useState<
    (ExportMatchEntry & {
      selected: boolean;
    })[]
  >([]);
  useEffect(() => {
    getDBTeamMatchEntries().then((robotMatches) => {
      setMatches(
        robotMatches.map((x) => ({
          ...x,
          selected:
            (
              !x.autoUpload &&
              !x.quickshare &&
              !x.clipboard &&
              !x.qr &&
              !x.download &&
              !x.upload
            ) ?
              true
            : false,
        }))
      );
    });
  }, []);

  const markExportedEntries = (
    method:
      | "autoUpload"
      | "quickshare"
      | "clipboard"
      | "qr"
      | "download"
      | "upload"
  ) => {
    setMatches(
      matches.map((x): ExportMatchEntry & { selected: boolean } => {
        if (x.selected) {
          putDBEntry({
            ...omit(["selected"], x as unknown as Record<string, unknown>),
            [method]: true,
          } as ExportMatchEntry);
          console.log({
            ...omit(["selected"], x as unknown as Record<string, unknown>),
            [method]: true,
          } as ExportMatchEntry);
          return {
            ...x,
            [method]: true,
          };
        } else {
          return x;
        }
      })
    );
  };

  const [quickshareFailed, setQuickshareFailed] = useState("");
  const [confirmDeleteMatch, setConfirmDeleteMatch] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const putEntries = trpc.data.putEntries.useMutation({
    onSuccess() {
      setUploadStatus("Success");
      markExportedEntries("upload");
    },
    onError(error) {
      setUploadStatus("Error: " + error.message);
    },
  });

  const [qrMatches, setQrMatches] = useState<string[]>([]);
  const [qrIndex, setQrIndex] = useState(0);
  const qrRef = useRef<HTMLDivElement>(null);

  return (
    <ScoutPageContainer
      title="Saved Matches"
      navButtons={
        <>
          <Button
            className={styles.outlinedNavButton}
            onClick={() => {
              navigate("/scout");
            }}>
            Back
          </Button>
          <Button
            className={styles.outlinedNavButton}
            onClick={() => {
              navigate("/");
            }}>
            Home
          </Button>
          {validDeviceSetup && (
            <Button
              className={styles.filledNavButton}
              onClick={() => {
                console.log(getDBTeamMatchEntries());
                const newMatch: TeamMatchEntry = {
                  ...TeamMatchEntryInit,
                  deviceTeamNumber: match.deviceTeamNumber,
                  deviceId: match.deviceId,
                  eventKey: match.eventKey,
                  matchLevel: match.matchLevel,
                  matchNumber: match.matchNumber + 1,
                  alliance: match.alliance,
                  robotNumber: match.robotNumber,
                  scoutName: match.scoutName,
                  scoutTeamNumber: match.scoutTeamNumber,
                };

                const eventMatches = events.find(
                  (event) => event.eventKey === match.eventKey
                )?.matches;
                if (
                  eventMatches?.some(
                    (x) =>
                      x.matchLevel === match.matchLevel &&
                      x.matchNumber === match.matchNumber + 1
                  )
                ) {
                  setMatch({
                    ...newMatch,
                    teamNumber: eventMatches.find(
                      (x) =>
                        x.matchLevel === match.matchLevel &&
                        x.matchNumber === match.matchNumber + 1
                    )![
                      (match.alliance.toLowerCase() + match.robotNumber) as
                        | "red1"
                        | "red2"
                        | "red3"
                        | "blue1"
                        | "blue2"
                        | "blue3"
                    ],
                  });
                } else {
                  setMatch({
                    ...newMatch,
                    teamNumber: 0,
                  });
                }
                navigate("/scout");
              }}>
              Next Match
            </Button>
          )}
        </>
      }>
      <div
        className={
          styles.contentContainer +
          " " +
          changeFlexDirection.changeFlexDirection
        }>
        <div className={styles.matchListContainer}>
          <div className={styles.matchListActionContainer}>
            <Button
              className={styles.matchListActionButton}
              onClick={() => {
                console.log(getDBTeamMatchEntries());
                if (matches.every((x) => x.selected)) {
                  setMatches(
                    matches.map((x) => ({
                      ...x,
                      selected: false,
                    }))
                  );
                } else {
                  setMatches(
                    matches.map((x) => ({
                      ...x,
                      selected: true,
                    }))
                  );
                }
              }}>
              {matches.every((x) => x.selected) ? "Deselect All" : "Select All"}
            </Button>
            <Button
              className={styles.matchListActionButton}
              onClick={() => {
                if (matches.some((x) => x.selected)) {
                  setConfirmDeleteMatch(true);
                }
              }}>
              Delete
            </Button>
            <Dialog
              open={confirmDeleteMatch}
              onClose={() => {
                setConfirmDeleteMatch(false);
              }}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <div className={styles.deleteDialogContent}>
                  <p className={styles.deleteDialogText}>
                    Are you sure you want to delete the following matches? This
                    cannot be undone.
                  </p>
                  <ul className={styles.deleteDialogList}>
                    {matches
                      .filter((x) => x.selected)
                      .map((x) => (
                        <li
                          key={
                            x.eventKey +
                            "_" +
                            x.matchLevel +
                            x.matchNumber +
                            "_" +
                            x.alliance +
                            "_" +
                            x.robotNumber +
                            "_" +
                            x.deviceTeamNumber +
                            "_" +
                            x.deviceId
                          }
                          className={styles.deleteDialogListItem}>
                          {x.eventKey +
                            "_" +
                            matchLevelAbbrev(x.matchLevel) +
                            x.matchNumber +
                            " " +
                            x.alliance +
                            " " +
                            x.robotNumber}
                        </li>
                      ))}
                  </ul>
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  className={styles.deleteDialogActionButton}
                  onClick={() => {
                    setConfirmDeleteMatch(false);
                  }}>
                  Cancel
                </Button>
                <Button
                  className={styles.deleteDialogActionButton}
                  onClick={async () => {
                    for (const i of matches.filter((x) => x.selected)) {
                      await deleteEntry(i);
                    }
                    setMatches(matches.filter((x) => !x.selected));
                    setConfirmDeleteMatch(false);
                  }}>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <div className={styles.matchList}>
            {matches.map((matchData, index) => (
              <div
                key={index}
                className={styles.match}
                onClick={() => {
                  setMatches(
                    matches.map((x) =>
                      (
                        x.eventKey === matchData.eventKey &&
                        x.matchLevel === matchData.matchLevel &&
                        x.matchNumber === matchData.matchNumber &&
                        x.alliance === matchData.alliance &&
                        x.robotNumber === matchData.robotNumber
                      ) ?
                        {
                          ...matchData,
                          selected: !x.selected,
                        }
                      : x
                    )
                  );
                }}>
                <Checkbox
                  className={styles.matchCheckbox}
                  id={"match-list-item-" + index}
                  onChange={(value) => {
                    setMatches(
                      matches.map((x) =>
                        (
                          x.eventKey === matchData.eventKey &&
                          x.matchLevel === matchData.matchLevel &&
                          x.matchNumber === matchData.matchNumber &&
                          x.alliance === matchData.alliance &&
                          x.robotNumber === matchData.robotNumber
                        ) ?
                          {
                            ...matchData,
                            selected: value,
                          }
                        : x
                      )
                    );
                  }}
                  value={matchData.selected}
                  label={
                    <div
                      className={styles.matchLabelContainer}
                      onClick={(event) => {
                        event.preventDefault();
                        setMatches(
                          matches.map((x) =>
                            (
                              x.eventKey === matchData.eventKey &&
                              x.matchLevel === matchData.matchLevel &&
                              x.matchNumber === matchData.matchNumber &&
                              x.alliance === matchData.alliance &&
                              x.robotNumber === matchData.robotNumber
                            ) ?
                              {
                                ...matchData,
                                selected: !x.selected,
                              }
                            : x
                          )
                        );
                      }}>
                      <div className={styles.matchLabel}>
                        <p
                          className={
                            styles.matchLabelText +
                            " " +
                            ((
                              !matchData.autoUpload &&
                              !matchData.quickshare &&
                              !matchData.clipboard &&
                              !matchData.qr &&
                              !matchData.download &&
                              !matchData.upload
                            ) ?
                              styles.matchLabelTextNoUpload
                            : "")
                          }>
                          {matchData.eventKey +
                            "_" +
                            matchLevelAbbrev(matchData.matchLevel) +
                            matchData.matchNumber}
                        </p>
                        <div className={styles.matchIconsAndText}>
                          <p
                            className={
                              styles.matchLabelText +
                              " " +
                              ((
                                !matchData.autoUpload &&
                                !matchData.quickshare &&
                                !matchData.clipboard &&
                                !matchData.qr &&
                                !matchData.download &&
                                !matchData.upload
                              ) ?
                                styles.matchLabelTextNoUpload
                              : "")
                            }>
                            {matchData.alliance +
                              "\u00a0" +
                              matchData.robotNumber}
                          </p>
                          <div className={styles.matchIcons}>
                            {matchData.autoUpload && <CloudSync />}
                            {matchData.quickshare && <SendToMobile />}
                            {matchData.clipboard && <ContentCopy />}
                            {matchData.qr && <QrCode />}
                            {matchData.download && <Download />}
                            {matchData.upload && <Upload />}
                          </div>
                        </div>
                      </div>
                      {!matchData.autoUpload &&
                        !matchData.quickshare &&
                        !matchData.clipboard &&
                        !matchData.qr &&
                        !matchData.download &&
                        !matchData.upload && <Star />}
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <Divider orientation="vertical" />
        <div className={styles.exportMethodsContainer}>
          <Button
            className={styles.exportButton}
            onClick={async () => {
              const data: TeamMatchEntry[] = matches
                .filter((x) => x.selected)
                .map((x) =>
                  omit(
                    [
                      "autoUpload",
                      "quickshare",
                      "clipboard",
                      "qr",
                      "download",
                      "upload",
                      "selected",
                    ],
                    x as unknown as Record<string, unknown>
                  )
                ) as unknown as TeamMatchEntry[];

              let exception = false;
              try {
                await navigator.share({
                  title: "ISA Match Data",
                  text: JSON.stringify(data),
                  files: data.map(
                    (x) =>
                      new File([JSON.stringify(x)], matchFileName(x) + ".txt", {
                        type: "text/plain",
                      })
                  ),
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (error: any) {
                exception = true;
                console.log(error);
                setQuickshareFailed(error.toString() as string);
              }
              if (!exception) {
                markExportedEntries("quickshare");
              }
            }}>
            <SendToMobile />
            Share via Quickshare
          </Button>
          <Snackbar
            open={quickshareFailed !== ""}
            autoHideDuration={3000}
            onClose={() => {
              setQuickshareFailed("");
            }}
            message={quickshareFailed}
            action={
              <IconButton
                className={styles.snackbarClose}
                onClick={() => {
                  setQuickshareFailed("");
                }}>
                <Close />
              </IconButton>
            }
          />

          <Button
            className={styles.exportButton}
            onClick={() => {
              const data: TeamMatchEntry[] = matches
                .filter((x) => x.selected)
                .map((x) =>
                  omit(
                    [
                      "autoUpload",
                      "quickshare",
                      "clipboard",
                      "qr",
                      "download",
                      "upload",
                      "selected",
                    ],
                    x as unknown as Record<string, unknown>
                  )
                ) as unknown as TeamMatchEntry[];

              let exception = false;
              try {
                navigator.clipboard.writeText(JSON.stringify(data));
              } catch {
                exception = true;
              }

              if (!exception) {
                markExportedEntries("clipboard");
              }
            }}>
            <ContentCopy />
            Copy to Clipboard
          </Button>

          <Button
            className={styles.exportButton}
            onClick={() => {
              setQrMatches(
                matches
                  .filter((x) => x.selected)
                  .map(
                    (x) =>
                      JSON.stringify(
                        TeamMatchEntryColumns.map(
                          (column) => x[column as TeamMatchEntryColumn]
                        )
                      ) + QRCODE_UPLOAD_DELIMITER
                  )
              );
              setQrIndex(0);
              console.log(
                matches
                  .filter((x) => x.selected)
                  .map(
                    (x) =>
                      JSON.stringify(
                        TeamMatchEntryColumns.map(
                          (column) => x[column as TeamMatchEntryColumn]
                        )
                      ) + QRCODE_UPLOAD_DELIMITER
                  )
                  .join("")
              );
            }}>
            <QrCode />
            Share via QR Code
          </Button>
          <Dialog open={qrMatches.length > 0}>
            <DialogTitle>
              QR Code {qrIndex + 1} of {qrMatches.length}
            </DialogTitle>
            <DialogContent>
              <div ref={qrRef}>
                <QRCodeSVG
                  value={qrMatches[qrIndex]}
                  size={Math.min(
                    (60 * innerWidth) / 100,
                    (60 * innerHeight) / 100
                  )}
                  marginSize={4}
                />
              </div>
            </DialogContent>
            <DialogActions>
              {qrMatches.length === 1 ?
                <>
                  <Button
                    className={styles.qrDialogActionButton}
                    onClick={() => {
                      setQrMatches([]);
                    }}>
                    Cancel
                  </Button>
                  <Button
                    className={styles.qrDialogActionButton}
                    onClick={() => {
                      markExportedEntries("qr");
                      setQrMatches([]);
                    }}>
                    Done
                  </Button>
                </>
              : qrIndex === 0 ?
                <>
                  <Button
                    className={styles.qrDialogActionButton}
                    onClick={() => {
                      setQrMatches([]);
                    }}>
                    Cancel
                  </Button>
                  <Button
                    className={styles.qrDialogActionButton}
                    onClick={() => {
                      setQrIndex(qrIndex + 1);
                    }}>
                    Next
                  </Button>
                </>
              : qrIndex === qrMatches.length - 1 ?
                <>
                  <Button
                    className={styles.qrDialogActionButton}
                    onClick={() => {
                      setQrIndex(qrIndex - 1);
                    }}>
                    Previous
                  </Button>
                  <Button
                    className={styles.qrDialogActionButton}
                    onClick={() => {
                      markExportedEntries("qr");
                      setQrMatches([]);
                    }}>
                    Done
                  </Button>
                </>
              : <>
                  <Button
                    className={styles.qrDialogActionButton}
                    onClick={() => {
                      setQrIndex(qrIndex - 1);
                    }}>
                    Previous
                  </Button>
                  <Button
                    className={styles.qrDialogActionButton}
                    onClick={() => {
                      setQrIndex(qrIndex + 1);
                    }}>
                    Next
                  </Button>
                </>
              }
            </DialogActions>
          </Dialog>

          <Button
            className={styles.exportButton}
            onClick={() => {
              const data: TeamMatchEntry[] = matches
                .filter((x) => x.selected)
                .map((x) =>
                  omit(
                    [
                      "autoUpload",
                      "quickshare",
                      "clipboard",
                      "qr",
                      "download",
                      "upload",
                      "selected",
                    ],
                    x as unknown as Record<string, unknown>
                  )
                ) as unknown as TeamMatchEntry[];

              let exception = false;
              try {
                const downloadInterval = setInterval(() => {
                  const x = data.pop();
                  console.log(x && x.matchLevel + x.matchNumber);
                  if (!x) {
                    clearInterval(downloadInterval);
                    return;
                  }

                  const a = document.createElement("a");
                  a.setAttribute(
                    "href",
                    URL.createObjectURL(
                      new Blob([JSON.stringify(x)], {
                        type: "text/plain",
                      })
                    )
                  );
                  a.setAttribute("download", matchFileName(x) + ".txt");
                  a.setAttribute("target", "_blank");
                  a.click();

                  if (data.length <= 0) {
                    clearInterval(downloadInterval);

                    if (!exception) {
                      markExportedEntries("download");
                    }
                  }
                }, 300);
              } catch {
                exception = true;
              }
            }}>
            <Download />
            Download Data Files
          </Button>

          <Button
            className={styles.exportButton}
            onClick={() => {
              console.log(
                matches
                  .filter((x) => x.selected)
                  .map((x) =>
                    omit(
                      [
                        "autoUpload",
                        "quickshare",
                        "clipboard",
                        "qr",
                        "download",
                        "upload",
                        "selected",
                      ],
                      x as unknown as Record<string, unknown>
                    )
                  ) as unknown as TeamMatchEntry[]
              );
              putEntries.mutate(
                matches
                  .filter((x) => x.selected)
                  .map((x) =>
                    omit(
                      [
                        "autoUpload",
                        "quickshare",
                        "clipboard",
                        "qr",
                        "download",
                        "upload",
                        "selected",
                      ],
                      x as unknown as Record<string, unknown>
                    )
                  ) as TeamMatchEntry[]
              );
            }}>
            <Upload />
            Direct Upload
          </Button>

          <Divider orientation="horizontal" />

          <UploadFromSavedMatches
            setStatus={setUploadStatus}
            matches={matches}
            setMatches={setMatches}
          />

          <Snackbar
            open={uploadStatus !== ""}
            autoHideDuration={3000}
            onClose={() => {
              setUploadStatus("");
            }}
            message={uploadStatus}
            action={
              <IconButton
                className={styles.snackbarClose}
                onClick={() => {
                  setUploadStatus("");
                }}>
                <Close />
              </IconButton>
            }
          />
        </div>
      </div>
    </ScoutPageContainer>
  );
}
