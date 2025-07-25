import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import IconButton from "../IconButton/IconButton.tsx";
import styles from "./Checkbox.module.css";

type CheckboxProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  id: string;
  label?: string | React.ReactNode;
};
export default function Checkbox({
  value,
  onChange,
  id,
  label,
}: CheckboxProps) {
  return (
    <div className={styles.container}>
      <IconButton
        onClick={() => {
          onChange(!value);
        }}>
        {value ?
          <CheckBox />
        : <CheckBoxOutlineBlank />}
        <input
          type="checkbox"
          id={id}
          checked={value}
          onChange={(event) => {
            onChange(event.currentTarget.checked);
          }}
          hidden
        />
      </IconButton>
      {label && (
        <label
          htmlFor={id}
          className={styles.label}>
          {label}
        </label>
      )}
    </div>
  );
}
