import { User } from "@isa2026/api/src/utils/dbtypes.ts";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Button from "../components/Button/Button.tsx";
import { GridBorder } from "../components/GridBorder/GridBorder.tsx";
import styles from "./DataLayout.module.css";

const DataMenu = React.lazy(() => import("./DataMenu.tsx"));
const Export = React.lazy(() => import("./export/Export.tsx"));
const Users = React.lazy(() => import("./users/Users.tsx"));
const Util = React.lazy(() => import("./Util.tsx"));

type DataLayoutProps = {
  setToken: (
    newToken: string,
    expiresAt: number,
    permLevel: User["permLevel"]
  ) => void;
  permLevel: User["permLevel"];
};
export default function DataLayout({ setToken, permLevel }: DataLayoutProps) {
  const navigate = useNavigate();
  const logoutFunction = () => {
    setToken("", 0, "none");
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <img
          alt="ISA Logo"
          src="/logo.svg"
          className={styles.logo}
          onClick={() => {
            navigate("/");
          }}
        />
        <h2
          className={styles.title}
          onClick={() => {
            navigate("/");
          }}>
          Indiana Scouting Alliance
        </h2>
        <div className={styles.spacer}></div>
        <Button
          onClick={() => {
            if (window.location.pathname === "/data") {
              navigate("/");
            } else {
              navigate("/data");
            }
          }}
          className={styles.topBarButton}>
          Return
        </Button>
        <Button
          onClick={() => {
            logoutFunction();
          }}
          className={styles.topBarButton}>
          Log Out
        </Button>
      </div>
      <div className={styles.contentContainer}>
        <GridBorder>
          <Routes>
            {["demo", "team", "datamanage", "admin"].includes(permLevel) && (
              <Route
                path="/"
                element={<DataMenu permLevel={permLevel} />}
              />
            )}
            {["team", "datamanage", "admin"].includes(permLevel) && (
              <Route
                path="export/*"
                element={<Export />}
              />
            )}
            {["datamanage", "admin"].includes(permLevel) && (
              <Route
                path="review"
                element={<div>Review Data</div>}
              />
            )}
            {["admin"].includes(permLevel) && (
              <Route
                path="users"
                element={<Users logoutFunction={logoutFunction} />}
              />
            )}
            {["admin"].includes(permLevel) && (
              <Route
                path="util"
                element={<Util />}
              />
            )}
          </Routes>
        </GridBorder>
      </div>
    </div>
  );
}
