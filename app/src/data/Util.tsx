import { dateFileName } from "@isa2026/api/src/utils/utils.ts";
import { Download, FileUpload, Send } from "@mui/icons-material";
import { useRef, useState } from "react";
import Button from "../components/Button/Button.tsx";
import IconButton from "../components/Button/IconButton/IconButton.tsx";
import Input from "../components/Input/Input.tsx";
import { trpc } from "../utils/trpc.ts";
import styles from "./Util.module.css";

export default function Util() {
  const exportData = trpc.maintenance.exportData.useQuery();
  const [importDataString, setImportDataString] = useState("");
  const importData = trpc.maintenance.importData.useMutation();

  const fileUploadRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.container}>
      <Input
        value={JSON.stringify(exportData.data)}
        endIcon={
          <IconButton
            onClick={() => {
              if (exportData.data) {
                const a = document.createElement("a");
                a.setAttribute(
                  "href",
                  URL.createObjectURL(
                    new Blob([JSON.stringify(exportData.data)], {
                      type: "application/json",
                    })
                  )
                );
                a.setAttribute("download", dateFileName() + ".json");
                a.setAttribute("target", "_blank");
                a.click();
              }
            }}>
            <Download />
          </IconButton>
        }
        disabled
        label="Stringified Export Data"
        id="stringified-export-data"
      />
      <Input
        value={importDataString}
        onChange={(value) => {
          setImportDataString(value);
        }}
        endIcon={
          <IconButton
            onClick={() => {
              importData.mutate(JSON.parse(importDataString));
            }}>
            <Send />
          </IconButton>
        }
        label="Stringified Import Data"
        id="stringified-import-data"
      />
      <Button
        className={styles.fileUploadButton}
        onClick={() => {
          fileUploadRef.current?.click();
        }}>
        <FileUpload />
        Upload JSON File
        <input
          ref={fileUploadRef}
          type="file"
          accept="application/json"
          onChange={async (event) => {
            if (event.currentTarget.files) {
              const data = JSON.parse(
                await event.currentTarget.files[0].text()
              );
              importData.mutate(data);
            }
          }}
          hidden
        />
      </Button>
    </div>
  );
}
