import { LinkButton } from "./components/Button/LinkButton/LinkButton.tsx";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <div className={styles.overallFlex}>
      <h1 className={styles.appHeading}>Indiana Scouting Alliance</h1>
      <h2 className={styles.appSubheading}>2026 REBUILT</h2>
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
