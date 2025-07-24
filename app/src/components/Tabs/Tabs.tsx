import { useState } from "react";
import TabBar from "./TabBar.tsx";
import styles from "./Tabs.module.css";

type TabsProps = {
  tabs: Record<string, React.ReactNode>;
};
export default function Tabs({ tabs }: TabsProps) {
  const [currentTab, setCurrentTab] = useState(Object.keys(tabs)[0]);

  return (
    <div className={styles.container}>
      <TabBar
        value={currentTab}
        onChange={(value) => {
          setCurrentTab(value);
        }}
        tabs={Object.keys(tabs)}
      />
      <div className={styles.contentContainer}>{tabs[currentTab]}</div>
    </div>
  );
}
