import ParrotIcon from "src/assets/ParrotIcon.svg";
import UserImage from "src/assets/UserImage.svg";
import LikeIcon from "src/assets/LikeIcon.svg";
import DislikeIcon from "src/assets/DislikeIcon.svg";
import FileIcon from "src/assets/FileIcon.svg";

import styles from "./ChattingCardUser.module.css";

const ChattingCardUser = (props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.message}>
        {props.file_attachment ? <img src={FileIcon} /> : ""}
        <p>{props.message}</p>
      </div>
      <img src={UserImage} />
    </div>
  );
};

export default ChattingCardUser;
