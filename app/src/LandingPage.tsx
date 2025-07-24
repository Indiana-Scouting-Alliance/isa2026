import { LinkButton } from "./components/LinkButton/LinkButton.tsx";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <div className={styles.overallFlex}>
      <h1 className={styles.appHeading}>Indiana Scouting Alliance 2026</h1>
      <div className={styles.buttonsFlex}>
        <LinkButton
          to="/scout"
          className={styles.menuButton}>
          Scout
        </LinkButton>
        <LinkButton
          to="/scout/savedmatches"
          className={styles.menuButton}>
          Saved Matches
        </LinkButton>
        <LinkButton
          to="/setup"
          className={styles.menuButton}>
          Device Setup
        </LinkButton>
        <LinkButton
          to="/data"
          className={styles.menuButton}>
          View Data
        </LinkButton>
      </div>
    </div>
  );
}
