import { User } from "@isa2026/api/src/utils/dbtypes.ts";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button.tsx";
import { GridBorder } from "../components/GridBorder/GridBorder.tsx";
import IconButton from "../components/IconButton/IconButton.tsx";
import Input from "../components/Input/Input.tsx";
import { TextFieldDoubleLabel } from "../components/TextFieldLabel/TextFieldLabel.tsx";
import { trpc } from "../utils/trpc.ts";
import styles from "./Login.module.css";

type LoginProps = {
  setToken: (
    newToken: string,
    expiresAt: number,
    permLevel: User["permLevel"]
  ) => void;
};
export default function Login({ setToken }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [errorText, setErrorText] = useState("");

  const login = trpc.auth.login.useMutation({
    onSuccess(data) {
      if (data?.token) {
        if (data.permLevel === "team") {
          navigate("/data/export/robots");
        }
        setToken(
          data.token,
          data.expiresAt,
          data.permLevel as User["permLevel"]
        );
      }
    },
    onError(error) {
      setErrorText(error.message);
    },
  });

  return (
    <GridBorder>
      <div className={styles.container}>
        <img
          alt="ISA Logo"
          src={import.meta.env.BASE_URL + "logo.svg"}
          className={styles.logo}
        />
        <h3 className={styles.title}>Login</h3>
        <TextFieldDoubleLabel
          label="Username:"
          inputId="login-username">
          <Input
            id="login-username"
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
            placeholder="Enter Username"
            error={errorText !== ""}
          />
        </TextFieldDoubleLabel>
        <TextFieldDoubleLabel
          label="Password:"
          inputId="login-password">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submitRef.current?.click();
              }
            }}
            endIcon={
              <IconButton
                onClick={() => {
                  setShowPassword(!showPassword);
                }}>
                {showPassword ?
                  <VisibilityOff color="primary" />
                : <Visibility color="primary" />}
              </IconButton>
            }
            placeholder="Enter Password"
            error={errorText !== ""}
            helperText={errorText}
          />
        </TextFieldDoubleLabel>
        <Button
          htmlRef={submitRef}
          onClick={() => {
            login.mutate({ username, password });
          }}
          className={styles.submitButton}>
          Submit
        </Button>
      </div>
      <Button
        onClick={() => {
          navigate("/");
        }}
        className={styles.homeButton}>
        Return to Home
      </Button>
    </GridBorder>
  );
}
