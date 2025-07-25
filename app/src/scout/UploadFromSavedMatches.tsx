import {
  CommonEntryColumns,
  HumanPlayerEntry,
  HumanPlayerEntryColumn,
  HumanPlayerEntryColumns,
  TeamMatchEntry,
  TeamMatchEntryColumn,
  TeamMatchEntryColumns,
} from "@isa2026/api/src/utils/dbtypes.ts";
import { ContentPaste, FileUpload, QrCodeScanner } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput.tsx";
import { putDBEntry } from "../utils/idb.ts";
import { trpc } from "../utils/trpc.ts";
import { ExportMatchEntry } from "./SavedMatches.tsx";

export const QRCODE_UPLOAD_DELIMITER = "`";

type UploadFromSavedMatchesProps = {
  setStatus: (status: string) => void;
  matches: (ExportMatchEntry & {
    selected: boolean;
  })[];
  setMatches: (
    value: (ExportMatchEntry & {
      selected: boolean;
    })[]
  ) => void;
};
export default function UploadFromSavedMatches({
  setStatus,
  matches,
  setMatches,
}: UploadFromSavedMatchesProps) {
  const [data, setData] = useState<(TeamMatchEntry | HumanPlayerEntry)[]>([]);

  const [putEntriesPending, setPutEntriesPending] = useState(false);
  let putEntriesTimeout: NodeJS.Timeout;
  const putEntries = trpc.data.putEntries.useMutation({
    onMutate() {
      setStatus("Uploading...");
      clearTimeout(putEntriesTimeout);
      putEntriesTimeout = setTimeout(async () => {
        if (putEntriesPending) {
          putEntries.reset();
          try {
            data.forEach(async (match) => {
              await putDBEntry({
                ...match,
                autoUpload: false,
                quickshare: false,
                clipboard: false,
                qr: false,
                download: false,
                upload: false,
              });
            });
            setMatches([
              ...data.map((match) => ({
                ...match,
                autoUpload: false,
                quickshare: false,
                clipboard: false,
                qr: false,
                download: false,
                upload: false,
                selected: true,
              })),
              ...matches,
            ]);
            setStatus("Error uploading. Matches saved locally.");
          } catch (error) {
            setStatus("Error saving matches locally:" + error);
          } finally {
            setPutEntriesPending(false);
          }
        }
      }, 3000);
    },
    async onSuccess() {
      clearTimeout(putEntriesTimeout);
      try {
        data.forEach(async (match) => {
          await putDBEntry({
            ...match,
            autoUpload: true,
            quickshare: false,
            clipboard: false,
            qr: false,
            download: false,
            upload: false,
          });
        });
        setMatches([
          ...data.map((match) => ({
            ...match,
            autoUpload: true,
            quickshare: false,
            clipboard: false,
            qr: false,
            download: false,
            upload: false,
            selected: false,
          })),
          ...matches,
        ]);
        setStatus("Success!");
      } catch (error) {
        setStatus("Upload Success. Error saving matches locally: " + error);
      } finally {
        setPutEntriesPending(false);
      }
    },
    async onError(error) {
      clearTimeout(putEntriesTimeout);

      console.error(error);
      if (error.message === "NetworkError when attempting to fetch resource.") {
        setStatus("No network connection. Matches saved locally.");
      } else {
        setStatus(error.message);
      }

      try {
        data.forEach(async (match) => {
          await putDBEntry({
            ...match,
            autoUpload: false,
            quickshare: false,
            clipboard: false,
            qr: false,
            download: false,
            upload: false,
          });
        });
        setMatches([
          ...data.map((match) => ({
            ...match,
            autoUpload: false,
            quickshare: false,
            clipboard: false,
            qr: false,
            download: false,
            upload: false,
            selected: true,
          })),
          ...matches,
        ]);
      } catch (error) {
        setStatus("Error saving matches locally: " + error);
      } finally {
        setPutEntriesPending(false);
      }
    },
  });

  const [qrUpload, setQrUpload] = useState(false);
  const [qrData, setQrData] = useState("");

  return (
    <>
      <Button
        component="label"
        variant="outlined"
        startIcon={<FileUpload />}
        disabled={putEntriesPending}>
        Upload TXT Files
        <VisuallyHiddenInput
          type="file"
          accept="text/plain"
          onChange={async (event) => {
            if (event.currentTarget.files) {
              const matches: (TeamMatchEntry | HumanPlayerEntry)[] = [];

              try {
                for (const file of event.currentTarget.files) {
                  const match = JSON.parse(await file.text());
                  console.log(match);
                  matches.push(match);
                }
              } catch (error) {
                setStatus("Error parsing file(s): " + error);
                return;
              }

              setData(matches);
              putEntries.mutate(matches);
            }
          }}
          multiple
        />
      </Button>

      <Button
        variant="outlined"
        onClick={async () => {
          try {
            const matches = JSON.parse(
              await navigator.clipboard.readText()
            ) as (TeamMatchEntry | HumanPlayerEntry)[];

            setData(matches);
            putEntries.mutate(matches);
          } catch (error) {
            setStatus("Error reading clipboard: " + error);
          }
        }}
        startIcon={<ContentPaste />}
        disabled={putEntriesPending}>
        Upload from Clipboard
      </Button>

      <Button
        variant="outlined"
        onClick={() => {
          setQrUpload(true);
        }}
        startIcon={<QrCodeScanner />}
        disabled={putEntriesPending}>
        Upload from QR
      </Button>
      <Dialog open={qrUpload}>
        <DialogTitle>Scan QR Codes</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            value={qrData}
            onChange={(event) => {
              setQrData(event.currentTarget.value);
            }}
            helperText={
              "1.Connect the QR code scanner\u00a0\u00a02.Focus the textbox\u00a0\u00a03.Scan QR codes"
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setQrUpload(false);
            }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const matchArrs: string[] = qrData
                .split(QRCODE_UPLOAD_DELIMITER)
                .filter((x) => x.trim() !== "");
              try {
                const matches: (TeamMatchEntry | HumanPlayerEntry)[] =
                  matchArrs.map((match) => {
                    const matchArr = JSON.parse(match);
                    const parsedMatch: Partial<
                      Record<
                        TeamMatchEntryColumn | HumanPlayerEntryColumn,
                        unknown
                      >
                    > = {};
                    CommonEntryColumns.forEach((column, columnIndex) => {
                      parsedMatch[column] = matchArr[columnIndex];
                    });
                    if (parsedMatch.robotNumber === 4) {
                      HumanPlayerEntryColumns.forEach((column, columnIndex) => {
                        parsedMatch[column] = matchArr[columnIndex];
                      });
                    } else {
                      TeamMatchEntryColumns.forEach((column, columnIndex) => {
                        parsedMatch[column] = matchArr[columnIndex];
                      });
                    }
                    console.log(parsedMatch);
                    return parsedMatch as TeamMatchEntry | HumanPlayerEntry;
                  });

                setData(matches);
                putEntries.mutate(matches);
              } catch (error) {
                setStatus("Error parsing QR code: " + error);
              } finally {
                setQrData("");
                setQrUpload(false);
              }
            }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
