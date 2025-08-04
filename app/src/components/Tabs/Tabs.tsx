import { useState } from "react";
import Tab from "./Tab.tsx";
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
        }}>
        {Object.keys(tabs).map((tab) => (
          <Tab
            key={tab}
            value={tab}>
            {tab}
          </Tab>
        ))}
      </TabBar>
      <div className={styles.contentContainer}>{tabs[currentTab]}</div>
    </div>
  );
}
