import styles from "./RangeInput.module.css";

type RangeInputProps = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
};

export default function RangeInput({ min, max, step = 1, value, onChange }: RangeInputProps) {
  const count = Math.floor((max - min) / step) + 1;
  const labels = Array.from({ length: count }, (_, i) => min + i * step);

  return (
    <div className={styles.container}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={styles.input}
      />
      <div className={styles.labels}>
        {labels.map((n) => (
          <span
            key={n}
            className={`${styles.label} ${n === value ? styles.labelActive : ""}`}>
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
