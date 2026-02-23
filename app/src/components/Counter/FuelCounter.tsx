import React from "react";
import LabeledContainer from "../LabeledContainer/LabeledContainer";
import styles from "./FuelCounter.module.css";

type FuelCounterProps = {
  value: number;
  setValue: (value: number) => void;
  label: string;
  incrementStep?: number;
  decrementStep?: number;
};
export default function FuelCounter({
  value,
  setValue,
  label,
  incrementStep = 5,
  decrementStep = 1,
}: FuelCounterProps) {
  // ref for interval so we can clear it when press/release
  const intervalRef = React.useRef<number | null>(null);
  // keep a ref to the latest value since setValue doesn't accept a function
  const valueRef = React.useRef(value);

  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const startDecrement = () => {
    // avoid multiple intervals
    if (intervalRef.current !== null) return;
    // use 100ms interval for continuous change
    intervalRef.current = window.setInterval(() => {
      setValue(Math.max(0, valueRef.current - decrementStep));
    }, 100);
  };

  const stopDecrement = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // cleanup on unmount
  React.useEffect(() => {
    return () => stopDecrement();
  }, []);
  return (
    <LabeledContainer label={label} showLabelBorder={true}>
      <button
        className={styles.incrementButton}
        onClick={() => setValue(value + incrementStep)}>
        +{incrementStep}
      </button>
      <div className={styles.value}>{value}</div>
      {value > 0 && (
        <button
          className={styles.decrementButton}
          onClick={(e) => {
            e.stopPropagation();
            setValue(Math.max(0, value - decrementStep));
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            startDecrement();
          }}
          onMouseUp={stopDecrement}
          onMouseLeave={stopDecrement}
          onTouchStart={(e) => {
            e.preventDefault();
            startDecrement();
          }}
          onTouchEnd={stopDecrement}
          onTouchCancel={stopDecrement}
        >
          &minus;
        </button>
      )}
    </LabeledContainer>
  );
}
