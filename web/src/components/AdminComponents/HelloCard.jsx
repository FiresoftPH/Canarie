import styles from "./HelloCard.module.css";

const HelloCard = (props) => {
  return (
    <>
      <div className={styles.profile_cover}>
        <div className={styles.profile}>
          <section className={styles.profile_pic}></section>
          <section className={styles.info_text}>
            <div className={styles.username}>
              <p>Hi,Admin User</p>
              <p>Blank</p>
              <p>Parrot</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default HelloCard;
