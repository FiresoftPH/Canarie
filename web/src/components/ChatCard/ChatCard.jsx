import styles from "./ChatCard.module.css";
import ChatIconNoBG from "../../assets/ChatIconNoBG.svg";
import Close from "../../assets/CloseIcon.svg";

const ChatCard = (props) => {
  return (
    <>
      <div className={`${styles.wrapper} ${props.selected ? styles.selected : ""}`} onClick={() => {
        console.log(`${props.sessionName} selected!`)
        props.onSelect(props.id)
      }}>
        <img src={ChatIconNoBG} className={styles.chatIcon} />
        <p>
          <span className={styles.sessionName}>{props.sessionName}</span>
          <br />
          <span className={styles.assignment}># {props.assignment}</span>
        </p>
        <img onClick={() => {
            props.delete(props.id)
        }} src={Close} className={styles.delete} />
      </div>
    </>
  );
};

export default ChatCard;
