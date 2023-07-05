import EditIcon from "../../assets/EditIcon.svg";
import styles from "./FileCard.module.css";

const FileCard = (props) => {
  return (
    <div className={styles.wrapper}>
      <>
        <img src={EditIcon} />
        <p>{props.name}</p>
      </>
    </div>
  );
};

export default FileCard;
