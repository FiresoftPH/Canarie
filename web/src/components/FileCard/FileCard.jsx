import EditIcon from "../../assets/EditIcon.svg";
import styles from "./FileCard.module.css";
import Close from "../../assets/CloseIcon.svg";
import { useDispatch } from "react-redux";
import { chatAction } from "../../store/chatSlice";

const FileCard = (props) => {
  let fname = props.name;
  const dispatch = useDispatch()

  try {
    if (fname.split(".")[0].length > 10) {
      fname = props.name.split(".")[0].slice(0, 9) + "... " + props.name.split(".")[1]
    }
  } catch (err) {
    fname = props.name
  }

  return (
    <div
      className={`${styles.wrapper} ${props.selected ? styles.selected : ""}`}
      onClick={() => {
        props.onSelect(props.id);
        dispatch(chatAction.setFileId(props.id))
      }}
    >
      {/* <> */}
      {props.selected ? <div className={styles.backdrop} /> : ""}
      <img className={styles.editIcon} src={EditIcon} />
      <p>{fname}</p>
      {props.noDelete ? "" : <img
        className={styles.delete}
        src={Close}
        onClick={() => {
          props.onDelete(props.id);
        }}
      />}
      {/* </> */}
    </div>
  );
};

export default FileCard;
