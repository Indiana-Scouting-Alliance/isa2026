import React from "react";
import LabeledContainer from "../LabeledContainer/LabeledContainer";
import styles from "./FuelPercentageCounter.module.css";

type FuelPercentageCounterProps = {
  value: number;
  setValue: (value: number) => void;
  label: string;
  maxValue: number;
};
export default function FuelPercentageCounter({
  value,
  setValue,
  label,
  maxValue,
}: FuelPercentageCounterProps) {
  const percentage = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = parseInt(e.target.value, 10);
    const newValue = Math.round((newPercentage / 100) * maxValue);
    setValue(newValue);
  };

  return (
    <LabeledContainer label={label} showLabelBorder={true}>
      <div className={styles.container}>
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={handleSliderChange}
          className={styles.slider}
        />
        <div className={styles.value}>{percentage}%</div>
      </div>
    </LabeledContainer>
  );
}
