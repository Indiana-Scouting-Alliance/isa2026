import { MAX_TEAM_NUMBER } from "@isa2026/api/src/utils/constants.ts";
import { User, UserPermLevel } from "@isa2026/api/src/utils/dbtypes.ts";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import Button from "../../components/Button/Button.tsx";
import IconButton from "../../components/Button/IconButton/IconButton.tsx";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../../components/Dialog/Dialog.tsx";
import Input from "../../components/Input/Input.tsx";
import Select from "../../components/Select/Select.tsx";
import { trpc } from "../../utils/trpc.ts";
import styles from "./CreateUser.module.css";

type CreateUserProps = {
  createUser: boolean;
  setCreateUser: (value: boolean) => void;
  refreshUsers: () => void;
};
export default function CreateUser({
  createUser: showCreateUser,
  setCreateUser,
  refreshUsers,
}: CreateUserProps) {
  const [createUserUsername, setCreateUserUsername] = useState("");
  const [createUserUsernameError, setCreateUserUsernameError] = useState("");
  const [createUserPassword, setCreateUserPassword] = useState("");
  const [createUserShowPassword, setCreateUserShowPassword] = useState(false);
  const [createUserPasswordError, setCreateUserPasswordError] = useState("");
  const [createUserPermLevel, setCreateUserPermLevel] =
    useState<User["permLevel"]>("team");
  const [createUserTeamNumber, setCreateUserTeamNumber] = useState<number>(0);
  const [createUserTeamNumberError, setCreateUserTeamNumberError] =
    useState("");
  const createUser = trpc.users.createUser.useMutation({
    onSuccess() {
      refreshUsers();
    },
  });

  return (
    <Dialog
      open={showCreateUser}
      onClose={() => {
        setCreateUser(false);
      }}>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <div className={styles.dialogContent}>
          <Input
            id="create-user-username"
            value={createUserUsername}
            onChange={(event) => {
              setCreateUserUsername(event.currentTarget.value);
            }}
            label="Username"
            helperText={createUserUsernameError}
            error={createUserUsernameError !== ""}
          />
          <Input
            id="create-user-password"
            value={createUserPassword}
            onChange={(event) => {
              setCreateUserPassword(event.currentTarget.value);
            }}
            label="Password"
            helperText={createUserPasswordError}
            error={createUserPasswordError !== ""}
            type={createUserShowPassword ? "text" : "password"}
            endIcon={
              <IconButton
                className={styles.showPasswordButton}
                onClick={() => {
                  setCreateUserShowPassword(!createUserShowPassword);
                }}>
                {createUserShowPassword ?
                  <VisibilityOff />
                : <Visibility />}
              </IconButton>
            }
          />
          <Select
            id="create-user-permLevel"
            value={createUserPermLevel}
            onChange={(value) => {
              setCreateUserPermLevel(value as User["permLevel"]);
            }}
            label="Permission Level">
            {UserPermLevel.map((perm) => (
              <option
                key={perm}
                value={perm}>
                {perm}
              </option>
            ))}
          </Select>
          <Input
            id="create-user-teamNumber"
            type="number"
            value={isNaN(createUserTeamNumber) ? "" : createUserTeamNumber}
            onChange={(event) => {
              setCreateUserTeamNumber(parseInt(event.currentTarget.value));
            }}
            label="Team Number"
            helperText={createUserTeamNumberError}
            error={createUserTeamNumberError !== ""}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          className={styles.actionButton}
          onClick={() => {
            setCreateUser(false);
          }}>
          Cancel
        </Button>
        <Button
          className={styles.actionButton}
          onClick={() => {
            let error = false;

            if (!createUserUsername) {
              setCreateUserUsernameError("Cannot be empty");
              error = true;
            } else {
              setCreateUserUsernameError("");
            }

            if (!createUserPassword) {
              setCreateUserPasswordError("Cannot be empty");
              error = true;
            } else {
              setCreateUserPasswordError("");
            }

            if (
              isNaN(createUserTeamNumber) ||
              createUserTeamNumber < 0 ||
              createUserTeamNumber > MAX_TEAM_NUMBER
            ) {
              setCreateUserTeamNumberError("Invalid team number");
              error = true;
            } else {
              setCreateUserTeamNumberError("");
            }

            if (!error) {
              createUser.mutate({
                username: createUserUsername,
                password: createUserPassword,
                permLevel: createUserPermLevel,
                teamNumber: createUserTeamNumber,
              });
              setCreateUser(false);
            }
          }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
