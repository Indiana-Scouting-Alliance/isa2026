import styles from "./Input.module.css";

type InputProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password" | "email" | "number" | "search";
  id?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  placeholder?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
};
export default function Input({
  value,
  onChange,
  type = "text",
  id,
  onKeyDown,
  startIcon,
  endIcon,
  placeholder,
  label,
  error,
  helperText,
}: InputProps) {
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <div
        className={styles.outline + " " + (error ? styles.errorOutline : "")}>
        {startIcon}
        <input
          className={styles.input}
          value={value}
          onChange={onChange}
          type={type}
          id={id}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
        />
        {endIcon}
      </div>
      {helperText && (
        <p
          className={
            styles.helperText + " " + (error ? styles.helperTextError : "")
          }>
          {helperText}
        </p>
      )}
    </div>
  );
}
