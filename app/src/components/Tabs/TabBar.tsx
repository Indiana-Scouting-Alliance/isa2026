import React from "react";
import { TabProps } from "./Tab.tsx";
import styles from "./TabBar.module.css";

type TabBarProps = {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
};
export default function TabBar({ value, onChange, children }: TabBarProps) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<TabProps>(child)) {
      return React.cloneElement(child, {
        selected: value === child.props.value,
        onClick: () => {
          onChange(child.props.value);
        },
      });
    } else {
      return child;
    }
  });

  return <div className={styles.tabBar}>{childrenWithProps}</div>;
}
