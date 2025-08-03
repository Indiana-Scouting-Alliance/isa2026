import styles from "./Input.module.css";

type TextAreaProps = {
  value: string | number;
  onChange?: (event: string) => void;
  id: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  outlineClassName?: string;
  rows?: number;
  inputClassName?: string;
};
export default function TextArea({
  value,
  onChange,
  id,
  onKeyDown,
  placeholder,
  label,
  error,
  helperText,
  disabled,
  className,
  outlineClassName,
  rows,
  inputClassName,
}: TextAreaProps) {
  return (
    <div className={styles.container + " " + (className || "")}>
      {label && (
        <label
          htmlFor={id}
          className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={
          styles.outline +
          " " +
          (error ? styles.errorOutline : "") +
          " " +
          (outlineClassName || "")
        }>
        <textarea
          className={
            styles.input +
            " " +
            (disabled ? styles.inputDisabled : "") +
            " " +
            (inputClassName || "")
          }
          value={value}
          onChange={(event) => {
            if (onChange) {
              onChange(event.currentTarget.value);
            }
          }}
          id={id}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}></textarea>
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
