import EditIcon from "../../assets/EditIcon.svg";
import styles from "./FileCard.module.css";
import Close from "../../assets/CloseIcon.svg";

const FileCard = (props) => {
  return (
    <div
      className={`${styles.wrapper} ${props.selected ? styles.selected : ""}`}
      onClick={() => {
        props.onSelect(props.id);
      }}
    >
      {/* <> */}
      {props.selected ? <div className={styles.backdrop} /> : ""}
      <img className={styles.editIcon} src={EditIcon} />
      <p>{props.name}</p>
      <img
        className={styles.delete}
        src={Close}
        onClick={() => {
          props.onDelete(props.id);
        }}
      />
      {/* </> */}
    </div>
  );
};

export default FileCard;
