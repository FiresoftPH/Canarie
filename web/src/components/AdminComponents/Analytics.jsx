import styles from "./Analytics.module.css";
import AnalyticsIcon from '../../assets/Analytics icon.svg'

const Analytics = (props) => {
  return (
    <>
      <div className={styles.analytics_dash}>
        <div className={styles.analytics_dash_bar}>
          <img src={AnalyticsIcon} />
          <section className={styles.analytics_text}>
            <p>Analytics</p>
            <p>Total</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Analytics;
