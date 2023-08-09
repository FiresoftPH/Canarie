import styles from "./CompotencyCard.module.css";
import GUN from "../../assets/GUN.jpg";
import GoodRating from "../../assets/GoodRating.svg";
import BadRating from "../../assets/BadRating.svg";

const CompotencyCard = (props) => {
  

  return (
    <div className={styles.wrapper}>
      <img src={GUN} />
      <div className={styles.textContent}>
        {/* <div className={styles.upper}> */}
        <h2>{props.code}</h2>
        <img className={styles.left} src={props.rating === "GOOD" ? GoodRating : BadRating} />
        {/* </div> */}
        {/* <div className={styles.lower}> */}
        <p>{props.name}</p>
        <h1 className={styles.left}>{props.ranking}</h1>
        {/* </div> */}
      </div>
    </div>
  );
};

export default CompotencyCard;
