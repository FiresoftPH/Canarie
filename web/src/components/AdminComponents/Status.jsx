import styles from "./Status.module.css";
import OnlineIcon from '../../assets/Online icon.svg';

const Status = () => {
  return (
    <>
      <div className={styles.user_online}>
        <section className={styles.user_online_title}>
          <img src={OnlineIcon} />
          <p>Online</p>
        </section>
        <section className={styles.user_online_list}>
          <p>$num</p>
          <p> &nbsp;Users</p>
        </section>
      </div>
    </>
  );
};

export default Status;
