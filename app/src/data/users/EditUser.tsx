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
import styles from "./UserDialog.module.css";

type EditUserProps = {
  editUserUsername: string | null;
  setEditUserUsername: (value: string | null) => void;
  editUserOldUsername: string | null;
  editUserPermLevel: User["permLevel"] | undefined;
  setEditUserPermLevel: (value: User["permLevel"] | undefined) => void;
  editUserTeamNumber: number | undefined;
  setEditUserTeamNumber: (value: number | undefined) => void;
  closeEditUser: () => void;
  refreshUsers: () => void;
};
export default function EditUser({
  editUserUsername,
  setEditUserUsername,
  editUserOldUsername,
  editUserPermLevel,
  setEditUserPermLevel,
  editUserTeamNumber,
  setEditUserTeamNumber,
  closeEditUser,
  refreshUsers,
}: EditUserProps) {
  const editUser = trpc.users.editUser.useMutation({
    onSuccess() {
      refreshUsers();
    },
  });
  const [editUserUsernameError, setEditUserUsernameError] = useState("");
  const [editUserPassword, setEditUserPassword] = useState("");
  const [editUserShowPassword, setEditUserShowPassword] = useState(false);
  const [editUserTeamNumberError, setEditUserTeamNumberError] = useState("");

  return (
    <Dialog
      open={editUserUsername !== null}
      onClose={() => {
        closeEditUser();
      }}>
      <DialogTitle>Manage User</DialogTitle>
      <DialogContent>
        <div className={styles.dialogContent}>
          <Input
            id="edit-user-username"
            value={editUserUsername || ""}
            onChange={(value) => {
              setEditUserUsername(value);
            }}
            label="Username"
            helperText={editUserUsernameError}
            error={editUserUsernameError !== ""}
          />
          <Select
            id="edit-user-permLevel"
            value={editUserPermLevel || ""}
            onChange={(value) => {
              setEditUserPermLevel(value as User["permLevel"]);
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
            id="edit-user-teamNumber"
            value={
              editUserTeamNumber === undefined || isNaN(editUserTeamNumber) ?
                ""
              : editUserTeamNumber
            }
            onChange={(value) => {
              setEditUserTeamNumber(parseInt(value));
            }}
            label="Team Number"
            helperText={editUserTeamNumberError}
            error={editUserTeamNumberError !== ""}
          />
          <Input
            id="edit-user-password"
            value={editUserPassword}
            onChange={(value) => {
              setEditUserPassword(value);
            }}
            label="Password"
            type={editUserShowPassword ? "text" : "password"}
            endIcon={
              <IconButton
                className={styles.showPasswordButton}
                onClick={() => {
                  setEditUserShowPassword(!editUserShowPassword);
                }}>
                {editUserShowPassword ?
                  <VisibilityOff />
                : <Visibility />}
              </IconButton>
            }
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          className={styles.actionButton}
          onClick={() => {
            closeEditUser();
          }}>
          Cancel
        </Button>
        <Button
          className={styles.actionButton}
          onClick={() => {
            let error = false;

            if (!editUserUsername) {
              setEditUserUsernameError("Cannot be empty");
              error = true;
            } else {
              setEditUserUsernameError("");
            }

            if (
              editUserTeamNumber === undefined ||
              isNaN(editUserTeamNumber) ||
              editUserTeamNumber < 0 ||
              editUserTeamNumber > MAX_TEAM_NUMBER
            ) {
              setEditUserTeamNumberError("Invalid team number");
              error = true;
            } else {
              setEditUserTeamNumberError("");
            }

            if (!error) {
              editUser.mutate({
                oldUsername: editUserOldUsername!,
                newUsername: editUserUsername!,
                permLevel: editUserPermLevel!,
                password: editUserPassword ? editUserPassword : undefined,
                teamNumber: editUserTeamNumber!,
              });
              closeEditUser();
            }
          }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
