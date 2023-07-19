import styles from "./AssignmentCard.module.css";
import 'boxicons';

const AssignmentCard = (props) => {
  return (
    <div
      className={`${styles.wrapper} ${props.pressed ? styles.pressed : ""}`}
      onClick={() => {
        props.onSelect(props.id, props.name)
      }}
    >
      {/* <img src={props.icon} /> */}
      <box-icon name='book-open'></box-icon>
      <p>{props.name}</p>
    </div>
  );
};

export default AssignmentCard;
