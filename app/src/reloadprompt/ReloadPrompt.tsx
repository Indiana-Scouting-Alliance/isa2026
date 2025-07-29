import Button from "../components/Button/Button.tsx";
import styles from "./ReloadPrompt.module.css";

import { useRegisterSW } from "virtual:pwa-register/react";

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: " + r);
      setOfflineReady(true);
      setTimeout(() => {
        setOfflineReady(false);
      }, 2000);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
    onNeedRefresh() {
      console.log("SW needs to be refreshed");
      setNeedRefresh(true);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className={styles.container}>
      {(offlineReady || needRefresh) && (
        <div className={styles.toast}>
          <div className={styles.message}>
            {!needRefresh ?
              "App ready to work offline"
            : "New content available, click on reload button to update."}
          </div>
          {needRefresh && (
            <Button
              className={styles.toastButton}
              onClick={() => updateServiceWorker(true)}>
              Reload
            </Button>
          )}
          <Button
            className={styles.toastButton}
            onClick={() => close()}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
