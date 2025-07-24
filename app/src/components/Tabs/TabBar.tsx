import styles from "./TabBar.module.css";

type TabBarProps = {
  value: string;
  onChange: (value: string) => void;
  tabs: string[];
};
export default function TabBar({ value, onChange, tabs }: TabBarProps) {
  return (
    <div className={styles.tabBar}>
      {tabs.map((tab) => (
        <div
          key={tab}
          className={styles.tab + " " + (tab === value ? styles.activeTab : "")}
          onClick={() => {
            onChange(tab);
          }}>
          {tab}
        </div>
      ))}
    </div>
  );
}
