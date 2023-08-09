import styles from "./Feedback.module.css";

const Feedback = (props) => {
  return (
    <>
      <div className={styles.feedback_dash}>
        <div className={styles.feedback_dash_bar}>
          <img src="src/assets/Feedback icon.svg" />
          <section className={styles.feedback_text}>
            <p>Feedback</p>
            <p>Performance of the AI model</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Feedback;
