import EditIcon from "../../assets/EditIcon.svg";
import styles from "./StaticFileCard.module.css";
// import Close from "../../assets/CloseIcon.svg";
// import { useDispatch } from "react-redux";
// import { chatAction } from "../../store/chatSlice";

const StaticFileCard = (props) => {
  const { fileName } = props
  // const dispatch = useDispatch();
  // const [trigger, setTrigger] = useState(false)
  return (
    <div
      className={`${styles.wrapper} ${props.selected ? styles.selected : ""}`}
    >
      {/* {props.selected ? <div className={styles.backdrop} /> : ""} */}
      <img className={styles.editIcon} src={EditIcon} />
      {
        fileName.map((file) => {
          let fname = file.name
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
          <p>{fname}</p>
        )
        })
      }
    </div>
  );
};

export default StaticFileCard;
