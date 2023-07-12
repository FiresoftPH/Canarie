import styles from "./ChattingCardAI.module.css";

import ParrotIcon from "src/assets/ParrotIcon.svg";
import UserImage from "src/assets/UserImage.svg";
import LikeIcon from "src/assets/LikeIcon.svg";
import DislikeIcon from "src/assets/DislikeIcon.svg";
import FileIcon from "src/assets/FileIcon.svg";
import LikeIconFilled from "src/assets/LikeIconFilled.svg";

import { useState } from "react";

const ChattingCardAI = (props) => {
  const [rate, setRate] = useState();

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
        {/* <div className={styles.preference}> */}
        {props.rating === "none" ? (
          <div className={styles.preference}>
            <img
              onClick={() => {
                props.onRate("good", props.id);
              }}
              className={styles.like}
              src={LikeIcon}
            />
            <img
              onClick={() => {
                props.onRate("bad", props.id);
              }}
              src={DislikeIcon}
            />
          </div>
        ) : props.rating === "good" ? (
          <div className={styles.preferenceSelected}>
            <img className={styles.likeFilled} src={LikeIconFilled} />
          </div>
        ) : (
          <div className={styles.preference}>
            <img src={DislikeIcon} />
          </div>
        )}
        {/* </div> */}
      </div>
    </div>
  );
};

export default ChattingCardAI;
