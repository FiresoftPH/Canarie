import ParrotIcon from "src/assets/ParrotIcon.svg";
import UserImage from "src/assets/UserImage.svg";
import LikeIcon from "src/assets/LikeIcon.svg";
import DislikeIcon from "src/assets/DislikeIcon.svg";
import FileIcon from "src/assets/FileIcon.svg";

import styles from "./ChattingCardUser.module.css";
import { useState } from "react";
import FileAttachmentModal from "../FileAttachmentModal/FileAttachmentModal";

const ChattingCardUser = (props) => {
  console.log(props.file_attachment);
  const [toggle, setToggle] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.message}>
        {props.file_attachment.length !== 0 ? (
          <img
            onClick={() => {
              setToggle(!toggle);
            }}
            src={FileIcon}
          />
        ) : (
          ""
        )}
        <p>{props.message}</p>
      </div>
      <img src={UserImage} />
      {toggle ? <FileAttachmentModal
        files={props.file_attachment}
        static
        toggle={() => {
          setToggle(!toggle);
        }}
      /> : ""}
    </div>
  );
};

export default ChattingCardUser;
