import EditIcon from "../../assets/EditIcon.svg";
import styles from "./FileCard.module.css";
import Close from "../../assets/CloseIcon.svg";
import { useDispatch } from "react-redux";
import { chatAction } from "../../store/chatSlice";
import { useState } from "react";

const FileCard = (props) => {
  let fname = props.name;
  const dispatch = useDispatch();

  // const [trigger, setTrigger] = useState(false)
  let del = false;

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
        if (del === false) {
          props.onSelect(props.id);
          dispatch(chatAction.setFileId(props.id))
          console.log("selected")
        } else {
          del = false
        }
      }}
    >
      {props.selected ? <div className={styles.backdrop} /> : ""}
      <img className={styles.editIcon} src={EditIcon} />
      <p>{fname}</p>
      {props.noDelete ? "" : <img
        className={styles.delete}
        src={Close}
        onClick={() => {
          props.onDelete(props.id);
          del = true
          // console.log("selecte1")
        }}
      />}
    </div>
  );
};

export default FileCard;
