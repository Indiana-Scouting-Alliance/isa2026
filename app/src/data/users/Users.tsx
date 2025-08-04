import {
  User,
  UserColumn,
  UserColumns,
  UserPermLevel,
} from "@isa2026/api/src/utils/dbtypes.ts";
import { Delete, Edit, FilterAltOff, Refresh } from "@mui/icons-material";
import { useState } from "react";
import Button from "../../components/Button/Button.tsx";
import IconButton from "../../components/Button/IconButton/IconButton.tsx";
import Input from "../../components/Input/Input.tsx";
import Select from "../../components/Select/Select.tsx";
import { Table, TableHead, Td, Th } from "../../components/Table/Table.tsx";
import { trpc } from "../../utils/trpc.ts";
import CreateUser from "./CreateUser.tsx";
import EditUser from "./EditUser.tsx";
import styles from "./Users.module.css";

type UsersProps = {
  logoutFunction: () => void;
};
export default function Users({ logoutFunction }: UsersProps) {
  const users = trpc.users.users.useQuery(undefined, {
    retry: (_failureCount, error) => {
      if (error.data?.httpStatus === 401) {
        logoutFunction();
        return false;
      } else {
        return true;
      }
    },
  });

  const [searchUsername, setSearchUsername] = useState("");
  const [searchPermLevel, setSearchPermLevel] = useState<
    User["permLevel"] | ""
  >("");

  const [editUserOldUsername, setEditUserOldUsername] = useState<string | null>(
    null
  );
  const [editUserUsername, setEditUserUsername] = useState<string | null>(null);
  const [editUserPermLevel, setEditUserPermLevel] = useState<
    User["permLevel"] | undefined
  >(undefined);
  const [editUserTeamNumber, setEditUserTeamNumber] = useState<
    number | undefined
  >(undefined);
  const openEditUser = (username: string) => {
    setEditUserUsername(username);
    setEditUserOldUsername(username);
    setEditUserPermLevel(
      users.data?.find((user) => user.username === username)?.permLevel
    );
    setEditUserTeamNumber(
      users.data?.find((user) => user.username === username)?.teamNumber
    );
  };
  const closeEditUser = () => {
    setEditUserUsername(null);
    setEditUserOldUsername(null);
  };

  const [createUser, setCreateUser] = useState(false);

  return (
    <div className={styles.screenContainer}>
      <div className={styles.paper}>
        <Input
          id="search-username"
          value={searchUsername}
          onChange={(value) => {
            setSearchUsername(value);
          }}
          label="Username"
          className={styles.paperInput}
        />
        <Select
          id="search-permLevel"
          value={searchPermLevel}
          onChange={(value) => {
            setSearchPermLevel(value as User["permLevel"] | "");
          }}
          label="PermLevel"
          className={styles.paperInput}>
          <option value="">-</option>
          {UserPermLevel.map((perm) => (
            <option
              key={perm}
              value={perm}>
              {perm}
            </option>
          ))}
        </Select>
        <Button
          onClick={() => {
            setCreateUser(true);
          }}
          className={styles.paperButton}>
          Create User
        </Button>
        <IconButton
          onClick={() => {
            users.refetch();
          }}
          className={styles.paperIconButton}>
          <Refresh />
        </IconButton>
        <IconButton
          onClick={() => {
            setSearchUsername("");
            setSearchPermLevel("");
          }}
          className={styles.paperIconButton}>
          <FilterAltOff />
        </IconButton>
      </div>
      <div className={styles.tableContainer}>
        <Table className={styles.table}>
          <TableHead>
            <tr>
              {UserColumns.map((column) =>
                column !== "hashedPassword" ?
                  <Th key={column}>
                    {
                      {
                        username: "Username",
                        permLevel: "Permissions",
                        teamNumber: "Team",
                      }[column]
                    }
                  </Th>
                : null
              )}
              <Th>Actions</Th>
            </tr>
          </TableHead>
          <tbody>
            {users.data?.map((user) => {
              if (searchUsername) {
                if (!user.username.includes(searchUsername)) {
                  return;
                }
              }
              if (searchPermLevel) {
                if (user.permLevel !== searchPermLevel) {
                  return;
                }
              }
              return (
                <tr key={user.username}>
                  {UserColumns.map((column) =>
                    column !== "hashedPassword" ?
                      <Td key={column}>{user[column as UserColumn]}</Td>
                    : null
                  )}
                  <Td>
                    <div className={styles.tableActions}>
                      <IconButton
                        onClick={() => {
                          openEditUser(user.username);
                        }}
                        className={styles.editButton}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          //TODO
                        }}
                        className={styles.deleteButton}>
                        <Delete />
                      </IconButton>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <EditUser
        editUserUsername={editUserUsername}
        setEditUserUsername={setEditUserUsername}
        editUserOldUsername={editUserOldUsername}
        editUserPermLevel={editUserPermLevel}
        setEditUserPermLevel={setEditUserPermLevel}
        editUserTeamNumber={editUserTeamNumber}
        setEditUserTeamNumber={setEditUserTeamNumber}
        closeEditUser={closeEditUser}
        refreshUsers={() => {
          users.refetch();
        }}
      />
      <CreateUser
        createUser={createUser}
        setCreateUser={setCreateUser}
        refreshUsers={() => {
          users.refetch();
        }}
      />
    </div>
  );
}
