import { User } from "@isa2026/api/src/utils/dbtypes.ts";
import { LinkButton } from "../components/Button/LinkButton/LinkButton.tsx";
import styles from "./DataMenu.module.css";

type DataMenuProps = {
  permLevel: User["permLevel"];
};
export default function DataMenu({ permLevel }: DataMenuProps) {
  return (
    <div className={styles.container}>
      <div className={styles.menuGroup}>
        {
          //TODO: uncomment when data viewer actually works well
          // ["demo", "team", "datamanage", "admin"].includes(permLevel) && (
          //   <LinkButton
          //     to="/data/view"
          //     color="primary">
          //     View Data
          //   </LinkButton>
          // )
        }
        {["team", "datamanage", "admin"].includes(permLevel) && (
          <LinkButton
            to="/data/export/robots"
            className={styles.menuButton}>
            Export Data
          </LinkButton>
        )}
        {["datamanage", "admin"].includes(permLevel) && (
          <LinkButton
            to="/data/review"
            className={styles.menuButton}>
            Review Data
          </LinkButton>
        )}
        {["admin"].includes(permLevel) && (
          <LinkButton
            to="/data/users"
            className={styles.menuButton}>
            Manage Users
          </LinkButton>
        )}
        {["admin"].includes(permLevel) && (
          <LinkButton
            to="/data/util"
            className={styles.menuButton}>
            Util
          </LinkButton>
        )}
      </div>
    </div>
  );
}
