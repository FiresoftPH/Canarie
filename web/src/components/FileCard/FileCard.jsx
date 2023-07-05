import EditIcon from "../../assets/EditIcon.svg";
import styles from "./FileCard.module.css";

const FileCard = (props) => {
  return (
    <div className={`${styles.wrapper} ${props.selected ? styles.selected : ""}`}>
        {props.selected ? <div className={styles.backdrop} /> : ""}
        <img className={styles.editIcon} src={EditIcon} />
        <p>{props.name}</p>
    </div>
  );
};

export default FileCard;
