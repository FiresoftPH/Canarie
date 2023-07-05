import EditIcon from "../../assets/EditIcon.svg";
import styles from "./FileCard.module.css";
<<<<<<< HEAD

const FileCard = (props) => {
  return (
    <div className={`${styles.wrapper} ${props.selected ? styles.selected : ""}`}>
        {props.selected ? <div className={styles.backdrop} /> : ""}
        <img className={styles.editIcon} src={EditIcon} />
        <p>{props.name}</p>
=======
import Close from '../../assets/CloseIcon.svg';

const FileCard = (props) => {
  return (
    <div
      className={`${styles.wrapper} ${props.selected ? styles.selected : ""}`}
    >
      {/* <> */}
        {props.selected ? <div className={styles.backdrop} /> : ""}
        <img className={styles.editIcon} src={EditIcon} />
        <p>{props.name}</p>
        <img className={styles.delete} src={Close} />
      {/* </> */}
>>>>>>> 04a1e4da3c8ed786e06a3d5f28a518f56978cb36
    </div>
  );
};

export default FileCard;
