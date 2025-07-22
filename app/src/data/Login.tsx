import { User } from "@isa2025/api/src/utils/dbtypes.ts";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button.tsx";
import { GridBorder } from "../components/GridBorder/GridBorder.tsx";
import { TextFieldDoubleLabel } from "../components/TextFieldLabel.tsx";
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
          src="/logo.svg"
          className={styles.logo}
        />
        <Typography
          variant="h3"
          fontSize="2rem"
          sx={{
            mb: 2,
          }}>
          Login
        </Typography>
        <TextFieldDoubleLabel label="Username:">
          <TextField
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
            placeholder="Enter Username"
            error={errorText !== ""}
            color="primary"
            size="small"
            sx={{
              width: 1,
              borderColor: "primary.main",
            }}
          />
        </TextFieldDoubleLabel>
        <TextFieldDoubleLabel label="Password:">
          <TextField
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
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}>
                      {showPassword ?
                        <VisibilityOff color="primary" />
                      : <Visibility color="primary" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            placeholder="Enter Password"
            error={errorText !== ""}
            helperText={errorText}
            variant="outlined"
            size="small"
            sx={{
              width: 1,
              borderColor: "primary.main",
            }}
          />
        </TextFieldDoubleLabel>
        <Button
          ref={submitRef}
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
