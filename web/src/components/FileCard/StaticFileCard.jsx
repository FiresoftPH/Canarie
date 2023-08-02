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
  const length = 20;
  try {
    if (fname.split(".")[0].length > length) {
      fname =
        props.name.split(".")[0].slice(0, length - 1) +
        "... " +
        props.name.split(".")[1];
    }
  } catch (err) {
    fname = props.name;
  }

  return (
    <div
      className={`${styles.wrapper} ${props.selected ? styles.selected : ""}`}
    >
      {props.selected ? <div className={styles.backdrop} /> : ""}
      <img className={styles.editIcon} src={EditIcon} />
      <p>{fname}</p>
    </div>
  );
};

export default FileCard;
