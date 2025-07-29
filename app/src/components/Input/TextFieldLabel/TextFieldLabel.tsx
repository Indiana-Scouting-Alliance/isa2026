import styles from "./TextFieldLabel.module.css";

type TextFieldDoubleLabelProps = {
  label: string;
  children: React.ReactNode;
  inputId: string;
};
export function TextFieldDoubleLabel({
  label,
  children,
  inputId,
}: TextFieldDoubleLabelProps) {
  // ! Note: this is prob a terrible way to do this but I can't think of a better way rn -Jiping

  return (
    <div className={styles.container}>
      <div>
        <TextFieldLabelTypography inputId={inputId}>
          {label}
        </TextFieldLabelTypography>
      </div>
      <div className={styles.textFieldContainer}>{children}</div>
      <div className={styles.hiddenLabelContainer}>
        <TextFieldLabelTypography inputId={inputId}>
          {label}
        </TextFieldLabelTypography>
      </div>
    </div>
  );
}

type TextFieldLabelTypographyProps = {
  children: React.ReactNode;
  inputId: string;
};
function TextFieldLabelTypography({
  children,
  inputId,
}: TextFieldLabelTypographyProps) {
  return (
    <label
      className={styles.label}
      htmlFor={inputId}>
      {children}
    </label>
  );
}
