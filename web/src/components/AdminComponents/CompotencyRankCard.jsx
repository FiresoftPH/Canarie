import styles from "./CompotencyRankCard.module.css";

const CompotencyRankCard = ({ ranking, name }) => {
//   console.log(ranking, name);

  return (
    <div className={styles.wrapper}>
      <p>{ranking}</p>
      <div className={styles.right}>
        <div className={styles.miniBD}></div>
        <div className={styles.bg}></div>
        <p>{name}</p>
      </div>
    </div>
  );
};

export default CompotencyRankCard;
