import {
  PitScoutEntry,
  PitScoutEntryColumn,
  PitScoutEntryColumns,
} from "@isa2026/api/src/utils/dbtypes.ts";
import { omit } from "@isa2026/api/src/utils/utils.ts";
import {
  Close,
  CloudSync,
  ContentCopy,
  Download,
  Upload,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button.tsx";
import IconButton from "../components/Button/IconButton/IconButton.tsx";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../components/Dialog/Dialog.tsx";
import Divider from "../components/Divider/Divider.tsx";
import ScoutPageContainer from "../components/PageContainer/ScoutPageContainer/ScoutPageContainer.tsx";
import Snackbar from "../components/Snackbar/Snackbar.tsx";
import {
  deletePitEntry,
  getDBPitEntries,
  putDBPitEntry,
} from "../utils/idb.ts";
import { trpc } from "../utils/trpc.ts";
import styles from "./SavedPitEntries.module.css";

export type ExportPitEntry = PitScoutEntry & {
  autoUpload: boolean;
  quickshare: boolean;
  clipboard: boolean;
  qr: boolean;
  download: boolean;
  upload: boolean;
};

type SavedPitEntriesProps = {
  validDeviceSetup: boolean;
};
export default function SavedPitEntries({
  validDeviceSetup,
}: SavedPitEntriesProps) {
  const navigate = useNavigate();

  const [entries, setEntries] = useState<
    (ExportPitEntry & { selected: boolean })[]
  >([]);
  useEffect(() => {
    getDBPitEntries().then((pitEntries) => {
      setEntries(
        pitEntries.map((x) => ({
          ...x,
          selected:
            !x.autoUpload &&
            !x.quickshare &&
            !x.clipboard &&
            !x.qr &&
            !x.download &&
            !x.upload
              ? true
              : false,
        }))
      );
    });
  }, []);

  const markExportedEntries = (
    method: "quickshare" | "clipboard" | "qr" | "download" | "upload"
  ) => {
    const newEntries = entries.map((entry) => {
      if (entry.selected) {
        const newEntry = { ...entry, [method]: true };
        putDBPitEntry(newEntry);
        return newEntry;
      }
      return entry;
    });
    setEntries(newEntries);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const selectedEntries = entries.filter((x) => x.selected);

  const entriesToCsvString = (entriesToExport: ExportPitEntry[]) => {
    return (
      PitScoutEntryColumns.join(",") +
      "\n" +
      entriesToExport
        .map((entry) =>
          PitScoutEntryColumns.map((col: PitScoutEntryColumn) => {
            const val = entry[col];
            if (val === null || val === undefined) return "";
            if (typeof val === "string") return `"${val}"`;
            return val;
          }).join(",")
        )
        .join("\n")
    );
  };

  const putPitEntries = trpc.pitData.putPitEntries.useMutation({
    async onSuccess() {
      markExportedEntries("upload");
      setSnackbarMessage("Uploaded successfully.");
    },
    onError(error) {
      console.error(error);
      setSnackbarMessage("Upload failed.");
    },
  });

  return (
    <ScoutPageContainer
      title="SAVED PIT ENTRIES"
      navButtons={
        <Button
          className={styles.navButton}
          onClick={() => navigate(validDeviceSetup ? "/pit" : "/")}>
          {validDeviceSetup ? "Back to Pit Scout" : "Home"}
        </Button>
      }>
      <div className={styles.container}>
        <div className={styles.listContainer}>
          {entries.length === 0 && (
            <p className={styles.emptyMessage}>No saved pit entries.</p>
          )}
          {entries.map((entry, index) => (
            <div key={entry.eventKey + "-" + entry.teamNumber} className={styles.entryRow}>
              <input
                type="checkbox"
                checked={entry.selected}
                onChange={(e) => {
                  const newEntries = [...entries];
                  newEntries[index] = { ...entry, selected: e.currentTarget.checked };
                  setEntries(newEntries);
                }}
              />
              <div className={styles.entryInfo}>
                <span className={styles.entryTeam}>
                  Team {entry.teamNumber}
                </span>
                <span className={styles.entryEvent}>
                  {entry.eventKey}
                </span>
              </div>
              <div className={styles.entryStatus}>
                {entry.autoUpload && <CloudSync fontSize="small" />}
              </div>
            </div>
          ))}
        </div>

        <Divider orientation="horizontal" />

        <div className={styles.actionsContainer}>
          <IconButton
            onClick={() => {
              navigator.clipboard.writeText(
                entriesToCsvString(selectedEntries)
              );
              markExportedEntries("clipboard");
              setSnackbarMessage("Copied to clipboard.");
            }}>
            <ContentCopy />
          </IconButton>
          <IconButton
            onClick={() => {
              const blob = new Blob(
                [entriesToCsvString(selectedEntries)],
                { type: "text/csv" }
              );
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "pit_entries.csv";
              a.click();
              URL.revokeObjectURL(url);
              markExportedEntries("download");
              setSnackbarMessage("Downloaded.");
            }}>
            <Download />
          </IconButton>
          <IconButton
            onClick={() => {
              putPitEntries.mutate(
                selectedEntries.map((e) => {
                  return omit(["selected", "autoUpload", "quickshare", "clipboard", "qr", "download", "upload"], e) as unknown as PitScoutEntry;
                })
              );
            }}>
            <Upload />
          </IconButton>
          <IconButton
            onClick={() => setDeleteDialogOpen(true)}>
            <Close />
          </IconButton>
        </div>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Entries</DialogTitle>
        <DialogContent>
          Delete {selectedEntries.length} selected pit{" "}
          {selectedEntries.length === 1 ? "entry" : "entries"}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              selectedEntries.forEach((entry) => deletePitEntry(entry));
              setEntries(entries.filter((x) => !x.selected));
              setDeleteDialogOpen(false);
              setSnackbarMessage("Deleted.");
            }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarMessage !== ""}
        message={snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage("")}
      />
    </ScoutPageContainer>
  );
}
