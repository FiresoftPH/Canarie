// import ParrotIcon from "src/assets/ParrotIcon.svg";
import UserImage from "src/assets/UserImage.svg";
// import LikeIcon from "src/assets/LikeIcon.svg";
// import DislikeIcon from "src/assets/DislikeIcon.svg";
import FileIcon from "src/assets/FileIcon.svg";
import styles from "./ChattingCardUser.module.css";
import { useState } from "react";
// import FileAttachmentModal from "../FileAttachmentModal/FileAttachmentModal";
import { memo } from "react";
import StaticFileAttachmentModal from '../FileAttachmentModal/StaticFileAttachmentModal.jsx';
import ReactMarkdown from "react-markdown";

const ChattingCardUser = memo(function ChattingCardUser(props) {
  // console.log(props.file_attachment);
  const [toggle, setToggle] = useState(false);
  // console.log("USER CARD RE-RENDER");
  // Make deep copy for file attachments
  let files = JSON.parse(JSON.stringify(props.file_attachment));

  // Lists all files attached
  if (props.message.split("$^$Reference files$^$:\n").length > 1) {
    const filesStr = props.message.split("$^$Reference files$^$:\n")[1];
    // console.log(filesStr)
    const files_code = filesStr.split("\n");
    // console.log(files_code)
    const fileList = [];
    for (const i in files_code) {
      // console.log(i + 1)
      // console.log(files_code[parseInt(i)])
      if (
        files_code[parseInt(i)].includes(": ") &&
        files_code[parseInt(i) + 1] == "" &&
        files_code[parseInt(i)].includes(".") &&
        files_code[parseInt(i)].split(".").length >= 2
      ) {
        const fName = files_code[i].split(": ")[0];
        console.log(fName);
        fileList.push(fName)
      }
    }
    if (fileList.length !== 0) {
      files = fileList
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.message}>
        {files.length !== 0 ? (
          <img
            onClick={() => {
              setToggle(!toggle);
            }}
            src={FileIcon}
          />
        ) : (
          ""
        )}
        {/* {console.log(props.message)} */}
        <ReactMarkdown>{props.message.split("$^$Reference files$^$:\n")[0]}</ReactMarkdown>
      </div>
      <img className={styles.userImg} src={UserImage} />
      {toggle ? (
        <StaticFileAttachmentModal
          files={[files]}
          toggle={() => {
            setToggle(!toggle)
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
});

export default ChattingCardUser;
