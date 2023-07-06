import styles from "./ChattingCardAI.module.css";

import ParrotIcon from "src/assets/ParrotIcon.svg";
import UserImage from "src/assets/UserImage.svg";
import LikeIcon from "src/assets/LikeIcon.svg";
import DislikeIcon from "src/assets/DislikeIcon.svg";
import FileIcon from "src/assets/FileIcon.svg";

const ChattingCardAI = (props) => {
  return (
    <div className={styles.wrapper}>
      <img src={ParrotIcon} />

      {props.assignments
        ? props.assignments.map((assignment) => {
            return <p>{assignment.name}</p>;
          })
        : ""}
      <div className={styles.message}>
        <p>{props.message}</p>
        <div className={styles.preference}>
          <img className={styles.like} src={LikeIcon} />
          <img src={DislikeIcon} />
        </div>
      </div>
    </div>
  );
};

export default ChattingCardAI;
